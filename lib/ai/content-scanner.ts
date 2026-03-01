export type SupportedContentType = "video" | "audio" | "image" | "article"

export interface ScannedContentMetadata {
  title: string
  description: string
  contentType: SupportedContentType
  suggestedPriceXlm: string
  fileFormat: string
  fileSizeLabel: string
  previewUrl: string
  tags: string[]
  confidence: number
}

export interface ContentDescriptionInput {
  title: string
  contentType: SupportedContentType
  contentLink: string
  tags?: string[]
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ")
}

function deriveTitleFromName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "")
  const normalized = withoutExtension.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
  return toTitleCase(normalized || "Untitled Content")
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[index]}`
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00"
  const total = Math.round(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function detectContentType(file: File): SupportedContentType {
  if (file.type.startsWith("video/")) return "video"
  if (file.type.startsWith("audio/")) return "audio"
  if (file.type.startsWith("image/")) return "image"
  return "article"
}

function formatMimeOrExtension(file: File): string {
  if (file.type) return file.type
  const ext = file.name.split(".").pop()?.toLowerCase()
  return ext ? `application/${ext}` : "unknown"
}

function priceByType(contentType: SupportedContentType, durationSeconds?: number): string {
  if (contentType === "image") return "1.50"
  if (contentType === "article") return "1.00"
  if (contentType === "audio") {
    if (durationSeconds && durationSeconds > 600) return "3.00"
    return "2.00"
  }

  if (durationSeconds && durationSeconds > 900) return "5.00"
  if (durationSeconds && durationSeconds > 300) return "3.50"
  return "2.50"
}

function loadImageDimensions(previewUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => resolve({ width: 0, height: 0 })
    image.src = previewUrl
  })
}

function loadMediaMetadata(
  previewUrl: string,
  kind: "video" | "audio",
): Promise<{ duration: number; width?: number; height?: number }> {
  return new Promise((resolve) => {
    const media = document.createElement(kind)
    media.preload = "metadata"
    media.onloadedmetadata = () => {
      const base = { duration: Number.isFinite(media.duration) ? media.duration : 0 }
      if (kind === "video") {
        const video = media as HTMLVideoElement
        resolve({ ...base, width: video.videoWidth || 0, height: video.videoHeight || 0 })
      } else {
        resolve(base)
      }
    }
    media.onerror = () => resolve({ duration: 0 })
    media.src = previewUrl
  })
}

export async function scanContentFile(file: File): Promise<ScannedContentMetadata> {
  const previewUrl = URL.createObjectURL(file)
  const contentType = detectContentType(file)
  const baseTitle = deriveTitleFromName(file.name)
  const fileSizeLabel = formatBytes(file.size)
  const fileFormat = formatMimeOrExtension(file)

  let description = ""
  let suggestedPriceXlm = "2.00"
  const tags: string[] = ["on-chain", contentType]

  if (contentType === "image") {
    const dimensions = await loadImageDimensions(previewUrl)
    const resolutionLabel = dimensions.width > 0 ? `${dimensions.width}x${dimensions.height}` : "Unknown resolution"
    description = `AI scan detected an image asset (${resolutionLabel}). Optimized for premium visual content delivery on-chain.`
    suggestedPriceXlm = priceByType(contentType)
    tags.push("visual")
  } else if (contentType === "video") {
    const metadata = await loadMediaMetadata(previewUrl, "video")
    const resolutionLabel = metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : "Unknown resolution"
    description = `AI scan detected a video clip (${formatDuration(metadata.duration)}, ${resolutionLabel}). Ideal for premium creator access.`
    suggestedPriceXlm = priceByType(contentType, metadata.duration)
    tags.push("premium", "motion")
  } else if (contentType === "audio") {
    const metadata = await loadMediaMetadata(previewUrl, "audio")
    description = `AI scan detected an audio track (${formatDuration(metadata.duration)}). Great for subscriber-only audio releases.`
    suggestedPriceXlm = priceByType(contentType, metadata.duration)
    tags.push("sound")
  } else {
    description = "AI scan detected a document-like file. Suitable for tokenized article or downloadable premium content."
    suggestedPriceXlm = priceByType(contentType)
    tags.push("document")
  }

  return {
    title: baseTitle,
    description,
    contentType,
    suggestedPriceXlm,
    fileFormat,
    fileSizeLabel,
    previewUrl,
    tags,
    confidence: 0.93,
  }
}

export async function scanContentLink(link: string): Promise<ScannedContentMetadata> {
  const parsed = new URL(link)
  const path = parsed.pathname.toLowerCase()

  let contentType: SupportedContentType = "article"

  if (/(\.mp4|\.webm|\.mov|\.mkv)$/.test(path) || parsed.hostname.includes("youtube") || parsed.hostname.includes("vimeo")) {
    contentType = "video"
  } else if (/(\.mp3|\.wav|\.m4a|\.ogg)$/.test(path) || parsed.hostname.includes("soundcloud")) {
    contentType = "audio"
  } else if (/(\.png|\.jpg|\.jpeg|\.webp|\.gif)$/.test(path) || parsed.hostname.includes("imgur")) {
    contentType = "image"
  }

  const title = toTitleCase(
    (parsed.pathname.split("/").pop() || parsed.hostname)
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " "),
  )

  const description = describeContentDataDirectly({
    title: title || "On-chain Linked Content",
    contentType,
    contentLink: link,
    tags: ["on-chain", "link", contentType],
  })

  return {
    title: title || "On-chain Linked Content",
    description,
    contentType,
    suggestedPriceXlm: priceByType(contentType),
    fileFormat: parsed.protocol.replace(":", ""),
    fileSizeLabel: "Link source",
    previewUrl: link,
    tags: ["on-chain", "link", contentType],
    confidence: 0.9,
  }
}

export function describeContentDataDirectly(input: ContentDescriptionInput): string {
  let host = "external source"

  try {
    host = new URL(input.contentLink).hostname
  } catch {
    host = "external source"
  }

  const tagText = input.tags && input.tags.length > 0 ? ` Tags: ${input.tags.join(", ")}.` : ""

  if (input.contentType === "video") {
    return `${input.title} is a premium video resource from ${host}. This on-chain listing is optimized for paid access, subscriptions, and creator monetization.${tagText}`
  }

  if (input.contentType === "audio") {
    return `${input.title} is an audio release hosted on ${host}. It is prepared for tokenized listening access through on-chain payments and subscriber unlocks.${tagText}`
  }

  if (input.contentType === "image") {
    return `${input.title} is a visual content asset sourced from ${host}. It is published for premium viewing access with on-chain purchase and subscriber permissions.${tagText}`
  }

  return `${input.title} is a link-based digital resource from ${host}. It is published on-chain for controlled premium access via purchases or active subscriptions.${tagText}`
}

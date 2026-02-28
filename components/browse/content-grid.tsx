"use client"

import { useEffect, useState } from "react"
import { ContentCard } from "./content-card"
import type { Clip } from "@/lib/types"
import { contentService, type ContentMetadata } from "@/lib/services/content-service"

export function ContentGrid() {
  const MAX_CONTENT_PROBE = 30
  const [content, setContent] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setError(null)
        const probeIds = Array.from({ length: MAX_CONTENT_PROBE }, (_, index) => index + 1)
        const results = await Promise.allSettled(probeIds.map((id) => contentService.getContent(id)))

        const records = results
          .filter((result): result is PromiseFulfilledResult<ContentMetadata | null> => result.status === "fulfilled")
          .map((result) => result.value)

        const normalized = records
          .filter((item): item is ContentMetadata => item !== null)
          .map((item) => ({
            id: String(item.contentId),
            creatorId: item.creator,
            title: `Content #${item.contentId}`,
            description: "On-chain content",
            contentType: (item.contentType as Clip["contentType"]) || "video",
            ipfsHash: item.metadataUri,
            thumbnailUrl: "/placeholder.svg?height=400&width=600&query=video content",
            priceXlm: Number(item.price) / 10_000_000,
            durationSeconds: 0,
            viewCount: 0,
            purchaseCount: 0,
            isPublished: true,
            createdAt: new Date(item.createdAt * 1000),
            updatedAt: new Date(item.createdAt * 1000),
          }))

        setContent(normalized)
      } catch {
        setError("Failed to load on-chain content")
      } finally {
        setLoading(false)
      }
    }

    void loadContent()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  if (content.length === 0) {
    return <div className="text-sm text-muted-foreground">No on-chain content found yet.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((clip) => (
        <ContentCard key={clip.id} content={clip} />
      ))}
    </div>
  )
}

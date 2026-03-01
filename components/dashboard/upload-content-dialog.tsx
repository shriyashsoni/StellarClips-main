"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Link as LinkIcon } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { contentService } from "@/lib/services/content-service"
import { useToast } from "@/hooks/use-toast"
import { getContractHealth } from "@/lib/contract-health"
import { describeContentDataDirectly, scanContentLink, type ScannedContentMetadata } from "@/lib/ai/content-scanner"
import { Checkbox } from "@/components/ui/checkbox"
import { encryptContentLink } from "@/lib/security/content-encryption"
import { formatXLM } from "@/lib/stellar-utils"

interface UploadContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadContentDialog({ open, onOpenChange }: UploadContentDialogProps) {
  const { isConnected, publicKey } = useWallet()
  const contractHealth = getContractHealth()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [scanResult, setScanResult] = useState<ScannedContentMetadata | null>(null)
  const [encryptLink, setEncryptLink] = useState(false)
  const [accessKey, setAccessKey] = useState("")
  const [publishedSecret, setPublishedSecret] = useState<{ contentId: number; key: string } | null>(null)
  const [uploadFeeXlm, setUploadFeeXlm] = useState<number>(10)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "video",
    price: "",
    contentLink: "",
    thumbnailLink: "",
  })

  const contentPriceXlm = Number.parseFloat(formData.price || "0") || 0
  const uploadChargeXlm = uploadFeeXlm

  const isValidContentLink = (value: string): boolean => {
    const trimmed = value.trim()
    return /^(https?:\/\/|ipfs:\/\/|ar:\/\/)/i.test(trimmed)
  }

  const loadUploadFee = async () => {
    const fee = await contentService.getUploadFeeXlm()
    if (Number.isFinite(fee) && fee > 0) {
      setUploadFeeXlm(fee)
    }
  }

  useEffect(() => {
    void loadUploadFee()
  }, [])

  const handleLinkScan = async (contentLink: string) => {
    setFormData((prev) => ({ ...prev, contentLink }))

    if (!contentLink) {
      setScanResult(null)
      return
    }

    setIsScanning(true)
    try {
      const scanned = await scanContentLink(contentLink)
      setScanResult(scanned)
      setFormData((prev) => ({
        ...prev,
        contentLink,
        title: scanned.title,
        description: scanned.description,
        contentType: scanned.contentType,
        price: scanned.suggestedPriceXlm,
        thumbnailLink: scanned.contentType === "image" ? scanned.previewUrl : prev.thumbnailLink,
      }))
      toast({
        title: "AI scan completed",
        description: "Content link analyzed and form autofilled.",
      })
    } catch (error) {
      console.error("AI scan failed:", error)
      toast({
        title: "AI scan failed",
        description: "Could not auto-fill this file. You can still fill manually.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to upload content",
        variant: "destructive",
      })
      return
    }

    if (!contractHealth.isReady) {
      toast({
        title: "Contracts not configured",
        description: `Missing: ${contractHealth.missingKeys.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    if (!formData.contentLink) {
      toast({
        title: "Missing content link",
        description: "Please add a content URL before publishing",
        variant: "destructive",
      })
      return
    }

    if (!isValidContentLink(formData.contentLink)) {
      toast({
        title: "Invalid content link",
        description: "Use a valid https://, ipfs://, or ar:// link",
        variant: "destructive",
      })
      return
    }

    if (encryptLink && !accessKey.trim()) {
      toast({
        title: "Missing encryption key",
        description: "Enter an access key to encrypt this content link",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      let metadataUri = formData.contentLink.trim()

      if (encryptLink) {
        setIsEncrypting(true)
        metadataUri = await encryptContentLink(metadataUri, accessKey)
        setIsEncrypting(false)
      }

      // Convert XLM to stroops (1 XLM = 10,000,000 stroops)
      const priceInStroops = Math.round(Number.parseFloat(formData.price) * 10_000_000).toString()

      // Mint content NFT
      const contentId = await contentService.mintContent(publicKey, metadataUri, priceInStroops, formData.contentType)

      toast({
        title: "Content uploaded successfully",
        description: `Content ID: ${contentId}`,
      })

      if (encryptLink) {
        const keySnapshot = accessKey
        setPublishedSecret({ contentId, key: keySnapshot })
        toast({
          title: "Save your access key",
          description: "Encrypted content published. Copy and store this key safely before closing.",
        })
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        contentType: "video",
        price: "",
        contentLink: "",
        thumbnailLink: "",
      })
      setScanResult(null)
      setEncryptLink(false)
      setAccessKey("")

      if (!encryptLink) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload content",
        variant: "destructive",
      })
    } finally {
      setIsEncrypting(false)
      setIsUploading(false)
    }
  }

  const applyDirectAiDescription = () => {
    if (!formData.contentLink) {
      toast({
        title: "Add content link first",
        description: "AI description needs a link source.",
        variant: "destructive",
      })
      return
    }

    const description = describeContentDataDirectly({
      title: formData.title || "On-chain Linked Content",
      contentType: formData.contentType as "video" | "audio" | "image" | "article",
      contentLink: formData.contentLink,
      tags: scanResult?.tags,
    })

    setFormData((prev) => ({ ...prev, description }))
    toast({
      title: "AI description updated",
      description: "Description was generated directly from your content data.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
          <DialogDescription>Upload your content and set a price for access</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {publishedSecret && (
            <div className="space-y-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
              <p className="text-sm font-semibold">Encrypted content published (ID: {publishedSecret.contentId})</p>
              <p className="text-xs text-muted-foreground">Store this access key now. If lost, buyers cannot decrypt the resource.</p>
              <div className="rounded-md bg-background border px-3 py-2 text-sm font-mono break-all">{publishedSecret.key}</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(publishedSecret.key)
                    toast({ title: "Access key copied" })
                  }}
                >
                  Copy Access Key
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setPublishedSecret(null)
                    onOpenChange(false)
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">AI Content Scanner</p>
                <p className="text-xs text-muted-foreground">Confidence: {Math.round(scanResult.confidence * 100)}%</p>
              </div>

              <div className="rounded-md overflow-hidden border bg-background">
                {scanResult.contentType === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={scanResult.previewUrl} alt="Content preview" className="w-full max-h-64 object-contain" />
                )}
                {scanResult.contentType === "video" && (
                  <video src={scanResult.previewUrl} controls className="w-full max-h-64 object-contain" />
                )}
                {scanResult.contentType === "audio" && (
                  <div className="p-4">
                    <audio src={scanResult.previewUrl} controls className="w-full" />
                  </div>
                )}
                {scanResult.contentType === "article" && (
                  <div className="p-4 text-sm text-muted-foreground">Preview unavailable for this file type.</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <p>Format: {scanResult.fileFormat}</p>
                <p>Size: {scanResult.fileSizeLabel}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content-link">Content Link (URL)</Label>
            <div className="flex gap-2">
              <Input
                id="content-link"
                type="text"
                placeholder="https://... or ipfs://..."
                value={formData.contentLink}
                onChange={(e) => setFormData((prev) => ({ ...prev, contentLink: e.target.value }))}
                required
              />
              <Button type="button" variant="outline" onClick={() => void handleLinkScan(formData.contentLink)} disabled={isScanning || !formData.contentLink}>
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                Scan
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Publishing is link-based only. Local file upload is disabled.</p>
            <p className="text-xs text-primary">On-chain upload fee: {uploadFeeXlm} XLM per content post</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail-link">Thumbnail Link (optional)</Label>
            <Input
              id="thumbnail-link"
              type="url"
              placeholder="https://..."
              value={formData.thumbnailLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, thumbnailLink: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter content title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your content"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={applyDirectAiDescription}>
                AI Describe Data
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Checkbox id="encrypt-link" checked={encryptLink} onCheckedChange={(checked) => setEncryptLink(checked === true)} />
              <Label htmlFor="encrypt-link">Encrypt resource link before writing on-chain</Label>
            </div>
            {encryptLink && (
              <div className="space-y-2">
                <Label htmlFor="access-key">Access Key</Label>
                <Input
                  id="access-key"
                  type="password"
                  placeholder="Enter private key for authorized users"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  required={encryptLink}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!accessKey}
                    onClick={() => {
                      navigator.clipboard.writeText(accessKey)
                      toast({ title: "Access key copied" })
                    }}
                  >
                    Copy Key
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this key only with buyers/subscribers. Without it, encrypted links cannot be opened.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value })}
              >
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (XLM)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
            <p className="text-sm font-semibold">On-chain transaction breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Buyer content price</span>
                <span>{formatXLM(contentPriceXlm)} XLM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Creator upload fee</span>
                <span>{formatXLM(uploadChargeXlm)} XLM</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between font-medium">
                <span>Charge now (when posting)</span>
                <span>{formatXLM(uploadChargeXlm)} XLM</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Posting content charges the creator upload fee immediately on-chain. Buyer price is charged later when someone purchases.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || isScanning || !isConnected || !contractHealth.isReady}
              title={!contractHealth.isReady ? `Missing: ${contractHealth.missingKeys.join(", ")}` : undefined}
            >
              {isUploading || isEncrypting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEncrypting ? "Encrypting..." : "Uploading..."}
                </>
              ) : isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI Scanning...
                </>
              ) : (
                "Upload Content"
              )}
            </Button>
          </div>
          {!contractHealth.isReady && (
            <p className="text-xs text-destructive">Smart contract config missing: {contractHealth.missingKeys.join(", ")}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

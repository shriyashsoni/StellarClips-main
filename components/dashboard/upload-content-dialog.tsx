"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { contentService } from "@/lib/services/content-service"
import { useToast } from "@/hooks/use-toast"
import { getContractHealth } from "@/lib/contract-health"
import { scanContentFile, type ScannedContentMetadata } from "@/lib/ai/content-scanner"

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
  const [scanResult, setScanResult] = useState<ScannedContentMetadata | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "video",
    price: "",
    file: null as File | null,
  })

  const handleFileSelected = async (file: File | null) => {
    setFormData({ ...formData, file })

    if (!file) {
      setScanResult(null)
      return
    }

    setIsScanning(true)
    try {
      const scanned = await scanContentFile(file)
      setScanResult(scanned)
      setFormData((prev) => ({
        ...prev,
        file,
        title: scanned.title,
        description: scanned.description,
        contentType: scanned.contentType,
        price: scanned.suggestedPriceXlm,
      }))
      toast({
        title: "AI scan completed",
        description: "Content preview generated and form autofilled.",
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

    if (!formData.file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real implementation, upload file to IPFS or storage service
      const metadataUri = `ipfs://placeholder/${formData.file.name}`

      // Convert XLM to stroops (1 XLM = 10,000,000 stroops)
      const priceInStroops = Math.round(Number.parseFloat(formData.price) * 10_000_000).toString()

      // Mint content NFT
      const contentId = await contentService.mintContent(publicKey, metadataUri, priceInStroops, formData.contentType)

      toast({
        title: "Content uploaded successfully",
        description: `Content ID: ${contentId}`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        contentType: "video",
        price: "",
        file: null,
      })
      setScanResult(null)

      onOpenChange(false)
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload content",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
          <DialogDescription>Upload your content and set a price for access</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Input
                id="file"
                type="file"
                className="hidden"
                onChange={(e) => {
                  void handleFileSelected(e.target.files?.[0] || null)
                }}
                accept="video/*,audio/*,image/*"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Video, audio, or image files</p>
                {isScanning && <p className="text-xs text-primary mt-2">AI is scanning file and autofilling form...</p>}
              </label>
            </div>
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
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
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

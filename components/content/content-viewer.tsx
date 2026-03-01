"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink, Lock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentDialog } from "./payment-dialog"
import { useWallet } from "@/hooks/use-wallet"
import type { Clip } from "@/lib/types"
import { contentService } from "@/lib/services/content-service"
import { accessService } from "@/lib/services/access-service"
import { decryptContentLink, isEncryptedContentUri } from "@/lib/security/content-encryption"

interface ContentViewerProps {
  contentId: string
}

export function ContentViewer({ contentId }: ContentViewerProps) {
  const { publicKey } = useWallet()
  const [content, setContent] = useState<Clip | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accessKey, setAccessKey] = useState("")
  const [decryptedLink, setDecryptedLink] = useState<string | null>(null)
  const [decryptError, setDecryptError] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      const id = Number(contentId)

      if (Number.isNaN(id)) {
        setLoading(false)
        return
      }

      try {
        const onChain = await contentService.getContent(id)

        if (onChain) {
          const mapped: Clip = {
            id: String(onChain.contentId),
            creatorId: onChain.creator,
            title: `Content #${onChain.contentId}`,
            description: "On-chain content",
            contentType: (onChain.contentType as Clip["contentType"]) || "video",
            ipfsHash: onChain.metadataUri,
            thumbnailUrl: "/placeholder.svg?height=400&width=600&query=video content",
            priceXlm: Number(onChain.price) / 10_000_000,
            durationSeconds: 0,
            viewCount: 0,
            purchaseCount: 0,
            isPublished: true,
            createdAt: new Date(onChain.createdAt * 1000),
            updatedAt: new Date(onChain.createdAt * 1000),
          }
          setContent(mapped)
          setDecryptedLink(null)
          setDecryptError(null)
          setAccessKey("")

          if (publicKey) {
            const allowed = await accessService.canAccessContent(publicKey, onChain.creator, onChain.contentId)
            setHasAccess(allowed)
          } else {
            setHasAccess(false)
          }
        } else {
          setContent(null)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadContent()
  }, [contentId, publicKey])

  if (loading || !content) {
    return <div>Loading...</div>
  }

  const encrypted = !!content.ipfsHash && isEncryptedContentUri(content.ipfsHash)
  const resolvedLink = encrypted ? decryptedLink : content.ipfsHash

  const handleDecrypt = async () => {
    if (!content.ipfsHash) return

    setIsDecrypting(true)
    setDecryptError(null)

    try {
      const plain = await decryptContentLink(content.ipfsHash, accessKey)
      setDecryptedLink(plain)
    } catch (error) {
      setDecryptError(error instanceof Error ? error.message : "Failed to decrypt content")
    } finally {
      setIsDecrypting(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            {hasAccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white p-6">
                <p className="text-center font-medium">Unlocked resource</p>
                {encrypted && !decryptedLink && (
                  <div className="w-full max-w-md space-y-3">
                    <div className="space-y-2 text-left">
                      <Label htmlFor="content-access-key" className="text-white">Access Key Required</Label>
                      <Input
                        id="content-access-key"
                        type="password"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        placeholder="Enter content access key"
                      />
                    </div>
                    {decryptError && <p className="text-xs text-red-300">{decryptError}</p>}
                    <Button size="lg" onClick={() => void handleDecrypt()} disabled={isDecrypting || !accessKey}>
                      {isDecrypting ? "Decrypting..." : "Decrypt Content Link"}
                    </Button>
                  </div>
                )}

                {resolvedLink && (
                  <>
                    <a href={resolvedLink} target="_blank" rel="noopener noreferrer">
                      <Button size="lg">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Content Link
                      </Button>
                    </a>
                    <a href={resolvedLink} target="_blank" rel="noopener noreferrer" className="text-xs underline break-all text-center">
                      {resolvedLink}
                    </a>
                  </>
                )}
              </div>
            ) : (
              <>
                <Image
                  src={content.thumbnailUrl || "/placeholder.svg"}
                  alt={content.title}
                  fill
                  className="object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <Lock className="h-16 w-16 mx-auto text-white/80" />
                    <div className="space-y-2">
                      <p className="text-white text-lg font-medium">This content is locked</p>
                      <p className="text-white/80">Purchase or subscribe to unlock this content link</p>
                    </div>
                    <Button size="lg" onClick={() => setShowPayment(true)} className="bg-primary hover:bg-primary/90">
                      Unlock for {content.priceXlm} XLM
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{content.description}</p>
        </div>
      </div>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        content={content}
        onSuccess={() => {
          setHasAccess(true)
          setShowPayment(false)
        }}
      />
    </>
  )
}

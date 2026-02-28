"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Lock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PaymentDialog } from "./payment-dialog"
import { useWallet } from "@/hooks/use-wallet"
import type { Clip } from "@/lib/types"
import { contentService } from "@/lib/services/content-service"

interface ContentViewerProps {
  contentId: string
}

export function ContentViewer({ contentId }: ContentViewerProps) {
  const { publicKey } = useWallet()
  const [content, setContent] = useState<Clip | null>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(true)

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

  return (
    <>
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            {hasPurchased ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full h-16 w-16">
                  <Play className="h-8 w-8" />
                </Button>
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
                      <p className="text-white/80">Purchase to unlock and watch</p>
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
          setHasPurchased(true)
          setShowPayment(false)
        }}
      />
    </>
  )
}

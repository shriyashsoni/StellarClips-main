"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWallet } from "@/hooks/use-wallet"
import { contentService, type ContentMetadata } from "@/lib/services/content-service"
import { formatXLM } from "@/lib/stellar-utils"

interface CreatorContentItem {
  id: number
  title: string
  type: string
  priceXlm: number
  views: number
}

export function ContentList() {
  const { publicKey } = useWallet()
  const [contents, setContents] = useState<CreatorContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContents = async () => {
      setLoading(true)
      setError(null)

      if (!publicKey) {
        setContents([])
        setLoading(false)
        return
      }

      try {
        const ids = await contentService.getCreatorContents(publicKey)
        const results = await Promise.allSettled(ids.map((id) => contentService.getContent(id)))
        const records = results
          .filter((result): result is PromiseFulfilledResult<ContentMetadata | null> => result.status === "fulfilled")
          .map((result) => result.value)

        const normalized = records
          .filter((item): item is ContentMetadata => item !== null)
          .map((item) => ({
            id: item.contentId,
            title: `Content #${item.contentId}`,
            type: item.contentType,
            priceXlm: Number(item.price) / 10_000_000,
            views: 0,
          }))

        setContents(normalized)
      } catch {
        setError("Failed to load creator content")
      } finally {
        setLoading(false)
      }
    }

    void loadContents()
  }, [publicKey])

  if (loading) {
    return <Card className="p-12 text-center text-muted-foreground">Loading on-chain content...</Card>
  }

  if (error) {
    return <Card className="p-12 text-center text-destructive">{error}</Card>
  }

  if (contents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No content yet. Upload your first piece of content to get started.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {contents.map((content) => (
        <Card key={content.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg" />
              <div>
                <h3 className="font-semibold">{content.title}</h3>
                <p className="text-sm text-muted-foreground">{content.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{formatXLM(content.priceXlm)} XLM</p>
                <p className="text-sm text-muted-foreground">{content.views} views</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

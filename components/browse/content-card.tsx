"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatXLM, formatDuration } from "@/lib/stellar-utils"
import type { Clip } from "@/lib/types"

interface ContentCardProps {
  content: Clip
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/content/${content.id}`}>
      <Card className="overflow-hidden border-2 border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-card">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={content.thumbnailUrl || "/placeholder.svg?height=400&width=600&query=video content"}
            alt={content.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-5 border-t-2 border-border/50">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{content.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <span>{formatXLM(content.priceXlm)} XLM</span>
            </div>
            {content.durationSeconds && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDuration(content.durationSeconds)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/30 mt-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary via-accent to-muted border-2 border-border" />
            <span className="text-sm font-semibold">Creator Name</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

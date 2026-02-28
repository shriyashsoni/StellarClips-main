"use client"

import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PurchasesTab() {
  // TODO: Fetch actual purchases
  const purchases = [
    {
      id: "1",
      title: "Advanced React Patterns",
      thumbnail: "/react-code-snippet.png",
      purchaseDate: "2 days ago",
      price: "5.00",
    },
    {
      id: "2",
      title: "Blockchain Fundamentals",
      thumbnail: "/interconnected-blocks.png",
      purchaseDate: "1 week ago",
      price: "8.50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="overflow-hidden group">
          <div className="relative aspect-video">
            <Image src={purchase.thumbnail || "/placeholder.svg"} alt={purchase.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="lg" className="rounded-full" asChild>
                <Link href={`/content/${purchase.id}`}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </Link>
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-1">{purchase.title}</h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{purchase.purchaseDate}</span>
              <span>{purchase.price} XLM</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

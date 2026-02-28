"use client"

import { useEffect, useState } from "react"
import { ContentCard } from "./content-card"
import type { Clip } from "@/lib/types"

export function ContentGrid() {
  const [content, setContent] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from API
    const mockContent: Clip[] = [
      {
        id: "1",
        creator_id: "creator1",
        title: "Advanced React Patterns",
        description: "Learn advanced React patterns including render props, HOCs, and compound components.",
        content_type: "video",
        content_uri: "ipfs://QmExample1",
        thumbnail_uri: "/react-code-tutorial.jpg",
        price_xlm: "5.00",
        duration_seconds: 1800,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        creator_id: "creator2",
        title: "Blockchain Fundamentals",
        description: "Understanding blockchain technology from the ground up.",
        content_type: "video",
        content_uri: "ipfs://QmExample2",
        thumbnail_uri: "/blockchain-network.png",
        price_xlm: "8.50",
        duration_seconds: 2400,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        creator_id: "creator3",
        title: "UI/UX Design Masterclass",
        description: "Create beautiful and functional user interfaces.",
        content_type: "video",
        content_uri: "ipfs://QmExample3",
        thumbnail_uri: "/ui-design-mockup.png",
        price_xlm: "12.00",
        duration_seconds: 3600,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    setTimeout(() => {
      setContent(mockContent)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((clip) => (
        <ContentCard key={clip.id} content={clip} />
      ))}
    </div>
  )
}

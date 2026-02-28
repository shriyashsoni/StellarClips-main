"use client"

import { useState } from "react"
import { Heart, Share2, Flag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TipDialog } from "./tip-dialog"
import { SubscribeDialog } from "./subscribe-dialog"

interface ContentSidebarProps {
  contentId: string
}

export function ContentSidebar({ contentId }: ContentSidebarProps) {
  const [showTip, setShowTip] = useState(false)
  const [showSubscribe, setShowSubscribe] = useState(false)

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Creator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Creator Name</p>
                <p className="text-sm text-muted-foreground">1.2K subscribers</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => setShowSubscribe(true)}>
                Subscribe
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowTip(true)}>
                <Heart className="mr-2 h-4 w-4" />
                Send Tip
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Published</span>
                <span>2 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views</span>
                <span>1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>Tutorial</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Flag className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>

      <TipDialog open={showTip} onOpenChange={setShowTip} creatorId="creator1" creatorName="Creator Name" />

      <SubscribeDialog
        open={showSubscribe}
        onOpenChange={setShowSubscribe}
        creatorId="creator1"
        creatorName="Creator Name"
      />
    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UploadContentDialog } from "./upload-content-dialog"
import { ContentList } from "./content-list"

export function ContentTab() {
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Content</h2>
          <p className="text-muted-foreground">Upload and manage your content library</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <ContentList />

      <UploadContentDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
    </div>
  )
}

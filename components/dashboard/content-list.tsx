"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ContentList() {
  // This would fetch from the database in a real implementation
  const contents = []

  if (contents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No content yet. Upload your first piece of content to get started.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {contents.map((content: any) => (
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
                <p className="font-semibold">{content.price} XLM</p>
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

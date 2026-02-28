import { Suspense } from "react"
import { ContentViewer } from "@/components/content/content-viewer"
import { ContentSidebar } from "@/components/content/content-sidebar"

export default function ContentPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<ViewerSkeleton />}>
              <ContentViewer contentId={params.id} />
            </Suspense>
          </div>
          <aside>
            <Suspense fallback={<SidebarSkeleton />}>
              <ContentSidebar contentId={params.id} />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  )
}

function ViewerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg animate-pulse" />
      <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-muted rounded w-full animate-pulse" />
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 bg-muted rounded-lg animate-pulse" />
      <div className="h-48 bg-muted rounded-lg animate-pulse" />
    </div>
  )
}

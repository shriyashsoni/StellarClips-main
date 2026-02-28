import { Suspense } from "react"
import { BrowseHeader } from "@/components/browse/browse-header"
import { ContentGrid } from "@/components/browse/content-grid"
import { FilterSidebar } from "@/components/browse/filter-sidebar"

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-background">
      <BrowseHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>
          <main className="flex-1">
            <Suspense fallback={<ContentGridSkeleton />}>
              <ContentGrid />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

function ContentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
          <div className="aspect-video bg-muted rounded-md mb-4" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

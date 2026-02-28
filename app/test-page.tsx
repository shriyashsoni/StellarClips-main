export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">CSS Test Page</h1>

        <div className="border-2 border-border rounded-lg p-6 hover:border-primary/30 transition-colors bg-card">
          <p>This card has proper hover effects with correct spacing</p>
        </div>

        <div className="border-2 border-border rounded-lg p-6 hover:shadow-xl transition-shadow bg-card">
          <p>This card has shadow hover effects</p>
        </div>

        <div className="border-2 border-border rounded-lg p-6 hover:scale-105 transition-transform bg-card">
          <p>This card has scale hover effects</p>
        </div>
      </div>
    </div>
  )
}

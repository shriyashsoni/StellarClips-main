"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 100])

  return (
    <div className="space-y-6 sticky top-24 border-2 border-border rounded-lg p-6 bg-card">
      <div>
        <h3 className="font-semibold text-lg mb-4 pb-2 border-b-2 border-border">Categories</h3>
        <div className="space-y-3">
          {["Video", "Audio", "Article", "Tutorial", "Course"].map((category) => (
            <div key={category} className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded transition-colors">
              <Checkbox id={category} />
              <Label htmlFor={category} className="cursor-pointer flex-1">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="font-semibold text-lg mb-4 pb-2 border-b-2 border-border">Price Range (XLM)</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={1} className="mb-4" />
        <div className="flex justify-between text-sm font-medium border-t border-border pt-3">
          <span className="px-3 py-1 bg-muted rounded-md">{priceRange[0]} XLM</span>
          <span className="px-3 py-1 bg-muted rounded-md">{priceRange[1]} XLM</span>
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="font-semibold text-lg mb-4 pb-2 border-b-2 border-border">Duration</h3>
        <div className="space-y-3">
          {["Under 5 min", "5-15 min", "15-30 min", "Over 30 min"].map((duration) => (
            <div key={duration} className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded transition-colors">
              <Checkbox id={duration} />
              <Label htmlFor={duration} className="cursor-pointer flex-1">
                {duration}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      <Button variant="outline" className="w-full bg-transparent border-2 hover:bg-accent/10 hover:border-primary/30">
        Reset Filters
      </Button>
    </div>
  )
}

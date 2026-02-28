"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { subscriptionService } from "@/lib/services/subscription-service"
import { useToast } from "@/hooks/use-toast"

interface CreateTierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTierDialog({ open, onOpenChange }: CreateTierDialogProps) {
  const { isConnected } = useWallet()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "30",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a tier",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      const priceInStroops = (Number.parseFloat(formData.price) * 10000000).toString()
      const durationDays = Number.parseInt(formData.duration)

      const tierId = await subscriptionService.createTier(formData.name, priceInStroops, durationDays)

      toast({
        title: "Tier created successfully",
        description: `Tier ID: ${tierId}`,
      })

      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "30",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create tier:", error)
      toast({
        title: "Failed to create tier",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Subscription Tier</DialogTitle>
          <DialogDescription>Set up a new subscription tier for your content</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tier Name</Label>
            <Input
              id="name"
              placeholder="e.g., Premium Access"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What subscribers get with this tier"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (XLM)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Monthly (30 days)</SelectItem>
                  <SelectItem value="90">Quarterly (90 days)</SelectItem>
                  <SelectItem value="365">Yearly (365 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !isConnected}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Tier"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

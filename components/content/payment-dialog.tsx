"use client"

import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { paymentService } from "@/lib/services/payment-service"
import { formatXLM } from "@/lib/stellar-utils"
import type { Clip } from "@/lib/types"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: Clip
  onSuccess: () => void
}

export function PaymentDialog({ open, onOpenChange, content, onSuccess }: PaymentDialogProps) {
  const { publicKey, isConnected } = useWallet()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contentPrice = content.priceXlm
  const platformFee = contentPrice * 0.05
  const total = contentPrice

  const handlePurchase = async () => {
    if (!isConnected || !publicKey) {
      setError("Please connect your wallet first")
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const amountInStroops = paymentService.xlmToStroops(contentPrice.toString())
      await paymentService.payForContent(publicKey, content.creatorId, amountInStroops, Number(content.id))

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Content</DialogTitle>
          <DialogDescription>Complete your purchase to unlock this content</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Purchase Successful!</h3>
              <p className="text-sm text-muted-foreground">You can now access this content</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Content Price</span>
                <span className="font-medium">{formatXLM(contentPrice)} XLM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
                <span className="font-medium">{formatXLM(platformFee)} XLM</span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatXLM(total)} XLM</span>
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePurchase} disabled={processing || !isConnected} className="flex-1">
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/hooks/use-wallet"
import { paymentService } from "@/lib/services/payment-service"

interface TipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creatorId: string
  creatorName: string
}

const PRESET_AMOUNTS = ["1", "5", "10", "25"]

export function TipDialog({ open, onOpenChange, creatorId, creatorName }: TipDialogProps) {
  const { publicKey, isConnected } = useWallet()
  const [amount, setAmount] = useState("")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendTip = async () => {
    if (!isConnected || !publicKey) {
      setError("Please connect your wallet first")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const amountInStroops = paymentService.xlmToStroops(amount)
      await paymentService.sendTip(publicKey, creatorId, amountInStroops)

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setAmount("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send tip")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send a Tip</DialogTitle>
          <DialogDescription>Support {creatorName} with a tip</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Tip Sent!</h3>
              <p className="text-sm text-muted-foreground">Thank you for supporting this creator</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset ? "default" : "outline"}
                    onClick={() => setAmount(preset)}
                    className="h-12"
                  >
                    {preset} XLM
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount (XLM)</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendTip} disabled={processing || !isConnected || !amount} className="flex-1">
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Tip"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

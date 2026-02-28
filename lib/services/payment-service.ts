"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"

const PAYMENT_CONTRACT = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT!

export interface PaymentRecord {
  paymentId: number
  payer: string
  recipient: string
  amount: string
  platformFee: string
  paymentType: string
  contentId?: number
  timestamp: number
}

export class PaymentService {
  async payForContent(payerAddress: string, creatorAddress: string, amount: string, contentId: number): Promise<number> {
    try {
      const params = [
        nativeToScVal(payerAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
        nativeToScVal(BigInt(amount), { type: "i128" }),
        nativeToScVal(contentId, { type: "u64" }),
      ]

      const result = await sorobanClient.invokeContract(PAYMENT_CONTRACT, "pay_for_content", params)

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to pay for content:", error)
      throw error
    }
  }

  async sendTip(tipperAddress: string, creatorAddress: string, amount: string): Promise<number> {
    try {
      const params = [
        nativeToScVal(tipperAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
        nativeToScVal(BigInt(amount), { type: "i128" }),
      ]

      const result = await sorobanClient.invokeContract(PAYMENT_CONTRACT, "send_tip", params)

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to send tip:", error)
      throw error
    }
  }

  async getPayment(paymentId: number): Promise<PaymentRecord | null> {
    try {
      const params = [nativeToScVal(paymentId, { type: "u64" })]

      const result = await sorobanClient.readContract(PAYMENT_CONTRACT, "get_payment", params)

      if (!result) return null

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to get payment:", error)
      return null
    }
  }

  calculatePlatformFee(amount: string): string {
    const amountBigInt = BigInt(amount)
    const fee = (amountBigInt * BigInt(500)) / BigInt(10000) // 5%
    return fee.toString()
  }

  calculateCreatorAmount(amount: string): string {
    const amountBigInt = BigInt(amount)
    const fee = this.calculatePlatformFee(amount)
    const creatorAmount = amountBigInt - BigInt(fee)
    return creatorAmount.toString()
  }

  xlmToStroops(amountXlm: string): string {
    return Math.round(Number.parseFloat(amountXlm) * 10_000_000).toString()
  }
}

export const paymentService = new PaymentService()

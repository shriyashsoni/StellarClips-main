"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"

const REVENUE_CONTRACT = process.env.NEXT_PUBLIC_REVENUE_CONTRACT!

export interface CreatorBalance {
  creator: string
  availableBalance: string
  totalEarned: string
  totalWithdrawn: string
  lastWithdrawal: number
}

export class RevenueService {
  async withdraw(amount: string): Promise<void> {
    try {
      const params = [nativeToScVal(BigInt(amount), { type: "i128" })]

      await sorobanClient.invokeContract(REVENUE_CONTRACT, "withdraw", params)
    } catch (error) {
      console.error("Failed to withdraw:", error)
      throw error
    }
  }

  async getBalance(creatorAddress: string): Promise<CreatorBalance | null> {
    try {
      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      const result = await sorobanClient.readContract(REVENUE_CONTRACT, "get_balance", params)

      if (!result) return null

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to get balance:", error)
      return null
    }
  }

  async getAvailableBalance(creatorAddress: string): Promise<string> {
    try {
      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      const result = await sorobanClient.readContract(REVENUE_CONTRACT, "get_available_balance", params)

      return scValToNative(result) || "0"
    } catch (error) {
      console.error("Failed to get available balance:", error)
      return "0"
    }
  }

  formatBalance(stroops: string): string {
    const amount = BigInt(stroops) / BigInt(10000000) // Convert from stroops to XLM
    return amount.toString()
  }

  parseBalance(xlm: string): string {
    const amount = BigInt(xlm) * BigInt(10000000) // Convert from XLM to stroops
    return amount.toString()
  }
}

export const revenueService = new RevenueService()

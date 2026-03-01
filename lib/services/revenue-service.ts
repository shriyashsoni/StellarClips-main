"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"
import { normalizeCreatorBalance, toStringValue } from "./contract-response"

const REVENUE_CONTRACT = process.env.NEXT_PUBLIC_REVENUE_CONTRACT!

function assertContractAddress(contractAddress: string, envName: string) {
  if (!contractAddress) {
    throw new Error(`${envName} is not configured`)
  }
}

export interface CreatorBalance {
  creator: string
  availableBalance: string
  totalEarned: string
  totalWithdrawn: string
  lastWithdrawal: number
}

export class RevenueService {
  async recordEarning(creatorAddress: string, amount: string): Promise<void> {
    try {
      assertContractAddress(REVENUE_CONTRACT, "NEXT_PUBLIC_REVENUE_CONTRACT")

      const params = [nativeToScVal(creatorAddress, { type: "address" }), nativeToScVal(BigInt(amount), { type: "i128" })]

      await sorobanClient.invokeContract(REVENUE_CONTRACT, "record_earning", params)
    } catch (error) {
      console.error("Failed to record earning:", error)
      throw error
    }
  }

  async withdraw(creatorAddress: string, amount: string): Promise<void> {
    try {
      assertContractAddress(REVENUE_CONTRACT, "NEXT_PUBLIC_REVENUE_CONTRACT")

      const params = [nativeToScVal(creatorAddress, { type: "address" }), nativeToScVal(BigInt(amount), { type: "i128" })]

      await sorobanClient.invokeContract(REVENUE_CONTRACT, "withdraw", params)
    } catch (error) {
      console.error("Failed to withdraw:", error)
      throw error
    }
  }

  async getBalance(creatorAddress: string): Promise<CreatorBalance | null> {
    try {
      assertContractAddress(REVENUE_CONTRACT, "NEXT_PUBLIC_REVENUE_CONTRACT")

      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      const result = await sorobanClient.readContract(REVENUE_CONTRACT, "get_balance", params)

      if (!result) return null

      return normalizeCreatorBalance(scValToNative(result))
    } catch (error) {
      console.error("Failed to get balance:", error)
      return null
    }
  }

  async getAvailableBalance(creatorAddress: string): Promise<string> {
    try {
      assertContractAddress(REVENUE_CONTRACT, "NEXT_PUBLIC_REVENUE_CONTRACT")

      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      const result = await sorobanClient.readContract(REVENUE_CONTRACT, "get_available_balance", params)

      return toStringValue(scValToNative(result), "0")
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

  xlmToStroops(amountXlm: string): string {
    return Math.round(Number.parseFloat(amountXlm) * 10_000_000).toString()
  }
}

export const revenueService = new RevenueService()

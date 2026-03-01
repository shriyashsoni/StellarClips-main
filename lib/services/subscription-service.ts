"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"
import { normalizeSubscription, normalizeSubscriptionTier, toBoolean, toNumber } from "./contract-response"

const SUBSCRIPTION_CONTRACT = process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT!

function assertContractAddress(contractAddress: string, envName: string) {
  if (!contractAddress) {
    throw new Error(`${envName} is not configured`)
  }
}

export interface SubscriptionTier {
  tierId: number
  creator: string
  name: string
  price: string
  durationDays: number
}

export interface Subscription {
  subscriber: string
  creator: string
  tierId: number
  startDate: number
  expiryDate: number
  autoRenew: boolean
}

export class SubscriptionService {
  async createTier(creatorAddress: string, name: string, price: string, durationDays: number): Promise<number> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [
        nativeToScVal(creatorAddress, { type: "address" }),
        nativeToScVal(name, { type: "string" }),
        nativeToScVal(BigInt(price), { type: "i128" }),
        nativeToScVal(durationDays, { type: "u32" }),
      ]

      const result = await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "create_tier", params)

      return toNumber(scValToNative(result))
    } catch (error) {
      console.error("Failed to create tier:", error)
      throw error
    }
  }

  async subscribe(subscriberAddress: string, creatorAddress: string, tierId: number, autoRenew = false): Promise<void> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
        nativeToScVal(tierId, { type: "u64" }),
        nativeToScVal(autoRenew, { type: "bool" }),
      ]

      await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "subscribe", params)
    } catch (error) {
      console.error("Failed to subscribe:", error)
      throw error
    }
  }

  async isSubscribed(subscriberAddress: string, creatorAddress: string): Promise<boolean> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
      ]

      const result = await sorobanClient.readContract(SUBSCRIPTION_CONTRACT, "is_subscribed", params)

      return toBoolean(scValToNative(result))
    } catch (error) {
      console.error("Failed to check subscription:", error)
      return false
    }
  }

  async getSubscription(subscriberAddress: string, creatorAddress: string): Promise<Subscription | null> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
      ]

      const result = await sorobanClient.readContract(SUBSCRIPTION_CONTRACT, "get_subscription", params)

      if (!result) return null

      return normalizeSubscription(scValToNative(result))
    } catch (error) {
      console.error("Failed to get subscription:", error)
      return null
    }
  }

  async cancelSubscription(subscriberAddress: string, creatorAddress: string): Promise<void> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
      ]

      await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "cancel_subscription", params)
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
      throw error
    }
  }

  async renewSubscription(subscriberAddress: string, creatorAddress: string, tierId: number): Promise<void> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
        nativeToScVal(tierId, { type: "u64" }),
      ]

      await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "renew_subscription", params)
    } catch (error) {
      console.error("Failed to renew subscription:", error)
      throw error
    }
  }

  xlmToStroops(amountXlm: string): string {
    return Math.round(Number.parseFloat(amountXlm) * 10_000_000).toString()
  }

  async getTier(tierId: number): Promise<SubscriptionTier | null> {
    try {
      assertContractAddress(SUBSCRIPTION_CONTRACT, "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT")

      const params = [nativeToScVal(tierId, { type: "u64" })]

      const result = await sorobanClient.readContract(SUBSCRIPTION_CONTRACT, "get_tier", params)

      if (!result) return null

      return normalizeSubscriptionTier(scValToNative(result))
    } catch (error) {
      console.error("Failed to get tier:", error)
      return null
    }
  }
}

export const subscriptionService = new SubscriptionService()

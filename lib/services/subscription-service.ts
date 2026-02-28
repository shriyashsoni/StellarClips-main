"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"

const SUBSCRIPTION_CONTRACT = process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT!

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
  async createTier(name: string, price: string, durationDays: number): Promise<number> {
    try {
      const params = [
        nativeToScVal(name, { type: "string" }),
        nativeToScVal(BigInt(price), { type: "i128" }),
        nativeToScVal(durationDays, { type: "u32" }),
      ]

      const result = await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "create_tier", params)

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to create tier:", error)
      throw error
    }
  }

  async subscribe(creatorAddress: string, tierId: number, autoRenew = false): Promise<void> {
    try {
      const params = [
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
      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
      ]

      const result = await sorobanClient.readContract(SUBSCRIPTION_CONTRACT, "is_subscribed", params)

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to check subscription:", error)
      return false
    }
  }

  async getSubscription(subscriberAddress: string, creatorAddress: string): Promise<Subscription | null> {
    try {
      const params = [
        nativeToScVal(subscriberAddress, { type: "address" }),
        nativeToScVal(creatorAddress, { type: "address" }),
      ]

      const result = await sorobanClient.readContract(SUBSCRIPTION_CONTRACT, "get_subscription", params)

      if (!result) return null

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to get subscription:", error)
      return null
    }
  }

  async cancelSubscription(creatorAddress: string): Promise<void> {
    try {
      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "cancel_subscription", params)
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
      throw error
    }
  }

  async renewSubscription(creatorAddress: string, tierId: number): Promise<void> {
    try {
      const params = [nativeToScVal(creatorAddress, { type: "address" }), nativeToScVal(tierId, { type: "u64" })]

      await sorobanClient.invokeContract(SUBSCRIPTION_CONTRACT, "renew_subscription", params)
    } catch (error) {
      console.error("Failed to renew subscription:", error)
      throw error
    }
  }

  async getTier(tierId: number): Promise<SubscriptionTier | null> {
    try {
      const params = [nativeToScVal(tierId, { type: "u64" })]

      const result = await sorobanClient.readContract(SUBSCRIPTION_CONTRACT, "get_tier", params)

      if (!result) return null

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to get tier:", error)
      return null
    }
  }
}

export const subscriptionService = new SubscriptionService()

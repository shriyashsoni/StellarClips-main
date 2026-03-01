"use client"

import { paymentService } from "./payment-service"
import { subscriptionService } from "./subscription-service"

const MAX_PAYMENT_PROBE = 250
const MAX_TIER_PROBE = 250

export interface UserPurchase {
  paymentId: number
  contentId: number
  amount: string
  timestamp: number
  creator: string
}

export class AccessService {
  async hasPurchasedContent(subscriberAddress: string, contentId: number): Promise<boolean> {
    const purchases = await this.getUserPurchases(subscriberAddress)
    return purchases.some((purchase) => purchase.contentId === contentId)
  }

  async hasActiveSubscription(subscriberAddress: string, creatorAddress: string): Promise<boolean> {
    return subscriptionService.isSubscribed(subscriberAddress, creatorAddress)
  }

  async canAccessContent(subscriberAddress: string, creatorAddress: string, contentId: number): Promise<boolean> {
    if (subscriberAddress === creatorAddress) return true

    const [hasPurchase, hasSubscription] = await Promise.all([
      this.hasPurchasedContent(subscriberAddress, contentId),
      this.hasActiveSubscription(subscriberAddress, creatorAddress),
    ])

    return hasPurchase || hasSubscription
  }

  async getUserPurchases(subscriberAddress: string): Promise<UserPurchase[]> {
    const paymentIds = Array.from({ length: MAX_PAYMENT_PROBE }, (_, index) => index + 1)
    const paymentResults = await Promise.allSettled(paymentIds.map((id) => paymentService.getPayment(id)))

    return paymentResults
      .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof paymentService.getPayment>>> => result.status === "fulfilled")
      .map((result) => result.value)
      .filter((payment): payment is NonNullable<typeof payment> => payment !== null)
      .filter((payment) => payment.payer === subscriberAddress && payment.paymentType === "content" && typeof payment.contentId === "number")
      .map((payment) => ({
        paymentId: payment.paymentId,
        contentId: payment.contentId as number,
        amount: payment.amount,
        timestamp: payment.timestamp,
        creator: payment.recipient,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  async getUserActiveSubscriptions(subscriberAddress: string): Promise<Array<{ creator: string; tierId: number }>> {
    const tierIds = Array.from({ length: MAX_TIER_PROBE }, (_, index) => index + 1)
    const tierResults = await Promise.allSettled(tierIds.map((id) => subscriptionService.getTier(id)))

    const tiers = tierResults
      .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof subscriptionService.getTier>>> => result.status === "fulfilled")
      .map((result) => result.value)
      .filter((tier): tier is NonNullable<typeof tier> => tier !== null)

    const creators = [...new Set(tiers.map((tier) => tier.creator))]
    const checks = await Promise.allSettled(creators.map((creator) => subscriptionService.isSubscribed(subscriberAddress, creator)))

    const activeCreators = creators.filter((_, index) => checks[index].status === "fulfilled" && checks[index].value)

    return tiers
      .filter((tier) => activeCreators.includes(tier.creator))
      .map((tier) => ({ creator: tier.creator, tierId: tier.tierId }))
  }
}

export const accessService = new AccessService()

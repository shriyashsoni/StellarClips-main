// Core TypeScript types for Stellar Micro-Payments Platform

export interface User {
  id: string
  stellarAddress: string
  username?: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  isCreator: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Creator {
  id: string
  userId: string
  subscriptionPriceXlm?: number
  subscriptionDurationDays: number
  platformFeePercent: number
  totalEarningsXlm: number
  subscriberCount: number
  contentCount: number
  createdAt: Date
  updatedAt: Date
  user?: User
}

export interface Clip {
  id: string
  creatorId: string
  title: string
  description?: string
  contentType: "video" | "audio" | "article" | "image"
  priceXlm: number
  ipfsHash?: string
  thumbnailUrl?: string
  durationSeconds?: number
  viewCount: number
  purchaseCount: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  creator?: Creator
}

export interface Purchase {
  id: string
  userId: string
  clipId: string
  amountXlm: number
  platformFeeXlm: number
  creatorEarningsXlm: number
  stellarTxHash: string
  purchasedAt: Date
  clip?: Clip
}

export interface Subscription {
  id: string
  userId: string
  creatorId: string
  amountXlm: number
  startDate: Date
  endDate: Date
  isActive: boolean
  stellarTxHash: string
  createdAt: Date
  updatedAt: Date
  creator?: Creator
}

export interface Tip {
  id: string
  fromUserId: string
  toCreatorId: string
  amountXlm: number
  platformFeeXlm: number
  creatorEarningsXlm: number
  message?: string
  stellarTxHash: string
  tippedAt: Date
}

export interface BlockchainEvent {
  id: string
  eventType: "tip" | "purchase" | "subscription" | "refund"
  stellarTxHash: string
  contractId?: string
  fromAddress?: string
  toAddress?: string
  amountXlm?: number
  eventData?: Record<string, any>
  processed: boolean
  ledgerSequence?: number
  createdAt: Date
}

export interface WalletConnection {
  address: string
  network: "testnet" | "mainnet"
  connected: boolean
}

export interface TransactionStatus {
  hash: string
  status: "pending" | "confirmed" | "failed"
  message?: string
}

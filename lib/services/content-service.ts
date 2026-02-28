"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"

const CONTENT_NFT_CONTRACT = process.env.NEXT_PUBLIC_CONTENT_NFT_CONTRACT!

export interface ContentMetadata {
  contentId: number
  creator: string
  metadataUri: string
  price: string
  createdAt: number
  contentType: string
}

export class ContentService {
  async mintContent(metadataUri: string, price: string, contentType: string): Promise<number> {
    try {
      const params = [
        nativeToScVal(metadataUri, { type: "string" }),
        nativeToScVal(BigInt(price), { type: "i128" }),
        nativeToScVal(contentType, { type: "string" }),
      ]

      const result = await sorobanClient.invokeContract(CONTENT_NFT_CONTRACT, "mint_content", params)

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to mint content:", error)
      throw error
    }
  }

  async getContent(contentId: number): Promise<ContentMetadata | null> {
    try {
      const params = [nativeToScVal(contentId, { type: "u64" })]

      const result = await sorobanClient.readContract(CONTENT_NFT_CONTRACT, "get_content", params)

      if (!result) return null

      return scValToNative(result)
    } catch (error) {
      console.error("Failed to get content:", error)
      return null
    }
  }

  async updateContentUri(contentId: number, newUri: string): Promise<void> {
    try {
      const params = [nativeToScVal(contentId, { type: "u64" }), nativeToScVal(newUri, { type: "string" })]

      await sorobanClient.invokeContract(CONTENT_NFT_CONTRACT, "update_content_uri", params)
    } catch (error) {
      console.error("Failed to update content URI:", error)
      throw error
    }
  }

  async updatePrice(contentId: number, newPrice: string): Promise<void> {
    try {
      const params = [nativeToScVal(contentId, { type: "u64" }), nativeToScVal(BigInt(newPrice), { type: "i128" })]

      await sorobanClient.invokeContract(CONTENT_NFT_CONTRACT, "update_price", params)
    } catch (error) {
      console.error("Failed to update price:", error)
      throw error
    }
  }

  async getCreatorContents(creatorAddress: string): Promise<number[]> {
    try {
      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      const result = await sorobanClient.readContract(CONTENT_NFT_CONTRACT, "get_creator_contents", params)

      return scValToNative(result) || []
    } catch (error) {
      console.error("Failed to get creator contents:", error)
      return []
    }
  }
}

export const contentService = new ContentService()

"use client"

import { sorobanClient } from "../stellar/soroban-client"
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk"
import { normalizeContentMetadata, normalizeNumberArray } from "./contract-response"

const CONTENT_NFT_CONTRACT = process.env.NEXT_PUBLIC_CONTENT_NFT_CONTRACT!

function assertContractAddress(contractAddress: string, envName: string) {
  if (!contractAddress) {
    throw new Error(`${envName} is not configured`)
  }
}

export interface ContentMetadata {
  contentId: number
  creator: string
  metadataUri: string
  price: string
  createdAt: number
  contentType: string
}

export class ContentService {
  async mintContent(creatorAddress: string, metadataUri: string, price: string, contentType: string): Promise<number> {
    try {
      assertContractAddress(CONTENT_NFT_CONTRACT, "NEXT_PUBLIC_CONTENT_NFT_CONTRACT")

      const params = [
        nativeToScVal(creatorAddress, { type: "address" }),
        nativeToScVal(metadataUri, { type: "string" }),
        nativeToScVal(BigInt(price), { type: "i128" }),
        nativeToScVal(contentType, { type: "string" }),
      ]

      const result = await sorobanClient.invokeContract(CONTENT_NFT_CONTRACT, "mint_content", params)

      return Number(scValToNative(result))
    } catch (error) {
      console.error("Failed to mint content:", error)
      throw error
    }
  }

  async getContent(contentId: number): Promise<ContentMetadata | null> {
    try {
      assertContractAddress(CONTENT_NFT_CONTRACT, "NEXT_PUBLIC_CONTENT_NFT_CONTRACT")

      const params = [nativeToScVal(contentId, { type: "u64" })]

      const result = await sorobanClient.readContract(CONTENT_NFT_CONTRACT, "get_content", params)

      if (!result) return null

      return normalizeContentMetadata(scValToNative(result))
    } catch (error) {
      console.error("Failed to get content:", error)
      return null
    }
  }

  async updateContentUri(contentId: number, newUri: string): Promise<void> {
    try {
      assertContractAddress(CONTENT_NFT_CONTRACT, "NEXT_PUBLIC_CONTENT_NFT_CONTRACT")

      const params = [nativeToScVal(contentId, { type: "u64" }), nativeToScVal(newUri, { type: "string" })]

      await sorobanClient.invokeContract(CONTENT_NFT_CONTRACT, "update_content_uri", params)
    } catch (error) {
      console.error("Failed to update content URI:", error)
      throw error
    }
  }

  async updatePrice(contentId: number, newPrice: string): Promise<void> {
    try {
      assertContractAddress(CONTENT_NFT_CONTRACT, "NEXT_PUBLIC_CONTENT_NFT_CONTRACT")

      const params = [nativeToScVal(contentId, { type: "u64" }), nativeToScVal(BigInt(newPrice), { type: "i128" })]

      await sorobanClient.invokeContract(CONTENT_NFT_CONTRACT, "update_price", params)
    } catch (error) {
      console.error("Failed to update price:", error)
      throw error
    }
  }

  async getCreatorContents(creatorAddress: string): Promise<number[]> {
    try {
      assertContractAddress(CONTENT_NFT_CONTRACT, "NEXT_PUBLIC_CONTENT_NFT_CONTRACT")

      const params = [nativeToScVal(creatorAddress, { type: "address" })]

      const result = await sorobanClient.readContract(CONTENT_NFT_CONTRACT, "get_creator_contents", params)

      return normalizeNumberArray(scValToNative(result))
    } catch (error) {
      console.error("Failed to get creator contents:", error)
      return []
    }
  }
}

export const contentService = new ContentService()

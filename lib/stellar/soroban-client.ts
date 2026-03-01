"use client"

import { Contract, rpc as SorobanRpc, TransactionBuilder, Networks, BASE_FEE } from "@stellar/stellar-sdk"
import { walletService } from "./wallet"

const RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL ||
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org"
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET

export class SorobanClient {
  private server: SorobanRpc.Server | null = null

  private getServer(): SorobanRpc.Server {
    if (typeof window === "undefined") {
      throw new Error("SorobanClient can only be used in the browser")
    }

    if (!this.server) {
      this.server = new SorobanRpc.Server(RPC_URL)
    }
    return this.server
  }

  async invokeContract(contractAddress: string, method: string, params: any[]): Promise<any> {
    const publicKey = walletService.getPublicKey()
    if (!publicKey) {
      throw new Error("Wallet not connected")
    }

    try {
      const server = this.getServer()
      const account = await server.getAccount(publicKey)
      const contract = new Contract(contractAddress)

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(method, ...params))
        .setTimeout(30)
        .build()

      const preparedTransaction = await server.prepareTransaction(transaction)
      const xdr = preparedTransaction.toXDR()
      const signedXdr = await walletService.signTransaction(xdr)

      const signedTransaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
      const response = await server.sendTransaction(signedTransaction)

      if (response.status === "PENDING") {
        let getResponse = await server.getTransaction(response.hash)

        while (getResponse.status === "NOT_FOUND") {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          getResponse = await server.getTransaction(response.hash)
        }

        if (getResponse.status === "SUCCESS") {
          return getResponse.returnValue
        } else {
          throw new Error(`Transaction failed: ${getResponse.status}`)
        }
      }

      return response
    } catch (error) {
      console.error("Contract invocation failed:", error)
      throw error
    }
  }

  async readContract(contractAddress: string, method: string, params: any[]): Promise<any> {
    try {
      const server = this.getServer()
      const contract = new Contract(contractAddress)
      const publicKey = walletService.getPublicKey() || "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"

      const account = await server.getAccount(publicKey)

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(method, ...params))
        .setTimeout(30)
        .build()

      const response = await server.simulateTransaction(transaction)

      if (SorobanRpc.Api.isSimulationSuccess(response)) {
        return response.result?.retval
      } else {
        throw new Error("Simulation failed")
      }
    } catch (error) {
      console.error("Contract read failed:", error)
      throw error
    }
  }

  async getAccountBalance(publicKey: string): Promise<string> {
    try {
      const horizonUrl =
        process.env.NEXT_PUBLIC_HORIZON_URL ||
        (process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
          ? "https://horizon.stellar.org"
          : "https://horizon-testnet.stellar.org")

      const response = await fetch(`${horizonUrl}/accounts/${publicKey}`)

      if (!response.ok) {
        return "0"
      }

      const account = await response.json()
      const balance = account.balances?.find((b: { asset_type: string; balance: string }) => b.asset_type === "native")

      return balance?.balance ?? "0"
    } catch (error) {
      console.error("Failed to get balance:", error)
      return "0"
    }
  }
}

export const sorobanClient = new SorobanClient()

import { Server, type ServerApi } from "@stellar/stellar-sdk/lib/horizon"
import { STELLAR_CONFIG } from "@/lib/stellar-config"

export class HorizonIndexer {
  private server: Server
  private isRunning = false

  constructor() {
    this.server = new Server(STELLAR_CONFIG.horizonUrl)
  }

  async start() {
    if (this.isRunning) {
      console.log("[v0] Indexer already running")
      return
    }

    this.isRunning = true
    console.log("[v0] Starting Horizon indexer...")

    try {
      await this.indexPayments()
      await this.indexContractEvents()
    } catch (error) {
      console.error("[v0] Indexer error:", error)
      this.isRunning = false
    }
  }

  stop() {
    this.isRunning = false
    console.log("[v0] Stopping Horizon indexer...")
  }

  private async indexPayments() {
    const paymentsStream = this.server
      .payments()
      .cursor("now")
      .stream({
        onmessage: async (payment) => {
          await this.handlePayment(payment)
        },
        onerror: (error) => {
          console.error("[v0] Payment stream error:", error)
        },
      })

    console.log("[v0] Payment indexer started")
    return paymentsStream
  }

  private async indexContractEvents() {
    // Stream contract events from Soroban
    console.log("[v0] Contract event indexer started")

    // TODO: Implement Soroban event streaming
    // This would use the Soroban RPC to listen for contract events
    // and process them accordingly
  }

  private async handlePayment(payment: ServerApi.PaymentOperationRecord) {
    try {
      console.log("[v0] Processing payment:", payment.id)

      // Store payment in database
      const eventData = {
        event_type: "payment",
        transaction_hash: payment.transaction_hash,
        from_address: payment.from,
        to_address: payment.to,
        amount: payment.amount,
        asset_type: payment.asset_type,
        created_at: payment.created_at,
      }

      // TODO: Insert into blockchain_events table
      console.log("[v0] Payment processed:", eventData)
    } catch (error) {
      console.error("[v0] Error handling payment:", error)
    }
  }

  async getAccountPayments(accountId: string, limit = 10) {
    try {
      const payments = await this.server.payments().forAccount(accountId).limit(limit).order("desc").call()

      return payments.records
    } catch (error) {
      console.error("[v0] Error fetching account payments:", error)
      return []
    }
  }

  async getTransactionDetails(txHash: string) {
    try {
      const transaction = await this.server.transactions().transaction(txHash).call()
      return transaction
    } catch (error) {
      console.error("[v0] Error fetching transaction:", error)
      return null
    }
  }
}

export const horizonIndexer = new HorizonIndexer()

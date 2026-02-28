import { horizonIndexer } from "@/lib/indexer/horizon-indexer"
import { subscriptionManager } from "@/lib/indexer/subscription-manager"

async function main() {
  console.log("Starting StellarClips indexer services...")

  // Start Horizon indexer
  await horizonIndexer.start()

  // Check expired subscriptions every hour
  setInterval(
    async () => {
      await subscriptionManager.checkExpiredSubscriptions()
    },
    60 * 60 * 1000,
  )

  console.log("Indexer services running...")
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">StellarClips Whitepaper</h1>
          <p className="text-muted-foreground">Technical Overview & Architecture</p>
          <p className="text-sm text-muted-foreground mt-2">Version 1.0 | Last Updated: January 2025</p>
        </div>

        {/* Abstract */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Abstract</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              StellarClips is a decentralized content monetization platform built on the Stellar blockchain, enabling
              creators to receive micro-payments for their digital content with near-zero fees and instant settlement.
              By leveraging Soroban smart contracts and the Stellar network's high throughput, we provide a sustainable
              alternative to traditional content monetization models.
            </p>
          </CardContent>
        </Card>

        {/* Problem Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Problem Statement</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p className="font-semibold text-foreground">1.1 Current Challenges</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traditional payment processors charge 2-3% + fixed fees, making micro-payments uneconomical</li>
              <li>Content platforms take 30-50% of creator earnings</li>
              <li>Payment settlement can take days or weeks</li>
              <li>Geographic restrictions limit global monetization</li>
              <li>Lack of transparency in revenue distribution</li>
            </ul>

            <p className="font-semibold text-foreground mt-6">1.2 Market Opportunity</p>
            <p>
              The creator economy is valued at over $100 billion, with millions of creators seeking better monetization
              options. Micro-payments enable new business models where users pay small amounts for individual pieces of
              content rather than large subscriptions.
            </p>
          </CardContent>
        </Card>

        {/* Solution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Solution Architecture</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p className="font-semibold text-foreground">2.1 Stellar Blockchain</p>
            <p>
              Stellar provides the ideal infrastructure for micro-payments with 3-5 second settlement times and fees of
              0.00001 XLM (~$0.000001) per transaction. The network can handle 1000+ transactions per second, ensuring
              scalability.
            </p>

            <p className="font-semibold text-foreground mt-6">2.2 Soroban Smart Contracts</p>
            <p>We deploy four core smart contracts written in Rust:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Content NFT Contract:</strong> Mints content as NFTs with metadata stored on IPFS
              </li>
              <li>
                <strong>Payment Contract:</strong> Handles one-time purchases and tips with automatic fee distribution
              </li>
              <li>
                <strong>Subscription Contract:</strong> Manages recurring subscriptions using prepaid pools
              </li>
              <li>
                <strong>Revenue Contract:</strong> Tracks earnings and handles withdrawals with escrow mechanisms
              </li>
            </ul>

            <p className="font-semibold text-foreground mt-6">2.3 Off-Chain Components</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Horizon Indexer:</strong> Streams blockchain events and updates database in real-time
              </li>
              <li>
                <strong>IPFS Storage:</strong> Stores content files with cryptographic hash verification
              </li>
              <li>
                <strong>PostgreSQL Database:</strong> Caches metadata for fast queries and analytics
              </li>
              <li>
                <strong>Next.js Frontend:</strong> Provides responsive UI with wallet integration
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p className="font-semibold text-foreground">3.1 Payment Flow</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>User connects Stellar wallet (Freighter, Albedo, xBull, or Rabet)</li>
              <li>User selects content to purchase</li>
              <li>Frontend constructs transaction calling Payment Contract</li>
              <li>User signs transaction with their wallet</li>
              <li>Transaction is submitted to Stellar network</li>
              <li>Smart contract executes: 97.5% to creator, 2.5% platform fee</li>
              <li>Horizon indexer detects event and updates database</li>
              <li>Content is unlocked for user</li>
            </ol>

            <p className="font-semibold text-foreground mt-6">3.2 Subscription Model</p>
            <p>
              Subscriptions use a prepaid pool pattern where users deposit funds upfront. The contract automatically
              deducts the subscription fee at each renewal period. Users can cancel anytime and receive refunds for
              unused time.
            </p>

            <p className="font-semibold text-foreground mt-6">3.3 Security Measures</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Non-custodial: Users maintain full control of their private keys</li>
              <li>Smart contract auditing and formal verification</li>
              <li>Content hash verification prevents tampering</li>
              <li>Row-level security in database</li>
              <li>Rate limiting on API endpoints</li>
            </ul>
          </CardContent>
        </Card>

        {/* Economics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Platform Economics</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p className="font-semibold text-foreground">4.1 Fee Structure</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Platform fee: 2.5% of transaction value</li>
              <li>Stellar network fee: ~$0.000001 per transaction</li>
              <li>Creator earnings: 97.5% of transaction value</li>
            </ul>

            <p className="font-semibold text-foreground mt-6">4.2 Sustainability</p>
            <p>
              The 2.5% platform fee covers infrastructure costs (hosting, IPFS storage, indexing) while remaining
              significantly lower than traditional platforms. As transaction volume grows, economies of scale improve
              profitability.
            </p>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p className="font-semibold text-foreground">Phase 1: MVP (Q1 2025)</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Launch on Stellar Testnet</li>
              <li>Core features: content publishing, purchases, subscriptions</li>
              <li>Support for video, audio, and text content</li>
            </ul>

            <p className="font-semibold text-foreground mt-6">Phase 2: Mainnet Launch (Q2 2025)</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Deploy to Stellar Mainnet</li>
              <li>Smart contract audits</li>
              <li>Creator onboarding program</li>
              <li>Mobile app development</li>
            </ul>

            <p className="font-semibold text-foreground mt-6">Phase 3: Expansion (Q3-Q4 2025)</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Multi-token support (USDC, other Stellar assets)</li>
              <li>Creator analytics dashboard</li>
              <li>Social features and discovery algorithms</li>
              <li>Fiat on/off ramps (SEP-24/31 integration)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle>6. Conclusion</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              StellarClips demonstrates the practical application of blockchain technology for solving real-world
              problems in the creator economy. By leveraging Stellar's fast, low-cost infrastructure and Soroban's smart
              contract capabilities, we enable a new paradigm of content monetization that benefits both creators and
              consumers.
            </p>
            <p>
              Our platform proves that micro-payments can be economically viable, opening up new business models and
              revenue streams for digital content. As the creator economy continues to grow, StellarClips is positioned
              to become the leading decentralized content monetization platform.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />
      </div>
    </div>
  )
}

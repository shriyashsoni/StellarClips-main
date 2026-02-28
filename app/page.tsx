import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Shield, TrendingUp, Wallet, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 border-b-2 border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border-2 border-primary/20">
            <Image src="/stellar-logo.png" alt="Stellar" width={20} height={20} className="w-5 h-5" />
            Powered by Stellar Blockchain
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Micro-Payments for Content Creators</h1>

          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Monetize your content with instant, low-fee payments on Stellar. No middlemen, no delays. Just you and your
            audience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/browse">
              <Button
                size="lg"
                className="w-full sm:w-auto border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-2 hover:bg-accent/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="border-2 border-border rounded-lg p-4 hover:border-primary/30 transition-colors bg-card">
              <div className="text-3xl font-bold text-primary">0.00001</div>
              <div className="text-sm text-muted-foreground">XLM per transaction</div>
            </div>
            <div className="border-2 border-border rounded-lg p-4 hover:border-primary/30 transition-colors bg-card">
              <div className="text-3xl font-bold text-primary">3-5s</div>
              <div className="text-sm text-muted-foreground">Settlement time</div>
            </div>
            <div className="border-2 border-border rounded-lg p-4 hover:border-primary/30 transition-colors bg-card">
              <div className="text-3xl font-bold text-primary">2.5%</div>
              <div className="text-sm text-muted-foreground">Platform fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-b-2 border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StellarClips?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on Stellar blockchain for instant, secure, and affordable micro-transactions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-2 border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-300 bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Payments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transactions settle in 3-5 seconds. No waiting, no delays.
              </p>
            </Card>

            <Card className="p-6 border-2 border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-300 bg-card">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 border-2 border-accent/20">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Non-Custodial</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You control your wallet. We never hold your funds.
              </p>
            </Card>

            <Card className="p-6 border-2 border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-300 bg-card">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4 border-2 border-chart-3/20">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Low Fees</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fraction of a cent per transaction. Keep more of what you earn.
              </p>
            </Card>

            <Card className="p-6 border-2 border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-300 bg-card">
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4 border-2 border-chart-2/20">
                <Sparkles className="w-6 h-6 text-chart-2" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Contracts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automated payments with Soroban smart contracts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 border-b-2 border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to start earning</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6 items-start p-6 border-2 border-border rounded-lg hover:border-primary/30 transition-colors bg-card">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 border-2 border-primary/20">
                1
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use any Stellar-compatible wallet like Freighter, Albedo, or Lobstr. No account creation needed.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start p-6 border-2 border-border rounded-lg hover:border-primary/30 transition-colors bg-card">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 border-2 border-primary/20">
                2
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Publish Your Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload videos, audio, articles, or images. Set your price and publish instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start p-6 border-2 border-border rounded-lg hover:border-primary/30 transition-colors bg-card">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 border-2 border-primary/20">
                3
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Get Paid Instantly</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive payments directly to your wallet. Track earnings in real-time on your dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/dashboard">
              <Button size="lg" className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                Start Creating Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

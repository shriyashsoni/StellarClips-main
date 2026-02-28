import { Sparkles, Shield, Zap, Users, Globe, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">About StellarClips</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Empowering content creators with blockchain-powered micro-payments on the Stellar network
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                StellarClips is revolutionizing how content creators monetize their work by leveraging the power of
                blockchain technology. We believe creators should be paid fairly and instantly for their content,
                without intermediaries taking large cuts.
              </p>
              <p>
                Built on the Stellar blockchain, our platform enables micro-payments with near-zero fees and instant
                settlement, making it economically viable to charge small amounts for individual pieces of content.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why StellarClips?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Instant Payments</CardTitle>
                <CardDescription>
                  Transactions settle in 3-5 seconds on the Stellar network, ensuring creators get paid immediately
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Low Fees</CardTitle>
                <CardDescription>
                  Pay fractions of a cent per transaction, making micro-payments economically viable
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Non-Custodial</CardTitle>
                <CardDescription>
                  You control your wallet and funds. We never have access to your private keys
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Creator-First</CardTitle>
                <CardDescription>
                  Creators keep 97.5% of earnings. No hidden fees or surprise deductions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Global Access</CardTitle>
                <CardDescription>
                  Accept payments from anyone, anywhere in the world without currency conversion hassles
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Smart Contracts</CardTitle>
                <CardDescription>
                  Powered by Soroban smart contracts for transparent, trustless transactions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Connect your Stellar wallet (Freighter, Albedo, xBull, or Rabet) to get started
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Content</h3>
              <p className="text-muted-foreground">
                Discover amazing content from creators or publish your own clips and articles
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay & Earn</h3>
              <p className="text-muted-foreground">
                Pay micro-amounts for content you love or earn from your creations instantly
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Built for the Future</CardTitle>
              <CardDescription className="text-base">
                StellarClips is built by a team passionate about empowering creators and leveraging blockchain
                technology for real-world use cases. We're committed to building a sustainable platform that puts
                creators first.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

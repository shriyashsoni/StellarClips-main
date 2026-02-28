"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { WalletConnectButton } from "./wallet-connect-button"
import { useWallet } from "@/hooks/use-wallet"

export function Navigation() {
  const pathname = usePathname()
  const { isConnected } = useWallet()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/stellarclips-logo.png"
              alt="StellarClips Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-xl">StellarClips</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/browse"
              className={`text-sm font-medium transition-colors ${
                isActive("/browse") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/whitepaper"
              className={`text-sm font-medium transition-colors ${
                isActive("/whitepaper") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Whitepaper
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

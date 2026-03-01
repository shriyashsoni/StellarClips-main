"use client"

import { useEffect, useState } from "react"
import { getActiveNetwork, onActiveNetworkChanged, setActiveNetwork, type StellarNetwork } from "@/lib/stellar/network"

export function useStellarNetwork() {
  const [network, setNetwork] = useState<StellarNetwork>(getActiveNetwork())

  useEffect(() => {
    const unsubscribe = onActiveNetworkChanged(setNetwork)
    return unsubscribe
  }, [])

  const changeNetwork = (next: StellarNetwork) => {
    setActiveNetwork(next)
    setNetwork(next)
  }

  return {
    network,
    setNetwork: changeNetwork,
  }
}

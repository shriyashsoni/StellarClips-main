"use client"

const ENCRYPTION_PREFIX = "enc:v1"

function assertWebCrypto() {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto is not available in this environment")
  }
}

function toBase64(bytes: Uint8Array): string {
  let binary = ""
  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  assertWebCrypto()

  const encoder = new TextEncoder()
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"])

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: toArrayBuffer(salt),
      iterations: 250000,
      hash: "SHA-256",
    },
    material,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  )
}

export function isEncryptedContentUri(value: string): boolean {
  return value.startsWith(`${ENCRYPTION_PREFIX}:`)
}

export async function encryptContentLink(link: string, passphrase: string): Promise<string> {
  assertWebCrypto()

  const normalizedPassphrase = passphrase.trim()
  if (!normalizedPassphrase) {
    throw new Error("Encryption key is required")
  }

  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveAesKey(normalizedPassphrase, salt)

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(iv),
    },
    key,
    encoder.encode(link),
  )

  const cipher = new Uint8Array(cipherBuffer)
  return `${ENCRYPTION_PREFIX}:${toBase64(salt)}:${toBase64(iv)}:${toBase64(cipher)}`
}

export async function decryptContentLink(payload: string, passphrase: string): Promise<string> {
  assertWebCrypto()

  const normalizedPassphrase = passphrase.trim()
  if (!normalizedPassphrase) {
    throw new Error("Access key is required")
  }

  if (!isEncryptedContentUri(payload)) {
    return payload
  }

  const parts = payload.split(":")
  if (parts.length !== 5 || `${parts[0]}:${parts[1]}` !== ENCRYPTION_PREFIX) {
    throw new Error("Invalid encrypted payload format")
  }

  const [, , saltBase64, ivBase64, cipherBase64] = parts
  const salt = fromBase64(saltBase64)
  const iv = fromBase64(ivBase64)
  const cipher = fromBase64(cipherBase64)

  const key = await deriveAesKey(normalizedPassphrase, salt)

  try {
    const plainBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: toArrayBuffer(iv),
      },
      key,
      toArrayBuffer(cipher),
    )

    return new TextDecoder().decode(plainBuffer)
  } catch {
    throw new Error("Invalid access key for this content")
  }
}

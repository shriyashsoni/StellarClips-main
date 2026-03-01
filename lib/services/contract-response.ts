type AnyRecord = Record<string, unknown>

function asRecord(value: unknown): AnyRecord | null {
  if (value && typeof value === "object") {
    return value as AnyRecord
  }

  return null
}

function pick(record: AnyRecord | null, camelKey: string, snakeKey: string): unknown {
  if (!record) return undefined
  return record[camelKey] ?? record[snakeKey]
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "bigint") return Number(value)

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

export function toStringValue(value: unknown, fallback = "0"): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "bigint") return value.toString()
  return fallback
}

export function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value
  return fallback
}

export function normalizeContentMetadata(raw: unknown) {
  const record = asRecord(raw)

  return {
    contentId: toNumber(pick(record, "contentId", "content_id")),
    creator: toStringValue(pick(record, "creator", "creator"), ""),
    metadataUri: toStringValue(pick(record, "metadataUri", "metadata_uri"), ""),
    price: toStringValue(pick(record, "price", "price"), "0"),
    createdAt: toNumber(pick(record, "createdAt", "created_at")),
    contentType: toStringValue(pick(record, "contentType", "content_type"), "video"),
  }
}

export function normalizePaymentRecord(raw: unknown) {
  const record = asRecord(raw)

  return {
    paymentId: toNumber(pick(record, "paymentId", "payment_id")),
    payer: toStringValue(pick(record, "payer", "payer"), ""),
    recipient: toStringValue(pick(record, "recipient", "recipient"), ""),
    amount: toStringValue(pick(record, "amount", "amount"), "0"),
    platformFee: toStringValue(pick(record, "platformFee", "platform_fee"), "0"),
    paymentType: toStringValue(pick(record, "paymentType", "payment_type"), ""),
    contentId: pick(record, "contentId", "content_id") == null ? undefined : toNumber(pick(record, "contentId", "content_id")),
    timestamp: toNumber(pick(record, "timestamp", "timestamp")),
  }
}

export function normalizeSubscriptionTier(raw: unknown) {
  const record = asRecord(raw)

  return {
    tierId: toNumber(pick(record, "tierId", "tier_id")),
    creator: toStringValue(pick(record, "creator", "creator"), ""),
    name: toStringValue(pick(record, "name", "name"), ""),
    price: toStringValue(pick(record, "price", "price"), "0"),
    durationDays: toNumber(pick(record, "durationDays", "duration_days")),
  }
}

export function normalizeSubscription(raw: unknown) {
  const record = asRecord(raw)

  return {
    subscriber: toStringValue(pick(record, "subscriber", "subscriber"), ""),
    creator: toStringValue(pick(record, "creator", "creator"), ""),
    tierId: toNumber(pick(record, "tierId", "tier_id")),
    startDate: toNumber(pick(record, "startDate", "start_date")),
    expiryDate: toNumber(pick(record, "expiryDate", "expiry_date")),
    autoRenew: toBoolean(pick(record, "autoRenew", "auto_renew")),
  }
}

export function normalizeCreatorBalance(raw: unknown) {
  const record = asRecord(raw)

  return {
    creator: toStringValue(pick(record, "creator", "creator"), ""),
    availableBalance: toStringValue(pick(record, "availableBalance", "available_balance"), "0"),
    totalEarned: toStringValue(pick(record, "totalEarned", "total_earned"), "0"),
    totalWithdrawn: toStringValue(pick(record, "totalWithdrawn", "total_withdrawn"), "0"),
    lastWithdrawal: toNumber(pick(record, "lastWithdrawal", "last_withdrawal")),
  }
}

export function normalizeNumberArray(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw.map((value) => toNumber(value)).filter((value) => Number.isFinite(value) && value > 0)
}
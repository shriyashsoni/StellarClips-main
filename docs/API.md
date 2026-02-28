# StellarClips API Documentation

## Content Endpoints

### GET /api/content
Fetch content with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search query
- `sortBy` (optional): Sort order (recent, popular, price-low, price-high)

**Response:**
\`\`\`json
{
  "content": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price_xlm": "string",
      "thumbnail_uri": "string"
    }
  ]
}
\`\`\`

### POST /api/content
Create new content (creator only).

**Body:**
\`\`\`json
{
  "creatorId": "string",
  "title": "string",
  "description": "string",
  "contentType": "video|audio|article",
  "contentUri": "string",
  "thumbnailUri": "string",
  "priceXlm": "string",
  "durationSeconds": number
}
\`\`\`

### GET /api/content/[id]
Get specific content details.

### PATCH /api/content/[id]
Update content (creator only).

### DELETE /api/content/[id]
Delete content (creator only).

## Subscription Endpoints

### GET /api/subscriptions
Get subscriptions by user or creator.

**Query Parameters:**
- `userId` (optional): Get user's subscriptions
- `creatorId` (optional): Get creator's tiers

### POST /api/subscriptions
Create new subscription.

**Body:**
\`\`\`json
{
  "userId": "string",
  "creatorId": "string",
  "tierId": "string",
  "transactionHash": "string"
}
\`\`\`

### POST /api/subscriptions/[id]/cancel
Cancel subscription.

### POST /api/subscriptions/[id]/renew
Renew subscription.

## Purchase Endpoints

### GET /api/purchases
Get user's purchases.

**Query Parameters:**
- `userId` (required): User ID

### POST /api/purchases
Record new purchase.

**Body:**
\`\`\`json
{
  "userId": "string",
  "contentId": "string",
  "transactionHash": "string",
  "amountXlm": "string"
}
\`\`\`

### GET /api/purchases/check
Check if user has purchased content.

**Query Parameters:**
- `userId` (required): User ID
- `contentId` (required): Content ID

## Earnings Endpoints

### GET /api/earnings
Get creator earnings.

**Query Parameters:**
- `creatorId` (required): Creator ID

**Response:**
\`\`\`json
{
  "earnings": {
    "totalEarnings": "string",
    "availableBalance": "string",
    "pendingBalance": "string",
    "lifetimeEarnings": "string",
    "breakdown": {
      "purchases": "string",
      "tips": "string",
      "subscriptions": "string"
    }
  }
}
\`\`\`

## Analytics Endpoints

### GET /api/analytics
Get creator analytics.

**Query Parameters:**
- `creatorId` (required): Creator ID
- `period` (optional): Time period (7d, 30d, 90d)

**Response:**
\`\`\`json
{
  "analytics": {
    "views": number,
    "purchases": number,
    "revenue": "string",
    "subscribers": number,
    "conversionRate": number,
    "topContent": [],
    "revenueChart": []
  }
}

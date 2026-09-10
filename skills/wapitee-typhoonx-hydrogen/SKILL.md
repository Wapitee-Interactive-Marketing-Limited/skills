---
name: wapitee-typhoonx-hydrogen
description: "TyphoonX Hydrogen. Wire or audit Wapitee tracking on a Shopify Hydrogen storefront via Analytics subscribe."
---

# TyphoonX

Wapitee on-site tracking on a Hydrogen storefront. The browser sends a JSON Blob via `sendBeacon` to `https://spell.typhoonx.io/api/v1/receive`. Event names and ecommerce params follow GA4's shape.

## 1. Collect inputs

Stop when any required input is missing; list every gap in one pass. Merchant ID and Shop ID come from admin. Scan the repo first; skip questions existing env already answers.

| Input | Required | Rule |
|------|------|------|
| `TYPHOONX_MERCHANT_ID` | yes | Must start with `TPX-`. Source: wapitee.io/admin → TyphoonX > Merchant Management |
| Tracked actions | yes | Implement the requested events from the contract table |
| `SHOP_ID` | no | Use `''` when absent |
| `COOKIE_DOMAIN` | no | Only when `__typhoon_client_id` is shared across subdomains |

Ask for the Merchant ID:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management, and copy the Merchant ID. It must start with `TPX-` (e.g. `TPX-12345678`).

A value that does not start with `TPX-` is invalid; ask the user to recopy from admin.

**Done when**: Merchant ID is `TPX-…` and the event list is present.

## 2. Classify the repo

Stop when `@shopify/hydrogen` is absent.

| State | Signal |
|------|------|
| present | `spell.typhoonx.io`, `sendTyphoonx`, or `register('TyphoonX')` |
| missing | none of those |

present → patch the existing **subscribe** to the contract. missing → once inputs are complete, write from [hydrogen.md](hydrogen.md).

**Done when**: state is present or missing.

## 3. Contract

Every event **payload** carries these 8 fields:

| Field | Source |
|------|------|
| `event` | `snake_case` name from the table below |
| `merchant_id` | `TYPHOONX_MERCHANT_ID` |
| `shop_id` | `SHOP_ID` or `''` |
| `client_id` | cookie `__typhoon_client_id`; if absent, `crypto.randomUUID()` and a session cookie (`path=/; SameSite=Lax`, plus `domain` when `COOKIE_DOMAIN` is set) |
| `referrer` | previous page href (first load: `document.referrer`) |
| `request_page_url` | Analytics `data.url` when present, else `window.location.href` |
| `timestamp` | `new Date().toISOString()` |
| `user_agent` | `navigator.userAgent` |

Transport: `navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }))`.

| Action | Event | Required | Optional |
|------|------|------|------|
| Page view | `page_view` | — | — |
| View item | `view_item` | `currency`, `items`, `value` | — |
| Add to cart | `add_to_cart` | `currency`, `items`, `value` | — |
| Remove from cart | `remove_from_cart` | `currency`, `items`, `value` | — |

Each `items` entry has `item_id`, `item_name`, `price`, `quantity` (plus `item_brand` / `item_category` as needed). `item_id` is `parseGid(product.id).id`.

**Done when**: every requested action has an event name and its required params.

## 4. Write

Read [hydrogen.md](hydrogen.md). One **subscribe** component inside `Analytics.Provider`; transport helper only. Implement only the requested events. Wire env vars in the same step. `createContentSecurityPolicy` needs `connectSrc: ['https://spell.typhoonx.io']` (it merges with defaults).

**Done when**: the contract payload is sent for every requested event via **subscribe**.

## 5. Report

```
### TyphoonX tracking summary
- Merchant ID: [TPX-…]
- Shop ID: [value or empty]
- Framework: Hydrogen
- Events: [event names actually written]
- Files: [paths]

### Checks
- [ ] payload has the eight base fields; event names are snake_case
- [ ] events come from useAnalytics subscribe; callback `data` is unannotated
- [ ] items (if present) have item_id, item_name, price, quantity
- [ ] __typhoon_client_id is written; domain is set when sharing across subdomains
- [ ] Network: spell.typhoonx.io/api/v1/receive returns 200

### Updated files
[subscriber in full; other paths listed]
```

**Done when**: the summary is filled; the subscriber is pasted in full.

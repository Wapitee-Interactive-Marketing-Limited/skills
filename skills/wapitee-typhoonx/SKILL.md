---
name: wapitee-typhoonx-setup
description: "TyphoonX. Wire Wapitee event tracking on a web project (sendBeacon, snake_case); map business actions to standard events; audit an existing tracker for payload and client_id."
---

# TyphoonX

Wapitee on-site tracking. The browser sends a JSON Blob via `sendBeacon` to `https://spell.typhoonx.io/api/v1/receive`. Event names and ecommerce params follow GA4's shape, as TyphoonX events.

## 1. Collect inputs

Stop when any required input is missing; list every gap in one pass. Merchant ID and Shop ID come from admin. Scan the repo first; skip questions the framework or existing env already answers.

| Input | Required | Rule |
|------|------|------|
| `TYPHOONX_MERCHANT_ID` | yes | Must start with `TPX-`. Source: wapitee.io/admin → TyphoonX > Merchant Management |
| `FRAMEWORK` | yes | Scan the repo; if unknown, ask nextjs / react / vue / html |
| Site type | yes | ecommerce / lead / content / SaaS |
| Tracked actions | yes | Implement the requested events from the table |
| `SHOP_ID` | no | Use `''` when absent |
| `COOKIE_DOMAIN` | no | Only when `__typhoon_client_id` is shared across subdomains |

Ask for the Merchant ID:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management, and copy the Merchant ID. It must start with `TPX-` (e.g. `TPX-12345678`).

A value that does not start with `TPX-` is invalid; ask the user to recopy from admin.

**Done when**: Merchant ID is `TPX-…`, and framework, site type, and the event list are present.

## 2. Classify the repo

| State | Signal |
|------|------|
| present | `spell.typhoonx.io` or `typhoonxTrack` |
| missing | neither |

present → patch missing fields to the contract; one helper. missing → once inputs are complete, read [tracker.md](tracker.md) and write one helper.

**Done when**: state is present or missing.

## 3. Contract and events

Every event **payload** carries these 8 fields:

| Field | Source |
|------|------|
| `event` | `snake_case` name from the table below |
| `merchant_id` | `TYPHOONX_MERCHANT_ID` |
| `shop_id` | `SHOP_ID` or `''` |
| `client_id` | cookie `__typhoon_client_id`; if absent, generate UUID v4 and write a session cookie (`path=/; SameSite=Lax`, plus `domain` when `COOKIE_DOMAIN` is set) |
| `referrer` | `document.referrer` |
| `request_page_url` | `window.location.href` |
| `timestamp` | `new Date().toISOString()` |
| `user_agent` | `navigator.userAgent` |

Transport: `navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }))`.

| Action | Event | Required | Optional |
|------|------|------|------|
| Page view | `page_view` | — | — |
| View item | `view_item` | `currency`, `items`, `value` | — |
| Add to cart | `add_to_cart` | `currency`, `items`, `value` | — |
| Remove from cart | `remove_from_cart` | `currency`, `items`, `value` | — |
| Begin checkout | `begin_checkout` | — | `currency`, `items`, `value`, `coupon` |
| Purchase | `purchase` | `currency`, `items`, `transaction_id`, `value` | `tax`, `shipping`, `coupon` |
| Generate lead | `generate_lead` | — | `email`, `lead_source`, `value`, `currency`, `transaction_id` |

Each `items` entry has `item_id`, `item_name`, `price`, `quantity` (plus `item_category` and similar as needed). Fire `page_view` once from the client entry.

**Done when**: every requested action has an event name and its required params.

## 4. Write

Read [tracker.md](tracker.md). One helper; wire env vars from that table; call it from real click / submit / route sites.

**Done when**: one helper exists; the payload has all eight fields; every requested event has a call site.

## 5. Report

```
### TyphoonX tracking summary
- Merchant ID: [TPX-…]
- Shop ID: [value or empty]
- Framework: [Next.js / React / Vue / HTML]
- Site type: [ecommerce / lead / content / SaaS]
- Events: [event names actually written]
- Files: [paths]

### Checks
- [ ] payload has the eight base fields; event names are snake_case
- [ ] purchase (if present) has currency, items, transaction_id, value
- [ ] items (if present) have item_id, item_name, price, quantity
- [ ] __typhoon_client_id is written; domain is set when sharing across subdomains
- [ ] Network: spell.typhoonx.io/api/v1/receive returns 200

### Updated files
[full file after the change, not a diff]
```

**Done when**: the summary is filled; every changed file is pasted in full.

---
name: wapitee-typhoonx
description: "TyphoonX React. Wire, audit, or migrate @wapitee/typhoonx-react on a Next.js or React site."
---

# TyphoonX

On-site tracking on a React site via the Package `@wapitee/typhoonx-react`: `TyphoonXProvider` at the root, `useTyphoonX()` methods at call sites.

## 1. Gate

Use `wapitee-typhoonx-hydrogen` when the repo depends on `@shopify/hydrogen`.

Read the Package: `peerDependencies.react` and the `TyphoonXTracker` method list. The repo's `dependencies.react` must meet that peer. Every event the user named must have a method; a miss is a Package gap.

**Done when**: `react` is present and meets the peer, and every named event maps to a method or is listed as a Package gap.

## 2. Collect inputs

Stop when any required input is missing; list every gap in one pass. Scan the repo first; skip questions existing env already answers. Env prefix: Next.js `NEXT_PUBLIC_TYPHOONX_*`, Vite `VITE_TYPHOONX_*`, otherwise literals the user supplied.

| Input | Required | Rule |
|------|------|------|
| Merchant ID | yes | Must start with `TPX-`. Env: `*_TYPHOONX_MERCHANT_ID`. Source: wapitee.io/admin → TyphoonX > Merchant Management |
| Consent | yes | A boolean from the repo's existing consent banner / CMP state. With none, ask whether tracking runs unconditionally (`true`) |
| Tracked actions | yes | Map each to a method in step 3 |
| Shop ID | no | Env: `*_TYPHOONX_SHOP_ID`. `''` when absent |
| Cookie domain | no | Env: `*_TYPHOONX_COOKIE_DOMAIN`. The Package defaults `__typhoon_client_id` to the apex domain (`.example.com`); set only when that default is wrong |
| GA4 measurement ID | no | Env: `*_TYPHOONX_MEASUREMENT_ID`. Must start with `G-`. Only when the site runs GA4; reuse the repo's existing `G-…` id |

Ask for the Merchant ID:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management, and copy the Merchant ID. It must start with `TPX-` (e.g. `TPX-12345678`).

A value that does not start with `TPX-` is invalid; ask the user to recopy from admin.

**Done when**: Merchant ID is `TPX-…`, Consent has a source, and a set measurement ID is `G-…`.

## 3. Map events

| Action | Method |
|------|------|
| Page view | `pageView()` |
| View item | `viewItem({currency?, items, value})` |
| View item list | `viewItemList({currency?, itemListId, itemListName})` |
| Add to cart | `addToCart({currency?, items, value})` |
| Remove from cart | `removeFromCart({currency?, items, value})` |
| View cart | `viewCart({currency?, items, value})` |
| Search | `search({searchTerm})` |

Each item is `{itemBrand, itemId, itemName, price, quantity}`. `first_visit` rides on the first `pageView()`.

**Done when**: every requested action has a method, or is a Package gap.

## 4. Classify

| State | Signal |
|------|------|
| canonical | `@wapitee/typhoonx-react` is a dependency and the app imports it |
| leftover | App source (not `node_modules`) has `typhoonxTrack` or a `sendBeacon` to `spell.typhoonx.io` |
| missing | neither |
| dual | canonical and leftover |

**Done when**: state is exactly one row.

## 5. Write

Make Canonical wiring true in one pass:

- Dependency `@wapitee/typhoonx-react` (same package manager as the repo)
- TyphoonX env in the repo's env file (Next.js: `.env.local`)
- `TyphoonXProvider` wraps the app at the root (Next.js App Router: root layout, inside a `'use client'` wrapper when consent comes from client state); `cookieDomain` / `measurementId` only when their env is set
- `pageView()` fires on every route change from an effect keyed on the path (`usePathname()` / `useLocation()`); other methods fire from real view / click / submit sites
- When the site sets a Content-Security-Policy, `connect-src` includes `https://spell.typhoonx.io`
- The Package is the only sender: leftover `typhoonxTrack` / inline `sendBeacon` is gone in this pass

```tsx
import {TyphoonXProvider, useTyphoonX} from '@wapitee/typhoonx-react';

<TyphoonXProvider
  consent={hasAnalyticsConsent}
  merchantId={process.env.NEXT_PUBLIC_TYPHOONX_MERCHANT_ID!}
  shopId={process.env.NEXT_PUBLIC_TYPHOONX_SHOP_ID ?? ''}
>
  {children}
</TyphoonXProvider>

const typhoonx = useTyphoonX();
useEffect(() => {
  typhoonx.pageView();
}, [typhoonx, pathname]);
```

**Done when**: Canonical wiring holds, every mapped event has a call site, and the Package is the only sender.

## 6. Report

```
### TyphoonX tracking summary
- Merchant ID: [TPX-…]
- Shop ID: [value or empty]
- Framework: [Next.js / React]
- State: [missing → canonical | leftover → canonical | dual → canonical | canonical]
- Events: [methods actually called]
- Package gaps: [requested events with no method, or none]
- Files: [paths]

### Checks
- [ ] `@wapitee/typhoonx-react` is a dependency and the app imports it
- [ ] `TyphoonXProvider` wraps every component that calls `useTyphoonX()`
- [ ] consent comes from the real consent state; merchantId / shopId from TyphoonX env
- [ ] the Package is the only TyphoonX sender
- [ ] connect-src includes spell.typhoonx.io (when CSP is set)
- [ ] Network: with consent granted, spell.typhoonx.io/api/v1/receive returns 200

### Updated files
[Provider mount site in full; other paths listed]
```

**Done when**: the summary is filled; the Provider mount site is pasted in full.

---
name: wapitee-typhoonx
description: "TyphoonX tracking on React. Wire, audit, or migrate @wapitee/typhoonx-react on a Next.js or React site."
---

# TyphoonX

On-site tracking on a React site via the Package `@wapitee/typhoonx-react`: `TyphoonXProvider` at the root, `useTyphoonX()` methods at call sites.

## Phase 1: Gate

Use `wapitee-typhoonx-hydrogen` when the repo depends on `@shopify/hydrogen`.

Read the Package's `peerDependencies.react`; the repo's `dependencies.react` must meet it. `react` absent or below the peer → end the run with a report: the repo's `react` version, the peer, and that the Package does not support this site yet. The Package stays the only sender.

**Done when**: `react` is present and meets the peer.

## Phase 2: Classify

| State     | Signal                                                                                       |
| --------- | -------------------------------------------------------------------------------------------- |
| canonical | `@wapitee/typhoonx-react` is a dependency and the app imports it                             |
| leftover  | App source (not `node_modules`) has `typhoonxTrack` or a `sendBeacon` to `spell.typhoonx.io` |
| missing   | neither                                                                                      |
| dual      | canonical and leftover                                                                       |

**Done when**: state is exactly one row.

## Phase 3: Collect inputs

Stop when any required input is missing; list every missing input in one ask. Skip questions the repo already answers: existing env, or the values a leftover tracker from Phase 2 sends. Env prefix: Next.js `NEXT_PUBLIC_TYPHOONX_*`, Vite `VITE_TYPHOONX_*`, Create React App `REACT_APP_TYPHOONX_*`, otherwise literals the user supplied.

| Input              | Required | Rule                                                                                                                                                 |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Merchant ID        | yes      | Env: `*_TYPHOONX_MERCHANT_ID`. Must start with `TPX-`; any other value → ask the user to recopy from admin                                           |
| Consent            | yes      | A boolean from the repo's existing consent banner / CMP state. With none, ask whether tracking runs unconditionally (`true`)                         |
| Shop ID            | no       | Env: `*_TYPHOONX_SHOP_ID`. Source: the Shopify store, when the site has one. `''` when absent                                                        |
| Cookie domain      | no       | Env: `*_TYPHOONX_COOKIE_DOMAIN`. The Package defaults `__typhoon_client_id` to the apex domain (`.example.com`); set only when that default is wrong |
| GA4 measurement ID | no       | Env: `*_TYPHOONX_MEASUREMENT_ID`. Must start with `G-`. Only when the site runs GA4; reuse the repo's existing `G-…` id                              |

Ask for the Merchant ID:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management, and copy the Merchant ID. It must start with `TPX-` (e.g. `TPX-12345678`).

**Done when**: Merchant ID is a `TPX-…` value the user pasted or the repo already holds (env, leftover tracker), Consent has a source, and a set measurement ID is `G-…`.

## Phase 4: Map events

Requested events are the ones the user named; when they named none, every row whose surface the site has (`pageView()` always). Map each to its method; a requested event with no method is a Package gap.

| Action           | Method                                                | Surface                   |
| ---------------- | ----------------------------------------------------- | ------------------------- |
| Page view        | `pageView()`                                          | every route change        |
| View item        | `viewItem({currency?, items, value})`                 | product page              |
| View item list   | `viewItemList({currency?, itemListId, itemListName})` | product list / collection |
| Add to cart      | `addToCart({currency?, items, value})`                | add-to-cart control       |
| Remove from cart | `removeFromCart({currency?, items, value})`           | cart line removal         |
| View cart        | `viewCart({currency?, items, value})`                 | cart page or drawer       |
| Search           | `search({searchTerm})`                                | search results            |

The table mirrors `TyphoonXTracker` in `@wapitee/typhoonx-react` 0.2.x; when the version the repo installs differs, its `TyphoonXTracker` type wins. Each item is `{itemBrand, itemId, itemName, price, quantity}`. `first_visit` rides on the first `pageView()`.

**Done when**: every requested event maps to a method or is listed as a Package gap.

## Phase 5: Write

Make Canonical wiring true in one pass:

- Dependency `@wapitee/typhoonx-react` (same package manager as the repo)
- TyphoonX env in the repo's env file (Next.js: `.env.local`)
- `TyphoonXProvider` wraps the app at the root (Next.js App Router: root layout, inside a `'use client'` wrapper when consent comes from client state); `cookieDomain` / `measurementId` only when their env is set
- `pageView()` fires on every route change from an effect keyed on the path (`usePathname()` / `useLocation()`); other methods fire from real view / click / submit sites
- When the site sets a Content-Security-Policy, `connect-src` includes `https://spell.typhoonx.io`
- The Package is the only sender: leftover `typhoonxTrack` / inline `sendBeacon` is gone in this pass

```tsx
"use client";

import { TyphoonXProvider, useTyphoonX } from "@wapitee/typhoonx-react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function TyphoonXRoot({ children }: { children: ReactNode }) {
  const hasAnalyticsConsent = useAnalyticsConsent(); // the repo's consent state

  return (
    <TyphoonXProvider
      consent={hasAnalyticsConsent}
      merchantId={process.env.NEXT_PUBLIC_TYPHOONX_MERCHANT_ID!}
      shopId={process.env.NEXT_PUBLIC_TYPHOONX_SHOP_ID ?? ""}
    >
      <PageViews />
      {children}
    </TyphoonXProvider>
  );
}

function PageViews() {
  const typhoonx = useTyphoonX();
  const pathname = usePathname();

  useEffect(() => {
    typhoonx.pageView();
  }, [typhoonx, pathname]);

  return null;
}
```

**Done when**: Canonical wiring holds, every mapped event has a call site, and the Package is the only sender.

## Phase 6: Report

```
### TyphoonX tracking summary
- Merchant ID: [TPX-…]
- Shop ID: [value or empty]
- Framework: [Next.js / React]
- State: [missing → canonical | leftover → canonical | dual → canonical | canonical]
- Events: [methods actually called]
- Package gaps: [requested events with no method, or none]
- Files: [paths]

### Code checks
- [ ] `@wapitee/typhoonx-react` is a dependency and the app imports it
- [ ] `TyphoonXProvider` wraps every component that calls `useTyphoonX()`
- [ ] consent comes from the real consent state; merchantId / shopId from TyphoonX env
- [ ] the Package is the only TyphoonX sender
- [ ] connect-src includes spell.typhoonx.io (when CSP is set)

### Checks for you
- [ ] Network: with consent granted, spell.typhoonx.io/api/v1/receive returns 200

### Updated files
[Provider mount site in full; other paths listed]
```

**Done when**: the summary is filled; every code check is verified in the repo and ticked; the Provider mount site is pasted in full.

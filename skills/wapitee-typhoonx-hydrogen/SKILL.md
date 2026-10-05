---
name: wapitee-typhoonx-hydrogen
description: "TyphoonX tracking on Hydrogen. Wire, audit, or migrate @wapitee/typhoonx-hydrogen on a Shopify Hydrogen storefront."
---

# TyphoonX Hydrogen

On-site tracking on a Hydrogen storefront via the Package `@wapitee/typhoonx-hydrogen`.

## Phase 1: Gate

Use `wapitee-typhoonx` when `@shopify/hydrogen` is absent.

Read the Package's `peerDependencies["@shopify/hydrogen"]`; the repo's `dependencies["@shopify/hydrogen"]` must meet it. `@shopify/hydrogen` below the peer → end the run with a report: the repo's Hydrogen version, the peer, and that the Hydrogen upgrade comes first. The Package stays the only sender.

The Package subscribes to these Hydrogen events. Every event the user named must map to a row; a miss is a Package gap.

| Action                      | Hydrogen event              | Published by                                        |
| --------------------------- | --------------------------- | --------------------------------------------------- |
| Page view (+ `first_visit`) | `page_viewed`               | `Analytics.Provider`, on every route                |
| View item                   | `product_viewed`            | `<Analytics.ProductView>` on the product page       |
| View item list              | `collection_viewed`         | `<Analytics.CollectionView>` on the collection page |
| Search                      | `search_viewed`             | `<Analytics.SearchView>` on the search page         |
| View cart                   | `cart_viewed`               | `<Analytics.CartView>` on the cart page             |
| Add to cart                 | `product_added_to_cart`     | `Analytics.Provider`, from `cart` changes           |
| Remove from cart            | `product_removed_from_cart` | `Analytics.Provider`, from `cart` changes           |

The table mirrors the `subscribe(...)` calls in `@wapitee/typhoonx-hydrogen` 0.8.x; when the version the repo installs differs, its `subscribe(...)` calls win.

**Done when**: `@shopify/hydrogen` is present and meets the peer, and every named event maps to a row or is listed as a Package gap.

## Phase 2: Classify

Assign exactly one state:

| State     | Signal                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| canonical | `@wapitee/typhoonx-hydrogen` is a dependency and the storefront imports it                                                                                   |
| leftover  | App source (not `node_modules`) has `sendTyphoonx`, a `sendBeacon` to `spell.typhoonx.io`, or `register('TyphoonX')` whose implementation is not the Package |
| missing   | neither                                                                                                                                                      |
| dual      | canonical and leftover                                                                                                                                       |

**Done when**: state is exactly one row.

## Phase 3: Collect inputs

Stop when any required input is missing; list every missing input in one ask. Skip questions the repo already answers: existing env, or the values a leftover tracker from Phase 2 sends.

| Input              | Required | Rule                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Merchant ID        | yes      | Env: `PUBLIC_TYPHOONX_MERCHANT_ID`. Must start with `TPX-`; any other value → ask the user to recopy from admin                                                                                                                                                                                                                      |
| Shop ID            | yes      | Env: `PUBLIC_TYPHOONX_SHOP_ID`. Else the id the root loader `shop` resolves to: Storefront API `shop { id }` with the repo's `PUBLIC_STORE_DOMAIN` / `PUBLIC_STOREFRONT_API_TOKEN`, GID parsed to numeric (`gid://shopify/Shop/123` → `123`). Else ask for the Shopify shop id. Every source is written to `PUBLIC_TYPHOONX_SHOP_ID` |
| Cookie domain      | no       | Env: `PUBLIC_TYPHOONX_COOKIE_DOMAIN`. The Package defaults `__typhoon_client_id` to the apex domain (`.example.com`); set only when that default is wrong                                                                                                                                                                            |
| GA4 measurement ID | no       | Env: `PUBLIC_TYPHOONX_MEASUREMENT_ID`. Must start with `G-`. Only when the storefront runs GA4                                                                                                                                                                                                                                       |

Ask for the Merchant ID:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management, and copy the Merchant ID. It must start with `TPX-` (e.g. `TPX-12345678`).

**Done when**: Merchant ID is a `TPX-…` value the user pasted or the repo already holds (env, leftover tracker), Shop ID is a numeric id from one of the sources above, and a set measurement ID is `G-…`.

## Phase 4: Write

Make Canonical wiring true in one pass:

- Dependency `@wapitee/typhoonx-hydrogen` (same package manager as the repo)
- Public TyphoonX env and `Env` in `env.d.ts`
- Root loader reads `PUBLIC_TYPHOONX_*` from `context.env` and returns them as `typhoonx` (`cookieDomain` / `measurementId` only when their env is set)
- Package default export mounted inside `Analytics.Provider`, props spread from loader `typhoonx`
- Each product / collection / search / cart page the storefront has renders its publisher from the Phase 1 table; a missing one is added with the data that page already loads
- When the project calls `createContentSecurityPolicy`, `connectSrc` includes `https://spell.typhoonx.io` (it merges with defaults)
- The Package is the only sender: leftover `sendTyphoonx` / inlined helper / local `register('TyphoonX')` is gone in this pass

```
PUBLIC_TYPHOONX_MERCHANT_ID=
PUBLIC_TYPHOONX_SHOP_ID=
PUBLIC_TYPHOONX_COOKIE_DOMAIN=
PUBLIC_TYPHOONX_MEASUREMENT_ID=
```

```tsx
// app/root.tsx — existing imports, data, and markup kept
import { Analytics } from "@shopify/hydrogen";
import TyphoonX from "@wapitee/typhoonx-hydrogen";
import { useRouteLoaderData } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const { env } = context;

  return {
    // ...existing data
    typhoonx: {
      merchantId: env.PUBLIC_TYPHOONX_MERCHANT_ID,
      shopId: env.PUBLIC_TYPHOONX_SHOP_ID,
    },
  };
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <html lang="en">
      {/* ...existing <head> */}
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            consent={data.consent}
            shop={data.shop}
          >
            <TyphoonX {...data.typhoonx} />
            {children}
          </Analytics.Provider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
```

If the root layout has no `Analytics.Provider`, add Hydrogen's using the existing `cart` / `consent` / `shop` from the root loader.

**Done when**: Canonical wiring holds and the Package is the only sender.

## Phase 5: Report

```
### TyphoonX tracking summary
- Merchant ID: [TPX-…]
- Shop ID: [value]
- State: [missing → canonical | leftover → canonical | dual → canonical | canonical]
- Events: [Hydrogen events whose publisher is rendered]
- Package gaps: [named events not on the subscribe list, or none]
- Files: [paths]

### Code checks
- [ ] `@wapitee/typhoonx-hydrogen` is a dependency and the storefront imports it
- [ ] `<TyphoonX />` is a child of `Analytics.Provider`
- [ ] each existing product / collection / search / cart page renders its `<Analytics.*View>`
- [ ] merchantId / shopId reach `<TyphoonX />` from PUBLIC_TYPHOONX_* env via the root loader (cookieDomain / measurementId only when set)
- [ ] the Package is the only TyphoonX sender
- [ ] createContentSecurityPolicy connectSrc includes https://spell.typhoonx.io (when CSP is set)

### Checks for you
- [ ] Console: no `[TyphoonX] <TyphoonX> must be rendered inside <Analytics.Provider>`
- [ ] Network: with tracking consent granted, spell.typhoonx.io/api/v1/receive returns 200

### Updated files
[mount site in full; other paths listed]
```

**Done when**: the summary is filled; every code check is verified in the repo and ticked; the mount site is pasted in full.

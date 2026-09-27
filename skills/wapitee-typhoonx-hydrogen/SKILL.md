---
name: wapitee-typhoonx-hydrogen
description: "TyphoonX Hydrogen. Wire, audit, or migrate @wapitee/typhoonx-hydrogen on a Shopify Hydrogen storefront."
---

# TyphoonX Hydrogen

On-site tracking on a Hydrogen storefront via the Package `@wapitee/typhoonx-hydrogen`.

## 1. Gate

Use `wapitee-typhoonx` when `@shopify/hydrogen` is absent.

Read the Package: `peerDependencies["@shopify/hydrogen"]` and the subscribe list. The repo's `dependencies["@shopify/hydrogen"]` must meet that peer. Every event the user named must be on that list; a miss is a Package gap.

**Done when**: `@shopify/hydrogen` is present and meets the peer, and every named event is on the subscribe list (or none were named). When Hydrogen is absent, `wapitee-typhoonx` is the recipe.

## 2. Collect inputs

Stop when any required input is missing; list every gap in one pass. Scan the repo first; skip questions existing env already answers.

| Input | Required | Rule |
|------|------|------|
| Merchant ID | yes | Must start with `TPX-`. Env: `PUBLIC_TYPHOONX_MERCHANT_ID`. Source: wapitee.io/admin → TyphoonX > Merchant Management |
| Shop ID | yes | Env: `PUBLIC_TYPHOONX_SHOP_ID`. Else the root loader `shop` id, numeric (parse a GID when present). Else ask for the Shopify shop id |
| Cookie domain | no | Env: `PUBLIC_TYPHOONX_COOKIE_DOMAIN`. The Package defaults `__typhoon_client_id` to the apex domain (`.example.com`); set only when that default is wrong |
| GA4 measurement ID | no | Env: `PUBLIC_TYPHOONX_MEASUREMENT_ID`. Must start with `G-`. Only when the storefront runs GA4 |

Ask for the Merchant ID:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management, and copy the Merchant ID. It must start with `TPX-` (e.g. `TPX-12345678`).

A value that does not start with `TPX-` is invalid; ask the user to recopy from admin.

**Done when**: Merchant ID is `TPX-…`, Shop ID is a non-empty shop id, and a set measurement ID is `G-…`.

## 3. Classify

Assign exactly one state:

| State | Signal |
|------|------|
| canonical | `@wapitee/typhoonx-hydrogen` is a dependency and the storefront imports it |
| leftover | App source (not `node_modules`) has `sendTyphoonx`, a `sendBeacon` to the collector, or `register('TyphoonX')` whose implementation is not the Package |
| missing | neither |
| dual | canonical and leftover |

**Done when**: state is exactly one row.

## 4. Write

Make Canonical wiring true in one pass:

- Dependency `@wapitee/typhoonx-hydrogen` (same package manager as the repo)
- Public TyphoonX env and `Env` in `env.d.ts`
- Root loader reads `PUBLIC_TYPHOONX_*` from `context.env` and returns them as `typhoonx` (cookieDomain` / `measurementId` only when their env is set)
- Package default export mounted inside `Analytics.Provider`, props spread from loader `typhoonx`
- When the project calls `createContentSecurityPolicy`, `connectSrc` includes the Package collector origin (it merges with defaults)
- The Package is the only sender: leftover `sendTyphoonx` / inlined helper / local `register('TyphoonX')` is gone in this pass

```
PUBLIC_TYPHOONX_MERCHANT_ID=
PUBLIC_TYPHOONX_SHOP_ID=
PUBLIC_TYPHOONX_COOKIE_DOMAIN=
PUBLIC_TYPHOONX_MEASUREMENT_ID=
```

```tsx
import TyphoonX from '@wapitee/typhoonx-hydrogen';

export async function loader({context}: Route.LoaderArgs) {
  const {env} = context;

  return {
    // ...existing data
    typhoonx: {
      merchantId: env.PUBLIC_TYPHOONX_MERCHANT_ID,
      shopId: env.PUBLIC_TYPHOONX_SHOP_ID,
    },
  };
}

<Analytics.Provider cart={data.cart} consent={data.consent} shop={data.shop}>
  <TyphoonX {...data.typhoonx} />
</Analytics.Provider>
```

If the root layout has no `Analytics.Provider`, add Hydrogen's using the existing `cart` / `consent` / `shop` from the root loader.

**Done when**: Canonical wiring holds and the Package is the only sender.

## 5. Report

```
### TyphoonX tracking summary
- Merchant ID: [TPX-…]
- Shop ID: [value]
- State: [missing → canonical | leftover → canonical | dual → canonical | canonical]
- Events: [Package subscribe list]
- Files: [paths]

### Checks
- [ ] `@wapitee/typhoonx-hydrogen` is a dependency and the storefront imports it
- [ ] `<TyphoonX />` is a child of `Analytics.Provider`
- [ ] merchantId / shopId reach `<TyphoonX />` from PUBLIC_TYPHOONX_* env via the root loader (cookieDomain / measurementId only when set)
- [ ] the Package is the only TyphoonX sender
- [ ] createContentSecurityPolicy connectSrc includes the Package collector origin (when CSP is set)
- [ ] Console: no `[TyphoonX] <TyphoonX> must be rendered inside <Analytics.Provider>`
- [ ] Network: with tracking consent granted, collector returns 200

### Updated files
[mount site in full; other paths listed]
```

**Done when**: the summary is filled; the mount site is pasted in full.

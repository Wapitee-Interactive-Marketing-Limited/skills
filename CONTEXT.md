# Wapitee agent skills

Glossary for the Wapitee skill catalog. Implementation lives in packages and `SKILL.md` files, not here.

## Language

**Merchant ID**:
The TyphoonX merchant identifier. It starts with `TPX-` and comes from wapitee.io/admin. Agents never invent it.
_Avoid_: placeholder IDs, `TPX-XXXXXX` as a real value

**Shop ID**:
The Shopify shop identifier sent as TyphoonX `shop_id`. On Hydrogen it is required. Take it from the Hydrogen `shop` (numeric; parse a GID). Wapitee admin is not the source.
_Avoid_: optional empty `shop_id` on Hydrogen, copying Shop ID from wapitee.io/admin

**Skill**:
An agent recipe: stop, collect real IDs, and wire the canonical integration. It is not the tracker implementation.
_Avoid_: SDK, library, copying a subscriber into the storefront

**Package**:
`@wapitee/typhoonx-hydrogen` is the Hydrogen tracker implementation; `@wapitee/typhoonx-react` is the React / Next.js one.
_Avoid_: inlined `TyphoonX.tsx`, `sendTyphoonx` in the storefront

**Canonical Hydrogen wiring**:
Install the Package and mount its component inside `Analytics.Provider`.
_Avoid_: generating a subscribe component, dual senders

**Hydrogen skill**:
The TyphoonX agent recipe for Hydrogen. Collect IDs, install the Package, pass Public TyphoonX env as props, add CSP. It is a separate skill, not a branch of the generic tracker skill.
_Avoid_: merging into `wapitee-typhoonx`, `hydrogen.md` subscriber templates

**Leftover**:
Storefront-owned TyphoonX send or subscribe code (`sendTyphoonx`, inlined helper). On wire or audit, Canonical Hydrogen wiring replaces it. One sender remains.
_Avoid_: patch-in-place, dual senders

**Public TyphoonX env**:
`PUBLIC_TYPHOONX_MERCHANT_ID`, `PUBLIC_TYPHOONX_SHOP_ID`, and optional `PUBLIC_TYPHOONX_COOKIE_DOMAIN` / `PUBLIC_TYPHOONX_MEASUREMENT_ID`. These are the storefront values passed as Package props. React uses the same names under the framework prefix (`NEXT_PUBLIC_`, `VITE_`).
_Avoid_: literal `TPX-…` in component source

**Package event contract**:
On Hydrogen, the events the Package already subscribes to are the event set. A requested event the Package does not emit is a Package gap.
_Avoid_: a second sender, a storefront helper for `purchase` / `begin_checkout` / `generate_lead`

**Hydrogen peer**:
The Package's `@shopify/hydrogen` peer is a gate. Below it, stop. It is not a reason to revive leftover.
_Avoid_: installing anyway, falling back to inlined subscribe

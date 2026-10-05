# Wapitee agent skills

Glossary for maintainers of this skill catalog. Each term names one meaning; the rules that apply it live in the `SKILL.md` that uses it.

## Catalog

**Skill**:
An agent recipe: stop, collect real values, and wire the canonical integration. It is not the implementation.
_Avoid_: SDK, library, copying tracker code into the site

**Package**:
The TyphoonX tracker implementation on npm: `@wapitee/typhoonx-react` for React / Next.js, `@wapitee/typhoonx-hydrogen` for Hydrogen. Each has its own skill.
_Avoid_: inlined `TyphoonX.tsx`, merging the Hydrogen skill into `wapitee-typhoonx`

## TyphoonX

**Merchant ID**:
The TyphoonX merchant identifier, `TPX-…`, from wapitee.io/admin. Agents never invent it.
_Avoid_: placeholder IDs, `TPX-XXXXXX` as a real value

**Shop ID**:
The Shopify store's numeric shop identifier, sent as `shop_id`. It comes from the Shopify store; wapitee.io/admin supplies only the Merchant ID. Required on Hydrogen, where the root loader's `shop` carries it.
_Avoid_: a Shop ID taken from wapitee.io/admin

**Public TyphoonX env**:
The public env vars that carry Merchant ID, Shop ID, and optional settings into Package props.
_Avoid_: literal `TPX-…` in component source

**Canonical wiring**:
The Package installed and mounted the way its skill prescribes, as the only sender.
_Avoid_: generating a subscribe component, dual senders

**Package gap**:
A requested event the Package does not emit. Reported, never filled by storefront code.
_Avoid_: a second sender, a helper for `purchase` / `begin_checkout` / `generate_lead`

## Survey webhook

**`q_N` answer key**:
The payload key for the Nth Survey question (`q_1`, `q_2`, …). Frontend field names never reach the payload.
_Avoid_: `answers.favoriteColor`, field names as keys

**Webhook Secret**:
The per-Survey value sent as `X-Webhook-Secret`. It belongs on the server.
_Avoid_: Secret in the browser bundle without a declared no-backend exception

## Watermark

**CDN script**:
The official `console-easter-egg` script that prints the Wapitee console watermark. One per project, first in the entry `<head>`.
_Avoid_: inline ASCII logo, a custom `console.log`

## Shared

**Leftover**:
Site-owned code that does what the canonical integration does (`sendTyphoonx`, `typhoonxTrack`, inline watermark ASCII). The canonical integration replaces it in the same pass.
_Avoid_: patch-in-place, keeping both

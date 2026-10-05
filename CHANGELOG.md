# wapitee-skills

## 2.1.0

### Minor Changes

- [`63e10d9`](https://github.com/Wapitee-Interactive-Marketing-Limited/skills/commit/63e10d95265d1e1cba2e1ca82e207ff9d9993171) Thanks [@ysj151215](https://github.com/ysj151215)! - Tighten every skill so agent runs take the same path.
  
  - `wapitee-survey-webhook` frontmatter `name` now matches its directory (was `wapitee-survey-webhook-setup`).
  - TyphoonX skills: a Merchant ID must be one the user pasted or the repo already holds, an unsupported `react` / Hydrogen version ends the run with a report, and Classify runs before inputs are collected so a leftover tracker's values are reused. `wapitee-typhoonx` defaults tracked events to the surfaces the site has; `wapitee-typhoonx-hydrogen` lists the Package's subscribed events with their Hydrogen publishers, looks up the Shop ID through the Storefront API when env lacks it, and names `spell.typhoonx.io` for CSP.
  - `wapitee-watermark` checks an existing CDN script against the official line, requires CSP `script-src` to allow jsDelivr, gives the Nuxt config shape, and covers SvelteKit / Remix / Angular entries.
  - `wapitee-survey-webhook` reuses the repo's webhook env on audit, places the helper on any server framework, and keeps the payload Contract beside the Write step.
  - Reports separate code checks the agent verifies from browser checks for the user.

## 2.0.1

### Patch Changes

- [`74aa9a6`](https://github.com/Wapitee-Interactive-Marketing-Limited/skills/commit/74aa9a6ee84c9c4339d9ada5a6157efbe71bb447) Thanks [@ysj151215](https://github.com/ysj151215)! - `wapitee-typhoonx` names the Shopify store as the Shop ID source, and the unused `tracker.md` (the hand-written `sendBeacon` helper removed in 2.0.0) is deleted.

## 2.0.0

### Major Changes

- [`c42b784`](https://github.com/Wapitee-Interactive-Marketing-Limited/skills/commit/c42b784604d8014f0393704bbff01baa9289784b) Thanks [@ysj151215](https://github.com/ysj151215)! - Retarget `wapitee-typhoonx` to install `@wapitee/typhoonx-react` (`TyphoonXProvider` + `useTyphoonX()`) on Next.js and React. The hand-written `sendBeacon` helper for Vue and HTML is removed; events the Package has no method for (`begin_checkout`, `purchase`, `generate_lead`) are reported as Package gaps.
  
  `wapitee-typhoonx-hydrogen` follows `@wapitee/typhoonx-hydrogen` 0.8: props come from the root loader's `context.env`, optional `measurementId`, and the cookie domain defaults to the apex domain.

## 1.1.0

### Minor Changes

- [`6d4f927`](https://github.com/Wapitee-Interactive-Marketing-Limited/skills/commit/6d4f9278971752bc779885271ef7c122a66b66c8) Thanks [@ysj151215](https://github.com/ysj151215)! - Retarget the Hydrogen TyphoonX skill to install `@wapitee/typhoonx-hydrogen` instead of inlining a subscriber.

## 1.0.0

### Major Changes

- [`b3a4b60`](https://github.com/Wapitee-Interactive-Marketing-Limited/skills/commit/b3a4b60c9ffc9f6018388f90a9929c0d2b64d555) Thanks [@ysj151215](https://github.com/ysj151215)! - First versioned release of the Wapitee agent skill catalog.
  
  These skills encode the contracts agents cannot guess: `TPX-` merchant IDs, `q_N` survey answer keys, and the official console watermark CDN. The agent must stop, collect real IDs from [wapitee.io/admin](https://wapitee.io/admin), and implement one helper against a fixed payload.
  
  - **wapitee-typhoonx** — TyphoonX on-site tracking (`sendBeacon`, `snake_case` events). Map business actions to the standard event table and audit payload plus `client_id` on Next.js, React, Vue, or HTML.
  - **wapitee-typhoonx-hydrogen** — The same TyphoonX contract on a Shopify Hydrogen storefront, wired through Analytics `subscribe`.
  - **wapitee-survey-webhook** — POST site forms to Wapitee Survey. Map fields to `q_N` and keep the webhook Secret on the server.
  - **wapitee-watermark** — Inject the official console easter-egg CDN into the entry `<head>`, diagnose a missing watermark, and migrate leftover inline ASCII.
  
  Install:
  
  ```bash
  npx skills@latest add Wapitee-Interactive-Marketing-Limited/skills
  ```

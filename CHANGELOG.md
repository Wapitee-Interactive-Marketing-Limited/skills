# wapitee-skills

## 1.0.0

### Major Changes

- [`b3a4b60`](https://github.com/Wapitee-Interactive-Marketing-Limited/wptskill/commit/b3a4b60c9ffc9f6018388f90a9929c0d2b64d555) Thanks [@ysj151215](https://github.com/ysj151215)! - First versioned release of the Wapitee agent skill catalog.
  
  These skills encode the contracts agents cannot guess: `TPX-` merchant IDs, `q_N` survey answer keys, and the official console watermark CDN. The agent must stop, collect real IDs from [wapitee.io/admin](https://wapitee.io/admin), and implement one helper against a fixed payload.
  
  - **wapitee-typhoonx** — TyphoonX on-site tracking (`sendBeacon`, `snake_case` events). Map business actions to the standard event table and audit payload plus `client_id` on Next.js, React, Vue, or HTML.
  - **wapitee-typhoonx-hydrogen** — The same TyphoonX contract on a Shopify Hydrogen storefront, wired through Analytics `subscribe`.
  - **wapitee-survey-webhook** — POST site forms to Wapitee Survey. Map fields to `q_N` and keep the webhook Secret on the server.
  - **wapitee-watermark** — Inject the official console easter-egg CDN into the entry `<head>`, diagnose a missing watermark, and migrate leftover inline ASCII.
  
  Install:
  
  ```bash
  npx skills@latest add Wapitee-Interactive-Marketing-Limited/wptskill
  ```

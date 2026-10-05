---
"wapitee-skills": minor
---

Tighten every skill so agent runs take the same path.

- `wapitee-survey-webhook` frontmatter `name` now matches its directory (was `wapitee-survey-webhook-setup`).
- TyphoonX skills: a Merchant ID must be one the user pasted or the repo already holds, an unsupported `react` / Hydrogen version ends the run with a report, and Classify runs before inputs are collected so a leftover tracker's values are reused. `wapitee-typhoonx` defaults tracked events to the surfaces the site has; `wapitee-typhoonx-hydrogen` lists the Package's subscribed events with their Hydrogen publishers, looks up the Shop ID through the Storefront API when env lacks it, and names `spell.typhoonx.io` for CSP.
- `wapitee-watermark` checks an existing CDN script against the official line, requires CSP `script-src` to allow jsDelivr, gives the Nuxt config shape, and covers SvelteKit / Remix / Angular entries.
- `wapitee-survey-webhook` reuses the repo's webhook env on audit, places the helper on any server framework, and keeps the payload Contract beside the Write step.
- Reports separate code checks the agent verifies from browser checks for the user.

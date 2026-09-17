# Skills For Wapitee

[![skills.sh](https://skills.sh/b/Wapitee-Interactive-Marketing-Limited/skills)](https://skills.sh/Wapitee-Interactive-Marketing-Limited/skills)

Agent skills for Wapitee tracking, Survey webhooks, and brand watermarking.

These skills encode the contracts agents cannot guess: `TPX-` merchant IDs, `q_N` answer keys, and the official console watermark CDN. Read this file, then open the matching `SKILL.md`.

## Install

```bash
npx skills@latest add Wapitee-Interactive-Marketing-Limited/skills
```

## Why use it?

Agents invent merchant IDs, camelCase event names, and inline ASCII logos. They put webhook secrets in the browser bundle. They skip the interrupt and generate code against a URL that does not exist.

These skills make the agent stop, collect the real IDs from [wapitee.io/admin](https://wapitee.io/admin), and wire the canonical integration. The skills do not overlap: tracking is TyphoonX (Hydrogen storefronts use the Hydrogen skill), form POST is Survey webhook, console branding is the watermark.

## Reference

- **[wapitee-typhoonx](./skills/wapitee-typhoonx/SKILL.md)** — TyphoonX on Next.js, React, Vue, or HTML: one `sendBeacon` helper, snake_case events, audit payload and `client_id`.
- **[wapitee-typhoonx-hydrogen](./skills/wapitee-typhoonx-hydrogen/SKILL.md)** — TyphoonX Hydrogen: wire, audit, or migrate `@wapitee/typhoonx-hydrogen`.
- **[wapitee-survey-webhook](./skills/wapitee-survey-webhook/SKILL.md)** — POST a site form to Wapitee Survey with `q_N` answers; audit Secret and payload.
- **[wapitee-watermark](./skills/wapitee-watermark/SKILL.md)** — Inject, diagnose, or migrate the console easter-egg CDN in the entry `<head>`.

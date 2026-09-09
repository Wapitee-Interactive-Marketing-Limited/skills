# Skills For Wapitee

[![skills.sh](https://skills.sh/b/Wapitee-Interactive-Marketing-Limited/wptskill)](https://skills.sh/Wapitee-Interactive-Marketing-Limited/wptskill)

Agent skills for Wapitee tracking, Survey webhooks, and brand watermarking.

These skills encode the contracts agents cannot guess: `TPX-` merchant IDs, `q_N` answer keys, and the official console watermark CDN. Read this file, then open the matching `SKILL.md`.

## Install

```bash
npx skills@latest add Wapitee-Interactive-Marketing-Limited/wptskill
```

## Why use it?

Agents invent merchant IDs, camelCase event names, and inline ASCII logos. They put webhook secrets in the browser bundle. They skip the interrupt and generate code against a URL that does not exist.

These skills make the agent stop, collect the real IDs from [wapitee.io/admin](https://wapitee.io/admin), and implement one helper against a fixed payload. The three skills do not overlap: tracking is TyphoonX, form POST is Survey webhook, console branding is the watermark.

## Reference

- **[wapitee-typhoonx](./skills/wapitee-typhoonx/SKILL.md)** — Install TyphoonX event tracking (`sendBeacon`, `snake_case`), map business actions to standard events, and audit existing payloads and `client_id`.
- **[wapitee-survey-webhook](./skills/wapitee-survey-webhook/SKILL.md)** — POST site forms to Wapitee Survey, map fields to `q_N`, and keep the webhook Secret on the server.
- **[wapitee-watermark](./skills/wapitee-watermark/SKILL.md)** — Inject the official console easter-egg CDN script into `<head>`, diagnose a missing watermark, and migrate leftover inline ASCII.

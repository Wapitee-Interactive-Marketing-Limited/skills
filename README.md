# Skills For Wapitee

[![skills.sh](https://skills.sh/b/Wapitee-Interactive-Marketing-Limited/skills)](https://skills.sh/Wapitee-Interactive-Marketing-Limited/skills)

Agent skills that wire Wapitee products into a website: TyphoonX tracking, Survey webhooks, and the console watermark.

A skill is a recipe, not a library. The tracker code lives in the npm packages `@wapitee/typhoonx-react` and `@wapitee/typhoonx-hydrogen`. The skill tells the agent which real values to collect and how to install the integration in one standard way.

## Install

```bash
npx skills@latest add Wapitee-Interactive-Marketing-Limited/skills
```

## Skills

- **[wapitee-typhoonx](./skills/wapitee-typhoonx/SKILL.md)**: wire, audit, or migrate `@wapitee/typhoonx-react` on a Next.js or React site. You provide the Merchant ID (`TPX-…`, from wapitee.io/admin) and the consent source.
- **[wapitee-typhoonx-hydrogen](./skills/wapitee-typhoonx-hydrogen/SKILL.md)**: wire, audit, or migrate `@wapitee/typhoonx-hydrogen` on a Shopify Hydrogen storefront. You provide the Merchant ID; the Shop ID comes from the Shopify store, through the Hydrogen `shop`.
- **[wapitee-survey-webhook](./skills/wapitee-survey-webhook/SKILL.md)**: POST a site form to a Wapitee Survey with `q_N` answer keys, or audit an existing push. You provide the Webhook URL and Secret (Survey → Setting → Webhook 接收).
- **[wapitee-watermark](./skills/wapitee-watermark/SKILL.md)**: inject the official console watermark CDN into the entry `<head>`, or replace inline ASCII leftovers. No input needed.

## Why

Without these skills, agents tend to make up merchant IDs, write their own tracker instead of installing the package, put webhook secrets in the browser bundle, and paste ASCII logos inline. Each skill makes the agent stop until it has the real values, then install the integration the standard way.

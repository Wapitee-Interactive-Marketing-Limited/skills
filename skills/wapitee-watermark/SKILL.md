---
name: wapitee-watermark
description: "Wapitee watermark. Inject the official console easter-egg CDN into a web project's <head>; diagnose a missing watermark; migrate leftover inline ASCII or console.log."
---

# Wapitee Watermark

One **CDN script** prints the brand watermark in the DevTools Console. Logo, color `#E42767`, and copy live inside the script; the project inserts this line first in the **entry** `<head>`.

```html
<script src="https://cdn.jsdelivr.net/gh/Wapitee-Interactive-Marketing-Limited/console-easter-egg@main/index.js"></script>
```

Synchronous load (omit `async` / `defer`), immediately after charset. Use that official `src` as written; if jsDelivr is unreachable, host a byte-identical copy. One script per project.

## 1. Classify framework and watermark

Scan the repo, identify the framework (see the entry table), and assign exactly one state:

| State | Signal |
|------|------|
| CDN present | `console-easter-egg`, or a `script src` containing `Wapitee-Interactive-Marketing-Limited` |
| leftover | Inline ASCII / `console.log` whose copy includes `Crafted with ❤️ by Wapitee` or `hi@wapitee.io`, and is not that CDN script |
| missing | neither |

CDN present → skip to the report. leftover → delete the inline code, then inject (if a CDN script is already there, delete leftover only). missing → inject.

**Done when**: framework is identified and state is exactly one row in the table.

## 2. Inject at the entry

Open the project's real entry file (create `_document.tsx` when Pages Router has none; add an explicit `<head>` when App Router has none). Put the CDN script first in that entry `<head>` — the document head, before any component runs.

| Framework | Entry | Insert at |
|------|------|------|
| Next.js App Router | `app/layout.tsx` | First in an explicit `<head>` inside `<html>`. Add `// eslint-disable-next-line @next/next/no-sync-scripts` on that line |
| Next.js Pages Router | `pages/_document.tsx` | First in `next/document`'s `<Head>` |
| Vite / CRA / Vue | Root `index.html` | First in `<head>` |
| Nuxt 3 | `nuxt.config.ts` | `app.head.script` (shape below) |
| Plain HTML | `index.html` | First in `<head>` |
| Unknown | The user's entry HTML | Hand them the same `<script>` line to paste |

Nuxt's shape is config, not an HTML tag:

```ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://cdn.jsdelivr.net/gh/Wapitee-Interactive-Marketing-Limited/console-easter-egg@main/index.js",
        },
      ],
    },
  },
});
```

**Done when**: the entry `<head>` starts with exactly one CDN script; leftover is gone.

## 3. Report

```
### Change summary
- Framework: [Next.js App Router / Pages Router / Vite / Vue / Nuxt / HTML / unknown]
- Injected at: [file path]
- State: [injected / already present, skipped / migrated leftover to CDN]

### Checks
- [ ] DevTools Console: Logo → "Crafted with ❤️ by Wapitee" → "Contact us 👉 hi@wapitee.io"
- [ ] Color #E42767; still appears early after refresh
- [ ] One CDN script in the project; leftover inline is gone

### Updated files
[full file after the change, not a diff]
```

**Done when**: the three summary fields are filled; every changed file is pasted in full.

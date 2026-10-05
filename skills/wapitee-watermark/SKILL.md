---
name: wapitee-watermark
description: "Wapitee watermark. Inject the official console easter-egg CDN script; diagnose a missing watermark; migrate leftover inline ASCII or console.log."
---

# Watermark

One **CDN script** prints the brand watermark in the DevTools Console. Logo, color `#E42767`, and copy live inside the script; the project inserts this line first in the **entry** `<head>`.

```html
<script src="https://cdn.jsdelivr.net/gh/Wapitee-Interactive-Marketing-Limited/console-easter-egg@main/index.js"></script>
```

Synchronous load (omit `async` / `defer`). **First** in `<head>` means the first tag after `<meta charset>`, or the very first tag when the head has no charset. Use that official `src` as written; if jsDelivr is unreachable, host a byte-identical copy. One script per project.

## Phase 1: Classify framework and watermark

Scan the repo, identify the framework (see the entry table), and assign exactly one state:

| State       | Signal                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| CDN present | `console-easter-egg`, or a `script src` containing `Wapitee-Interactive-Marketing-Limited`                                   |
| leftover    | Inline ASCII / `console.log` whose copy includes `Crafted with ❤️ by Wapitee` or `hi@wapitee.io`, and is not that CDN script |
| missing     | neither                                                                                                                      |

CDN present → check it against the official line: `src` as written, synchronous, first in the entry `<head>`, one per project, allowed by CSP. Conforming → skip to the report; any deviation → fix it in Phase 2. leftover → delete the inline code, then inject (if a CDN script is already there, delete leftover only). missing → inject.

**Done when**: framework is identified and state is exactly one row in the table.

## Phase 2: Inject at the entry

Open the project's real entry file (create `_document.tsx` when Pages Router has none; add an explicit `<head>` when App Router has none).

| Framework                                        | Entry                                                                                          | Insert at                                                                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Next.js App Router                               | `app/layout.tsx`                                                                               | First in an explicit `<head>` inside `<html>`. Add `// eslint-disable-next-line @next/next/no-sync-scripts` on that line |
| Next.js Pages Router                             | `pages/_document.tsx`                                                                          | First in `next/document`'s `<Head>`                                                                                      |
| Nuxt 3                                           | `nuxt.config.ts`                                                                               | `app.head.script: [{ src: "<official src>" }]`                                                                           |
| Vite / CRA / Vue / Plain HTML                    | Root `index.html`                                                                              | First in `<head>`                                                                                                        |
| Other (SvelteKit, Remix / React Router, Angular) | The file that renders the document `<head>` (`src/app.html`, `app/root.tsx`, `src/index.html`) | First in `<head>`                                                                                                        |
| None found                                       | —                                                                                              | Hand the user the `<script>` line to paste                                                                               |

When the site sets a Content-Security-Policy, `script-src` includes `https://cdn.jsdelivr.net`.

**Done when**: exactly one CDN script sits first in the entry `<head>`, CSP (when set) allows its origin, and leftover is gone.

## Phase 3: Report

```
### Change summary
- Framework: [Next.js App Router / Pages Router / Vite / Vue / Nuxt / HTML / other: name / none found]
- Injected at: [file path]
- State: [injected / already present, skipped / fixed existing CDN script / migrated leftover to CDN]

### Code checks
- [ ] One CDN script in the project; leftover inline is gone
- [ ] CSP script-src allows cdn.jsdelivr.net (when CSP is set)

### Checks for you
- [ ] DevTools Console: Logo → "Crafted with ❤️ by Wapitee" → "Contact us 👉 hi@wapitee.io"
- [ ] Color #E42767; still appears early after refresh

### Updated files
[full file after the change, not a diff]
```

**Done when**: the three summary fields are filled; every code check is verified in the repo and ticked; every changed file is pasted in full.

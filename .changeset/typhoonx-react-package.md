---
"wapitee-skills": major
---

Retarget `wapitee-typhoonx` to install `@wapitee/typhoonx-react` (`TyphoonXProvider` + `useTyphoonX()`) on Next.js and React. The hand-written `sendBeacon` helper for Vue and HTML is removed; events the Package has no method for (`begin_checkout`, `purchase`, `generate_lead`) are reported as Package gaps.

`wapitee-typhoonx-hydrogen` follows `@wapitee/typhoonx-hydrogen` 0.8: props come from the root loader's `context.env`, optional `measurementId`, and the cookie domain defaults to the apex domain.

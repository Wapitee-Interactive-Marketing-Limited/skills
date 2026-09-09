# TyphoonX tracker

Write this helper after inputs are complete. Replace the constants from the table below; business code calls `typhoonxTrack` only.

| Framework | File | Constants |
|------|------|------|
| Next.js | `lib/typhoonx.ts`, `'use client'` at the top | `process.env.NEXT_PUBLIC_TYPHOONX_MERCHANT_ID` / `SHOP_ID` / `COOKIE_DOMAIN`; write `.env.local` in the same step |
| React / Vite | `lib/typhoonx.ts` | Vite: `import.meta.env.VITE_TYPHOONX_*`; otherwise literals the user supplied |
| Vue 3 | `composables/useTyphoonx.ts`, ending `export function useTyphoonx() { return { track: typhoonxTrack } }` | `import.meta.env.VITE_TYPHOONX_*` |
| HTML | Page `<script>` | Literals |

```ts
const TYPHOONX_API = 'https://spell.typhoonx.io/api/v1/receive';
const MERCHANT_ID = /* from the table */;
const SHOP_ID = /* from the table; '' if absent */;
const COOKIE_DOMAIN = /* from the table; '' if absent */;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trimStart();
    if (cookie.startsWith(prefix)) return cookie.slice(prefix.length);
  }
  return null;
}

function setSessionCookie(name: string, value: string, domain?: string) {
  if (typeof document === 'undefined') return;
  let cookieStr = name + '=' + value + '; path=/; SameSite=Lax';
  if (domain) cookieStr += '; domain=' + domain;
  document.cookie = cookieStr;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getClientId(): string {
  if (typeof document === 'undefined') return '';
  const cookieName = '__typhoon_client_id';
  let clientId = getCookie(cookieName);
  if (!clientId || clientId.trim() === '') {
    clientId = generateUUID();
    setSessionCookie(cookieName, clientId, COOKIE_DOMAIN || undefined);
  }
  return clientId;
}

export function typhoonxTrack(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !MERCHANT_ID) return;

  const payload = {
    event: eventName,
    merchant_id: MERCHANT_ID,
    shop_id: SHOP_ID || '',
    client_id: getClientId(),
    referrer: document.referrer,
    request_page_url: window.location.href,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    ...(params || {}),
  };

  window.navigator.sendBeacon(
    TYPHOONX_API,
    new Blob([JSON.stringify(payload)], { type: 'application/json' }),
  );
}
```

Next.js `.env.local`:

```
NEXT_PUBLIC_TYPHOONX_MERCHANT_ID=
NEXT_PUBLIC_TYPHOONX_SHOP_ID=
NEXT_PUBLIC_TYPHOONX_COOKIE_DOMAIN=
```

`page_view`: App Router fires once from a client component in the root layout; an SPA fires once on root mount or `router.afterEach`.

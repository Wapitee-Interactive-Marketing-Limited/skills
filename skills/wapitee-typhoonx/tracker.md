# TyphoonX tracker

输入齐了再写这份 helper。常量按入口表替换；业务代码只调用 `typhoonxTrack`。

```
https://spell.typhoonx.io/api/v1/receive
```

| 框架 | 文件 | 常量 |
|------|------|------|
| Next.js | `lib/typhoonx.ts`，文件顶 `'use client'` | `process.env.NEXT_PUBLIC_TYPHOONX_MERCHANT_ID` / `SHOP_ID` / `COOKIE_DOMAIN`；同步写 `.env.local` |
| React / Vite | `lib/typhoonx.ts` | Vite 用 `import.meta.env.VITE_TYPHOONX_*`，否则用用户给的字面量 |
| Vue 3 | `composables/useTyphoonx.ts`，末尾 `export function useTyphoonx() { return { track: typhoonxTrack } }` | `import.meta.env.VITE_TYPHOONX_*` |
| HTML | 页面 `<script>` | 字面量 |

```ts
const TYPHOONX_API = 'https://spell.typhoonx.io/api/v1/receive';
const MERCHANT_ID = /* 入口表 */;
const SHOP_ID = /* 入口表，没有则 '' */;
const COOKIE_DOMAIN = /* 入口表，没有则 '' */;

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

Next.js `.env.local`：

```
NEXT_PUBLIC_TYPHOONX_MERCHANT_ID=
NEXT_PUBLIC_TYPHOONX_SHOP_ID=
NEXT_PUBLIC_TYPHOONX_COOKIE_DOMAIN=
```

`page_view`：App Router 用客户端组件在根 layout 调一次；SPA 在根组件 mount 或 `router.afterEach` 调一次。

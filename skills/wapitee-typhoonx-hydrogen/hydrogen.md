# TyphoonX Hydrogen

Write this after inputs are complete. One component, mounted inside `Analytics.Provider`. Business code goes through `subscribe`; `sendTyphoonx` is transport only.

| File | Constants |
|------|------|
| `app/components/TyphoonX.tsx` | `import.meta.env.PUBLIC_TYPHOONX_MERCHANT_ID` / `SHOP_ID` / `COOKIE_DOMAIN`; add the same keys to `Env` and `.env` |

| TyphoonX | `subscribe` |
|------|------|
| `page_view` | `page_viewed` |
| `view_item` | `product_viewed` |
| `add_to_cart` | `product_added_to_cart` |
| `remove_from_cart` | `product_removed_from_cart` |

Callback `data` stays unannotated. Map `products[]` or `currentLine.merchandise.product` through `parseGid(product.id).id`. Keep a `prevUrl` for `referrer` (first load: `document.referrer`).

```tsx
import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

const TYPHOONX_API = 'https://spell.typhoonx.io/api/v1/receive';
const MERCHANT_ID = import.meta.env.PUBLIC_TYPHOONX_MERCHANT_ID;
const SHOP_ID = import.meta.env.PUBLIC_TYPHOONX_SHOP_ID || '';
const COOKIE_DOMAIN = import.meta.env.PUBLIC_TYPHOONX_COOKIE_DOMAIN || '';

function getCookie(name: string): string | null {
  const prefix = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trimStart();
    if (cookie.startsWith(prefix)) return cookie.slice(prefix.length);
  }
  return null;
}

function getClientId(): string {
  const cookieName = '__typhoon_client_id';
  let clientId = getCookie(cookieName);
  if (!clientId || clientId.trim() === '') {
    clientId = crypto.randomUUID();
    let cookieStr = cookieName + '=' + clientId + '; path=/; SameSite=Lax';
    if (COOKIE_DOMAIN) cookieStr += '; domain=' + COOKIE_DOMAIN;
    document.cookie = cookieStr;
  }
  return clientId;
}

function sendTyphoonx(eventName: string, params?: Record<string, unknown>) {
  if (!MERCHANT_ID) return;

  const payload = {
    event: eventName,
    merchant_id: MERCHANT_ID,
    shop_id: SHOP_ID,
    client_id: getClientId(),
    referrer: document.referrer,
    request_page_url: window.location.href,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    ...(params || {}),
  };

  navigator.sendBeacon(
    TYPHOONX_API,
    new Blob([JSON.stringify(payload)], {type: 'application/json'}),
  );
}

export function TyphoonX() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('TyphoonX');

  useEffect(() => {
    let prevUrl = document.referrer;

    subscribe('page_viewed', (data) => {
      const url = data.url || window.location.href;
      sendTyphoonx('page_view', {referrer: prevUrl, request_page_url: url});
      prevUrl = url;
    });

    ready();
  }, []);

  return null;
}
```

`.env` (and `Env` in `env.d.ts`):

```
PUBLIC_TYPHOONX_MERCHANT_ID=
PUBLIC_TYPHOONX_SHOP_ID=
PUBLIC_TYPHOONX_COOKIE_DOMAIN=
```

Mount `<TyphoonX />` as a child of `Analytics.Provider` in the root layout. Add the requested `subscribe` rows from the table; each callback calls `sendTyphoonx` with the contract params.

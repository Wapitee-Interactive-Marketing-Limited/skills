# Survey webhook POST

Write this helper after inputs are complete. Replace the constants from the table below; form submit calls `submitSurvey` only.

| Framework | File | Constants |
|------|------|------|
| Next.js App Router | `app/actions/survey.ts`, `'use server'` at the top | `process.env.WAPITEE_SURVEY_WEBHOOK_URL` / `WAPITEE_SURVEY_WEBHOOK_SECRET`; write `.env.local` in the same step |
| Node / Express | Server route (e.g. `routes/survey.js`) as a proxy | Same env names; write `.env` |
| React / Vue / HTML (no backend) | `lib/surveyWebhook.ts` or a page `<script>` | Literals the user supplied; Secret will appear in source |

```ts
const WEBHOOK_URL = /* from the table */;
const WEBHOOK_SECRET = /* from the table */;

export async function submitSurvey(data: {
  email: string;
  answers: Record<string, string | string[]>;
  source?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    throw new Error('Webhook URL or Secret is not configured');
  }

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': WEBHOOK_SECRET,
    },
    body: JSON.stringify({
      email: data.email,
      answers: data.answers,
      source: data.source ?? 'website',
      metadata: data.metadata ?? {},
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Webhook failed: ${res.status} ${text}`);
  }

  return { success: true };
}
```

Next.js `.env.local` / Node `.env`:

```
WAPITEE_SURVEY_WEBHOOK_URL=
WAPITEE_SURVEY_WEBHOOK_SECRET=
```

Express calls `submitSurvey` from the route and returns 502 to the caller when the upstream status is not 2xx. Vue may `export function useSurveyWebhook() { return { submitSurvey } }`.

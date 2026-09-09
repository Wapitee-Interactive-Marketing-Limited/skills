# Survey webhook POST

输入齐了再写这份 helper。常量按入口表替换；表单提交只调用 `submitSurvey`。

| 框架 | 文件 | 常量 |
|------|------|------|
| Next.js App Router | `app/actions/survey.ts`，文件顶 `'use server'` | `process.env.WAPITEE_SURVEY_WEBHOOK_URL` / `WAPITEE_SURVEY_WEBHOOK_SECRET`；同步写 `.env.local` |
| Node / Express | 服务端路由（如 `routes/survey.js`）转发 | 同上，写 `.env` |
| React / Vue / HTML（无后端） | `lib/surveyWebhook.ts` 或页面 `<script>` | 用户给的字面量；Secret 会出现在源码 |

```ts
const WEBHOOK_URL = /* 入口表 */;
const WEBHOOK_SECRET = /* 入口表 */;

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

Next.js `.env.local` / Node `.env`：

```
WAPITEE_SURVEY_WEBHOOK_URL=
WAPITEE_SURVEY_WEBHOOK_SECRET=
```

Express 在路由里调 `submitSurvey`，上游非 2xx 时对本请求返回 502。Vue 可 `export function useSurveyWebhook() { return { submitSurvey } }`。

---
name: wapitee-survey-webhook-setup
description: "Survey webhook. POST a site form to Wapitee Survey; map fields to q_N; audit an existing push for Secret and answers."
---

# Survey webhook

POST a site email form to the Wapitee Survey webhook. `answers` keys are `q_1`, `q_2`, … — frontend field names stay out of the payload. **Secret** lives on the server.

## 1. Collect inputs

Stop when any required input is missing; list every gap in one pass. URL and Secret come from admin. Scan the repo form first; ask only for field names the scan cannot infer.

| Input | Required | Rule |
|------|------|------|
| `WEBHOOK_URL` | yes | wapitee.io/admin → the Survey → Setting > Webhook 接收 → enable → copy URL |
| `WEBHOOK_SECRET` | yes | Same page; request header `X-Webhook-Secret` |
| `FRAMEWORK` | yes | Scan the repo; if unknown, ask nextjs / react / vue / html / nodejs |
| Email field | yes | Frontend name → payload `email` |
| Question fields | yes | Frontend name per question, in order → `q_1`…`q_N`; mark which are multi-select |

Ask for the webhook:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → create or open the Survey → Setting > Webhook 接收 → turn it on, then send me the **Webhook URL** and **Secret**.

**Done when**: URL, Secret, and framework are present; email and every question have a frontend field name.

## 2. Classify the repo

| State | Signal |
|------|------|
| present | `X-Webhook-Secret`, `WAPITEE_SURVEY_WEBHOOK`, or a POST to a Survey webhook URL |
| missing | none of those |

present → patch `email` / `q_N` / Secret header to the contract; one helper. missing → once inputs are complete, read [post.md](post.md) and write one helper.

Prefer a server path (Next Server Action or Node proxy); Secret in an env var. Client `fetch` only when the project has no backend, and state that Secret will ship in source.

**Done when**: state is present or missing; the push path is a server or a declared client exception.

## 3. Contract

| Part | Rule |
|------|------|
| Method | `POST` |
| Headers | `Content-Type: application/json`, `X-Webhook-Secret: <Secret>` |
| `email` | required string |
| `answers` | object; keys strictly `q_1`, `q_2`, …`q_N`. Single-select / text is `string`; multi-select is `string[]` |
| `source` | optional, default `'website'` |
| `metadata` | optional object |

401 / Unauthorized → Secret header does not match admin. Admin says `email is required` → payload omitted `email`. Questions mismatch → keys are still frontend names. Multi-select arrives as one value → not an array.

**Done when**: every question has a `q_N`; multi-select is an array.

## 4. Write

Read [post.md](post.md). One helper; assemble the payload at the existing form submit and call it. Success/failure uses the project's toast or redirect.

**Done when**: one helper exists; a real form submit sends the contract POST.

## 5. Report

```
### Survey webhook summary
- Framework: [Next.js / Node / React / Vue / HTML]
- Push path: [Server Action / Express / client fetch]
- Fields: email ← [frontend name]; q_1 ← …; q_N ← …
- Files: [paths]

### Checks
- [ ] Webhook is on in admin; URL and Secret belong to this Survey
- [ ] answers keys are q_1…q_N; multi-select is string[]
- [ ] Secret is in a server env var (or a declared no-backend exception)
- [ ] A real submit shows up in the Survey admin

### Updated files
[full file after the change, not a diff]
```

**Done when**: the summary is filled; every changed file is pasted in full.

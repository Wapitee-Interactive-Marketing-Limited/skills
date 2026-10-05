---
name: wapitee-survey-webhook
description: "Wapitee Survey webhook. POST a site form to a Wapitee Survey, or audit an existing push for Secret and answers."
---

# Survey webhook

POST a site email form to the Wapitee Survey webhook. `answers` keys are `q_1`, `q_2`, … — frontend field names stay out of the payload. **Secret** lives on the server.

## Phase 1: Classify the repo

| State   | Signal                                                                          |
| ------- | ------------------------------------------------------------------------------- |
| present | `X-Webhook-Secret`, `WAPITEE_SURVEY_WEBHOOK`, or a POST to a Survey webhook URL |
| missing | none of those                                                                   |

Record what the scan finds: framework, existing `WAPITEE_SURVEY_WEBHOOK_*` env, and the form's field names. present → Phase 3 patches the existing push. missing → Phase 3 writes a new helper.

**Done when**: state is present or missing, and the framework, env, and form fields the repo has are recorded.

## Phase 2: Collect inputs

Stop when any required input is missing; list every missing input in one ask. Ask only for what the Phase 1 scan did not supply.

| Input            | Required | Rule                                                                                                   |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `WEBHOOK_URL`    | yes      | Env: `WAPITEE_SURVEY_WEBHOOK_URL`. Else from admin (ask below)                                         |
| `WEBHOOK_SECRET` | yes      | Env: `WAPITEE_SURVEY_WEBHOOK_SECRET`. Else from the same admin page; sent as header `X-Webhook-Secret` |
| `FRAMEWORK`      | yes      | From the Phase 1 scan; if unknown, ask which framework the site uses                                   |
| Email field      | yes      | Frontend name → payload `email`                                                                        |
| Question fields  | yes      | Frontend name per question, in order → `q_1`…`q_N`; mark which are multi-select                        |

Ask for the webhook:

> Sign in at [wapitee.io/admin](https://wapitee.io/admin) → create or open the Survey → Setting > Webhook 接收 → turn it on, then send me the **Webhook URL** and **Secret**.

**Done when**: URL and Secret are values the user pasted or the repo's env holds, framework is known, and email and every question have a frontend field name.

## Phase 3: Write

Prefer a server path (Server Action, API / server route, or Node proxy); Secret in an env var. Client `fetch` only when the project has no backend, and state that Secret will ship in source.

Read [post.md](post.md) for the helper and where it lives per framework. present → patch the existing push to the Contract below and fold it into one helper. missing → write one helper from post.md. Either way, assemble the payload at the existing form submit and call the helper; success/failure uses the project's toast or redirect.

**Contract**:

| Part       | Rule                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Method     | `POST`                                                                                                   |
| Headers    | `Content-Type: application/json`, `X-Webhook-Secret: <Secret>`                                           |
| `email`    | required string                                                                                          |
| `answers`  | object; keys strictly `q_1`, `q_2`, …`q_N`. Single-select / text is `string`; multi-select is `string[]` |
| `source`   | optional, default `'website'`                                                                            |
| `metadata` | optional object                                                                                          |

401 / Unauthorized → Secret header does not match admin. Admin says `email is required` → payload omitted `email`. Questions mismatch → keys are still frontend names. Multi-select arrives as one value → not an array.

**Done when**: the push path is a server or a declared client exception; one helper exists, and the existing form submit calls it with a payload that meets the Contract: every question under its `q_N` key, multi-select as `string[]`.

## Phase 4: Report

```
### Survey webhook summary
- Framework: [Next.js / Nuxt / Node / React / Vue / HTML / other: name]
- Push path: [Server Action / API or server route / Express / client fetch]
- Fields: email ← [frontend name]; q_1 ← …; q_N ← …
- Files: [paths]

### Code checks
- [ ] answers keys are q_1…q_N; multi-select is string[]
- [ ] Secret is in a server env var (or a declared no-backend exception)

### Checks for you
- [ ] Webhook is on in admin; URL and Secret belong to this Survey
- [ ] A real submit shows up in the Survey admin

### Updated files
[full file after the change, not a diff]
```

**Done when**: the summary is filled; every code check is verified in the repo and ticked; every changed file is pasted in full.

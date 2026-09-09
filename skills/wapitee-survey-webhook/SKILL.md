---
name: wapitee-survey-webhook-setup
description: "Survey webhook。把站点表单 POST 到 Wapitee Survey；把字段映射成 q_N；核对已有推送的 Secret 与 answers。"
---

# Survey webhook

把邮箱表单 **POST** 到 Wapitee Survey 的 Webhook。`answers` 的键是 `q_1`、`q_2`…（不是前端字段名）。**Secret** 放服务端。

## 1. 收齐输入

缺任何一项就停，把缺的一次列齐。不编造 Webhook URL 或 Secret。先扫仓库里的表单：能推断的字段名不问。

| 输入 | 必填 | 规则 |
|------|------|------|
| `WEBHOOK_URL` | 是 | wapitee.io/admin → 选定 Survey → Setting > Webhook 接收 → 打开开关 → 复制 URL |
| `WEBHOOK_SECRET` | 是 | 同一页创建的密钥，请求头 `X-Webhook-Secret` |
| `FRAMEWORK` | 是 | 先扫仓库；认不出再问 nextjs / react / vue / html / nodejs |
| 邮箱字段 | 是 | 前端变量名，映射到 payload `email` |
| 各题字段 | 是 | 每题的前端变量名，按顺序映射到 `q_1`…`q_N`；标明哪些是多选 |

Webhook URL 提问：

> 登录 [wapitee.io/admin](https://wapitee.io/admin) → 创建或选择 Survey → Setting > Webhook 接收 → 打开开关，把 **Webhook URL** 和 **Secret** 发给我。

**完成**：URL、Secret、框架已齐；邮箱和每道题都有前端字段名。

## 2. 判定仓库状态

| 状态 | 判定 |
|------|------|
| 已有 | 出现 `X-Webhook-Secret`、`WAPITEE_SURVEY_WEBHOOK` 或向 Survey Webhook URL 的 POST |
| 缺失 | 都无 |

已有 → 按契约补 `email` / `q_N` / Secret 头，不第二份 helper。缺失 → 输入齐之后读 [post.md](post.md) 写入一份。

能走服务端就走服务端（Next Server Action 或 Node 转发），Secret 进环境变量。没有后端时才客户端 `fetch`，并写明 Secret 会进源码。

**完成**：状态二者居一；推送路径是服务端或已声明的客户端例外。

## 3. 契约

| | |
|--|--|
| 方法 | `POST` |
| Headers | `Content-Type: application/json`，`X-Webhook-Secret: <Secret>` |
| `email` | 必填 string |
| `answers` | 对象；键严格 `q_1`、`q_2`…`q_N`。单选/文本为 `string`，多选为 `string[]` |
| `source` | 可选，默认 `'website'` |
| `metadata` | 可选对象 |

401 / Unauthorized → Secret 头与后台不一致。后台报 `email is required` → payload 缺 `email`。题目对不上 → 键仍是前端字段名。多选只收到一个值 → 没用数组。

**完成**：每道题都有对应 `q_N`；多选为数组。

## 4. 写入

读 [post.md](post.md)。helper 一份；在现有表单提交处组 payload 再调用。成功/失败走项目已有的 toast 或跳转。

**完成**：一份 helper；真实表单提交会发出契约里的 POST。

## 5. 报告

```
### Survey webhook 摘要
- 框架: [Next.js / Node / React / Vue / HTML]
- 推送路径: [Server Action / Express / 客户端 fetch]
- 字段: email ← [前端名]；q_1 ← …；q_N ← …
- 文件: [路径]

### 核对
- [ ] 后台已开 Webhook；URL 与 Secret 来自该 Survey
- [ ] answers 键为 q_1…q_N；多选为 string[]
- [ ] Secret 不在客户端 bundle（除非已声明无后端）
- [ ] 真实提交后 Survey 后台能看到这条

### 更新后的代码
[修改后的完整文件，不是 diff]
```

**完成**：摘要填齐；有改文件则贴出全文。

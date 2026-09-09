---
name: wapitee-typhoonx-setup
description: "TyphoonX。给 Web 项目接入 Wapitee 事件追踪（sendBeacon、snake_case）；把业务行为映射到标准事件；核对已有埋点的 payload 与 client_id。"
---

# TyphoonX

Wapitee 站内追踪。浏览器用 **sendBeacon** 把 JSON Blob 打到 `https://spell.typhoonx.io/api/v1/receive`。事件名和电商参数与 GA4 同形，但不是 GA4。

## 1. 收齐输入

缺任何一项就停，把缺的一次列齐。不编造 Merchant ID 或 Shop ID。先扫仓库：框架和已有 env 能推断的不问。

| 输入 | 必填 | 规则 |
|------|------|------|
| `TYPHOONX_MERCHANT_ID` | 是 | 必须以 `TPX-` 开头。来源：wapitee.io/admin → TyphoonX > Merchant Management |
| `FRAMEWORK` | 是 | 先扫仓库；认不出再问 nextjs / react / vue / html |
| 站点类型 | 是 | 电商 / 线索 / 内容 / SaaS |
| 追踪行为 | 是 | 只实现用户要的标准事件 |
| `SHOP_ID` | 否 | 没有则 `''` |
| `COOKIE_DOMAIN` | 否 | 仅跨子域名共享 `__typhoon_client_id` 时需要 |

Merchant ID 提问：

> 登录 [wapitee.io/admin](https://wapitee.io/admin) → TyphoonX > Merchant Management，复制 Merchant ID。必须以 `TPX-` 开头（如 `TPX-12345678`）。

已给但不是 `TPX-` 开头 → 停，请用户回后台重拷。

**完成**：Merchant ID 为 `TPX-…`，且框架、站点类型、事件列表已齐。

## 2. 判定仓库状态

| 状态 | 判定 |
|------|------|
| 已有 | 出现 `spell.typhoonx.io` 或 `typhoonxTrack` |
| 缺失 | 两者都无 |

已有 → 按契约补缺字段，不第二份 helper。缺失 → 输入齐之后读 [tracker.md](tracker.md) 写入一份。

**完成**：状态二者居一。

## 3. 契约与事件

每个事件的 **payload** 都带这 8 个字段：

| 字段 | 来源 |
|------|------|
| `event` | 下表 `snake_case` 名 |
| `merchant_id` | `TYPHOONX_MERCHANT_ID` |
| `shop_id` | `SHOP_ID` 或 `''` |
| `client_id` | cookie `__typhoon_client_id`；没有则生成 UUID v4 并写入 Session cookie（`path=/; SameSite=Lax`，有 `COOKIE_DOMAIN` 再加 `domain`） |
| `referrer` | `document.referrer` |
| `request_page_url` | `window.location.href` |
| `timestamp` | `new Date().toISOString()` |
| `user_agent` | `navigator.userAgent` |

传输：`navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }))`。

| 行为 | 事件 | 必填 | 可选 |
|------|------|------|------|
| 页面浏览 | `page_view` | — | — |
| 查看商品 | `view_item` | `currency`, `items`, `value` | — |
| 加入购物车 | `add_to_cart` | `currency`, `items`, `value` | — |
| 移除购物车 | `remove_from_cart` | `currency`, `items`, `value` | — |
| 开始结账 | `begin_checkout` | — | `currency`, `items`, `value`, `coupon` |
| 购买完成 | `purchase` | `currency`, `items`, `transaction_id`, `value` | `tax`, `shipping`, `coupon` |
| 提交线索 | `generate_lead` | — | `email`, `lead_source`, `value`, `currency`, `transaction_id` |

`items` 每项含 `item_id`、`item_name`、`price`、`quantity`（其余如 `item_category` 按需）。`page_view` 在客户端入口打一次。

**完成**：用户要的每条行为都有事件名和必填参数。

## 4. 写入

读 [tracker.md](tracker.md)。helper 一份；按入口接环境变量；在真实点击/提交/路由处调用。

**完成**：一份 helper；payload 八字段齐全；用户要的事件都有调用点。

## 5. 报告

```
### TyphoonX 埋点配置摘要
- Merchant ID: [TPX-…]
- Shop ID: [值或空]
- 框架: [Next.js / React / Vue / HTML]
- 站点类型: [电商 / 线索 / 内容 / SaaS]
- 事件: [实际写入的事件名]
- 文件: [路径]

### 核对
- [ ] payload 含八个基础字段；事件名为 snake_case
- [ ] purchase（如有）含 currency、items、transaction_id、value
- [ ] items（如有）含 item_id、item_name、price、quantity
- [ ] __typhoon_client_id 会写入；跨子域名时 domain 已设
- [ ] Network 里 spell.typhoonx.io/api/v1/receive 返回 200

### 更新后的代码
[修改后的完整文件，不是 diff]
```

**完成**：摘要填齐；有改文件则贴出全文。

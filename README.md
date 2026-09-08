# Wapitee agent skills

本仓库是 Wapitee 团队内部使用的 Agent Skill 目录，按发布者命名空间存放 Markdown skill。安装后，Agent 应**先读本文件**匹配意图，再加载对应 `SKILL.md`，不要凭猜测选用 skill。

当前目录：

| 命名空间 | 内容 |
|:---|:---|
| `wapitee/` | 团队自维护：追踪埋点、Survey Webhook、品牌水印 |
| `finsilabs/` | 电商广告投放（Meta / Google Ads / TikTok） |
| `henkisdabro/` | GA4 完整参考（属性、GTM、BigQuery、Measurement Protocol 等） |

## 安装 Skill

```bash
npx skills add Wapitee-Interactive-Marketing-Limited/wptskill
```

> **AI 读取规则**：用户发起请求时，先读本文件匹配下方技能列表，再读对应 `SKILL.md`。涉及已知坑时，再读 `FEEDBACK_LOG.md`。

## Skill 速查表

| 匹配优先级 | 触发场景（关键词/意图） | Skill 文件路径 | Skill 名称 |
|:---|:---|:---|:---|
| **P0** | Meta Pixel / Facebook Pixel / `fbq` / Lead 追踪 / Pixel ID / 落地页 Pixel | `wapitee/meta-pixel-tracking-with-privacy-v2/SKILL.md` | `meta-pixel-tracking` |
| **P0** | 在项目中生成 GA4 `gtag` 代码、Consent Mode、自定义事件、Meta-GA4 事件对照 | `wapitee/google-analytics-4-setup/SKILL.md` | `google-analytics-4-setup` |
| **P0** | `TyphoonX` 埋点配置 / 对接 / 追踪（非独立落地页） | `wapitee/wapitee-typhoonx/SKILL.md` | `wapitee-typhoonx-setup` |
| **P1** | TyphoonX 实现规范、现有集成审计、`sendBeacon`、`client_id`、payload 字段 | `wapitee/typhoonx-integration/SKILL.md` | `typhoonx-integration` |
| **P1** | 独立落地页 TyphoonX：`page_view` / `engaged_view` / `generate_lead` | `wapitee/landingpage_typhoonx_installation/SKILL.md` | `landingpage-typhoonx-installation` |
| **P1** | `clarity` + `gdpr` / 隐私 / cookie banner / consent mode / 同意管理 | `wapitee/microsoft-clarity-gdpr-control/SKILL.md` | `microsoft-clarity-gdpr-control` |
| **P1** | Clarity 基础埋点、自定义事件、热力图、用户行为追踪（不含隐私/Consent） | `wapitee/microsoft-clarity-setup/SKILL.md` | `microsoft-clarity-setup` |
| **P1** | `wapitee survey webhook`、survey 推送、webhook 接收、留邮箱推送 | `wapitee/wapitee-survey-webhook/SKILL.md` | `wapitee-survey-webhook-setup` |
| **P1** | Wapitee 水印、`watermark`、console logo、console 水印 | `wapitee/wapitee-watermark/SKILL.md` | `wapitee-watermark` |
| **P1** | Meta/Facebook/Instagram **广告投放**、CAPI、DPA、catalog、Ads Manager 转化偏低 | `finsilabs/meta-ads-integration/SKILL.md` | `meta-ads-integration` |
| **P1** | Google Ads / Performance Max / Shopping / Smart Bidding / ROAS 投放 | `finsilabs/google-ads-ecommerce/SKILL.md` | `google-ads-ecommerce` |
| **P1** | TikTok Ads / Events API / Spark Ads / 商品目录广告 | `finsilabs/tiktok-ads-integration/SKILL.md` | `tiktok-ads-integration` |
| **P2** | GA4 深度参考：属性配置、GTM、BigQuery、Measurement Protocol、DebugView、Enhanced Conversions、受众、报表 | `henkisdabro/google-analytics/SKILL.md` | `google-analytics` |

## 冲突解决规则

多个 skill 可能同时匹配时，按以下规则决策。

### 1. Microsoft Clarity 二选一

```
IF 用户输入包含 (gdpr OR 隐私 OR cookie banner OR consent OR 合规 OR 同意):
    → microsoft-clarity-gdpr-control
ELSE IF 用户输入包含 (埋点 OR 自定义事件 OR 热力图 OR 追踪 OR tracking OR event):
    → microsoft-clarity-setup
ELSE:
    → 询问用户：隐私合规 vs 基础埋点/自定义事件
```

### 2. TyphoonX 三选一

```
IF 独立落地页 / Landing Page / engaged_view / 轻量 page_view+generate_lead:
    → landingpage_typhoonx_installation
ELSE IF 审计现有集成 / sendBeacon 规范 / client_id / payload 字段校验:
    → typhoonx-integration
ELSE:
    → wapitee-typhoonx-setup（中断式收集 Merchant ID 与技术栈后生成代码）
    → 生成实现时如需对照上报契约，再读 typhoonx-integration
```

### 3. GA4：代码生成 vs 深度参考

```
IF 在网站/落地页生成 gtag、Consent Mode、标准事件、与 Meta/Clarity 对照:
    → google-analytics-4-setup
IF 属性/数据流配置、GTM、BigQuery、Measurement Protocol、DebugView、
   user_data / Enhanced Conversions、受众、报表、数据管理:
    → henkisdabro/google-analytics
IF 落地页埋点同时需要 Enhanced Conversions 或 user_data:
    → 两者都读：先 google-analytics-4-setup 生成代码，再读 henkisdabro 对应 references
```

### 4. Meta Pixel 埋点 vs Meta Ads 投放

```
IF Pixel / fbq / Lead / 落地页转化追踪 / Advanced Matching:
    → meta-pixel-tracking
IF 广告账户、CAPI 服务端、DPA、商品目录、Ads Manager 投放与 ROAS:
    → meta-ads-integration
IF 落地页 Pixel + 投放/CAPI 都要做:
    → 两者都读
```

### 5. Meta + GA4 组合埋点

```
IF 同时包含 (meta OR facebook OR fbq) AND (ga4 OR google analytics OR gtag):
    → 同时读取 meta-pixel-tracking 和 google-analytics-4-setup
    → Meta 事件 PascalCase，GA4 事件 snake_case
    → 同一业务场景生成两套正确命名的事件代码
```

### 6. Google Ads 投放 vs GA4 埋点

```
IF Performance Max / Shopping / Smart Bidding / 广告账户结构:
    → google-ads-ecommerce
IF gtag / Measurement ID / GA4 事件:
    → 走第 3 条 GA4 规则
IF 投放依赖转化追踪且项目里还没有 GA4:
    → 先 google-analytics-4-setup（或询问 Measurement ID），再 google-ads-ecommerce
```

## Skill 清单（详细版）

### Wapitee

#### `meta-pixel-tracking`
- **文件**：`wapitee/meta-pixel-tracking-with-privacy-v2/SKILL.md`
- **作用**：Meta Pixel 隐私合规安装与 Lead 转化追踪
- **核心能力**：Pixel base code、PageView、Lead；GDPR/ePrivacy/CCPA（Consent Mode、Limited Data Use）；SHA-256 邮箱哈希（Advanced Matching）；CAPI Event ID 去重
- **必备信息**：Pixel ID（缺失则中断询问）

#### `google-analytics-4-setup`
- **文件**：`wapitee/google-analytics-4-setup/SKILL.md`
- **作用**：在项目中生成 GA4 基础埋点，并提供 Meta-GA4 事件命名对照
- **核心能力**：gtag 与 Consent Mode V2；标准/自定义事件；与 Meta Pixel / Clarity 的统一 consent 层
- **必备信息**：GA4 Measurement ID（缺失则中断询问）

#### `wapitee-typhoonx-setup`
- **文件**：`wapitee/wapitee-typhoonx/SKILL.md`
- **作用**：TyphoonX 中断式埋点配置，生成多技术栈追踪代码
- **核心能力**：强制收集 `TPX-` Merchant ID；电商 / 线索 / 内容站 / SaaS 事件映射；`sendBeacon` JSON Blob 上报
- **必备信息**：`TYPHOONX_MERCHANT_ID`、技术栈、站点类型、关键行为

#### `typhoonx-integration`
- **文件**：`wapitee/typhoonx-integration/SKILL.md`
- **作用**：TyphoonX 浏览器端实现规范与现有集成审计
- **核心能力**：上报地址与 payload 契约、`__typhoon_client_id`、GA4 风格 `snake_case` 事件、框架接入点
- **必备信息**：`TYPHOONX_MERCHANT_ID`、技术栈、站点类型、需追踪行为

#### `landingpage-typhoonx-installation`
- **文件**：`wapitee/landingpage_typhoonx_installation/SKILL.md`
- **作用**：独立落地页轻量 TyphoonX 安装
- **核心能力**：自动 `page_view`、停留 5 秒 `engaged_view`、手动 `generate_lead`；`client_id` 留空（非 Shopify）
- **必备信息**：`merchant_id`（如 `TPX-LANDING-001`）

#### `microsoft-clarity-gdpr-control`
- **文件**：`wapitee/microsoft-clarity-gdpr-control/SKILL.md`
- **作用**：Clarity 与 Cookie Banner 的隐私合规控制
- **核心能力**：Consent Mode V2（延迟加载、同意级别、无 Cookie 模式）；对接 Cookiebot / OneTrust / Osano / 自建 Banner
- **必备信息**：同意级别（拒绝 / 仅分析 / 全部同意）

#### `microsoft-clarity-setup`
- **文件**：`wapitee/microsoft-clarity-setup/SKILL.md`
- **作用**：Clarity 基础埋点与自定义事件
- **核心能力**：HTML / Next.js / React / Vue / Nuxt 基础代码；按自然语言生成 hover / click / scroll / form 事件
- **必备信息**：Clarity Project ID（基础埋点模式）

#### `wapitee-survey-webhook-setup`
- **文件**：`wapitee/wapitee-survey-webhook/SKILL.md`
- **作用**：把邮箱收集表单经 Webhook POST 到 Wapitee Survey
- **核心能力**：引导从 wapitee.io/admin 取 URL 与 Secret；生成 Next.js / React / Vue / HTML / Node.js 推送代码；`answers` 必须为 `q_1` / `q_2` / `q_3`
- **必备信息**：`WEBHOOK_URL`、`WEBHOOK_SECRET`、`FRAMEWORK`、前端表单字段名

#### `wapitee-watermark`
- **文件**：`wapitee/wapitee-watermark/SKILL.md`
- **作用**：在 `<head>` 用一行官方脚本注入 console 品牌水印
- **核心能力**：CDN 脚本输出 ASCII Logo 与文案（`#E42767`）；覆盖 Next.js / React / Vue / Nuxt / 纯 HTML；项目侧不内嵌 ASCII art
- **必备信息**：无

### 广告投放（finsilabs）

#### `meta-ads-integration`
- **文件**：`finsilabs/meta-ads-integration/SKILL.md`
- **作用**：Meta（Facebook/Instagram）电商广告与 Conversions API
- **核心能力**：Pixel + CAPI、Dynamic Product Ads、catalog 同步；Shopify / WooCommerce / BigCommerce 优先走官方集成

#### `google-ads-ecommerce`
- **文件**：`finsilabs/google-ads-ecommerce/SKILL.md`
- **作用**：电商 Google Ads 投放与转化追踪
- **核心能力**：Performance Max、Shopping feed、Smart Bidding / ROAS；转化标签是优化前提

#### `tiktok-ads-integration`
- **文件**：`finsilabs/tiktok-ads-integration/SKILL.md`
- **作用**：TikTok 电商广告与 Events API
- **核心能力**：Pixel + Events API、Spark Ads、商品目录 / Shopping Ads

### 分析参考（henkisdabro）

#### `google-analytics`
- **文件**：`henkisdabro/google-analytics/SKILL.md`
- **作用**：GA4 完整参考，不替代 `google-analytics-4-setup` 的项目内代码生成
- **核心能力**：setup / events / GTM / gtag / Measurement Protocol / DebugView / privacy / BigQuery / user_data；按 `SKILL.md` 决策树再读 `references/`

## 给团队的使用方式

### 核心原则：直接提需求，由 Agent 匹配

不必手动指定 skill。只要 Agent 先读本 README，就会按意图选择；跨 skill 需求（例如 Meta + GA4）会按冲突规则组合。

### 系统 Prompt 配置（推荐）

把「安装后的本仓库根目录」换成实际路径：

```
You have access to the Wapitee skill repository.

Before answering any user request:
1. Read README.md to determine which skill(s) to use
2. Read FEEDBACK_LOG.md for known issues
3. Read the matched SKILL.md file(s)
4. Follow the skill instructions strictly
5. After generating output, present the Post-Deployment Checklist from the skill when it has one
6. Ask the user: "是否需要将本次遇到的问题或改进建议记录到 FEEDBACK_LOG.md？"
```

### 组合调用示例

| 用户说的话 | Agent 的行为 |
|:---|:---|
| 「帮我加 Meta Pixel」 | 读 `meta-pixel-tracking` → 生成代码 → 输出自检清单 |
| 「同时做 Meta Pixel 和 GA4，还有 Cookie Banner」 | 读 `meta-pixel-tracking` + `google-analytics-4-setup` + `microsoft-clarity-gdpr-control` |
| 「接 TyphoonX」 | 读 `wapitee-typhoonx-setup`，实现时对照 `typhoonx-integration` |
| 「落地页装 TyphoonX」 | 读 `landingpage_typhoonx_installation` |
| 「GA4 要做 Enhanced Conversions」 | 读 `google-analytics-4-setup` + `henkisdabro/google-analytics` 的 `references/user-provided-data.md` |
| 「加 Wapitee 水印」 | 读 `wapitee-watermark` → 在 `<head>` 注入官方 script |

### 反馈日志

`FEEDBACK_LOG.md` 是团队共同知识库：
- **读取**：回答 skill 相关问题前应先读，避免重复踩坑。
- **写入**：完成后询问「要不要记一条反馈？」；仅在用户明确同意后追加。

## 新增 Skill 规范

1. 复制 `SKILL_TEMPLATE.md` 作为起点
2. 路径为 `{publisher}/{skill-name}/SKILL.md`；团队自维护 skill 放在 `wapitee/`
3. 目录名使用小写英文，单词间用连字符 `-`
4. **必须**包含 YAML frontmatter（至少 `name`、`description`）
5. 完成后更新本 README 的速查表、冲突规则（若有重叠）和详细清单

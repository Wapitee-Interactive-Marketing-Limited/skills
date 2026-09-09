---
name: wapitee-watermark
description: "Wapitee 水印 / watermark。向 Web 项目 <head> 注入官方 console 彩蛋 CDN 脚本；排查水印缺失；把旧版内联 ASCII 或 console.log 迁到该脚本。"
---

# Wapitee Watermark

一行 **CDN 脚本** 在 DevTools Console 打出品牌水印。Logo、颜色 `#E42767`、文案都在脚本内固化；项目只在 **入口** 的 `<head>` 最前插入这一行。

```
https://cdn.jsdelivr.net/gh/Wapitee-Interactive-Marketing-Limited/console-easter-egg@main/index.js
```

```html
<script src="https://cdn.jsdelivr.net/gh/Wapitee-Interactive-Marketing-Limited/console-easter-egg@main/index.js"></script>
```

同步加载（省略 `async` / `defer`），紧跟 charset。`src` 用官方地址原样；内网不可达时镜像同一份 JS，不改内容。一项目一份。

## 1. 判定框架与水印状态

扫描仓库，识别框架（见入口表）并归入三种状态之一：

| 状态 | 判定 |
|------|------|
| 已有 CDN | 出现 `console-easter-egg`，或 `script src` 含 `Wapitee-Interactive-Marketing-Limited` |
| 残留 | 项目源码里有内联 ASCII / `console.log`，文案含 `Crafted with ❤️ by Wapitee` 或 `hi@wapitee.io`，且不是上面那份 CDN 脚本 |
| 缺失 | 两者都无 |

已有 CDN → 不改文件，进入报告。残留 → 删掉内联代码后再注入（已有 CDN 则只删残留，不第二份脚本）。缺失 → 注入。

**完成**：框架已识别，且状态为上表三者之一。

## 2. 按入口注入

打开项目里真实的入口文件（没有 `_document.tsx` 就按 Next 惯例新建；App Router 没有 `<head>` 就加上）。把 CDN 脚本放在该入口 `<head>` 最前，不要放进组件 `useEffect` / `onMounted` / `useHead`。

| 框架 | 入口 | 插入点 |
|------|------|--------|
| Next.js App Router | `app/layout.tsx` | `<html>` 内显式 `<head>` 最前。该行加 `// eslint-disable-next-line @next/next/no-sync-scripts` |
| Next.js Pages Router | `pages/_document.tsx` | `next/document` 的 `<Head>` 最前 |
| Vite / CRA / Vue | 根目录 `index.html` | `<head>` 最前 |
| Nuxt 3 | `nuxt.config.ts` | `app.head.script`（见下） |
| 纯 HTML | `index.html` | `<head>` 最前 |
| 未知 | 用户入口 HTML | 把同一行 `<script>` 交给用户粘贴 |

Nuxt 的形状不是 HTML 标签：

```ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://cdn.jsdelivr.net/gh/Wapitee-Interactive-Marketing-Limited/console-easter-egg@main/index.js",
        },
      ],
    },
  },
});
```

**完成**：入口 `<head>` 最前恰好一份 CDN 脚本；残留已清。

## 3. 报告

```
### 变更摘要
- 框架: [Next.js App Router / Pages Router / Vite / Vue / Nuxt / HTML / 未知]
- 注入位置: [文件路径]
- 状态: [已注入 / 已存在，跳过 / 已从旧版迁移到 CDN]

### 核对
- [ ] DevTools Console：Logo → "Crafted with ❤️ by Wapitee" → "Contact us 👉 hi@wapitee.io"
- [ ] 颜色 #E42767；刷新后仍在加载早期出现
- [ ] 项目里只有一份 CDN 脚本，残留内联已清理

### 更新后的代码
[修改后的完整文件，不是 diff]
```

**完成**：摘要三字段填齐；有改文件则贴出全文。

# Somnus Blog

Somnus 的个人博客源码仓库，基于 [Hugo](https://gohugo.io/) 和 [Blowfish](https://blowfish.page/) 构建。当前站点保留了私密文章端到端加密工作流，并额外定制了首页、归档、分类、中文字体、搜索和页脚等体验。

## 环境要求

- Git
- Go
- Hugo Extended
- Node.js
- pnpm

检查本地环境：

```bash
go version
hugo version
node --version
pnpm --version
```

首次拉取后安装前端依赖：

```bash
pnpm install
```

## 本地预览

Hugo 开发服务器适合快速看页面结构：

```bash
pnpm run dev
```

生产构建：

```bash
pnpm run build
```

`pnpm run build` 会执行：

```bash
hugo --gc --minify --cleanDestinationDir
```

## 常用目录

- `content/post/`：公开文章
- `content/page/`：独立页面，比如归档、友链、私密入口
- `content/categories/`、`content/tags/`：分类和标签的索引页
- `.private/`：私密文章明文源文件，不提交到仓库
- `static/encrypted/`：私密文章加密后的 JSON，会发布到站点
- `static/fonts/`：自定义字体
- `static/js/encrypted-content.js`：浏览器端解密脚本
- `assets/css/somnus.css`：站点自定义样式
- `layouts/shortcodes/`：加密短代码
- `layouts/categories/`：分类总览和分类详情模板
- `layouts/page/archives.html`：归档页模板
- `layouts/_partials/hbx/blocks/somnus-recent-posts/`：首页最新文章 block，会排除日记分类
- `scripts/`：加密、解密、同步脚本
- `config/_default/`：Hugo 和主题配置

## 写公开文章

新建普通文章可以放在 `content/post/` 下：

```markdown
---
title: 文章标题
date: 2026-05-11T20:00:00+08:00
draft: false
categories:
  - 学习日志
tags:
  - llm
---

这里是正文。
```

构建时，`post` 分区会按照 `config/_default/permalinks.toml` 生成 `/p/:slug/` 形式的链接。

## 分类与归档

分类来自文章 front matter 的 `categories` 字段。站点会自动生成：

- `/categories/`：分类总览
- `/categories/<分类名>/`：某个分类下的文章列表
- `/archives/`：按年份归档的全部文章列表

首页的“最新文章”使用自定义 Hugo Blox block，会排除 `categories: 日记` 的文章。日记仍会出现在 `/post/`、`/archives/` 和 `/categories/日记/` 中。

## 搜索

搜索由 Blowfish 的标题栏搜索按钮和 Hugo 自动生成的 `/index.json` 提供。生产构建会包含该索引，无需额外生成搜索文件。

## 私密加密文章

私密文章采用 `.private` 作为明文源头。标题、日期、分类、公开摘要和私密正文都写在 `.private` 里的 Markdown 文件中。

示例：

```markdown
---
title: 2026-05-11 私密日记
slug: 2026-05-11-私密日记
date: 2026-05-11T20:00:00+08:00
draft: false
categories:
  - 日记
tags:
  - private
comments: false
toc: false
encryptedTitle: 私密正文
privateIntro: 这篇文章需要解锁后查看正文。
privateIndex: true
---

## 私密正文

这里的内容会被加密到 JSON，不会出现在公开文章里。
```

字段说明：

- `title`、`slug`、`date`、`categories`、`tags`：公开文章元信息
- `encryptedTitle`：解密框标题
- `encryptedHint`：可选，解密输入框提示
- `privateIntro`：公开壳文章里显示的说明文字
- `privateIndex`：是否显示在 `/private/` 私密目录页

然后在 `encrypted-manifest.json` 中添加路径映射：

```json
{
  "plain": ".private/journal/2026-05-11.md",
  "cipher": "static/encrypted/journal/2026-05-11.json",
  "content": "content/post/journal/2026-05-11-secret.md"
}
```

运行同步脚本：

```bash
node scripts/sync-private.mjs --encrypt
```

脚本会自动生成：

- `static/encrypted/...json`：加密后的密文
- `content/post/...md`：公开文章壳
- `content/page/encrypted/index.md`：私密文章目录页

解密回明文可以运行：

```bash
node scripts/sync-private.mjs --decrypt
```

## 加密密码

加密脚本从 `.env` 或环境变量读取 `ENCRYPTION_PASSWORD`：

```bash
ENCRYPTION_PASSWORD=replace-this-with-a-long-random-password
```

`.env` 和 `.private/` 都已被 `.gitignore` 忽略。不要提交真实密码和私密明文。

当前加密方案使用：

- `PBKDF2-SHA-256`
- `310000` 次迭代
- `AES-GCM-256`
- 随机 `salt` 和 `iv`

浏览器端通过 WebCrypto 在本地解密，密码会保存在当前浏览器会话的 `sessionStorage` 中，关闭会话后失效。

## 主题与依赖

主题通过 Hugo Modules 引入，配置在 `config/_default/module.toml`，Go 依赖锁定在 `go.mod` / `go.sum`。

更新 Hugo Blox 模块可以运行：

```bash
hugo mod get -u
hugo mod tidy
```

Hugo Blox 需要 Tailwind CLI，依赖由 `package.json` 和 `pnpm-lock.yaml` 管理。

## 发布前检查

发布前建议运行：

```bash
node scripts/sync-private.mjs --encrypt
pnpm run build
```

这样可以确保密文、公开壳文章、私密目录页和搜索索引都是最新的。

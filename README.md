# Somnus Blog

Somnus 的个人博客源码仓库，基于 [Hugo](https://gohugo.io/) 和 [Blowfish](https://blowfish.page/) 构建，并额外定制了首页、分类、中文字体、搜索和页脚等体验。

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
- `content/page/`：独立页面，比如友链
- `content/categories/`、`content/tags/`：分类和标签的索引页
- `static/fonts/`：自定义字体
- `assets/css/somnus.css`：站点自定义样式
- `layouts/categories/`：分类总览和分类详情模板
- `layouts/_partials/hbx/blocks/somnus-recent-posts/`：首页最新文章 block，会排除日记分类
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

## 分类

分类来自文章 front matter 的 `categories` 字段。站点会自动生成：

- `/categories/`：分类总览
- `/categories/<分类名>/`：某个分类下的文章列表

首页的“最新文章”使用自定义 Hugo Blox block，会排除 `categories: 日记` 的文章。日记仍会出现在 `/post/` 和 `/categories/日记/` 中。

## 搜索

搜索由 Blowfish 的标题栏搜索按钮和 Hugo 自动生成的 `/index.json` 提供。生产构建会包含该索引，无需额外生成搜索文件。

## 不发布的内容

仓库为私有仓库时，需要保留在仓库、但不发布到博客的 Markdown 文件放入 `content/unpublished/`。该目录通过 Hugo 的 `build` 选项禁用页面和列表渲染，因此其中的内容不会生成页面、目录或搜索索引。

```markdown
---
title: 仅仓库内保存的日记
date: 2026-05-11T20:00:00+08:00
---
这里的内容会保留在私有仓库中，但不会渲染到博客。
```

将文件保存为 `content/unpublished/2026-05-11.md` 即可。

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
pnpm run build
```

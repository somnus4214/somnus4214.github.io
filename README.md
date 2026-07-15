# Somnus Blog

Somnus 的个人博客源码仓库，基于 [Zola](https://www.getzola.org/) 和 [Apollo](https://github.com/not-matthias/apollo) 主题构建。站点保留中文字体、明暗主题切换、分类标签、RSS/Atom、全文搜索、代码复制、Mermaid 和 MathJax 渲染。

## 环境要求

- Git
- Zola 0.22+
- Node.js / pnpm（可选，只用于运行 `package.json` 里的便捷脚本）

检查本地环境：

```bash
zola --version
```

如果想继续使用 `pnpm run dev/build`：

```bash
node --version
pnpm --version
```

## 本地预览

启动 Zola 开发服务器：

```bash
pnpm run dev
```

等价于：

```bash
zola serve --drafts
```

生产构建：

```bash
pnpm run build
```

`pnpm run build` 会执行：

```bash
zola build --force
```

## 常用目录

- `content/posts/`：技术博客
- `content/notes/`：知识笔记
- `content/essays/`：随笔
- `content/diary/`：日记
- `content/page/`：独立页面，比如友链
- `themes/apollo/`：Apollo 主题子模块
- `scripts/new-content.sh`：一键生成文章、笔记、随笔、日记模板
- `static/fonts/`：自定义字体
- `static/css/apollo-overrides.css`：Apollo 的轻量本地样式覆盖
- `templates/`：少量 Apollo 覆盖模板
- `templates_somnus_disabled/`：切换 Apollo 前的旧本地模板备份
- `zola.toml`：站点配置

## 一键生成内容模板

使用脚本按提示创建文章、笔记、随笔或日记：

```bash
./scripts/new-content.sh
```

也可以直接传参：

```bash
./scripts/new-content.sh post tutorial "Zola 使用笔记" "zola,blog"
./scripts/new-content.sh post proj "我的新项目" "project,rust"
./scripts/new-content.sh note llm "注意力机制复习" "llm,ai,learning"
./scripts/new-content.sh note rust/ratatui "Ratatui 组件笔记" "rust,ratatui,learning"
./scripts/new-content.sh essay "夏夜散步" "life,thinking"
./scripts/new-content.sh diary 2026-07-08 "life,thinking"
```

笔记的 section 可以写 `learning/rust/ratatui` 这种完整路径，也可以写 `rust/ratatui`，脚本会自动放到 `content/notes/learning/rust/ratatui/`。如果当前就在某个 `content/notes/...` 目录里，可以用 `note . "标题"` 直接生成到当前目录。

脚本会自动写入 `title`、`date`、`draft`、`path`、`taxonomies` 和 `[extra]`，并拒绝覆盖已有同名文件。

## 写公开文章

新建普通文章可以放在 `content/posts/` 下。Zola front matter 使用 TOML：

```markdown
+++
title = "文章标题"
date = 2026-05-11T20:00:00+08:00
draft = false
path = "p/文章标题"

[taxonomies]
categories = ["学习日志"]
tags = ["llm"]

[extra]
math = true
+++

这里是正文。
```

公开技术文章建议继续使用 `path = "p/..."`，这样可以保留原先 `/p/:slug/` 风格的链接。

## 分类

分类来自文章 front matter 的 `[taxonomies] categories = [...]`。站点会自动生成：

- `/categories/`：分类总览
- `/categories/<分类名>/`：某个分类下的文章列表

首页的“最新文章”读取 `content/posts/`，并排除 `[extra] hide_from_home = true` 的页面。

## 搜索

搜索由 Zola 生成的 `search_index.en.json` 和 Apollo 内置的 `elasticlunr` 搜索弹窗提供。生产构建会自动包含索引，无需额外生成搜索文件。

说明：Zola 的内置搜索语言不支持 `zh`，所以索引语言配置为 `en`，HTML 仍标记为 `zh-CN`。中文内容可以搜索，但不是中文分词搜索。

## 不发布的内容

仓库为私有仓库时，需要保留在仓库、但不发布到博客的 Markdown 文件放入 `content/unpublished/`。该目录的 `_index.md` 设置了 `render = false` 和 `in_search_index = false`，不会生成页面或搜索索引。

```markdown
+++
title = "仅仓库内保存的日记"
date = 2026-05-11T20:00:00+08:00
+++
这里的内容会保留在私有仓库中，但不会渲染到博客。
```

将文件保存为 `content/unpublished/2026-05-11.md` 即可。

## Markdown 增强

- Mermaid：使用 Apollo 的 shortcode：`{% mermaid() %}...{% end %}`。
- MathJax：支持 `$...$`、`$$...$$`、`\(...\)`、`\[...\]`。
- Emoji：Zola 已开启 `render_emoji`，常见 `:rocket:` 语法会在构建时转成 emoji。

## 发布前检查

发布前建议运行：

```bash
pnpm run build
```

或直接运行：

```bash
zola build --force
```

检查站内链接：

```bash
zola check --skip-external-links
```

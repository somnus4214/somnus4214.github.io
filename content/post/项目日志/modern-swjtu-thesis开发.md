+++
title = 'Modern Swjtu Thesis开发'
date = 2026-04-17T11:22:31+08:00
draft = false
categories = ["项目日志"]
tags = ["typst","markdown","template"]
image = ""
math = true
[build]
  list = "always"
+++

> 最近正在准备写本科毕业设计论文，不想用微软的word写，因为感觉不够极客 :anguished: ，也不想使用LaTex，因为LaTex太笨重了，编译速度太慢了，在线服务overleaf又是收费的（帮黄学长报销这个来着，好像一个月要三百多 🙀）
> 在网上搜罗搜罗发现了typst，一个基于rust内核的开源的标记语言排版系统，速度非常快，功能我觉得的也足够强（公式什么的都能很好地显示），同时我在他的模板库也找到了其他大学的毕业论文模板（nju），于是基于这个模板，我便衍生做一个swjtu的版本，最后，感谢nju-lug。

## 基础介绍

先简单介绍一下typst，是一款可用于出版的可编程标记语言，拥有变量、函数与包管理等现代编程语言特点，同时又注重于科学写作领域，与LaTex相似。

- 语法简洁：上手难度与markdown相当，文本的源码阅读性很高
- 编译速度快：typst用的是rust编写的，即typ(esetting+ru)st，运行平台是WASM,
- 环境搭建简单：不需要像LaTex折腾几个G的开发环境，可以在Web运行，还可以用vscode安装插件开发。

## Typst 简明语法指南

Typst 是一款现代、高效的排版系统，旨在提供比 LaTeX 更简单的语法和更快的渲染速度。其语法主要分为：**标记模式 (Markup)**、**数学模式 (Math)** 和 **脚本模式 (Scripting)**。

### 基础文本排版 (Markup Mode)

标记模式用于文档的正文结构，类似于 Markdown。

| 功能         | 语法示例                                     | 说明                           |
| :----------- | :------------------------------------------- | :----------------------------- |
| **标题**     | `= 一级标题`, `== 二级标题`                  | `=` 越多层级越深，等号后需空格 |
| **加粗**     | `*加粗内容*`                                 | 使用星号包裹                   |
| **斜体**     | `_斜体内容_`                                 | 使用下划线包裹                 |
| **代码块**   | \` \`行内代码\` \` 或 \`\`\` 块状代码 \`\`\` | 支持多种语言高亮               |
| **无序列表** | `- 列表项`                                   | 自动层级缩进                   |
| **有序列表** | `+ 列表项`                                   | 自动编号                       |
| **术语列表** | `/ 术语: 定义描述`                           | 常用于名词解释                 |
| **链接**     | `https://google.com`                         | 自动识别或使用 `#link` 函数    |
| **引用**     | `> 引用文本`                                 | 用于长段引用                   |
| **注释**     | `// 单行` 或 `/* 多行 */`                    | 不会显示在输出文件中           |

---

### 数学公式 (Math Mode)

使用美元符号 `$` 进入数学模式。

- **行内公式**: `$a + b = c$`
- **块级公式**: `$ v = s / t $` （在 `$` 符号内侧保留空格）

#### 常用数学语法：

- **上下标**: `x^2`, `y_i`
- **分式**: `1/2` 或 `fract(a, b)`
- **根号**: `sqrt(x)`
- **希腊字母**: 直接输入名称，如 `alpha`, `beta`, `phi`, `Delta`
- **矩阵**: `mat(1, 2; 3, 4)` （分号分隔行）
- **求和/积分**: `sum`, `integral`, `product`
- **限制范围**: `sum_(i=0)^n x_i`

---

### 函数与脚本 (Scripting Mode)

在 Typst 中，所有以 `#` 开头的标识符都代表函数调用或代码逻辑。

#### 常用内置函数

- **图片**: `#image("logo.png", width: 40%)`
- **表格**:
  ```typst
  #table(
    columns: (1fr, auto, 1fr),
    [左], [中], [右],
    [1], [2], [3],
  )
  ```
- **形状与间隔**: `#rect[]`, `#circle[]`, `#h(1cm)` (水平间距), `#v(2pt)` (垂直间距)
- **换页**: `#pagebreak()`

---

### 样式设置 (Set & Show Rules)

这是 Typst 实现自动化排版的核心。

#### Set 规则 (全局状态设置)

用于修改元素的默认属性：

```typst
#set page(paper: "a4", margin: 2cm, numbering: "1") // 纸张、边距、页码
#set text(font: "SimSun", size: 12pt, lang: "zh")   // 字体、字号、语言
#set heading(numbering: "1.1 ")                    // 标题自动编号
#set par(justify: true, first-line-indent: 2em)    // 段落两端对齐、首行缩进
```

#### Show 规则 (元素重定义)

用于改变特定元素的表现方式（类似于 CSS）：

```typst
// 将所有一级标题设为红色
#show heading.where(level: 1): set text(red)

// 在每个表格前自动加个加粗的提示
#show table: it => [
  *数据表：*
  #it
]
```

---

### 变量、编程与逻辑

Typst 是一门完整的编程语言。

- **定义变量**: `#let name = "Typst"`
- **定义函数**:
  ```typst
  #let notice(body) = rect(fill: gray.lighten(80%))[
    *注意：* #body
  ]
  #notice[这是一个自定义提醒框]
  ```
- **条件判断**: `#if 1 < 2 [Yes] else [No]`
- **循环**: `#for i in range(3) [ #i ]`

---

### 标签与引用

- **定义标签**: 在元素后面紧跟 `<label_name>`。
- **引用标签**: 使用 `@label_name`。

```typst
= 核心介绍 <intro>
如章节 @intro 所述...

#figure(
  image("graph.png"),
  caption: [实验结果],
) <fig_result>
见图 @fig_result 。
```

---

### 常用快捷键/对比 (vs LaTeX)

| 需求         | Typst                       | LaTeX                       |
| :----------- | :-------------------------- | :-------------------------- |
| **字体颜色** | `#text(fill: blue)[文本]`   | `\textcolor{blue}{文本}`    |
| **环境包裹** | `[...]`                     | `\begin{...} ... \end{...}` |
| **加粗**     | `*text*`                    | `\textbf{text}`             |
| **导入模块** | `#import "template.typ": *` | `\usepackage{...}`          |

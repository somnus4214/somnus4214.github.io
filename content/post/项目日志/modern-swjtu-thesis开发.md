+++
title = 'Modern Swjtu Thesis开发'
date = 2026-04-17T11:22:31+08:00
draft = false
categories = ["项目日志"]
tags = ["typst","markdown","template"]
image = ""
math = true
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

## 个人使用经验

> 最近在完善毕设论文，亲自使用了这个模板，一边发现问题一边修改问题hhhhh,感觉效率非常高。同样也总结了一些工作的经验。

### 流程图

任何的论文都**一定一定**会有流程图，不管说是方法的流程，还是模型的结构，都需要流程图来让表达更加具体，让读者更容易，引用一个著名的理论*论文就是要讲好一个故事*，衡量论文，不光要从学术的角度看，也许要关注他的表述，怎么让读者看懂。
对于typst的流程图，我在我本人的毕设里面采用了两种方案，一种是通过drawio(现在叫digrams)来绘制，并导出pdf后再导入论文中。
typst插入论文图片使用以下的语法

```typ
#figure(
  image("image_path",width=80%),
  caution:[图片的描述]
)
```

第二种方案是使用typst嵌入的流程图绘制方式，typst作为开源项目，虽然原生的功能可能存在缺乏现象，但是会有很多开源社区的贡献来弥补，流程图的绘制，就会用到cetz这个库，首先在typ文件开头引用cetz

```typ
#import "@preview/cetz:0.3.4"
```

然后就可以通过函数调用的方式来绘制具体的流程图，下面可以看到，真的非常之函数。:grin:

```typ
#figure(
  align(center)[
    #cetz.canvas({
      import cetz.draw: *

      let box-stroke = (paint: rgb("#3E4A61"), thickness: 0.9pt)
      let box-fill = rgb("#F5F7FA")
      let arrow-stroke = (paint: rgb("#4B5563"), thickness: 0.9pt)

      let x1 = 0
      let x2 = 6.4
      let ys = (8.4, 7.2, 6.0, 4.8, 3.6, 2.4, 1.2)
      let labels = (
        [加载 FP32 权重],
        [构建 RAFT-Stereo 网络],
        [模型参数转换为 FP16],
        [输入图像预处理并转换为 FP16],
        [执行半精度前向推理],
        [输出视差图],
        [统计指标并与 FP32 基线对比],
      )

      for i in range(0, 7) {
        let y = ys.at(i)
        rect((x1, y - 0.35), (x2, y + 0.35), radius: 0.08, fill: box-fill, stroke: box-stroke)
        content(((x1 + x2) / 2, y), labels.at(i))
        if i < 6 {
          line(((x1 + x2) / 2, y - 0.35), ((x1 + x2) / 2, ys.at(i + 1) + 0.35), mark: (end: ">"), stroke: arrow-stroke)
        }
      }
    })
  ],
  caption: [基于 FP16 的半精度推理流程图],
)
```

编译出来的效果如下：
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260424131446037.png)

### 专业绘图

同样的专业绘图也可以交给cetz，其实他的专业绘图这么强，我也是没想到的。这个双目摄像头成像示意图就是完全由Chatgpt 5.4生成的，没想到效果这么惊艳。
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260424131915278.png)
代码如下

```typ
#figure(
  align(center)[
    #cetz.canvas({
      import cetz.draw: *

      // 定义核心几何参数
      let b = 5        // 基线长度 b
      let f = 1.5      // 相机焦距 f
      let Z = 6        // 目标点深度 Z

      let Ol = (0, 0)  // 左相机光心
      let Or = (b, 0)  // 右相机光心
      let P = (2, Z)   // 空间目标点 P(X, Y, Z)

      // 绘制基线与光心
      line((-1, 0), (b + 1, 0), stroke: (dash: "dashed", paint: luma(150)), name: "baseline")
      circle(Ol, radius: 0.06, fill: black)
      content((0, -0.4), [$O_L$])
      circle(Or, radius: 0.06, fill: black)
      content((b, -0.4), [$O_R$])

      // 标注基线 b
      line((0, -0.8), (b, -0.8), mark: (start: ">", end: ">"), stroke: 0.8pt)
      content((b / 2, -1.2), [$b$])

      // 绘制图像平面 (高度为 f)
      line((-1.5, f), (1.5, f), stroke: 1.2pt)
      line((b - 1.5, f), (b + 1.5, f), stroke: 1.2pt)

      // 标注焦距 f
      line((-2, 0), (-2, f), mark: (start: ">", end: ">"), stroke: 0.8pt)
      content((-2.4, f / 2), [$f$])

      // 绘制空间点 P 及其到基线的垂线
      circle(P, radius: 0.06, fill: black)
      content((P.at(0), P.at(1) + 0.4), [$P(X,Y,Z)$])
      line((P.at(0), 0), P, stroke: (dash: "dotted", paint: luma(100)))

      // 标注深度 Z
      line((b + 2, 0), (b + 2, Z), mark: (start: ">", end: ">"), stroke: 0.8pt)
      content((b + 2.4, Z / 2), [$Z$])

      // 绘制光线 (P 到光心)
      line(P, Ol, stroke: (paint: blue.darken(20%), thickness: 0.8pt))
      line(P, Or, stroke: (paint: blue.darken(20%), thickness: 0.8pt))

      // 计算投影点位置 (利用相似三角形严谨计算)
      let xL_pos = P.at(0) * (f / Z)
      let xR_pos = b + (P.at(0) - b) * (f / Z)

      let pL = (xL_pos, f)
      let pR = (xR_pos, f)

      // 绘制并标注左侧投影点 x_L
      circle(pL, radius: 0.05, fill: red)
      content((xL_pos - 0.4, f + 0.3), text(fill: red)[$x_L$])

      // 绘制并标注右侧投影点 x_R
      circle(pR, radius: 0.05, fill: red)
      content((xR_pos + 0.4, f + 0.3), text(fill: red)[$x_R$])
    })
  ],
  caption: [双目视觉立体测距原理示意图],
)
```

> 我将永远拥护Chatgpt和typst（如果可以的话），听说那些专业期刊会要求提供tex格式的文件，这不就炸了，不过本科毕设肯定不会要求的，我感觉我同学百分之九十五都不会使用latex来写毕业论文，大部分估计都是word系。

同样对于柱状图，我们也可以直接使用cetz来绘制。
代码如下：

```typ
#figure(
  align(center)[
    #cetz.canvas({
      import cetz.draw: *

      let axis-stroke = (paint: rgb("#4B5563"), thickness: 0.9pt)
      let grid-stroke = (paint: luma(220), thickness: 0.5pt)
      let fp32-fill = rgb("#8FB7E8")
      let fp16-fill = rgb("#F2A978")

      // 坐标轴与网格
      line((1.2, 0.8), (1.2, 6.0), stroke: axis-stroke)
      line((1.2, 0.8), (8.6, 0.8), stroke: axis-stroke)
      line((1.2, 1.8), (8.6, 1.8), stroke: grid-stroke)
      line((1.2, 2.8), (8.6, 2.8), stroke: grid-stroke)
      line((1.2, 3.8), (8.6, 3.8), stroke: grid-stroke)
      line((1.2, 4.8), (8.6, 4.8), stroke: grid-stroke)
      line((1.2, 5.8), (8.6, 5.8), stroke: grid-stroke)

      // 纵轴刻度
      content((0.7, 0.8), [0])
      content((0.55, 1.8), [50])
      content((0.45, 2.8), [100])
      content((0.45, 3.8), [150])
      content((0.45, 4.8), [200])
      content((0.45, 5.8), [250])
      content((0.6, 6.35), [时间/ms])

      // 柱状图
      rect((2.3, 0.8), (4.2, 5.0), fill: fp32-fill, stroke: none)
      rect((5.4, 0.8), (7.3, 4.27), fill: fp16-fill, stroke: none)

      // 数值与标签
      content((3.25, 5.28), [209.80])
      content((6.35, 4.55), [173.59])
      content((3.25, 0.35), [FP32])
      content((6.35, 0.35), [FP16])
    })
  ],
  caption: [FP32 与 FP16 速度对比柱状图],
)
```

效果如图所示
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260424140716277.png)

### 表格

typst原生支持表格，通过使用table可以来创建表格。
代码如下：

```typ
#figure(
  table(
    columns: (22%, 28%, 50%),
    stroke: none,
    align: (x, y) => (
      if y == 0 { center + horizon }
      else if x <= 1 { center + horizon }
      else { left + horizon }
    ),

    table.hline(y: 0, stroke: 1.5pt),
    table.header([*指标类别*], [*统计指标*], [*说明*]),
    table.hline(y: 1, stroke: 0.5pt),

    [精度指标], [EPE、D1], [衡量预测视差与真实视差之间的误差，用于判断半精度转换是否影响匹配精度。],
    table.hline(y: 2, stroke: 0.5pt),

    [速度指标], [AvgTime、FPS], [衡量单张图像推理耗时和连续处理能力，用于评价推理效率。],
    table.hline(y: 3, stroke: 0.5pt),

    [资源指标], [Max CUDA Memory], [统计推理过程中的 GPU 显存峰值，用于分析显存占用变化。],
    table.hline(y: 4, stroke: 0.5pt),

    [存储指标], [Model Size], [统计模型权重文件大小，用于评价模型部署和分发成本。],
    table.hline(y: 5, stroke: 1.5pt),
  ),
  caption: [FP16 轻量化实验评价指标说明],
  kind: table
)
```

![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260424141016931.png)

### 引用文献

只要是论文，必然会用引用文献，我们每个人都是站在巨人肩上修修补补，所以typst必然需要有引用文献的功能。:grinning:
在thesis.typ的同目录下会有ref.bib，在其中可以添加参考文献目录。然后再文章中可以通过`@文献名`来引用，注意，不光要创建这样的ref.bib文件，并按照指定格式输入，还需要在thesis.typ中显式的使用它，具体可以看以下：

#### 文献参考格式

大概可以按照这样的格式来写

```bib
@article{ref02_Hirschmuller2008SGM, //文章中引用就@这个名字
  author  = {Hirschmuller, Heiko},
  title   = {Stereo Processing by Semi-Global Matching and Mutual Information},
  journal = {IEEE Transactions on Pattern Analysis and Machine Intelligence},
  year    = {2008},
  volume  = {30},
  number  = {2},
  pages   = {328-341}
}

@inproceedings{ref03_Scharstein2014Middlebury,
  author    = {Scharstein, Daniel and Hirschmuller, Heiko and Kitajima, Yukihiro and Krathwohl, Greg and Ne{\v{s}}i{\'c}, Nera and Wang, Xi and Westling, Porter},
  title     = {High-Resolution Stereo Datasets with Subpixel-Accurate Ground Truth},
  booktitle = {German Conference on Pattern Recognition (GCPR)},
  year      = {2014}
}

```

#### 全局定义

```typ
#let (
  functions
) = documentclass(

fonts: (
  font-settings
),
  info: (
    info....
  ),
  bibliography: bibliography.with("ref.bib"),
)
```

要在bibliography中改成自己的文献参考集的名字。

#### 文章整体引用

只在前面的全局定义中写完了还不够，还需要在文章主体中使用文献参考集。

```typ
#bilingual-bibliography(full: true)
```

要把这一行放在文末。
之后就可以直接通过@来引用了。

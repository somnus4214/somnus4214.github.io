+++
title = "LaTeX 数学公式速查表"
description = "Markdown/MathJax/KaTeX 常用数学公式、符号、结构与排版写法速查。"
path = "latex"
date = 2026-07-01T00:00:00+08:00
updated = 2026-07-02T00:00:00+08:00

[taxonomies]
categories = ["速查表"]
tags = ["LaTeX", "Markdown", "MathJax", "数学公式"]

[extra]
mathjax = true
toc = true
comments = false
+++

{{ latex_previewer() }}

这是一份偏博客写作场景的 Markdown LaTeX 数学公式速查表，适用于 MathJax/KaTeX/Typora/Obsidian/Jupyter/知乎/CSDN 等常见环境。内容合并了我常用写法、易踩坑规则，以及 [科学空间的 MathJax/LaTeX 参考页](https://spaces.ac.cn/latex.html) 中的常见命令分类。

## 一、公式环境

| 场景 | 写法 | 说明 |
| :--- | :--- | :--- |
| 行内公式 | `` `$x^2+y^2=z^2$` `` | 放在正文中，尺寸较紧凑：$x^2+y^2=z^2$ |
| 行内公式 | `` `\(x^2+y^2=z^2\)` `` | MathJax 推荐写法之一，显示效果同上 |
| 独立公式 | `` `$$...$$` `` | 单独占一行，适合较长公式 |
| 独立公式 | `` `\[...\]` `` | MathJax 推荐写法之一 |
| 多行公式 | `aligned` | 用 `\\` 换行，用 `&` 对齐 |
| 复杂块公式 | <code>&#123;% math() %&#125;...&#123;% end %&#125;</code> | 本站专用：绕开 Markdown，直接交给 MathJax |

```markdown
当 $a \ne 0$ 时，方程 $ax^2+bx+c=0$ 的解为

$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}.
$$
```

渲染效果：

当 $a \ne 0$ 时，方程 $ax^2+bx+c=0$ 的解为

$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}.
$$

本站写长公式时，推荐用 `math` shortcode 包住原生 MathJax/TeX 内容，避免 Markdown 先把 `_`、`*`、`\{`、`\\` 等符号解析掉：

<pre><code>&#123;% math() %&#125;
\begin{aligned}
\pi^*(y|x) &= \frac{1}{Z(x)} \pi_{\text{ref}}(y|x) \\
\mathbb{D}_{KL}(P\|Q) &= \mathbb{E}_{x\sim P}\left[\log\frac{P(x)}{Q(x)}\right]
\end{aligned}
&#123;% end %&#125;</code></pre>

## 二、上下标与正下方

| 需求 | 写法 | 效果 |
| :--- | :--- | :--- |
| 上标 | `$x^2$` | $x^2$ |
| 下标 | `$x_i$` | $x_i$ |
| 多字符上标 | `$x^{n+1}$` | $x^{n+1}$ |
| 多字符下标 | `$a_{ij}$` | $a_{ij}$ |
| 上下标同时出现 | `$x_i^2$` | $x_i^2$ |
| 撇号 | `$f^\prime(x), f^{\prime\prime}(x)$` | $f^\prime(x), f^{\prime\prime}(x)$ |
| 行内强制下标在正下方 | `$\max\limits_{\theta} f(\theta)$` | $\max\limits_{\theta} f(\theta)$ |
| 整体正下方标注 | `$\underset{\theta}{\arg\max}\, P(x\mid\theta)$` | $\underset{\theta}{\arg\max}\\, P(x\mid\theta)$ |
| 整体正上方标注 | `$\overset{*}{x}$` | $\overset{*}{x}$ |

要点：

- 行内公式里，`\sum`、`\max`、`\lim` 的上下标通常会挤在右侧；需要正下方时加 `\limits`。
- 独立公式里，很多大算子默认会把上下标放到正上方/正下方。
- `\arg\max\limits_{\theta}` 的 `\theta` 更靠近 `max`；`\underset{\theta}{\arg\max}` 会在整个 `argmax` 下方居中。

## 三、希腊字母

### 小写

| 英文 | 读音 | 写法 | 效果 | 英文 | 读音 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| alpha | 阿尔法 | `$\alpha$` | $\alpha$ | beta | 贝塔 | `$\beta$` | $\beta$ |
| gamma | 伽马 | `$\gamma$` | $\gamma$ | delta | 德尔塔 | `$\delta$` | $\delta$ |
| epsilon | 艾普西隆 | `$\epsilon$` | $\epsilon$ | zeta | 泽塔 | `$\zeta$` | $\zeta$ |
| eta | 伊塔 | `$\eta$` | $\eta$ | theta | 西塔 | `$\theta$` | $\theta$ |
| iota | 约塔 | `$\iota$` | $\iota$ | kappa | 卡帕 | `$\kappa$` | $\kappa$ |
| lambda | 兰布达 | `$\lambda$` | $\lambda$ | mu | 缪 | `$\mu$` | $\mu$ |
| nu | 纽 | `$\nu$` | $\nu$ | xi | 克西 | `$\xi$` | $\xi$ |
| omicron | 奥密克戎 | `$o$` | $o$ | pi | 派 | `$\pi$` | $\pi$ |
| rho | 柔 | `$\rho$` | $\rho$ | sigma | 西格玛 | `$\sigma$` | $\sigma$ |
| tau | 陶 | `$\tau$` | $\tau$ | upsilon | 宇普西隆 | `$\upsilon$` | $\upsilon$ |
| phi | 斐 | `$\phi$` | $\phi$ | chi | 希 | `$\chi$` | $\chi$ |
| psi | 普西 | `$\psi$` | $\psi$ | omega | 欧米伽 | `$\omega$` | $\omega$ |

常见变体：

| 名称 | 读音 | 写法 | 效果 | 名称 | 读音 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| varepsilon | 艾普西隆变体 | `$\varepsilon$` | $\varepsilon$ | vartheta | 西塔变体 | `$\vartheta$` | $\vartheta$ |
| varpi | 派变体 | `$\varpi$` | $\varpi$ | varrho | 柔变体 | `$\varrho$` | $\varrho$ |
| varsigma | 西格玛词尾形 | `$\varsigma$` | $\varsigma$ | varphi | 斐变体 | `$\varphi$` | $\varphi$ |
| digamma | 双伽马 | `$\digamma$` | $\digamma$ |  |  |  |  |

### 大写

大写字母读音同对应小写；常用大写命令如下。

| 名称 | 读音 | 写法 | 效果 | 名称 | 读音 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Gamma | 伽马 | `$\Gamma$` | $\Gamma$ | Delta | 德尔塔 | `$\Delta$` | $\Delta$ |
| Theta | 西塔 | `$\Theta$` | $\Theta$ | Lambda | 兰布达 | `$\Lambda$` | $\Lambda$ |
| Xi | 克西 | `$\Xi$` | $\Xi$ | Pi | 派 | `$\Pi$` | $\Pi$ |
| Sigma | 西格玛 | `$\Sigma$` | $\Sigma$ | Upsilon | 宇普西隆 | `$\Upsilon$` | $\Upsilon$ |
| Phi | 斐 | `$\Phi$` | $\Phi$ | Psi | 普西 | `$\Psi$` | $\Psi$ |
| Omega | 欧米伽 | `$\Omega$` | $\Omega$ | nabla | 纳布拉 | `$\nabla$` | $\nabla$ |

## 四、关系运算符

| 描述 | 写法 | 效果 | 描述 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 等于 | `$=$` | $=$ | 不等于 | `$\ne$` 或 `$\neq$` | $\ne$ |
| 小于 | `$<$` 或 `$\lt$` | $\lt$ | 大于 | `$>$` 或 `$\gt$` | $\gt$ |
| 小于等于 | `$\le$` 或 `$\leq$` | $\leq$ | 大于等于 | `$\ge$` 或 `$\geq$` | $\geq$ |
| 更美观的小于等于 | `$\leqslant$` | $\leqslant$ | 更美观的大于等于 | `$\geqslant$` | $\geqslant$ |
| 约等于 | `$\approx$` | $\approx$ | 渐近相等 | `$\simeq$` | $\simeq$ |
| 同构/全等 | `$\cong$` | $\cong$ | 恒等/等价 | `$\equiv$` | $\equiv$ |
| 相似/同阶 | `$\sim$` | $\sim$ | 正比于 | `$\propto$` | $\propto$ |
| 远小于 | `$\ll$` | $\ll$ | 远大于 | `$\gg$` | $\gg$ |
| 垂直 | `$\perp$` | $\perp$ | 平行 | `$\parallel$` | $\parallel$ |
| 整除 | `$\mid$` | $\mid$ | 不整除 | `$\nmid$` | $\nmid$ |

否定写法常用 `\not`：

| 写法 | 效果 |
| :--- | :--- |
| `$\not\equiv$` | $\not\equiv$ |
| `$\not\sim$` | $\not\sim$ |
| `$\not\subseteq$` | $\not\subseteq$ |

## 五、集合与逻辑

| 描述 | 写法 | 效果 | 描述 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 属于 | `$\in$` | $\in$ | 不属于 | `$\notin$` | $\notin$ |
| 包含元素 | `$\ni$` | $\ni$ | 空集 | `$\emptyset$` | $\emptyset$ |
| 子集 | `$\subset$` | $\subset$ | 真超集 | `$\supset$` | $\supset$ |
| 子集或等于 | `$\subseteq$` | $\subseteq$ | 超集或等于 | `$\supseteq$` | $\supseteq$ |
| 并集 | `$\cup$` | $\cup$ | 交集 | `$\cap$` | $\cap$ |
| 大并 | `$\bigcup_i A_i$` | $\bigcup_i A_i$ | 大交 | `$\bigcap_i A_i$` | $\bigcap_i A_i$ |
| 差集 | `$A\setminus B$` | $A\setminus B$ | 笛卡尔积 | `$A\times B$` | $A\times B$ |
| 任意 | `$\forall$` | $\forall$ | 存在 | `$\exists$` | $\exists$ |
| 不存在 | `$\nexists$` | $\nexists$ | 因此 | `$\therefore$` | $\therefore$ |
| 因为 | `$\because$` | $\because$ | 蕴含 | `$\Rightarrow$` | $\Rightarrow$ |
| 当且仅当 | `$\Leftrightarrow$` | $\Leftrightarrow$ | 逻辑非 | `$\neg$` | $\neg$ |
| 逻辑与 | `$\land$` | $\land$ | 逻辑或 | `$\lor$` | $\lor$ |

常用数集：

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 自然数 | `$\mathbb{N}$` | $\mathbb{N}$ |
| 整数 | `$\mathbb{Z}$` | $\mathbb{Z}$ |
| 有理数 | `$\mathbb{Q}$` | $\mathbb{Q}$ |
| 实数 | `$\mathbb{R}$` | $\mathbb{R}$ |
| 复数 | `$\mathbb{C}$` | $\mathbb{C}$ |

## 六、二元运算符

| 描述 | 写法 | 效果 | 描述 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 加减 | `$\pm$` | $\pm$ | 减加 | `$\mp$` | $\mp$ |
| 乘号 | `$\times$` | $\times$ | 点乘 | `$\cdot$` | $\cdot$ |
| 星号 | `$\ast$` | $\ast$ | 卷积 | `$\star$` | $\star$ |
| 除号 | `$\div$` | $\div$ | 分式斜线 | `$a/b$` | $a/b$ |
| 圆加 | `$\oplus$` | $\oplus$ | 圆乘 | `$\otimes$` | $\otimes$ |
| 圆点 | `$\odot$` | $\odot$ | 菱形 | `$\diamond$` | $\diamond$ |
| 楔积 | `$\wedge$` | $\wedge$ | 逻辑或/vee | `$\vee$` | $\vee$ |
| 交 | `$\cap$` | $\cap$ | 并 | `$\cup$` | $\cup$ |

## 七、分式、根号与常用结构

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 分式 | `$\frac{a+b}{c+d}$` | $\frac{a+b}{c+d}$ |
| 行内较小分式 | `$\tfrac{a}{b}$` | $\tfrac{a}{b}$ |
| 展示较大分式 | `$\dfrac{a}{b}$` | $\dfrac{a}{b}$ |
| 平方根 | `$\sqrt{x}$` | $\sqrt{x}$ |
| n 次根 | `$\sqrt[n]{x}$` | $\sqrt[n]{x}$ |
| 上划线 | `$\overline{AB}$` | $\overline{AB}$ |
| 下划线 | `$\underline{AB}$` | $\underline{AB}$ |
| 上花括号 | `$\overbrace{a+\cdots+a}^{n}$` | $\overbrace{a+\cdots+a}^{n}$ |
| 下花括号 | `$\underbrace{x+\cdots+x}_{n}$` | $\underbrace{x+\cdots+x}_{n}$ |
| 上箭头 | `$\overrightarrow{AB}$` | $\overrightarrow{AB}$ |
| 左箭头 | `$\overleftarrow{AB}$` | $\overleftarrow{AB}$ |
| 帽子 | `$\widehat{ABC}$` | $\widehat{ABC}$ |
| 波浪帽 | `$\widetilde{ABC}$` | $\widetilde{ABC}$ |

## 八、括号与分隔符

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 小括号 | `$(x)$` | $(x)$ |
| 中括号 | `$[x]$` | $[x]$ |
| 花括号 | `$\{x\}$` | $\{x\}$ |
| 绝对值 | `$\lvert x\rvert$` | $\lvert x\rvert$ |
| 范数 | `$\|x\|$` 或 `$\lVert x\rVert$` | $\lVert x\rVert$ |
| 角括号 | `$\langle x,y\rangle$` | $\langle x,y\rangle$ |
| 向上取整 | `$\lceil x\rceil$` | $\lceil x\rceil$ |
| 向下取整 | `$\lfloor x\rfloor$` | $\lfloor x\rfloor$ |
| 自适应大小 | `$\left[ \frac{a}{b} \right]$` | $\left[ \frac{a}{b} \right]$ |
| 只有左分隔符 | `$\left. \frac{dy}{dx} \right\rvert_{x=0}$` | $\left. \frac{dy}{dx} \right\rvert_{x=0}$ |
| 手动放大 | `$\Bigl( \bigl( x \bigr) \Bigr)$` | $\Bigl( \bigl( x \bigr) \Bigr)$ |

成对括号常用模板：

```latex
\left( ... \right)
\left[ ... \right]
\left\{ ... \right\}
\left| ... \right|
\left\langle ... \right\rangle
```

## 九、箭头

| 描述 | 写法 | 效果 | 描述 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 左箭头 | `$\leftarrow$` | $\leftarrow$ | 右箭头 | `$\rightarrow$` | $\rightarrow$ |
| 赋值箭头 | `$\gets$` | $\gets$ | 映射到 | `$\mapsto$` | $\mapsto$ |
| 长左箭头 | `$\longleftarrow$` | $\longleftarrow$ | 长右箭头 | `$\longrightarrow$` | $\longrightarrow$ |
| 双线左箭头 | `$\Leftarrow$` | $\Leftarrow$ | 双线右箭头 | `$\Rightarrow$` | $\Rightarrow$ |
| 左右箭头 | `$\leftrightarrow$` | $\leftrightarrow$ | 当且仅当 | `$\Leftrightarrow$` | $\Leftrightarrow$ |
| 长双线箭头 | `$\Longrightarrow$` | $\Longrightarrow$ | 长当且仅当 | `$\Longleftrightarrow$` | $\Longleftrightarrow$ |
| 上箭头 | `$\uparrow$` | $\uparrow$ | 下箭头 | `$\downarrow$` | $\downarrow$ |
| 上下箭头 | `$\updownarrow$` | $\updownarrow$ | 向量箭头 | `$\vec{x}$` | $\vec{x}$ |
| 上方带字 | `$\xrightarrow{n\to\infty}$` | $\xrightarrow{n\to\infty}$ | 上下带字 | `$\xleftarrow[下方]{上方}$` | $\xleftarrow[下方]{上方}$ |

## 十、标准函数

数学函数应该用直立体命令，不要直接写成斜体字母。例如 `\sin x` 比 `sin x` 更规范。

| 类型 | 命令 |
| :--- | :--- |
| 三角函数 | `\sin` `\cos` `\tan` `\cot` `\sec` `\csc` |
| 反三角函数 | `\arcsin` `\arccos` `\arctan` |
| 双曲函数 | `\sinh` `\cosh` `\tanh` `\coth` |
| 对数/指数 | `\log` `\ln` `\lg` `\exp` |
| 极值 | `\max` `\min` `\sup` `\inf` |
| 极限 | `\lim` `\limsup` `\liminf` |
| 代数/概率 | `\det` `\dim` `\ker` `\hom` `\gcd` `\Pr` |
| 角度 | `\deg` |

常用示例：

| 需求 | 写法 | 效果 |
| :--- | :--- | :--- |
| 正弦函数 | `$\sin x$` | $\sin x$ |
| 对数 | `$\log_2 n$` | $\log_2 n$ |
| 极限 | `$\lim_{x\to 0}\frac{\sin x}{x}=1$` | $\lim_{x\to 0}\frac{\sin x}{x}=1$ |
| 行内极限正下方 | `$\lim\limits_{x\to 0}\frac{\sin x}{x}=1$` | $\lim\limits_{x\to 0}\frac{\sin x}{x}=1$ |
| argmax 右下角 | `$\arg\max_{\theta} f(\theta)$` | $\arg\max_{\theta} f(\theta)$ |
| argmax 居中下方 | `$\underset{\theta}{\arg\max}\, f(\theta)$` | $\underset{\theta}{\arg\max}\\, f(\theta)$ |

## 十一、求和、积分与微积分

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 求和 | `$\sum_{i=1}^{n} i$` | $\sum_{i=1}^{n} i$ |
| 求积 | `$\prod_{i=1}^{n} x_i$` | $\prod_{i=1}^{n} x_i$ |
| 并和 | `$\coprod_i A_i$` | $\coprod_i A_i$ |
| 一重积分 | `$\int_a^b f(x)\,dx$` | $\int_a^b f(x)\\,dx$ |
| 二重积分 | `$\iint_D f(x,y)\,dx\,dy$` | $\iint_D f(x,y)\\,dx\\,dy$ |
| 三重积分 | `$\iiint_\Omega f\,dV$` | $\iiint_\Omega f\\,dV$ |
| 曲线/曲面积分 | `$\oint_C f(z)\,dz$` | $\oint_C f(z)\\,dz$ |
| 无穷 | `$\infty$` | $\infty$ |
| 导数 | `$\frac{dy}{dx}$` | $\frac{dy}{dx}$ |
| 偏导 | `$\frac{\partial f}{\partial x}$` | $\frac{\partial f}{\partial x}$ |
| 二阶偏导 | `$\frac{\partial^2 f}{\partial x^2}$` | $\frac{\partial^2 f}{\partial x^2}$ |
| 梯度 | `$\nabla_{\theta}J(\theta)$` | $\nabla_{\theta}J(\theta)$ |
| 拉普拉斯算子 | `$\nabla^2 f$` | $\nabla^2 f$ |
| 微分间距 | `$\int f(x)\,dx$` | $\int f(x)\\,dx$ |

## 十二、向量、矩阵与线性代数

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 向量 | `$\vec{x}$` | $\vec{x}$ |
| 粗体向量 | `$\mathbf{x}$` | $\mathbf{x}$ |
| 单位向量 | `$\hat{x}$` | $\hat{x}$ |
| 转置 | `$A^\top$` | $A^\top$ |
| 逆矩阵 | `$A^{-1}$` | $A^{-1}$ |
| 行列式 | `$\det(A)$` | $\det(A)$ |
| 范数 | `$\lVert x\rVert_2$` | $\lVert x\rVert_2$ |
| 内积 | `$\langle x,y\rangle$` | $\langle x,y\rangle$ |
| 点乘 | `$x\cdot y$` | $x\cdot y$ |
| 叉乘 | `$x\times y$` | $x\times y$ |
| 矩阵迹 | `$\operatorname{tr}(A)$` | $\operatorname{tr}(A)$ |
| 秩 | `$\operatorname{rank}(A)$` | $\operatorname{rank}(A)$ |

矩阵模板：

```markdown
$$
A =
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$
```

渲染效果：

$$
A =
\begin{bmatrix}
1 & 2 \\\\
3 & 4
\end{bmatrix}
$$

常见矩阵环境：

| 环境 | 分隔符 | 示例 |
| :--- | :--- | :--- |
| `matrix` | 无括号 | `\begin{matrix} ... \end{matrix}` |
| `pmatrix` | 小括号 | `\begin{pmatrix} ... \end{pmatrix}` |
| `bmatrix` | 中括号 | `\begin{bmatrix} ... \end{bmatrix}` |
| `Bmatrix` | 花括号 | `\begin{Bmatrix} ... \end{Bmatrix}` |
| `vmatrix` | 单竖线 | `\begin{vmatrix} ... \end{vmatrix}` |
| `Vmatrix` | 双竖线 | `\begin{Vmatrix} ... \end{Vmatrix}` |

## 十三、分段函数与方程组

分段函数：

```markdown
$$
f(x)=
\begin{cases}
x^2, & x \ge 0, \\
-x, & x < 0.
\end{cases}
$$
```

$$
f(x)=
\begin{cases}
x^2, & x \ge 0, \\\\
-x, & x < 0.
\end{cases}
$$

方程组：

```markdown
$$
\begin{cases}
x+y=1, \\
2x-y=3.
\end{cases}
$$
```

$$
\begin{cases}
x+y=1, \\\\
2x-y=3.
\end{cases}
$$

## 十四、多行公式与对齐

在公式中直接回车通常不会换行；使用 `aligned`，用 `\\` 换行，用 `&` 指定对齐点。

```markdown
$$
\begin{aligned}
\theta &\leftarrow \theta - \eta \nabla_{\theta}J(\theta) \\
\Delta\theta &\propto F^{-1}g \\
\hat{\theta} &= \underset{\theta}{\arg\max}\,P(x\mid\theta)
\end{aligned}
$$
```

$$
\begin{aligned}
\theta &\leftarrow \theta - \eta \nabla_{\theta}J(\theta) \\\\
\Delta\theta &\propto F^{-1}g \\\\
\hat{\theta} &= \underset{\theta}{\arg\max}\\,P(x\mid\theta)
\end{aligned}
$$

多列对齐：

```markdown
$$
\begin{array}{rcl}
a+b &=& c \\
x-y &=& z
\end{array}
$$
```

$$
\begin{array}{rcl}
a+b &=& c \\\\
x-y &=& z
\end{array}
$$

## 十五、字体与字母样式

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 罗马体 | `$\mathrm{d}x$` | $\mathrm{d}x$ |
| 粗体 | `$\mathbf{x}$` | $\mathbf{x}$ |
| 斜体 | `$\mathit{ABC}$` | $\mathit{ABC}$ |
| 无衬线 | `$\mathsf{ABC}$` | $\mathsf{ABC}$ |
| 打字机体 | `$\mathtt{ABC}$` | $\mathtt{ABC}$ |
| 花体 | `$\mathcal{D}$` | $\mathcal{D}$ |
| 黑板粗体 | `$\mathbb{R}$` | $\mathbb{R}$ |
| Fraktur | `$\mathfrak{g}$` | $\mathfrak{g}$ |
| 文本 | `$\text{if } x>0$` | $\text{if } x>0$ |

常用机器学习记号：

| 描述 | 写法 | 效果 |
| :--- | :--- | :--- |
| 数据集 | `$\mathcal{D}$` | $\mathcal{D}$ |
| 损失函数 | `$\mathcal{L}(\theta)$` | $\mathcal{L}(\theta)$ |
| 期望 | `$\mathbb{E}_{x\sim p(x)}[f(x)]$` | $\mathbb{E}_{x\sim p(x)}[f(x)]$ |
| 概率 | `$\Pr(X=x)$` | $\Pr(X=x)$ |
| 正态分布 | `$\mathcal{N}(\mu,\sigma^2)$` | $\mathcal{N}(\mu,\sigma^2)$ |

## 十六、重音、修饰与标记

| 描述 | 写法 | 效果 | 描述 | 写法 | 效果 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 帽子 | `$\hat{x}$` | $\hat{x}$ | 宽帽子 | `$\widehat{xyz}$` | $\widehat{xyz}$ |
| 波浪 | `$\tilde{x}$` | $\tilde{x}$ | 宽波浪 | `$\widetilde{xyz}$` | $\widetilde{xyz}$ |
| 横线 | `$\bar{x}$` | $\bar{x}$ | 上划线 | `$\overline{x+y}$` | $\overline{x+y}$ |
| 点 | `$\dot{x}$` | $\dot{x}$ | 双点 | `$\ddot{x}$` | $\ddot{x}$ |
| 向量 | `$\vec{x}$` | $\vec{x}$ | 反向向量 | `$\overleftarrow{AB}$` | $\overleftarrow{AB}$ |
| 上标注 | `$\overset{!}{=}$` | $\overset{!}{=}$ | 下标注 | `$\underset{x=0}{\lim}$` | $\underset{x=0}{\lim}$ |

## 十七、空格、换行与文本混排

LaTeX 会自动处理大部分数学间距；需要手动调整时用这些命令。

| 写法 | 效果 | 说明 |
| :--- | :--- | :--- |
| `$a\,b$` | $a\\,b$ | 小空格，常用于 `\,dx` |
| `$a\:b$` | $a\\:b$ | 中小空格 |
| `$a\;b$` | $a\\;b$ | 中空格 |
| `$a\quad b$` | $a\quad b$ | 一个 quad |
| `$a\qquad b$` | $a\qquad b$ | 两个 quad |
| `$a\!b$` | $a\\!b$ | 负空格 |
| `$\text{若 } x>0$` | $\text{若 } x>0$ | 公式中插入中文/文本 |

推荐写法：

```latex
\int_a^b f(x)\,dx
\mathbb{E}_{x\sim p(x)}\left[ f(x) \right]
f(x)=0,\quad x\ne 0
```

## 十八、颜色、取消线与盒子

这些命令在 MathJax 中常见，但不同平台支持程度不完全一致。

| 描述 | 写法 | 备注 |
| :--- | :--- | :--- |
| 颜色 | `$\color{red}{x+y}$` | MathJax 常见支持 |
| 盒子 | `$\boxed{x=1}$` | 核心命令，较稳 |
| 背景色 | `$\bbox[yellow]{x+y}$` | 平台相关 |
| 删除线 | `$\cancel{x}$` | 平台相关，可能需要扩展 |

较稳的渲染示例：

$$
\boxed{x=1}
$$

如果某个平台不显示 `\cancel` 或 `\bbox`，通常是该平台没有加载对应扩展；写博客时尽量少依赖这些增强命令。

## 十九、常用模板

### 梯度下降

```latex
\theta \leftarrow \theta - \eta \nabla_{\theta}J(\theta)
```

$$
\theta \leftarrow \theta - \eta \nabla_{\theta}J(\theta)
$$

### 最大似然估计

```latex
\hat{\theta}
= \underset{\theta}{\arg\max}\,P(x\mid\theta)
```

$$
\hat{\theta}
= \underset{\theta}{\arg\max}\\,P(x\mid\theta)
$$

### 贝叶斯公式

```latex
P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}
```

$$
P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}
$$

### softmax

```latex
\operatorname{softmax}(z_i)
= \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}
```

$$
\operatorname{softmax}(z_i)
= \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}
$$

### 交叉熵

```latex
\mathcal{L}
= -\sum_{i=1}^{n} y_i \log \hat{y}_i
```

$$
\mathcal{L}
= -\sum_{i=1}^{n} y_i \log \hat{y}_i
$$

### 高斯分布

```latex
\mathcal{N}(x;\mu,\sigma^2)
= \frac{1}{\sqrt{2\pi\sigma^2}}
  \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
```

$$
\mathcal{N}(x;\mu,\sigma^2)
= \frac{1}{\sqrt{2\pi\sigma^2}}
  \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

### 矩阵乘法

```latex
C_{ij}=\sum_{k=1}^{n} A_{ik}B_{kj}
```

$$
C_{ij}=\sum_{k=1}^{n} A_{ik}B_{kj}
$$

## 二十、避坑清单

| 问题 | 推荐做法 |
| :--- | :--- |
| 行内公式太高 | 换成独立公式，或使用 `\tfrac` |
| 下标没有在正下方 | 行内加 `\limits`，或用 `\underset` |
| 多字符上下标只显示第一个字符 | 用 `{}`，例如 `x_{n+1}` |
| 公式中回车不换行 | 使用 `aligned` 或 `array`，并用 `\\` |
| 多行公式没有对齐 | 在等号/箭头前加 `&` |
| 绝对值和范数太矮 | 用 `\left\lvert...\right\rvert` 或 `\lVert...\rVert` |
| 竖线符号语义不清 | 条件概率推荐 `\mid`，范数推荐 `\lVert...\rVert` |
| 函数名变成斜体 | 用 `\sin`、`\log`、`\max`、`\operatorname{rank}` |
| 中文或普通文字在公式中显示异常 | 用 `\text{...}` |
| Markdown 表格里写公式被竖线拆开 | 避免裸竖线，改用 `\mid`、`\lvert`、`\rvert` |
| 平台不支持某命令 | 优先使用 MathJax/KaTeX 常见核心命令，少用增强扩展 |

### 本站 Markdown + MathJax 特别注意

本站页面的公式流程是：Markdown 先被 Zola 渲染成 HTML，浏览器里 MathJax 再渲染公式。因此某些 TeX 写法本身没错，但可能在 MathJax 看到之前已经被 Markdown 改坏。复杂公式优先用 <code>&#123;% math() %&#125;...&#123;% end %&#125;</code>。

| 容易踩坑的写法 | 稳定写法 | 原因 |
| :--- | :--- | :--- |
| `\bigg\{...\bigg\}` | `\bigg\lbrace...\bigg\rbrace` | `\{` 可能被 Markdown 当作转义处理 |
| `\pi^*` | `\pi^{\ast}` | `*` 可能触发 Markdown 斜体 |
| <code>P&#92;&#124;Q</code> 或 <code>P&#124;&#124;Q</code> | `P\Vert Q` | 竖线容易被 Markdown 或表格语法干扰 |
| <code>&#92;&#124;\Delta\theta&#92;&#124;</code> | `\lVert\Delta\theta\rVert` | 范数语义更清楚，也更稳 |
| 行尾 `\\` | 行尾 `\\\\`，或使用 `math` shortcode 后写正常 `\\` | Markdown 行尾反斜杠可能被当作硬换行 |
| `_` 多的长公式 | 用 `math` shortcode | 下标里的 `_` 可能和 Markdown 强调语法打架 |

如果写在 `math` shortcode 里，上面这些可以按更接近原生 MathJax 的习惯写；如果直接写在普通 Markdown 里，就优先使用右侧稳定写法。

## 二十一、快速索引

| 想查 | 关键词 |
| :--- | :--- |
| 正下方、argmax、max 下标 | `\limits`、`\underset` |
| 约等于、正比、不等于 | `\approx`、`\propto`、`\ne` |
| 希腊字母 theta、tau、Delta | `\theta`、`\tau`、`\Delta` |
| 梯度、偏导、拉普拉斯 | `\nabla`、`\partial`、`\nabla^2` |
| 多行公式、换行、对齐 | `aligned`、`\\`、`&` |
| 矩阵、方程组、分段函数 | `bmatrix`、`cases`、`array` |
| 花体、黑板粗体、实数集 | `\mathcal`、`\mathbb` |
| 括号自动变大 | `\left`、`\right` |
| 箭头、映射、带字箭头 | `\leftarrow`、`\mapsto`、`\xrightarrow` |

参考：

- [科学空间：MathJax 在线 / LaTeX 参考](https://spaces.ac.cn/latex.html)
- 本站 Markdown 数学公式写作习惯与常用机器学习公式模板

+++
title = "ppo vs dpo vs grpo"
date = 2026-06-30T14:30:47+08:00
updated = 2026-07-03T10:30:00+08:00
draft = false
path = "notes/ppo vs dpo vs grpo"

[taxonomies]
categories = ["learning"]
tags = ["llm", "learning", "rl"]

[extra]
math = true
hide_from_home = false
+++
>这一节主要讲的就是大模型的强化学习策略，现在主流的方案就包括ppo、dpo、grpo。

## 背景介绍
一个传统的完整的rlhf（reinforcement learning from human feedback，人类反馈强化学习）要包括三部分：sft（监督微调）、rm（奖励模型训练）、rl（强化学习微调）。
而今天提到的三种方法，都是第三部中强化学习微调的时候，使用的不同的算法。

## 过去的方法
在ppo之前策略是有一个发展的过程的，具体可以参考这个[知乎](https://zhuanlan.zhihu.com/p/614115887)，讲的非常具体（公式太多了😩）。
### VPG
即传统策略梯度（vanilla policy gradiant）
#### 基本原理
他的核心原理就是把你的目标函数$J(\theta)$量化出来：
$$
\max\limits_{\theta}(J(\theta))=\max\limits_{\theta}(\mathbb{E}_{\tau\sim\pi_\theta}[R(\tau)])=\max\limits_{\theta}\sum_\tau P(\tau;\theta) R(\tau)
$$
上述函数中其中$\tau$就是agent与环境交互的动作轨迹，对$\tau$求和就是表明与环境交互的所有可能，每一种可能乘上对应的$R$（reward函数），然后计算得到目标函数$J(\theta)$，那么整个函数想表达的就是通过$\theta$得到最大的目标函数。
和一般的函数一样，我们想要得到最大值，都要算这样的函数的梯度，最终经过一系列的化简、对数导数技巧等操作，得到：
$$
\nabla_\theta J(\theta)\approx\frac{1}{n}\sum_{i=1}^m(\nabla_\theta \log\pi_\theta(a_{t^{(i)}}|s_{t^{(i)}}))R(t^{(i)})
$$
Williams提出的REINFORCE算法是经典的策略梯度算法之一。
#### 存在缺陷
我们在VPG中定义了步长$\alpha$来更新$\theta$，但是很容易出现overshooting（过冲）和undershooting（下冲）的情况
![image.png](https://img.somnus.wiki/file/1782875592475_image.png)
如上图所示，一旦函数过冲进入低梯度的次优区域，很容易出现目标函数无法逃逸的现象。
### NPG
面对上面的问题，我们很自然的会想到，通过限制步长来解决，即自然策略梯度（natural policy gradiant）。
$$
\Delta\theta^*=\underset{||\Delta\theta||\le\epsilon}{\arg\max} J(\theta+\Delta\theta)
$$
但是效果也不如预期，如下图中
![image.png](https://img.somnus.wiki/file/1782875809661_image.png)
不同参数分布，对于相同的步长的敏感度是不同的。所以我们不应该限制步长的大小，而是限制因为步长变化，策略导致的分布变化了多少。
#### 核心机制
引入了KL散度（KL Divergence）与黎曼空间。NPG不再使用普通的欧几里得距离来定义梯度的方向，而是将目标函数放到了一个由分布构成的黎曼流形上，为了在这样的流形上找准方向，它还引入了费舍尔信息矩阵（Fisher Information Matrix, FIM）。
于是新的策略更新为：
$$
\begin{aligned}
\Delta\theta^*&=\underset{\mathcal{D}_{KL}(\pi_\theta||\pi_{\Delta\theta})\le\epsilon}{\arg\max}J(\theta+\Delta\theta)\\
\end{aligned}
$$
#### 数学魔法
KL 散度是一个非常复杂的非线性积分，直接把它放进神经网络里求导是极其困难的。
NPG 在这里引入了微积分里的泰勒展开，对 KL 散度进行二阶近似。奇妙的事情发生了，KL 散度的二阶导数（海森矩阵）正好等于统计学中鼎鼎大名的**费雪信息矩阵 $F$**。
你可以把费雪矩阵 $F$ 理解为当前策略空间的“曲率地图”或“敏感度矩阵”。它精确地记录了：此时此刻，改变哪几个参数会导致动作分布发生剧烈变化。
$$F = \mathbb{E}_{\pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a|s) \nabla_\theta \log \pi_\theta(a|s)^T \right]$$
$$
\Delta\theta^*=\underset{\frac{1}{2}\Delta\theta^TF\Delta\theta\le\epsilon}{\arg\max}\nabla_\theta J(\theta)^T\Delta\theta
$$

该方案的强大之处就在于，无论分布的表示如何，它总能以**相同的幅度**来改变策略
#### 存在缺陷
**算力需求高**，假设神经网络有N个参数，费舍尔矩阵就有$N\times N$个参数，更要命的是还要求费舍尔矩阵的逆矩阵$F^{-}$ ，线性代数中告诉我们，计算逆矩阵的时间复杂度是$O(n ^3)$ ，此时算力需求会爆炸。
### TRPO
刚刚上面说到了，自然策略梯度的问题就是理论非常完美，但是就是算不动。而trpo解决的就是这个算不动的问题。
#### trust region是什么
上一个推导中，我们把极其复杂的原问题，变成了泰勒展开后的近似问题：
- 目标：$\max g^T\Delta\theta=\max\nabla_{\theta}J(\theta)^-\Delta\theta$
- 约束：$\frac{1}{2}\Delta\theta^TF\Delta\theta\le\epsilon$
但是此处有一个很关键的问题，泰勒展开只有在“局部”的时候才精准，如果走的太远$\Delta\theta$太大，就会产生**很大的偏差**。也就是说，只有在满足上面提到的这个约束条件的椭圆形范围内，泰勒展开才是靠谱的，这就是所谓的信赖阈（trust region）。
#### 共轭梯度法（conjugate gradiant）
上述提到，NPG的最终更新公式是$\Delta\theta\propto F^{-1}g$，此处的逆矩阵会因为现代大模型上百万参数的情况而计算量指数级暴增，会瞬间撑爆GPU。
但是实际上，我们并不关注$F^{-1}$这个逆矩阵本身，cg就把原本的$x=F^{-1}g$转化成了$Fx=g$，把原本的求逆问题转化成了解方程问题。
- 利用深度学习框架的“自动求导黑魔法（海森向量积 HVP）”，不需要在内存中生成 $F$ 矩阵，就能算出 $F$ 与向量的乘积。
- 在极其狭长的曲率空间中，只用 10 到 20 步迭代，就能精准找到不引起策略突变的**最优更新方向**。
#### 回溯线性搜索
cg虽然能求到方向和最大允许步长，但是trpo仍然不放心，因为上面提到的第一步泰勒展开已经是一个近似，如果第一步走出来，最终的KL散度就超标了，就完了。
于是，回溯线性搜索就是最后这一道保险：
- 先尝试迈出计算好的最大步伐。
- 把新参数放进**真实**的（未经过泰勒展开近似的）环境和模型中测一下。
- 如果发现真实的 KL 散度突破了 $\delta$，或者真实的收益下降了，就立刻把步长打个折（比如缩小一半），再重新测。
- 一直退缩，直到完全满足真实的安全条件，才正式拍板更新。
#### 存在缺陷
上面说了这么多trpo的原理，很明显让人感觉到的缺点就是，**复杂**，我们在工程实践中，往往是不能允许有这么复杂的逻辑的，因为复杂就意味着难以调试，意味着问题出现难以修复；此外trpo的计算开销也会很大。

---
## PPO
在面对上面这些问题，2017年openai团队提出了自己的[解决方案](https://arxiv.org/abs/1707.06347)。
Proximal Policy Optimization，近端策略优化算法。PPO主要有两个变体，PPO penalty和PPO clip。两者都在论文中有提及。
### PPO Penalty
这个方法在trpo的基础上，把原本的绝对不能跨越的硬性边界（$KL散度\le \delta$）变成了软惩罚（拉格朗日松弛）。
举个例子，原本是禁止超速，绝对不能超过120，但是现在超过120会罚款，超得越多罚的越狠。
#### 公式表达
$$
J^{pen}(\theta)=\mathbb{E}\Bigg[\frac{\pi_\theta(a_t|s_t)}{\pi_{\theta old}(a_t|s_t)}\hat{A}_t-\beta KL(\pi_{\theta old}||\pi_\theta)\Bigg]
$$
- 前者是原本的公式，也就是重要性采样
- 后者是增加的“罚款”：新旧策略的KL散度越大，这个值就越大，表明扣的分越多。
- $\beta$是罚款系数，表明惩罚的力度
核心点是这个公式中的$\beta$并不是固定的，而是有一个动态调控机制。
1. 先设定一个目标KL值$d_0$
2. 跑完1个batch的数据后，算一下真实的KL值d。
3. 如果$d>1.5\times d_0$，那么就加大惩罚力度，$\beta \leftarrow 2\beta$ 。
4. 如果$d<d_0/1.5$，那么久减小惩罚力度，$\beta\leftarrow2\beta$。
很明显，他的问题还是那个，就是要算KL散度，还是很难算。
### PPO clip
PPO penalty还是trpo的框架里面打转，而PPO clip就直接掀翻桌子了。
>不要算KL散度了，直接对概率比值一刀切了。

#### 核心公式
$$
L^{clip}(\theta)=\hat{\mathbb{E}}\Bigg[ \min\Big[ r_t(\theta)\hat{A}_t,\text{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat{A}_t\Big]\Bigg]
$$
其中：
$$
r_t(\theta) = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}
$$
是新旧概率比值。$r_t(\theta)$表明的是当前的策略是否喜欢这个动作，$r_t(\theta)> 1$表明策略喜欢这个工作，以后会继续增强这个动作。反之，$r_t(\theta)$表明不喜欢，以后会有削减他的动作。
$\hat A$是优势函数，表明这个动作是“好”还是“坏”。$\hat A>0$表明这个动作比平均动作好，反之则表示坏。
$\text{clip}$是截断函数，假设$\epsilon=0.2$，它会强行把$r_t(\theta)$锁在0.8到1.2之间，大于或者小于这个范围都会被截断。
$\min$是取最小值，也是整个公式*最精妙*的地方。
取最小值的对象只有两个，一个是不截断的原始项$r_t(\theta)\hat A$，另一个是截断项$\text{clip}$。这样的非堆成设计表明了整体的更新逻辑就是**见好就收，小错意识到了轻罚，犯错没意识到就重罚**。下面的例子中假设$\epsilon=0.2$
1. 当$\hat A=1$，动作很好、而且$r_t(\theta)=1.5$新策略也知道这个动作是好动作，则“见好就收”。取min得到的结果是1.2，**不会让她无限制的增长**
2. 当$\hat A=-1$，动作很坏、但是$r_t(\theta)=0.5$新策略知道这个动作不好，也在尝试减少他的时候，取min得到的结果是-0.8，会**轻微的惩罚**这个，但是不会一棒子打死。
3. 当$\hat A=-1$，动作很坏、但是$r_t(\theta)=1.5$，在动作坏的同时，新策略反而没意识到，还认为它是好动作想增加他，此时取min得到的结果就是-1.5，会狠狠地惩罚它。注意到：此时min没有选择那个被“柔和化处理”的clip的那个项，而是让**梯度全量通过**，强行把模型拽回来。

![image.png](https://img.somnus.wiki/file/1782898689792_image.png)

---
## DPO
### PPO的问题
前提提要中提到的，rlhf中为了让大模型的回答符合人类喜好，都会走过三个部分，sft、rm、rl。其中ppo就是rl部分使用的算法。
在rl（PPO）部分需要同时读取四个模型：要训练的原模型、计算KL散度需要的旧模型、评价模型、奖励模型，问题很明显，就是模型太多。稍微大一点的模型，即使使用了显存优化技术，单卡也根本没办法跑。
### 数学推导
即direct preference optimization。无论是PPO还是DPO，想要完成的目标都是一模一样的，就是让模型$\pi$尽可能得到更高的奖励$r(x,y)$，同时又不能离原始参考模型$\pi_{ref}$太远（不能让KL散度太大）。
数学表达如下：
$$
\underset{\pi}\max \bigg\{\mathbb{E}_{x\sim\mathcal{D},y\sim\pi}[r(x,y)]-\beta\mathbb{D}_{KL}(\pi(y|x)\|\pi_{ref}(y|x))\bigg\}
$$
其中$\beta$是KL散度的惩罚系数，为了控制模型不能偏离老模型太远。
对于上面的公式，进行展开KL散度。得到：
$$
\underset{\pi}\max\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[r(x,y)-\beta\log \frac{\pi(y|x)}{\pi_{ref}(y|x)} \bigg]
$$
这一步的推导是值得仔细说一下的。对于前一项即奖励项$\mathbb{E}_{x\sim\mathcal{D},y\sim\pi}[r(x,y)]$。
>根据概率论的全期望公式（或者联合概率分布拆解$P(x,y)=P(x)P(y|x)$）。

这一项就完全等于两层嵌套的期望即$\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}r(x,y)$.
对于后一项即惩罚项$\beta\mathbb{D}_{KL}(\pi(y|x)\|\pi_{ref}(y|x)$
>KL散度的计算基本公式是这样的：$\mathbb{D}_{KL}(P\|Q)=\mathbb{E}_{x\sim P}\big[\log\frac{P(x)}{Q(x)}\big]$

直接使用上面KL散度的公式带入，得到：$\beta\mathbb{E}_{y\sim\pi(y|x)}[\log\frac{\pi(y|x)}{\pi_{ref}(y|x)}]$ 
>此处为什么是对y求期望呢，是因为KL散度关注的就是对于生成的结果y在不同策略下概率分布的差异，我们的策略P就是正在训练的新策略$\pi(y|x)$，而策略Q就是原始的参考模型$\pi_{ref}(y|x)$。
>此时值得注意的是，我们在训练大模型的时候，不可能不基于输入x和数据$\mathcal{D}$训练，而我们这个公式中就没有对x求期望，所以这里是原论文中一个不严谨的地方（或者说原论文为了公式简洁），此处省略掉了对于x的期望

我们把省略的期望加上去，得到：$\beta\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}[\log\frac{\pi(y|x)}{\pi_{ref}(y|x)}]$
然后把左右两项都都替换，然后合并同类项得到：
$$
\begin{aligned}
原式&=
\underset{\pi}\max\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}r(x,y)-\underset{\pi}\max\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\beta\log \frac{\pi(y|x)}{\pi_{ref}(y|x)}
\\
&=\underset{\pi}\max\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[r(x,y)-\beta\log \frac{\pi(y|x)}{\pi_{ref}(y|x)} \bigg] 
\end{aligned}
$$
对于这个公式我们再把中括号中的两项调换一下顺序，并除以一个$\beta$。
>我们想求的是能让这个式子得到最大对应的$\pi$，于是除以$\beta$是没有影响的，调换顺序，就从原本的求max变成求min

$$
\underset{\pi}\min\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[\log\frac{\pi(y|x)}{\pi_{ref}(y|x)}-\frac{r(x,y)}{\beta} \bigg]
$$
此时来到**最关键的一步**，我们把后面的$\frac{r(x,y)}{\beta}$也放到log中，根据高中知识可以得到：
$$
\begin{aligned}
\underset{\pi}\min\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[\log\frac{\pi(y|x)}{\pi_{ref}(y|x)}-\log \exp(\frac{r(x,y)}{\beta}) \bigg] \\
=\underset{\pi}\min\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[\log\frac{\pi(y|x)}{\pi_{ref}(y|x)\exp(\frac{r(x,y)}{\beta})}\bigg] 
\end{aligned}
$$
看到这个式子我们能想到，如果能把log后面的的式子凑成满足KL散度的格式就好了，
>满足KL散度有两个硬性的要求，即P和Q分别要满足合法的概率分布，即两者所有可能的y加起来要等于1！！$\sum_y P(y)=1$ 

我们可以观察到，分子是能满足的，但是分母是绝对不满足的，于是我们便可以想办法凑出他，假设分母的概率分布总和为Z，要让他满足KL散度，就可以直接除掉Z。此时Z的计算公式如下：$Z(x) = \sum_{y'} \pi_{\text{ref}}(y'|x) \exp\left(\frac{r(x,y')}{\beta}\right)$，带入得到：
$$
\begin{aligned}
原式
&=\underset{\pi}\min\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[\log\frac{\pi(y|x)}{\frac{1}{\displaystyle Z(x)}\pi_{ref}(y|x)\exp(\frac{r(x,y)}{\beta}) \displaystyle Z(x)}\bigg] \\
&=\underset{\pi}\min\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\bigg[\log\frac{\pi(y|x)}{\frac{1}{\displaystyle Z(x)}\pi_{ref}(y|x)\exp(\frac{r(x,y)}{\beta})}-\log \displaystyle Z(x)\bigg] \\
\end{aligned}

$$
设：
$$\pi^*(y|x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y|x) \exp\left( \frac{r(x,y)}{\beta}  \right)$$
带入得到：
$$= \min_\pi \mathbb{E}_{x \sim \mathcal{D}} \bigg[ \mathbb{D}_{\text{KL}} \Big( \pi(y|x) || \pi^*(y|x) \Big) - \log Z(x) \bigg]$$
>此处的$\mathbb{E}_{y \sim \pi(y|x)} \left[ \log Z(x) \right]$，由于$Z(x)$上面的定义，所有的$y'$都被遍历并加起来了，于是这个变量就和y一点关系也没有了，对于“对y求期望”这一项就相当于常数，然后常数的期望就等于常数本身，于是直接就等于$\log Z(x)$ 

此时我们的问题关键就到了，找到一个策略，让上面这个式子最小化！！根据*吉布斯不等式*，两个概略分布的KL散度永远大于等于0，只有当两个分布完全一模一样的时候，散度才能等于0，为了让上面的式子最小，我们就得到：
$$
\pi(y|x)=\pi^*(y|x)=\frac{1}{Z(x)}\pi_{ref}(y|x)\exp(\frac{r(x|y)}{\beta})
$$
至此，传统的PPO方法推导就会结束，传统的方法就是：既然我知道了最优解长这个样子，那我就去训练一个奖励模型 $r(x,y)$，然后用强化学习逼近这个 $\pi^*$。
但是DPO不一样。🥹
### 神来之笔
DPO作者提出我们既然已经知道最优策略$\pi^*$长这个样子了，那么我们为什么还要花功夫去把$r(x,y)$求出来呢，我们为什么不直接**把 $r(x,y)$ 用 $\pi^*$ 表达出来**？。
两边同除$\pi_{ref}(y|x)$：
$$\frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} = \frac{1}{Z(x)} \exp\left( \frac{1}{\beta} r(x,y) \right)$$
两边同时取自然对数 $\log$：
$$\log \frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} = \log \left( \frac{1}{Z(x)} \exp\left( \frac{1}{\beta} r(x,y) \right) \right)$$
$$\log \frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} = -\log Z(x) + \frac{1}{\beta} r(x,y)$$
表示$r(x,y)$:
$$r(x,y) = \beta \log \frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} + \beta \log Z(x)$$
新的问题又出现了，这里的$Z(x)$是所有可能回答的积分，计算会非常复杂，怎么办？
此时DPO又回归数据的本质了，我们不需要关注一个回答的绝对分数是多少多少，我们**只需要关注偏好**即（*preference*，DPO里面的P），换句话说就是，我们只关注哪个回答更好，哪个更坏。
根据Bradley-Terry 模型，人类觉得 $y_w$ 比 $y_l$ 好的概率，取决于它们的**分数差**：
$$r(x, y_w) - r(x, y_l)$$
$$
\begin{aligned}
r(x, y_w) - r(x, y_l) &= \left[ \beta \log \frac{\pi^*(y_w|x)}{\pi_{\text{ref}}(y_w|x)} + \color{red}{\beta \log Z(x)} \right] - \left[ \beta \log \frac{\pi^*(y_l|x)}{\pi_{\text{ref}}(y_l|x)} + \color{red}{\beta \log Z(x)} \right]\\
&= \beta \log \frac{\pi^*(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi^*(y_l|x)}{\pi_{\text{ref}}(y_l|x)}
\end{aligned}
$$

>按照 Bradley-Terry 模型，$y_w$ 战胜 $y_l$ 的概率是 :
$$P(y_w \succ y_l) = \sigma(r_w - r_l)$$

我们在深度学习里，想要最大化这个获胜概率，也就是要**最小化它的负对数似然 (Negative Log-Likelihood)**。最后，我们把理论上的最优解 $\pi^*$，替换成我们正在用 PyTorch 训练的神经网络参数 $\pi_\theta$。
这就自然而然地得到了在文档里看到的、大名鼎鼎的 **DPO 损失函数**：
$$\mathcal{L}_{DPO} = - \mathbb{E}_{x, y_w, y_l} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)} \right) \right]$$
>至于最后为什么要用**负对数似然**呢，这里纯粹是**工程实践**的问题。我们实际情况肯定不是一条数据，如果有很多数据，概率都是0到1之间，直接乘会导致计算机出现浮点数下溢出（underflow），于是便增加了一个求对数，把乘积转变成累加。
>为什么是负呢，纯粹是因为目前深度学习框架的几乎所有的优化器（adam，sgd）在设计的时候都默认用来寻找“山谷”的最低点，我们最大化一个东西，就直接取负就行了。
>而最后套的这个求期望，就是表达深度学习中最基础的一个动作：**“在整个训练数据集上求平均 Loss”**。

至此DPO的核心公式就推导完了！！
### 个人小结
DPO的最大创新就是我上面提到的那个神来之笔，即**无须显式的拟合奖励模型**的情况下，高效的学习出与人类偏好一致的最优策略。
“DPO 是把 RM 和 RL 揉在了一起，用一步分类 Loss 直接干完了两步的活”。
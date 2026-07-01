+++
title = "ppo vs dpo vs grpo"
date = 2026-06-30T14:30:47+08:00
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
### 传统策略梯度（vanilla policy gradiant，VPG）
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
### 自然策略梯度（natural policy gradiant，NPG）
面对上面的问题，我们很自然的会想到，通过限制步长来解决，
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
### 信赖阈策略算法（trust region policy optimization，trpo）
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
### 存在缺陷
上面说了这么多trpo的原理，很明显让人感觉到的缺点就是，**复杂**，我们在工程实践中，往往是不能允许有这么复杂的逻辑的，因为复杂就意味着难以调试，意味着问题出现难以修复；此外trpo的计算开销也会很大。

---
## Proximal Policy Optimization，PPO
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
$\text{clip}$是截断函数，当$\epsilon=0.2$的时候它会强行把$r_t(\theta)$锁在0.8到1.2之间，大于或者小于这个范围都会被截断。
$\min$是取最小值，也是整个公式*最精妙*的地方。
取最小值的对象只有两个，一个是不截断的原始项$r_t(\theta)\hat A$，另一个是截断项$\text{clip}$。这样的非堆成设计表明了整体的更新逻辑就是**见好就收，犯错就重罚**。下面的例子中假设$\epsilon=0.2$
1. 当$\hat A=1$，动作很好、而且$r_t(\theta)=1.5$新策略也知道这个动作是好动作，则“见好就收”。取min得到的结果是1.2，**不会让她无限制的增长**
2. 当$\hat A=-1$，动作很坏、但是$r_t(\theta)=0.5$新策略知道这个动作不好，也在尝试减少他的时候，取min得到的结果是-0.8，会**轻微的惩罚**这个，但是不会一棒子打死。
3. 当$\hat A=-1$，动作很坏、但是$r_t(\theta)=1.5$，在动作坏的同时，新策略反而没意识到，还认为它是好动作想增加他，此时取min得到的结果就是-1.5，会狠狠地惩罚它。注意到：此时min没有选择那个被“柔和化处理”的clip的那个项，而是让**梯度全量通过**，强行把模型拽回来。

![image.png](https://img.somnus.wiki/file/1782898689792_image.png)

---
## DPO
脑力今日已过载，明天再看。

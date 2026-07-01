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
\Delta\theta^*=\underset{\mathcal{D}_{KL}(\pi_\theta||\pi_{\Delta\theta})\le\epsilon}{\arg\max}J(\theta+\Delta\theta)
$$
#### 数学魔法
KL 散度是一个非常复杂的非线性积分，直接把它放进神经网络里求导是极其困难的。
NPG 在这里引入了微积分里的泰勒展开，对 KL 散度进行二阶近似。奇妙的事情发生了，KL 散度的二阶导数（海森矩阵）正好等于统计学中鼎鼎大名的**费雪信息矩阵 $F$**。
你可以把费雪矩阵 $F$ 理解为当前策略空间的“曲率地图”或“敏感度矩阵”。它精确地记录了：此时此刻，改变哪几个参数会导致动作分布发生剧烈变化。
$$F = \mathbb{E}_{\pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a|s) \nabla_\theta \log \pi_\theta(a|s)^T \right]$$
#### 存在缺陷
**算力需求高**，假设神经网络有N个参数，费舍尔矩阵就有$N\times N$个参数，更要命的是还要求费舍尔矩阵的逆矩阵$F^{-}$ ，线性代数中告诉我们，计算逆矩阵的时间复杂度是$O(n ^3)$ ，此时算力雪球会爆炸。

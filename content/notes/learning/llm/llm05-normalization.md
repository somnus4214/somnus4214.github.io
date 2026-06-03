---
title: 什么是归一化normalization
date: 2026-06-02T17:51:00+08:00
draft: false
categories:
  - ""
tags:
  - ""
  - llm
  - learning
image: ""
math: true
heroAccent: ""
professionalReport: false
hideFromHome: false
---

## normalization

即归一化，即把数值缩放到**正态分布**的范围内，通常是为了消除不同特征的量纲差异，使得数据更适合进行后续的分析和处理。

### batch normalization

是指在神经网络的每一层，对mini-batch都进行归一化处理。
优点：加速网络训练；防止梯度问题；优化正则化效果。
缺点：BN对batch-size的大小很敏感，要求数据长度一致，且受离群数据的影响很严重。

### layer normalization

在神经网络的每一层，对每个样本的特征通道进行归一化处理。
计算过程如下：

1. 首先计算每个样本的特征值的均值和方差
   $$
   \begin{align*}
   \mu&=\frac{1}{d}\sum_{i=1}^dx_i\\
   \sigma&=\sqrt{\frac{1}{d}\sum_{i=1}^d(x_i-\mu)^2}
   \end{align*}
   $$
2. 使用均值和方差对输入X进行归一化
   $$
   X_{norm}=\frac{X-\mu}{\sigma+\epsilon}
   $$
3. 最后将归一化之后的$X_{norm}$乘以权重$w$，加上偏置
   $$
   Y=X_{norm}w+b
   $$
   优点：训练样本小，样本间的影响较大的情况下更稳定。主要应用于RNN。

```Python
class LayerNorm(nn.Module):
    # features: (bsz, max_len, hidden_dim)
    def __init__(self, features, eps=1e-6):
        super(LayerNorm, self).__init__()
        self.a_2 = nn.Parameter(torch.ones(features))
        self.b_2 = nn.Parameter(torch.zeros(features))
        self.eps = eps
    def forward(self, x):
        # 就是在统计每个样本所有维度的值，求均值和方差，所以就是在hidden dim上操作
        # 相当于变成[bsz*max_len, hidden_dim], 然后再转回来, 保持是三维
        mean = x.mean(-1, keepdim=True) # mean: [bsz, max_len, 1]
        std = x.std(-1, keepdim=True) # std: [bsz, max_len, 1]
        # 注意这里也在最后一个维度发生了广播
        return self.a_2 * (x - mean) / (std + self.eps) + self.b_2
```

### instant normalization

对于每个样本的每个特征通道进行归一化。
**优点： 更适用于图像生成等任务中，每个样本的特征通道独立于其他样本的情况**

### group normalization

IN和LN的融合，在神经网络的每一层中，**将特征分成若干组，对每个组的特征进行归一化处理。**

**优点： 适用于样本较小、样本间相互影响较大，但又不需要对整个mini-batch进行归一化的情况。**

### RMSNorm

LayerNorm每次都需要计算均值和方差，而RMSNorm没有去中心化的操作，只有缩放的操作，**只需要计算方差计算量更小**。这也是Llama模型使用的Normalization方法。

对于给定的输入$X$(其中 $X$是一个$n\times d$的矩阵，$n$是批次大小，$d$是特征维度)，RMSNorm 的计算可以表示为:

1. 计算均方根，同时加上一个小的常数$\sigma$以避免除以零：

$$RMS(x)= \sqrt {\frac{1}{d} \sum_{i=1} ^d x_i^2 +\sigma}$$

2. 最后，使用得到的 RMS 值对输入 $X$ 进行归一化，并乘以可学习的权重参数 $w$:

$$Y = X * \frac{1}{RMS(x)} * w$$

```Python
class RMsNorm(torch.nn.Module):
    def __init__(self, dim:int, eps:float =1e-6):
        super()._init_()
        self.eps=eps
        self.weight =nn.Parameter(torch.ones(dim))
    def _norm(self，x):
        return x*torch.rsqrt(x.pow(2).mean(-1,keepdim=True)+ self.eps)
    def forward(self，x):
        output =self._norm(x.float()).type_as(x)
        return output* self.weight
```

### 为什么使用layer normalization

layer normalization和其他所有normalize的方法一样，目的都是为了防止因为训练后续的参数爆炸（数字变得特别大），导致训练的梯度消失（权重更新就是根据梯度来得到的）。反之也是，如果参数过小，就很容易导致梯度爆炸。总的来说，归一化的目的就是为了**保证训练的稳定性**。
其次，归一化还能**加速模型收敛**。模型的每一层都在拟合一个数据，如果不进行归一化，每次数据分布都会发生变化，导致模型的学习会变得困难。
还有一个值得一提的好处，归一化有助于让模型训练**不再依赖**权重的初始化。

### 为什么不用batch normalization

batch normalization是很早提出来的，常用于CV领域，但是在NLP不常用，主要是有以下原因。

1. batch要大，小的batch往往会导致模型训练不稳定。
2. batch在训练时可能会出现一些跨设备通信的问题，在现代算力集群中，同一个batch可能会被分到不同的机器上，这样不同机器之间的通信也要被计算到训练消耗之中。通过mini-batch或者syncbatch normalization可以“解决”这个问题，但是不管怎样，在模型足够大的时候，额外的通信开销是个问题
3. 训练和预测会不一致：在训练时会有大批量的数据组成batch，但是在预测的时候只有一个样本数据，batch norm就废了。
4. 并不适合主流NLP框架
5. 并不适合长度不固定的NLP序列。

### why post norm > pre norm

> 经典问题回归，在通过[苏建林的解释](https://kexue.fm/archives/9009)之后，才对这个问题有了更深层次的理解。🤔

在他的博客中说到，pre norm的层数是**有水分**的！也就是说相同的层数的post norm和pre norm，前者的实际层数就会比后者多，因此性能也肯定会更强。
解释原因如下：
首先pre norm和post norm的公式分别如下：

$$
\begin{align}
pre\_norm: x_{t+1}=x_t+F_t(Norm(x_t))\\
post\_norm: x_{t+1}=Norm(x_t+F_t(x_t))
\end{align}
$$

知乎上 [@唐翔昊](https://www.zhihu.com/question/519668254/answer/2371885202) 给出的答案是：**Pre Norm的深度有“水分”**！也就是说，一个L层的Pre Norm模型，其实际等效层数不如L层的Post Norm模型，而层数少了导致效果变差了。
我们对原始公式进行递归：

$$
\begin{align*}
x_{t+1}&=x_t+F_t(Norm(x_t))\\
&=x_{t-1}+F_{t-1}(Norm(x_{t-1}))+F_t(Norm(x_t))\\
&=\cdots \\
&=x_0+F_0(Norm(x_0))+\cdots+F_{t-1}(Norm(x_{t-1}))+F_t(Norm(x_t))
\end{align*}
$$

假设每一层的餐叉增量都是同一量级，比如都是$O(1)$，原公式就是：

$$
x_{t+1}\approx x_0+O(t+1)
$$

那么$x_{t+1}$和$x_t$之间的差距就相当于$t+1$和$t$之间的差别，当t相当大的时候，两者的相对差别就减小了很多。
这个意思是说，当t比较大时，$x_t$,$x_{t+1}$相差较小，所以$F_{t+1}(Norm(x_t+1))$与$F_{t+1}(Norm(x_t))$很接近，因此原本一个t层的模型与t+1层和，近似等效于一个更宽的t层模型，所以在Pre Norm中多层叠加的结果更多是增加宽度而不是深度，层数越多，这个层就越“虚”。
也就是说pre norm的结构会无形之间增加模型的宽度而降低模型的深度，而明显模型深度会更重要，等效导致模型性能降低变差；而post norm则相反，他的每次norm会削弱恒等分支的权重，更突出残差分支，效果会更好。可以参见[这篇博客](https://kexue.fm/archives/8620)。

## Q&A

1. Normalization 在深层网络里解决什么问题？
   是为了消除不同分布的数值会导致的梯度爆炸或消失的问题，保证模型训练的稳定性
2. BatchNorm 和 LayerNorm 的统计维度有什么不同？
   一个是横向的，一个是纵向的
3. 为什么 Transformer 更常用 LayerNorm 而不是 BatchNorm？
   batchsize通常会要求比较大，过小的batchsize训练效果不好，而且可能会出现跨设备通信的问题，batch norm不适合nlp框架；batchnorm训练和预测的size会不一致。
4. PreNorm 和 PostNorm 的结构差异是什么？
   一个是先进行归一再累加残差，另一个是先累加再归一。
5. 为什么现代大模型更偏向 PreNorm？
   大模型层数并不大，所以pre norm的性能差异不会很明显，而pre norm相对post norm更容易训练。
6. RMSNorm 相比 LayerNorm 少做了什么？为什么它更高效？
   LayerNorm每次都需要计算均值和方差，而RMSNorm没有去中心化的操作，只有缩放的操作，**只需要计算方差计算量更小**。

Q2 “横向/纵向”这个说法太模糊。建议这样记：

- **BatchNorm**：对同一个特征维度，在 batch 维度上统计均值/方差。
- **LayerNorm**：对单个 token / 单个样本，在 hidden dimension 上统计均值/方差。

在 Transformer 里，某个 token 的 hidden vector 形状类似：

`[h1, h2, h3, ..., hd]`

Q4 你的描述接近，但要把 sublayer 放进去：

`PostNorm: x -> Sublayer -> Add residual -> Norm 
`PreNorm: x -> Norm -> Sublayer -> Add residual`

不是简单“归一再累加”，而是 **Norm 放在 Attention/FFN 前面还是后面**。

Q5 这里有个明显要改的点：现代大模型层数其实很深，不是“层数并不大”。PreNorm 更常用的核心原因是：

> residual path 更干净，梯度可以更稳定地从深层传回浅层，所以深层 Transformer 更容易训练。

PostNorm 在浅层或原始 Transformer 里可用，但模型加深后更容易训练不稳定。

Q6 你说对了“没有去中心化”，但最后一句要改：RMSNorm 不是“只需要计算方差”，而是计算 **均方根 RMS**：

`RMS(x) = sqrt(mean(x^2))`

它不计算均值，也不做 x - mean(x)，所以比 LayerNorm 少一步中心化，计算更简单。

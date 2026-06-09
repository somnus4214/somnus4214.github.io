---
title: embedding
date: 2026-06-05T14:03:18+08:00
draft: true
categories:
  - ""
tags:
  - ""
image: ""
math: true
hideFromHome: false
---
>我对embedding的印象还是在做dify和fastgpt的客服时，有数据库rag解析的需求时，你需要接入一个embedding模型api，比如BGE或者text-embedding-v4，那时候对于embedding有一定初步的认识，今天详细了解一下。

## 基础介绍
embedding即嵌入（我印象中一直记得嵌入式工程师的英文🧑‍💻），是将经过tokenizer得到的编号转变成向量矩阵。
## 编码方式
### 独热编码（one-hot encoding）
最简单，即用向量中的一个数字1来代表该词，于是对于一个N个的词汇表，独热编码对应的向量维度为N。
缺点如下：
- 语义鸿沟：很明显无法表明两个词向量之间的距离关系，因为任意的两个向量之间的距离都是固定的。
- 维度灾难：高维情况下将导致数据样本稀疏，距离的计算困难，对于下游模型的负担很重。
### Word2Vec
我先按照我的理解把这个说一下，Word2Vec就是根据相邻近的词的关系，然后得到对应的向量矩阵，其中主要有两个算法SG和CBOW，前者是根据目标词target，预测临近的context词，后者是根据上下文的context，预测得到target。
最开始，词对应的向量矩阵是随机生成的，然后通过不断投喂数据，让他学习改进，由于猫和狗经常出现在同一个情况的上下文中，导致其两者的向量距离越来越近。表明其语义也就很近。
对于SG和CBOW，他们的核心区别其实并不是从target推context或者从context推target，而是**取平均数**，就是CBOW会对context取一个平均再进行运算。![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/%E6%88%AA%E5%B1%8F2026-06-09%2017.21.20.png)
取平均这个操作会产生以下影响：
- 训练速度不同：倘若有n个target，窗口大小为w，那么SG的样本数量接近于$2*w*n$个，但是CBOW只有近似于n个参数。
- 训练效果不同：SG适用于相对少量的数据，对于稀有词的效果更好，CBOW比SG快了很多，但是常用词的表征效果也比SG好一点。
Word2Vec的核心缺点：
- 一个词永远只有一个向量；
`苹果很好吃`
`苹果发布了新手机`
这里的“苹果”一个是水果，一个是公司，但传统 Word2Vec 只会给它同一个向量。
- 高频但意义不大的stop word（比如the）会充斥训练样本，

### FastText
Word2Vec将每个单词作为最小单位，为每个单词生成一个向量，对于中文没什么，但是对于英文，会忽略其单词内部的形态特征，比如Apple和Apples。
FastText是使用n-gram来构建文本特征的，n-gram是通过滑动窗口n对文本进行处理得到一系列长度为n的字节片段序列，例如当n等于3
$$<ap,app,ppl,ple,le>$$
其中<表示前缀，>表示后缀。
其好处是：
1. 对于低频次生成的词向量效果会更好，因为他们的n-gram可以和其他词共享。
2. 对于训练词库外的单词，仍然可以构建他的词向量，可以叠加得到他的字符级n-gram词向量。
### Glove
根据语料库构建出一个共现矩阵，矩阵中每个元素$X_{ij}$代表单词$i$和$j$在特定大小的上下文窗口中共同出现的次数，然后使用神经网络来拟合共现矩阵。
![697](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260609180113919.png)
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260609180135862.png)
$$x_{max} = 100, \alpha = 0.75$$向量v是要学习的参数，本质上与监督学习的训练方法一样，采用了AdaGrad的梯度下降算法，对矩阵X中的所有非零元素进行随机采样，学习曲率（learning rate）设为0.05，在vector size小于300的情况下迭代了50次，其他大小的vectors上迭代了100次，直至收敛。最后我们对于一个词w的target embedding和context embedding，就是它对应的$v_i$和 $v_j$求和。
Glove对比Word2vec
- **word2vec是局部语料库训练的，其特征提取是基于滑窗的**；**glove的滑窗是为了构建共现 matrix**，是基于全局语料的，可见glove需要事先统计共现概率；因此，word2vec可以进行在线学习，glove则需要统计固定语料信息。并且**Glove训练时收敛更快**。
- word2vec是无监督学习，同样由于不需要人工标注；glove通常被认为是无监督学习，但实际上glove还是有label的，即共现次数log(Xij)。
- word2vec损失函数实质上是带权重的**交叉熵**，权重固定；glove的损失函数是**最小平方损失函数**，权重可以做映射变换。
- **Glove可拓展性好**，对于很小或很大的corpus都可以有效地训练；另外，对于**限制embedding维度更低的情况，Glove也表现很好。**
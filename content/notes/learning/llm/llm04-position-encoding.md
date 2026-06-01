---
title: Llm04 Position Encoding
date: 2026-05-15T22:42:47+08:00
draft: false
categories:
  - ""
  - learning
tags:
  - ""
  - llm
  - ai
  - learning
image: https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260515225719369.png
math: true
heroAccent: ""
professionalReport: false
hideFromHome: false
---

## 位置编码
卷积具有局部性，天然地会注意元素之间的相对位置，但是基于自注意力的transformer模型则对位置不敏感，因此必须要把元素的位置信息在embedding阶段传给元素。
比如：
```plaintxt
我 爱 你
你 爱 我
```
在自注意力的理论中，这两个句子的表意是一样的，但是很明显这两者是天差地别的。
### 绝对位置编码
在早期的BERT、GPT2等模型中，会直接将绝对位置编码加入到embedding中，但是绝对位置编码又分为两种
1. 可学习的绝对位置编码：直接对不同位置随机初始化一个position embedding，将其加入到文本的embedding中，但是这样的方法引入了大量可学习的参数，需要大量数据才能训练。
2. 固定绝对位置编码：attention is all you need中使用的三角位置编码

公式如下

$$
\begin{aligned}
PE_{(pos,2i)}=\sin(\frac{pos}{10000^{\frac{2i}{d_{model}}}}) \\ 
PE_{(pos,2i+1)}=\cos(\frac{pos}{10000^{\frac{2i}{d_{model}}}})
\end{aligned}
$$
其中$d_{model}$是位置编码的长度，$i \in [0,1,...,(d_{model}-1)/2]$。
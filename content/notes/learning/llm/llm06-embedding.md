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

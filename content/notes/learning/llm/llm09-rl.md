---
title: ppo vs dpo vs grpo
date: 2026-06-30T14:30:47+08:00
draft: false
categories:
  - ""
  - learning
tags:
  - ""
  - llm
  - learning
  - rl
image: ""
math: true
hideFromHome: false
---

>这一节主要讲的就是大模型的强化学习策略，现在主流的方案就包括ppo、dpo、grpo。

## 背景介绍
一个传统的完整的rlhf（reinforcement learning from human feedback，人类反馈强化学习）要包括三部分：sft（监督微调）、rm（奖励模型训练）、rl（强化学习微调）。
而今天提到的三种方法，都是第三部中强化学习微调的时候，使用的不同的算法。

## PPO
proximal policy optimization，即近端策略优化
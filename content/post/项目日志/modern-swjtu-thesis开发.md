+++
title = 'Modern Swjtu Thesis开发'
date = 2026-04-17T11:22:31+08:00
draft = true
categories = [""]
tags = [""]
image = ""
math = true
[build]
  list = "always"
+++

> 最近正在准备写本科毕业设计论文，不想用微软的word写，因为感觉不够极客 :anguished: ，也不想使用latex，因为latex太笨重了，编译速度太慢了，在线服务overleaf又是收费的（帮黄学长报销这个来着，好像一个月要三百多 🙀）
> 在网上搜罗搜罗发现了typst，一个基于rust内核的开源的标记语言排版系统，速度非常快，功能我觉得的也足够强（公式什么的都能很好地显示），同时我在他的模板库也找到了其他大学的毕业论文模板（nju），于是基于这个模板，我便衍生做一个swjtu的版本，最后，感谢nju-lug。

## 1基础介绍

先简单介绍一下typst，

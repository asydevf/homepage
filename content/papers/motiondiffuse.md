---
title: "MotionDiffuse: Text-Driven Human Motion Generation with Diffusion"
authors: Zhang et al.
venue: arXiv 2022
year: 2022
arxiv: https://arxiv.org/abs/2208.15001
progress: 60
status: 阅读中
repo: ""
tags: [Diffusion, Text2Motion]
---

## 论文概述

首个将扩散模型应用于文本驱动动作生成的工作。将自然语言描述映射为连续的人体动作序列，实现了从文本到动作的端到端生成。

## 核心方法

- 文本编码器提取语义特征
- 扩散模型在动作空间中逐步去噪
- 分层控制：全局动作 + 局部细节

## 阅读笔记

Text2Motion 的 baseline，后续很多工作都基于这个框架扩展。扩散模型在动作空间的效果比 GAN 更稳定，但推理速度较慢是主要瓶颈。

## 复现进展

- [x] 读完论文
- [ ] 跑通代码
- [ ] 尝试用自己的文本输入测试

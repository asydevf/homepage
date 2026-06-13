---
title: "InterGen: Interaction-aware Human Motion Generation via Diffusion"
authors: Li et al.
venue: ICCV 2023
year: 2023
arxiv: https://arxiv.org/abs/2304.12294
progress: 80
status: 复现中
repo: https://github.com/tr3e/InterGen
tags: [Diffusion, Motion, Interaction]
---

## 论文概述

提出了一种交互感知的人体动作生成方法，通过扩散模型建模多人之间的物理互动关系。核心思路是将交互条件注入扩散过程，让模型学会生成协调的双人动作。

## 核心方法

- 基于 DDPM 的动作生成框架
- 交互条件编码器：捕捉两人之间的相对位置和动作关系
- 分阶段训练：先学单人动作，再学交互模式

## 阅读笔记

关键创新点在于交互表示的设计——不是简单拼接两人动作，而是用相对位姿和接触点来编码交互关系。这比直接 concatenation 效果好很多。

## 复现进展

- [x] 读完论文，理解核心方法
- [x] 跑通官方代码 demo
- [ ] 在新数据集上训练
- [ ] 对比实验

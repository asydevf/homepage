---
title: "HumanMAC: Masked Motion Completion for Human Motion Prediction"
authors: Chen et al.
venue: ICCV 2023
year: 2023
arxiv: https://arxiv.org/abs/2303.14937
progress: 40
status: 已读
repo: ""
tags: [Transformer, Motion, Prediction]
---

## 论文概述

将掩码补全（masked completion）范式引入人体动作预测，类似于 BERT 在 NLP 中的做法。随机遮盖动作帧，训练模型补全缺失部分。

## 核心方法

- 动作序列 token 化
- 掩码训练策略：随机遮盖不同比例的帧
- Transformer 编码器-解码器架构

## 阅读笔记

掩码补全的思路很优雅，把动作预测转化为了一个自监督学习问题。但对长序列的预测效果还有待提升，超过 2 秒的动作质量下降明显。

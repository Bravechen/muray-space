---
lang: zh-CN
title: 使用Python学习数学--02
description: 使用Python学习数学，第二篇 处理用户输入和异常
date: 2024-9-10
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: math
tags:
  - "Python"
  - "Math"
coverImg: ""
---

# 处理用户输入和异常

## 获取用户输入

获取用户输入使用`input()`函数，`input()`函数的返回值是一个字符串，如果需要将输入转换为其他类型，可以使用`int()`、`float()`等函数。

```python
a = input()
print("user input:", a)

# user input: 123

```

### 处理分数输入

`Fraction`除了表示分数，还可以用来处理了分数输入。

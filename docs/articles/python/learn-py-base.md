---
lang: zh-CN
title: Python语言基础学习
description: Python语言基础语法
date: 2024-9-18
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: Python
tags:
  - "Python"
coverImg: ""
---

# Python语言基础学习

## 语法编写特点

感觉python书写起来和别的语言的很大不同点，在于使用缩进和冒号(:)。

### 条件和循环

条件表达式：

```python
if condition_1:
    statement_1
elif condition_2:
    statement_2
...
elif condition_i:
    statement_i
else:
    statement_n
```
::: tip 提示
`if`可以单独使用。但是`elif`和`else`必须配合`if`使用。
:::

python中没有`switch..case`语句，如果要实现类似的功能，可以使用`if elif else`。或者使用字典等数据结构。

::: warning 注意
在条件语句的末尾必须加上冒号（`:`），这是 `Python` 特定的语法规范。
:::

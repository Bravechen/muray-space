---
lang: zh-CN
title: Rust代码为什么输出 2
description: Rust代码为什么输出 2
date: 2023-08-09
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: Rust CookBook
tags:
  - "Rust"
  - "Rust基础练习"
coverImg: ""
---

```rust
fn main() {
    let mut a = 5;
    let mut b = 3;
    print!("{}", a-- - --b);
}
```

与`C`或`Java`不同，`Rust`中没有一元递增或递减运算符。`Rust`语言设计`FAQ`曾经提到了原因：

**为什么Rust没有递增和递减运算符？**

前置递增和后置递增（以及递减的等价物）虽然方便，但也相当复杂。
它们需要了解评估顺序，并且常常导致`C`和`C++`中的隐晦错误和未定义行为。
`x = x + 1`或`x += 1`只稍微长一点，但是更加明确。

在没有后置和前置递减运算符的情况下，`a-- - --b`被解析为`a - (-(-(-(-b))))`。对于`a = 5`和`b = 3`的情况，该表达式的值为`5 - 3`，即`2`。

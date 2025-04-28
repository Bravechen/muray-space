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

感觉`python`书写起来和别的语言的很大不同点，在于使用缩进和冒号(`:`)。

python 中没有使用`{}`来声明代码块。而是使用缩进来声明代码块。
在条件、循环、函数和类中，使用冒号（`:`）来声明代码块， 并使用缩进来区分不同层级的代码块。

### 条件和循环

条件表达式：

```python
if condition_1:
    statement_1
elif condition_2:
    statement_2
# ...
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

### 自定义函数

python 中有很多内置的函数，如`print()`、`input()`、`len()`等。
这里，我们先来看看如何自定义一个函数。 s

## 异常处理

python中使用`try...except`来捕获异常。

```python
try:
    # 尝试执行代码
except Exception as err:
    # 处理异常
    print('处理异常：{}'.format(err))
```

比较有特点的是，python 中的异常捕获可以使用多个 except 块，并且还可以精确的指定捕获哪种异常（可以捕获多个异常）。

### 捕获多个异常

```python
try:
    # 尝试执行代码
    a = 1 / 0
except (ZeroDivisionError, TypeError) as err:
    print('处理异常：{}'.format(err))
```
捕获多个异常时，异常类型可以放在圆括号中，多个异常用逗号隔开。

他也等同于以下形式：

```python
try:
    # 尝试执行代码
except ZeroDivisionError as err:
    print('处理异常：{}'.format(err))
except TypeError as err:
    print('处理异常：{}'.format(err))
```

使用第一种形式，可以减少代码量，提高可读性和简洁度。
第二种方式则要注意，多个`except`块的顺序，因为只能有一个块会执行。因此，如果第一个`except`块匹配了异常，那么第二个`except`块将不会被执行。

### finally

`python`中的异常捕获也有`finally`。用于在无论正常与异常发生之后都会执行的操作。
通常可以在`finally`块中释放资源，如关闭文件、数据库连接等，或者进行一些清理工作。

```python
try:
    # 尝试执行代码
    a = 1 / 0
    print('执行成功')
except Exception as err:
    print('处理异常：{}'.format(err))
    print('执行失败')
finally:
    print('finally')
```

我们把异常的处理综合一下，展示一个例子：

```python
def read_write_file(input_file, output_file):
    # 初始化文件对象为None，避免finally中引用未定义变量
    input_fh = None
    output_fh = None
    
    try:
        # 尝试打开输入文件进行读取
        input_fh = open(input_file, 'r', encoding='utf-8')
        content = input_fh.read()
        print("读取内容成功:", content[:50] + "...")  # 打印前50字符避免过长
        
        # 尝试打开输出文件进行写入
        output_fh = open(output_file, 'w', encoding='utf-8')
        output_fh.write(f"Processed: {content.upper()}")
        print("写入内容成功")
        
    except FileNotFoundError as e:
        print(f"错误：文件不存在 - {e}")  # 捕获输入文件未找到
    except PermissionError:
        print("错误：无文件读写权限")  # 捕获权限问题
    except UnicodeDecodeError:
        print("错误：文件编码格式不匹配")  # 解码异常
    except IOError as e:
        print(f"IO操作失败：{e}")  # 通用IO异常（如磁盘满）
    except Exception as e:
        print(f"未知错误：{e}")  # 兜底异常捕获
    finally:
        # 确保关闭所有已打开的文件句柄
        if input_fh is not None:
            input_fh.close()
            print("输入文件已关闭")
        if output_fh is not None:
            output_fh.close()
            print("输出文件已关闭")
        print("-------- 清理完成 --------")

# 测试用例
read_write_file("example.txt", "output.txt")

```

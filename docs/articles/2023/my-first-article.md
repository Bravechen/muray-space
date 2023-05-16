---
lang: zh-CN
title: 第一篇文章
description: 我的第一篇文章
date: 2023-04-24
permalinkPattern: :year/:slug.html
editLink: false
# editLinkPattern: ''
lastUpdated: true
# contributors: true
category: '闲聊'
tags:
  - '闲聊'
  - '里程碑'
coverImg: "/assets/beach-g8153c8171_640.jpg"
---

## 开始写博客了

终于，自己的小站逐步建立了起来。

这是我写的第一篇博客文章。许多年来，自己兜兜转转直到今天才建立博客站，充分说明了一个问题：自己比较懒😄。有人说正视自己的缺点是改正的开始（也许），但愿如此。从事程序开发这项工作，眼界需要开阔，也需要脚踏实地的实践。人脑毕竟不是电脑，有些自己才有的感悟是应当积累下来的。虽然这些年自己没有写什么博客文章，不过也积累了不少笔记。从遇到问题的解决方案，到研究过程中的参考资料，还有自己编程实践所得的结果，连篇累牍都塞进了各类笔记软件里。对于指导自己的工作确实大有裨益。今天，希望自这篇文章始，也能慢慢丰富这个小小站点的内容。

既然自己做的是程序开发，热爱前端方向。那就从这个站点的前端说起吧。

## 小站的前端
整个站点其实算一个静态站，利用`Vuepress`框架来搭建。
`Vuepress`本来是用来快速生成技术文档的工具，比如你开发了一项技术或者框架，想要详细的讲解其中原理、使用方法或理念等等，都可以使用它来搭建。每篇文档用`markdown`格式写好，就可以自动生成对应的网页，简单快捷。此外官方还提供了很多有用的`API`对生成的静态页面进行定制，并且可以开发主题和利用插件增强功能。于是搭建简单静态博客站所需功能也就基本齐备，自然可以用它来做一些事情了。

对于我搭建的这个小站而言，`Vuepress`官方提供的默认主题自然是无法满足个性化的需要。于是，我便想开发一个自己喜欢的主题，不仅能吸收默认主题的优点，还能添加一些需要的功能。

全部站点和主题的开发，基本遵循了`Vuepress`的理念。博客文章使用`markdown`格式撰写即可。根据文章中的元信息和站点的用户配置，可以提供文章列表、分类、标签和年度归档等功能。主题的设计是从[花瓣](https://huaban.com/)网上找来的一个概念图参考制成，颜色方案则是取自[Adobe Color](https://color.adobe.com/explore)，最后通过[墨刀](https://modao.cc/)制作网站原型。其他的界面、样式和功能开发则和普通的`vue`项目没有太大的区别，所要注意的是，静态站的生成过程其实是一种`SSR`（Server Side Render），准确的说是`SSG`(Server Side Generate)。有一些坑，但是填平的难度并不大（有道是易则行之，难则绕之，其实自己偷懒规避了不少难点 `(￣▽￣)V` ）。
## 嵌入代码

在文章中嵌入代码示例是比较重要的功能。我很喜欢`vuepress`默认主题提供的嵌入代码tab切换功能，于是边研究源码边实验，也弄了一套类似的机制。下面展示了一个例子：

:::: code-group
::: code-group-item HTML
```html
<div class="welcome">您好</div>
```
:::
::: code-group-item CSS
```css
.welcome {
  font-size: 16px;
}
```
:::
::: code-group-item JS
```js
console.log('Hello, world');
```
:::
::::

代码块是利用[prismjs](https://prismjs.com/)提供的解析功能和代码主题文件。进行了一些小小的修改，增加了几个实用功能。

```js{1, 3-4}
var a = 1;
var b = 2;
var c = 3;
var d = 4;
```

```rust
let a = 1;
let b = 2;
let c = "abc";
```

## `Badge`内置组件，可以做点有趣的事

`Badge`内置组件在默认主题中也有提供，但是应用了自定义主题之后就无法再使用，所以依照默认主题的功能进行复刻开发。

```html
<Badge type="tip" text="^o^" vertical="middle" /> 
<Badge type="warning" text="=.=" vertical="middle" /> 
<Badge type="danger" text="-_-|||" vertical="middle" />
```

渲染出来是这样的：

- 这是提示文字 垂直居中对齐 - <Badge type="tip" text="呵呵 ^o^" vertical="middle" /> 
- 这是一段需要注意的文字 顶对齐 - <Badge type="warning" text="额 =.=" vertical="top" /> 
- 这是一段需要警告的文字 底对齐 - <Badge type="danger" text="这个嘛... -_-|||" vertical="bottom" />

## 自定义容器，也是简单好用

自定义容器也是默认主题中的亮点，结合本站的主题，也进行了复刻：

::: tip 提示
这里写点普通的提示, 嵌入代码`Vuepress`
:::

::: warning 注意
这里是需要注意的内容, 嵌入代码`Vuepress`
:::

::: danger 警告
千万小心，不要这么做, 嵌入代码`Vuepress`
:::

::: details 详细说
还可以将特殊的话变为详情, 嵌入代码`Vuepress`

```js
console.log('Hello world!');
```

:::

::: center 居中容器
这部分内容会居中展示, 嵌入代码`Vuepress`
:::

:::: theorem

特殊内容展示

::: right
———— 实验一下
:::
::::


::: note
这是一段笔记内容
:::

---
## 使用表情

:EMOJICODE:

## 图片轮播

## `markdown`主题样式

默认主题的`markdown`样式相当简洁美观，不过自定义主题并不是继承自默认主题，所以要么需要自己找一套，要么开发一套。
于是继续埋头苦干，制作了一套`md`主题风格：

### 文字

普通文字

**强调文字**

__粗体文字__

_斜体文字_

### 标题
# 大标题
## 二标题
### 三标题
#### 四标题
##### 五标题
###### 六标题

### 引用

> 这是一段引用
> 这是第二段引用

### 列表

#### 无序列表：

- 春花秋月何时了，往事知多少
- 朝辞白帝彩云间，千里江陵一日还
- 沉舟侧畔千帆过，病树前头万木春
- 春蚕到死丝方尽，蜡炬成灰泪始干

#### 无序列表分级

- 列表一级
  - 列表二级
    - 列表三级
      - 列表四级
        - 列表五级

### 有序列表：

1. 昨夜西风凋碧树，独上高楼，望尽天涯路
2. 衣带渐宽终不悔，为伊消得人憔悴
3. 众里寻他千百度过，蓦然回首，那人却在灯火阑珊处。


### 表格

|姓名\学科|语文|数学|英语|
|---|---|---|---|
|小明|95|98|96|
|小张|83|84|85|
|小李|78|79|81|

### 图片

![image](/assets/beach-g8153c8171_640.jpg)
### 链接

[这是一个链接](https://muray.xyz)

### 选项列表

- [ ] Plan A
- [x] Plan B

### 公式

行内:

Euler's identity $e^{i\pi}+1=0$ is a beautiful formula in $\mathbb{R}^2$.

块语法:

$$\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right) 
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^i r \cdots (r-i+1) (\log y)^{r-i}} {\omega^i} \right\}$$

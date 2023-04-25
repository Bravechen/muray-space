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
# prev: ''
# next: ''
---

![image](/assets/beach-g8153c8171_640.jpg)

## 开始写博客了

这是我写的第一篇博客文章。许多年了，自己无力到今天才建立一个博客站，也是清奇了。
既然利用`Vuepress`框架来搭建这个小站，那就来说说它吧。

## 嵌入代码

`vuepress`使用`markdown`来撰写文章的，其中提供的代码嵌入的组件是挺招人喜欢的。下面就是一个例子：

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

## `Badge`内置组件，可以做点有趣的事

```html
<Badge type="tip" text="^o^" vertical="middle" /> 
<Badge type="warning" text="=.=" vertical="middle" /> 
<Badge type="danger" text="-_-|||" vertical="middle" />
```

渲染出来是这样的：

- <Badge type="tip" text="^o^" vertical="middle" /> 
- <Badge type="warning" text="=.=" vertical="middle" /> 
- <Badge type="danger" text="-_-|||" vertical="middle" />

## 自定义容器，也是简单好用

::: tip 提示
这里写点普通的提示
:::

::: warning 注意
这里是需要注意的内容
:::

::: danger 警告
千万小心，不要这么做
:::

::: details 详细说
还可以将特殊的话变为详情
:::




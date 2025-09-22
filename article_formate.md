## 代码演示tab

代码演示可以用tab形式，演示各个文件内容

`:::: code-group` 声明一个分组，结束是`::::`

每一个代码tab用`:::`声明，结束是`:::`

```
::: code-group-item 标题
这里写代码
:::
```

综合展示如下：

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

## 代码块高亮

```js{1, 3-4}
var a = 1;
var b = 2;
var c = 3;
var d = 4;
```

以上表示第一行高亮，第三行到第四行高亮

## 徽章

```html
<Badge type="tip" text="^o^" vertical="middle" /> 垂直居中对齐
<Badge type="warning" text="=.=" vertical="middle" /> 顶对齐
<Badge type="danger" text="-_-|||" vertical="middle" /> 底对齐
```

## 自定义容器

自定义容器可以添加特殊的样式

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

## 特殊内容展示

:::: theorem

特殊内容展示

::: right
———— 实验一下
:::
::::

这渲染出来会类似于引用名人名言的形式

## 普通笔记标注

::: note
这是一段笔记内容
:::


## 使用表情

:smile: :laughing: :hospital: :full_moon:

## 图片轮播

:::: swiper

::: swiper-item img
/assets/man-2377597_1920.jpg
:::

::: swiper-item img
/assets/hd-wallpaper-5858656_1280.jpg
:::

::::

## `markdown`主题样式

默认主题的`markdown`样式相当简洁美观，不过自定义主题并不是继承自默认主题，所以要么需要自己找一套，要么开发一套。
于是继续埋头苦干，制作了一套`md`主题风格：

### 文字

普通文字

**强调文字**

__粗体文字__

_斜体文字_

### 引用

> 这是一段引用
> 这是第二段引用

### 列表

列表也做了相应的样式

#### 无序列表：

- 春花秋月何时了，往事知多少
- 朝辞白帝彩云间，千里江陵一日还
- 沉舟侧畔千帆过，病树前头万木春
- 春蚕到死丝方尽，蜡炬成灰泪始干

##### 无序列表分级

- 列表一级
  - 列表二级
    - 列表三级
      - 列表四级
        - 列表五级

#### 有序列表：

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

公式支持latex格式。

行内:

Euler's identity $e^{i\pi}+1=0$ is a beautiful formula in $\mathbb{R}^2$.

块语法:

$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right) 
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^i r \cdots (r-i+1) (\log y)^{r-i}} {\omega^i} \right\}
$$

### 标题

# 大标题

## 二标题

### 三标题

#### 四标题

##### 五标题

###### 六标题


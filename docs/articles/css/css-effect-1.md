---
lang: zh-CN
title: 如何使用CSS制作翻牌效果
description: 利用CSS中的属性制作翻牌效果
date: 2023-08-09
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: CSS效果
tags:
  - "CSS CookBook"
  - "CSS Effect"
coverImg: ""
---

> 如果想最快获得方案和代码，可以问 GPT，真的非常快~

如果想了解具体的步骤，咱们继续

## 准备

实现翻牌效果，主要是利用 CSS 的`transform`实现 3D 旋转，利用`transition`实现动画效果。
核心的属性有：

### `perspective`

[`perspective`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/perspective)属性，设置了元素在 3D 空间中的视觉效果。

使用了这个属性，在翻转动画中会出现透视的效果，这样效果看起来更符合日常透视的直觉。

::: note
MDN:

`perspective` 指定了观察者与 `z=0` 平面的距离，使具有三维位置变换的元素产生透视效果。
`z>0` 的三维元素比正常大，而 `z<0` 时则比正常小，大小程度由该属性的值决定。

三维元素在观察者后面的部分不会绘制出来，即 `z` 轴坐标值大于 `perspective` 属性值的部分。默认情况下，消失点位于元素的中心。
:::

### `transform-style`

[`transform-style`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-style)属性，设置元素的子元素是位于 `3D` 空间中还是平面中。

如果不设置这个属性，默认会在平面空间中。这样在翻牌效果中背面的容器就不会显示出来。因为正反面不会形成 3D 空间中的遮挡关系。

### `backface-visibility`

[`backface-visibility`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backface-visibility)属性，指定当元素背面朝向观察者时是否可见。

::: note
MDN:

元素的背面是其正面的镜像。虽然在 `2D` 中不可见，但是当变换导致元素在 `3D` 空间中旋转时，背面可以变得可见。 （此属性对 2D 变换没有影响，它没有透视。）
:::

这个属性在正面和反面设置了不透明度的时候会有明显可观测的效果。它有 2 个值：

- `hidden` 当元素背面朝向观察者时**不可见**
- `visible` 当元素背面朝向观察者时**可见**

## 思路

结构我们遵循：套，器，正，反。
即外层有一个容器做包裹的套子，用来响应鼠标事件。当然，如果是通过`js`动态添加`class`的形式实现的。可以不要这个套子。
接下来，需要一个牌的容器。最后是正面和反面的两个容器。如果不想使用这么多元素，利用伪元素也可以实现。

## 实现

首先来看看利用多个元素的实现方式：

:::: code-group
::: code-group-item HTML

```html
<div class="box">
  <div class="cover">
    <div class="side front">正面</div>
    <div class="side back">反面</div>
  </div>
</div>
```

:::

::: code-group-item LESS

```less
.box {
  width: 100px;
  height: 100px;
  perspective: 800px;
  background: #f2f2f2;

  .cover {
    width: 100px;
    height: 100px;

    position: relative;

    transform-style: preserve-3d;
    transition-property: transform;
    transition-duration: 1.5s;
    transition-timing-function: liner;

    color: white;

    .side {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100px;
      height: 100px;
      backface-visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
    }

    .front {
      background: #220077;
    }

    .back {
      background: #228877;
      transform: rotateY(180deg);
    }
  }

  &:hover {
    .cover {
      transform: rotateY(180deg);
    }
  }
}
```

:::

::::

#### 为什么需要一个外层的包裹容器？

主要是为了响应鼠标交互能够丝滑一些，例如`hover`时候进行翻转。如果没有外层封套，则在卡牌旋转的时候的同时鼠标位于边缘，可能会出现失去响应的情况。

#### 效果

<style lang="scss">
  .effect1 {
    .box {
      width: 100px;
      height: 100px;
      perspective: 800px;
      background: #f2f2f2;

      .cover {
        width: 100px;
        height: 100px;

        position: relative;

        transform-style: preserve-3d;
        transition-property: transform;
        transition-duration: 1.5s;
        transition-timing-function: liner;

        color: white;

        .side {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100px;
          height: 100px;
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
        }

        .front {
          background: #220077;
        }

        .back {
          background: #228877;
          transform: rotateY(180deg);
        }
      }

      &:hover {
        .cover {
          transform: rotateY(180deg);
        }
      }
    }
  }
</style>
<div class="effect2 box">
  <div class="cover">
    <div class="side front">正面</div>
    <div class="side back">反面</div>
  </div>
</div>

#### 伪元素效果

如果正面和反面的内容只是图片和十分简单的文本，那么使用伪元素也可以实现，并且可以节约 2 个元素：

:::: code-group
::: code-group-item HTML

```html
<div class="box">
  <div class="cover"></div>
</div>
```

:::
::: code-group-item LESS

```less
.box {
  width: 100px;
  height: 100px;
  perspective: 800px;
  background: #f2f2f2;

  .cover {
    width: 100px;
    height: 100px;

    position: relative;

    transform-style: preserve-3d;
    transition-property: transform;
    transition-duration: 1.5s;
    transition-timing-function: liner;

    color: white;
    cursor: pointer;
    user-select: none;

    &::before,
    &::after {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100px;
      height: 100px;
      backface-visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
    }

    &::before {
      content: "\6b63\9762";
      background: #220077;
    }

    &:after {
      content: "\53cd\9762";
      background: #228877;
      transform: rotateY(180deg);
    }
  }

  &:hover {
    .cover {
      transform: rotateY(180deg);
    }
  }
}
```

:::
::::

效果如下：

<style lang="scss">
  .effect2 {
    &.box {
      width: 100px;
      height: 100px;
      perspective: 800px;
      background: #f2f2f2;

      .cover {
        width: 100px;
        height: 100px;

        position: relative;

        transform-style: preserve-3d;
        transition-property: transform;
        transition-duration: 1.5s;
        transition-timing-function: liner;

        color: white;
        cursor: pointer;
        user-select: none;

        &::before,
        &::after {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100px;
          height: 100px;
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
        }

        &::before {
          content: '\6b63\9762';
          background: #220077;
        }

        &:after {
          content: '\53cd\9762';
          background: #228877;
          transform: rotateY(180deg);
        }
      }

      &:hover {
        .cover {
          transform: rotateY(180deg);
        }
      }
    }
  }

</style>
<div class="effect2 box">
  <div class="cover"></div>
</div>

## 参考

- [CSS3实现3D翻牌效果](https://juejin.cn/post/6844903617967702029)
- [CSS实现翻牌效果](https://juejin.cn/post/6844903934708940808)
- [如何使用纯 CSS 创建翻牌动画](https://cloud.tencent.com/developer/article/1968599)
- [css3实现翻牌效果](https://codepen.io/tianyuhan/pen/JZdzRj)

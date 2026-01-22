# Sass @use 和 @forward 使用指南

## 📚 基本概念

### @import vs @use/@forward

**旧方式 (@import)** - 已弃用
```scss
@import './common.scss';
@import './skeleton.scss';
```

**新方式 (@use/@forward)** - 推荐
```scss
@use './common.scss';
@use './skeleton.scss';
```

## 🔑 核心区别

### 1. **命名空间 (Namespace)**

`@import` 会将所有变量、mixins、函数导入到全局作用域，而 `@use` 会创建命名空间。

**@import (旧方式)**
```scss
// _fns.scss
@mixin resetAll() {
  margin: 0;
  padding: 0;
}

// index.scss
@import './fns';
body {
  @include resetAll(); // 直接使用，全局作用域
}
```

**@use (新方式)**
```scss
// index.scss
@use './fns'; // 默认命名空间是文件名（去掉下划线和扩展名）
body {
  @include fns.resetAll(); // 使用命名空间
}

// 或者使用别名
@use './fns' as utils;
body {
  @include utils.resetAll();
}

// 或者使用 * 导入到全局（不推荐，但可以兼容旧代码）
@use './fns' as *;
body {
  @include resetAll(); // 可以直接使用，但失去了命名空间的好处
}
```

### 2. **@forward - 转发模块**

`@forward` 用于将模块的内容转发给其他文件，常用于创建"入口文件"。

**场景：** 你想创建一个 `_index.scss` 来统一导出所有 mixins

```scss
// _mixins.scss
@mixin resetAll() {
  margin: 0;
  padding: 0;
}

// _utils.scss
@mixin flexCenter() {
  display: flex;
  align-items: center;
  justify-content: center;
}

// _index.scss (入口文件)
@forward 'mixins';
@forward 'utils';

// main.scss
@use 'index' as *; // 现在可以使用所有 mixins
body {
  @include resetAll();
  @include flexCenter();
}
```

**带命名空间的转发：**
```scss
// _index.scss
@forward 'mixins' as mixins-*; // 所有 mixins 会变成 mixins-resetAll, mixins-flexCenter
@forward 'utils' as utils-*;

// main.scss
@use 'index';
body {
  @include index.mixins-resetAll();
  @include index.utils-flexCenter();
}
```

## 📝 实际迁移示例

### 示例 1: 迁移你的 index.scss

**迁移前：**
```scss
@use "fns";
@import './common.scss';
@import './skeleton.scss';
@import './prism.css';
@import './markdown.scss';
```

**迁移后：**
```scss
@use "fns";
@use './common' as common;
@use './skeleton' as skeleton;
@use './markdown' as markdown;
// 注意：CSS 文件（.css）仍然使用 @import
@import './prism.css';

// 如果 common.scss 中有 mixins，使用命名空间：
.some-element {
  @include common.themeContainer();
  @include skeleton.skeletonStyle();
}
```

### 示例 2: 如果不需要命名空间

如果你的 mixins 不需要区分来源，可以使用 `as *`：

```scss
@use "fns";
@use './common' as *;
@use './skeleton' as *;
@use './markdown' as *;
@import './prism.css';

// 现在可以直接使用，就像 @import 一样
.some-element {
  @include themeContainer();
  @include skeletonStyle();
}
```

### 示例 3: 创建统一的入口文件

如果你想更好地组织代码，可以创建一个 `_index.scss`：

```scss
// styles/_index.scss
@forward 'fns';
@forward 'common';
@forward 'skeleton';
@forward 'markdown';

// styles/index.scss
@use 'index' as *;
@import './prism.css'; // CSS 文件仍用 @import

// 现在所有 mixins 都可以直接使用
body {
  @include resetAll();
  @include themeContainer();
}
```

## ⚠️ 重要注意事项

### 1. CSS 文件仍然使用 @import

`.css` 文件（不是 `.scss`）仍然需要使用 `@import`：
```scss
@import './prism.css'; // ✅ 正确
@use './prism.css';    // ❌ 错误，CSS 文件不支持 @use
```

### 2. 变量访问方式

**@import (旧)**
```scss
// _vars.scss
$primary-color: #0388A6;

// main.scss
@import './vars';
.button {
  color: $primary-color; // 直接访问
}
```

**@use (新)**
```scss
// main.scss
@use './vars';
.button {
  color: vars.$primary-color; // 使用命名空间
}

// 或者
@use './vars' as *;
.button {
  color: $primary-color; // 直接访问（使用 as *）
}
```

### 3. 私有成员（Private Members）

使用 `-` 或 `_` 开头的变量/mixin 是私有的，不会被外部访问：

```scss
// _utils.scss
$-private-var: red; // 私有变量
$public-var: blue;  // 公共变量

@mixin -private-mixin() { } // 私有 mixin
@mixin public-mixin() { }   // 公共 mixin

// main.scss
@use './utils';
// utils.$-private-var; // ❌ 错误，无法访问
utils.$public-var;      // ✅ 正确
```

### 4. 配置模块（Configure Modules）

`@use` 支持配置：

```scss
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;

.button {
  color: $black;
  border-radius: $border-radius;
}

// main.scss
@use './library' with (
  $black: #222,
  $border-radius: 0.5rem
);
```

## 🚀 迁移步骤

1. **识别所有 @import 语句**
   ```bash
   grep -r "@import" docs/.vuepress/theme/**/*.scss
   ```

2. **逐个替换**
   - `.scss` 文件：`@import` → `@use`
   - `.css` 文件：保持 `@import`

3. **更新引用**
   - 如果使用命名空间，更新所有 mixin/变量引用
   - 如果使用 `as *`，通常不需要修改

4. **测试**
   - 运行构建确保没有错误
   - 检查样式是否正确应用

## 📖 更多资源

- [Sass 官方文档 - @use](https://sass-lang.com/documentation/at-rules/use)
- [Sass 官方文档 - @forward](https://sass-lang.com/documentation/at-rules/forward)
- [Sass 迁移工具](https://sass-lang.com/documentation/cli/migrator)

# 实际迁移示例

## 示例 1: 迁移 index.scss

### 当前代码（使用 @import）
```scss
// docs/.vuepress/theme/vuepress-theme-comicborder/styles/index.scss
@use "fns";
@import './common.scss';
@import './skeleton.scss';
@import './prism.css';
@import './markdown.scss';
```

### 迁移后（使用 @use）
```scss
// docs/.vuepress/theme/vuepress-theme-comicborder/styles/index.scss
@use "fns";
@use './common' as *;  // 使用 as * 保持全局访问，兼容现有代码
@use './skeleton' as *;
@use './markdown' as *;
@import './prism.css'; // CSS 文件仍使用 @import

// 现在所有 mixins 仍然可以直接使用（因为使用了 as *）
body {
  @include fns.resetAll(); // fns 有命名空间
  // themeContainer() 等可以直接使用（因为 common 使用了 as *）
}
```

## 示例 2: 在 Vue 组件中迁移

### 当前代码（使用 @import）
```vue
<!-- ArticlePageLayout.vue -->
<style lang="scss" scoped>
@import '../styles/common.scss';

.page {
  @include normalPage();
  .content {
    @include pageContent();
    @include themeContainer();
  }
}
</style>
```

### 方式 1: 使用命名空间（推荐，更清晰）
```vue
<style lang="scss" scoped>
@use '../styles/common' as common;

.page {
  @include common.normalPage();
  .content {
    @include common.pageContent();
    @include common.themeContainer();
  }
}
</style>
```

### 方式 2: 使用 as *（简单，但失去命名空间优势）
```vue
<style lang="scss" scoped>
@use '../styles/common' as *;

.page {
  @include normalPage(); // 可以直接使用，就像 @import 一样
  .content {
    @include pageContent();
    @include themeContainer();
  }
}
</style>
```

## 示例 3: 创建统一的样式入口文件（最佳实践）

### 步骤 1: 创建 _index.scss 统一导出
```scss
// docs/.vuepress/theme/vuepress-theme-comicborder/styles/_index.scss
@forward 'fns';
@forward 'common';
@forward 'skeleton';
@forward 'markdown';
```

### 步骤 2: 更新 index.scss
```scss
// docs/.vuepress/theme/vuepress-theme-comicborder/styles/index.scss
@use 'index' as *; // 导入所有样式模块
@import './prism.css'; // CSS 文件仍用 @import

// 现在所有 mixins 都可以直接使用
body {
  @include fns.resetAll();
  @include themeContainer();
  @include skeletonStyle();
}
```

### 步骤 3: 在 Vue 组件中使用
```vue
<style lang="scss" scoped>
@use '../styles/index' as *;

.page {
  @include normalPage();
  @include themeContainer();
}
</style>
```

## 示例 4: 处理变量

### 当前代码
```scss
// _vars.scss
$primary-color: #0388A6;
$secondary-color: #5e8c65;

// main.scss
@import './vars';
.button {
  color: $primary-color;
}
```

### 迁移后
```scss
// main.scss
@use './vars' as *; // 使用 as * 保持全局访问
.button {
  color: $primary-color; // 可以直接使用
}

// 或者使用命名空间
@use './vars';
.button {
  color: vars.$primary-color; // 使用命名空间
}
```

## 迁移策略建议

### 策略 A: 渐进式迁移（推荐）

1. **第一步：** 只迁移 `index.scss`，使用 `as *` 保持兼容
   ```scss
   @use './common' as *;
   @use './skeleton' as *;
   ```

2. **第二步：** 逐个迁移 Vue 组件，可以继续使用 `as *` 或改用命名空间

3. **第三步：** 创建统一的入口文件，优化代码结构

### 策略 B: 一次性迁移（如果项目较小）

1. 创建 `_index.scss` 统一导出
2. 更新所有文件使用 `@use` 和命名空间
3. 测试确保一切正常

## 常见问题

### Q: 为什么 CSS 文件还要用 @import？
A: `@use` 和 `@forward` 只支持 Sass/SCSS 文件，普通 CSS 文件必须使用 `@import`。

### Q: 使用 `as *` 和直接使用有什么区别？
A: 
- `as *` 会将所有内容导入到全局作用域，就像 `@import` 一样
- 使用命名空间（如 `common.themeContainer()`）更清晰，避免命名冲突
- 推荐：新代码使用命名空间，迁移时可以用 `as *` 保持兼容

### Q: 如果两个文件有同名的 mixin 怎么办？
A: 使用命名空间可以避免冲突：
```scss
@use './common' as common;
@use './utils' as utils;

.element {
  @include common.themeContainer(); // 明确来自 common
  @include utils.themeContainer(); // 明确来自 utils
}
```

### Q: @forward 什么时候用？
A: 当你想要创建一个"库"或"入口文件"时：
- 有多个相关的样式文件
- 想要统一导出给其他文件使用
- 想要隐藏内部实现细节

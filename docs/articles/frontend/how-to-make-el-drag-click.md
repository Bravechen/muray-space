---
lang: zh-CN
title: 让页面中的某个元素既支持拖动又能被点击的方法小例子
description: 如何让一个页面中的元素既能响应拖动操作，又能被点击。用于制作页面的小效果。
date: 2025-2-21
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: 前端
tags:
  - "前端 CookBook"
coverImg: ""
---

```html
<script>
  (function () {
  let isDragging = false;
  let time = 0;
  let duration = 0;
  let btn;

  function init() {
    btn = document.getElementById('testBtn');
    btn.addEventListener('click', onBtnClick);
    btn.addEventListener('mousedown', onBtnMouseDown);
  }

  function onBtnClick(e) {
    // 如果是拖拽状态，阻止click事件
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    console.log('is click now...');
  }

  function onBtnMouseDown() {
    duration = Date.now();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onBtnMouseUp);

    time = setTimeout(() => {
      isDragging = true;
      console.log('start drag...');
    }, 300);
  }

  function onMouseMove() {
    if (time) {
      clearTimeout(time);
      time = 0;
      isDragging = true;
      console.log('start drag from move...');
    }
  }

  function onBtnMouseUp() {
    const now = Date.now();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onBtnMouseUp);

    if (time) {
      clearTimeout(time);
      time = 0;
    }

    if (isDragging) {
      console.log('mouseup, stop drag...');
      // 使用requestAnimationFrame确保在下一帧才重置isDragging
      requestAnimationFrame(() => {
        isDragging = false;
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
</script>
```

<template>
  <div class="iframe-box" :style="iframeBoxStyle">
    <div class="iframe-container">
      <iframe
        ref="iframeRef"
        :src="iframeSrc"
        :width="width || '100%'"
        :height="height || '600'"
        :scrolling="scrolling || 'auto'"
        border="0"
        class="iframe-element"
        @load="handleLoad"
        @error="handleError"
        v-show="isLoaded"
      >
        您的浏览器不支持 iframe。
      </iframe>
      <div
        class="skeleton-overlay"
        v-if="!isLoaded && isClient"
      >
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text-short"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.iframe-box {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  min-width: 512px;
  min-height: 256px;

  .iframe-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .iframe-element {
    max-width: 100%;
    border: 0;
    border-radius: 0.25rem;
    background-color: #ffffff;
  }

  .skeleton-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 0.25rem;
  }

  .skeleton-content {
    width: 80%;
    max-width: 400px;
    padding: 1rem;
  }

  .skeleton-line {
    height: 1rem;
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      #f0f0f0 50%,
      #e0e0e0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .skeleton-title {
    width: 60%;
    height: 1.5rem;
  }

  .skeleton-text {
    width: 100%;
  }

  .skeleton-text-short {
    width: 80%;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  scrolling: {
    type: String,
    default: 'auto',
    validator: (value) => ['yes', 'no', 'auto'].includes(value),
  }
});

const isLoaded = ref(false);
const isClient = ref(false);
const iframeRef = ref(null);

const iframeBoxStyle = computed(() => {
  const style = {};
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width.indexOf('px') > 0 ? props.width : `${props.width}px`;
  } else {
    style.width = '100%';
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height.indexOf('px') > 0 ? props.height : `${props.height}px`;
  } else {
    style.height = '600px'; // 默认高度
  }
  return style;
});

// 处理 iframe 路径
// VuePress 的 public 目录下的文件会直接映射到根路径
// 如果 src 以 / 开头，直接使用；否则添加 / 前缀
const getIframeSrc = (src) => {
  if (!src) {
    return '';
  }

  // 如果已经是绝对路径（以 / 开头）或者是完整的 URL（http:// 或 https://），直接返回
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // 如果是相对路径，添加 / 前缀（假设文件在 public 目录下）
  return `/${src}`;
};

const iframeSrc = computed(() => {
  return getIframeSrc(props.src);
});

// 处理 iframe 加载完成事件
const handleLoad = () => {
  isLoaded.value = true;
};

// 处理 iframe 加载错误事件
const handleError = () => {
  // 即使加载失败，也隐藏骨架屏，显示错误状态
  isLoaded.value = true;
};

// 组件挂载后，设置一个超时，防止某些情况下 load 事件不触发
onMounted(() => {
  // 标记为客户端环境
  isClient.value = true;
  // 如果 5 秒后仍未加载完成，强制显示 iframe（可能是内容加载较慢）
  setTimeout(() => {
    if (!isLoaded.value) {
      isLoaded.value = true;
    }
  }, 5000);
});
</script>

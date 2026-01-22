<template>
  <div class="video-box" @click="handleClick" :style="videoBoxStyle">
    <div class="video-container">
      <video
        ref="videoRef"
        :src="currentVideoSrc"
        :autoplay="shouldAutoplay"
        :width="width"
        :height="height"
        preload="none"
        class="video-player"
        @ended="handleEnded"
        @loadstart="handleLoadStart"
        @waiting="handleWaiting"
        @canplay="handleCanPlay"
        @error="handleError"
      >
        您的浏览器不支持视频播放。
      </video>
      <div
        class="play-icon-overlay"
        v-if="!isPlaying && !isLoading && isClient"
      >
        <PlayCircleTwotone class="play-icon" color="#999999" />
      </div>
      <div
        class="loading-overlay"
        v-if="isLoading && isClient"
      >
        <Loading3QuartersOutlined class="loading-icon" color="#999999" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.video-box {
  width: 100%;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  .video-container {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    position: relative;
  }

  .video-player {
    max-width: 100%;
    // height 属性如果未设置，则保持 auto 以维持宽高比
    // 如果设置了 height 属性，则使用属性值
    border-radius: 0.25rem;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #333333;
  }

  .play-icon-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 4rem;
    height: 4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    // background-color: rgba(0, 0, 0, 0.5);
  }

  .loading-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 4rem;
    height: 4rem;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-icon {
    width: 3rem;
    height: 3rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>

<script setup>
import { nextTick, computed, onMounted } from 'vue';
import { ref } from 'vue';
import { PlayCircleTwotone, Loading3QuartersOutlined } from '@vicons/antd';

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
  }
});

const isPlaying = ref(false);
const isLoading = ref(false);
const isClient = ref(false);

const videoBoxStyle = computed(() => {
  return {
    width: `${props.width}px` || '100%',
    height: `${props.height}px` || 'auto',
  };
});

// 缓存原始 src
const cachedSrc = ref(props.src);

// 视频元素引用
const videoRef = ref(null);

// 当前视频源（初始为空，点击后才加载）
const currentVideoSrc = ref('');

// 是否应该自动播放
const shouldAutoplay = ref(false);

// 处理视频路径
// VuePress 的 public 目录下的文件会直接映射到根路径
// 如果 src 以 / 开头，直接使用；否则添加 / 前缀
const getVideoSrc = (src) => {
  if (!src) {
    return '';
  }

  // 如果已经是绝对路径（以 / 开头），直接返回
  if (src.startsWith('/')) {
    return src;
  }

  // 如果是相对路径，添加 / 前缀（假设文件在 public 目录下）
  return `/${src}`;
};

// 处理点击事件
const handleClick = () => {
  const video = videoRef.value;
  if (!video) {
    return;
  }

  // 如果视频还没有加载，先加载并自动播放
  if (!currentVideoSrc.value) {
    currentVideoSrc.value = getVideoSrc(cachedSrc.value);
    shouldAutoplay.value = true;
    // 等待下一个 tick 确保 src 已设置，然后播放
    nextTick(() => {
      video.play().catch(err => {
        console.error('播放视频失败:', err);
      });
      isPlaying.value = true;
    });
    return;
  }

  // 如果视频已经加载，切换播放/暂停状态
  if (video.paused) {
    // 如果视频已经播放到结尾，重置到开始并自动播放
    if (video.ended) {
      video.currentTime = 0;
      shouldAutoplay.value = true;
      isPlaying.value = true;
    }
    video.play().catch(err => {
      console.error('播放视频失败:', err);
    });
    isPlaying.value = true;
  } else {
    video.pause();
    isPlaying.value = false;
  }
};

// 处理视频播放结束事件
const handleEnded = () => {
  const video = videoRef.value;
  if (!video) {
    return;
  }

  // 重置到开始，但停止自动播放
  video.currentTime = 0;
  shouldAutoplay.value = false;
  isPlaying.value = false;
};

// 处理视频开始加载事件
const handleLoadStart = () => {
  isLoading.value = true;
};

// 处理视频等待数据事件
const handleWaiting = () => {
  isLoading.value = true;
};

// 处理视频可以播放事件（加载完成）
const handleCanPlay = () => {
  isLoading.value = false;
};

// 处理视频加载错误事件
const handleError = () => {
  isLoading.value = false;
};

// 组件挂载后，标记为客户端环境
onMounted(() => {
  isClient.value = true;
});
</script>

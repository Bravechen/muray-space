<template>
  <a class="icon-text" :href="link" :target="target" :style="boxStyle">
    <Icon class="icon" :icon="icon" :size="iconSize || '1.5rem'" />
    <span class="txt" :style="txtStyle" >{{ title }}</span>
  </a>
</template>

<style lang="scss">
.icon-text {
  display: inline-block;
  vertical-align: middle;

  font-size: 0;
  overflow: hidden;
  width: var(--width);
  height: var(--height);
  // background-color: transparent;
  // border-radius: var(--theme-border-radius3);

  word-break: keep-all;
  white-space: nowrap;

  transition-property: width, background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  .icon {
    margin-right: 0.5rem;
  }

  .txt {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.25rem;
    overflow: hidden;
    font-size: 0.75rem;
    color: var(--normal-color);
    word-break: keep-all;
    white-space: nowrap;
  }

  &:hover {
    display: flex;
    align-items: center;
    justify-content: center;

    width: calc(7 * var(--width));
    // background-color: var(--theme-color1);

    .txt {
      color: var(--hover-color);
      font-weight: var(--theme-font-bold);
    }
  }
}
</style>

<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';

const props = defineProps({
  link: {
    type: String,
    default: 'javascript:void 0',
  },
  target: {
    type: String,
    default: '_blank',
  },
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconSize: {
    type: String,
    default: '1.5rem',
  },
  fontSize: {
    type: String,
    default: '0.75rem',
  },
  color: {
    type: String,
    default: '#000000',
  },
  hoverColor: {
    type: String,
    default: '#000000',
  },
  width: {
    type: String,
    default: '1.5rem',
  },
  height: {
    type: String,
    default: '1.5rem',
  }
});

const boxStyle = computed(function () {
  const w = (Number.isInteger(props.width)) ? `${props.width}px` : props.width;
  const h = (Number.isInteger(props.height)) ? `${props.height}px` : props.height;

  return {
    '--width': w,
    '--height': h,
  };
});

const txtStyle = computed(function() {
  const fontSize = (Number.isInteger(props.size)) ? `${props.size}px` : props.size;

  return {
    fontSize,
    '--normal-color': props.color,
    '--hover-color': props.hoverColor,
  };
});
</script>

<template>
  <i v-if="!!icon" class="theme-icon" :style="{ width: iconSize, height: iconSize, }">
    <component :is="renderIcon(icon)" />
  </i>
</template>
<style>
.theme-icon {
  display: inline-block;
  vertical-align: middle;

  font-size: 1rem;
  color: var(--theme-color2);
}
</style>
<script setup>
import { h, computed } from 'vue';
import { HomeOutlined, MessageOutlined } from '@vicons/antd';
import { ArchiveOutline } from '@vicons/ionicons5';
import { CollapseCategories } from '@vicons/carbon';

const prop = defineProps({
  icon: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '1rem',
  },
});

const icons = {
  'icon-home': () => h(HomeOutlined),
  'icon-category': () => h(ArchiveOutline),
  'icon-archive': () => h(CollapseCategories),
  'icon-about': () => h(MessageOutlined),
};

function renderIcon(iconName) {
  return icons[iconName]();
}

const iconSize = computed(() => {
  if (Number.isInteger(prop.size)) {
    return `${prop.size}px`;
  }

  return prop.size;
});
</script>

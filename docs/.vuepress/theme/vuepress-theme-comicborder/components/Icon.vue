<template>
  <i v-if="!!icon" class="theme-icon" :style="{ width: iconSize, height: iconSize, }">
    <component :is="renderIcon(icon)" />
  </i>
</template>
<style>
.theme-icon {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;

  font-size: 0;
  color: var(--theme-color2);
}
</style>
<script setup>
import { h, computed } from 'vue';
import { HomeOutlined, MessageOutlined } from '@vicons/antd';
import { ArchiveOutline, LogoGithub, MailOutline } from '@vicons/ionicons5';
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
  'github': () => h(LogoGithub),
  'Email': () => h(MailOutline),
  'iconImg': (iconUrl) => h(
    'img',
    {
      src: iconUrl,
      style: `display:block;width: 100%;height: 100%;`
    }
  )
};

function renderIcon(iconName) {
  const fn = icons[iconName];
  return typeof fn === 'function' ? icons[iconName]() : icons['iconImg'](iconName);
}

const iconSize = computed(() => {
  if (Number.isInteger(prop.size)) {
    return `${prop.size}px`;
  }

  return prop.size;
});

</script>

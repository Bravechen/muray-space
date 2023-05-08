<template>
  <NSpace class="tags-collect">
    <NTag class="tag-item" v-for="(tag, index) in artTags" :key="tag.id" :color="tagColor(index)" :style="tagStyle">
      <a class="link-item" :href="tag.link">{{ tag.name }}（{{ tag.artSum }}）</a>
    </NTag>
  </NSpace>
</template>

<style lang="scss">
.tags-collect {
  .tag-item {
    .link-item {
      color: inherit;
    }
  }
}
</style>

<script setup>
import { computed } from 'vue';
import { NTag, NSpace } from 'naive-ui';
import { useSiteData } from '@vuepress/client';
import { tagStyles } from '../constant/tagStyle';

const site = useSiteData();

const artTags = computed(function() {
  const articlesData = site.value.articlesData;
  const artTags = articlesData.artTags;
  const artListByTag = articlesData.artListByTag;

  return Object.values(artTags).map(function(tag) {
    return {
      ...tag,
      artSum: artListByTag[tag.id]?.length || 0,
    };
  });
});

function tagColor(index) {
  return {
    ...tagStyles[index % tagStyles.length],
  };
}

const tagStyle = computed(function() {
  return {
    '--n-border-radius': `var(--theme-border-radius3)`,
  };
});

</script>

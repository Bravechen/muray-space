<template>
<div class="categories-collect">
  <NList clickable>
    <NListItem v-for="item of artCategories" :key="item.id">
      <a :href="item.link" class="category-item">
        <em class="category-name">{{ item.name }}</em>
        <span class="category-art-sum"><b>{{ item.artSum }}</b>篇</span>
      </a>
    </NListItem>
  </NList>
</div>
</template>

<style lang="scss">
.categories-collect {
  .category-item {
    display: inline-block;
    box-sizing: border-box;
    border: var(--theme-border1);
    border-color: transparent;
    border-radius: var(--theme-border-radius3);

    transition-property: border-color, padding, background-color, color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;

    &:hover {
      border-color: var(--theme-color6);
      padding: 0 var(--theme-container-padding3);
      background-color: var(--theme-color6);
      .category-name {
        color: var(--theme-color1);
      }

      .category-art-sum {
        color: var(--theme-color1);
      }

    }

    .category-name {
      display: inline-block;
      margin-right: 0.625rem;
      font-weight: var(--theme-font-bold);
      font-style: normal;
      color: var(--theme-color2);
    }

    .category-art-sum {
      font-weight: normal;
      font-size: 0.75rem;
      color: var(--theme-color13);

      & > b {
        font-weight: normal;
      }
    }
  }
}
</style>

<script setup>
import { computed } from 'vue';
import { NList, NListItem } from 'naive-ui';
import { useSiteData } from '@vuepress/client';

const site = useSiteData();

const artCategories = computed(function() {
  const articlesData = site.value.articlesData;
  const artCategories = articlesData.artCategories;
  const artListByCategory = articlesData.artListByCategory;

  return Object.values(artCategories).map(function(category) {
    return {
      ...category,
      artSum: artListByCategory[category.id]?.length || 0,
    };
  });
});
</script>

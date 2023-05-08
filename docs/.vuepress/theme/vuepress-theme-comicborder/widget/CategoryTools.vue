<template>
<div class="category-tools">
  <NTabs type="segment" v-model:value="currentTab" :style="tabsStyle" :tab-style="tabStyle()" >
    <n-tab-pane name="tags" tab="标签集">
      <TagsCollect />
    </n-tab-pane>
    <n-tab-pane name="categories" tab="文章分类">
      <CategoriesCollect />
    </n-tab-pane>
    <n-tab-pane name="archives" tab="文章年份归档">
      <ArchivesCollect />
    </n-tab-pane>
  </NTabs>
</div>
</template>

<style lang="scss">
.category-tools {

  box-sizing: border-box;
  border: var(--theme-border1);
  border-radius: var(--theme-border-radius1);
  box-shadow: var(--theme-shadow-color1);
  padding: var(--theme-container-padding1);

  .n-tabs {
    .n-tabs-rail {
      .n-tabs-tab-wrapper {
        .n-tabs-tab {
          box-sizing: border-box;
          border: var(--theme-border1);
          border-color: transparent;
          box-shadow: none;

          transition-property: border-color, color, box-shadow, background-color;
          transition-duration: 0.2s;
          transition-timing-function: ease-in;

          &:hover {
            color: var(--theme-color2);
          }

          &.n-tabs-tab--active {
            border-color: var(--theme-color2);
            box-shadow: var(--theme-shadow-color1);
            &:hover {
              color: var(--n-tab-text-color-hover);
            }
          }
        }
      }
    }
  }

}
</style>

<script setup>
import { computed, ref } from 'vue';
import { NTabs } from 'naive-ui';
import { usePageFrontmatter } from '@vuepress/client';
import TagsCollect from './TagsCollect.vue';
import CategoriesCollect from './CategoriesCollect.vue';
import ArchivesCollect from './ArchivesCollect.vue';
//============================================================
const matter = usePageFrontmatter();
const tabNames = {
  tags: {
    name: 'tags',
    color: 'var(--theme-color1)',
    bgColor: 'var(--theme-color5)',
  },
  categories: {
    name: 'categories',
    color: 'var(--theme-color1)',
    bgColor: 'var(--theme-color6)',
  },
  archives: {
    name: 'archives',
    color: 'var(--theme-color1)',
    bgColor: 'var(--theme-color8)',
  }
};
let firstTab = '';
for (let key of Object.keys(tabNames)) {
  if (matter.value.widget?.[key] === void 0 || matter.value.widget?.[key] === true ) {
    firstTab = key;
    break;
  }
}

const currentTab = ref(firstTab);

const tabsStyle = computed(function() {
  return {
    '--n-color-segment': `var(--bg-color2)`,
    '--n-tab-border-radius': `var(--theme-border-radius3)`,
  };
});

function tabStyle(...args) {
  console.log(currentTab.value);
  const tagObj = tabNames[currentTab.value];
  return {
    '--n-tab-text-color-hover': tagObj.color,
    '--n-tab-text-color-active': tagObj.color,
    '--n-tab-color-segment': tagObj.bgColor,
  };
}

</script>

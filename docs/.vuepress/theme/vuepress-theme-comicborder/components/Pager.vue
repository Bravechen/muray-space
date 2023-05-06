<template>
  <NPagination class="pager" v-model:page="currentPage" :page-count="pageTotal" :style="pagerStyle()" />
</template>

<style lang="scss">
.pager {
  &.n-pagination {
    .n-pagination-item {
      font-weight: var(--theme-font-bold);

      &:not(.n-pagination-item--disabled) {
        &.n-pagination-item--active {
          box-shadow: var(--theme-shadow-color1);
        }
      }

      &.n-pagination-item--button {
        box-shadow: var(--theme-shadow-color1);
        font-weight: var(--theme-font-bold);

        &.n-pagination-item--disabled {
          border-width: 0.125rem;
          box-shadow: 0 2px 0 0 rgb(224, 224, 230);
        }
      }
    }
  }
}

</style>

<script setup>
import { ref } from 'vue';
import { NPagination } from 'naive-ui';

const props = defineProps({
  pageTotal: {
    type: Number,
    default: 1,
  },
  initPageNum: {
    type: Number,
    default: 1,
  }
});

const currentPage = ref(props.initPageNum);

const pagerStyle = function () {
  return {
    '--n-item-text-color-active': `var(--theme-color1)`,
    '--n-item-border-active': `var(--theme-border1)`,
    '--n-item-color-active': `var(--theme-color4)`,
    '--n-item-color-active-hover': `var(--theme-color3)`,
    '--n-item-text-color-hover': `var(--theme-color4)`,
    '--n-button-icon-color': `var(--theme-color2)`,
    '--n-button-border': `var(--theme-border1)`,
    '--n-button-color-hover': `var(--theme-color4)`,
    '--n-button-border-hover': `var(--theme-border1)`,
    '--n-button-icon-color-hover': `var(--theme-color1)`,
  };
};
</script>

<template>
  <NTag class="item" v-for="(item, index) in itemList" :key="item.id" :color="tagColor(index)">
    <a :href="item.link" class="link-item">{{ item.name }}</a>
  </NTag>
</template>

<style lang="scss">
.item {
  margin-right: 0.625rem;

  .link-item {
    color: inherit;
  }
}
</style>

<script setup>
import { NTag } from 'naive-ui';
import { tagStyles } from '../constant/tagStyle';

const props = defineProps({
  itemList: {
    type: Array,
    default() {
      return [];
    }
  }
});

function tagColor(index) {
  return {
    ...tagStyles[index % tagStyles.length],
  };
}
</script>

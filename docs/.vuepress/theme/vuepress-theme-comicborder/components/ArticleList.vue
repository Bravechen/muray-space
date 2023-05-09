<template>
  <NList class="art-list" hoverable clickable>
    <NListItem v-for="art of artList" class="art-item">
      <a :href="art.path" class="item-wrapper">
        <span class="item-title">{{ art.title }}</span>
        <time class="item-time" :datetime="art.date">撰写：{{ art.date }}</time>
        <time v-if="!!art.updateDate" class="item-time update" :datetime="art.date">更新：{{ art.updateDate }}</time>
      </a>
    </NListItem>
  </NList>
</template>

<style lang="scss">
.art-list {
  width: 100%;

  .art-item {
    .item-wrapper {
      display: flex;
      align-items: center;

      .item-title {
        flex: 1;

        color: var(--theme-color2);
      }

      .item-time {
        font-size: 0.75rem;
        color: var(--theme-color13);

        &.update {
          margin-left: 0.625rem;
        }
      }
    }
  }
}
</style>

<script setup>

const props = defineProps({
  artList: {
    type: Array,
    default() {
      return [];
    }
  }
});
</script>

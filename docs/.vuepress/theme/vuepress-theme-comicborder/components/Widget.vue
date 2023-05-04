<template>
  <div class="widget-box">
    <ClientOnly>
      <Calendar v-if="widget.calendar" />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.widget-box {
  flex: 2;
  display: flex;
  flex-direction: column;

  margin-left: 3.125rem;
  margin-right: 0.625rem;


}
</style>

<script setup>
import { defineAsyncComponent } from 'vue';
import { usePageFrontmatter } from '@vuepress/client';

const matter = usePageFrontmatter();
const widget = matter.value.widget;

console.log('widget====>>', widget);

const Calendar = defineAsyncComponent(() => import('../widget/Calendar.vue'));

</script>


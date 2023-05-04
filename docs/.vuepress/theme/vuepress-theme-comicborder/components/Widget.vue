<template>
  <div class="widget-box">
    <!-- <Calendar v-if="widget.calendar" /> -->
    <ClientOnly>
      <!-- <component v-if="widget.calendar" :is="Calendar" /> -->
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
// import Calendar from '../widget/Calendar.vue';

const matter = usePageFrontmatter();
const widget = matter.value.widget;

console.log('widget====>>', widget);
// let Calendar;
// if (!__VUEPRESS_SSR__ && widget.calendar) {
//   Calendar = defineAsyncComponent(() => import('../widget/Calendar.vue'));
// }
const Calendar = defineAsyncComponent(() => import('../widget/Calendar.vue'));

</script>


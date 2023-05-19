<template>
  <div class="widget-box">
    <ClientOnly>
      <Suspense v-if="widget.calendar">
        <Calendar />
        <template #fallback>
          <CalendarSkeleton />
        </template>
      </Suspense>
      <br />
      <CategoryTools />
      <ArtCntNav />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.widget-box {

  display: flex;
  flex-direction: column;
  width: 25.625rem;
  margin-left: 3.125rem;
  margin-right: 0.625rem;


}
</style>

<script setup>
import { defineAsyncComponent, onErrorCaptured } from 'vue';
import { usePageFrontmatter } from '@vuepress/client';
import CalendarSkeleton from '../widget/CalendarSkeleton.vue';
// import ArtCntNav from '../widget/ArtCntNav.vue';
// import CategoryTools from '../widget/CategoryTools.vue';
//============================================================
const matter = usePageFrontmatter();
const widget = matter.value.widget;
//============================================================

const Calendar = defineAsyncComponent(() => import('../widget/Calendar.vue'));
const CategoryTools = defineAsyncComponent(() => import('../widget/CategoryTools.vue'));
const ArtCntNav = defineAsyncComponent(() => import('../widget/ArtCntNav.vue'));
//============================================================
onErrorCaptured(function (err, ins, info) {
  console.error('widget err====>>', err);
  // console.log('ins====>>', ins);
  console.error('info====>>', info);
});

</script>


<template>
  <div class="widget-box">
    <NSpace vertical size="large">
      <ClientOnly>
        <Suspense v-if="widget.calendar">
          <Calendar />
          <template #fallback>
            <CalendarSkeleton />
          </template>
        </Suspense>
      </ClientOnly>

      <CategoryTools />
    </NSpace>
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
import { defineAsyncComponent, onErrorCaptured } from 'vue';
import { usePageFrontmatter } from '@vuepress/client';
import CalendarSkeleton from '../widget/CalendarSkeleton.vue';
import CategoryTools from '../widget/CategoryTools.vue';
import { NSpace } from 'naive-ui';
//============================================================
const matter = usePageFrontmatter();
const widget = matter.value.widget;
//============================================================

const Calendar = defineAsyncComponent(() => import('../widget/Calendar.vue'));
//============================================================
onErrorCaptured(function (err, ins, info) {
  console.error('widget err====>>', err);
  console.log('ins====>>', ins);
  console.error('info====>>', info);
});

</script>


<template>
  <div class="swiper-container">
    <ClientOnly>
    <SwiperBox>
      <slot name="default"></slot>
    </SwiperBox>
  </ClientOnly>
  </div>
</template>

<style lang="scss">
.swiper-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 0.25rem;
  padding: 0.5rem;
  background-color: #f2f2f2;
}

</style>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
//
const SwiperBox = defineAsyncComponent(() => import('./SwiperBox.vue'));

</script>

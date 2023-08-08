<template>
  <div class="swiper-container">
    <n-carousel
      direction="horizontal"
      :show-arrow="true"
      dot-type="line"
      dot-placement="bottom"
      style="height: 240px"
    >
      <slot name="default"></slot>
    </n-carousel>
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
import { ref } from 'vue';

</script>

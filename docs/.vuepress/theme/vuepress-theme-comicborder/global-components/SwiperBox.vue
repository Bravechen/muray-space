<template>
  <NCarousel direction="horizontal" :show-arrow="true" dot-type="line" dot-placement="bottom" style="height: 240px">
    <slot name="default"></slot>
  </NCarousel>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import { NCarousel } from 'naive-ui';
</script>

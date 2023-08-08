<template>
  <div class="swiper-item">
    <img class="pic" v-if="cntType === 'img'" :src="picSrc" />

    <div v-if="cntType === 'txt'">
      <slot name="default"></slot>
    </div>

  </div>
</template>

<style lang="scss">
.swiper-item {
  & > .pic {
    display: block;
    width:100%;
  }
}

</style>

<script setup lang="ts">
import { ref, onMounted, useSlots } from 'vue';

const picSrc = ref<string>('');

const props = defineProps({
  cntType: {
    type: String,
    default: 'img'
  }
});

onMounted(function() {
  const slots = useSlots();
  if (!slots || !slots.default) {
    return;
  }

  if (props.cntType === 'img') {
    picSrc.value = slots.default()[0].children as string;
  }
});

</script>

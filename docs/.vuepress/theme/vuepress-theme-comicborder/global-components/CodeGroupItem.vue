<template>
<div class="code-group-item" v-show="currentTab === tab" >
  <slot name="default"></slot>
</div>
</template>

<style lang="scss">
.code-group-item {
  background-color: var(--theme-code-bg-color1);
}
</style>

<script setup>
import { inject } from 'vue';
// import { useCodeGroupTab } from '../hooks/code';
// import { str2unicodeFormate } from '../utils/tools';

// const { addCodeTab } = useCodeGroupTab();

const props = defineProps({
  tab: {
    type: String,
    default: ''
  }
});

const currentTab = inject('currentTab');

// const emits = defineEmits(['code:info']);

onMounted(function() {
  // emits('code:info', {
  //   tab: props.tab,
  // });
});

</script>

<template>
  <span class="badge" :class="[type]" :style="badgeStyle">
    <slot name="default">{{ text }}</slot>
  </span>
</template>

<style lang="scss">
.badge {

  display: inline-flex;
  vertical-align: var(--vertical);

  font-size: 0.75rem;
  font-weight: 600;
  // height: 1.125rem;
  line-height: 1.125rem;
  word-break: keep-all;
  white-space: nowrap;

  border-radius: 0.1875rem;
  padding: 0 0.375rem;

  &.tip {
    background-color: var(--badge-tip-bg);
    color: var(--badge-tip-text);
  }

  &.warning {
    background-color: var(--badge-warning-bg);
    color: var(--badge-warning-text);
  }

  &.danger {
    background-color: var(--badge-danger-bg);
    color: var(--badge-danger-text);
  }
}
</style>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'tip',
  },
  text: {
    type: String,
    default: '',
  },
  vertical: {
    type: String,
    default: 'middle',
  }
});

const badgeStyle = computed(function() {

  return {
    '--vertical': props.vertical,
  };
});

</script>

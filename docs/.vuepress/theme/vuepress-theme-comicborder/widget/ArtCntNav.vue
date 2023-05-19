<template>
  <NAffix class="art-cnt-nav" :trigger-top="72" position="fixed">
    <div class="wrapper">
      <Toc :header="{ levels: 4 }" />
    </div>
  </NAffix>
</template>

<style lang="scss">
@import '../styles/common.scss';

.art-cnt-nav {
  @include themeContainer();
  width: 25.625rem;

  margin-top: 1.5rem;
}
</style>

<script>
import { NAffix } from 'naive-ui';
</script>

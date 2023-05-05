<template>
  <div class="calendar-skeleton">
    <div class="top-s">
      <div class="top-s-l"></div>
      <div class="top-s-r"></div>
    </div>
    <div class="cnt-s">
      <div class="cnt-s-l" v-for="(n, i) of 5" :key="i">
        <span class="cnt-s-l-t" v-for="(m, j) of 5" :key="j"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/skeleton.scss';

.calendar-skeleton {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem;

  .top-s {
    display: flex;
    align-items: center;
    height: 1.5rem;
    margin-bottom: 1.375rem;

    .top-s-l {
      flex: 1;
      margin-right: 2.25rem;

      @include skeletonStyle(100%);
    }

    .top-s-r {
      flex: 1;

      @include skeletonStyle(100%);
    }
  }

  .cnt-s {
    display: flex;
    flex-direction: column;

    .cnt-s-l {
      display: flex;
      align-items: center;
      // width: 2.25rem;

      .cnt-s-l-t {
        flex: 1;
        margin: 0.375rem;

        @include skeletonStyle(2.25rem);
      }
    }
  }
}


</style>

<script setup>

</script>

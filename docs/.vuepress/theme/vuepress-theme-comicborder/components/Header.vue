<template>
  <header class="header">
    <nav class="navs">
      <a class="nav" v-for="nav of navs" :class="nav.name" :key="nav.link" :href="nav.link">
        <Icon class="icon" size="1.2rem" :icon="nav.icon" />
        <span class="txt">{{ nav.text }}</span>
      </a>
    </nav>
  </header>
</template>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100vw;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;

  box-sizing: border-box;
  padding: var(--theme-nav-box-padding1);

  .navs {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    background-color: var(--theme-color1);

    // gap: 1.5rem;
    height: 4rem;
    box-sizing: border-box;
    border: var(--theme-border1);
    border-radius: var(--theme-border-radius1);
    padding: var(--theme-navbar-padding1);
    box-shadow: var(--theme-shadow-color1);

    .nav {
      display: flex;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;
      border-radius: var(--theme-border-radius2);
      padding: var(--theme-nav-item-padding);

      color: var(--theme-font-color1);
      font-size: var(--theme-nav-font-size);
      font-weight: var(--theme-font-bold);

      transition-property: background-color, color;
      transition-duration: 0.2s;
      transition-timing-function: ease-in;

      .icon {
        display: inline-block;
        margin-right: 0.5rem;

        transition-property: color;
        transition-duration: 0.2s;
        transition-timing-function: ease-in;
        color: var(--theme-color2);
      }

      .txt {
        display: inline-block;
        line-height: 1;
        color: var(--theme-color2);
      }

      &:hover {
        color: var(--theme-color1);
        background-color: var(--theme-color4);

        .icon {
          color: var(--theme-color1);
        }

        .txt {
          color: var(--theme-color1);
        }

        &.home {
          background-color: var(--theme-nav-home-hover-color);
        }

        &.category {
          background-color: var(--theme-nav-category-hover-color);
        }

        &.archive {
          background-color: var(--theme-nav-archive-hover-color);
        }

        &.about {
          background-color: var(--theme-nav-about-hover-color);
        }
      }

    }
  }
}
</style>

<script setup>
import { ref, h } from 'vue';
// import { RouterLink } from 'vue-router';
import { useSiteData } from '@vuepress/client';
import Icon from './Icon.vue';
// import { NIcon, NButton } from 'naive-ui';
//============================================================
const siteData = useSiteData();
console.log(siteData.value.theme.navs);
//============================================================
const navs = ref([]);
navs.value = siteData.value.theme.navs;
console.log('navs:', navs);




</script>

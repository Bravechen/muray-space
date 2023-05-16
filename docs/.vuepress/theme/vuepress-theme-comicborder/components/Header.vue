<template>
  <header class="header">
    <template v-if="showInfo">
      <div class="site-info">
        <div class="avatar"><img src="" alt=""></div>
        <div class="info"></div>
        <div class="social-list"></div>
      </div>
      <div class="place"></div>
    </template>

    <nav class="navs" :style="navStyle">
      <a class="nav" v-for="nav of navs" :class="[nav.name, { 'active': nav.name === currentPage }]" :key="nav.link"
        :href="nav.link">
        <Icon class="icon" size="1.2rem" :icon="nav.icon" />
        <span class="txt">{{ nav.text }}</span>
      </a>
    </nav>
  </header>
</template>

<style lang="scss">
@import '../styles/common.scss';

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

  pointer-events: none;

  .navs {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    background-color: var(--theme-color1);

    // gap: 1.5rem;
    height: 4rem;
    overflow: hidden;
    box-sizing: border-box;
    border: var(--theme-border1);
    border-radius: var(--theme-border-radius1);
    padding: var(--theme-navbar-padding1);
    box-shadow: var(--theme-shadow-color1);

    pointer-events: all;

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

      position: relative;

      &::before {
        content: '';
        display: inline-block;
        width: 100%;
        height: 100%;

        position: absolute;
        top: -200%;
        left: 0;
        z-index: 1;

        box-sizing: border-box;
        border-radius: var(--theme-border-radius2);
        background-color: #f2f2f2;

        transition-property: top, background-color;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.8);
        transition-delay: 0.2s;
      }

      .icon {
        display: inline-block;
        margin-right: 0.5rem;
        position: relative;
        z-index: 2;

        color: var(--theme-color2);

        transition-property: color;
        transition-duration: 0.2s;
        transition-delay: 0.3s;
        transition-timing-function: ease-in;
      }

      .txt {
        display: inline-block;
        position: relative;
        z-index: 2;
        line-height: 1;
        color: var(--theme-color2);

        transition-property: color;
        transition-duration: 0.2s;
        transition-delay: 0.3s;
        transition-timing-function: ease-in;
      }

      @mixin navHoverEffect($top: 0, $bgColor: #f2f2f2) {
        &::before {
          top: 0;
          background-color: $bgColor;
        }
      }

      &.active {
        .icon {
          color: var(--active-color);
        }

        .txt {
          color: var(--active-color);
        }
      }

      &:hover {
        // color: var(--theme-color1);
        // background-color: var(--theme-color4);

        .icon {
          color: var(--theme-color1);
        }

        .txt {
          color: var(--theme-color1);
        }

        &.home {
          @include navHoverEffect(0, var(--theme-nav-home-hover-color));
        }

        &.tags {
          @include navHoverEffect(0, var(--theme-nav-tags-hover-color));
        }

        &.category {
          @include navHoverEffect(0, var(--theme-nav-category-hover-color));
        }

        &.archives {
          @include navHoverEffect(0, var(--theme-nav-archive-hover-color));
        }

        &.about {
          @include navHoverEffect(0, var(--theme-nav-about-hover-color));
        }
      }

    }
  }

  .site-info {
    display: flex;
    align-items: center;

    min-width: 20%;
    height: 4rem;

    @include themeContainer();

    padding: 0.5rem 1.5rem;
    background-color: var(--theme-color1);
  }

  .place {
    flex: 1;
    pointer-events: none;
  }
}
</style>

<script setup>
import { ref, computed } from 'vue';
// import { RouterLink } from 'vue-router';
import { useSiteData } from '@vuepress/client';
import Icon from './Icon.vue';
// import { NIcon, NButton } from 'naive-ui';
//============================================================
const siteData = useSiteData();
// console.log(siteData.value.theme.navs);
//============================================================
const props = defineProps({
  currentPage: {
    type: String,
    default: ''
  },
  showInfo: {
    type: Boolean,
    default: false
  }
});
//============================================================
const navs = ref([]);
navs.value = siteData.value.theme.navs;
// console.log('navs:', navs);
const navStyle = computed(function () {
  const navActiveColors = {
    home: `var(--theme-nav-home-hover-color)`,
    tags: `var(--theme-nav-tags-hover-color)`,
    category: `var(--theme-nav-category-hover-color)`,
    archives: `var(--theme-nav-archive-hover-color)`,
    about: `var(--theme-nav-about-hover-color)`,
    default: `var(--theme-color2)`,
  };
  return {
    '--active-color': navActiveColors[props.currentPage] || navActiveColors.default,
    opacity: 1,
  };
});
</script>

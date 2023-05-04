<template>
  <aside class="sider-bar">
    <div class="site-info">
      <div class="top-box">
        <div class="avatar">
          <img :src="avatar" alt="">
        </div>
        <div class="info">
          <h3 class="site-title">{{ site.title }}</h3>
          <h4 class="site-sub-title">{{ subTitle }}</h4>
          <!-- <p class="site-sub-title">{{ site.description }}</p> -->
        </div>
      </div>
      <div class="mid-box"></div>
      <div class="bottom-box">
        <div class="social-bar">
          <a v-for="social in socials" class="social" :key="social.link" :href="social.link" :title="social.title"
            target="_blank">
            <Icon :icon="social.icon" :size="social.iconSize || '1.5rem'" />
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
@import '../styles/common.scss';

.sider-bar {
  width: 21.625rem;
  height: 100%;

  box-sizing: border-box;
  margin: 0 1.5rem 0 2.25rem;

  .site-info {
    display: flex;
    flex-direction: column;

    width: 100%;
    min-height: 31.1875rem;
    box-sizing: border-box;
    border-radius: var(--theme-border-radius1);
    border: var(--theme-border1);
    box-shadow: var(--theme-shadow-color1);
    padding: var(--theme-container-padding1);

    .top-box {

      .avatar {
        width: 6.875rem;
        height: 6.875rem;
        box-sizing: border-box;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 1.25rem;

        @include img ();
      }

      .info {
        display: flex;
        flex-direction: column;

        .site-title {
          word-break: break-word;
          white-space: normal;
          font-size: 1.25rem;
          color: var(--theme-color2);
          font-weight: var(--theme-font-bold);
          line-height: 1.2;

          margin-bottom: 0.5625rem;
        }

        .site-sub-title {
          font-size: 0.875rem;
          font-weight: normal;
          color: var(--theme-font-color1);
        }
      }
    }

    .mid-box {
      flex: 1;
    }

    .bottom-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .social-bar {
        display: inline-block;
        box-sizing: border-box;
        border: var(--theme-border1);
        box-shadow: var(--theme-shadow-color1);
        border-radius: var(--theme-border-radius1);
        padding: calc((3rem - 1.5rem)/2) 1.125rem;
        background-color: var(--theme-color6);

        .social {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          margin: 0 0.375rem;
          font-size: 0;
        }
      }
    }
  }
}
</style>

<script setup>
import { useSiteData } from '@vuepress/client';
import Icon from './Icon.vue';

const site = useSiteData();
const socials = site.value.theme.socials;
const avatar = site.value.theme.logo;
const subTitle = site.value.theme.subTitle;

const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  siteTitle: {
    type: String,
    default: '网站标题',
  },
  siteSubTitle: {
    type: String,
    default: '网站副标题',
  },
});
</script>

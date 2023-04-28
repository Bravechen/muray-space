<template>
  <Header />
  <main class="page home-page">
    <div class="sec1">
      <section class="bg-box">
        <section class="site-info">
          <div class="avatar"><img draggable="false" :src="site.theme.logo" alt=""></div>
          <div class="site-title">{{ matter.heroText }}</div>
          <div class="site-sub-title">{{ matter.tagline }}</div>
          <div class="ctrl-bar">
            <a class="link-btn" :href="btn.link" :class="btn.type" v-for="btn of matter.actions" :key="btn.link">{{
              btn.text
            }}</a>
          </div>
        </section>
        <slot name="background">
          <div class="bg-img">
            <img draggable="false" :src="matter.heroImage" :alt="matter.heroAlt || ''">
          </div>
        </slot>
      </section>

      <section class="feature-list">
        <div class="feature-item" v-for="(item, index) in matter.features" :key="index">
          <em class="item-title">{{ item.title }}</em>
          <p class="item-detail">{{ item.details }}</p>
        </div>
      </section>
    </div>

  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.home-page {

  // min-height: calc(100vh - 92px);
  .sec1 {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .bg-box {
      display: block;
      height: 80vh;
      background-color: white;

      position: relative;

      .site-info {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 200;
        transform: translateX(-50%) translateY(-50%);

        display: flex;
        flex-direction: column;

        box-sizing: border-box;
        padding: var(--theme-container-padding1);
        border-radius: var(--theme-border-radius1);
        border: var(--theme-btn-border1);
        border-color: transparent;

        max-width: 36vw;
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.6);

        transition-property: background-color, opacity, border, box-shadow;
        transition-duration: 0.2s;
        transition-timing-function: ease;

        cursor: pointer;
        user-select: none;

        &>.avatar {
          width: 8.25rem;
          height: 8.25rem;
          overflow: hidden;

          border-radius: 50%;
          user-select: none;
          margin-bottom: 1.5rem;
        }

        &>.site-title {
          display: block;
          margin-bottom: 0.625rem;

          font-size: 2.25rem;
          font-weight: var(--theme-font-bold);
          color: var(--theme-color2);
        }

        &>.site-sub-title {
          display: block;
          margin-bottom: 2.5rem;

          font-size: 1.25rem;
          color: var(--theme-font-color1);
        }

        &>.ctrl-bar {
          display: flex;
          align-items: center;
          // justify-content: center;
          width: 100%;

          &>.link-btn {

            transition-property: background-color, color;
            transition-duration: 0.2s;
            transition-timing-function: ease-in;

            &.primary {
              @include flexBtn(9rem, 2.25rem, var(--theme-color3));
              margin-right: 1.25rem;



              &:hover {
                background-color: var(--theme-color5);
                color: var(--theme-color1);
              }
            }

            &.secondary {
              @include flexBtn(9rem, 2.25rem, var(--theme-color1));

              &:hover {
                background-color: var(--theme-color11);
                color: var(--theme-color1);
              }
            }
          }
        }

        &:hover {
          border: var(--theme-btn-border1);
          box-shadow: var(--theme-shadow-color1);
          background-color: var(--theme-color10);

          &+.bg-img {
            opacity: 0.3;
          }
        }
      }

      &>.bg-img {
        height: 100%;
        overflow: hidden;
        @include img();

        user-select: none;

        transition-property: opacity;
        transition-duration: 0.2s;
        transition-timing-function: ease;
      }

    }

    .feature-list {

      flex: 1;
      width: 80vw;
      margin: 0 auto;

      display: flex;
      align-items: center;
      // justify-content: space-between;

      box-sizing: border-box;
      padding: 0.625rem 0;

      // background-color: rgba(242, 200, 196, 0.2);

      .feature-item {
        flex: 1;

        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;

        box-sizing: border-box;
        padding: var(--theme-container-padding1);
        border-radius: var(--theme-border-radius1);
        border: var(--theme-border1);
        box-shadow: var(--theme-shadow-color1);
        background-color: var(--theme-color1);

        margin: 0 1.875rem;
        cursor: pointer;
        user-select: none;

        transition-property: border-color, box-shadow, background-color, color;
        transition-duration: 0.3s;
        transition-timing-function: ease-in-out;

        & > .item-title {
          display: block;

          font-size: 1.25rem;
          font-weight: var(--theme-font-bold);
          color: var(--theme-color5);
          font-style: normal;
        }

        & > .item-detail {
          display: block;

          font-size: 1rem;
          color: #4f4f4f;
          line-height: 1.5;
        }

        &:hover {
          &:nth-child(1) {
            border-color: var(--theme-color7);
            box-shadow: 0 2px 0 0 var(--theme-color7);
            background-color: rgba(191, 126, 6, 0.2);

            .item-title {
              color: var(--theme-color7);
            }

            .item-detail {
              color: var(--theme-color7);
            }
          }

          &:nth-child(2) {
            border-color: var(--theme-color8);
            box-shadow: 0 2px 0 0 var(--theme-color8);
            background-color: rgba(94, 140, 101, 0.2);

            .item-title {
              color: var(--theme-color8);
            }

            .item-detail {
              color: var(--theme-color8);
            }
          }

          &:nth-child(3) {
            border-color: var(--theme-color11);
            box-shadow: 0 2px 0 0 var(--theme-color11);
            background-color: rgba(166, 82, 63, 0.2);

            .item-title {
              color: var(--theme-color11);
            }

            .item-detail {
              color: var(--theme-color11);
            }
          }
        }
      }
    }
  }


}
</style>

<script setup>
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';


const pageData = usePageData();
const matter = usePageFrontmatter();
const site = useSiteData();

console.log('This is HomeLayout:-------------------');
console.log('siteData:', site.value);
console.log('pageData:', pageData.value);
console.log('frontmatter:', matter.value);
</script>

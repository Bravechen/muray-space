<template>
  <Header />
  <div class="page err-404-page">
    <div class="wrapper">
      <h1 class="title-txt">404</h1>
      <div class="pic">
        <img :src="err404.notFoundBg" alt="">
      </div>
      <h3 class="err-msg">{{ errMsg || `万分抱歉，您找的这一页我没还写...` }}</h3>
      <div class="ctrl-bar">
        <a class="goto-home" href="/">{{ err404.backToHome }}</a>
      </div>
    </div>

  </div>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.err-404-page {
  @include normalPage();

  &.page {

    min-height: 72vh;
  }


  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .wrapper {
    width: 50vw;
    box-sizing: border-box;

  }

  .title-txt {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: 20vw;
    height: 3rem;
    margin-bottom: 1.5rem;

    padding: var(--theme-container-padding1);
    border: var(--theme-border1);
    border-radius: var(--theme-border-radius1);
    box-shadow: var(--theme-shadow-color1);

    font-size: 4.5rem;
    font-weight: var(--font-weight-bold);
  }

  .pic {
    width: 32vw;

    @include img();

    margin-bottom: 2.25rem;
  }

  .err-msg {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1.25rem;

    font-size: 1.5rem;
    font-weight: var(--font-weight-bold);
  }

  .goto-home {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 10rem;
    height: 2.25rem;

    border: var(--theme-border1);
    border-radius: var(--theme-border-radius1);
    box-shadow: var(--theme-shadow-color1);

    font-size: 1.125rem;
    font-weight: var(--font-weight-bold);
    color: var(--theme-color2);

    transition-property: color, background-color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;

    &:hover {
      background-color: var(--theme-color4);
      color: var(--theme-color1);
    }
  }
}
</style>

<script setup>
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const pageData = usePageData();
const frontmatter = usePageFrontmatter();
const site = useSiteData();

// console.log('This is NotFoundLayout:-------------------');
// console.log('pageData:', pageData.value);
// console.log('frontmatter:', frontmatter.value);
// console.log('site:', site.value);

const err404 = site.value.theme.err404;
const errMsg = err404.notFound[Math.random() * err404.notFound.length | 0];
</script>

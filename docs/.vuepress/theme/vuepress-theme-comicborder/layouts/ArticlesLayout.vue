<template>
  <Header  current-page="articles" />
  <main class="page articles-page">
    <SideBar />
    <div class="content">
      <ul class="articles">
        <ArticleItem
          v-for="art of currentPageArts"
          :key="art.path"
          :title="art.title"
          :cover-img="art.coverImg"
          :date="art.date"
          :desc="art.desc"
          :path="art.path" />
      </ul>
      <ClientOnly>
        <Pager v-if="pageTotal > 10" :page-total="pageTotal" :init-page-num="pageNum" />
      </ClientOnly>
    </div>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.articles-page {

  @include normalPage();

  .content {
    flex: 5;

    display: flex;
    flex-direction: column;
    align-items: center;


    .articles {
      display: flex;
      flex-direction: column;
      width: 100%;
      list-style: none;
      margin-bottom: 2.25rem;
    }
  }
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';

import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import ArticleItem from '../components/ArticleItem.vue';
// import Pager from '../components/Pager.vue';

const Pager = defineAsyncComponent(() => import('../components/Pager.vue'));


const site = useSiteData();
const pageData = usePageData();
const frontmatter = usePageFrontmatter();

// console.log('This is ArticlesLayout:-------------------');
// console.log('pageData:', pageData.value);
// console.log('frontmatter:', frontmatter.value);
// console.log('site:', site.value);

const articlesData = site.value.articlesData;
const articles = articlesData.articles;
const artPages = articlesData.articlePages;
let pageNum = 1;
let pageTotal = artPages.length;

const currentPageArts = computed(function() {
  return (artPages[pageNum - 1] || []).map(function(artId) {
    return articles[artId];
  });
});

</script>

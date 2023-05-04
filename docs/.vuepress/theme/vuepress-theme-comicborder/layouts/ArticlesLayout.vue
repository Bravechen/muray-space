<template>
  <Header />
  <main class="page articles-page">
    <!-- <Content /> -->
    <SideBar />
    <div class="content">
      <ul class="articles">
        <ArticleItem
          v-for="art of articles"
          :key="art.path"
          :title="art.title"
          :cover-img="art.coverImg"
          :date="art.date"
          :desc="art.desc"
          :path="art.path" />
      </ul>
    </div>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.articles-page {
  display: flex;

  @include normalPage();

  .content {
    flex: 5;

    .articles {
      display: flex;
      flex-direction: column;
      list-style: none;


    }
  }
}
</style>

<script setup>
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import ArticleItem from '../components/ArticleItem.vue';


const site = useSiteData();
const pageData = usePageData();
const frontmatter = usePageFrontmatter();

console.log('This is ArticlesLayout:-------------------');
console.log('pageData:', pageData.value);
console.log('frontmatter:', frontmatter.value);
console.log('site:', site.value);

const articles = site.value.articlesData.articles;
</script>

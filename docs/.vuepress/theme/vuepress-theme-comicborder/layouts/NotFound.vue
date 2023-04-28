<template>
  <Header />
  <div>404 Not Found</div>
  <Footer />
</template>

<style lang="scss"></style>

<script setup>
import { usePageData, usePageFrontmatter } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const pageData = usePageData();
const frontmatter = usePageFrontmatter();

console.log('This is NotFoundLayout:-------------------');
console.log('pageData:', pageData.value);
console.log('frontmatter:', frontmatter.value);

</script>

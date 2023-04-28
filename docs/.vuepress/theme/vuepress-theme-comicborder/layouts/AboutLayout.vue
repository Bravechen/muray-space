<template>
  <!-- <Header /> -->
  <main>
    <Content />
  </main>
  <!-- <Footer /> -->
</template>

<style lang="scss"></style>

<script setup>
import { usePageData, usePageFrontmatter } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const pageData = usePageData();
const frontmatter = usePageFrontmatter();

console.log('This is AboutLayout:-------------------');
console.log('pageData:', pageData.value);
console.log('frontmatter:', frontmatter.value);
</script>

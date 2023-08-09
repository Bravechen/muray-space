<template>
  <Header :avatar="theme.logo" :social-list="theme.socials" :site-title="site.title" show-info />
  <main class="page article-page">
    <article class="content" >
      <section class="article-info">
        <h1 class="art-title">{{ matter.title }}</h1>
        <em class="art-sub-title">{{ matter.description }}</em>
        <div class="base-info">
          <time class="create-time">
            <i class="icon"><CalendarOutline /></i>
            <span>撰写：{{ createTime }}</span>
          </time>
          <time class="update-time">
            <i class="icon"><Time /></i>
            <span>上次更新：{{ updateTime }}</span>
          </time>
        </div>
      </section>
      <section v-if="!!matter.coverImg" class="article-hero-img">
        <div class="pic"><img :src="matter.coverImg" alt="" /></div>
      </section>
      <Content class="article-cnt theme-markdown" />
      <ClientOnly>
        <div class="category-tag">
          <div class="art-categories">
            <span class="title-txt">分类：</span>
            <TagList :item-list="categoryList" />
          </div>
          <div class="art-tags">
            <span class="tags">标签：</span>
            <TagList :item-list="tagList" />
          </div>
        </div>
      </ClientOnly>
      <div></div>
    </article>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

$icon-size: 1rem;

.article-page {
  @include normalPage();

  .content {
    @include pageContent();
    align-items: flex-start;
    height: auto;
    margin-left: 1.5rem;

    @include themeContainer();

    .article-info {
      display: flex;
      flex-direction: column;

      .art-title {
        display: block;
        margin-bottom: 1rem;

        word-break: break-word;
        white-space: normal;

        font-size: 1.5rem;
        color: var(--markdown-h-color);
      }

      .art-sub-title {
        display: block;
        margin-bottom: 1rem;

        word-break: break-word;
        white-space: normal;

        font-size: 0.875rem;
        font-style: normal;
        color: var(--markdown-font-color1);
      }

      .base-info {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;

        .create-time {
          display: inline-flex;
          align-items: center;
          color: var(--markdown-font-color2);
          font-size: 0.75rem;
          margin-right: 0.625rem;

          & > .icon {
            display: inline-block;
            vertical-align: middle;
            width: $icon-size;
            height: $icon-size;
            margin-right: 0.25rem;
          }
        }

        .update-time {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          margin-right: 0.625rem;
          color: var(--markdown-font-color2);

          & > .icon {
            display: inline-block;
            vertical-align: middle;
            width: $icon-size;
            height: $icon-size;
            margin-right: 0.25rem;
          }
        }
      }
    }

    .article-hero-img {
      width: 100%;
      height: 26.6875rem;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: var(--theme-border-radius1);
      border: var(--theme-border1);
      box-shadow: var(--theme-shadow-color1);
      margin: 0 auto;
      margin-bottom: 2rem;

      .pic {
        display: block;
        position: relative;
          top: 50%;
          transform: translateY(-50%);
        @include img();

        // & > img {

        // }
      }
    }

    .category-tag {
      margin-top: 1.25rem;

      .art-categories {
        margin-bottom: 0.75rem;
      }

      .art-tags {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>

<script setup>
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import { CalendarOutline } from '@vicons/ionicons5';
import { Time } from '@vicons/carbon';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Widget from '../components/Widget.vue';

const TagList = defineAsyncComponent(() => import('../components/TagList.vue'));


const pageData = usePageData();
const matter = usePageFrontmatter();
const site = useSiteData();

// console.log('This is ArticlePageLayout:-------------------');
// console.log('pageData:', pageData.value);
// console.log('frontmatter:', matter.value);
// console.log('site:', site.value);

const theme = site.value.theme;
const tags = site.value.articlesData.artTags;
const categories = site.value.articlesData.artCategories;
const pageId = pageData.value.key;
const article = site.value.articlesData.articles[pageId];

const tagList = computed(function() {
  return article.tagIds.map(function(tagId) {
    const tag = tags[tagId];
    return {
      ...tag,
    };
  });
});

const categoryList = computed(function() {
  return article.categoryIds.map(function(categoryId) {
    const category = categories[categoryId];
    return {
      ...category,
    };
  });
});

const updateTime = computed(function() {
  const date = new Date(pageData.value.git.updatedTime);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
});

const createTime = computed(function() {
  const date = new Date(pageData.value.git.createdTime);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
});



</script>

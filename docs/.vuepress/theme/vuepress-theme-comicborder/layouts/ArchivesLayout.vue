<template>
  <Header current-page="archives" />
  <main class="page archives-page">
    <SideBar />
    <div class="content">
      <div class="year-list" @click="onItemListClick">
        <a v-for="year of yearList" :key="year.year" href="javascript:void 0" class="year-item"
          :class="{ 'active': currentYear === year.year }" data-type="selectYear" :data-year="year.year">
          <span class="item-txt">{{ year.year }}年</span>
          <span class="art-sum">（<em>{{ year.artSum }}</em>）篇</span>
        </a>
      </div>
      <template v-if="artList && artList.length > 0">
        <ClientOnly>
          <ArticleList :art-list="artList" />
        </ClientOnly>
      </template>
      <div v-else class="empty-list">
        <span>欢迎，请您选择一个年份 ＿φ(￣ー￣ )</span>
      </div>
    </div>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.archives-page {
  @include normalPage();

  .content {
    @include pageContent();
    align-items: flex-start;
    height: auto;

    @include themeContainer();

    .year-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;

      .year-item {
        display: inline-block;
        box-sizing: border-box;
        padding: 0.25rem 0.5rem;

        font-size: 0.875rem;
        font-weight: var(--theme-font-bold);
        color: var(--theme-color2);
        border: var(--theme-border1);
        border-radius: var(--theme-border-radius2);
        box-shadow: var(--theme-shadow-color1);

        .item-txt {
          pointer-events: none;
        }

        .art-sum {
          pointer-events: none;
        }

        em {
          font-style: normal;
          pointer-events: none;
        }

        &.active {
          background-color: var(--theme-color8);
          color: var(--theme-color1);
        }
      }
    }

    .empty-list {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 36vh;
      margin: 0 auto;

      font-size: 1.125rem;
      font-weight: var(--theme-font-bold);
      color: var(--theme-font-color1);
    }
  }
}
</style>

<script setup>
import { ref, onMounted, onErrorCaptured } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import { tagStyles } from '../constant/tagStyle';

const ArticleList = defineAsyncComponent(() => import('../components/ArticleList.vue'));

const pageData = usePageData();
const frontmatter = usePageFrontmatter();
const site = useSiteData();
const route = useRoute();

// console.log('This is ArchivesLayout:-------------------');
// console.log('pageData:', pageData.value);
// console.log('frontmatter:', frontmatter.value);
const artListByYear = site.value.articlesData.artListByYear;
const yearList = ref([]);
const currentYear = ref(0);

yearList.value = Object.keys(artListByYear).map(function (year) {
  return {
    year: +year,
    artSum: artListByYear[year]?.length || 0,
  };
});

const artList = ref([]);

// ui 事件
const uiEvents = {
  /**
   * 选择一项
   * @param {*} data
   */
  selectYear(data) {
    const { year } = data;
    combineArtList(year);
  }
};

/**
 * 分类容器点击事件
 * @param {*} e
 */
function onItemListClick(e) {
  const tar = e.target;
  let data, type;
  if (!tar || !(data = tar.dataset) || !(type = data.type)) {
    return;
  }
  const fn = uiEvents[type];
  if (typeof fn === 'function') {
    fn({ ...data });
  }
}

/**
 * 合成分类对应文章列表
 * @param {*} tagId
 */
function combineArtList(itemId) {
  const artListByYear = site.value.articlesData.artListByYear;
  const artIds = artListByYear[itemId];
  if (!artIds) {
    return;
  }

  currentYear.value = +itemId;
  const articles = site.value.articlesData.articles;

  artList.value = (artIds || []).reduce(function (prev, artId) {
    const art = articles[artId];
    if (!art) {
      return prev;
    }
    prev.push({
      ...art,

    });
    return prev;
  }, []);
}

/**
 * 从URL中获取tagId，优先hash，其次是query
 * @param {*} route
 */
function getItemIdByURL(route, queryKey) {
  const item = route.query[queryKey];
  let year = 0;
  if (item) {
    year = +item;
  }

  return year;
}

onMounted(function () {
  const itemId = getItemIdByURL(route, 'year') || Object.keys(artListByYear)[0];
  if (itemId) {
    combineArtList(+itemId);
  }
});

onErrorCaptured(function (err) {
  console.error(err);
});
</script>

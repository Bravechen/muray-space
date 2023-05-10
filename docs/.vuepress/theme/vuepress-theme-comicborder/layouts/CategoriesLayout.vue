<template>
  <Header current-page="category" />
  <main class="page categories-page">
    <SideBar />
    <div class="content">
      <div class="items-box" @click="onItemListClick">
        <ClientOnly>
          <CategorySelector @switch:changed="onSwitchCategory" title="分类" :current-item="currentCategory"
            :item-list="categoryList">
            <template #title-txt>这一堆，那一堆，分分类：</template>
          </CategorySelector>
        </ClientOnly>
      </div>

      <template v-if="artList && artList.length > 0">
        <ClientOnly>
          <ArticleList :art-list="artList" />
        </ClientOnly>
      </template>
      <div v-else class="empty-list">
        <span>欢迎，请您选择一个分类 ＿φ(￣ー￣ )</span>
      </div>
    </div>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.categories-page {
  @include normalPage();

  .content {
    @include pageContent();
    align-items: flex-start;
    height: auto;

    @include themeContainer();

    .items-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin-bottom: 1.25rem;
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
import { ClientOnly, usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';

import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import { tagStyles } from '../constant/tagStyle';

const CategorySelector = defineAsyncComponent(() => import('../components/ItemSelector.vue'));
const ArticleList = defineAsyncComponent(() => import('../components/ArticleList.vue'));

// const pageData = usePageData();
// const frontmatter = usePageFrontmatter();
const site = useSiteData();
const route = useRoute();

// console.log('This is CategoriesLayout:-------------------');
// console.log('pageData:', pageData.value);
// console.log('frontmatter:', frontmatter.value);

const categoryMap = site.value.articlesData.artCategories;
const artListByCategory = site.value.articlesData.artListByCategory;

// 分类列表
let categoryList = ref([]);

categoryList.value = Object.values(categoryMap).map(function (item, index) {

  return {
    ...item,
    artSum: artListByCategory[item.id].length,
    color: tagStyles[index % tagStyles.length],
  };
});

// 当前tag
const currentCategory = ref({});
// 文章列表
const artList = ref([]);

// ui 事件
const uiEvents = {
  /**
   * 选择一项
   * @param {*} data
   */
  selectItem(data) {
    const { itemId } = data;
    combineArtList(itemId);
  }
};

/**
 * 合成分类对应文章列表
 * @param {*} tagId
 */
function combineArtList(itemId) {
  const items = site.value.articlesData.artCategories;
  const item = items[itemId];
  if (!item) {
    return;
  }
  currentCategory.value = item || {};
  const artListByCategory = site.value.articlesData.artListByCategory;
  const articles = site.value.articlesData.articles;

  artList.value = (artListByCategory[itemId] || []).reduce(function (prev, artId) {
    const art = articles[artId];
    if (!art) {
      return prev;
    }
    prev.push({
      ...art,

    });
    return prev;
  }, []);

  // const hash = route.hash;
  const href = window.location.href;
  const reg = /\#[0-9a-z]+((\$|\%24)_(\$|\%24)[0-9a-z]+)+/g;
  if (reg.test(href)) {
    window.location.href = href.replace(reg, `#${encodeURIComponent(itemId)}`);
  } else {
    window.location.href += `#${encodeURIComponent(itemId)}`;
  }
}

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
 * 切换分类
 * @param {*} value
 */
function onSwitchCategory(value) {
  if (!value) {

    setTimeout(function () {
      currentCategory.value = {};
      artList.value = [];
      const href = window.location.href;
      const reg = /\#[0-9a-z]+(\$_\$[0-9a-z]+)+/g;
      if (reg.test(href)) {
        window.location.href = href.replace(reg, '#0$_$0');
      }
    }, 500);

  }
}

/**
 * 从URL中获取tagId，优先hash，其次是query
 * @param {*} route
 */
function getItemIdByURL(route, queryKey) {
  const hash = route.hash;
  const reg = /[0-9a-z]+((\$|\%24)_(\$|\%24)[0-9a-z]+)+/g;
  let itemId = '';
  if (hash) {
    let str = decodeURIComponent(hash.slice(1));
    if (reg.test(str)) {
      itemId = str.match(reg)[0] || '';
    }
    if (itemId) {
      return itemId;
    }
  }

  const item = route.query[queryKey];
  if (item) {
    itemId = decodeURIComponent(item);
  }

  return itemId;
}

onMounted(function () {
  const itemId = getItemIdByURL(route, 'category');
  if (itemId) {
    combineArtList(itemId);
  }
});

onErrorCaptured(function (err) {
  console.error(err);
});

</script>

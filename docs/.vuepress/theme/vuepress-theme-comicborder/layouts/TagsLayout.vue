<template>
  <Header />
  <main class="page tags-page">
    <SideBar />
    <div class="content">
      <div class="tags-box" @click="onTagListClick">
        <ClientOnly>
          <TagSelector @switch:changed="onSwitchTag" :current-tag="currentTag" :tag-list="tagList" />
        </ClientOnly>
      </div>

      <template v-if="artList && artList.length > 0">
        <ClientOnly>
          <ArticleList :art-list="artList" />
        </ClientOnly>
      </template>
      <div v-else class="empty-list">
        <span>兄弟姐妹，等着你选择一个标签呢 ....φ(︶▽︶)φ....</span>
      </div>
    </div>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';

.tags-page {
  @include normalPage();

  .content {
    @include pageContent();
    align-items: flex-start;
    height: auto;

    box-sizing: border-box;
    border-radius: var(--theme-border-radius1);
    border: var(--theme-border1);
    box-shadow: var(--theme-shadow-color1);
    padding: var(--theme-container-padding1);

    .tags-box {
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
// import { NList, NListItem } from 'naive-ui';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import { tagStyles } from '../constant/tagStyle';

const TagSelector = defineAsyncComponent(() => import('../components/TagSelector.vue'));
const ArticleList = defineAsyncComponent(() => import('../components/ArticleList.vue'));

const pageData = usePageData();
const frontmatter = usePageFrontmatter();
const site = useSiteData();
const route = useRoute();

// console.log('This is TagsLayout:-------------------');
// console.log('pageData:', pageData.value);
// console.log('frontmatter:', frontmatter.value);
// console.log('site:', site.value);
// console.log('route:', route);

const tagMap = site.value.articlesData.artTags;
const artListByTag = site.value.articlesData.artListByTag;
// 标签列表
let tagList = ref([]);

tagList.value = Object.values(tagMap).map(function (tag, index) {

  return {
    ...tag,
    artSum: artListByTag[tag.id].length,
    color: tagStyles[index % tagStyles.length],
  };
});

// 当前tag
const currentTag = ref({});
// 文章列表
const artList = ref([]);

// ui 事件
const uiEvents = {
  selectTag(data) {
    const { tagId } = data;
    combineArtList(tagId);
  }
};

/**
 * 合成标签对应文章列表
 * @param {*} tagId
 */
function combineArtList(tagId) {
  const tags = site.value.articlesData.artTags;
  const tag = tags[tagId];
  if (!tag) {
    return;
  }
  currentTag.value = tag || {};
  const artListByTag = site.value.articlesData.artListByTag;
  const articles = site.value.articlesData.articles;

  artList.value = (artListByTag[tagId] || []).reduce(function (prev, artId) {
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
    window.location.href = href.replace(reg, `#${encodeURIComponent(tagId)}`);
  } else {
    window.location.href += `#${encodeURIComponent(tagId)}`;
  }
}

/**
 * 标签容器点击事件
 * @param {*} e
 */
function onTagListClick(e) {
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

function onSwitchTag(value) {
  if (!value) {

    setTimeout(function () {
      currentTag.value = {};
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
function getTagIdByURL(route) {
  const hash = route.hash;
  const reg = /[0-9a-z]+((\$|\%24)_(\$|\%24)[0-9a-z]+)+/g;
  let tagId = '';
  if (hash) {
    let str = decodeURIComponent(hash.slice(1));
    if (reg.test(str)) {
      tagId = str.match(reg)[0] || '';
    }
    if (tagId) {
      return tagId;
    }
  }

  const { tag } = route.query;
  if (tag) {
    tagId = decodeURIComponent(tag);
  }

  return tagId;
}

onMounted(function () {
  const tagId = getTagIdByURL(route);
  if (tagId) {
    combineArtList(tagId);
  }
});

onErrorCaptured(function (err) {
  console.error(err);
});

</script>

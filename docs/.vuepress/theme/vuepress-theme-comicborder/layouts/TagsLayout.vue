<template>
  <Header />
  <main class="page tags-page">
    <SideBar />
    <div class="content">
      <div class="tags-box" @click="onTagListClick">
        <div class="wrapper" v-show="!currentTag.id">
          <h4>打来打去，打标签：</h4>
          <NSpace class="tag-list">
            <NTag v-for="(tag, index) in tagList" :key="tag.id" :color="tag.color"><span class="tag-cnt"
                data-type="selectTag" :data-tag-id="tag.id">{{ tag.name }} 共 {{ tag.artSum }}篇</span></NTag>
          </NSpace>
        </div>
        <h3 v-if="!!currentTag.id" class="current-tag">
          <span class="current-tag-name">标签&nbsp;&nbsp;<em>{{ currentTag.name }}</em>&nbsp;&nbsp;下的文章:</span>
          <n-switch class="toggle-tags" size="large" @update:value="onSwitchTag" :default-value="true"
            :rail-style="railStyle">
            <template #checked-icon>
              <span class="toggle-icon"></span>
            </template>
            <template #unchecked-icon>
              <span class="toggle-icon"></span>
            </template>
            <template #checked><span class="checked-txt">换一个标签</span></template>
            <template #unchecked><span class="unchecked-txt">预备...</span></template>
          </n-switch>
        </h3>
      </div>

      <template v-if="artList && artList.length > 0">
        <NList class="art-list" hoverable clickable>
          <NListItem v-for="art of artList" class="art-item">
            <a :href="art.path" class="item-wrapper">
              <span class="item-title">{{ art.title }}</span>
              <time class="item-time" :datetime="art.date">撰写：{{ art.date }}</time>
              <time v-if="!!art.updateDate" class="item-time update" :datetime="art.date">更新：{{ art.updateDate }}</time>
            </a>
          </NListItem>
        </NList>
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

      h4 {
        margin-bottom: 0.625rem;
        font-size: 1.125rem;

      }

      .tag-list {
        width: 100%;
        margin-bottom: 1.25rem;

        .tag-cnt {
          cursor: pointer;
        }
      }

      .current-tag {
        display: flex;
        align-items: center;
        width: 100%;

        .current-tag-name {
          flex: 1;
          font-weight: normal;
          font-size: 0.875rem;

          &>em {
            font-style: normal;
            font-size: 1.125rem;
            color: var(--theme-color5);
            font-weight: var(--theme-font-bold);
          }
        }

        .toggle-tags {
          &.n-switch {
            .n-switch__rail {
              box-sizing: border-box;
              border: var(--theme-border1);

              .n-switch__button {
                border: var(--theme-border1);
              }
            }
          }

          .toggle-icon {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            box-sizing: border-box;
            border: var(--theme-border1);
          }

          .checked-txt {
            color: var(--theme-color1);
            font-weight: normal;
          }

          .unchecked-txt {
            font-weight: normal;
            color: var(--theme-color2);
          }
        }
      }
    }



    .art-list {
      width: 100%;

      .art-item {
        .item-wrapper {
          display: flex;
          align-items: center;

          .item-title {
            flex: 1;

            color: var(--theme-color2);
          }

          .item-time {
            font-size: 0.75rem;
            color: var(--theme-color13);

            &.update {
              margin-left: 0.625rem;
            }
          }
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import { NSpace, NTag, NList, NListItem } from 'naive-ui';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import { tagStyles } from '../constant/tagStyle';

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
const tagList = Object.values(tagMap).map(function (tag, index) {

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

// 开关的自定义样式
const railStyle = function ({ focused, checked }) {
  const style = {
    '--n-rail-height': '1.875rem',
  };
  if (checked) {
    style.background = "var(--theme-color6)";
    if (focused) {
      style.boxShadow = "0 0 0 2px ##F2B70540";
    }
  } else {
    style.background = "var(--theme-color1)";
    if (focused) {
      style.boxShadow = "0 0 0 2px #A0C3D940";
    }
  }
  return style;
};

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

</script>

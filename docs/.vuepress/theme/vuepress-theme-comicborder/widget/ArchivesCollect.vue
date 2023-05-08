<template>
<div class="archives-collect">
  <NList>
    <NListItem v-for="item of artArchives" :key="item.name">
      <a :href="item.link" class="archive-item">
        <em class="archive-name">{{ item.name }}</em>
        <span class="archive-art-sum"><b>{{ item.artSum }}</b>篇</span>
      </a>
    </NListItem>
  </NList>
  </div>
</template>

<style lang="scss">
.archives-collect {
  .archive-item {
    display: inline-block;

    transition-property: border-color, padding, background-color, color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;

    &:hover {
      border-color: var(--theme-color8);
      padding: 0 var(--theme-container-padding3);
      background-color: var(--theme-color8);
      border-radius: var(--theme-border-radius3);

      .archive-name {
        color: var(--theme-color1);
      }

      .archive-art-sum {
        color: var(--theme-color1);
      }
    }

    .archive-name {
      display: inline-block;
      margin-right: 0.625rem;
      font-weight: var(--theme-font-bold);
      font-style: normal;
      color: var(--theme-color2);
    }

    .archive-art-sum {
      font-weight: normal;
      font-size: 0.75rem;
      color: var(--theme-color13);

      & > b {
        font-weight: normal;
      }
    }
  }
}
</style>

<script setup>
import { computed } from 'vue';
import { NList } from 'naive-ui';
import { useSiteData } from '@vuepress/client';

const site = useSiteData();

const artArchives = computed(function() {
  const articlesData = site.value.articlesData;
  const artArchives = articlesData.artListByYear;

  return Object.entries(artArchives).map(function([year, artList]) {
    return {
      name: year,
      artSum: artList?.length || 0,
      link: `/archives?year=${year}`
    };
  });
});

</script>

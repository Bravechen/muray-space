<template>
  <div class="code-group" @click="onBoxClick">
    <div class="switch-navs">
      <span class="tab-nav" v-for="tabNav of codeTabList" :key="tabNav.id"
        :class="{ 'active': currentTab === tabNav.name }" :data-tab="tabNav.name" :style="tabNav.style"
        data-type="selectTab">{{ tabNav.name }}</span>
    </div>

    <slot name="default"></slot>
  </div>
</template>

<style lang="scss">
.code-group {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0.625rem 0;

  box-sizing: border-box;
  border-radius: var(--theme-border-radius3);

  background-color: var(--theme-code-bg-color);

  .switch-navs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    background-color: var(--theme-code-bg-color3);
    box-shadow: 0px 6px 8px 3px rgb(0 0 0 / 31%);

    position: relative;
    z-index: 100;

    .tab-nav {
      display: inline-block;
      box-sizing: border-box;
      padding: 0.25rem 1rem;

      background-color: var(--theme-code-bg-color2);

      font-size: 0.875rem;
      color: var(--theme-code-font-color1);
      cursor: pointer;

      position: relative;

      &.active {
        background-color: var(--theme-code-bg-color1);
        color: var(--theme-color1);

        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 0.25rem;

          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 10;
          background-color: var(--tab-color-active);
        }
      }

      &:hover {
        background-color: var(--theme-code-bg-color1);
        color: var(--theme-color1);
      }
    }
  }
}
</style>

<script setup>
// import { useCodeGroupTab } from '../hooks/code';

// const { codeTabList } = useCodeGroupTab();
import { ref, useSlots, onMounted, provide } from 'vue';
import { str2unicodeFormate } from '../utils/tools';
import { tabColors } from '../constant/tabStyle';

const codeTabList = ref([]);
const currentTab = ref('');

provide('currentTab', currentTab);

onMounted(function () {
  const slots = useSlots();
  // console.log(slots.default().map(solt => solt.props));
  codeTabList.value = slots.default().map(function (slot, index) {
    return {
      id: str2unicodeFormate(slot.props.tab),
      name: slot.props.tab,
      index,
      style: {
        '--tab-color-active': tabColors[index % tabColors.length],
      }
    };
  });
  currentTab.value = codeTabList.value[0].name;
});

const uiEvents = {
  selectTab: function (data) {
    const { tab } = data;
    currentTab.value = tab;
  },
};

function onBoxClick(e) {
  const tar = e.target;
  let data, type;
  if (!tar || !(data = tar.dataset) || !(type = data.type)) {
    return;
  }

  const fn = uiEvents[type];
  if (typeof fn === 'function') {
    fn(data);
  }
}

</script>

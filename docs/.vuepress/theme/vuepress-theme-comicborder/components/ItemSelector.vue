<template>
  <div class="wrapper" v-show="!currentItem.id">
    <h4><slot name="title-txt"></slot></h4>
    <NSpace class="item-list">
      <NTag
        v-for="item of itemList"
        :key="item.id"
        :color="item.color">
        <span
          class="item-cnt"
          data-type="selectItem"
          :data-item-id="item.id">{{ item.name }} 共 {{ item.artSum }}篇</span>
      </NTag>
    </NSpace>
  </div>
  <h3 v-if="!!currentItem.id" class="current-item">
    <span class="current-item-name">{{ title }}&nbsp;&nbsp;<em>{{ currentItem.name }}</em>&nbsp;&nbsp;下的文章:</span>
    <n-switch class="toggle-items" size="large" @update:value="onSwitchItem" :default-value="true" :rail-style="railStyle">
      <template #checked-icon>
        <span class="toggle-icon"></span>
      </template>
      <template #unchecked-icon>
        <span class="toggle-icon"></span>
      </template>
      <template #checked><span class="checked-txt">换一个{{ title }}</span></template>
      <template #unchecked><span class="unchecked-txt">预备...</span></template>
    </n-switch>
  </h3>
</template>

<style lang="scss">
.wrapper {
  h4 {
    margin-bottom: 0.625rem;
    font-size: 1.125rem;

  }

  .item-list {
    width: 100%;
    margin-bottom: 1.25rem;

    .item-cnt {
      cursor: pointer;
    }
  }
}

.current-item {
  display: flex;
  align-items: center;
  width: 100%;

  .current-item-name {
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

  .toggle-items {
    &.n-switch {
      .n-switch__rail {
        box-sizing: border-box;
        border: var(--theme-border1);

        .n-switch__button {
          border: var(--theme-border1);
          top: 50%;
          transform: translateY(-50%);
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
      font-size: 0.875rem;
    }

    .unchecked-txt {
      font-weight: normal;
      color: var(--theme-color2);
      font-size: 0.875rem;
    }
  }
}
</style>

<script setup>


const props = defineProps({
  currentItem: {
    type: Object,
    default() {
      return {};
    }
  },
  itemList: {
    type: Array,
    default() {
      return [];
    }
  },
  title: {
    type: String,
    default: '项'
  }
});

const emits = defineEmits(['switch:changed']);

function onSwitchItem(value) {
  emits('switch:changed', value);
}

// 开关的自定义样式
const railStyle = function ({ focused, checked }) {
  const style = {
    // '--n-rail-height': '1.875rem',
    '--n-offset': 'calc((24px - 22px) / 2)'
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
</script>

<template>
  <div class="wrapper" v-show="!currentTag.id">
    <h4>打来打去，打标签：</h4>
    <NSpace class="tag-list">
      <NTag v-for="tag of tagList" :key="tag.id" :color="tag.color"><span class="tag-cnt" data-type="selectTag"
          :data-tag-id="tag.id">{{ tag.name }} 共 {{ tag.artSum }}篇</span></NTag>
    </NSpace>
  </div>
  <h3 v-if="!!currentTag.id" class="current-tag">
    <span class="current-tag-name">标签&nbsp;&nbsp;<em>{{ currentTag.name }}</em>&nbsp;&nbsp;下的文章:</span>
    <n-switch class="toggle-tags" size="large" @update:value="onSwitchTag" :default-value="true" :rail-style="railStyle">
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
</template>

<style lang="scss">
.wrapper {
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
</style>

<script setup>


const props = defineProps({
  currentTag: {
    type: Object,
    default() {
      return {};
    }
  },
  tagList: {
    type: Array,
    default() {
      return [];
    }
  }
});

const emits = defineEmits(['switch:changed']);

function onSwitchTag(value) {
  emits('switch:changed', value);
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
</script>

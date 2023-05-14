import { reactive, computed } from "vue";

/**
 * 添加/获取代码tab
 * @returns
 */
export function useCodeGroupTab() {
  const codeTabs = reactive([]);
  const codeTabIds = [];

  function addCodeTab(tab) {
    if (!tab || !tab.id || codeTabIds.indexOf(tab.id) >= 0) {
      return;
    }

    codeTabs.push(tab);
    codeTabIds.push(tab.id);
  }

  const codeTabList = computed(function() {
    return codeTabs;
  });

  return { codeTabList, addCodeTab };
}

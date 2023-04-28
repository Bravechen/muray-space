import { defineClientConfig } from '@vuepress/client';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import AboutLayout from './layouts/AboutLayout.vue';
import ArchivesLayout from './layouts/ArchivesLayout.vue';
import CategoriesLayout from './layouts/CategoriesLayout.vue';
import HomeLayout from './layouts/HomeLayout.vue';
import ArticlesLayout from './layouts/ArticlesLayout.vue';
import ArticlePageLayout from './layouts/ArticlePageLayout.vue';

import './styles/index.scss';
import './styles/palette.scss';
//============================================================
/**
 * 添加路由钩子
 * @param {*} param0
 */
function addRouterHooks({ app, router, siteData }) {
  router.beforeEach((to, from) => {
    console.log('before navigation, to:', to, '<------>', 'from:', from);
  });

  router.afterEach((to, from) => {
    console.log('after navigation, to:', to, '<------>', 'from:', from);
  });
}
//============================================================
/*
enhance 函数既可以是同步的，也可以是异步的。它接收一个 Context 参数，包含以下属性：

app 是由 createApp 创建的 Vue 应用实例。
- router 是由 createRouter 创建的路由实例。
- siteData 是一个根据用户配置生成的 Ref 对象，包含 base, lang, title, description, head 和 locales。
- enhance 函数会在客户端应用创建后被调用，你可以对 Vue 应用添加各种能力。
*/

//============================================================
export default defineClientConfig({
  enhance(ctx) {
    console.log('siteData:', ctx.siteData);

    addRouterHooks(ctx);
  },
  // setup 函数会在客户端 Vue 应用的 setup Hook 中被调用。
  // 你可以把 setup 函数当作根组件的 setup Hook 中的一部分。
  setup() {},
  layouts: {
    Layout,
    NotFound,
    ArticlesLayout,
    AboutLayout,
    ArchivesLayout,
    CategoriesLayout,
    HomeLayout,
    ArticlePageLayout,
  },
  rootComponents: [],
})

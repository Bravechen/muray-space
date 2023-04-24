import { defineClientConfig } from '@vuepress/client';

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {
      // // 获取当前的路由位置
      // const route = useRoute()
      // // 或者 vue-router 实例
      // const router = useRouter()
      // // 供给一个值，可以被布局、页面和其他组件注入
      // const count = ref(0)
      // provide('count', count)
  },

  // 配置项用于设置布局组件。你在此处注册布局后，用户就可以通过 layout frontmatter 来使用它们。
  // layouts: {},

  //放置一些全局的 UI 组件，比如全局弹窗等：
  rootComponents: [],
});

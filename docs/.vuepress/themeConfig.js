import { defaultTheme } from 'vuepress';

export default defaultTheme({
  //-------------------- base config --------------------
  logo: '/assets/avatar2.png',
  repo: 'https://github.com/Bravechen',
  // repoLabel: '',
  lastUpdated: true,
  lastUpdatedText: '上次更新',
  //-------------------- navigation config --------------------
  home: '/',
  navbar: [
    {
      text: '首页',
      link: '/'
    },
    {
      text: '文章',
      link: '/articles/'
    },
    {
      text: '归档',
      link: '/archives/'
    },
    {
      text: '关于我',
      link: '/about/'
    }
  ],
  //-------------------- sidebar config --------------------
  // sidebar: {

  // },
  // sidebarDepth: 2,
  //-------------------- page config --------------------
  editLink: false,
  editLinkText: '',
  editLinkPattern: '',
  docsRepo: '',
  docsBranch: '',
  docsDir: '',
  //-------------------- contributors config --------------------
  contributors: false,
  contributorsText: '',
  //-------------------- article config --------------------
  tip: '小提示',
  warning: '注意',
  danger: '警告',
  //-------------------- 404 config --------------------
  notFound: ['怅然若失，页面不见了', '你来到了没有知识的荒原', '你来到了没有网络的荒原', '你来到了没有灵感的世界'],
  backToHome: '首页传送门',
  //-------------------- aria config --------------------
  openInNewWindow: '在新窗口打开',
  toggleColorMode: '深色模式',
  toggleSidebar: '切换侧边栏',
  //-------------------- theme config --------------------
  themePlugins: {
    activeHeaderLinks: true, // 是否启用 @vuepress/plugin-active-header-links 。
    backToTop: true, // 是否启用 @vuepress/plugin-back-to-top 。
    // container: [], // 是否启用由 @vuepress/plugin-container 支持的自定义容器。
    externalLinkIcon: true, // 是否启用 @vuepress/plugin-external-link-icon 。
    git: true, // 是否启用 @vuepress/plugin-git 。
    mediumZoom: true, // 是否启用 @vuepress/plugin-medium-zoom 。
    nprogress: true, // 是否启用 @vuepress/plugin-nprogress 。
  }
});

import { defineUserConfig, viteBundler } from 'vuepress';
import theme from './themeConfig';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { searchPlugin } from '@vuepress/plugin-search';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export default defineUserConfig({
  //-------------------- base config --------------------
  root: process.cwd(),
  lang: 'zh-CN',
  title: 'Muray\'s space',
  description: '这是我的个人博客站点',
  // head: [['link', { rel: 'icon', href: '/images/logo.png' }]],
  // theme: 'default',
  // bundler: 'vuepress',
  debug: true,
  pagePatterns: ['**/*.md', '!README.md', '!.vuepress', '!node_modules'],
  // permalinkPattern: ':year',

  //-------------------- dev config --------------------
  host: '127.0.0.1',
  port: 18002,
  // open: true,
  // templateDev: '@vuepress/client/templates/dev.html',

  //build config
  shouldPreload: true,
  shouldPrefetch: true,
  // templateBuild: '@vuepress/client/templates/build.html',

  //-------------------- markdown config --------------------
  markdown: {},
  //-------------------- plugins --------------------
  plugins: [
    searchPlugin({
      // 配置项
    }),
  ],
  //-------------------- theme --------------------
  theme: theme,
  //-------------------- bundler --------------------
  bundler: viteBundler({
    viteOptions: {
      build: {
        target: 'modules',
      },
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ['import']
          }
        }
      },
      plugins: [
        AutoImport({
          imports: [
            'vue',
            {
              'naive-ui': [
                // 'useDialog',
                // 'useMessage',
                // 'useNotification',
                // 'useLoadingBar'
              ]
            }
          ]
        }),
        Components({
          resolvers: [NaiveUiResolver()]
        })
      ],
    },
  })
});

import chalk from 'chalk';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { filterNavPagesIndexLayout, filterArtPagesLayout, combineAndSetPagesData } from './pages/pageTools.js';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';

import { tipContainerPlugins, specContainerPlugins, codeContainerPlugins } from './plugins/containerPlugins.js';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { supperls } from './plugins/languagePlugin.js';
import { lineNumberPlugin } from './plugins/lineNumberPlugin/index.js';
import { highlightLinePlugin } from './plugins/hightlightLinePlugin/index.js';
//============================================================
// 插件目录
const __dirname = dirname(fileURLToPath(import.meta.url));

//============================================================
function combineSiteData(siteData = {}, themeConfigs = {}) {
  return {
    ...siteData,
    articlesData: {
      artPerPageMax: themeConfigs.articles?.perPage || 10,
      articles: {}, // 所有文章的数据,key为文章id, value为文章数据
      articleList: [], // 不分页的文章id列表
      articlePages: [[]], // 分页的文章id列表
      artListByYear: {}, // 按年份归档的文章id列表
      artTags: {}, // 所有标签, key为标签id, value为标签数据
      artListByTag: {}, // 按标签归档的文章id列表
      artCategories: {}, // 所有分类, key为分类id, value为分类数据
      artListByCategory: {}, // 按分类归档的文章id列表
    },
    theme: {
      logo: themeConfigs.logo || '',
      navs: [...(themeConfigs.navbar || [])],
      socials: [...(themeConfigs.sidebar?.socials || [])],
      subTitle: themeConfigs.sidebar?.subTitle || '',
      err404: {
        notFound: themeConfigs.notFound || ['万分抱歉，您找的这一页我没还写...'],
        backToHome: themeConfigs.backToHome || '返回首页',
        notFoundBg: themeConfigs.notFoundBg || '',
      }
    },
  };
}
//============================================================
export const comicborderTheme = (clientThemeOpt, ...args) => {
  // debugger;
  // console.log('用户主题配置:', clientThemeOpt);
  // options是用户配置的主题选项配置
  // app包含了node api
  return (app) => {
    // debugger;
    const { siteData, options } = app;
    // console.log(
    //   'siteData:', siteData,'\n',
    //   'options:', options,'\n',
    //   'app.dir:', '\n',
    //   'cache:', app.dir.cache(),'\n',
    //   'source:', app.dir.source(),'\n',
    //   'temp:', app.dir.temp(),'\n',
    // );
    app.siteData = combineSiteData(siteData, clientThemeOpt);
    // 返回一个主题对象
    return {
      name: 'vuepress-theme-comicborder',

      // 主题的客户端配置文件的路径
      clientConfigFile: path.resolve(__dirname, 'client.js'),

      // 设置自定义 dev / build 模板
      templateBuild: path.resolve(__dirname, 'templates/build.html'),
      templateDev: path.resolve(__dirname, 'templates/dev.html'),

      // 使用插件
      plugins: [
        backToTopPlugin(),
        //-------------------- tip container --------------------
        ...tipContainerPlugins,
        //-------------------- spec container --------------------
        ...specContainerPlugins,
        //-------------------- code container --------------------
        ...codeContainerPlugins,
        registerComponentsPlugin({
          components: {
            'codegroup': path.resolve(__dirname, './global-components/CodeGroup.vue'),
            'codegroupitem': path.resolve(__dirname, './global-components/CodeGroupItem.vue'),
            'Badge': path.resolve(__dirname, './global-components/Badge.vue'),
          }
        }),
        //-------------------- prismjs --------------------
        prismjsPlugin({
          // 配置项
          preloadLanguages: [
            ...supperls
          ],
        }),
        //-------------------- line number --------------------
        lineNumberPlugin({
          // 配置项
        }),
        highlightLinePlugin({
          // 配置项
        })
      ],
//-------------------- dev cycle --------------------
      extendsPageOptions(pageOpt, app) {
        // debugger;
        // console.log(pageOpt);
        filterArtPagesLayout(pageOpt, app.dir.source('articles/'));
      },
      extendsPage(page, app) {
        // debugger;
        // console.log(page);
        // filterNavPagesIndexLayout(page);
        let obj = combineAndSetPagesData(page, app);
        page = obj.page;
        app = obj.app;
      },
//-------------------- life cycle --------------------
      // 其他的插件 API 也都可用
      // 初始化，主题，插件和页面已经加载
      onInitialized(app) {
        // debugger;

      },
      // 文件准备完毕，用户client配置也准备好了
      onPrepared(app) {
        // debugger;
        // console.log('pages:', app.pages);

      },
      // dev服务器启动，监听文件修改
      onWatched(app, watchers, restart) {
        // debugger;
        console.log(chalk.green('dev server is listening file change'));
      },
      // pro阶段，完成静态文件生成后调用
      onGenerated(app) {
        // debugger;
        console.log(chalk.bgGreen('Generated pages completed!'));
      },
    };
  };
};
//============================================================


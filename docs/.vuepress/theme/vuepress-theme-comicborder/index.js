import { chalk } from '@vuepress/utils';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { filterNavPagesIndexLayout, filterArtPagesLayout } from './pages/pageTools.js';
//============================================================
// 插件目录
const __dirname = dirname(fileURLToPath(import.meta.url));

//============================================================
function combineSiteData(siteData = {}, themeConfigs = {}) {
  return {
    ...siteData,
    theme: {
      logo: themeConfigs.logo || '',
      navs: [...(themeConfigs.navbar || [])],
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
        filterNavPagesIndexLayout(page);
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
        // filterNavPagesIndex(app);
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


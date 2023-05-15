// docs/.vuepress/config.js
import { defineUserConfig, viteBundler } from "vuepress";

// docs/.vuepress/themeConfig.js
import { defaultTheme } from "vuepress";

// docs/.vuepress/theme/vuepress-theme-comicborder/index.js
import chalk from "chalk";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// docs/.vuepress/theme/vuepress-theme-comicborder/utils/tools.js
function str2unicodeFormate(str) {
  let ret = [];
  let gap = "$_$";
  for (let i = 0, len = str.length; i < len; i++) {
    let ustr = "";
    let code = str.charCodeAt(i);
    let code16 = code.toString(16);
    if (code < 15) {
      ustr = `000${code16}`;
    } else if (code < 255) {
      ustr = `00${code16}`;
    } else if (code < 4095) {
      ustr = `0${code16}`;
    } else {
      ustr = `${code16}`;
    }
    ret.push(ustr);
  }
  return ret.join(gap);
}

// docs/.vuepress/theme/vuepress-theme-comicborder/pages/pageTools.js
var NAV_PAGES_INDEX_LAYOUTS = {
  home: "HomeLayout",
  about: "AboutLayout",
  articles: "ArticlesLayout",
  archives: "ArchivesLayout",
  categories: "CategoriesLayout",
  articlePage: "ArticlePageLayout",
  tags: "TagsLayout",
  defaultLayout: "Layout"
};
function setPageWidget({ page, app }) {
  if (!page || !page.frontmatter) {
    return { page, app };
  }
  page.frontmatter.widget = {
    calendar: true,
    tags: true,
    category: true,
    archives: true,
    ...page.frontmatter.widget || {}
  };
  return { page, app };
}
function resetArticleIndex({ page, app }) {
  if (!page || !page.frontmatter || !page.frontmatter.articlePage) {
    return { page, app };
  }
  if (page.frontmatter.articles && page.frontmatter.articlePage) {
    page.frontmatter.articlePage = false;
    return { page, app };
  }
  return { page, app };
}
function setArticlePageMatter({ page, app }) {
  if (!page || !page.frontmatter) {
    return { page, app };
  }
  if (page.frontmatter.avatar === void 0) {
    page.frontmatter.avatar = true;
  }
  const widget = page.frontmatter.widget || {};
  page.frontmatter.widget = {
    calendar: true,
    tags: true,
    category: true,
    archives: true,
    ...widget
  };
  return { page, app };
}
function combineArticle({ page, app }) {
  if (!page || !page.frontmatter || !page.frontmatter.articlePage) {
    return { page, app };
  }
  const article = {
    path: page.path,
    date: page.date || page.frontmatter.updateDate,
    slug: page.slug,
    title: page.title,
    desc: page.frontmatter.description,
    updateDate: page.frontmatter.updateDate,
    id: page.key,
    coverImg: page.frontmatter.coverImg || ""
  };
  return { page, app, article };
}
function combineArtList({ page, app, article }) {
  if (!page || !article) {
    return { page, app, article };
  }
  const perPageMax = app.siteData.articlesData.artPerPageMax;
  const articlesData = app.siteData.articlesData;
  articlesData.articles[article.id] = article;
  articlesData.articleList.push(article.id);
  let pageslen = articlesData.articlePages.length;
  if (articlesData.articlePages[pageslen - 1].length < perPageMax) {
    articlesData.articlePages[pageslen - 1].push(article.id);
  } else {
    const list = [];
    articlesData.articlePages[pageslen] = list;
    list.push(article.id);
  }
  return { page, app, article };
}
function combineArticleAchives({ page, app, article }) {
  if (!page || !article) {
    return { page, app, article };
  }
  const articlesData = app.siteData.articlesData;
  const date = new Date(article.date);
  const year = date.getFullYear();
  if (!articlesData.artListByYear[year]) {
    articlesData.artListByYear[year] = [];
  }
  articlesData.artListByYear[year].push(article.id);
  return { page, app, article };
}
function combineArticleTags({ page, app, article }) {
  if (!page || !article) {
    return { page, app, article };
  }
  const articlesData = app.siteData.articlesData;
  const tags = page.frontmatter.tags || [];
  for (let i = 0, len = tags.length; i < len; i++) {
    const tag = tags[i];
    const tagId = str2unicodeFormate(tag);
    if (!articlesData.artTags[tagId]) {
      articlesData.artTags[tagId] = {
        name: tag,
        id: tagId,
        link: `/tags?tag=${encodeURIComponent(tagId)}`
      };
      articlesData.artListByTag[tagId] = [];
    }
    articlesData.artListByTag[tagId].push(article.id);
  }
  return { page, app, article };
}
function combineArticleCategories({ page, app, article }) {
  if (!page || !article) {
    return { page, app };
  }
  const articlesData = app.siteData.articlesData;
  const categoryName = page.frontmatter.category || "\u672A\u5206\u7C7B";
  const categoryId = str2unicodeFormate(categoryName);
  let category = articlesData.artCategories[categoryId];
  if (!category) {
    category = {
      name: categoryName,
      id: categoryId,
      link: `/categories?category=${encodeURIComponent(categoryId)}`
    };
    articlesData.artCategories[categoryId] = category;
    articlesData.artListByCategory[categoryId] = [];
  }
  articlesData.artListByCategory[categoryId].push(article.id);
  return { page, app, article };
}
function filterNavPagesIndexLayout({ page, app }) {
  if (!page || !page.frontmatter || page.frontmatter.articlePage) {
    return { page, app };
  }
  for (let key of Object.keys(NAV_PAGES_INDEX_LAYOUTS)) {
    if (page.frontmatter && page.frontmatter[key]) {
      page.frontmatter.layout = NAV_PAGES_INDEX_LAYOUTS[key] || NAV_PAGES_INDEX_LAYOUTS.defaultLayout;
      break;
    }
  }
  return { page, app };
}
function combineAndSetPagesData(page, app) {
  return [
    resetArticleIndex,
    setArticlePageMatter,
    combineArticle,
    combineArtList,
    combineArticleAchives,
    combineArticleTags,
    combineArticleCategories,
    filterNavPagesIndexLayout,
    setPageWidget
  ].reduce(
    function(prev, fn) {
      return fn(prev);
    },
    { page, app }
  );
}
function filterArtPagesLayout(pageOpt, artDir) {
  var _a, _b;
  if (((_a = pageOpt.filePath) == null ? void 0 : _a.startsWith(artDir)) && !((_b = pageOpt.frontmatter) == null ? void 0 : _b.articles)) {
    pageOpt.frontmatter = pageOpt.frontmatter ?? {};
    pageOpt.frontmatter.articlePage = true;
    pageOpt.frontmatter.layout = NAV_PAGES_INDEX_LAYOUTS["articlePage"];
  }
}

// docs/.vuepress/theme/vuepress-theme-comicborder/index.js
import { backToTopPlugin } from "@vuepress/plugin-back-to-top";

// docs/.vuepress/theme/vuepress-theme-comicborder/plugins/containerPlugins.js
import { containerPlugin } from "@vuepress/plugin-container";
function infoTip() {
  return [
    containerPlugin({
      // 配置项
      type: "tip",
      defaultTitle: {
        "/": "\u63D0\u793A",
        "/en/": "TIP"
      }
    }),
    containerPlugin({
      // 配置项
      type: "info",
      defaultTitle: {
        "/": "\u63D0\u793A",
        "/en/": "TIP"
      }
    })
  ];
}
function warningTip() {
  return [
    containerPlugin({
      // 配置项
      type: "warning",
      defaultTitle: {
        "/": "\u6CE8\u610F",
        "/en/": "WARNING"
      }
    })
  ];
}
function dangerTip() {
  return [
    containerPlugin({
      // 配置项
      type: "danger",
      defaultTitle: {
        "/": "\u8B66\u544A",
        "/en/": "WARNING"
      }
    })
  ];
}
var tipContainerPlugins = [
  ...infoTip(),
  ...warningTip(),
  ...dangerTip()
];
function detailsContainer() {
  return [
    containerPlugin({
      // 配置项
      type: "details",
      before: (info) => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ""}
`,
      after: () => "</details>\n",
      defaultTitle: {
        "/": "\u8BE6\u7EC6\u4FE1\u606F",
        "/en/": "DETAILS"
      }
    })
  ];
}
function centerContainer() {
  return [
    containerPlugin({
      type: "center",
      before: (info) => `<div class="center-container">`,
      after: () => "</div>",
      defaultTitle: {
        "/": "\u5C45\u4E2D",
        "/en/": "CENTER"
      }
    })
  ];
}
function theoremContainer() {
  return [
    containerPlugin({
      type: "theorem",
      before: (info) => `<div class="custom-block theorem"><p class="title">${info}</p>`,
      after: () => "</div>"
    })
  ];
}
function noteContainer() {
  return [
    containerPlugin({
      type: "note",
      defaultTitle: {
        "/": "\u7B14\u8BB0",
        "/en/": "NOTE"
      }
    })
  ];
}
function rightContainer() {
  return [
    containerPlugin({
      type: "right"
    })
  ];
}
var specContainerPlugins = [
  ...detailsContainer(),
  ...centerContainer(),
  ...theoremContainer(),
  ...noteContainer(),
  ...rightContainer()
];
var codeContainerPlugins = [
  containerPlugin({
    type: "code-group",
    before: (info) => `<codegroup>${info}`,
    after: () => "</codegroup>",
    defaultTitle: {
      "/": "",
      "/en/": ""
    }
  }),
  containerPlugin({
    type: "code-group-item",
    before: (info) => {
      return `<codegroupitem tab="${info}" >`;
    },
    after: () => "</codegroupitem>",
    defaultTitle: {
      "/": "",
      "/en/": ""
    }
  })
];

// docs/.vuepress/theme/vuepress-theme-comicborder/index.js
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { prismjsPlugin } from "@vuepress/plugin-prismjs";

// docs/.vuepress/theme/vuepress-theme-comicborder/plugins/languagePlugin.js
var supperls = [
  "html",
  "xml",
  "svg",
  "mathml",
  "css",
  "less",
  "scss",
  "sass",
  "javascript",
  "js",
  "typescript",
  "ts",
  "actionscript",
  "bash",
  "sh",
  "shell",
  "c",
  "cpp",
  "csharp",
  "cs",
  "dotnet",
  "dart",
  "docker",
  "dockerfile",
  "editorconfig",
  "ejs",
  "elm",
  "excel-formula",
  "xlsx",
  "xls",
  "ftl",
  "gml",
  "gamemakerlanguage",
  "git",
  "glsl",
  "go",
  "go-module",
  "go-mod",
  "graphql",
  "handlebars",
  "hbs",
  "mustache",
  "haxe",
  "hlsl",
  "http",
  "ignore",
  "gitignore",
  "npmignore",
  "java",
  "javadoc",
  "jsdoc",
  "js-extras",
  "json",
  "julia",
  "latex",
  "tex",
  "context",
  "lua",
  "markdown",
  "md",
  "mongodb",
  "nginx",
  "python",
  "jsx",
  "tsx",
  "regex",
  "ruby",
  "rb",
  "rust",
  "sql",
  "stylus",
  "swift",
  "wasm",
  "wgsl",
  "zig",
  "yaml",
  "yml",
  "toml"
];

// docs/.vuepress/theme/vuepress-theme-comicborder/plugins/lineNumberPlugin/index.js
function combineLineNum(md) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const wrapperReg = /<div class="line-numbers"[\w\s\W]+(<\/div>)(?=<\/div>)/g;
    const lineReg = /<div class="line-number"[\w\s\W]*>(<\/div>)(?=<\/div>)/g;
    const rawCode = fence(...args);
    if (!rawCode.match(wrapperReg)) {
      return;
    }
    const wrapperCode = rawCode.match(wrapperReg)[0];
    const list = wrapperCode.match(lineReg)[0].split("</div>");
    const lineNums = list.slice(0, list.length - 1).map((line, index) => {
      return `${line}${index + 1}</div>`;
    }).join("");
    const lineNumWrapper = wrapperCode.replace(lineReg, lineNums);
    const finalCode = rawCode.replace(wrapperReg, lineNumWrapper);
    return finalCode;
  };
}
var lineNumberPlugin = function(options) {
  return function(app) {
    return {
      name: "vuepress-plugin-comicborder-lineNumber",
      extendsMarkdown(md, app2) {
        combineLineNum(md);
      },
      extendsPage(page, app2) {
      }
    };
  };
};

// docs/.vuepress/theme/vuepress-theme-comicborder/plugins/hightlightLinePlugin/index.js
var RE = /(?<=\{)[\d,\s-]+(?=\})/;
var wrapperRE = /^<pre .*?><code>/;
function addCodeLineHighlight(md) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options] = args;
    if (idx !== 44) {
      return fence(...args);
    }
    debugger;
    const originCode = fence(...args);
    const token = tokens[idx];
    if (!token.lineNumbers) {
      const rawInfo = token.info;
      if (!rawInfo || !RE.test(rawInfo)) {
        return fence(...args);
      }
      const langName = rawInfo.replace(RE, "").trim().replace(/({|})/g, "");
      token.info = langName;
      token.lineNumbers = RE.exec(rawInfo)[0].split(",").map((v) => v.split("-").map((v2) => parseInt(v2, 10)));
    }
    const code = options.highlight ? options.highlight(token.content, token.info) : token.content;
    const rawCode = code.replace(wrapperRE, "");
    const highlightLinesCode = rawCode.split("\n").map((split, index) => {
      const lineNumber = index + 1;
      const inRange = token.lineNumbers.some(([start, end]) => {
        if (start && end) {
          return lineNumber >= start && lineNumber <= end;
        }
        return lineNumber === start;
      });
      if (inRange) {
        return `<div class="highlighted">&nbsp;</div>`;
      }
      return "<br>";
    }).join("");
    const highlightLinesWrapperCode = `<div class="highlight-lines">${highlightLinesCode}</div>`;
    const finalCode = originCode.replace(/\<code\>[\s\S]*\<\/code\>/, `${highlightLinesWrapperCode}<code>${code}</code>`);
    return finalCode;
  };
}
var highlightLinePlugin = function(options) {
  return function(app) {
    return {
      name: "vuepress-plugin-comicborder-highlightLine",
      extendsMarkdown(md, app2) {
        addCodeLineHighlight(md);
      },
      extendsPage(page, app2) {
      }
    };
  };
};

// docs/.vuepress/theme/vuepress-theme-comicborder/index.js
import { gitPlugin } from "@vuepress/plugin-git";
import { activeHeaderLinksPlugin } from "@vuepress/plugin-active-header-links";
import mathjaxPlugin from "vuepress-plugin-mathjax";
var __vite_injected_original_import_meta_url = "file:///Users/muray/workspace/githubWP/muray-space/docs/.vuepress/theme/vuepress-theme-comicborder/index.js";
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
function combineSiteData(siteData = {}, themeConfigs = {}) {
  var _a, _b, _c;
  return {
    ...siteData,
    articlesData: {
      artPerPageMax: ((_a = themeConfigs.articles) == null ? void 0 : _a.perPage) || 10,
      articles: {},
      // 所有文章的数据,key为文章id, value为文章数据
      articleList: [],
      // 不分页的文章id列表
      articlePages: [[]],
      // 分页的文章id列表
      artListByYear: {},
      // 按年份归档的文章id列表
      artTags: {},
      // 所有标签, key为标签id, value为标签数据
      artListByTag: {},
      // 按标签归档的文章id列表
      artCategories: {},
      // 所有分类, key为分类id, value为分类数据
      artListByCategory: {}
      // 按分类归档的文章id列表
    },
    theme: {
      logo: themeConfigs.logo || "",
      navs: [...themeConfigs.navbar || []],
      socials: [...((_b = themeConfigs.sidebar) == null ? void 0 : _b.socials) || []],
      subTitle: ((_c = themeConfigs.sidebar) == null ? void 0 : _c.subTitle) || "",
      err404: {
        notFound: themeConfigs.notFound || ["\u4E07\u5206\u62B1\u6B49\uFF0C\u60A8\u627E\u7684\u8FD9\u4E00\u9875\u6211\u6CA1\u8FD8\u5199..."],
        backToHome: themeConfigs.backToHome || "\u8FD4\u56DE\u9996\u9875",
        notFoundBg: themeConfigs.notFoundBg || ""
      }
    }
  };
}
var comicborderTheme = (clientThemeOpt, ...args) => {
  return (app) => {
    const { siteData, options } = app;
    app.siteData = combineSiteData(siteData, clientThemeOpt);
    return {
      name: "vuepress-theme-comicborder",
      // 主题的客户端配置文件的路径
      clientConfigFile: path.resolve(__dirname, "client.js"),
      // 设置自定义 dev / build 模板
      templateBuild: path.resolve(__dirname, "templates/build.html"),
      templateDev: path.resolve(__dirname, "templates/dev.html"),
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
            "codegroup": path.resolve(__dirname, "./global-components/CodeGroup.vue"),
            "codegroupitem": path.resolve(__dirname, "./global-components/CodeGroupItem.vue"),
            "Badge": path.resolve(__dirname, "./global-components/Badge.vue")
          }
        }),
        //-------------------- prismjs --------------------
        prismjsPlugin({
          // 配置项
          preloadLanguages: [
            ...supperls
          ]
        }),
        //-------------------- line number --------------------
        lineNumberPlugin({
          // 配置项
        }),
        highlightLinePlugin({
          // 配置项
        }),
        //-------------------- git --------------------
        gitPlugin({
          // 配置项
        }),
        //-------------------- active header links --------------------
        activeHeaderLinksPlugin({
          // 配置项
        }),
        //-------------------- mathjax --------------------
        mathjaxPlugin({})
      ],
      //-------------------- dev cycle --------------------
      extendsPageOptions(pageOpt, app2) {
        filterArtPagesLayout(pageOpt, app2.dir.source("articles/"));
      },
      extendsPage(page, app2) {
        let obj = combineAndSetPagesData(page, app2);
        page = obj.page;
        app2 = obj.app;
      },
      //-------------------- life cycle --------------------
      // 其他的插件 API 也都可用
      // 初始化，主题，插件和页面已经加载
      onInitialized(app2) {
      },
      // 文件准备完毕，用户client配置也准备好了
      onPrepared(app2) {
      },
      // dev服务器启动，监听文件修改
      onWatched(app2, watchers, restart) {
        console.log(chalk.green("dev server is listening file change"));
      },
      // pro阶段，完成静态文件生成后调用
      onGenerated(app2) {
        console.log(chalk.bgGreen("Generated pages completed!"));
      }
    };
  };
};

// docs/.vuepress/themeConfig.js
var themeConfig_default = comicborderTheme({
  //-------------------- base config --------------------
  logo: "/assets/avatar2.png",
  repo: "https://github.com/Bravechen",
  // repoLabel: '',
  lastUpdated: true,
  lastUpdatedText: "\u4E0A\u6B21\u66F4\u65B0",
  //-------------------- navigation config --------------------
  home: "/",
  navbar: [
    {
      text: "\u9996\u9875",
      link: "/",
      icon: "icon-home",
      name: "home"
    },
    {
      text: "\u5206\u7C7B",
      link: "/categories/",
      icon: "icon-category",
      name: "category"
    },
    {
      text: "\u5F52\u6863",
      link: "/archives/",
      icon: "icon-archive",
      name: "archives"
    },
    {
      text: "\u6807\u7B7E",
      link: "/tags/",
      icon: "icon-tags",
      name: "tags"
    },
    {
      text: "\u5173\u4E8E\u6211",
      link: "/about/",
      icon: "icon-about",
      name: "about"
    }
  ],
  //-------------------- sidebar config --------------------
  sidebar: {
    subTitle: "\u7EB5\u6709\u75BE\u98CE\u8D77\uFF0C\u4EBA\u751F\u4E0D\u8A00\u5F03",
    socials: [
      {
        icon: "github",
        title: "my github",
        link: "https://github.com/Bravechen"
      },
      {
        icon: "/assets/icons/gitee.svg",
        title: "\u7801\u4E91",
        link: "https://gitee.com/muray",
        iconSize: "1.375rem"
      },
      {
        icon: "Email",
        title: "muray_2018@163.com",
        link: "mailto:muray_2018@163.com"
      }
    ]
  },
  // sidebarDepth: 2,
  //-------------------- page config --------------------
  editLink: false,
  editLinkText: "",
  editLinkPattern: "",
  docsRepo: "",
  docsBranch: "",
  docsDir: "",
  //-------------------- articles config --------------------
  articles: {
    perPage: 10
    // 每页显示的文章数量
  },
  //-------------------- contributors config --------------------
  contributors: false,
  contributorsText: "",
  //-------------------- article content config --------------------
  tip: "\u5C0F\u63D0\u793A",
  warning: "\u6CE8\u610F",
  danger: "\u8B66\u544A",
  //-------------------- 404 config --------------------
  notFound: ["\u6005\u7136\u82E5\u5931\uFF0C\u9875\u9762\u4E0D\u89C1\u4E86", "\u4F60\u6765\u5230\u4E86\u6CA1\u6709\u77E5\u8BC6\u7684\u8352\u539F", "\u4F60\u6765\u5230\u4E86\u6CA1\u6709\u7F51\u7EDC\u7684\u8352\u539F", "\u4F60\u6765\u5230\u4E86\u6CA1\u6709\u7075\u611F\u7684\u4E16\u754C"],
  backToHome: "\u9996\u9875\u4F20\u9001\u95E8",
  notFoundBg: "/assets/404.png",
  //-------------------- aria config --------------------
  openInNewWindow: "\u5728\u65B0\u7A97\u53E3\u6253\u5F00",
  toggleColorMode: "\u6DF1\u8272\u6A21\u5F0F",
  toggleSidebar: "\u5207\u6362\u4FA7\u8FB9\u680F",
  //-------------------- theme config --------------------
  themePlugins: {
    activeHeaderLinks: true,
    // 是否启用 @vuepress/plugin-active-header-links 。
    backToTop: true,
    // 是否启用 @vuepress/plugin-back-to-top 。
    // container: [], // 是否启用由 @vuepress/plugin-container 支持的自定义容器。
    externalLinkIcon: true,
    // 是否启用 @vuepress/plugin-external-link-icon 。
    git: true,
    // 是否启用 @vuepress/plugin-git 。
    mediumZoom: true,
    // 是否启用 @vuepress/plugin-medium-zoom 。
    nprogress: true
    // 是否启用 @vuepress/plugin-nprogress 。
  }
});

// docs/.vuepress/config.js
import { mediumZoomPlugin } from "@vuepress/plugin-medium-zoom";
import { searchPlugin } from "@vuepress/plugin-search";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
var config_default = defineUserConfig({
  //-------------------- base config --------------------
  root: process.cwd(),
  lang: "zh-CN",
  title: "Muray's space",
  description: "\u8FD9\u662F\u6211\u7684\u4E2A\u4EBA\u535A\u5BA2\u7AD9\u70B9",
  // head: [['link', { rel: 'icon', href: '/images/logo.png' }]],
  // theme: 'default',
  // bundler: 'vuepress',
  debug: true,
  pagePatterns: ["**/*.md", "!README.md", "!.vuepress", "!node_modules"],
  // permalinkPattern: ':year',
  //-------------------- dev config --------------------
  host: "127.0.0.1",
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
    })
  ],
  //-------------------- theme --------------------
  theme: themeConfig_default,
  //-------------------- bundler --------------------
  bundler: viteBundler({
    viteOptions: {
      build: {
        target: "modules"
      },
      plugins: [
        AutoImport({
          imports: [
            "vue",
            {
              "naive-ui": [
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
      ]
    }
  })
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lQ29uZmlnLmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL2luZGV4LmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3V0aWxzL3Rvb2xzLmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BhZ2VzL3BhZ2VUb29scy5qcyIsICJkb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2NvbnRhaW5lclBsdWdpbnMuanMiLCAiZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9sYW5ndWFnZVBsdWdpbi5qcyIsICJkb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2xpbmVOdW1iZXJQbHVnaW4vaW5kZXguanMiLCAiZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9oaWdodGxpZ2h0TGluZVBsdWdpbi9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lVXNlckNvbmZpZywgdml0ZUJ1bmRsZXIgfSBmcm9tICd2dWVwcmVzcyc7XG5pbXBvcnQgdGhlbWUgZnJvbSAnLi90aGVtZUNvbmZpZyc7XG5pbXBvcnQgeyBtZWRpdW1ab29tUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1tZWRpdW0tem9vbSc7XG5pbXBvcnQgeyBzZWFyY2hQbHVnaW4gfSBmcm9tICdAdnVlcHJlc3MvcGx1Z2luLXNlYXJjaCc7XG5cbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVVc2VyQ29uZmlnKHtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBiYXNlIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICByb290OiBwcm9jZXNzLmN3ZCgpLFxuICBsYW5nOiAnemgtQ04nLFxuICB0aXRsZTogJ011cmF5XFwncyBzcGFjZScsXG4gIGRlc2NyaXB0aW9uOiAnXHU4RkQ5XHU2NjJGXHU2MjExXHU3Njg0XHU0RTJBXHU0RUJBXHU1MzVBXHU1QkEyXHU3QUQ5XHU3MEI5JyxcbiAgLy8gaGVhZDogW1snbGluaycsIHsgcmVsOiAnaWNvbicsIGhyZWY6ICcvaW1hZ2VzL2xvZ28ucG5nJyB9XV0sXG4gIC8vIHRoZW1lOiAnZGVmYXVsdCcsXG4gIC8vIGJ1bmRsZXI6ICd2dWVwcmVzcycsXG4gIGRlYnVnOiB0cnVlLFxuICBwYWdlUGF0dGVybnM6IFsnKiovKi5tZCcsICchUkVBRE1FLm1kJywgJyEudnVlcHJlc3MnLCAnIW5vZGVfbW9kdWxlcyddLFxuICAvLyBwZXJtYWxpbmtQYXR0ZXJuOiAnOnllYXInLFxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGV2IGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgcG9ydDogMTgwMDIsXG4gIC8vIG9wZW46IHRydWUsXG4gIC8vIHRlbXBsYXRlRGV2OiAnQHZ1ZXByZXNzL2NsaWVudC90ZW1wbGF0ZXMvZGV2Lmh0bWwnLFxuXG4gIC8vYnVpbGQgY29uZmlnXG4gIHNob3VsZFByZWxvYWQ6IHRydWUsXG4gIHNob3VsZFByZWZldGNoOiB0cnVlLFxuICAvLyB0ZW1wbGF0ZUJ1aWxkOiAnQHZ1ZXByZXNzL2NsaWVudC90ZW1wbGF0ZXMvYnVpbGQuaHRtbCcsXG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBtYXJrZG93biBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbWFya2Rvd246IHt9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIHBsdWdpbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgcGx1Z2luczogW1xuICAgIHNlYXJjaFBsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICB9KSxcbiAgXSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSB0aGVtZSAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB0aGVtZTogdGhlbWUsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYnVuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBidW5kbGVyOiB2aXRlQnVuZGxlcih7XG4gICAgdml0ZU9wdGlvbnM6IHtcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIHRhcmdldDogJ21vZHVsZXMnLFxuICAgICAgfSxcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgICAgJ3Z1ZScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICduYWl2ZS11aSc6IFtcbiAgICAgICAgICAgICAgICAvLyAndXNlRGlhbG9nJyxcbiAgICAgICAgICAgICAgICAvLyAndXNlTWVzc2FnZScsXG4gICAgICAgICAgICAgICAgLy8gJ3VzZU5vdGlmaWNhdGlvbicsXG4gICAgICAgICAgICAgICAgLy8gJ3VzZUxvYWRpbmdCYXInXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgICByZXNvbHZlcnM6IFtOYWl2ZVVpUmVzb2x2ZXIoKV1cbiAgICAgICAgfSlcbiAgICAgIF0sXG4gICAgfSxcbiAgfSlcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lQ29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWVDb25maWcuanNcIjtpbXBvcnQgeyBkZWZhdWx0VGhlbWUgfSBmcm9tICd2dWVwcmVzcyc7XG5pbXBvcnQgeyBjb21pY2JvcmRlclRoZW1lIH0gZnJvbSAnLi90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9pbmRleC5qcyc7XG5cblxuLy8gZXhwb3J0IGRlZmF1bHQgZGVmYXVsdFRoZW1lKHtcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBiYXNlIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICBsb2dvOiAnL2Fzc2V0cy9hdmF0YXIyLnBuZycsXG4vLyAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vQnJhdmVjaGVuJyxcbi8vICAgLy8gcmVwb0xhYmVsOiAnJyxcbi8vICAgbGFzdFVwZGF0ZWQ6IHRydWUsXG4vLyAgIGxhc3RVcGRhdGVkVGV4dDogJ1x1NEUwQVx1NkIyMVx1NjZGNFx1NjVCMCcsXG4vLyAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gbmF2aWdhdGlvbiBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vICAgaG9tZTogJy8nLFxuLy8gICBuYXZiYXI6IFtcbi8vICAgICB7XG4vLyAgICAgICB0ZXh0OiAnXHU5OTk2XHU5ODc1Jyxcbi8vICAgICAgIGxpbms6ICcvJ1xuLy8gICAgIH0sXG4vLyAgICAge1xuLy8gICAgICAgdGV4dDogJ1x1NjU4N1x1N0FFMCcsXG4vLyAgICAgICBsaW5rOiAnL2FydGljbGVzLydcbi8vICAgICB9LFxuLy8gICAgIHtcbi8vICAgICAgIHRleHQ6ICdcdTVGNTJcdTY4NjMnLFxuLy8gICAgICAgbGluazogJy9hcmNoaXZlcy8nXG4vLyAgICAgfSxcbi8vICAgICB7XG4vLyAgICAgICB0ZXh0OiAnXHU1MTczXHU0RThFXHU2MjExJyxcbi8vICAgICAgIGxpbms6ICcvYWJvdXQvJ1xuLy8gICAgIH1cbi8vICAgXSxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBzaWRlYmFyIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICAvLyBzaWRlYmFyOiB7XG5cbi8vICAgLy8gfSxcbi8vICAgLy8gc2lkZWJhckRlcHRoOiAyLFxuLy8gICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIHBhZ2UgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAgIGVkaXRMaW5rOiBmYWxzZSxcbi8vICAgZWRpdExpbmtUZXh0OiAnJyxcbi8vICAgZWRpdExpbmtQYXR0ZXJuOiAnJyxcbi8vICAgZG9jc1JlcG86ICcnLFxuLy8gICBkb2NzQnJhbmNoOiAnJyxcbi8vICAgZG9jc0RpcjogJycsXG4vLyAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29udHJpYnV0b3JzIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICBjb250cmlidXRvcnM6IGZhbHNlLFxuLy8gICBjb250cmlidXRvcnNUZXh0OiAnJyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBhcnRpY2xlIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICB0aXA6ICdcdTVDMEZcdTYzRDBcdTc5M0EnLFxuLy8gICB3YXJuaW5nOiAnXHU2Q0U4XHU2MTBGJyxcbi8vICAgZGFuZ2VyOiAnXHU4QjY2XHU1NDRBJyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSA0MDQgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAgIG5vdEZvdW5kOiBbJ1x1NjAwNVx1NzEzNlx1ODJFNVx1NTkzMVx1RkYwQ1x1OTg3NVx1OTc2Mlx1NEUwRFx1ODlDMVx1NEU4NicsICdcdTRGNjBcdTY3NjVcdTUyMzBcdTRFODZcdTZDQTFcdTY3MDlcdTc3RTVcdThCQzZcdTc2ODRcdTgzNTJcdTUzOUYnLCAnXHU0RjYwXHU2NzY1XHU1MjMwXHU0RTg2XHU2Q0ExXHU2NzA5XHU3RjUxXHU3RURDXHU3Njg0XHU4MzUyXHU1MzlGJywgJ1x1NEY2MFx1Njc2NVx1NTIzMFx1NEU4Nlx1NkNBMVx1NjcwOVx1NzA3NVx1NjExRlx1NzY4NFx1NEUxNlx1NzU0QyddLFxuLy8gICBiYWNrVG9Ib21lOiAnXHU5OTk2XHU5ODc1XHU0RjIwXHU5MDAxXHU5NUU4Jyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBhcmlhIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICBvcGVuSW5OZXdXaW5kb3c6ICdcdTU3MjhcdTY1QjBcdTdBOTdcdTUzRTNcdTYyNTNcdTVGMDAnLFxuLy8gICB0b2dnbGVDb2xvck1vZGU6ICdcdTZERjFcdTgyNzJcdTZBMjFcdTVGMEYnLFxuLy8gICB0b2dnbGVTaWRlYmFyOiAnXHU1MjA3XHU2MzYyXHU0RkE3XHU4RkI5XHU2ODBGJyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSB0aGVtZSBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vICAgdGhlbWVQbHVnaW5zOiB7XG4vLyAgICAgYWN0aXZlSGVhZGVyTGlua3M6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLWFjdGl2ZS1oZWFkZXItbGlua3MgXHUzMDAyXG4vLyAgICAgYmFja1RvVG9wOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggQHZ1ZXByZXNzL3BsdWdpbi1iYWNrLXRvLXRvcCBcdTMwMDJcbi8vICAgICAvLyBjb250YWluZXI6IFtdLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTc1MzEgQHZ1ZXByZXNzL3BsdWdpbi1jb250YWluZXIgXHU2NTJGXHU2MzAxXHU3Njg0XHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHUzMDAyXG4vLyAgICAgZXh0ZXJuYWxMaW5rSWNvbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tZXh0ZXJuYWwtbGluay1pY29uIFx1MzAwMlxuLy8gICAgIGdpdDogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tZ2l0IFx1MzAwMlxuLy8gICAgIG1lZGl1bVpvb206IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLW1lZGl1bS16b29tIFx1MzAwMlxuLy8gICAgIG5wcm9ncmVzczogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tbnByb2dyZXNzIFx1MzAwMlxuLy8gICB9XG4vLyB9KTtcblxuZXhwb3J0IGRlZmF1bHQgY29taWNib3JkZXJUaGVtZSh7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmFzZSBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbG9nbzogJy9hc3NldHMvYXZhdGFyMi5wbmcnLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL0JyYXZlY2hlbicsXG4gIC8vIHJlcG9MYWJlbDogJycsXG4gIGxhc3RVcGRhdGVkOiB0cnVlLFxuICBsYXN0VXBkYXRlZFRleHQ6ICdcdTRFMEFcdTZCMjFcdTY2RjRcdTY1QjAnLFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIG5hdmlnYXRpb24gY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGhvbWU6ICcvJyxcbiAgbmF2YmFyOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1OTk5Nlx1OTg3NScsXG4gICAgICBsaW5rOiAnLycsXG4gICAgICBpY29uOiAnaWNvbi1ob21lJyxcbiAgICAgIG5hbWU6ICdob21lJ1xuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1x1NTIwNlx1N0M3QicsXG4gICAgICBsaW5rOiAnL2NhdGVnb3JpZXMvJyxcbiAgICAgIGljb246ICdpY29uLWNhdGVnb3J5JyxcbiAgICAgIG5hbWU6ICdjYXRlZ29yeSdcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTVGNTJcdTY4NjMnLFxuICAgICAgbGluazogJy9hcmNoaXZlcy8nLFxuICAgICAgaWNvbjogJ2ljb24tYXJjaGl2ZScsXG4gICAgICBuYW1lOiAnYXJjaGl2ZXMnXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU2ODA3XHU3QjdFJyxcbiAgICAgIGxpbms6ICcvdGFncy8nLFxuICAgICAgaWNvbjogJ2ljb24tdGFncycsXG4gICAgICBuYW1lOiAndGFncydcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTUxNzNcdTRFOEVcdTYyMTEnLFxuICAgICAgbGluazogJy9hYm91dC8nLFxuICAgICAgaWNvbjogJ2ljb24tYWJvdXQnLFxuICAgICAgbmFtZTogJ2Fib3V0J1xuICAgIH1cbiAgXSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBzaWRlYmFyIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBzaWRlYmFyOiB7XG4gICAgc3ViVGl0bGU6ICdcdTdFQjVcdTY3MDlcdTc1QkVcdTk4Q0VcdThENzdcdUZGMENcdTRFQkFcdTc1MUZcdTRFMERcdThBMDBcdTVGMDMnLFxuICAgIHNvY2lhbHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvbjogJ2dpdGh1YicsXG4gICAgICAgIHRpdGxlOiAnbXkgZ2l0aHViJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9CcmF2ZWNoZW4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiAnL2Fzc2V0cy9pY29ucy9naXRlZS5zdmcnLFxuICAgICAgICB0aXRsZTogJ1x1NzgwMVx1NEU5MScsXG4gICAgICAgIGxpbms6ICdodHRwczovL2dpdGVlLmNvbS9tdXJheScsXG4gICAgICAgIGljb25TaXplOiAnMS4zNzVyZW0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiAnRW1haWwnLFxuICAgICAgICB0aXRsZTogJ211cmF5XzIwMThAMTYzLmNvbScsXG4gICAgICAgIGxpbms6ICdtYWlsdG86bXVyYXlfMjAxOEAxNjMuY29tJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgLy8gc2lkZWJhckRlcHRoOiAyLFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIHBhZ2UgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGVkaXRMaW5rOiBmYWxzZSxcbiAgZWRpdExpbmtUZXh0OiAnJyxcbiAgZWRpdExpbmtQYXR0ZXJuOiAnJyxcbiAgZG9jc1JlcG86ICcnLFxuICBkb2NzQnJhbmNoOiAnJyxcbiAgZG9jc0RpcjogJycsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYXJ0aWNsZXMgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGFydGljbGVzOiB7XG4gICAgcGVyUGFnZTogMTAsIC8vIFx1NkJDRlx1OTg3NVx1NjYzRVx1NzkzQVx1NzY4NFx1NjU4N1x1N0FFMFx1NjU3MFx1OTFDRlxuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGNvbnRyaWJ1dG9ycyBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29udHJpYnV0b3JzOiBmYWxzZSxcbiAgY29udHJpYnV0b3JzVGV4dDogJycsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYXJ0aWNsZSBjb250ZW50IGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB0aXA6ICdcdTVDMEZcdTYzRDBcdTc5M0EnLFxuICB3YXJuaW5nOiAnXHU2Q0U4XHU2MTBGJyxcbiAgZGFuZ2VyOiAnXHU4QjY2XHU1NDRBJyxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSA0MDQgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIG5vdEZvdW5kOiBbJ1x1NjAwNVx1NzEzNlx1ODJFNVx1NTkzMVx1RkYwQ1x1OTg3NVx1OTc2Mlx1NEUwRFx1ODlDMVx1NEU4NicsICdcdTRGNjBcdTY3NjVcdTUyMzBcdTRFODZcdTZDQTFcdTY3MDlcdTc3RTVcdThCQzZcdTc2ODRcdTgzNTJcdTUzOUYnLCAnXHU0RjYwXHU2NzY1XHU1MjMwXHU0RTg2XHU2Q0ExXHU2NzA5XHU3RjUxXHU3RURDXHU3Njg0XHU4MzUyXHU1MzlGJywgJ1x1NEY2MFx1Njc2NVx1NTIzMFx1NEU4Nlx1NkNBMVx1NjcwOVx1NzA3NVx1NjExRlx1NzY4NFx1NEUxNlx1NzU0QyddLFxuICBiYWNrVG9Ib21lOiAnXHU5OTk2XHU5ODc1XHU0RjIwXHU5MDAxXHU5NUU4JyxcbiAgbm90Rm91bmRCZzogJy9hc3NldHMvNDA0LnBuZycsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYXJpYSBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgb3BlbkluTmV3V2luZG93OiAnXHU1NzI4XHU2NUIwXHU3QTk3XHU1M0UzXHU2MjUzXHU1RjAwJyxcbiAgdG9nZ2xlQ29sb3JNb2RlOiAnXHU2REYxXHU4MjcyXHU2QTIxXHU1RjBGJyxcbiAgdG9nZ2xlU2lkZWJhcjogJ1x1NTIwN1x1NjM2Mlx1NEZBN1x1OEZCOVx1NjgwRicsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gdGhlbWUgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHRoZW1lUGx1Z2luczoge1xuICAgIGFjdGl2ZUhlYWRlckxpbmtzOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggQHZ1ZXByZXNzL3BsdWdpbi1hY3RpdmUtaGVhZGVyLWxpbmtzIFx1MzAwMlxuICAgIGJhY2tUb1RvcDogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tYmFjay10by10b3AgXHUzMDAyXG4gICAgLy8gY29udGFpbmVyOiBbXSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU3NTMxIEB2dWVwcmVzcy9wbHVnaW4tY29udGFpbmVyIFx1NjUyRlx1NjMwMVx1NzY4NFx1ODFFQVx1NUI5QVx1NEU0OVx1NUJCOVx1NTY2OFx1MzAwMlxuICAgIGV4dGVybmFsTGlua0ljb246IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLWV4dGVybmFsLWxpbmstaWNvbiBcdTMwMDJcbiAgICBnaXQ6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLWdpdCBcdTMwMDJcbiAgICBtZWRpdW1ab29tOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggQHZ1ZXByZXNzL3BsdWdpbi1tZWRpdW0tem9vbSBcdTMwMDJcbiAgICBucHJvZ3Jlc3M6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLW5wcm9ncmVzcyBcdTMwMDJcbiAgfVxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9pbmRleC5qc1wiO2ltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgcGF0aCwgeyBkaXJuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGZpbHRlck5hdlBhZ2VzSW5kZXhMYXlvdXQsIGZpbHRlckFydFBhZ2VzTGF5b3V0LCBjb21iaW5lQW5kU2V0UGFnZXNEYXRhIH0gZnJvbSAnLi9wYWdlcy9wYWdlVG9vbHMuanMnO1xuaW1wb3J0IHsgYmFja1RvVG9wUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1iYWNrLXRvLXRvcCc7XG5cbmltcG9ydCB7IHRpcENvbnRhaW5lclBsdWdpbnMsIHNwZWNDb250YWluZXJQbHVnaW5zLCBjb2RlQ29udGFpbmVyUGx1Z2lucyB9IGZyb20gJy4vcGx1Z2lucy9jb250YWluZXJQbHVnaW5zLmpzJztcbmltcG9ydCB7IHJlZ2lzdGVyQ29tcG9uZW50c1BsdWdpbiB9IGZyb20gJ0B2dWVwcmVzcy9wbHVnaW4tcmVnaXN0ZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBwcmlzbWpzUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1wcmlzbWpzJztcbmltcG9ydCB7IHN1cHBlcmxzIH0gZnJvbSAnLi9wbHVnaW5zL2xhbmd1YWdlUGx1Z2luLmpzJztcbmltcG9ydCB7IGxpbmVOdW1iZXJQbHVnaW4gfSBmcm9tICcuL3BsdWdpbnMvbGluZU51bWJlclBsdWdpbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBoaWdobGlnaHRMaW5lUGx1Z2luIH0gZnJvbSAnLi9wbHVnaW5zL2hpZ2h0bGlnaHRMaW5lUGx1Z2luL2luZGV4LmpzJztcbmltcG9ydCB7IGdpdFBsdWdpbiB9IGZyb20gJ0B2dWVwcmVzcy9wbHVnaW4tZ2l0JztcbmltcG9ydCB7IGFjdGl2ZUhlYWRlckxpbmtzUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1hY3RpdmUtaGVhZGVyLWxpbmtzJztcbmltcG9ydCBtYXRoamF4UGx1Z2luIGZyb20gJ3Z1ZXByZXNzLXBsdWdpbi1tYXRoamF4Jztcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBcdTYzRDJcdTRFRjZcdTc2RUVcdTVGNTVcbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGNvbWJpbmVTaXRlRGF0YShzaXRlRGF0YSA9IHt9LCB0aGVtZUNvbmZpZ3MgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIC4uLnNpdGVEYXRhLFxuICAgIGFydGljbGVzRGF0YToge1xuICAgICAgYXJ0UGVyUGFnZU1heDogdGhlbWVDb25maWdzLmFydGljbGVzPy5wZXJQYWdlIHx8IDEwLFxuICAgICAgYXJ0aWNsZXM6IHt9LCAvLyBcdTYyNDBcdTY3MDlcdTY1ODdcdTdBRTBcdTc2ODRcdTY1NzBcdTYzNkUsa2V5XHU0RTNBXHU2NTg3XHU3QUUwaWQsIHZhbHVlXHU0RTNBXHU2NTg3XHU3QUUwXHU2NTcwXHU2MzZFXG4gICAgICBhcnRpY2xlTGlzdDogW10sIC8vIFx1NEUwRFx1NTIwNlx1OTg3NVx1NzY4NFx1NjU4N1x1N0FFMGlkXHU1MjE3XHU4ODY4XG4gICAgICBhcnRpY2xlUGFnZXM6IFtbXV0sIC8vIFx1NTIwNlx1OTg3NVx1NzY4NFx1NjU4N1x1N0FFMGlkXHU1MjE3XHU4ODY4XG4gICAgICBhcnRMaXN0QnlZZWFyOiB7fSwgLy8gXHU2MzA5XHU1RTc0XHU0RUZEXHU1RjUyXHU2ODYzXHU3Njg0XHU2NTg3XHU3QUUwaWRcdTUyMTdcdTg4NjhcbiAgICAgIGFydFRhZ3M6IHt9LCAvLyBcdTYyNDBcdTY3MDlcdTY4MDdcdTdCN0UsIGtleVx1NEUzQVx1NjgwN1x1N0I3RWlkLCB2YWx1ZVx1NEUzQVx1NjgwN1x1N0I3RVx1NjU3MFx1NjM2RVxuICAgICAgYXJ0TGlzdEJ5VGFnOiB7fSwgLy8gXHU2MzA5XHU2ODA3XHU3QjdFXHU1RjUyXHU2ODYzXHU3Njg0XHU2NTg3XHU3QUUwaWRcdTUyMTdcdTg4NjhcbiAgICAgIGFydENhdGVnb3JpZXM6IHt9LCAvLyBcdTYyNDBcdTY3MDlcdTUyMDZcdTdDN0IsIGtleVx1NEUzQVx1NTIwNlx1N0M3QmlkLCB2YWx1ZVx1NEUzQVx1NTIwNlx1N0M3Qlx1NjU3MFx1NjM2RVxuICAgICAgYXJ0TGlzdEJ5Q2F0ZWdvcnk6IHt9LCAvLyBcdTYzMDlcdTUyMDZcdTdDN0JcdTVGNTJcdTY4NjNcdTc2ODRcdTY1ODdcdTdBRTBpZFx1NTIxN1x1ODg2OFxuICAgIH0sXG4gICAgdGhlbWU6IHtcbiAgICAgIGxvZ286IHRoZW1lQ29uZmlncy5sb2dvIHx8ICcnLFxuICAgICAgbmF2czogWy4uLih0aGVtZUNvbmZpZ3MubmF2YmFyIHx8IFtdKV0sXG4gICAgICBzb2NpYWxzOiBbLi4uKHRoZW1lQ29uZmlncy5zaWRlYmFyPy5zb2NpYWxzIHx8IFtdKV0sXG4gICAgICBzdWJUaXRsZTogdGhlbWVDb25maWdzLnNpZGViYXI/LnN1YlRpdGxlIHx8ICcnLFxuICAgICAgZXJyNDA0OiB7XG4gICAgICAgIG5vdEZvdW5kOiB0aGVtZUNvbmZpZ3Mubm90Rm91bmQgfHwgWydcdTRFMDdcdTUyMDZcdTYyQjFcdTZCNDlcdUZGMENcdTYwQThcdTYyN0VcdTc2ODRcdThGRDlcdTRFMDBcdTk4NzVcdTYyMTFcdTZDQTFcdThGRDhcdTUxOTkuLi4nXSxcbiAgICAgICAgYmFja1RvSG9tZTogdGhlbWVDb25maWdzLmJhY2tUb0hvbWUgfHwgJ1x1OEZENFx1NTZERVx1OTk5Nlx1OTg3NScsXG4gICAgICAgIG5vdEZvdW5kQmc6IHRoZW1lQ29uZmlncy5ub3RGb3VuZEJnIHx8ICcnLFxuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IGNvbWljYm9yZGVyVGhlbWUgPSAoY2xpZW50VGhlbWVPcHQsIC4uLmFyZ3MpID0+IHtcbiAgLy8gZGVidWdnZXI7XG4gIC8vIGNvbnNvbGUubG9nKCdcdTc1MjhcdTYyMzdcdTRFM0JcdTk4OThcdTkxNERcdTdGNkU6JywgY2xpZW50VGhlbWVPcHQpO1xuICAvLyBvcHRpb25zXHU2NjJGXHU3NTI4XHU2MjM3XHU5MTREXHU3RjZFXHU3Njg0XHU0RTNCXHU5ODk4XHU5MDA5XHU5ODc5XHU5MTREXHU3RjZFXG4gIC8vIGFwcFx1NTMwNVx1NTQyQlx1NEU4Nm5vZGUgYXBpXG4gIHJldHVybiAoYXBwKSA9PiB7XG4gICAgLy8gZGVidWdnZXI7XG4gICAgY29uc3QgeyBzaXRlRGF0YSwgb3B0aW9ucyB9ID0gYXBwO1xuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3NpdGVEYXRhOicsIHNpdGVEYXRhLCdcXG4nLFxuICAgIC8vICAgJ29wdGlvbnM6Jywgb3B0aW9ucywnXFxuJyxcbiAgICAvLyAgICdhcHAuZGlyOicsICdcXG4nLFxuICAgIC8vICAgJ2NhY2hlOicsIGFwcC5kaXIuY2FjaGUoKSwnXFxuJyxcbiAgICAvLyAgICdzb3VyY2U6JywgYXBwLmRpci5zb3VyY2UoKSwnXFxuJyxcbiAgICAvLyAgICd0ZW1wOicsIGFwcC5kaXIudGVtcCgpLCdcXG4nLFxuICAgIC8vICk7XG4gICAgYXBwLnNpdGVEYXRhID0gY29tYmluZVNpdGVEYXRhKHNpdGVEYXRhLCBjbGllbnRUaGVtZU9wdCk7XG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU0RTAwXHU0RTJBXHU0RTNCXHU5ODk4XHU1QkY5XHU4QzYxXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICd2dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlcicsXG5cbiAgICAgIC8vIFx1NEUzQlx1OTg5OFx1NzY4NFx1NUJBMlx1NjIzN1x1N0FFRlx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1NzY4NFx1OERFRlx1NUY4NFxuICAgICAgY2xpZW50Q29uZmlnRmlsZTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2NsaWVudC5qcycpLFxuXG4gICAgICAvLyBcdThCQkVcdTdGNkVcdTgxRUFcdTVCOUFcdTRFNDkgZGV2IC8gYnVpbGQgXHU2QTIxXHU2NzdGXG4gICAgICB0ZW1wbGF0ZUJ1aWxkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndGVtcGxhdGVzL2J1aWxkLmh0bWwnKSxcbiAgICAgIHRlbXBsYXRlRGV2OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndGVtcGxhdGVzL2Rldi5odG1sJyksXG5cbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjNEMlx1NEVGNlxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBiYWNrVG9Ub3BQbHVnaW4oKSxcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSB0aXAgY29udGFpbmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC4uLnRpcENvbnRhaW5lclBsdWdpbnMsXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gc3BlYyBjb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLi4uc3BlY0NvbnRhaW5lclBsdWdpbnMsXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29kZSBjb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLi4uY29kZUNvbnRhaW5lclBsdWdpbnMsXG4gICAgICAgIHJlZ2lzdGVyQ29tcG9uZW50c1BsdWdpbih7XG4gICAgICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAgICAgJ2NvZGVncm91cCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2dsb2JhbC1jb21wb25lbnRzL0NvZGVHcm91cC52dWUnKSxcbiAgICAgICAgICAgICdjb2RlZ3JvdXBpdGVtJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vZ2xvYmFsLWNvbXBvbmVudHMvQ29kZUdyb3VwSXRlbS52dWUnKSxcbiAgICAgICAgICAgICdCYWRnZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2dsb2JhbC1jb21wb25lbnRzL0JhZGdlLnZ1ZScpLFxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gcHJpc21qcyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBwcmlzbWpzUGx1Z2luKHtcbiAgICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgICAgICBwcmVsb2FkTGFuZ3VhZ2VzOiBbXG4gICAgICAgICAgICAuLi5zdXBwZXJsc1xuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGxpbmUgbnVtYmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxpbmVOdW1iZXJQbHVnaW4oe1xuICAgICAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgICB9KSxcbiAgICAgICAgaGlnaGxpZ2h0TGluZVBsdWdpbih7XG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU5ODc5XG4gICAgICAgIH0pLFxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGdpdCAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBnaXRQbHVnaW4oe1xuICAgICAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgICB9KSxcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBhY3RpdmUgaGVhZGVyIGxpbmtzIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGFjdGl2ZUhlYWRlckxpbmtzUGx1Z2luKHtcbiAgICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgICAgfSksXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWF0aGpheCAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBtYXRoamF4UGx1Z2luKHt9KVxuICAgICAgXSxcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGV2IGN5Y2xlIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBleHRlbmRzUGFnZU9wdGlvbnMocGFnZU9wdCwgYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYWdlT3B0KTtcbiAgICAgICAgZmlsdGVyQXJ0UGFnZXNMYXlvdXQocGFnZU9wdCwgYXBwLmRpci5zb3VyY2UoJ2FydGljbGVzLycpKTtcbiAgICAgIH0sXG4gICAgICBleHRlbmRzUGFnZShwYWdlLCBhcHApIHtcbiAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhZ2UpO1xuICAgICAgICAvLyBmaWx0ZXJOYXZQYWdlc0luZGV4TGF5b3V0KHBhZ2UpO1xuICAgICAgICBsZXQgb2JqID0gY29tYmluZUFuZFNldFBhZ2VzRGF0YShwYWdlLCBhcHApO1xuICAgICAgICBwYWdlID0gb2JqLnBhZ2U7XG4gICAgICAgIGFwcCA9IG9iai5hcHA7XG4gICAgICB9LFxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBsaWZlIGN5Y2xlIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBcdTUxNzZcdTRFRDZcdTc2ODRcdTYzRDJcdTRFRjYgQVBJIFx1NEU1Rlx1OTBGRFx1NTNFRlx1NzUyOFxuICAgICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHVGRjBDXHU0RTNCXHU5ODk4XHVGRjBDXHU2M0QyXHU0RUY2XHU1NDhDXHU5ODc1XHU5NzYyXHU1REYyXHU3RUNGXHU1MkEwXHU4RjdEXG4gICAgICBvbkluaXRpYWxpemVkKGFwcCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcblxuICAgICAgfSxcbiAgICAgIC8vIFx1NjU4N1x1NEVGNlx1NTFDNlx1NTkwN1x1NUI4Q1x1NkJENVx1RkYwQ1x1NzUyOFx1NjIzN2NsaWVudFx1OTE0RFx1N0Y2RVx1NEU1Rlx1NTFDNlx1NTkwN1x1NTk3RFx1NEU4NlxuICAgICAgb25QcmVwYXJlZChhcHApIHtcbiAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYWdlczonLCBhcHAucGFnZXMpO1xuXG4gICAgICB9LFxuICAgICAgLy8gZGV2XHU2NzBEXHU1MkExXHU1NjY4XHU1NDJGXHU1MkE4XHVGRjBDXHU3NkQxXHU1NDJDXHU2NTg3XHU0RUY2XHU0RkVFXHU2NTM5XG4gICAgICBvbldhdGNoZWQoYXBwLCB3YXRjaGVycywgcmVzdGFydCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oJ2RldiBzZXJ2ZXIgaXMgbGlzdGVuaW5nIGZpbGUgY2hhbmdlJykpO1xuICAgICAgfSxcbiAgICAgIC8vIHByb1x1OTYzNlx1NkJCNVx1RkYwQ1x1NUI4Q1x1NjIxMFx1OTc1OVx1NjAwMVx1NjU4N1x1NEVGNlx1NzUxRlx1NjIxMFx1NTQwRVx1OEMwM1x1NzUyOFxuICAgICAgb25HZW5lcmF0ZWQoYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5iZ0dyZWVuKCdHZW5lcmF0ZWQgcGFnZXMgY29tcGxldGVkIScpKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfTtcbn07XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvdXRpbHMvdG9vbHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci91dGlscy90b29scy5qc1wiOy8vIFx1OTY4Rlx1NjczQVx1NUI1N1x1N0IyNlx1NEUzMlxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVN0cigpIHtcbiAgcmV0dXJuICgoTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmKT4+MCkudG9TdHJpbmcoMTYpO1xufVxuXG4vLyBcdTgzQjdcdTUzRDZcdTk2OEZcdTY3M0FcdTdFQzRcdTU0MDhcdTVCNTdcdTdCMjZcdTRFMzJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTeXNJZCgpIHtcbiAgcmV0dXJuIGAke3JhbmRvbVN0cigpfS0ke3JhbmRvbVN0cigpfWA7XG59XG5cbi8qKlxuICogXHU1QzA2XHU1QjU3XHU3QjI2XHU0RTMyXHU4RjZDXHU2MzYyXHU2MzA3XHU1QjlBXHU3Njg0dW5pY29kZVx1NjgzQ1x1NUYwRlxuICogQHBhcmFtIHsqfSBzdHJcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHIydW5pY29kZUZvcm1hdGUoc3RyKSB7XG4gIGxldCByZXQgPSBbXTtcblxuICBsZXQgZ2FwID0gJyRfJCc7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGxldCB1c3RyID0gJyc7XG4gICAgbGV0IGNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICBsZXQgY29kZTE2ID0gY29kZS50b1N0cmluZygxNik7XG5cbiAgICBpZiAoY29kZSA8IDB4Zikge1xuICAgICAgdXN0ciA9IGAwMDAke2NvZGUxNn1gO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZmYpIHtcbiAgICAgIHVzdHIgPSBgMDAke2NvZGUxNn1gO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZmZmKSB7XG4gICAgICB1c3RyID0gYDAke2NvZGUxNn1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c3RyID0gYCR7Y29kZTE2fWA7XG4gICAgfVxuICAgIHJldC5wdXNoKHVzdHIpO1xuICB9XG5cbiAgcmV0dXJuIHJldC5qb2luKGdhcCk7XG59XG5cbi8qKlxuICogXHU1QzA2XHU2MzA3XHU1QjlBXHU3Njg0dW5pY29kZVx1NjgzQ1x1NUYwRlx1OEY2Q1x1NjM2Mlx1NUI1N1x1N0IyNlx1NEUzMlxuICogQHBhcmFtIHsqfSBzdHJcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmljb2RlRm9ybWF0ZTJzdHIoc3RyKSB7XG4gIGxldCByZXQgPSAnXFxcXHUnICsgc3RyLnJlcGxhY2UoL1xcJFxcX1xcJC9nLCAnXFxcXHUnKTtcbiAgLy8gY29uc29sZS5sb2cocmV0KTtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbihgcmV0dXJuICcke3JldH0nYCkoKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wYWdlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wYWdlcy9wYWdlVG9vbHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wYWdlcy9wYWdlVG9vbHMuanNcIjtpbXBvcnQgeyBzdHIydW5pY29kZUZvcm1hdGUgfSBmcm9tIFwiLi4vdXRpbHMvdG9vbHNcIjtcblxuY29uc3QgTkFWX1BBR0VTX0lOREVYX0xBWU9VVFMgPSB7XG4gIGhvbWU6IFwiSG9tZUxheW91dFwiLFxuICBhYm91dDogXCJBYm91dExheW91dFwiLFxuICBhcnRpY2xlczogXCJBcnRpY2xlc0xheW91dFwiLFxuICBhcmNoaXZlczogXCJBcmNoaXZlc0xheW91dFwiLFxuICBjYXRlZ29yaWVzOiBcIkNhdGVnb3JpZXNMYXlvdXRcIixcbiAgYXJ0aWNsZVBhZ2U6IFwiQXJ0aWNsZVBhZ2VMYXlvdXRcIixcbiAgdGFnczogXCJUYWdzTGF5b3V0XCIsXG4gIGRlZmF1bHRMYXlvdXQ6IFwiTGF5b3V0XCIsXG59O1xuXG5mdW5jdGlvbiBzZXRQYWdlV2lkZ2V0KHsgcGFnZSwgYXBwIH0pIHtcbiAgaWYgKCFwYWdlIHx8ICFwYWdlLmZyb250bWF0dGVyKSB7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG4gIH1cblxuICBwYWdlLmZyb250bWF0dGVyLndpZGdldCA9IHtcbiAgICBjYWxlbmRhcjogdHJ1ZSxcbiAgICB0YWdzOiB0cnVlLFxuICAgIGNhdGVnb3J5OiB0cnVlLFxuICAgIGFyY2hpdmVzOiB0cnVlLFxuICAgIC4uLihwYWdlLmZyb250bWF0dGVyLndpZGdldCB8fCB7fSlcbiAgfTtcblxuICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbn1cblxuLyoqXG4gKiBcdTkxQ0RcdTdGNkVhcml0Y2xlXHU5RUQ4XHU4QkE0XHU4REVGXHU3NTMxXHU1QkY5XHU1RTk0XHU5ODc1XHU5NzYyXHU3Njg0XHU1QzVFXHU2MDI3XG4gKiBAcGFyYW0geyp9IHBhcmFtMFxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gcmVzZXRBcnRpY2xlSW5kZXgoeyBwYWdlLCBhcHAgfSkge1xuICBpZiAoIXBhZ2UgfHwgIXBhZ2UuZnJvbnRtYXR0ZXIgfHwgIXBhZ2UuZnJvbnRtYXR0ZXIuYXJ0aWNsZVBhZ2UpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbiAgfVxuXG4gIGlmIChwYWdlLmZyb250bWF0dGVyLmFydGljbGVzICYmIHBhZ2UuZnJvbnRtYXR0ZXIuYXJ0aWNsZVBhZ2UpIHtcbiAgICBwYWdlLmZyb250bWF0dGVyLmFydGljbGVQYWdlID0gZmFsc2U7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG4gIH1cblxuICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbn1cblxuZnVuY3Rpb24gc2V0QXJ0aWNsZVBhZ2VNYXR0ZXIoeyBwYWdlLCBhcHAgfSkge1xuXG4gIGlmICghcGFnZSB8fCAhcGFnZS5mcm9udG1hdHRlcikge1xuICAgIHJldHVybiB7IHBhZ2UsIGFwcCB9O1xuICB9XG5cbiAgaWYgKHBhZ2UuZnJvbnRtYXR0ZXIuYXZhdGFyID09PSB2b2lkIDApIHtcbiAgICBwYWdlLmZyb250bWF0dGVyLmF2YXRhciA9IHRydWU7XG4gIH1cblxuICBjb25zdCB3aWRnZXQgPSBwYWdlLmZyb250bWF0dGVyLndpZGdldCB8fCB7fTtcblxuICBwYWdlLmZyb250bWF0dGVyLndpZGdldCA9IHtcbiAgICBjYWxlbmRhcjogdHJ1ZSxcbiAgICB0YWdzOiB0cnVlLFxuICAgIGNhdGVnb3J5OiB0cnVlLFxuICAgIGFyY2hpdmVzOiB0cnVlLFxuICAgIC4uLndpZGdldCxcbiAgfTtcblxuICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbn1cblxuLyoqXG4gKiBcdTU0MDhcdTYyMTBcdTY1ODdcdTdBRTBcdTk4NzVcdTk3NjJcdTY1NzBcdTYzNkVcbiAqIEBwYXJhbSB7Kn0gcGFyYW0wXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBjb21iaW5lQXJ0aWNsZSh7IHBhZ2UsIGFwcCB9KSB7XG4gIGlmICghcGFnZSB8fCAhcGFnZS5mcm9udG1hdHRlciB8fCAhcGFnZS5mcm9udG1hdHRlci5hcnRpY2xlUGFnZSkge1xuICAgIHJldHVybiB7IHBhZ2UsIGFwcCB9O1xuICB9XG5cbiAgLy8gY3JlYXRlIGFydGljbGUgZGF0YVxuICBjb25zdCBhcnRpY2xlID0ge1xuICAgIHBhdGg6IHBhZ2UucGF0aCxcbiAgICBkYXRlOiBwYWdlLmRhdGUgfHwgcGFnZS5mcm9udG1hdHRlci51cGRhdGVEYXRlLFxuICAgIHNsdWc6IHBhZ2Uuc2x1ZyxcbiAgICB0aXRsZTogcGFnZS50aXRsZSxcbiAgICBkZXNjOiBwYWdlLmZyb250bWF0dGVyLmRlc2NyaXB0aW9uLFxuICAgIHVwZGF0ZURhdGU6IHBhZ2UuZnJvbnRtYXR0ZXIudXBkYXRlRGF0ZSxcbiAgICBpZDogcGFnZS5rZXksXG4gICAgY292ZXJJbWc6IHBhZ2UuZnJvbnRtYXR0ZXIuY292ZXJJbWcgfHwgXCJcIixcbiAgfTtcblxuICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbn1cblxuLyoqXG4gKiBcdTU0MDhcdTYyMTBcdTY1ODdcdTdBRTBcdTY1NzBcdTYzNkVcbiAqL1xuZnVuY3Rpb24gY29tYmluZUFydExpc3QoeyBwYWdlLCBhcHAsIGFydGljbGUgfSkge1xuICBpZiAoIXBhZ2UgfHwgIWFydGljbGUpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbiAgfVxuXG4gIGNvbnN0IHBlclBhZ2VNYXggPSBhcHAuc2l0ZURhdGEuYXJ0aWNsZXNEYXRhLmFydFBlclBhZ2VNYXg7XG4gIGNvbnN0IGFydGljbGVzRGF0YSA9IGFwcC5zaXRlRGF0YS5hcnRpY2xlc0RhdGE7XG5cbiAgLy8gc2F2ZSB0aGUgYXJ0aWNsZSBkYXRhIC0tLT4gYXJ0aWNsZXNcbiAgYXJ0aWNsZXNEYXRhLmFydGljbGVzW2FydGljbGUuaWRdID0gYXJ0aWNsZTtcbiAgYXJ0aWNsZXNEYXRhLmFydGljbGVMaXN0LnB1c2goYXJ0aWNsZS5pZCk7XG5cbiAgbGV0IHBhZ2VzbGVuID0gYXJ0aWNsZXNEYXRhLmFydGljbGVQYWdlcy5sZW5ndGg7XG4gIGlmIChhcnRpY2xlc0RhdGEuYXJ0aWNsZVBhZ2VzW3BhZ2VzbGVuIC0gMV0ubGVuZ3RoIDwgcGVyUGFnZU1heCkge1xuICAgIGFydGljbGVzRGF0YS5hcnRpY2xlUGFnZXNbcGFnZXNsZW4gLSAxXS5wdXNoKGFydGljbGUuaWQpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICBhcnRpY2xlc0RhdGEuYXJ0aWNsZVBhZ2VzW3BhZ2VzbGVuXSA9IGxpc3Q7XG4gICAgbGlzdC5wdXNoKGFydGljbGUuaWQpO1xuICB9XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwLCBhcnRpY2xlIH07XG59XG5cbi8qKlxuICogXHU1NDA4XHU2MjEwXHU2NTg3XHU3QUUwXHU1RjUyXHU2ODYzXHU2NTcwXHU2MzZFXG4gKi9cbmZ1bmN0aW9uIGNvbWJpbmVBcnRpY2xlQWNoaXZlcyh7IHBhZ2UsIGFwcCwgYXJ0aWNsZSB9KSB7XG4gIGlmICghcGFnZSB8fCAhYXJ0aWNsZSkge1xuICAgIHJldHVybiB7IHBhZ2UsIGFwcCwgYXJ0aWNsZSB9O1xuICB9XG4gIGNvbnN0IGFydGljbGVzRGF0YSA9IGFwcC5zaXRlRGF0YS5hcnRpY2xlc0RhdGE7XG4gIC8vIHNhdmUgYnkgeWVhciAtLS0+IGFyY2hpdmVzXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShhcnRpY2xlLmRhdGUpO1xuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICBpZiAoIWFydGljbGVzRGF0YS5hcnRMaXN0QnlZZWFyW3llYXJdKSB7XG4gICAgYXJ0aWNsZXNEYXRhLmFydExpc3RCeVllYXJbeWVhcl0gPSBbXTtcbiAgfVxuICBhcnRpY2xlc0RhdGEuYXJ0TGlzdEJ5WWVhclt5ZWFyXS5wdXNoKGFydGljbGUuaWQpO1xuXG4gIHJldHVybiB7IHBhZ2UsIGFwcCwgYXJ0aWNsZSB9O1xufVxuXG4vKipcbiAqIFx1NTQwOFx1NjIxMFx1NjU4N1x1N0FFMFx1NjgwN1x1N0I3RVx1NjU3MFx1NjM2RVxuICovXG5mdW5jdGlvbiBjb21iaW5lQXJ0aWNsZVRhZ3MoeyBwYWdlLCBhcHAsIGFydGljbGUgfSkge1xuICBpZiAoIXBhZ2UgfHwgIWFydGljbGUpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbiAgfVxuICBjb25zdCBhcnRpY2xlc0RhdGEgPSBhcHAuc2l0ZURhdGEuYXJ0aWNsZXNEYXRhO1xuICAvLyBzYXZlIGJ5IHRhZyAtLS0+IHRhZ3NcbiAgY29uc3QgdGFncyA9IHBhZ2UuZnJvbnRtYXR0ZXIudGFncyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRhZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb25zdCB0YWcgPSB0YWdzW2ldO1xuICAgIGNvbnN0IHRhZ0lkID0gc3RyMnVuaWNvZGVGb3JtYXRlKHRhZyk7XG5cbiAgICBpZiAoIWFydGljbGVzRGF0YS5hcnRUYWdzW3RhZ0lkXSkge1xuICAgICAgYXJ0aWNsZXNEYXRhLmFydFRhZ3NbdGFnSWRdID0ge1xuICAgICAgICBuYW1lOiB0YWcsXG4gICAgICAgIGlkOiB0YWdJZCxcbiAgICAgICAgbGluazogYC90YWdzP3RhZz0ke2VuY29kZVVSSUNvbXBvbmVudCh0YWdJZCl9YFxuICAgICAgfTtcbiAgICAgIGFydGljbGVzRGF0YS5hcnRMaXN0QnlUYWdbdGFnSWRdID0gW107XG4gICAgfVxuICAgIGFydGljbGVzRGF0YS5hcnRMaXN0QnlUYWdbdGFnSWRdLnB1c2goYXJ0aWNsZS5pZCk7XG4gIH1cblxuICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbn1cblxuLyoqXG4gKiBcdTU0MDhcdTYyMTBcdTY1ODdcdTdBRTBcdTUyMDZcdTdDN0JcdTY1NzBcdTYzNkVcbiAqL1xuZnVuY3Rpb24gY29tYmluZUFydGljbGVDYXRlZ29yaWVzKHsgcGFnZSwgYXBwLCBhcnRpY2xlIH0pIHtcbiAgaWYgKCFwYWdlIHx8ICFhcnRpY2xlKSB7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG4gIH1cblxuICBjb25zdCBhcnRpY2xlc0RhdGEgPSBhcHAuc2l0ZURhdGEuYXJ0aWNsZXNEYXRhO1xuXG4gIC8vIHNhdmUgYnkgY2F0ZWdvcnkgLS0tPiBjYXRlZ29yaWVzXG4gIGNvbnN0IGNhdGVnb3J5TmFtZSA9IHBhZ2UuZnJvbnRtYXR0ZXIuY2F0ZWdvcnkgfHwgXCJcdTY3MkFcdTUyMDZcdTdDN0JcIjtcbiAgY29uc3QgY2F0ZWdvcnlJZCA9IHN0cjJ1bmljb2RlRm9ybWF0ZShjYXRlZ29yeU5hbWUpO1xuICBsZXQgY2F0ZWdvcnkgPSBhcnRpY2xlc0RhdGEuYXJ0Q2F0ZWdvcmllc1tjYXRlZ29yeUlkXTtcbiAgaWYgKCFjYXRlZ29yeSkge1xuICAgIGNhdGVnb3J5ID0ge1xuICAgICAgbmFtZTogY2F0ZWdvcnlOYW1lLFxuICAgICAgaWQ6IGNhdGVnb3J5SWQsXG4gICAgICBsaW5rOiBgL2NhdGVnb3JpZXM/Y2F0ZWdvcnk9JHtlbmNvZGVVUklDb21wb25lbnQoY2F0ZWdvcnlJZCl9YFxuICAgIH07XG4gICAgYXJ0aWNsZXNEYXRhLmFydENhdGVnb3JpZXNbY2F0ZWdvcnlJZF0gPSBjYXRlZ29yeTtcbiAgICBhcnRpY2xlc0RhdGEuYXJ0TGlzdEJ5Q2F0ZWdvcnlbY2F0ZWdvcnlJZF0gPSBbXTtcbiAgfVxuICBhcnRpY2xlc0RhdGEuYXJ0TGlzdEJ5Q2F0ZWdvcnlbY2F0ZWdvcnlJZF0ucHVzaChhcnRpY2xlLmlkKTtcblxuICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbn1cblxuLyoqXG4gKiBcdThGQzdcdTZFRTRcdTk4NzVcdTk3NjJcdUZGMENcdTVDMDZcdTk4NzVcdTk3NjJcdTYzMDlcdTcxNjdcdTVCRkNcdTgyMkFcdTk4NzVcdTc2ODRcdTk3MDBcdTZDNDJcdThGREJcdTg4NENcdTkxNERcdTdGNkVcbiAqIEBwYXJhbSB7Kn0gcGFnZXNcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJOYXZQYWdlc0luZGV4TGF5b3V0KHsgcGFnZSwgYXBwIH0pIHtcbiAgaWYgKCFwYWdlIHx8ICFwYWdlLmZyb250bWF0dGVyIHx8IHBhZ2UuZnJvbnRtYXR0ZXIuYXJ0aWNsZVBhZ2UpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbiAgfVxuICAvLyBkZWJ1Z2dlcjtcbiAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKE5BVl9QQUdFU19JTkRFWF9MQVlPVVRTKSkge1xuICAgIGlmIChwYWdlLmZyb250bWF0dGVyICYmIHBhZ2UuZnJvbnRtYXR0ZXJba2V5XSkge1xuICAgICAgcGFnZS5mcm9udG1hdHRlci5sYXlvdXQgPVxuICAgICAgICBOQVZfUEFHRVNfSU5ERVhfTEFZT1VUU1trZXldIHx8IE5BVl9QQUdFU19JTkRFWF9MQVlPVVRTLmRlZmF1bHRMYXlvdXQ7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG59XG5cbi8qKlxuICogXHU1NDA4XHU2MjEwXHU1RTc2XHU4QkJFXHU3RjZFXHU5ODc1XHU5NzYyXHU3NkY4XHU1MTczXHU2NTcwXHU2MzZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lQW5kU2V0UGFnZXNEYXRhKHBhZ2UsIGFwcCkge1xuICByZXR1cm4gW1xuICAgIHJlc2V0QXJ0aWNsZUluZGV4LFxuICAgIHNldEFydGljbGVQYWdlTWF0dGVyLFxuICAgIGNvbWJpbmVBcnRpY2xlLFxuICAgIGNvbWJpbmVBcnRMaXN0LFxuICAgIGNvbWJpbmVBcnRpY2xlQWNoaXZlcyxcbiAgICBjb21iaW5lQXJ0aWNsZVRhZ3MsXG4gICAgY29tYmluZUFydGljbGVDYXRlZ29yaWVzLFxuICAgIGZpbHRlck5hdlBhZ2VzSW5kZXhMYXlvdXQsXG4gICAgc2V0UGFnZVdpZGdldFxuICBdLnJlZHVjZShcbiAgICBmdW5jdGlvbiAocHJldiwgZm4pIHtcbiAgICAgIHJldHVybiBmbihwcmV2KTtcbiAgICB9LFxuICAgIHsgcGFnZSwgYXBwIH1cbiAgKTtcbn1cblxuLyoqXG4gKiBcdThGQzdcdTZFRTRcdTY1ODdcdTdBRTBcdTk4NzVcdUZGMENcdTVDMDZcdTY1ODdcdTdBRTBcdTk4NzVcdTc2ODQgbGF5b3V0IFx1OEJCRVx1N0Y2RVx1NEUzQSBBcnRpY2xlUGFnZUxheW91dFxuICogQHBhcmFtIHsqfSBwYWdlT3B0XG4gKiBAcGFyYW0geyp9IGFydERpclxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQXJ0UGFnZXNMYXlvdXQocGFnZU9wdCwgYXJ0RGlyKSB7XG4gIC8vIGRlYnVnZ2VyO1xuICBpZiAocGFnZU9wdC5maWxlUGF0aD8uc3RhcnRzV2l0aChhcnREaXIpICYmICFwYWdlT3B0LmZyb250bWF0dGVyPy5hcnRpY2xlcykge1xuICAgIHBhZ2VPcHQuZnJvbnRtYXR0ZXIgPSBwYWdlT3B0LmZyb250bWF0dGVyID8/IHt9O1xuICAgIHBhZ2VPcHQuZnJvbnRtYXR0ZXIuYXJ0aWNsZVBhZ2UgPSB0cnVlO1xuICAgIHBhZ2VPcHQuZnJvbnRtYXR0ZXIubGF5b3V0ID0gIE5BVl9QQUdFU19JTkRFWF9MQVlPVVRTWydhcnRpY2xlUGFnZSddO1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2NvbnRhaW5lclBsdWdpbnMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2NvbnRhaW5lclBsdWdpbnMuanNcIjtpbXBvcnQgeyBjb250YWluZXJQbHVnaW4gfSBmcm9tICdAdnVlcHJlc3MvcGx1Z2luLWNvbnRhaW5lcic7XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGZ1bmN0aW9uIGluZm9UaXAoKSB7XG4gIHJldHVybiBbXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgdHlwZTogJ3RpcCcsXG4gICAgICBkZWZhdWx0VGl0bGU6IHtcbiAgICAgICAgJy8nOiAnXHU2M0QwXHU3OTNBJyxcbiAgICAgICAgJy9lbi8nOiAnVElQJyxcbiAgICAgIH1cbiAgICB9KSxcbiAgICBjb250YWluZXJQbHVnaW4oe1xuICAgICAgLy8gXHU5MTREXHU3RjZFXHU5ODc5XG4gICAgICB0eXBlOiAnaW5mbycsXG4gICAgICBkZWZhdWx0VGl0bGU6IHtcbiAgICAgICAgJy8nOiAnXHU2M0QwXHU3OTNBJyxcbiAgICAgICAgJy9lbi8nOiAnVElQJyxcbiAgICAgIH1cbiAgICB9KSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhcm5pbmdUaXAoKSB7XG4gIHJldHVybiBbXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgZGVmYXVsdFRpdGxlOiB7XG4gICAgICAgICcvJzogJ1x1NkNFOFx1NjEwRicsXG4gICAgICAgICcvZW4vJzogJ1dBUk5JTkcnLFxuICAgICAgfVxuICAgIH0pLFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFuZ2VyVGlwKCkge1xuICByZXR1cm4gW1xuICAgIGNvbnRhaW5lclBsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgZGVmYXVsdFRpdGxlOiB7XG4gICAgICAgICcvJzogJ1x1OEI2Nlx1NTQ0QScsXG4gICAgICAgICcvZW4vJzogJ1dBUk5JTkcnLFxuICAgICAgfVxuICAgIH0pLFxuICBdO1xufVxuXG5leHBvcnQgY29uc3QgdGlwQ29udGFpbmVyUGx1Z2lucyA9IFtcbiAgLi4uaW5mb1RpcCgpLFxuICAuLi53YXJuaW5nVGlwKCksXG4gIC4uLmRhbmdlclRpcCgpLFxuXTtcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZnVuY3Rpb24gZGV0YWlsc0NvbnRhaW5lcigpIHtcbiAgcmV0dXJuIFtcbiAgICBjb250YWluZXJQbHVnaW4oe1xuICAgICAgLy8gXHU5MTREXHU3RjZFXHU5ODc5XG4gICAgICB0eXBlOiAnZGV0YWlscycsXG4gICAgICBiZWZvcmU6IChpbmZvKSA9PiBgPGRldGFpbHMgY2xhc3M9XCJjdXN0b20tYmxvY2sgZGV0YWlsc1wiPiR7aW5mbyA/IGA8c3VtbWFyeT4ke2luZm99PC9zdW1tYXJ5PmAgOiAnJ31cXG5gLFxuICAgICAgYWZ0ZXI6ICgpID0+ICc8L2RldGFpbHM+XFxuJyxcbiAgICAgIGRlZmF1bHRUaXRsZToge1xuICAgICAgICAnLyc6ICdcdThCRTZcdTdFQzZcdTRGRTFcdTYwNkYnLFxuICAgICAgICAnL2VuLyc6ICdERVRBSUxTJyxcbiAgICAgIH1cbiAgICB9KSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNlbnRlckNvbnRhaW5lcigpIHtcbiAgcmV0dXJuIFtcbiAgICBjb250YWluZXJQbHVnaW4oe1xuICAgICAgICB0eXBlOiAnY2VudGVyJyxcbiAgICAgICAgYmVmb3JlOiBpbmZvID0+IGA8ZGl2IGNsYXNzPVwiY2VudGVyLWNvbnRhaW5lclwiPmAsXG4gICAgICAgIGFmdGVyOiAoKSA9PiAnPC9kaXY+JyxcbiAgICAgICAgZGVmYXVsdFRpdGxlOiB7XG4gICAgICAgICAgJy8nOiAnXHU1QzQ1XHU0RTJEJyxcbiAgICAgICAgICAnL2VuLyc6ICdDRU5URVInLFxuICAgICAgICB9XG4gICAgfSlcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRoZW9yZW1Db250YWluZXIoKSB7XG4gIHJldHVybiBbXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgIHR5cGU6ICd0aGVvcmVtJyxcbiAgICAgIGJlZm9yZTogaW5mbyA9PiBgPGRpdiBjbGFzcz1cImN1c3RvbS1ibG9jayB0aGVvcmVtXCI+PHAgY2xhc3M9XCJ0aXRsZVwiPiR7aW5mb308L3A+YCxcbiAgICAgIGFmdGVyOiAoKSA9PiAnPC9kaXY+J1xuICAgIH0pXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RlQ29udGFpbmVyKCkge1xuICByZXR1cm4gW1xuICAgIGNvbnRhaW5lclBsdWdpbih7XG4gICAgICB0eXBlOiAnbm90ZScsXG4gICAgICBkZWZhdWx0VGl0bGU6IHtcbiAgICAgICAgJy8nOiAnXHU3QjE0XHU4QkIwJyxcbiAgICAgICAgJy9lbi8nOiAnTk9URSdcbiAgICAgIH1cbiAgICB9KVxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmlnaHRDb250YWluZXIoKSB7XG4gIHJldHVybiBbXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgIHR5cGU6ICdyaWdodCcsXG4gICAgfSlcbiAgXTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwZWNDb250YWluZXJQbHVnaW5zID0gW1xuICAuLi5kZXRhaWxzQ29udGFpbmVyKCksXG4gIC4uLmNlbnRlckNvbnRhaW5lcigpLFxuICAuLi50aGVvcmVtQ29udGFpbmVyKCksXG4gIC4uLm5vdGVDb250YWluZXIoKSxcbiAgLi4ucmlnaHRDb250YWluZXIoKSxcbl07XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IGNvZGVDb250YWluZXJQbHVnaW5zID0gW1xuICBjb250YWluZXJQbHVnaW4oe1xuICAgIHR5cGU6ICdjb2RlLWdyb3VwJyxcbiAgICBiZWZvcmU6IGluZm8gPT4gYDxjb2RlZ3JvdXA+JHtpbmZvfWAsXG4gICAgYWZ0ZXI6ICgpID0+ICc8L2NvZGVncm91cD4nLFxuICAgIGRlZmF1bHRUaXRsZToge1xuICAgICAgJy8nOiAnJyxcbiAgICAgICcvZW4vJzogJydcbiAgICB9LFxuICB9KSxcbiAgY29udGFpbmVyUGx1Z2luKHtcbiAgICB0eXBlOiAnY29kZS1ncm91cC1pdGVtJyxcbiAgICBiZWZvcmU6IGluZm8gPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2luZm89PT09PT09PicsIGluZm8pO1xuICAgICAgcmV0dXJuIGA8Y29kZWdyb3VwaXRlbSB0YWI9XCIke2luZm99XCIgPmA7XG4gICAgfSxcbiAgICBhZnRlcjogKCkgPT4gJzwvY29kZWdyb3VwaXRlbT4nLFxuICAgIGRlZmF1bHRUaXRsZToge1xuICAgICAgJy8nOiAnJyxcbiAgICAgICcvZW4vJzogJydcbiAgICB9LFxuICB9KVxuXTtcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2xhbmd1YWdlUGx1Z2luLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9sYW5ndWFnZVBsdWdpbi5qc1wiO2V4cG9ydCBjb25zdCBzdXBwZXJscyA9IFtcbiAgJ2h0bWwnLFxuICAneG1sJyxcbiAgJ3N2ZycsXG4gICdtYXRobWwnLFxuXG4gICdjc3MnLFxuICAnbGVzcycsXG4gICdzY3NzJyxcbiAgJ3Nhc3MnLFxuXG4gICdqYXZhc2NyaXB0JyxcbiAgJ2pzJyxcbiAgJ3R5cGVzY3JpcHQnLFxuICAndHMnLFxuXG4gICdhY3Rpb25zY3JpcHQnLFxuXG4gICdiYXNoJyxcbiAgJ3NoJyxcbiAgJ3NoZWxsJyxcblxuICAnYycsXG4gICdjcHAnLFxuICAnY3NoYXJwJyxcbiAgJ2NzJyxcbiAgJ2RvdG5ldCcsXG5cbiAgJ2RhcnQnLFxuICAnZG9ja2VyJyxcbiAgJ2RvY2tlcmZpbGUnLFxuXG4gICdlZGl0b3Jjb25maWcnLFxuICAnZWpzJyxcbiAgJ2VsbScsXG4gICdleGNlbC1mb3JtdWxhJyxcbiAgJ3hsc3gnLFxuICAneGxzJyxcblxuICAnZnRsJyxcbiAgJ2dtbCcsXG4gICdnYW1lbWFrZXJsYW5ndWFnZScsXG5cbiAgJ2dpdCcsXG4gICdnbHNsJyxcbiAgJ2dvJyxcbiAgJ2dvLW1vZHVsZScsXG4gICdnby1tb2QnLFxuICAnZ3JhcGhxbCcsXG5cbiAgJ2hhbmRsZWJhcnMnLFxuICAnaGJzJyxcbiAgJ211c3RhY2hlJyxcblxuICAnaGF4ZScsXG4gICdobHNsJyxcbiAgJ2h0dHAnLFxuXG4gICdpZ25vcmUnLFxuICAnZ2l0aWdub3JlJyxcbiAgJ25wbWlnbm9yZScsXG5cbiAgJ2phdmEnLFxuICAnamF2YWRvYycsXG4gICdqc2RvYycsXG4gICdqcy1leHRyYXMnLFxuICAnanNvbicsXG4gICdqdWxpYScsXG5cbiAgJ2xhdGV4JyxcbiAgJ3RleCcsXG4gICdjb250ZXh0JyxcbiAgJ2x1YScsXG4gICdtYXJrZG93bicsXG4gICdtZCcsXG4gICdtb25nb2RiJyxcblxuICAnbmdpbngnLFxuICAncHl0aG9uJyxcbiAgJ2pzeCcsXG4gICd0c3gnLFxuICAncmVnZXgnLFxuICAncnVieScsXG4gICdyYicsXG4gICdydXN0JyxcbiAgJ3NxbCcsXG4gICdzdHlsdXMnLFxuICAnc3dpZnQnLFxuICAnd2FzbScsXG4gICd3Z3NsJyxcbiAgJ3ppZycsXG5cbiAgJ3lhbWwnLFxuICAneW1sJyxcbiAgJ3RvbWwnXG5dO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BsdWdpbnMvbGluZU51bWJlclBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2xpbmVOdW1iZXJQbHVnaW4vaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2xpbmVOdW1iZXJQbHVnaW4vaW5kZXguanNcIjtcblxuZnVuY3Rpb24gY29tYmluZUxpbmVOdW0obWQpIHtcbiAgY29uc3QgZmVuY2UgPSBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZVxuICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9ICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3Qgd3JhcHBlclJlZyA9IC88ZGl2IGNsYXNzPVwibGluZS1udW1iZXJzXCJbXFx3XFxzXFxXXSsoPFxcL2Rpdj4pKD89PFxcL2Rpdj4pL2c7XG4gICAgY29uc3QgbGluZVJlZyA9IC88ZGl2IGNsYXNzPVwibGluZS1udW1iZXJcIltcXHdcXHNcXFddKj4oPFxcL2Rpdj4pKD89PFxcL2Rpdj4pL2c7XG5cbiAgICAvLyBcdTUzRDZcdTUxRkFcdTRFRTNcdTc4MDFcdTU3NTdcbiAgICBjb25zdCByYXdDb2RlID0gZmVuY2UoLi4uYXJncyk7XG5cbiAgICBpZiAoIXJhd0NvZGUubWF0Y2god3JhcHBlclJlZykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgd3JhcHBlckNvZGUgPSByYXdDb2RlLm1hdGNoKHdyYXBwZXJSZWcpWzBdO1xuICAgIGNvbnN0IGxpc3QgPSB3cmFwcGVyQ29kZS5tYXRjaChsaW5lUmVnKVswXS5zcGxpdCgnPC9kaXY+Jyk7XG4gICAgY29uc3QgbGluZU51bXMgPSBsaXN0LnNsaWNlKDAsIGxpc3QubGVuZ3RoIC0gMSkubWFwKChsaW5lLCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIGAke2xpbmV9JHtpbmRleCArIDF9PC9kaXY+YDtcbiAgICB9KS5qb2luKCcnKTtcblxuICAgIGNvbnN0IGxpbmVOdW1XcmFwcGVyID0gd3JhcHBlckNvZGUucmVwbGFjZShsaW5lUmVnLCBsaW5lTnVtcyk7XG4gICAgY29uc3QgZmluYWxDb2RlID0gcmF3Q29kZS5yZXBsYWNlKHdyYXBwZXJSZWcsIGxpbmVOdW1XcmFwcGVyKTtcblxuICAgIHJldHVybiBmaW5hbENvZGU7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxpbmVOdW1iZXJQbHVnaW4gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYXBwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICd2dWVwcmVzcy1wbHVnaW4tY29taWNib3JkZXItbGluZU51bWJlcicsXG4gICAgICBleHRlbmRzTWFya2Rvd24obWQsIGFwcCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ21kOicsIG1kKTtcbiAgICAgICAgY29tYmluZUxpbmVOdW0obWQpO1xuXG4gICAgICB9LFxuICAgICAgZXh0ZW5kc1BhZ2UocGFnZSwgYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncGFnZTonLCBwYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9oaWdodGxpZ2h0TGluZVBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2hpZ2h0bGlnaHRMaW5lUGx1Z2luL2luZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9oaWdodGxpZ2h0TGluZVBsdWdpbi9pbmRleC5qc1wiO1xuY29uc3QgUkUgPSAvKD88PVxceylbXFxkLFxccy1dKyg/PVxcfSkvO1xuY29uc3Qgd3JhcHBlclJFID0gL148cHJlIC4qPz48Y29kZT4vO1xuXG5mdW5jdGlvbiBhZGRDb2RlTGluZUhpZ2hsaWdodChtZCkge1xuICBjb25zdCBmZW5jZSA9IG1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlO1xuICBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9ICguLi5hcmdzKSA9PiB7XG5cbiAgICBjb25zdCBbdG9rZW5zLCBpZHgsIG9wdGlvbnNdID0gYXJncztcbiAgICBpZiAoaWR4ICE9PSA0NCkge1xuICAgICAgIHJldHVybiBmZW5jZSguLi5hcmdzKTtcbiAgICB9XG4gICAgZGVidWdnZXI7XG5cbiAgICAvLyBcdTUzRDZcdTUxRkFcdTRFRTNcdTc4MDFcdTU3NTdcbiAgICBjb25zdCBvcmlnaW5Db2RlID0gZmVuY2UoLi4uYXJncyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdO1xuXG4gICAgaWYgKCF0b2tlbi5saW5lTnVtYmVycykge1xuICAgICAgY29uc3QgcmF3SW5mbyA9IHRva2VuLmluZm87XG4gICAgICBpZiAoIXJhd0luZm8gfHwgIVJFLnRlc3QocmF3SW5mbykpIHtcbiAgICAgICAgcmV0dXJuIGZlbmNlKC4uLmFyZ3MpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsYW5nTmFtZSA9IHJhd0luZm8ucmVwbGFjZShSRSwgJycpLnRyaW0oKS5yZXBsYWNlKC8oe3x9KS9nLCAnJyk7XG4gICAgICAvLyBlbnN1cmUgdGhlIG5leHQgcGx1Z2luIGdldCB0aGUgY29ycmVjdCBsYW5nLlxuICAgICAgdG9rZW4uaW5mbyA9IGxhbmdOYW1lO1xuXG4gICAgICB0b2tlbi5saW5lTnVtYmVycyA9IFJFLmV4ZWMocmF3SW5mbylbMF1cbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcCh2ID0+IHYuc3BsaXQoJy0nKS5tYXAodiA9PiBwYXJzZUludCh2LCAxMCkpKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlID0gb3B0aW9ucy5oaWdobGlnaHRcbiAgICAgID8gb3B0aW9ucy5oaWdobGlnaHQodG9rZW4uY29udGVudCwgdG9rZW4uaW5mbylcbiAgICAgIDogdG9rZW4uY29udGVudDtcblxuICAgIGNvbnN0IHJhd0NvZGUgPSBjb2RlLnJlcGxhY2Uod3JhcHBlclJFLCAnJyk7XG4gICAgY29uc3QgaGlnaGxpZ2h0TGluZXNDb2RlID0gcmF3Q29kZS5zcGxpdCgnXFxuJykubWFwKChzcGxpdCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBpbmRleCArIDE7XG4gICAgICBjb25zdCBpblJhbmdlID0gdG9rZW4ubGluZU51bWJlcnMuc29tZSgoW3N0YXJ0LCBlbmRdKSA9PiB7XG4gICAgICAgIGlmIChzdGFydCAmJiBlbmQpIHtcbiAgICAgICAgICByZXR1cm4gbGluZU51bWJlciA+PSBzdGFydCAmJiBsaW5lTnVtYmVyIDw9IGVuZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGluZU51bWJlciA9PT0gc3RhcnQ7XG4gICAgICB9KVxuICAgICAgaWYgKGluUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiaGlnaGxpZ2h0ZWRcIj4mbmJzcDs8L2Rpdj5gO1xuICAgICAgfVxuICAgICAgcmV0dXJuICc8YnI+JztcbiAgICB9KS5qb2luKCcnKVxuXG4gICAgY29uc3QgaGlnaGxpZ2h0TGluZXNXcmFwcGVyQ29kZVxuICAgICAgPSBgPGRpdiBjbGFzcz1cImhpZ2hsaWdodC1saW5lc1wiPiR7aGlnaGxpZ2h0TGluZXNDb2RlfTwvZGl2PmA7XG4gICAgY29uc3QgZmluYWxDb2RlID0gb3JpZ2luQ29kZS5yZXBsYWNlKC9cXDxjb2RlXFw+W1xcc1xcU10qXFw8XFwvY29kZVxcPi8sIGAke2hpZ2hsaWdodExpbmVzV3JhcHBlckNvZGV9PGNvZGU+JHtjb2RlfTwvY29kZT5gKTtcbiAgICByZXR1cm4gZmluYWxDb2RlO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgaGlnaGxpZ2h0TGluZVBsdWdpbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYXBwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwidnVlcHJlc3MtcGx1Z2luLWNvbWljYm9yZGVyLWhpZ2hsaWdodExpbmVcIixcbiAgICAgIGV4dGVuZHNNYXJrZG93bihtZCwgYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm1kOlwiLCBtZCk7XG4gICAgICAgIGFkZENvZGVMaW5lSGlnaGxpZ2h0KG1kKTtcbiAgICAgIH0sXG4gICAgICBleHRlbmRzUGFnZShwYWdlLCBhcHApIHtcbiAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFnZTpcIiwgcGFnZSk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVixTQUFTLGtCQUFrQixtQkFBbUI7OztBQ0FwQyxTQUFTLG9CQUFvQjs7O0FDQTBELE9BQU8sV0FBVztBQUN6YyxPQUFPLFFBQVEsZUFBZTtBQUM5QixTQUFTLHFCQUFxQjs7O0FDYXZCLFNBQVMsbUJBQW1CLEtBQUs7QUFDdEMsTUFBSSxNQUFNLENBQUM7QUFF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RUFDRixDQUFDO0FBQ0g7OztBSHpJQSxTQUFTLGdDQUFnQztBQUN6QyxTQUFTLHFCQUFxQjs7O0FJUjBjLElBQU0sV0FBVztBQUFBLEVBQ3ZmO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjs7O0FDN0ZBLFNBQVMsZUFBZSxJQUFJO0FBQzFCLFFBQU0sUUFBUSxHQUFH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

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
        mathjaxPlugin({
          // 配置项
        })
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lQ29uZmlnLmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL2luZGV4LmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3V0aWxzL3Rvb2xzLmpzIiwgImRvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BhZ2VzL3BhZ2VUb29scy5qcyIsICJkb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2NvbnRhaW5lclBsdWdpbnMuanMiLCAiZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9sYW5ndWFnZVBsdWdpbi5qcyIsICJkb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2xpbmVOdW1iZXJQbHVnaW4vaW5kZXguanMiLCAiZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9oaWdodGxpZ2h0TGluZVBsdWdpbi9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lVXNlckNvbmZpZywgdml0ZUJ1bmRsZXIgfSBmcm9tICd2dWVwcmVzcyc7XG5pbXBvcnQgdGhlbWUgZnJvbSAnLi90aGVtZUNvbmZpZyc7XG5pbXBvcnQgeyBtZWRpdW1ab29tUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1tZWRpdW0tem9vbSc7XG5pbXBvcnQgeyBzZWFyY2hQbHVnaW4gfSBmcm9tICdAdnVlcHJlc3MvcGx1Z2luLXNlYXJjaCc7XG5cbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVVc2VyQ29uZmlnKHtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBiYXNlIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICByb290OiBwcm9jZXNzLmN3ZCgpLFxuICBsYW5nOiAnemgtQ04nLFxuICB0aXRsZTogJ011cmF5XFwncyBzcGFjZScsXG4gIGRlc2NyaXB0aW9uOiAnXHU4RkQ5XHU2NjJGXHU2MjExXHU3Njg0XHU0RTJBXHU0RUJBXHU1MzVBXHU1QkEyXHU3QUQ5XHU3MEI5JyxcbiAgLy8gaGVhZDogW1snbGluaycsIHsgcmVsOiAnaWNvbicsIGhyZWY6ICcvaW1hZ2VzL2xvZ28ucG5nJyB9XV0sXG4gIC8vIHRoZW1lOiAnZGVmYXVsdCcsXG4gIC8vIGJ1bmRsZXI6ICd2dWVwcmVzcycsXG4gIGRlYnVnOiB0cnVlLFxuICBwYWdlUGF0dGVybnM6IFsnKiovKi5tZCcsICchUkVBRE1FLm1kJywgJyEudnVlcHJlc3MnLCAnIW5vZGVfbW9kdWxlcyddLFxuICAvLyBwZXJtYWxpbmtQYXR0ZXJuOiAnOnllYXInLFxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGV2IGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgcG9ydDogMTgwMDIsXG4gIC8vIG9wZW46IHRydWUsXG4gIC8vIHRlbXBsYXRlRGV2OiAnQHZ1ZXByZXNzL2NsaWVudC90ZW1wbGF0ZXMvZGV2Lmh0bWwnLFxuXG4gIC8vYnVpbGQgY29uZmlnXG4gIHNob3VsZFByZWxvYWQ6IHRydWUsXG4gIHNob3VsZFByZWZldGNoOiB0cnVlLFxuICAvLyB0ZW1wbGF0ZUJ1aWxkOiAnQHZ1ZXByZXNzL2NsaWVudC90ZW1wbGF0ZXMvYnVpbGQuaHRtbCcsXG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBtYXJrZG93biBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbWFya2Rvd246IHt9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIHBsdWdpbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgcGx1Z2luczogW1xuICAgIHNlYXJjaFBsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICB9KSxcbiAgXSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSB0aGVtZSAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB0aGVtZTogdGhlbWUsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYnVuZGxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBidW5kbGVyOiB2aXRlQnVuZGxlcih7XG4gICAgdml0ZU9wdGlvbnM6IHtcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIHRhcmdldDogJ21vZHVsZXMnLFxuICAgICAgfSxcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgICAgJ3Z1ZScsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICduYWl2ZS11aSc6IFtcbiAgICAgICAgICAgICAgICAvLyAndXNlRGlhbG9nJyxcbiAgICAgICAgICAgICAgICAvLyAndXNlTWVzc2FnZScsXG4gICAgICAgICAgICAgICAgLy8gJ3VzZU5vdGlmaWNhdGlvbicsXG4gICAgICAgICAgICAgICAgLy8gJ3VzZUxvYWRpbmdCYXInXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgICByZXNvbHZlcnM6IFtOYWl2ZVVpUmVzb2x2ZXIoKV1cbiAgICAgICAgfSlcbiAgICAgIF0sXG4gICAgfSxcbiAgfSlcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lQ29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWVDb25maWcuanNcIjtpbXBvcnQgeyBkZWZhdWx0VGhlbWUgfSBmcm9tICd2dWVwcmVzcyc7XG5pbXBvcnQgeyBjb21pY2JvcmRlclRoZW1lIH0gZnJvbSAnLi90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9pbmRleC5qcyc7XG5cblxuLy8gZXhwb3J0IGRlZmF1bHQgZGVmYXVsdFRoZW1lKHtcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBiYXNlIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICBsb2dvOiAnL2Fzc2V0cy9hdmF0YXIyLnBuZycsXG4vLyAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vQnJhdmVjaGVuJyxcbi8vICAgLy8gcmVwb0xhYmVsOiAnJyxcbi8vICAgbGFzdFVwZGF0ZWQ6IHRydWUsXG4vLyAgIGxhc3RVcGRhdGVkVGV4dDogJ1x1NEUwQVx1NkIyMVx1NjZGNFx1NjVCMCcsXG4vLyAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gbmF2aWdhdGlvbiBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vICAgaG9tZTogJy8nLFxuLy8gICBuYXZiYXI6IFtcbi8vICAgICB7XG4vLyAgICAgICB0ZXh0OiAnXHU5OTk2XHU5ODc1Jyxcbi8vICAgICAgIGxpbms6ICcvJ1xuLy8gICAgIH0sXG4vLyAgICAge1xuLy8gICAgICAgdGV4dDogJ1x1NjU4N1x1N0FFMCcsXG4vLyAgICAgICBsaW5rOiAnL2FydGljbGVzLydcbi8vICAgICB9LFxuLy8gICAgIHtcbi8vICAgICAgIHRleHQ6ICdcdTVGNTJcdTY4NjMnLFxuLy8gICAgICAgbGluazogJy9hcmNoaXZlcy8nXG4vLyAgICAgfSxcbi8vICAgICB7XG4vLyAgICAgICB0ZXh0OiAnXHU1MTczXHU0RThFXHU2MjExJyxcbi8vICAgICAgIGxpbms6ICcvYWJvdXQvJ1xuLy8gICAgIH1cbi8vICAgXSxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBzaWRlYmFyIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICAvLyBzaWRlYmFyOiB7XG5cbi8vICAgLy8gfSxcbi8vICAgLy8gc2lkZWJhckRlcHRoOiAyLFxuLy8gICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIHBhZ2UgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAgIGVkaXRMaW5rOiBmYWxzZSxcbi8vICAgZWRpdExpbmtUZXh0OiAnJyxcbi8vICAgZWRpdExpbmtQYXR0ZXJuOiAnJyxcbi8vICAgZG9jc1JlcG86ICcnLFxuLy8gICBkb2NzQnJhbmNoOiAnJyxcbi8vICAgZG9jc0RpcjogJycsXG4vLyAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29udHJpYnV0b3JzIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICBjb250cmlidXRvcnM6IGZhbHNlLFxuLy8gICBjb250cmlidXRvcnNUZXh0OiAnJyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBhcnRpY2xlIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICB0aXA6ICdcdTVDMEZcdTYzRDBcdTc5M0EnLFxuLy8gICB3YXJuaW5nOiAnXHU2Q0U4XHU2MTBGJyxcbi8vICAgZGFuZ2VyOiAnXHU4QjY2XHU1NDRBJyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSA0MDQgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAgIG5vdEZvdW5kOiBbJ1x1NjAwNVx1NzEzNlx1ODJFNVx1NTkzMVx1RkYwQ1x1OTg3NVx1OTc2Mlx1NEUwRFx1ODlDMVx1NEU4NicsICdcdTRGNjBcdTY3NjVcdTUyMzBcdTRFODZcdTZDQTFcdTY3MDlcdTc3RTVcdThCQzZcdTc2ODRcdTgzNTJcdTUzOUYnLCAnXHU0RjYwXHU2NzY1XHU1MjMwXHU0RTg2XHU2Q0ExXHU2NzA5XHU3RjUxXHU3RURDXHU3Njg0XHU4MzUyXHU1MzlGJywgJ1x1NEY2MFx1Njc2NVx1NTIzMFx1NEU4Nlx1NkNBMVx1NjcwOVx1NzA3NVx1NjExRlx1NzY4NFx1NEUxNlx1NzU0QyddLFxuLy8gICBiYWNrVG9Ib21lOiAnXHU5OTk2XHU5ODc1XHU0RjIwXHU5MDAxXHU5NUU4Jyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBhcmlhIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gICBvcGVuSW5OZXdXaW5kb3c6ICdcdTU3MjhcdTY1QjBcdTdBOTdcdTUzRTNcdTYyNTNcdTVGMDAnLFxuLy8gICB0b2dnbGVDb2xvck1vZGU6ICdcdTZERjFcdTgyNzJcdTZBMjFcdTVGMEYnLFxuLy8gICB0b2dnbGVTaWRlYmFyOiAnXHU1MjA3XHU2MzYyXHU0RkE3XHU4RkI5XHU2ODBGJyxcbi8vICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSB0aGVtZSBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vICAgdGhlbWVQbHVnaW5zOiB7XG4vLyAgICAgYWN0aXZlSGVhZGVyTGlua3M6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLWFjdGl2ZS1oZWFkZXItbGlua3MgXHUzMDAyXG4vLyAgICAgYmFja1RvVG9wOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggQHZ1ZXByZXNzL3BsdWdpbi1iYWNrLXRvLXRvcCBcdTMwMDJcbi8vICAgICAvLyBjb250YWluZXI6IFtdLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcdTc1MzEgQHZ1ZXByZXNzL3BsdWdpbi1jb250YWluZXIgXHU2NTJGXHU2MzAxXHU3Njg0XHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHUzMDAyXG4vLyAgICAgZXh0ZXJuYWxMaW5rSWNvbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tZXh0ZXJuYWwtbGluay1pY29uIFx1MzAwMlxuLy8gICAgIGdpdDogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tZ2l0IFx1MzAwMlxuLy8gICAgIG1lZGl1bVpvb206IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLW1lZGl1bS16b29tIFx1MzAwMlxuLy8gICAgIG5wcm9ncmVzczogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tbnByb2dyZXNzIFx1MzAwMlxuLy8gICB9XG4vLyB9KTtcblxuZXhwb3J0IGRlZmF1bHQgY29taWNib3JkZXJUaGVtZSh7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmFzZSBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbG9nbzogJy9hc3NldHMvYXZhdGFyMi5wbmcnLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL0JyYXZlY2hlbicsXG4gIC8vIHJlcG9MYWJlbDogJycsXG4gIGxhc3RVcGRhdGVkOiB0cnVlLFxuICBsYXN0VXBkYXRlZFRleHQ6ICdcdTRFMEFcdTZCMjFcdTY2RjRcdTY1QjAnLFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIG5hdmlnYXRpb24gY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGhvbWU6ICcvJyxcbiAgbmF2YmFyOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1OTk5Nlx1OTg3NScsXG4gICAgICBsaW5rOiAnLycsXG4gICAgICBpY29uOiAnaWNvbi1ob21lJyxcbiAgICAgIG5hbWU6ICdob21lJ1xuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1x1NTIwNlx1N0M3QicsXG4gICAgICBsaW5rOiAnL2NhdGVnb3JpZXMvJyxcbiAgICAgIGljb246ICdpY29uLWNhdGVnb3J5JyxcbiAgICAgIG5hbWU6ICdjYXRlZ29yeSdcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTVGNTJcdTY4NjMnLFxuICAgICAgbGluazogJy9hcmNoaXZlcy8nLFxuICAgICAgaWNvbjogJ2ljb24tYXJjaGl2ZScsXG4gICAgICBuYW1lOiAnYXJjaGl2ZXMnXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU2ODA3XHU3QjdFJyxcbiAgICAgIGxpbms6ICcvdGFncy8nLFxuICAgICAgaWNvbjogJ2ljb24tdGFncycsXG4gICAgICBuYW1lOiAndGFncydcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTUxNzNcdTRFOEVcdTYyMTEnLFxuICAgICAgbGluazogJy9hYm91dC8nLFxuICAgICAgaWNvbjogJ2ljb24tYWJvdXQnLFxuICAgICAgbmFtZTogJ2Fib3V0J1xuICAgIH1cbiAgXSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBzaWRlYmFyIGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBzaWRlYmFyOiB7XG4gICAgc3ViVGl0bGU6ICdcdTdFQjVcdTY3MDlcdTc1QkVcdTk4Q0VcdThENzdcdUZGMENcdTRFQkFcdTc1MUZcdTRFMERcdThBMDBcdTVGMDMnLFxuICAgIHNvY2lhbHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvbjogJ2dpdGh1YicsXG4gICAgICAgIHRpdGxlOiAnbXkgZ2l0aHViJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9CcmF2ZWNoZW4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiAnL2Fzc2V0cy9pY29ucy9naXRlZS5zdmcnLFxuICAgICAgICB0aXRsZTogJ1x1NzgwMVx1NEU5MScsXG4gICAgICAgIGxpbms6ICdodHRwczovL2dpdGVlLmNvbS9tdXJheScsXG4gICAgICAgIGljb25TaXplOiAnMS4zNzVyZW0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uOiAnRW1haWwnLFxuICAgICAgICB0aXRsZTogJ211cmF5XzIwMThAMTYzLmNvbScsXG4gICAgICAgIGxpbms6ICdtYWlsdG86bXVyYXlfMjAxOEAxNjMuY29tJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgLy8gc2lkZWJhckRlcHRoOiAyLFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIHBhZ2UgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGVkaXRMaW5rOiBmYWxzZSxcbiAgZWRpdExpbmtUZXh0OiAnJyxcbiAgZWRpdExpbmtQYXR0ZXJuOiAnJyxcbiAgZG9jc1JlcG86ICcnLFxuICBkb2NzQnJhbmNoOiAnJyxcbiAgZG9jc0RpcjogJycsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYXJ0aWNsZXMgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGFydGljbGVzOiB7XG4gICAgcGVyUGFnZTogMTAsIC8vIFx1NkJDRlx1OTg3NVx1NjYzRVx1NzkzQVx1NzY4NFx1NjU4N1x1N0FFMFx1NjU3MFx1OTFDRlxuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGNvbnRyaWJ1dG9ycyBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29udHJpYnV0b3JzOiBmYWxzZSxcbiAgY29udHJpYnV0b3JzVGV4dDogJycsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYXJ0aWNsZSBjb250ZW50IGNvbmZpZyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB0aXA6ICdcdTVDMEZcdTYzRDBcdTc5M0EnLFxuICB3YXJuaW5nOiAnXHU2Q0U4XHU2MTBGJyxcbiAgZGFuZ2VyOiAnXHU4QjY2XHU1NDRBJyxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSA0MDQgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIG5vdEZvdW5kOiBbJ1x1NjAwNVx1NzEzNlx1ODJFNVx1NTkzMVx1RkYwQ1x1OTg3NVx1OTc2Mlx1NEUwRFx1ODlDMVx1NEU4NicsICdcdTRGNjBcdTY3NjVcdTUyMzBcdTRFODZcdTZDQTFcdTY3MDlcdTc3RTVcdThCQzZcdTc2ODRcdTgzNTJcdTUzOUYnLCAnXHU0RjYwXHU2NzY1XHU1MjMwXHU0RTg2XHU2Q0ExXHU2NzA5XHU3RjUxXHU3RURDXHU3Njg0XHU4MzUyXHU1MzlGJywgJ1x1NEY2MFx1Njc2NVx1NTIzMFx1NEU4Nlx1NkNBMVx1NjcwOVx1NzA3NVx1NjExRlx1NzY4NFx1NEUxNlx1NzU0QyddLFxuICBiYWNrVG9Ib21lOiAnXHU5OTk2XHU5ODc1XHU0RjIwXHU5MDAxXHU5NUU4JyxcbiAgbm90Rm91bmRCZzogJy9hc3NldHMvNDA0LnBuZycsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gYXJpYSBjb25maWcgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgb3BlbkluTmV3V2luZG93OiAnXHU1NzI4XHU2NUIwXHU3QTk3XHU1M0UzXHU2MjUzXHU1RjAwJyxcbiAgdG9nZ2xlQ29sb3JNb2RlOiAnXHU2REYxXHU4MjcyXHU2QTIxXHU1RjBGJyxcbiAgdG9nZ2xlU2lkZWJhcjogJ1x1NTIwN1x1NjM2Mlx1NEZBN1x1OEZCOVx1NjgwRicsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gdGhlbWUgY29uZmlnIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHRoZW1lUGx1Z2luczoge1xuICAgIGFjdGl2ZUhlYWRlckxpbmtzOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggQHZ1ZXByZXNzL3BsdWdpbi1hY3RpdmUtaGVhZGVyLWxpbmtzIFx1MzAwMlxuICAgIGJhY2tUb1RvcDogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4IEB2dWVwcmVzcy9wbHVnaW4tYmFjay10by10b3AgXHUzMDAyXG4gICAgLy8gY29udGFpbmVyOiBbXSwgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHU3NTMxIEB2dWVwcmVzcy9wbHVnaW4tY29udGFpbmVyIFx1NjUyRlx1NjMwMVx1NzY4NFx1ODFFQVx1NUI5QVx1NEU0OVx1NUJCOVx1NTY2OFx1MzAwMlxuICAgIGV4dGVybmFsTGlua0ljb246IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLWV4dGVybmFsLWxpbmstaWNvbiBcdTMwMDJcbiAgICBnaXQ6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLWdpdCBcdTMwMDJcbiAgICBtZWRpdW1ab29tOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggQHZ1ZXByZXNzL3BsdWdpbi1tZWRpdW0tem9vbSBcdTMwMDJcbiAgICBucHJvZ3Jlc3M6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBAdnVlcHJlc3MvcGx1Z2luLW5wcm9ncmVzcyBcdTMwMDJcbiAgfVxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9pbmRleC5qc1wiO2ltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgcGF0aCwgeyBkaXJuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IGZpbHRlck5hdlBhZ2VzSW5kZXhMYXlvdXQsIGZpbHRlckFydFBhZ2VzTGF5b3V0LCBjb21iaW5lQW5kU2V0UGFnZXNEYXRhIH0gZnJvbSAnLi9wYWdlcy9wYWdlVG9vbHMuanMnO1xuaW1wb3J0IHsgYmFja1RvVG9wUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1iYWNrLXRvLXRvcCc7XG5cbmltcG9ydCB7IHRpcENvbnRhaW5lclBsdWdpbnMsIHNwZWNDb250YWluZXJQbHVnaW5zLCBjb2RlQ29udGFpbmVyUGx1Z2lucyB9IGZyb20gJy4vcGx1Z2lucy9jb250YWluZXJQbHVnaW5zLmpzJztcbmltcG9ydCB7IHJlZ2lzdGVyQ29tcG9uZW50c1BsdWdpbiB9IGZyb20gJ0B2dWVwcmVzcy9wbHVnaW4tcmVnaXN0ZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBwcmlzbWpzUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1wcmlzbWpzJztcbmltcG9ydCB7IHN1cHBlcmxzIH0gZnJvbSAnLi9wbHVnaW5zL2xhbmd1YWdlUGx1Z2luLmpzJztcbmltcG9ydCB7IGxpbmVOdW1iZXJQbHVnaW4gfSBmcm9tICcuL3BsdWdpbnMvbGluZU51bWJlclBsdWdpbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBoaWdobGlnaHRMaW5lUGx1Z2luIH0gZnJvbSAnLi9wbHVnaW5zL2hpZ2h0bGlnaHRMaW5lUGx1Z2luL2luZGV4LmpzJztcbmltcG9ydCB7IGdpdFBsdWdpbiB9IGZyb20gJ0B2dWVwcmVzcy9wbHVnaW4tZ2l0JztcbmltcG9ydCB7IGFjdGl2ZUhlYWRlckxpbmtzUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1hY3RpdmUtaGVhZGVyLWxpbmtzJztcbmltcG9ydCBtYXRoamF4UGx1Z2luIGZyb20gJ3Z1ZXByZXNzLXBsdWdpbi1tYXRoamF4Jztcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBcdTYzRDJcdTRFRjZcdTc2RUVcdTVGNTVcbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGNvbWJpbmVTaXRlRGF0YShzaXRlRGF0YSA9IHt9LCB0aGVtZUNvbmZpZ3MgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIC4uLnNpdGVEYXRhLFxuICAgIGFydGljbGVzRGF0YToge1xuICAgICAgYXJ0UGVyUGFnZU1heDogdGhlbWVDb25maWdzLmFydGljbGVzPy5wZXJQYWdlIHx8IDEwLFxuICAgICAgYXJ0aWNsZXM6IHt9LCAvLyBcdTYyNDBcdTY3MDlcdTY1ODdcdTdBRTBcdTc2ODRcdTY1NzBcdTYzNkUsa2V5XHU0RTNBXHU2NTg3XHU3QUUwaWQsIHZhbHVlXHU0RTNBXHU2NTg3XHU3QUUwXHU2NTcwXHU2MzZFXG4gICAgICBhcnRpY2xlTGlzdDogW10sIC8vIFx1NEUwRFx1NTIwNlx1OTg3NVx1NzY4NFx1NjU4N1x1N0FFMGlkXHU1MjE3XHU4ODY4XG4gICAgICBhcnRpY2xlUGFnZXM6IFtbXV0sIC8vIFx1NTIwNlx1OTg3NVx1NzY4NFx1NjU4N1x1N0FFMGlkXHU1MjE3XHU4ODY4XG4gICAgICBhcnRMaXN0QnlZZWFyOiB7fSwgLy8gXHU2MzA5XHU1RTc0XHU0RUZEXHU1RjUyXHU2ODYzXHU3Njg0XHU2NTg3XHU3QUUwaWRcdTUyMTdcdTg4NjhcbiAgICAgIGFydFRhZ3M6IHt9LCAvLyBcdTYyNDBcdTY3MDlcdTY4MDdcdTdCN0UsIGtleVx1NEUzQVx1NjgwN1x1N0I3RWlkLCB2YWx1ZVx1NEUzQVx1NjgwN1x1N0I3RVx1NjU3MFx1NjM2RVxuICAgICAgYXJ0TGlzdEJ5VGFnOiB7fSwgLy8gXHU2MzA5XHU2ODA3XHU3QjdFXHU1RjUyXHU2ODYzXHU3Njg0XHU2NTg3XHU3QUUwaWRcdTUyMTdcdTg4NjhcbiAgICAgIGFydENhdGVnb3JpZXM6IHt9LCAvLyBcdTYyNDBcdTY3MDlcdTUyMDZcdTdDN0IsIGtleVx1NEUzQVx1NTIwNlx1N0M3QmlkLCB2YWx1ZVx1NEUzQVx1NTIwNlx1N0M3Qlx1NjU3MFx1NjM2RVxuICAgICAgYXJ0TGlzdEJ5Q2F0ZWdvcnk6IHt9LCAvLyBcdTYzMDlcdTUyMDZcdTdDN0JcdTVGNTJcdTY4NjNcdTc2ODRcdTY1ODdcdTdBRTBpZFx1NTIxN1x1ODg2OFxuICAgIH0sXG4gICAgdGhlbWU6IHtcbiAgICAgIGxvZ286IHRoZW1lQ29uZmlncy5sb2dvIHx8ICcnLFxuICAgICAgbmF2czogWy4uLih0aGVtZUNvbmZpZ3MubmF2YmFyIHx8IFtdKV0sXG4gICAgICBzb2NpYWxzOiBbLi4uKHRoZW1lQ29uZmlncy5zaWRlYmFyPy5zb2NpYWxzIHx8IFtdKV0sXG4gICAgICBzdWJUaXRsZTogdGhlbWVDb25maWdzLnNpZGViYXI/LnN1YlRpdGxlIHx8ICcnLFxuICAgICAgZXJyNDA0OiB7XG4gICAgICAgIG5vdEZvdW5kOiB0aGVtZUNvbmZpZ3Mubm90Rm91bmQgfHwgWydcdTRFMDdcdTUyMDZcdTYyQjFcdTZCNDlcdUZGMENcdTYwQThcdTYyN0VcdTc2ODRcdThGRDlcdTRFMDBcdTk4NzVcdTYyMTFcdTZDQTFcdThGRDhcdTUxOTkuLi4nXSxcbiAgICAgICAgYmFja1RvSG9tZTogdGhlbWVDb25maWdzLmJhY2tUb0hvbWUgfHwgJ1x1OEZENFx1NTZERVx1OTk5Nlx1OTg3NScsXG4gICAgICAgIG5vdEZvdW5kQmc6IHRoZW1lQ29uZmlncy5ub3RGb3VuZEJnIHx8ICcnLFxuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IGNvbWljYm9yZGVyVGhlbWUgPSAoY2xpZW50VGhlbWVPcHQsIC4uLmFyZ3MpID0+IHtcbiAgLy8gZGVidWdnZXI7XG4gIC8vIGNvbnNvbGUubG9nKCdcdTc1MjhcdTYyMzdcdTRFM0JcdTk4OThcdTkxNERcdTdGNkU6JywgY2xpZW50VGhlbWVPcHQpO1xuICAvLyBvcHRpb25zXHU2NjJGXHU3NTI4XHU2MjM3XHU5MTREXHU3RjZFXHU3Njg0XHU0RTNCXHU5ODk4XHU5MDA5XHU5ODc5XHU5MTREXHU3RjZFXG4gIC8vIGFwcFx1NTMwNVx1NTQyQlx1NEU4Nm5vZGUgYXBpXG4gIHJldHVybiAoYXBwKSA9PiB7XG4gICAgLy8gZGVidWdnZXI7XG4gICAgY29uc3QgeyBzaXRlRGF0YSwgb3B0aW9ucyB9ID0gYXBwO1xuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3NpdGVEYXRhOicsIHNpdGVEYXRhLCdcXG4nLFxuICAgIC8vICAgJ29wdGlvbnM6Jywgb3B0aW9ucywnXFxuJyxcbiAgICAvLyAgICdhcHAuZGlyOicsICdcXG4nLFxuICAgIC8vICAgJ2NhY2hlOicsIGFwcC5kaXIuY2FjaGUoKSwnXFxuJyxcbiAgICAvLyAgICdzb3VyY2U6JywgYXBwLmRpci5zb3VyY2UoKSwnXFxuJyxcbiAgICAvLyAgICd0ZW1wOicsIGFwcC5kaXIudGVtcCgpLCdcXG4nLFxuICAgIC8vICk7XG4gICAgYXBwLnNpdGVEYXRhID0gY29tYmluZVNpdGVEYXRhKHNpdGVEYXRhLCBjbGllbnRUaGVtZU9wdCk7XG4gICAgLy8gXHU4RkQ0XHU1NkRFXHU0RTAwXHU0RTJBXHU0RTNCXHU5ODk4XHU1QkY5XHU4QzYxXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICd2dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlcicsXG5cbiAgICAgIC8vIFx1NEUzQlx1OTg5OFx1NzY4NFx1NUJBMlx1NjIzN1x1N0FFRlx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1NzY4NFx1OERFRlx1NUY4NFxuICAgICAgY2xpZW50Q29uZmlnRmlsZTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2NsaWVudC5qcycpLFxuXG4gICAgICAvLyBcdThCQkVcdTdGNkVcdTgxRUFcdTVCOUFcdTRFNDkgZGV2IC8gYnVpbGQgXHU2QTIxXHU2NzdGXG4gICAgICB0ZW1wbGF0ZUJ1aWxkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndGVtcGxhdGVzL2J1aWxkLmh0bWwnKSxcbiAgICAgIHRlbXBsYXRlRGV2OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndGVtcGxhdGVzL2Rldi5odG1sJyksXG5cbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjNEMlx1NEVGNlxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBiYWNrVG9Ub3BQbHVnaW4oKSxcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSB0aXAgY29udGFpbmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC4uLnRpcENvbnRhaW5lclBsdWdpbnMsXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gc3BlYyBjb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLi4uc3BlY0NvbnRhaW5lclBsdWdpbnMsXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29kZSBjb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLi4uY29kZUNvbnRhaW5lclBsdWdpbnMsXG4gICAgICAgIHJlZ2lzdGVyQ29tcG9uZW50c1BsdWdpbih7XG4gICAgICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAgICAgJ2NvZGVncm91cCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2dsb2JhbC1jb21wb25lbnRzL0NvZGVHcm91cC52dWUnKSxcbiAgICAgICAgICAgICdjb2RlZ3JvdXBpdGVtJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vZ2xvYmFsLWNvbXBvbmVudHMvQ29kZUdyb3VwSXRlbS52dWUnKSxcbiAgICAgICAgICAgICdCYWRnZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2dsb2JhbC1jb21wb25lbnRzL0JhZGdlLnZ1ZScpLFxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gcHJpc21qcyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBwcmlzbWpzUGx1Z2luKHtcbiAgICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgICAgICBwcmVsb2FkTGFuZ3VhZ2VzOiBbXG4gICAgICAgICAgICAuLi5zdXBwZXJsc1xuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGxpbmUgbnVtYmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxpbmVOdW1iZXJQbHVnaW4oe1xuICAgICAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgICB9KSxcbiAgICAgICAgaGlnaGxpZ2h0TGluZVBsdWdpbih7XG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU5ODc5XG4gICAgICAgIH0pLFxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGdpdCAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBnaXRQbHVnaW4oe1xuICAgICAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgICB9KSxcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBhY3RpdmUgaGVhZGVyIGxpbmtzIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGFjdGl2ZUhlYWRlckxpbmtzUGx1Z2luKHtcbiAgICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgICAgfSksXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWF0aGpheCAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBtYXRoamF4UGx1Z2luKHtcbiAgICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgICAgfSlcbiAgICAgIF0sXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tIGRldiBjeWNsZSAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZXh0ZW5kc1BhZ2VPcHRpb25zKHBhZ2VPcHQsIGFwcCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGFnZU9wdCk7XG4gICAgICAgIGZpbHRlckFydFBhZ2VzTGF5b3V0KHBhZ2VPcHQsIGFwcC5kaXIuc291cmNlKCdhcnRpY2xlcy8nKSk7XG4gICAgICB9LFxuICAgICAgZXh0ZW5kc1BhZ2UocGFnZSwgYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYWdlKTtcbiAgICAgICAgLy8gZmlsdGVyTmF2UGFnZXNJbmRleExheW91dChwYWdlKTtcbiAgICAgICAgbGV0IG9iaiA9IGNvbWJpbmVBbmRTZXRQYWdlc0RhdGEocGFnZSwgYXBwKTtcbiAgICAgICAgcGFnZSA9IG9iai5wYWdlO1xuICAgICAgICBhcHAgPSBvYmouYXBwO1xuICAgICAgfSxcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0gbGlmZSBjeWNsZSAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gXHU1MTc2XHU0RUQ2XHU3Njg0XHU2M0QyXHU0RUY2IEFQSSBcdTRFNUZcdTkwRkRcdTUzRUZcdTc1MjhcbiAgICAgIC8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1RkYwQ1x1NEUzQlx1OTg5OFx1RkYwQ1x1NjNEMlx1NEVGNlx1NTQ4Q1x1OTg3NVx1OTc2Mlx1NURGMlx1N0VDRlx1NTJBMFx1OEY3RFxuICAgICAgb25Jbml0aWFsaXplZChhcHApIHtcbiAgICAgICAgLy8gZGVidWdnZXI7XG5cbiAgICAgIH0sXG4gICAgICAvLyBcdTY1ODdcdTRFRjZcdTUxQzZcdTU5MDdcdTVCOENcdTZCRDVcdUZGMENcdTc1MjhcdTYyMzdjbGllbnRcdTkxNERcdTdGNkVcdTRFNUZcdTUxQzZcdTU5MDdcdTU5N0RcdTRFODZcbiAgICAgIG9uUHJlcGFyZWQoYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncGFnZXM6JywgYXBwLnBhZ2VzKTtcblxuICAgICAgfSxcbiAgICAgIC8vIGRldlx1NjcwRFx1NTJBMVx1NTY2OFx1NTQyRlx1NTJBOFx1RkYwQ1x1NzZEMVx1NTQyQ1x1NjU4N1x1NEVGNlx1NEZFRVx1NjUzOVxuICAgICAgb25XYXRjaGVkKGFwcCwgd2F0Y2hlcnMsIHJlc3RhcnQpIHtcbiAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKCdkZXYgc2VydmVyIGlzIGxpc3RlbmluZyBmaWxlIGNoYW5nZScpKTtcbiAgICAgIH0sXG4gICAgICAvLyBwcm9cdTk2MzZcdTZCQjVcdUZGMENcdTVCOENcdTYyMTBcdTk3NTlcdTYwMDFcdTY1ODdcdTRFRjZcdTc1MUZcdTYyMTBcdTU0MEVcdThDMDNcdTc1MjhcbiAgICAgIG9uR2VuZXJhdGVkKGFwcCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsuYmdHcmVlbignR2VuZXJhdGVkIHBhZ2VzIGNvbXBsZXRlZCEnKSk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG59O1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3V0aWxzL3Rvb2xzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvdXRpbHMvdG9vbHMuanNcIjsvLyBcdTk2OEZcdTY3M0FcdTVCNTdcdTdCMjZcdTRFMzJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21TdHIoKSB7XG4gIHJldHVybiAoKE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZik+PjApLnRvU3RyaW5nKDE2KTtcbn1cblxuLy8gXHU4M0I3XHU1M0Q2XHU5NjhGXHU2NzNBXHU3RUM0XHU1NDA4XHU1QjU3XHU3QjI2XHU0RTMyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3lzSWQoKSB7XG4gIHJldHVybiBgJHtyYW5kb21TdHIoKX0tJHtyYW5kb21TdHIoKX1gO1xufVxuXG4vKipcbiAqIFx1NUMwNlx1NUI1N1x1N0IyNlx1NEUzMlx1OEY2Q1x1NjM2Mlx1NjMwN1x1NUI5QVx1NzY4NHVuaWNvZGVcdTY4M0NcdTVGMEZcbiAqIEBwYXJhbSB7Kn0gc3RyXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyMnVuaWNvZGVGb3JtYXRlKHN0cikge1xuICBsZXQgcmV0ID0gW107XG5cbiAgbGV0IGdhcCA9ICckXyQnO1xuXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdHIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBsZXQgdXN0ciA9ICcnO1xuICAgIGxldCBjb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgbGV0IGNvZGUxNiA9IGNvZGUudG9TdHJpbmcoMTYpO1xuXG4gICAgaWYgKGNvZGUgPCAweGYpIHtcbiAgICAgIHVzdHIgPSBgMDAwJHtjb2RlMTZ9YDtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGZmKSB7XG4gICAgICB1c3RyID0gYDAwJHtjb2RlMTZ9YDtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGZmZikge1xuICAgICAgdXN0ciA9IGAwJHtjb2RlMTZ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXN0ciA9IGAke2NvZGUxNn1gO1xuICAgIH1cbiAgICByZXQucHVzaCh1c3RyKTtcbiAgfVxuXG4gIHJldHVybiByZXQuam9pbihnYXApO1xufVxuXG4vKipcbiAqIFx1NUMwNlx1NjMwN1x1NUI5QVx1NzY4NHVuaWNvZGVcdTY4M0NcdTVGMEZcdThGNkNcdTYzNjJcdTVCNTdcdTdCMjZcdTRFMzJcbiAqIEBwYXJhbSB7Kn0gc3RyXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pY29kZUZvcm1hdGUyc3RyKHN0cikge1xuICBsZXQgcmV0ID0gJ1xcXFx1JyArIHN0ci5yZXBsYWNlKC9cXCRcXF9cXCQvZywgJ1xcXFx1Jyk7XG4gIC8vIGNvbnNvbGUubG9nKHJldCk7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oYHJldHVybiAnJHtyZXR9J2ApKCk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGFnZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGFnZXMvcGFnZVRvb2xzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGFnZXMvcGFnZVRvb2xzLmpzXCI7aW1wb3J0IHsgc3RyMnVuaWNvZGVGb3JtYXRlIH0gZnJvbSBcIi4uL3V0aWxzL3Rvb2xzXCI7XG5cbmNvbnN0IE5BVl9QQUdFU19JTkRFWF9MQVlPVVRTID0ge1xuICBob21lOiBcIkhvbWVMYXlvdXRcIixcbiAgYWJvdXQ6IFwiQWJvdXRMYXlvdXRcIixcbiAgYXJ0aWNsZXM6IFwiQXJ0aWNsZXNMYXlvdXRcIixcbiAgYXJjaGl2ZXM6IFwiQXJjaGl2ZXNMYXlvdXRcIixcbiAgY2F0ZWdvcmllczogXCJDYXRlZ29yaWVzTGF5b3V0XCIsXG4gIGFydGljbGVQYWdlOiBcIkFydGljbGVQYWdlTGF5b3V0XCIsXG4gIHRhZ3M6IFwiVGFnc0xheW91dFwiLFxuICBkZWZhdWx0TGF5b3V0OiBcIkxheW91dFwiLFxufTtcblxuZnVuY3Rpb24gc2V0UGFnZVdpZGdldCh7IHBhZ2UsIGFwcCB9KSB7XG4gIGlmICghcGFnZSB8fCAhcGFnZS5mcm9udG1hdHRlcikge1xuICAgIHJldHVybiB7IHBhZ2UsIGFwcCB9O1xuICB9XG5cbiAgcGFnZS5mcm9udG1hdHRlci53aWRnZXQgPSB7XG4gICAgY2FsZW5kYXI6IHRydWUsXG4gICAgdGFnczogdHJ1ZSxcbiAgICBjYXRlZ29yeTogdHJ1ZSxcbiAgICBhcmNoaXZlczogdHJ1ZSxcbiAgICAuLi4ocGFnZS5mcm9udG1hdHRlci53aWRnZXQgfHwge30pXG4gIH07XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG59XG5cbi8qKlxuICogXHU5MUNEXHU3RjZFYXJpdGNsZVx1OUVEOFx1OEJBNFx1OERFRlx1NzUzMVx1NUJGOVx1NUU5NFx1OTg3NVx1OTc2Mlx1NzY4NFx1NUM1RVx1NjAyN1xuICogQHBhcmFtIHsqfSBwYXJhbTBcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHJlc2V0QXJ0aWNsZUluZGV4KHsgcGFnZSwgYXBwIH0pIHtcbiAgaWYgKCFwYWdlIHx8ICFwYWdlLmZyb250bWF0dGVyIHx8ICFwYWdlLmZyb250bWF0dGVyLmFydGljbGVQYWdlKSB7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG4gIH1cblxuICBpZiAocGFnZS5mcm9udG1hdHRlci5hcnRpY2xlcyAmJiBwYWdlLmZyb250bWF0dGVyLmFydGljbGVQYWdlKSB7XG4gICAgcGFnZS5mcm9udG1hdHRlci5hcnRpY2xlUGFnZSA9IGZhbHNlO1xuICAgIHJldHVybiB7IHBhZ2UsIGFwcCB9O1xuICB9XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG59XG5cbmZ1bmN0aW9uIHNldEFydGljbGVQYWdlTWF0dGVyKHsgcGFnZSwgYXBwIH0pIHtcblxuICBpZiAoIXBhZ2UgfHwgIXBhZ2UuZnJvbnRtYXR0ZXIpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbiAgfVxuXG4gIGlmIChwYWdlLmZyb250bWF0dGVyLmF2YXRhciA9PT0gdm9pZCAwKSB7XG4gICAgcGFnZS5mcm9udG1hdHRlci5hdmF0YXIgPSB0cnVlO1xuICB9XG5cbiAgY29uc3Qgd2lkZ2V0ID0gcGFnZS5mcm9udG1hdHRlci53aWRnZXQgfHwge307XG5cbiAgcGFnZS5mcm9udG1hdHRlci53aWRnZXQgPSB7XG4gICAgY2FsZW5kYXI6IHRydWUsXG4gICAgdGFnczogdHJ1ZSxcbiAgICBjYXRlZ29yeTogdHJ1ZSxcbiAgICBhcmNoaXZlczogdHJ1ZSxcbiAgICAuLi53aWRnZXQsXG4gIH07XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG59XG5cbi8qKlxuICogXHU1NDA4XHU2MjEwXHU2NTg3XHU3QUUwXHU5ODc1XHU5NzYyXHU2NTcwXHU2MzZFXG4gKiBAcGFyYW0geyp9IHBhcmFtMFxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gY29tYmluZUFydGljbGUoeyBwYWdlLCBhcHAgfSkge1xuICBpZiAoIXBhZ2UgfHwgIXBhZ2UuZnJvbnRtYXR0ZXIgfHwgIXBhZ2UuZnJvbnRtYXR0ZXIuYXJ0aWNsZVBhZ2UpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAgfTtcbiAgfVxuXG4gIC8vIGNyZWF0ZSBhcnRpY2xlIGRhdGFcbiAgY29uc3QgYXJ0aWNsZSA9IHtcbiAgICBwYXRoOiBwYWdlLnBhdGgsXG4gICAgZGF0ZTogcGFnZS5kYXRlIHx8IHBhZ2UuZnJvbnRtYXR0ZXIudXBkYXRlRGF0ZSxcbiAgICBzbHVnOiBwYWdlLnNsdWcsXG4gICAgdGl0bGU6IHBhZ2UudGl0bGUsXG4gICAgZGVzYzogcGFnZS5mcm9udG1hdHRlci5kZXNjcmlwdGlvbixcbiAgICB1cGRhdGVEYXRlOiBwYWdlLmZyb250bWF0dGVyLnVwZGF0ZURhdGUsXG4gICAgaWQ6IHBhZ2Uua2V5LFxuICAgIGNvdmVySW1nOiBwYWdlLmZyb250bWF0dGVyLmNvdmVySW1nIHx8IFwiXCIsXG4gIH07XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwLCBhcnRpY2xlIH07XG59XG5cbi8qKlxuICogXHU1NDA4XHU2MjEwXHU2NTg3XHU3QUUwXHU2NTcwXHU2MzZFXG4gKi9cbmZ1bmN0aW9uIGNvbWJpbmVBcnRMaXN0KHsgcGFnZSwgYXBwLCBhcnRpY2xlIH0pIHtcbiAgaWYgKCFwYWdlIHx8ICFhcnRpY2xlKSB7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwLCBhcnRpY2xlIH07XG4gIH1cblxuICBjb25zdCBwZXJQYWdlTWF4ID0gYXBwLnNpdGVEYXRhLmFydGljbGVzRGF0YS5hcnRQZXJQYWdlTWF4O1xuICBjb25zdCBhcnRpY2xlc0RhdGEgPSBhcHAuc2l0ZURhdGEuYXJ0aWNsZXNEYXRhO1xuXG4gIC8vIHNhdmUgdGhlIGFydGljbGUgZGF0YSAtLS0+IGFydGljbGVzXG4gIGFydGljbGVzRGF0YS5hcnRpY2xlc1thcnRpY2xlLmlkXSA9IGFydGljbGU7XG4gIGFydGljbGVzRGF0YS5hcnRpY2xlTGlzdC5wdXNoKGFydGljbGUuaWQpO1xuXG4gIGxldCBwYWdlc2xlbiA9IGFydGljbGVzRGF0YS5hcnRpY2xlUGFnZXMubGVuZ3RoO1xuICBpZiAoYXJ0aWNsZXNEYXRhLmFydGljbGVQYWdlc1twYWdlc2xlbiAtIDFdLmxlbmd0aCA8IHBlclBhZ2VNYXgpIHtcbiAgICBhcnRpY2xlc0RhdGEuYXJ0aWNsZVBhZ2VzW3BhZ2VzbGVuIC0gMV0ucHVzaChhcnRpY2xlLmlkKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBsaXN0ID0gW107XG4gICAgYXJ0aWNsZXNEYXRhLmFydGljbGVQYWdlc1twYWdlc2xlbl0gPSBsaXN0O1xuICAgIGxpc3QucHVzaChhcnRpY2xlLmlkKTtcbiAgfVxuXG4gIHJldHVybiB7IHBhZ2UsIGFwcCwgYXJ0aWNsZSB9O1xufVxuXG4vKipcbiAqIFx1NTQwOFx1NjIxMFx1NjU4N1x1N0FFMFx1NUY1Mlx1Njg2M1x1NjU3MFx1NjM2RVxuICovXG5mdW5jdGlvbiBjb21iaW5lQXJ0aWNsZUFjaGl2ZXMoeyBwYWdlLCBhcHAsIGFydGljbGUgfSkge1xuICBpZiAoIXBhZ2UgfHwgIWFydGljbGUpIHtcbiAgICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbiAgfVxuICBjb25zdCBhcnRpY2xlc0RhdGEgPSBhcHAuc2l0ZURhdGEuYXJ0aWNsZXNEYXRhO1xuICAvLyBzYXZlIGJ5IHllYXIgLS0tPiBhcmNoaXZlc1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoYXJ0aWNsZS5kYXRlKTtcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgaWYgKCFhcnRpY2xlc0RhdGEuYXJ0TGlzdEJ5WWVhclt5ZWFyXSkge1xuICAgIGFydGljbGVzRGF0YS5hcnRMaXN0QnlZZWFyW3llYXJdID0gW107XG4gIH1cbiAgYXJ0aWNsZXNEYXRhLmFydExpc3RCeVllYXJbeWVhcl0ucHVzaChhcnRpY2xlLmlkKTtcblxuICByZXR1cm4geyBwYWdlLCBhcHAsIGFydGljbGUgfTtcbn1cblxuLyoqXG4gKiBcdTU0MDhcdTYyMTBcdTY1ODdcdTdBRTBcdTY4MDdcdTdCN0VcdTY1NzBcdTYzNkVcbiAqL1xuZnVuY3Rpb24gY29tYmluZUFydGljbGVUYWdzKHsgcGFnZSwgYXBwLCBhcnRpY2xlIH0pIHtcbiAgaWYgKCFwYWdlIHx8ICFhcnRpY2xlKSB7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwLCBhcnRpY2xlIH07XG4gIH1cbiAgY29uc3QgYXJ0aWNsZXNEYXRhID0gYXBwLnNpdGVEYXRhLmFydGljbGVzRGF0YTtcbiAgLy8gc2F2ZSBieSB0YWcgLS0tPiB0YWdzXG4gIGNvbnN0IHRhZ3MgPSBwYWdlLmZyb250bWF0dGVyLnRhZ3MgfHwgW107XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0YWdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgdGFnID0gdGFnc1tpXTtcbiAgICBjb25zdCB0YWdJZCA9IHN0cjJ1bmljb2RlRm9ybWF0ZSh0YWcpO1xuXG4gICAgaWYgKCFhcnRpY2xlc0RhdGEuYXJ0VGFnc1t0YWdJZF0pIHtcbiAgICAgIGFydGljbGVzRGF0YS5hcnRUYWdzW3RhZ0lkXSA9IHtcbiAgICAgICAgbmFtZTogdGFnLFxuICAgICAgICBpZDogdGFnSWQsXG4gICAgICAgIGxpbms6IGAvdGFncz90YWc9JHtlbmNvZGVVUklDb21wb25lbnQodGFnSWQpfWBcbiAgICAgIH07XG4gICAgICBhcnRpY2xlc0RhdGEuYXJ0TGlzdEJ5VGFnW3RhZ0lkXSA9IFtdO1xuICAgIH1cbiAgICBhcnRpY2xlc0RhdGEuYXJ0TGlzdEJ5VGFnW3RhZ0lkXS5wdXNoKGFydGljbGUuaWQpO1xuICB9XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwLCBhcnRpY2xlIH07XG59XG5cbi8qKlxuICogXHU1NDA4XHU2MjEwXHU2NTg3XHU3QUUwXHU1MjA2XHU3QzdCXHU2NTcwXHU2MzZFXG4gKi9cbmZ1bmN0aW9uIGNvbWJpbmVBcnRpY2xlQ2F0ZWdvcmllcyh7IHBhZ2UsIGFwcCwgYXJ0aWNsZSB9KSB7XG4gIGlmICghcGFnZSB8fCAhYXJ0aWNsZSkge1xuICAgIHJldHVybiB7IHBhZ2UsIGFwcCB9O1xuICB9XG5cbiAgY29uc3QgYXJ0aWNsZXNEYXRhID0gYXBwLnNpdGVEYXRhLmFydGljbGVzRGF0YTtcblxuICAvLyBzYXZlIGJ5IGNhdGVnb3J5IC0tLT4gY2F0ZWdvcmllc1xuICBjb25zdCBjYXRlZ29yeU5hbWUgPSBwYWdlLmZyb250bWF0dGVyLmNhdGVnb3J5IHx8IFwiXHU2NzJBXHU1MjA2XHU3QzdCXCI7XG4gIGNvbnN0IGNhdGVnb3J5SWQgPSBzdHIydW5pY29kZUZvcm1hdGUoY2F0ZWdvcnlOYW1lKTtcbiAgbGV0IGNhdGVnb3J5ID0gYXJ0aWNsZXNEYXRhLmFydENhdGVnb3JpZXNbY2F0ZWdvcnlJZF07XG4gIGlmICghY2F0ZWdvcnkpIHtcbiAgICBjYXRlZ29yeSA9IHtcbiAgICAgIG5hbWU6IGNhdGVnb3J5TmFtZSxcbiAgICAgIGlkOiBjYXRlZ29yeUlkLFxuICAgICAgbGluazogYC9jYXRlZ29yaWVzP2NhdGVnb3J5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGNhdGVnb3J5SWQpfWBcbiAgICB9O1xuICAgIGFydGljbGVzRGF0YS5hcnRDYXRlZ29yaWVzW2NhdGVnb3J5SWRdID0gY2F0ZWdvcnk7XG4gICAgYXJ0aWNsZXNEYXRhLmFydExpc3RCeUNhdGVnb3J5W2NhdGVnb3J5SWRdID0gW107XG4gIH1cbiAgYXJ0aWNsZXNEYXRhLmFydExpc3RCeUNhdGVnb3J5W2NhdGVnb3J5SWRdLnB1c2goYXJ0aWNsZS5pZCk7XG5cbiAgcmV0dXJuIHsgcGFnZSwgYXBwLCBhcnRpY2xlIH07XG59XG5cbi8qKlxuICogXHU4RkM3XHU2RUU0XHU5ODc1XHU5NzYyXHVGRjBDXHU1QzA2XHU5ODc1XHU5NzYyXHU2MzA5XHU3MTY3XHU1QkZDXHU4MjJBXHU5ODc1XHU3Njg0XHU5NzAwXHU2QzQyXHU4RkRCXHU4ODRDXHU5MTREXHU3RjZFXG4gKiBAcGFyYW0geyp9IHBhZ2VzXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTmF2UGFnZXNJbmRleExheW91dCh7IHBhZ2UsIGFwcCB9KSB7XG4gIGlmICghcGFnZSB8fCAhcGFnZS5mcm9udG1hdHRlciB8fCBwYWdlLmZyb250bWF0dGVyLmFydGljbGVQYWdlKSB7XG4gICAgcmV0dXJuIHsgcGFnZSwgYXBwIH07XG4gIH1cbiAgLy8gZGVidWdnZXI7XG4gIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhOQVZfUEFHRVNfSU5ERVhfTEFZT1VUUykpIHtcbiAgICBpZiAocGFnZS5mcm9udG1hdHRlciAmJiBwYWdlLmZyb250bWF0dGVyW2tleV0pIHtcbiAgICAgIHBhZ2UuZnJvbnRtYXR0ZXIubGF5b3V0ID1cbiAgICAgICAgTkFWX1BBR0VTX0lOREVYX0xBWU9VVFNba2V5XSB8fCBOQVZfUEFHRVNfSU5ERVhfTEFZT1VUUy5kZWZhdWx0TGF5b3V0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IHBhZ2UsIGFwcCB9O1xufVxuXG4vKipcbiAqIFx1NTQwOFx1NjIxMFx1NUU3Nlx1OEJCRVx1N0Y2RVx1OTg3NVx1OTc2Mlx1NzZGOFx1NTE3M1x1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUFuZFNldFBhZ2VzRGF0YShwYWdlLCBhcHApIHtcbiAgcmV0dXJuIFtcbiAgICByZXNldEFydGljbGVJbmRleCxcbiAgICBzZXRBcnRpY2xlUGFnZU1hdHRlcixcbiAgICBjb21iaW5lQXJ0aWNsZSxcbiAgICBjb21iaW5lQXJ0TGlzdCxcbiAgICBjb21iaW5lQXJ0aWNsZUFjaGl2ZXMsXG4gICAgY29tYmluZUFydGljbGVUYWdzLFxuICAgIGNvbWJpbmVBcnRpY2xlQ2F0ZWdvcmllcyxcbiAgICBmaWx0ZXJOYXZQYWdlc0luZGV4TGF5b3V0LFxuICAgIHNldFBhZ2VXaWRnZXRcbiAgXS5yZWR1Y2UoXG4gICAgZnVuY3Rpb24gKHByZXYsIGZuKSB7XG4gICAgICByZXR1cm4gZm4ocHJldik7XG4gICAgfSxcbiAgICB7IHBhZ2UsIGFwcCB9XG4gICk7XG59XG5cbi8qKlxuICogXHU4RkM3XHU2RUU0XHU2NTg3XHU3QUUwXHU5ODc1XHVGRjBDXHU1QzA2XHU2NTg3XHU3QUUwXHU5ODc1XHU3Njg0IGxheW91dCBcdThCQkVcdTdGNkVcdTRFM0EgQXJ0aWNsZVBhZ2VMYXlvdXRcbiAqIEBwYXJhbSB7Kn0gcGFnZU9wdFxuICogQHBhcmFtIHsqfSBhcnREaXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckFydFBhZ2VzTGF5b3V0KHBhZ2VPcHQsIGFydERpcikge1xuICAvLyBkZWJ1Z2dlcjtcbiAgaWYgKHBhZ2VPcHQuZmlsZVBhdGg/LnN0YXJ0c1dpdGgoYXJ0RGlyKSAmJiAhcGFnZU9wdC5mcm9udG1hdHRlcj8uYXJ0aWNsZXMpIHtcbiAgICBwYWdlT3B0LmZyb250bWF0dGVyID0gcGFnZU9wdC5mcm9udG1hdHRlciA/PyB7fTtcbiAgICBwYWdlT3B0LmZyb250bWF0dGVyLmFydGljbGVQYWdlID0gdHJ1ZTtcbiAgICBwYWdlT3B0LmZyb250bWF0dGVyLmxheW91dCA9ICBOQVZfUEFHRVNfSU5ERVhfTEFZT1VUU1snYXJ0aWNsZVBhZ2UnXTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9jb250YWluZXJQbHVnaW5zLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9jb250YWluZXJQbHVnaW5zLmpzXCI7aW1wb3J0IHsgY29udGFpbmVyUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1jb250YWluZXInO1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiBpbmZvVGlwKCkge1xuICByZXR1cm4gW1xuICAgIGNvbnRhaW5lclBsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgIHR5cGU6ICd0aXAnLFxuICAgICAgZGVmYXVsdFRpdGxlOiB7XG4gICAgICAgICcvJzogJ1x1NjNEMFx1NzkzQScsXG4gICAgICAgICcvZW4vJzogJ1RJUCcsXG4gICAgICB9XG4gICAgfSksXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgZGVmYXVsdFRpdGxlOiB7XG4gICAgICAgICcvJzogJ1x1NjNEMFx1NzkzQScsXG4gICAgICAgICcvZW4vJzogJ1RJUCcsXG4gICAgICB9XG4gICAgfSksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YXJuaW5nVGlwKCkge1xuICByZXR1cm4gW1xuICAgIGNvbnRhaW5lclBsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgIGRlZmF1bHRUaXRsZToge1xuICAgICAgICAnLyc6ICdcdTZDRThcdTYxMEYnLFxuICAgICAgICAnL2VuLyc6ICdXQVJOSU5HJyxcbiAgICAgIH1cbiAgICB9KSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhbmdlclRpcCgpIHtcbiAgcmV0dXJuIFtcbiAgICBjb250YWluZXJQbHVnaW4oe1xuICAgICAgLy8gXHU5MTREXHU3RjZFXHU5ODc5XG4gICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgIGRlZmF1bHRUaXRsZToge1xuICAgICAgICAnLyc6ICdcdThCNjZcdTU0NEEnLFxuICAgICAgICAnL2VuLyc6ICdXQVJOSU5HJyxcbiAgICAgIH1cbiAgICB9KSxcbiAgXTtcbn1cblxuZXhwb3J0IGNvbnN0IHRpcENvbnRhaW5lclBsdWdpbnMgPSBbXG4gIC4uLmluZm9UaXAoKSxcbiAgLi4ud2FybmluZ1RpcCgpLFxuICAuLi5kYW5nZXJUaXAoKSxcbl07XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGZ1bmN0aW9uIGRldGFpbHNDb250YWluZXIoKSB7XG4gIHJldHVybiBbXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgICAgdHlwZTogJ2RldGFpbHMnLFxuICAgICAgYmVmb3JlOiAoaW5mbykgPT4gYDxkZXRhaWxzIGNsYXNzPVwiY3VzdG9tLWJsb2NrIGRldGFpbHNcIj4ke2luZm8gPyBgPHN1bW1hcnk+JHtpbmZvfTwvc3VtbWFyeT5gIDogJyd9XFxuYCxcbiAgICAgIGFmdGVyOiAoKSA9PiAnPC9kZXRhaWxzPlxcbicsXG4gICAgICBkZWZhdWx0VGl0bGU6IHtcbiAgICAgICAgJy8nOiAnXHU4QkU2XHU3RUM2XHU0RkUxXHU2MDZGJyxcbiAgICAgICAgJy9lbi8nOiAnREVUQUlMUycsXG4gICAgICB9XG4gICAgfSksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJDb250YWluZXIoKSB7XG4gIHJldHVybiBbXG4gICAgY29udGFpbmVyUGx1Z2luKHtcbiAgICAgICAgdHlwZTogJ2NlbnRlcicsXG4gICAgICAgIGJlZm9yZTogaW5mbyA9PiBgPGRpdiBjbGFzcz1cImNlbnRlci1jb250YWluZXJcIj5gLFxuICAgICAgICBhZnRlcjogKCkgPT4gJzwvZGl2PicsXG4gICAgICAgIGRlZmF1bHRUaXRsZToge1xuICAgICAgICAgICcvJzogJ1x1NUM0NVx1NEUyRCcsXG4gICAgICAgICAgJy9lbi8nOiAnQ0VOVEVSJyxcbiAgICAgICAgfVxuICAgIH0pXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aGVvcmVtQ29udGFpbmVyKCkge1xuICByZXR1cm4gW1xuICAgIGNvbnRhaW5lclBsdWdpbih7XG4gICAgICB0eXBlOiAndGhlb3JlbScsXG4gICAgICBiZWZvcmU6IGluZm8gPT4gYDxkaXYgY2xhc3M9XCJjdXN0b20tYmxvY2sgdGhlb3JlbVwiPjxwIGNsYXNzPVwidGl0bGVcIj4ke2luZm99PC9wPmAsXG4gICAgICBhZnRlcjogKCkgPT4gJzwvZGl2PidcbiAgICB9KVxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90ZUNvbnRhaW5lcigpIHtcbiAgcmV0dXJuIFtcbiAgICBjb250YWluZXJQbHVnaW4oe1xuICAgICAgdHlwZTogJ25vdGUnLFxuICAgICAgZGVmYXVsdFRpdGxlOiB7XG4gICAgICAgICcvJzogJ1x1N0IxNFx1OEJCMCcsXG4gICAgICAgICcvZW4vJzogJ05PVEUnXG4gICAgICB9XG4gICAgfSlcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0Q29udGFpbmVyKCkge1xuICByZXR1cm4gW1xuICAgIGNvbnRhaW5lclBsdWdpbih7XG4gICAgICB0eXBlOiAncmlnaHQnLFxuICAgIH0pXG4gIF07XG59XG5cbmV4cG9ydCBjb25zdCBzcGVjQ29udGFpbmVyUGx1Z2lucyA9IFtcbiAgLi4uZGV0YWlsc0NvbnRhaW5lcigpLFxuICAuLi5jZW50ZXJDb250YWluZXIoKSxcbiAgLi4udGhlb3JlbUNvbnRhaW5lcigpLFxuICAuLi5ub3RlQ29udGFpbmVyKCksXG4gIC4uLnJpZ2h0Q29udGFpbmVyKCksXG5dO1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBjb25zdCBjb2RlQ29udGFpbmVyUGx1Z2lucyA9IFtcbiAgY29udGFpbmVyUGx1Z2luKHtcbiAgICB0eXBlOiAnY29kZS1ncm91cCcsXG4gICAgYmVmb3JlOiBpbmZvID0+IGA8Y29kZWdyb3VwPiR7aW5mb31gLFxuICAgIGFmdGVyOiAoKSA9PiAnPC9jb2RlZ3JvdXA+JyxcbiAgICBkZWZhdWx0VGl0bGU6IHtcbiAgICAgICcvJzogJycsXG4gICAgICAnL2VuLyc6ICcnXG4gICAgfSxcbiAgfSksXG4gIGNvbnRhaW5lclBsdWdpbih7XG4gICAgdHlwZTogJ2NvZGUtZ3JvdXAtaXRlbScsXG4gICAgYmVmb3JlOiBpbmZvID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmZvPT09PT09PT4nLCBpbmZvKTtcbiAgICAgIHJldHVybiBgPGNvZGVncm91cGl0ZW0gdGFiPVwiJHtpbmZvfVwiID5gO1xuICAgIH0sXG4gICAgYWZ0ZXI6ICgpID0+ICc8L2NvZGVncm91cGl0ZW0+JyxcbiAgICBkZWZhdWx0VGl0bGU6IHtcbiAgICAgICcvJzogJycsXG4gICAgICAnL2VuLyc6ICcnXG4gICAgfSxcbiAgfSlcbl07XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9sYW5ndWFnZVBsdWdpbi5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BsdWdpbnMvbGFuZ3VhZ2VQbHVnaW4uanNcIjtleHBvcnQgY29uc3Qgc3VwcGVybHMgPSBbXG4gICdodG1sJyxcbiAgJ3htbCcsXG4gICdzdmcnLFxuICAnbWF0aG1sJyxcblxuICAnY3NzJyxcbiAgJ2xlc3MnLFxuICAnc2NzcycsXG4gICdzYXNzJyxcblxuICAnamF2YXNjcmlwdCcsXG4gICdqcycsXG4gICd0eXBlc2NyaXB0JyxcbiAgJ3RzJyxcblxuICAnYWN0aW9uc2NyaXB0JyxcblxuICAnYmFzaCcsXG4gICdzaCcsXG4gICdzaGVsbCcsXG5cbiAgJ2MnLFxuICAnY3BwJyxcbiAgJ2NzaGFycCcsXG4gICdjcycsXG4gICdkb3RuZXQnLFxuXG4gICdkYXJ0JyxcbiAgJ2RvY2tlcicsXG4gICdkb2NrZXJmaWxlJyxcblxuICAnZWRpdG9yY29uZmlnJyxcbiAgJ2VqcycsXG4gICdlbG0nLFxuICAnZXhjZWwtZm9ybXVsYScsXG4gICd4bHN4JyxcbiAgJ3hscycsXG5cbiAgJ2Z0bCcsXG4gICdnbWwnLFxuICAnZ2FtZW1ha2VybGFuZ3VhZ2UnLFxuXG4gICdnaXQnLFxuICAnZ2xzbCcsXG4gICdnbycsXG4gICdnby1tb2R1bGUnLFxuICAnZ28tbW9kJyxcbiAgJ2dyYXBocWwnLFxuXG4gICdoYW5kbGViYXJzJyxcbiAgJ2hicycsXG4gICdtdXN0YWNoZScsXG5cbiAgJ2hheGUnLFxuICAnaGxzbCcsXG4gICdodHRwJyxcblxuICAnaWdub3JlJyxcbiAgJ2dpdGlnbm9yZScsXG4gICducG1pZ25vcmUnLFxuXG4gICdqYXZhJyxcbiAgJ2phdmFkb2MnLFxuICAnanNkb2MnLFxuICAnanMtZXh0cmFzJyxcbiAgJ2pzb24nLFxuICAnanVsaWEnLFxuXG4gICdsYXRleCcsXG4gICd0ZXgnLFxuICAnY29udGV4dCcsXG4gICdsdWEnLFxuICAnbWFya2Rvd24nLFxuICAnbWQnLFxuICAnbW9uZ29kYicsXG5cbiAgJ25naW54JyxcbiAgJ3B5dGhvbicsXG4gICdqc3gnLFxuICAndHN4JyxcbiAgJ3JlZ2V4JyxcbiAgJ3J1YnknLFxuICAncmInLFxuICAncnVzdCcsXG4gICdzcWwnLFxuICAnc3R5bHVzJyxcbiAgJ3N3aWZ0JyxcbiAgJ3dhc20nLFxuICAnd2dzbCcsXG4gICd6aWcnLFxuXG4gICd5YW1sJyxcbiAgJ3ltbCcsXG4gICd0b21sJ1xuXTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL211cmF5L3dvcmtzcGFjZS9naXRodWJXUC9tdXJheS1zcGFjZS9kb2NzLy52dWVwcmVzcy90aGVtZS92dWVwcmVzcy10aGVtZS1jb21pY2JvcmRlci9wbHVnaW5zL2xpbmVOdW1iZXJQbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9saW5lTnVtYmVyUGx1Z2luL2luZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9saW5lTnVtYmVyUGx1Z2luL2luZGV4LmpzXCI7XG5cbmZ1bmN0aW9uIGNvbWJpbmVMaW5lTnVtKG1kKSB7XG4gIGNvbnN0IGZlbmNlID0gbWQucmVuZGVyZXIucnVsZXMuZmVuY2VcbiAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSAoLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IHdyYXBwZXJSZWcgPSAvPGRpdiBjbGFzcz1cImxpbmUtbnVtYmVyc1wiW1xcd1xcc1xcV10rKDxcXC9kaXY+KSg/PTxcXC9kaXY+KS9nO1xuICAgIGNvbnN0IGxpbmVSZWcgPSAvPGRpdiBjbGFzcz1cImxpbmUtbnVtYmVyXCJbXFx3XFxzXFxXXSo+KDxcXC9kaXY+KSg/PTxcXC9kaXY+KS9nO1xuXG4gICAgLy8gXHU1M0Q2XHU1MUZBXHU0RUUzXHU3ODAxXHU1NzU3XG4gICAgY29uc3QgcmF3Q29kZSA9IGZlbmNlKC4uLmFyZ3MpO1xuXG4gICAgaWYgKCFyYXdDb2RlLm1hdGNoKHdyYXBwZXJSZWcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHdyYXBwZXJDb2RlID0gcmF3Q29kZS5tYXRjaCh3cmFwcGVyUmVnKVswXTtcbiAgICBjb25zdCBsaXN0ID0gd3JhcHBlckNvZGUubWF0Y2gobGluZVJlZylbMF0uc3BsaXQoJzwvZGl2PicpO1xuICAgIGNvbnN0IGxpbmVOdW1zID0gbGlzdC5zbGljZSgwLCBsaXN0Lmxlbmd0aCAtIDEpLm1hcCgobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiBgJHtsaW5lfSR7aW5kZXggKyAxfTwvZGl2PmA7XG4gICAgfSkuam9pbignJyk7XG5cbiAgICBjb25zdCBsaW5lTnVtV3JhcHBlciA9IHdyYXBwZXJDb2RlLnJlcGxhY2UobGluZVJlZywgbGluZU51bXMpO1xuICAgIGNvbnN0IGZpbmFsQ29kZSA9IHJhd0NvZGUucmVwbGFjZSh3cmFwcGVyUmVnLCBsaW5lTnVtV3JhcHBlcik7XG5cbiAgICByZXR1cm4gZmluYWxDb2RlO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsaW5lTnVtYmVyUGx1Z2luID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24gKGFwcCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAndnVlcHJlc3MtcGx1Z2luLWNvbWljYm9yZGVyLWxpbmVOdW1iZXInLFxuICAgICAgZXh0ZW5kc01hcmtkb3duKG1kLCBhcHApIHtcbiAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtZDonLCBtZCk7XG4gICAgICAgIGNvbWJpbmVMaW5lTnVtKG1kKTtcblxuICAgICAgfSxcbiAgICAgIGV4dGVuZHNQYWdlKHBhZ2UsIGFwcCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BhZ2U6JywgcGFnZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BsdWdpbnMvaGlnaHRsaWdodExpbmVQbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tdXJheS93b3Jrc3BhY2UvZ2l0aHViV1AvbXVyYXktc3BhY2UvZG9jcy8udnVlcHJlc3MvdGhlbWUvdnVlcHJlc3MtdGhlbWUtY29taWNib3JkZXIvcGx1Z2lucy9oaWdodGxpZ2h0TGluZVBsdWdpbi9pbmRleC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbXVyYXkvd29ya3NwYWNlL2dpdGh1YldQL211cmF5LXNwYWNlL2RvY3MvLnZ1ZXByZXNzL3RoZW1lL3Z1ZXByZXNzLXRoZW1lLWNvbWljYm9yZGVyL3BsdWdpbnMvaGlnaHRsaWdodExpbmVQbHVnaW4vaW5kZXguanNcIjtcbmNvbnN0IFJFID0gLyg/PD1cXHspW1xcZCxcXHMtXSsoPz1cXH0pLztcbmNvbnN0IHdyYXBwZXJSRSA9IC9ePHByZSAuKj8+PGNvZGU+LztcblxuZnVuY3Rpb24gYWRkQ29kZUxpbmVIaWdobGlnaHQobWQpIHtcbiAgY29uc3QgZmVuY2UgPSBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZTtcbiAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSAoLi4uYXJncykgPT4ge1xuXG4gICAgY29uc3QgW3Rva2VucywgaWR4LCBvcHRpb25zXSA9IGFyZ3M7XG4gICAgaWYgKGlkeCAhPT0gNDQpIHtcbiAgICAgICByZXR1cm4gZmVuY2UoLi4uYXJncyk7XG4gICAgfVxuICAgIGRlYnVnZ2VyO1xuXG4gICAgLy8gXHU1M0Q2XHU1MUZBXHU0RUUzXHU3ODAxXHU1NzU3XG4gICAgY29uc3Qgb3JpZ2luQ29kZSA9IGZlbmNlKC4uLmFyZ3MpO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XTtcblxuICAgIGlmICghdG9rZW4ubGluZU51bWJlcnMpIHtcbiAgICAgIGNvbnN0IHJhd0luZm8gPSB0b2tlbi5pbmZvO1xuICAgICAgaWYgKCFyYXdJbmZvIHx8ICFSRS50ZXN0KHJhd0luZm8pKSB7XG4gICAgICAgIHJldHVybiBmZW5jZSguLi5hcmdzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGFuZ05hbWUgPSByYXdJbmZvLnJlcGxhY2UoUkUsICcnKS50cmltKCkucmVwbGFjZSgvKHt8fSkvZywgJycpO1xuICAgICAgLy8gZW5zdXJlIHRoZSBuZXh0IHBsdWdpbiBnZXQgdGhlIGNvcnJlY3QgbGFuZy5cbiAgICAgIHRva2VuLmluZm8gPSBsYW5nTmFtZTtcblxuICAgICAgdG9rZW4ubGluZU51bWJlcnMgPSBSRS5leGVjKHJhd0luZm8pWzBdXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAodiA9PiB2LnNwbGl0KCctJykubWFwKHYgPT4gcGFyc2VJbnQodiwgMTApKSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29kZSA9IG9wdGlvbnMuaGlnaGxpZ2h0XG4gICAgICA/IG9wdGlvbnMuaGlnaGxpZ2h0KHRva2VuLmNvbnRlbnQsIHRva2VuLmluZm8pXG4gICAgICA6IHRva2VuLmNvbnRlbnQ7XG5cbiAgICBjb25zdCByYXdDb2RlID0gY29kZS5yZXBsYWNlKHdyYXBwZXJSRSwgJycpO1xuICAgIGNvbnN0IGhpZ2hsaWdodExpbmVzQ29kZSA9IHJhd0NvZGUuc3BsaXQoJ1xcbicpLm1hcCgoc3BsaXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBsaW5lTnVtYmVyID0gaW5kZXggKyAxO1xuICAgICAgY29uc3QgaW5SYW5nZSA9IHRva2VuLmxpbmVOdW1iZXJzLnNvbWUoKFtzdGFydCwgZW5kXSkgPT4ge1xuICAgICAgICBpZiAoc3RhcnQgJiYgZW5kKSB7XG4gICAgICAgICAgcmV0dXJuIGxpbmVOdW1iZXIgPj0gc3RhcnQgJiYgbGluZU51bWJlciA8PSBlbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVOdW1iZXIgPT09IHN0YXJ0O1xuICAgICAgfSlcbiAgICAgIGlmIChpblJhbmdlKSB7XG4gICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImhpZ2hsaWdodGVkXCI+Jm5ic3A7PC9kaXY+YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnPGJyPic7XG4gICAgfSkuam9pbignJylcblxuICAgIGNvbnN0IGhpZ2hsaWdodExpbmVzV3JhcHBlckNvZGVcbiAgICAgID0gYDxkaXYgY2xhc3M9XCJoaWdobGlnaHQtbGluZXNcIj4ke2hpZ2hsaWdodExpbmVzQ29kZX08L2Rpdj5gO1xuICAgIGNvbnN0IGZpbmFsQ29kZSA9IG9yaWdpbkNvZGUucmVwbGFjZSgvXFw8Y29kZVxcPltcXHNcXFNdKlxcPFxcL2NvZGVcXD4vLCBgJHtoaWdobGlnaHRMaW5lc1dyYXBwZXJDb2RlfTxjb2RlPiR7Y29kZX08L2NvZGU+YCk7XG4gICAgcmV0dXJuIGZpbmFsQ29kZTtcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGhpZ2hsaWdodExpbmVQbHVnaW4gPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24gKGFwcCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcInZ1ZXByZXNzLXBsdWdpbi1jb21pY2JvcmRlci1oaWdobGlnaHRMaW5lXCIsXG4gICAgICBleHRlbmRzTWFya2Rvd24obWQsIGFwcCkge1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJtZDpcIiwgbWQpO1xuICAgICAgICBhZGRDb2RlTGluZUhpZ2hsaWdodChtZCk7XG4gICAgICB9LFxuICAgICAgZXh0ZW5kc1BhZ2UocGFnZSwgYXBwKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBhZ2U6XCIsIHBhZ2UpO1xuICAgICAgfSxcbiAgICB9O1xuICB9O1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsU0FBUyxrQkFBa0IsbUJBQW1COzs7QUNBcEMsU0FBUyxvQkFBb0I7OztBQ0EwRCxPQUFPLFdBQVc7QUFDemMsT0FBTyxRQUFRLGVBQWU7QUFDOUIsU0FBUyxxQkFBcUI7OztBQ2F2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QUEsTUFDWixLQUFLO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0YsQ0FBQztBQUNIOzs7QUh6SUEsU0FBUyxnQ0FBZ0M7QUFDekMsU0FBUyxxQkFBcUI7OztBSVIwYyxJQUFNLFdBQVc7QUFBQSxFQUN2ZjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7OztBQzdGQSxTQUFTLGVBQWUsSUFBSTtBQUMxQixRQUFNLFFBQVEsR0FBRyxTQUFTLE1BQU07QUFDaEMsS0FBRyxTQUFTLE1BQU0sUUFBUSxJQUFJLFNBQVM7QUFDckMsVUFBTSxhQUFhO0FBQ25CLFVBQU0sVUFBVTtBQUdoQixVQUFNLFVBQVUsTUFBTSxHQUFHLElBQUk7QUFFN0IsUUFBSSxDQUFDLFFBQVEsTUFBTSxVQUFVLEdBQUc7QUFDOUI7QUFBQSxJQUNGO0FBQ0EsVUFBTSxjQUFjLFFBQVEsTUFBTSxVQUFVLEVBQUUsQ0FBQztBQUMvQyxVQUFNLE9BQU8sWUFBWSxNQUFNLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxRQUFRO0FBQ3pELFVBQU0sV0FBVyxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLFVBQVU7QUFDbkUsYUFBTyxHQUFHLE9BQU8sUUFBUTtBQUFBLElBQzNCLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFFVixVQUFNLGlCQUFpQixZQUFZLFFBQVEsU0FBUyxRQUFRO0FBQzVELFVBQU0sWUFBWSxRQUFRLFFBQVEsWUFBWSxjQUFjO0FBRTVELFdBQU87QUFBQSxFQUNUO0FBQ0Y7QUFFTyxJQUFNLG1CQUFtQixTQUFTLFNBQVM7QUFDaEQsU0FBTyxTQUFVLEtBQUs7QUFDcEIsV0FBTztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sZ0JBQWdCLElBQUlBLE1BQUs7QUFHdkIsdUJBQWUsRUFBRTtBQUFBLE1BRW5CO0FBQUEsTUFDQSxZQUFZLE1BQU1BLE1BQUs7QUFBQSxNQUd2QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQzFDQSxJQUFNLEtBQUs7QUFDWCxJQUFNLFlBQVk7QUFFbEIsU0FBUyxxQkFBcUIsSUFBSTtBQUNoQyxRQUFNLFFBQVEsR0FBRyxTQUFTLE1BQU07QUFDaEMsS0FBRyxTQUFTLE1BQU0sUUFBUSxJQUFJLFNBQVM7QUFFckMsVUFBTSxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUk7QUFDL0IsUUFBSSxRQUFRLElBQUk7QUFDYixhQUFPLE1BQU0sR0FBRyxJQUFJO0FBQUEsSUFDdkI7QUFDQTtBQUdBLFVBQU0sYUFBYSxNQUFNLEdBQUcsSUFBSTtBQUVoQyxVQUFNLFFBQVEsT0FBTyxHQUFHO0FBRXhCLFFBQUksQ0FBQyxNQUFNLGFBQWE7QUFDdEIsWUFBTSxVQUFVLE1BQU07QUFDdEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssT0FBTyxHQUFHO0FBQ2pDLGVBQU8sTUFBTSxHQUFHLElBQUk7QUFBQSxNQUN0QjtBQUVBLFlBQU0sV0FBVyxRQUFRLFFBQVEsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsVUFBVSxFQUFFO0FBRXBFLFlBQU0sT0FBTztBQUViLFlBQU0sY0FBYyxHQUFHLEtBQUssT0FBTyxFQUFFLENBQUMsRUFDbkMsTUFBTSxHQUFHLEVBQ1QsSUFBSSxPQUFLLEVBQUUsTUFBTSxHQUFHLEVBQUUsSUFBSSxDQUFBQyxPQUFLLFNBQVNBLElBQUcsRUFBRSxDQUFDLENBQUM7QUFBQSxJQUNwRDtBQUVBLFVBQU0sT0FBTyxRQUFRLFlBQ2pCLFFBQVEsVUFBVSxNQUFNLFNBQVMsTUFBTSxJQUFJLElBQzNDLE1BQU07QUFFVixVQUFNLFVBQVUsS0FBSyxRQUFRLFdBQVcsRUFBRTtBQUMxQyxVQUFNLHFCQUFxQixRQUFRLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLFVBQVU7QUFDbkUsWUFBTSxhQUFhLFFBQVE7QUFDM0IsWUFBTSxVQUFVLE1BQU0sWUFBWSxLQUFLLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTTtBQUN2RCxZQUFJLFNBQVMsS0FBSztBQUNoQixpQkFBTyxjQUFjLFNBQVMsY0FBYztBQUFBLFFBQzlDO0FBQ0EsZUFBTyxlQUFlO0FBQUEsTUFDeEIsQ0FBQztBQUNELFVBQUksU0FBUztBQUNYLGVBQU87QUFBQSxNQUNUO0FBQ0EsYUFBTztBQUFBLElBQ1QsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUVWLFVBQU0sNEJBQ0YsZ0NBQWdDO0FBQ3BDLFVBQU0sWUFBWSxXQUFXLFFBQVEsNkJBQTZCLEdBQUcsa0NBQWtDLGFBQWE7QUFDcEgsV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQUVPLElBQU0sc0JBQXNCLFNBQVUsU0FBUztBQUNwRCxTQUFPLFNBQVUsS0FBSztBQUNwQixXQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsSUFBSUMsTUFBSztBQUd2Qiw2QkFBcUIsRUFBRTtBQUFBLE1BQ3pCO0FBQUEsTUFDQSxZQUFZLE1BQU1BLE1BQUs7QUFBQSxNQUd2QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBTi9EQSxTQUFTLGlCQUFpQjtBQUMxQixTQUFTLCtCQUErQjtBQUN4QyxPQUFPLG1CQUFtQjtBQWQ4UCxJQUFNLDJDQUEyQztBQWlCelUsSUFBTSxZQUFZLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBR3hELFNBQVMsZ0JBQWdCLFdBQVcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxHQUFHO0FBcEIzRDtBQXFCRSxTQUFPO0FBQUEsSUFDTCxHQUFHO0FBQUEsSUFDSCxjQUFjO0FBQUEsTUFDWixpQkFBZSxrQkFBYSxhQUFiLG1CQUF1QixZQUFXO0FBQUEsTUFDakQsVUFBVSxDQUFDO0FBQUE7QUFBQSxNQUNYLGFBQWEsQ0FBQztBQUFBO0FBQUEsTUFDZCxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQUE7QUFBQSxNQUNqQixlQUFlLENBQUM7QUFBQTtBQUFBLE1BQ2hCLFNBQVMsQ0FBQztBQUFBO0FBQUEsTUFDVixjQUFjLENBQUM7QUFBQTtBQUFBLE1BQ2YsZUFBZSxDQUFDO0FBQUE7QUFBQSxNQUNoQixtQkFBbUIsQ0FBQztBQUFBO0FBQUEsSUFDdEI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLE1BQU0sYUFBYSxRQUFRO0FBQUEsTUFDM0IsTUFBTSxDQUFDLEdBQUksYUFBYSxVQUFVLENBQUMsQ0FBRTtBQUFBLE1BQ3JDLFNBQVMsQ0FBQyxLQUFJLGtCQUFhLFlBQWIsbUJBQXNCLFlBQVcsQ0FBQyxDQUFFO0FBQUEsTUFDbEQsWUFBVSxrQkFBYSxZQUFiLG1CQUFzQixhQUFZO0FBQUEsTUFDNUMsUUFBUTtBQUFBLFFBQ04sVUFBVSxhQUFhLFlBQVksQ0FBQywrRkFBb0I7QUFBQSxRQUN4RCxZQUFZLGFBQWEsY0FBYztBQUFBLFFBQ3ZDLFlBQVksYUFBYSxjQUFjO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRU8sSUFBTSxtQkFBbUIsQ0FBQyxtQkFBbUIsU0FBUztBQUszRCxTQUFPLENBQUMsUUFBUTtBQUVkLFVBQU0sRUFBRSxVQUFVLFFBQVEsSUFBSTtBQVM5QixRQUFJLFdBQVcsZ0JBQWdCLFVBQVUsY0FBYztBQUV2RCxXQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUE7QUFBQSxNQUdOLGtCQUFrQixLQUFLLFFBQVEsV0FBVyxXQUFXO0FBQUE7QUFBQSxNQUdyRCxlQUFlLEtBQUssUUFBUSxXQUFXLHNCQUFzQjtBQUFBLE1BQzdELGFBQWEsS0FBSyxRQUFRLFdBQVcsb0JBQW9CO0FBQUE7QUFBQSxNQUd6RCxTQUFTO0FBQUEsUUFDUCxnQkFBZ0I7QUFBQTtBQUFBLFFBRWhCLEdBQUc7QUFBQTtBQUFBLFFBRUgsR0FBRztBQUFBO0FBQUEsUUFFSCxHQUFHO0FBQUEsUUFDSCx5QkFBeUI7QUFBQSxVQUN2QixZQUFZO0FBQUEsWUFDVixhQUFhLEtBQUssUUFBUSxXQUFXLG1DQUFtQztBQUFBLFlBQ3hFLGlCQUFpQixLQUFLLFFBQVEsV0FBVyx1Q0FBdUM7QUFBQSxZQUNoRixTQUFTLEtBQUssUUFBUSxXQUFXLCtCQUErQjtBQUFBLFVBQ2xFO0FBQUEsUUFDRixDQUFDO0FBQUE7QUFBQSxRQUVELGNBQWM7QUFBQTtBQUFBLFVBRVosa0JBQWtCO0FBQUEsWUFDaEIsR0FBRztBQUFBLFVBQ0w7QUFBQSxRQUNGLENBQUM7QUFBQTtBQUFBLFFBRUQsaUJBQWlCO0FBQUE7QUFBQSxRQUVqQixDQUFDO0FBQUEsUUFDRCxvQkFBb0I7QUFBQTtBQUFBLFFBRXBCLENBQUM7QUFBQTtBQUFBLFFBRUQsVUFBVTtBQUFBO0FBQUEsUUFFVixDQUFDO0FBQUE7QUFBQSxRQUVELHdCQUF3QjtBQUFBO0FBQUEsUUFFeEIsQ0FBQztBQUFBO0FBQUEsUUFFRCxjQUFjO0FBQUE7QUFBQSxRQUVkLENBQUM7QUFBQSxNQUNIO0FBQUE7QUFBQSxNQUVBLG1CQUFtQixTQUFTQyxNQUFLO0FBRy9CLDZCQUFxQixTQUFTQSxLQUFJLElBQUksT0FBTyxXQUFXLENBQUM7QUFBQSxNQUMzRDtBQUFBLE1BQ0EsWUFBWSxNQUFNQSxNQUFLO0FBSXJCLFlBQUksTUFBTSx1QkFBdUIsTUFBTUEsSUFBRztBQUMxQyxlQUFPLElBQUk7QUFDWCxRQUFBQSxPQUFNLElBQUk7QUFBQSxNQUNaO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJQSxjQUFjQSxNQUFLO0FBQUEsTUFHbkI7QUFBQTtBQUFBLE1BRUEsV0FBV0EsTUFBSztBQUFBLE1BSWhCO0FBQUE7QUFBQSxNQUVBLFVBQVVBLE1BQUssVUFBVSxTQUFTO0FBRWhDLGdCQUFRLElBQUksTUFBTSxNQUFNLHFDQUFxQyxDQUFDO0FBQUEsTUFDaEU7QUFBQTtBQUFBLE1BRUEsWUFBWUEsTUFBSztBQUVmLGdCQUFRLElBQUksTUFBTSxRQUFRLDRCQUE0QixDQUFDO0FBQUEsTUFDekQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUR6RkEsSUFBTyxzQkFBUSxpQkFBaUI7QUFBQTtBQUFBLEVBRTlCLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQTtBQUFBLEVBRU4sYUFBYTtBQUFBLEVBQ2IsaUJBQWlCO0FBQUE7QUFBQSxFQUVqQixNQUFNO0FBQUEsRUFDTixRQUFRO0FBQUEsSUFDTjtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBLE1BQ1A7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sVUFBVTtBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBLEVBR0EsVUFBVTtBQUFBLEVBQ1YsY0FBYztBQUFBLEVBQ2QsaUJBQWlCO0FBQUEsRUFDakIsVUFBVTtBQUFBLEVBQ1YsWUFBWTtBQUFBLEVBQ1osU0FBUztBQUFBO0FBQUEsRUFFVCxVQUFVO0FBQUEsSUFDUixTQUFTO0FBQUE7QUFBQSxFQUNYO0FBQUE7QUFBQSxFQUVBLGNBQWM7QUFBQSxFQUNkLGtCQUFrQjtBQUFBO0FBQUEsRUFFbEIsS0FBSztBQUFBLEVBQ0wsU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBO0FBQUEsRUFFUixVQUFVLENBQUMsZ0VBQWMsc0VBQWUsc0VBQWUsb0VBQWE7QUFBQSxFQUNwRSxZQUFZO0FBQUEsRUFDWixZQUFZO0FBQUE7QUFBQSxFQUVaLGlCQUFpQjtBQUFBLEVBQ2pCLGlCQUFpQjtBQUFBLEVBQ2pCLGVBQWU7QUFBQTtBQUFBLEVBRWYsY0FBYztBQUFBLElBQ1osbUJBQW1CO0FBQUE7QUFBQSxJQUNuQixXQUFXO0FBQUE7QUFBQTtBQUFBLElBRVgsa0JBQWtCO0FBQUE7QUFBQSxJQUNsQixLQUFLO0FBQUE7QUFBQSxJQUNMLFlBQVk7QUFBQTtBQUFBLElBQ1osV0FBVztBQUFBO0FBQUEsRUFDYjtBQUNGLENBQUM7OztBRHZLRCxTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLG9CQUFvQjtBQUU3QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHVCQUF1QjtBQUVoQyxJQUFPLGlCQUFRLGlCQUFpQjtBQUFBO0FBQUEsRUFFOUIsTUFBTSxRQUFRLElBQUk7QUFBQSxFQUNsQixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJYixPQUFPO0FBQUEsRUFDUCxjQUFjLENBQUMsV0FBVyxjQUFjLGNBQWMsZUFBZTtBQUFBO0FBQUE7QUFBQSxFQUlyRSxNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLTixlQUFlO0FBQUEsRUFDZixnQkFBZ0I7QUFBQTtBQUFBO0FBQUEsRUFJaEIsVUFBVSxDQUFDO0FBQUE7QUFBQSxFQUVYLFNBQVM7QUFBQSxJQUNQLGFBQWE7QUFBQTtBQUFBLElBRWIsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBRUEsT0FBTztBQUFBO0FBQUEsRUFFUCxTQUFTLFlBQVk7QUFBQSxJQUNuQixhQUFhO0FBQUEsTUFDWCxPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsV0FBVztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQUtaO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFBQSxRQUNELFdBQVc7QUFBQSxVQUNULFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUFBLFFBQy9CLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbImFwcCIsICJ2IiwgImFwcCIsICJhcHAiXQp9Cg==

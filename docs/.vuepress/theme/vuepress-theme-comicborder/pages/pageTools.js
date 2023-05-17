import { str2unicodeFormate } from "../utils/tools";

const NAV_PAGES_INDEX_LAYOUTS = {
  home: "HomeLayout",
  about: "AboutLayout",
  articles: "ArticlesLayout",
  archives: "ArchivesLayout",
  categories: "CategoriesLayout",
  articlePage: "ArticlePageLayout",
  tags: "TagsLayout",
  defaultLayout: "Layout",
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
    ...(page.frontmatter.widget || {})
  };

  return { page, app };
}

/**
 * 重置aritcle默认路由对应页面的属性
 * @param {*} param0
 * @returns
 */
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
    ...widget,
  };

  return { page, app };
}

/**
 * 合成文章页面数据
 * @param {*} param0
 * @returns
 */
function combineArticle({ page, app }) {
  if (!page || !page.frontmatter || !page.frontmatter.articlePage) {
    return { page, app };
  }

  // create article data
  const article = {
    path: page.path,
    date: page.date || page.frontmatter.updateDate,
    slug: page.slug,
    title: page.title,
    desc: page.frontmatter.description,
    updateDate: page.frontmatter.updateDate,
    id: page.key,
    coverImg: page.frontmatter.coverImg || "",
    tagIds: [],
    categoryIds: [],
  };

  return { page, app, article };
}

/**
 * 合成文章数据
 */
function combineArtList({ page, app, article }) {
  if (!page || !article) {
    return { page, app, article };
  }

  const perPageMax = app.siteData.articlesData.artPerPageMax;
  const articlesData = app.siteData.articlesData;

  // save the article data ---> articles
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

/**
 * 合成文章归档数据
 */
function combineArticleAchives({ page, app, article }) {
  if (!page || !article) {
    return { page, app, article };
  }
  const articlesData = app.siteData.articlesData;
  // save by year ---> archives
  const date = new Date(article.date);
  const year = date.getFullYear();
  if (!articlesData.artListByYear[year]) {
    articlesData.artListByYear[year] = [];
  }
  articlesData.artListByYear[year].push(article.id);

  return { page, app, article };
}

/**
 * 合成文章标签数据
 */
function combineArticleTags({ page, app, article }) {
  if (!page || !article) {
    return { page, app, article };
  }
  const articlesData = app.siteData.articlesData;
  // save by tag ---> tags
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
    article.tagIds.push(tagId);
  }

  return { page, app, article };
}

/**
 * 合成文章分类数据
 */
function combineArticleCategories({ page, app, article }) {
  if (!page || !article) {
    return { page, app };
  }

  const articlesData = app.siteData.articlesData;

  // save by category ---> categories
  const categoryName = page.frontmatter.category || "未分类";
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
  article.categoryIds.push(categoryId);

  return { page, app, article };
}

/**
 * 过滤页面，将页面按照导航页的需求进行配置
 * @param {*} pages
 * @returns
 */
export function filterNavPagesIndexLayout({ page, app }) {
  if (!page || !page.frontmatter || page.frontmatter.articlePage) {
    return { page, app };
  }
  // debugger;
  for (let key of Object.keys(NAV_PAGES_INDEX_LAYOUTS)) {
    if (page.frontmatter && page.frontmatter[key]) {
      page.frontmatter.layout =
        NAV_PAGES_INDEX_LAYOUTS[key] || NAV_PAGES_INDEX_LAYOUTS.defaultLayout;
      break;
    }
  }
  return { page, app };
}

/**
 * 合成并设置页面相关数据
 */
export function combineAndSetPagesData(page, app) {
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
    function (prev, fn) {
      return fn(prev);
    },
    { page, app }
  );
}

/**
 * 过滤文章页，将文章页的 layout 设置为 ArticlePageLayout
 * @param {*} pageOpt
 * @param {*} artDir
 */
export function filterArtPagesLayout(pageOpt, artDir) {
  // debugger;
  if (pageOpt.filePath?.startsWith(artDir) && !pageOpt.frontmatter?.articles) {
    pageOpt.frontmatter = pageOpt.frontmatter ?? {};
    pageOpt.frontmatter.articlePage = true;
    pageOpt.frontmatter.layout =  NAV_PAGES_INDEX_LAYOUTS['articlePage'];
  }
}

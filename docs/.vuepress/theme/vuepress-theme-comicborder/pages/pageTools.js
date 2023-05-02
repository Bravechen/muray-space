
const NAV_PAGES_INDEX_LAYOUTS = {
  home: 'HomeLayout',
  about: 'AboutLayout',
  articles: 'ArticlesLayout',
  archives: 'ArchivesLayout',
  categories: 'CategoriesLayout',
  articlePage: 'ArticlePageLayout',
  defaultLayout: 'Layout',
};

/**
 * 合成文章数据
 */
function combineArtList({ page, app }) {
  if (!page || !page.frontmatter || !page.frontmatter.articlePage) {
    return { page, app };
  }

  if (page.frontmatter.articles && page.frontmatter.articlePage) {
    page.frontmatter.articlePage = false;
    return { page, app };
  }

  debugger;

  const article = {
    path: page.path,
    date: page.date || page.frontmatter.updateDate,
    slug: page.slug,
    title: page.title,
    desc: page.frontmatter.description,
    updateDate: page.frontmatter.updateDate,
    id: page.key,
    coverImg: page.frontmatter.coverImg || '',
  };

  const articlesData = app.siteData.articlesData;
  // save the article data ---> articles
  articlesData.articles.push(article);

  // save by year ---> archives
  const date = new Date(article.date);
  const year = date.getFullYear();
  if (!articlesData.artListByYear[year]) {
    articlesData.artListByYear[year] = [];
  }
  articlesData.artListByYear[year].push(article);

  // save by tag ---> categories


  return { page, app };
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
      page.frontmatter.layout = NAV_PAGES_INDEX_LAYOUTS[key] || NAV_PAGES_INDEX_LAYOUTS.defaultLayout;
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
    combineArtList,
    filterNavPagesIndexLayout
  ].reduce(function(prev, fn) {
    return fn(prev);
  }, { page, app })
}

/**
 * 过滤文章页，将文章页的 layout 设置为 ArticlePageLayout
 * @param {*} pageOpt
 * @param {*} artDir
 */
export function filterArtPagesLayout(pageOpt, artDir) {
  if (pageOpt.filePath?.startsWith(artDir) && !pageOpt.frontmatter?.articles) {
    pageOpt.frontmatter = pageOpt.frontmatter ?? {};
    pageOpt.frontmatter.articlePage = true;
  }
}

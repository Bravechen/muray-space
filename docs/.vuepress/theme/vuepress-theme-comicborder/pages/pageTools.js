
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
 * 过滤页面，将页面按照导航页的需求进行配置
 * @param {*} pages
 * @returns
 */
export function filterNavPagesIndexLayout(page) {
  if (!page || !page.frontmatter) {
    return page;
  }

  for (let key of Object.keys(NAV_PAGES_INDEX_LAYOUTS)) {
    if (page.frontmatter && page.frontmatter[key]) {
      page.frontmatter.layout = NAV_PAGES_INDEX_LAYOUTS[key] || NAV_PAGES_INDEX_LAYOUTS.defaultLayout;
      break;
    }
  }
  return page;
}

/**
 * 过滤文章页，将文章页的 layout 设置为 ArticlePageLayout
 * @param {*} pageOpt
 * @param {*} artDir
 */
export function filterArtPagesLayout(pageOpt, artDir) {
  if (pageOpt.filePath?.startsWith(artDir)) {
    pageOpt.frontmatter = pageOpt.frontmatter ?? {};
    pageOpt.frontmatter.articlePage = true;
  }
}

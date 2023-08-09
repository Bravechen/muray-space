export default function article(data = {}) {
  const date = new Date();
  const createTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return [
    `---
  lang: zh-CN
  title: ${data.title || ''}
  description: ${data.desc || ''}
  date: ${createTime}
  permalinkPattern: :year/:slug.html
  editLink: false
  # editLinkPattern: ''
  lastUpdated: true
  # contributors: true
  category: ${data.category || '其他'}
  tags:
  coverImg: ${data.coverImg || ''}
  ---
  `,
    'md'
  ];
}

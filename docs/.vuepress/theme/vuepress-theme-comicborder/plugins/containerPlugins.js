import { containerPlugin } from '@vuepress/plugin-container';
//============================================================
export function infoTip() {
  return [
    containerPlugin({
      // 配置项
      type: 'tip',
      defaultTitle: {
        '/': '提示',
        '/en/': 'TIP',
      }
    }),
    containerPlugin({
      // 配置项
      type: 'info',
      defaultTitle: {
        '/': '提示',
        '/en/': 'TIP',
      }
    }),
  ];
}

export function warningTip() {
  return [
    containerPlugin({
      // 配置项
      type: 'warning',
      defaultTitle: {
        '/': '注意',
        '/en/': 'WARNING',
      }
    }),
  ];
}

export function dangerTip() {
  return [
    containerPlugin({
      // 配置项
      type: 'danger',
      defaultTitle: {
        '/': '警告',
        '/en/': 'WARNING',
      }
    }),
  ];
}

export const tipContainerPlugins = [
  ...infoTip(),
  ...warningTip(),
  ...dangerTip(),
];
//============================================================
export function detailsContainer() {
  return [
    containerPlugin({
      // 配置项
      type: 'details',
      before: (info) => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ''}\n`,
      after: () => '</details>\n',
      defaultTitle: {
        '/': '详细信息',
        '/en/': 'DETAILS',
      }
    }),
  ];
}

export function centerContainer() {
  return [
    containerPlugin({
        type: 'center',
        before: info => `<div class="center-container">${info ? `<em class="center-title">${info}</em>` : '' }`,
        after: () => '</div>',
        defaultTitle: {
          '/': '居中',
          '/en/': 'CENTER',
        }
    })
  ];
}

export function theoremContainer() {
  return [
    containerPlugin({
      type: 'theorem',
      before: info => `<div class="custom-block theorem"><p class="title">${info}</p>`,
      after: () => '</div>'
    })
  ];
}

export function noteContainer() {
  return [
    containerPlugin({
      type: 'note',
      defaultTitle: {
        '/': '笔记',
        '/en/': 'NOTE'
      }
    })
  ];
}

export function rightContainer() {
  return [
    containerPlugin({
      type: 'right',
    })
  ];
}

export const specContainerPlugins = [
  ...detailsContainer(),
  ...centerContainer(),
  ...theoremContainer(),
  ...noteContainer(),
  ...rightContainer(),
];
//============================================================
export const codeContainerPlugins = [
  containerPlugin({
    type: 'code-group',
    before: info => `<code-group>${info}`,
    after: () => '</code-group>',
    defaultTitle: {
      '/': '',
      '/en/': ''
    },
  }),
  containerPlugin({
    type: 'code-group-item',
    before: info => {
      // console.log('info=======>', info);
      return `<code-group-item tab="${info}" >`;
    },
    after: () => '</code-group-item>',
    defaultTitle: {
      '/': '',
      '/en/': ''
    },
  })
];
//============================================================
export const swiperContainerPlugins = [
  containerPlugin({
    type: 'swiper',
    before: info => `<Swiper>${info}`,
    after: () => '</Swiper>',
    defaultTitle: {
      '/': '',
      '/en/': ''
    },
  }),
  containerPlugin({
    type: 'swiper-item',
    before: info => {
      console.log("===============>>>", info);
      return `<swiper-item cnt-type="${info}">`
    },
    after: () => '</swiper-item>',
    defaultTitle: {
      '/': '',
      '/en/': ''
    },
  })
];
//============================================================

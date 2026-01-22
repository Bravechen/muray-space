// 匹配 [[[ASSETS type="iframe" src="xxxxxx" width="123" height="123" scrolling="no"]]] 语法
// 支持可选的 width, height, scrolling 属性，属性顺序任意
// 使用非贪婪匹配确保正确匹配到结束的 ]]]
function parseAssetsIframe(str) {
  // 匹配完整的语法块
  const fullMatch = str.match(/\[\[\[ASSETS\s+type\s*=\s*"iframe"([^\]]*?)\]\]\]/);
  if (!fullMatch) {
    return null;
  }

  const attrsStr = fullMatch[1];
  const result = {
    src: null,
    width: null,
    height: null,
    scrolling: null,
  };

  // 提取 src（必需）
  const srcMatch = attrsStr.match(/src\s*=\s*"([^"]+)"/);
  if (srcMatch) {
    result.src = srcMatch[1];
  }

  // 提取 width（可选）
  const widthMatch = attrsStr.match(/width\s*=\s*"([^"]+)"/);
  if (widthMatch) {
    result.width = widthMatch[1];
  }

  // 提取 height（可选）
  const heightMatch = attrsStr.match(/height\s*=\s*"([^"]+)"/);
  if (heightMatch) {
    result.height = heightMatch[1];
  }

  // 提取 scrolling（可选）
  const scrollingMatch = attrsStr.match(/scrolling\s*=\s*"([^"]+)"/);
  if (scrollingMatch) {
    result.scrolling = scrollingMatch[1];
  }

  return result;
}

function addIframeRule(md) {
  // 添加 inline 规则来处理 ASSETS iframe 语法
  md.inline.ruler.before('text', 'assets_iframe', function(state, silent) {
    const pos = state.pos;

    // 检查是否匹配语法
    if (state.src.charCodeAt(pos) !== 0x5B /* [ */) {
      return false;
    }

    const remaining = state.src.slice(pos);
    const parsed = parseAssetsIframe(remaining);
    if (!parsed || !parsed.src) {
      return false;
    }

    if (silent) {
      return true;
    }

    // 查找完整的匹配字符串
    const fullMatch = remaining.match(/\[\[\[ASSETS\s+type\s*=\s*"iframe"[^\]]+\]\]\]/);
    if (!fullMatch) {
      return false;
    }

    // 创建 token，将属性信息存储在 token 中
    const token = state.push('assets_iframe', '', 0);
    token.content = JSON.stringify(parsed);
    token.markup = fullMatch[0];

    // 更新位置
    state.pos += fullMatch[0].length;

    return true;
  });

  // 添加渲染规则
  md.renderer.rules.assets_iframe = function(tokens, idx) {
    const token = tokens[idx];
    const attrs = JSON.parse(token.content);

    let props = `src="${attrs.src}"`;
    if (attrs.width) {
      props += ` width="${attrs.width}"`;
    }
    if (attrs.height) {
      props += ` height="${attrs.height}"`;
    }
    if (attrs.scrolling) {
      props += ` scrolling="${attrs.scrolling}"`;
    }

    return `<iframe-box ${props} />`;
  };
}

export const iframePlugin = function(options) {
  return function(app) {
    return {
      name: 'vuepress-plugin-comicborder-iframe',
      extendsMarkdown(md, app) {
        addIframeRule(md);
      },
      extendsPage(page, app) {
        // 可以在这里处理页面级别的逻辑
      }
    };
  };
};

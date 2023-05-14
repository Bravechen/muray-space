
const RE = /(?<=\{)[\d,\s-]+(?=\})/;
const wrapperRE = /^<pre .*?><code>/;

function addCodeLineHighlight(md) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {

    const [tokens, idx, options] = args;
    if (idx !== 44) {
       return fence(...args);
    }
    debugger;

    // 取出代码块
    const originCode = fence(...args);

    const token = tokens[idx];

    if (!token.lineNumbers) {
      const rawInfo = token.info;
      if (!rawInfo || !RE.test(rawInfo)) {
        return fence(...args);
      }

      const langName = rawInfo.replace(RE, '').trim().replace(/({|})/g, '');
      // ensure the next plugin get the correct lang.
      token.info = langName;

      token.lineNumbers = RE.exec(rawInfo)[0]
        .split(',')
        .map(v => v.split('-').map(v => parseInt(v, 10)));
    }

    const code = options.highlight
      ? options.highlight(token.content, token.info)
      : token.content;

    const rawCode = code.replace(wrapperRE, '');
    const highlightLinesCode = rawCode.split('\n').map((split, index) => {
      const lineNumber = index + 1;
      const inRange = token.lineNumbers.some(([start, end]) => {
        if (start && end) {
          return lineNumber >= start && lineNumber <= end;
        }
        return lineNumber === start;
      })
      if (inRange) {
        return `<div class="highlighted">&nbsp;</div>`;
      }
      return '<br>';
    }).join('')

    const highlightLinesWrapperCode
      = `<div class="highlight-lines">${highlightLinesCode}</div>`;
    const finalCode = originCode.replace(/\<code\>[\s\S]*\<\/code\>/, `${highlightLinesWrapperCode}<code>${code}</code>`);
    return finalCode;
  };
}

export const highlightLinePlugin = function (options) {
  return function (app) {
    return {
      name: "vuepress-plugin-comicborder-highlightLine",
      extendsMarkdown(md, app) {
        // debugger;
        // console.log("md:", md);
        addCodeLineHighlight(md);
      },
      extendsPage(page, app) {
        // debugger;
        // console.log("page:", page);
      },
    };
  };
};

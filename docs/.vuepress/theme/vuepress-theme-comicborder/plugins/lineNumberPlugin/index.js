

function combineLineNum(md) {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    const wrapperReg = /<div class="line-numbers"[\w\s\W]+(<\/div>)(?=<\/div>)/g;
    const lineReg = /<div class="line-number"[\w\s\W]*>(<\/div>)(?=<\/div>)/g;

    // 取出代码块
    const rawCode = fence(...args);

    if (!rawCode.match(wrapperReg)) {
      return;
    }
    const wrapperCode = rawCode.match(wrapperReg)[0];
    const list = wrapperCode.match(lineReg)[0].split('</div>');
    const lineNums = list.slice(0, list.length - 1).map((line, index) => {
      return `${line}${index + 1}</div>`;
    }).join('');

    const lineNumWrapper = wrapperCode.replace(lineReg, lineNums);
    const finalCode = rawCode.replace(wrapperReg, lineNumWrapper);

    return finalCode;
  }
}

export const lineNumberPlugin = function(options) {
  return function (app) {
    return {
      name: 'vuepress-plugin-comicborder-lineNumber',
      extendsMarkdown(md, app) {
        // debugger;
        // console.log('md:', md);
        combineLineNum(md);

      },
      extendsPage(page, app) {
        // debugger;
        // console.log('page:', page);
      }
    };
  }
}

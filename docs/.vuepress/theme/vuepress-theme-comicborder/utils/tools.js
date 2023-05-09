// 随机字符串
export function randomStr() {
  return ((Math.random() * 0xffffff)>>0).toString(16);
}

// 获取随机组合字符串
export function getSysId() {
  return `${randomStr()}-${randomStr()}`;
}

/**
 * 将字符串转换指定的unicode格式
 * @param {*} str
 * @returns
 */
export function str2unicodeFormate(str) {
  let ret = [];

  let gap = '$_$';

  for (let i = 0, len = str.length; i < len; i++) {
    let ustr = '';
    let code = str.charCodeAt(i);
    let code16 = code.toString(16);

    if (code < 0xf) {
      ustr = `000${code16}`;
    } else if (code < 0xff) {
      ustr = `00${code16}`;
    } else if (code < 0xfff) {
      ustr = `0${code16}`;
    } else {
      ustr = `${code16}`;
    }
    ret.push(ustr);
  }

  return ret.join(gap);
}

/**
 * 将指定的unicode格式转换字符串
 * @param {*} str
 * @returns
 */
export function unicodeFormate2str(str) {
  let ret = '\\u' + str.replace(/\$\_\$/g, '\\u');
  // console.log(ret);
  return new Function(`return '${ret}'`)();
}

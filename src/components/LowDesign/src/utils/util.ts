import { getActionApi, postActionApi, putActionApi, deleteActionApi, downloadActionApi, uploadActionApi } from '@/api/design/general'
import * as sass from 'sass'
import Avue from '@smallwei/avue'

export type Method = 'get' | 'post' | 'put' | 'delete'


const STYLE_KEY_OBJ = {
  form: { key: 'low_form_', label: '表单设计' },
  table: { key: 'low_table_', label: '表单开发' },
  default: { key: 'low_', label: '' }
};
const apiMap = {
  post: postActionApi,
  put: putActionApi,
  delete: deleteActionApi,
  download: downloadActionApi,
  upload: uploadActionApi,
  default: getActionApi,
};

// 往head添加style
const addStyle = (cssStr, id) => {
  const style = document.createElement('style');
  style.id = id;
  try {
    style.appendChild(document.createTextNode(cssStr));
  } catch {
    style['styleSheet'].cssText = cssStr;
  }
  document.head.appendChild(style);
};

// 动态添加SCSS样式
export const addScssStyle = async (scssStr, id, type = 'default') => {
  const { key, label } = STYLE_KEY_OBJ[type];
  const onlyKey = `${key}${id}`;
  delScssStyle(id, type);
  try {
    const sassRes = await sass.compileStringAsync(scssStr);
    addStyle(sassRes.css, onlyKey);
  } catch (error) {
    console.warn(`${label}【${id}】SCSS编译失败:\n${error}`);
  }
};

// 删除SCSS样式
export const delScssStyle = (id, type = 'default') => {
  const key = STYLE_KEY_OBJ[type || 'default'].key;
  const selector = `style[id="${key}${id}"]`;
  const styleDom = document.querySelector(selector);
  if (styleDom) {
    styleDom.remove();
  }
};

// 统一接口调用
export const callApiFun = (method: Method, url, options = {}) => {
  if (method) method = method.toLowerCase() as Method
  const handler = apiMap[method] || apiMap.default;
  return handler(url, options);
};

// 辅助函数，用于检查和创建路径
const createNestedObject = (obj, pathArray) => {
  return pathArray.reduce((prev, cur) => {
    if (!prev[cur]) prev[cur] = {};
    return prev[cur];
  }, obj);
};

// 深结构Object赋值
export const setDeepObject = (obj, valObj) => {
  for (const key in valObj) {
    const deepList = key.split('.');
    const lastKey = deepList.pop(); // 获取最后一个键
    const nestedObj = createNestedObject(obj, deepList); // 创建中间路径
    if (lastKey) nestedObj[lastKey] = valObj[key]; // 设置值
  }
  return obj;
};

//校验是否为Json
export const isValidJson = (jsonStr) => {
  if (typeof jsonStr != 'string') return false
  try {
    JSON.parse(jsonStr)
    return true
  } catch (error) {
    return false
  }
}

//字符串转数组
export const stringToArr = (value, isLast?: boolean) => {
  let arr: string[] = []
  console.log(isValidJson(value))
  if (value === '[]') return arr
  if (value instanceof Array) arr = isLast ? [value[value.length - 1]] : [...value]
  else if (isValidJson(value)) {
    value = JSON.parse(value)
    if (value[0] && value[0] instanceof Array) value.forEach(i => arr = isLast ? [...arr, i[i.length - 1]] : [...arr, ...i])
  } else if (typeof value == 'string') {
    arr = value.split(',')
    if (isLast) arr = [arr[arr.length - 1]]
  }
  return arr
}

//长度验证
export const ruleLeng = (leng) => {
  const validateLeng = (rule, value, callback) => {
    if (value && value.length > leng) callback(`输入内容太长，最大输入长度为：${leng}`)
    else callback()
  }
  return { validator: validateLeng, trigger: 'blur' }
}


/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number') return false;
  if (val instanceof Array) {
    if (val.length === 0) return true;
  } else if (val instanceof Object) {
    for (const o in val) {
      return false;
    }
    return true;
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    ) {
      return true;
    }
    return false;
  }
  return false;
}

// 获取字典文本
export const getDicValue = (list, value, props = {}) => {
  if (validatenull(list)) return value;
  const isArray = Array.isArray(value);
  value = isArray ? value : [value];
  const result: any[] = [];
  const labelKey = props['label'] || 'label';
  const groupsKey = props['groups'] || 'groups';
  let dic = Avue.deepClone(list);
  dic.forEach(ele => {
    if (ele[groupsKey]) {
      dic = dic.concat(ele[groupsKey]);
      delete ele[groupsKey];
    }
  });
  value.forEach(val => {
    if (Array.isArray(val)) {
      const array_result: any[] = [];
      val.forEach(array_val => {
        const obj = Avue.findNode(dic, props, array_val) || {};
        array_result.push(obj[labelKey] || array_val);
      });
      result.push(array_result);
    } else {
      const obj = Avue.findNode(dic, props, val) || {};
      result.push(obj[labelKey] || val);
    }
  });
  if (isArray) {
    return result;
  } else {
    return result.join('');
  }
};


//获取网络字典
export const getNetworkDicData = (column) => {
  return new Promise((resolve, reject) => {
    const { dicUrl, dicMethod, dicHeaders, dicQuery, dicFormatter } = column
    if (dicUrl) {
      const option: any = {}
      if (dicHeaders) option.headers = dicHeaders
      if (dicQuery) {
        option[(!dicMethod || dicMethod == 'get') ? 'params' : 'data'] = dicQuery
      }
      callApiFun(dicMethod || 'get', dicUrl, option).then(res => {
        let list = [];
        if (typeof dicFormatter === 'function') {
          list = dicFormatter(res || {});
        } else {
          list = res || {};
        }
        resolve(list);
      }).catch((err) => {
        reject(err)
      })
    }
  })
}



/**
 * 对字符串函数的内容进行格式化
 * @param strFun 字符串函数
 */
export const formattingStrFunction = (strFun) => {
  if (import.meta.env.PROD) strFun = strFun.replace(/console\.log/g, '//console.log')
  strFun = strFun.replace(/(?<!http:|https:)\/\/.*\n/g, '\n')
  strFun = strFun.replace(/(?<!http:|https:)\/\/.*\r/g, '\n')
  strFun = strFun.replace(/\/\*{1,2}[\s\S]*?\*\//gis, '')
  strFun = strFun.replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '')
  return strFun
}
/**
 * 解析字符串函数
 * @param strFun 字符串函数
 */
export const analysisStrFunction: (strFun: string) => ((callData?:object) => object | void) | boolean = (strFun) => {
  strFun = formattingStrFunction(strFun)
  try {
    return eval(`(${strFun})`)
  } catch (error) {
    setTimeout(() => { console.error(error) });
    return false
  }
}

/**
 * 解析字符串对象
 * @param strObj 字符串对象
 * @param errTip 解析错误提示文本
 * @param callData 字符串对象内部可用值/方法
 */
export const handleStrObj: (strObj: string, errTip?: string,callData?:object) => object = (strObj, errTip,callData) => {
  const fun = analysisStrFunction(`function getData(callData){ 
    ${strObj}
   }`)
  if (typeof fun == 'boolean') {
    console.warn(errTip)
    return {}
  }
  const obj = fun(callData)
  if (obj instanceof Object) return obj
  return {}
}
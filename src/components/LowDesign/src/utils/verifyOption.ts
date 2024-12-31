
const lengObj = {
  all: { exp: '^.', message: '任意字符' },
  number: { exp: '^\d', message: '数字' },
  alphabet: { exp: '^[a-zA-Z]', message: '字母' },
  chinese: { exp: '^[\u4e00-\u9fa5]', message: '中文' }
}
export const patternObj = {
  phone: /^1[3-9]\d{9}$/,//手机号码
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,//电子邮箱
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//身份证号码
  postalCode: /^\d{6}$/,//邮政编码
  chineseStr: /^[\u4e00-\u9fa5]+$/,//中文
  url: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/,//网址
  money: /^-?\d+(\.\d{2})?$/,//金额
  getLeng: (min, max, type) => {
    if (!min && min !== 0) min = false
    if (!max && max !== 0) max = false
    let exp = lengObj[type].exp
    let message = lengObj[type].message
    if (min && max) {
      exp = `${exp}{${min},${max}}$`
      message = `请输入${min} ~ ${max}个${message}`
    }
    else if (min) {
      exp = `${exp}{${min},}$`
      message = `最少需要输入${min}个${message}`
    }
    else if (max) {
      exp = `${exp}{0,${max}}$`
      message = `最大可输入${max}个${message}`
    }
    return { message, pattern: new RegExp(exp) }
  }
}
export const rulesVerify = [
  { label: '唯一校验', tip: '校验当前值在数据库表内唯一', subTip: '校验当前值在表格内唯一', type: 'only', },
  { label: '字符长度校验', type: 'leng', controlType: 'length' },
  { label: '手机号码', type: 'phone', msg: '请输入正确格式的手机号码' },
  { label: '电子邮箱', type: 'email', msg: '请输入正确格式的邮箱地址' },
  { label: '身份证号码', type: 'idCard', msg: '请输入正确格式的身份证号' },
  { label: '邮政编码', type: 'postalCode', msg: '请输入正确格式的要邮政编码' },
  { label: '中文', type: 'chineseStr', msg: '只可以输入中文' },
  { label: '网址', type: 'url', msg: '请输入正确格式的网址' },
  { label: '金额', type: 'money', msg: '请输入正确的金额' },
  { label: '自定义正则表达式', tip: '例如：^[1-9]\d*$', type: 'customRegExp', controlType: 'regExp' },
  { label: '自定义校验规则', type: 'customRule', controlType: 'MEditor' }
]

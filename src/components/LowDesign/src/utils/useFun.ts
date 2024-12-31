import { callApiFun } from './util'
import { cloneDeep } from 'lodash-es'
import { listToTree } from '@/utils/tree';
import { formatDate, formatPast, betweenDay } from '@/utils/formatTime'
import { encryptAES, decryptAES } from '@/components/LowDesign/src/utils/aes'
import { useUserStoreWithOut } from '@/store/modules/user'


export default {
  /**
   * 接口调用
   * @param Method 'get' | 'post' | 'put' | 'delete' 请求方式
   * @param url 请求地址
   * @param options 请求配置 如：{ params:{ text:'测试' } }
  */
  requestApi: (Method, url, options) => callApiFun(Method, url, options),
  cloneDeep, //深拷贝
  listToTree,//列表转树结构
  formatDate,//时间格式化
  formatPast,//将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
  betweenDay,//计算两个日期间隔天数
  encryptAES,//aes加密
  decryptAES,//aes解密
  useUserStoreWithOut, //用户信息
  dynamicImport: async (path) => { //动态导入模块
    const module = await import(/* @vite-ignore */ `../../../../${path}`).catch((error) => {
      console.log(error)
      return false
    })
    return module
  },
}
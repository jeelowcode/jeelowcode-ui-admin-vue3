import request from '@/config/axios'

//获取表单设计详情数据
export const clearCache = () => {
  return request.get({ url: '/jeelowcode/dbform/clear-cache' })
}

import request from '@/config/axios'

export const getActionApi = (url, option) => {
  return request.get({ url, ...option })
}

export const postActionApi = (url, option) => {
  return request.post({ url, ...option })
}

export const putActionApi = (url, option) => {
  return request.put({ url, ...option })
}

export const deleteActionApi = (url, option) => {
  return request.delete({ url, ...option })
}

export const downloadActionApi = (url, option) => {
  return request.download({ url, ...option })
}

export const uploadActionApi = (url, option) => {
  return request.upload({ url, ...option })
}


// 获取历史Js增强/SQL增强/表单设计版本列表 type: desform js sql
export const getHistoryList = (params) => {
  return request.get({ url: `/jeelowcode/history/page`, params })
}

//获取历史Js增强/SQL增强/表单设计版本详情
export const getHistoryDetail = (params) => {
  return request.get({ url: `/jeelowcode/history/getDetail`, params })
}


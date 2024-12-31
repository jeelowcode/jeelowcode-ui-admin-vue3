import request from '@/config/axios'


//获取Java增强列表
export const getJavaList = (params) => {
  return request.get({ url: `/jeelowcode/enhance/java/${params.pageSize ? 'page' : 'list'}`, params })
}

//新增Java增强
export const saveJavaData = (data) => {
  return request.post({ url: '/jeelowcode/enhance/java/save', data })
}

//修改Java增强
export const updateJavaData = (data) => {
  return request.put({ url: '/jeelowcode/enhance/java/update', data })
}

//获取Java增强详情数据
export const getJavaDetail = (id) => {
  return request.get({ url: `/jeelowcode/enhance/java/detail?id=${id}` })
}

//删除Java增强数据
export const deleteJavaData = (ids) => {
  return request.delete({ url: '/jeelowcode/enhance/java/delete', data: ids })
}


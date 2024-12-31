import request from '@/config/axios'


//获取SQL增强列表
export const getSqlList = (params) => {
  return request.get({ url: `/jeelowcode/enhance/sql/${params.pageSize ? 'page' : 'list'}`, params })
}

//新增SQL增强
export const saveSqlData = (data) => {
  return request.post({ url: '/jeelowcode/enhance/sql/save', data })
}

//修改SQL增强
export const updateSqlData = (data) => {
  return request.put({ url: '/jeelowcode/enhance/sql/update', data })
}

//获取SQL增强详情数据
export const getSqlDetail = (id) => {
  return request.get({ url: `/jeelowcode/enhance/sql/detail?id=${id}` })
}

//删除SQL增强数据
export const deleteSqlData = (ids) => {
  return request.delete({ url: '/jeelowcode/enhance/sql/delete', data: ids })
}

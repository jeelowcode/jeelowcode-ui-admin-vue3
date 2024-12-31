import request from '@/config/axios'


//获取自定义按钮列表
export const getBtnList = (params) => {
  return request.get({ url: `/jeelowcode/enhance/button/${params.pageSize ? 'page' : 'list'}`, params })
}

//新增自定义按钮
export const saveBtnData = (data) => {
  return request.post({ url: '/jeelowcode/enhance/button/save', data })
}

//修改自定义按钮
export const updateBtnData = (data) => {
  return request.put({ url: '/jeelowcode/enhance/button/update', data })
}

//获取自定义按钮详情数据
export const getBtnDetail = (id) => {
  return request.get({ url: `/jeelowcode/enhance/button/detail?id=${id}` })
}

//删除自定义按钮数据
export const deleteBtnData = (ids) => {
  return request.delete({ url: `/jeelowcode/enhance/button/delete`, data: ids })
}

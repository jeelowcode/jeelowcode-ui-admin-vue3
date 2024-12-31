import request from '@/config/axios'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'

//获取表单设计列表
export const getFormList = (params) => {
  return request.post({ url: `/jeelowcode/desform/page`, params })
}

//获取模板表单列表
export const getTemplateFormList = () => {
  return request.get({ url: `/jeelowcode/desform/get/template` })
}

//新增表单设计
export const saveFormData = (data) => {
  data = encryptAES(JSON.stringify(data))
  return request.post({ url: '/jeelowcode/desform/save', data })
}

//修改表单设计
export const updateFormData = (data) => {
  data = encryptAES(JSON.stringify(data))
  return request.put({ url: '/jeelowcode/desform/update', data })
}

//获取表单设计详情数据
export const getFormDetail = (params) => {
  return request.get({ url: `/jeelowcode/desform/detail`, params })
}

//外部链接访问获取详情数据
export const getOpenFormDetail = (params) => {
  return request.get({ url: `/jeelowcode/open/desform/get/detail`, params })
}


//删除表单设计数据
export const deleteFormData = (ids) => {
  return request.delete({ url: `/jeelowcode/desform/delete`, data: ids })
}

//解除表单设计锁定
export const unlockForm = (id) => {
  return request.post({ url: `/jeelowcode/desform/unlock/${id}` })
}


//获取表单设计分组数据
export const getGroupData = (params) => {
  return request.get({ url: `/jeelowcode/group/desform/list`, params })
}
//新增表单设计分组
export const saveGroupData = (data) => {
  return request.post({ url: `/jeelowcode/group/desform/save`, data })
}
//修改表单设计分组
export const updateGroupData = (data) => {
  return request.put({ url: `/jeelowcode/group/desform/update`, data })
}
//删除表单设计分组
export const deleteGroupData = (ids) => {
  return request.delete({ url: '/jeelowcode/group/desform/delete', data: ids })
}
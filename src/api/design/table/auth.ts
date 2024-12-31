import request from '@/config/axios'


interface FieldData {
  tenantId: string | number
  dbformId: string
  fieldCode: string
  listIsView?: 'Y' | 'N'
  formIsView?: 'Y' | 'N'
  formIsEdit?: 'Y' | 'N'
  enableState?: 'Y' | 'N'
}

//获取权限租户列表数据
export const getAllTenant = () => {
  return request.get({ url: `/jeelowcode/adapter/tenant/list` })
}

//获取字段权限列表
export const getFieldAuth = (tenantId, dbFormId) => {
  return request.post({ url: `/jeelowcode/dbform-role/list-field?tenantId=${tenantId}&dbFormId=${dbFormId}` })
}

//保存字段权限配置
export const saveFieldAuth = (data: FieldData) => {
  return request.post({ url: `/jeelowcode/dbform-role/save-field`, data })
}

//获取按钮权限列表
export const getButtonAuth = (tenantId, dbFormId) => {
  return request.post({ url: `/jeelowcode/dbform-role/list-button?tenantId=${tenantId}&dbFormId=${dbFormId}` })
}

//保存字段权限配置
export const saveButtonAuth = (data) => {
  return request.post({ url: `/jeelowcode/dbform-role/save-button`, data })
}

//获取规则列表
export const getDataAuth = (tenantId, dbFormId) => {
  return request.post({ url: `/jeelowcode/dbform-role/list-data?tenantId=${tenantId}&dbFormId=${dbFormId}` })
}

//保存数据规则配置
export const saveDataAuth = (data) => {
  return request.post({ url: `/jeelowcode/dbform-role/save-data-tenant`, data })
}

//添加、修改数据规则数据
export const saveRuleData = (data) => {
  return request.post({ url: `/jeelowcode/dbform-role/save-data-rule`, data })
}

//删除数据规则
export const deleteRuleData = (ruleId) => {
  return request.delete({ url: `/jeelowcode/dbform-role/del-data-rule?ruleId=${ruleId}` })
}

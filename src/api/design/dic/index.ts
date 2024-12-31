import request from '@/config/axios'


//获取字典表格选择器配置
export const getDicTableConfig = (tableId, dicConfigStr) => {
  return request.post({
    url: `/jeelowcode/dbform/get/dict-table-web-config/${tableId}`, data: {
      jeeLowCode_dictTableField: dicConfigStr
    }
  })
}

//获取字典表格选择器值回显文本
export const getDicTableText = (data) => {
  return request.post({ url: `/jeelowcode/dbform/get/table-label`, data })
}

//获取用户选择器列表数据
export const getUserSelectList = (data) => {
  return request.post({ url: `/jeelowcode/adapter/user/list`, data })
}

//获取用户选择器的部门列表
export const getUserSelectDeptList = (type) => {
  return request.get({ url: `/jeelowcode/adapter/dept/list?type=${type}` })
}

//获取用户选择器的角色列表
export const getUserSelectRoleList = () => {
  return request.get({ url: `/jeelowcode/adapter/role/list` })
}
import request from '@/config/axios'

//获取报表列表
export const getDbList = (data) => {
  const url = `/jeelowcode/report/page?pageNo=${data.pageNo}&pageSize=${data.pageSize}`
  delete data.pageNo
  delete data.pageSize
  return request.post({ url, data })
}

//新增报表配置
export const saveDbData = (data) => {
  return request.post({ url: '/jeelowcode/report/save', data })
}

//修改报表配置
export const updateDbData = (data) => {
  return request.put({ url: '/jeelowcode/report/update', data })
}

//删除报表配置
export const deleteDbData = (ids) => {
  return request.delete({ url: '/jeelowcode/report/delete', data: ids })
}

//获取报表详情数据
export const getDbDetail = (id) => {
  return request.post({ url: `/jeelowcode/report/detail?reportId=${id}`, data: ['all'] })
}


//获取报表分组数据
export const getGroupData = (params) => {
  return request.get({ url: `/jeelowcode/group/report/list`, params })
}
//新增报表分组
export const saveGroupData = (data) => {
  return request.post({ url: `/jeelowcode/group/report/save`, data })
}
//修改报表分组
export const updateGroupData = (data) => {
  return request.put({ url: `/jeelowcode/group/report/update`, data })
}
//删除报表分组
export const deleteGroupData = (ids) => {
  return request.delete({ url: '/jeelowcode/group/report/delete', data: ids })
}


//校验报表编码是否存在
export const verifyReportCode = (code) => {
  return request.get({ url: '/jeelowcode/report/check/report-code?reportCode=' + code })
}


//复制报表
export const copyReportData = (reportCode, newReportCode) => {
  return request.get({ url: `/jeelowcode/report/copy/${reportCode}?reportCode=${newReportCode}` })
}

//获取报表Web配置数据
export const getWebConfig = (reportCode) => {
  return request.get({ url: '/jeelowcode/report/get/web-config?reportCode=' + reportCode })
}

//导出报表数据
export const exportExcelData = (reportCode, data?) => {
  return request.download({ url: `/jeelowcode/excel/exportReport/${reportCode}`, method: 'POST', data })
}

//获取报表数据
export const getTableList = (reportCode, data?, isOpen?) => {
  return request.post({ url: `/jeelowcode/${isOpen ? 'open/report' : 'report-data'}/list/${reportCode}`, data })
}


/**
 * 批量获取报表数据
 * reportCodes:报表编码 多个用逗号隔开 xxx,xxx
 * data:报表对应的搜索值
 * 格式 {
 *        报表编码:{搜索配置}
 *      }
 * */
export const batchGetTableList = (reportCodes: string, data?) => {
  return request.post({ url: `/jeelowcode/report-data/batch/list/${reportCodes}`, data })
}



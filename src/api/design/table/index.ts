import request from '@/config/axios'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'

//获取表单开发列表
export const getDbList = (data) => {
  const url = `/jeelowcode/dbform/page?pageNo=${data.pageNo}&pageSize=${data.pageSize}`
  delete data.pageNo
  delete data.pageSize
  return request.post({ url, data })
}

//新增表单开发配置
export const saveDbData = (data) => {
  return request.post({ url: '/jeelowcode/dbform/save', data })
}

//修改表单开发配置
export const updateDbData = (data) => {
  return request.put({ url: '/jeelowcode/dbform/update', data })
}

//删除表单开发配置
export const deleteDbData = (ids) => {
  return request.delete({ url: '/jeelowcode/dbform/delete', data: ids })
}

/**
 * 获取表单开发详情数据
 * @param id 
 * @param typeList Array[string] 查询类型 all dict export foreignkey web
 */
export const getDbDetail = (id, typeList) => {
  return request.post({ url: `/jeelowcode/dbform/detail?dbFormId=${id}`, data: typeList })
}


//获取表单开发分组数据
export const getGroupData = (params) => {
  return request.get({ url: `/jeelowcode/group/dbform/list`, params })
}
//新增表单开发分组
export const saveGroupData = (data) => {
  return request.post({ url: `/jeelowcode/group/dbform/save`, data })
}
//修改表单开发分组
export const updateGroupData = (data) => {
  return request.put({ url: `/jeelowcode/group/dbform/update`, data })
}
//删除表单开发分组
export const deleteGroupData = (ids) => {
  return request.delete({ url: '/jeelowcode/group/dbform/delete', data: ids })
}


//校验表明是否存在
export const verifyDbName = (name) => {
  return request.get({ url: '/jeelowcode/dbform/check/table?tableName=' + name })
}

//同步数据库
export const asyncDbData = (tableId, syncModel) => {
  return request.post({ url: `/jeelowcode/dbform/sync-db/${tableId}?syncModel=${syncModel}` })
}

//复制表单开发
export const copyDbData = (tableId, tableName) => {
  return request.get({ url: `/jeelowcode/dbform/copy/${tableId}?tableName=${tableName}` })
}

//获取Web配置数据
export const getWebConfig = (tableId) => {
  return request.get({ url: '/jeelowcode/dbform/get/web-config?dbformId=' + tableId })
}

/**
 * 获取所有表名和表字段(字典配置用)
 * @param systemFlag 'Y' 是否查询系统表
 * @param dataSourcesCode 数据源
 * @param onlyTableName 'Y' 是否只查表
 */
export const getAllDbDicData = (params = {}) => {
  return request.get({ url: '/jeelowcode/dbform/get/all-table', params })
}

//获取表单懒加载控件回显结构数据
export const getLazyStructureData = (data) => {
  return request.post({ url: `/jeelowcode/dbform/get/tree-parent`, data: { jeeLowCode_treeParent: encryptAES(JSON.stringify(data)) } })
}

//视图表数据源SQL测试
export const viewDataOriginTest = (data) => {
  return request.post({ url: `/jeelowcode/dbform/explain/datasource-sql`, data })
}

//视图表数据源SQL解析
export const viewDataOriginAnalysis = (data) => {
  return request.post({ url: `/jeelowcode/dbform/explain/sqlfield`, data })
}

//获取未在表单开发的数据库表
export const getSqlFormDicData = () => {
  return request.get({ url: `/jeelowcode/dbform/get/not-in-dbform-tables` })
}

//获取通过数据库表反向生成的配置数据
export const getSqlFormConfig = (tableName) => {
  return request.get({ url: `/jeelowcode/dbform/get/tables-field?tableName=${tableName}` })
}

//上传文件/图片
export const upLoadData = (data) => {
  return request.upload({ url: '/infra/file/jeelowcode/upload', data })
}


//获取表数据
export const getTableList = (tableId, data, isOpen?) => {
  return request.post({ url: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/list/${tableId}`, data })
}

//新增表数据
export const saveTableData = (tableId, data, isOpen?) => {
  return request.post({ url: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/save/${tableId}`, data })
}

//批量新增表数据
export const batchSaveTableData = (tableId, data: object[], isOpen?) => {
  return request.post({ url: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/save/batch/${tableId}`, data })
}

//修改表数据
export const updateTableData = (tableId, data) => {
  return request.put({ url: `/jeelowcode/dbform-data/edit/${tableId}`, data })
}

//批量修改表数据
export const batchUpdateTableData = (tableId, data) => {
  return request.put({ url: `/jeelowcode/dbform-data/edit/batch/${tableId}`, data })
}

//删除表数据
export const deleteTableData = (tableId, ids) => {
  return request.delete({ url: `/jeelowcode/dbform-data/delete/${tableId}`, data: ids })
}

//获取表数据详情
export const getTableDetail = (tableId, id, isOpen) => {
  return request.post({ url: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/detail/${tableId}/${id}` })
}

//导出Excel表数据
export const exportExcelData = (tableId, data) => {
  return request.download({ url: `/jeelowcode/excel/exportExcel/${tableId}`, method: 'POST', data })
}

//下载导入模板
export const downloadImportTemplate = (tableId) => {
  return request.download({ url: `/jeelowcode/excel/exportExcelTemplate/${tableId}` })
}

//上传需要导入的数据
export const uploadViewExcelData = (tableId, data) => {
  return request.upload({ url: `/jeelowcode/excel/viewExcel/${tableId}`, data: data })
}

//查询预览导入进度
export const getViewImportProgress = (tableId, batchCode) => {
  return request.get({ url: `/jeelowcode/excel/viewProgress/${tableId}?batchCode=${batchCode}` })
}

//获取上传的导入数据
export const getUploadImportData = (tableId, params) => {
  return request.post({ url: `/jeelowcode/excel/view/page/${tableId}`, params })
}

//修改上传的导入数据
export const updateUploadImportData = (tableId, data) => {
  return request.post({ url: `/jeelowcode/excel/update/fileData/${tableId}`, data })
}
//删除上传的导入数据
export const deleteUploadImportData = (tableId, id) => {
  return request.post({ url: `/jeelowcode/excel/del/fileData/${tableId}`, data: { id } })
}

//导入上传数据
export const importUploadData = (tableId, batchCode) => {
  return request.post({ url: `/jeelowcode/excel/run/import/${tableId}?batchCode=${batchCode}` })
}

//获取历史导入记录
export const getHistoryImportData = (tableId, params) => {
  return request.post({ url: `/jeelowcode/excel/file/list/${tableId}`, params })
}

//撤销导入
export const cancelImportData = (tableId, batchCode) => {
  return request.post({ url: `/jeelowcode/excel/rollback/${tableId}?batchCode=${batchCode}` })
}


//获取导入进度
export const getImportProgress = (tableId, params) => {
  return request.get({ url: `/jeelowcode/excel/importProgress/${tableId}`, params })
}

//设置导入状态
export const setImportState = (tableId, params) => {
  return request.get({ url: `/jeelowcode/excel/importOpTask/${tableId}`, params })
}

//下载导入失败的excel
export const downloadImportError = (tableId, batchCode) => {
  return request.download({ url: `/jeelowcode/excel/downloadErrorExcel/${tableId}?batchCode=${batchCode}` })
}

//校验值是否唯一
export const verifyDataOnly = (tableId, data) => {
  return request.post({ url: `/jeelowcode/dbform-data/unique/${tableId}`, data })
}

//获取表数据统计信息
export const getTableDataSummary = (tableId, data) => {
  return request.post({ url: `/jeelowcode/dbform-data/summary/${tableId}`, data })
}

//获取地区控件回显数据
export const getRegionEchoData = (data) => {
  return request.post({ url: `/system/area/view-parent-list`, data })
}




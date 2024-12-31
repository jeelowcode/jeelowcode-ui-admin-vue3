import request from '@/config/axios'

type LogType = 'info' | 'error'

// 获取请求日志列表
export const getLogPage = (logType: LogType, params) => {
  return request.get({ url: `/jeelowcode/apilog/page`, params: { logType, ...params } })
}

// 获取日志详情
export const getLogDetail = (logType: LogType, id: string) => {
  return request.get({ url: `/jeelowcode/apilog/detail?logType=${logType}&id=${id}`, })
}

// 清除日志记录
export const deleteLog = (logType: LogType, delDate: string) => {
  return request.delete({ url: `/jeelowcode/apilog/delete?logType=${logType}&delDate=${delDate}`, })
}


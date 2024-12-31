import request from '@/config/axios'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'

//新增Js增强
export const saveJsData = (data) => {
  data = encryptAES(JSON.stringify(data))
  return request.post({ url: '/jeelowcode/enhance/js/save', data })
}

//修改Js增强
export const updateJsData = (data) => {
  data = encryptAES(JSON.stringify(data))
  return request.put({ url: '/jeelowcode/enhance/js/update', data })
}

//获取Js增强详情数据
export const getJsDetail = (params) => {
  return request.get({ url: `/jeelowcode/enhance/js/detail`, params })
}

//解除Js增强锁定
export const unlockJs = (dbformId, type) => {
  return request.post({ url: `/jeelowcode/enhance/js/unlock/${dbformId}?type=${type}` })
}

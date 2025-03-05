import { store } from '../index'
import { defineStore } from 'pinia'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { getAreaTree } from '@/api/system/area/index';
import { forEach } from '@/utils/tree';
const { wsCache } = useCache('sessionStorage')

interface LowInfo {
  dicObj: any
  isSetRegion: boolean
}

export const useLowStore = defineStore('low-info', {
  state: (): LowInfo => ({
    dicObj: {},
    isSetRegion: false
  }),
  getters: {
    getIsSetRegion(): boolean {
      return this.isSetRegion
    },
  },
  actions: {
    setDicObj(key, dicObj) {
      if (!this.dicObj[key]) this.dicObj[key] = {}
      this.dicObj[key] = {
        ...this.dicObj[key],
        ...dicObj
      }
    },
    async setRegion() {
      const regionKey = 'regionSelect'
      const regionObj = wsCache.get(CACHE_KEY.LOW_REGION)
      if (regionObj) {
        this.dicObj[regionKey] = regionObj || {}
        this.isSetRegion = true
      } else {
        const res = await getAreaTree()
        const regionObj = {}
        console.log(res)
        forEach(res, (region) => {
          regionObj[region.id] = region.name
        })

        this.dicObj[regionKey] = regionObj
        this.isSetRegion = true
        wsCache.set(CACHE_KEY.LOW_REGION, regionObj, { exp: 60 }) // 60 秒 过期
      }
    },

  }
})

export const useLowStoreWithOut = () => {
  return useLowStore(store)
}

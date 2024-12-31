import { store } from '../index'
import { defineStore } from 'pinia'

interface LowInfo {
  dicObj: any
}

export const useLowStore = defineStore('low-info', {
  state: (): LowInfo => ({
    dicObj: {}
  }),
  getters: {

  },
  actions: {
    setDicObj(key, dicObj) {
      if (!this.dicObj[key]) this.dicObj[key] = {}
      this.dicObj[key] = {
        ...this.dicObj[key],
        ...dicObj
      }
    },
  }
})

export const useLowStoreWithOut = () => {
  return useLowStore(store)
}

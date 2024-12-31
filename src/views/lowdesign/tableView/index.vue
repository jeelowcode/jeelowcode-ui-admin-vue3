<template>
  <ContentWrap>
    <LowTable v-if="tableId" :tableId="tableId" :isPermi="isPermi"></LowTable>
    <div v-else>无权限访问</div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const route = useRoute()
const { wsCache } = useCache()
const tableId = ref('')
const isPermi = ref(false)

onMounted(() => {
  if (route.params.id) {
    //功能测试
    const menus = wsCache.get(CACHE_KEY.USER).menus
    const praentArr = route.meta.activeMenu?.split('/').filter((path) => path) || []
    let isPermission = false
    if (praentArr.length) {
      praentArr[0] = '/' + praentArr[0]
      let findIndex = 0
      const findPath = (menuList) => {
        for (const index in menuList) {
          if (menuList[index].path == praentArr[findIndex]) {
            if (findIndex == praentArr.length - 1) isPermission = true
            else findIndex++
            if (menuList[index].children) findPath(menuList[index].children)
            if (isPermission) break
          }
        }
      }
      findPath(menus)
    }
    if (isPermission && typeof route.params.id == 'string') tableId.value = route.params.id
  } else {
    const pathList = route.path.split('/')
    const length = pathList.length - 1
    if (/\d$/.test(pathList[length])) {
      tableId.value = pathList[length]
      isPermi.value = true
    }
  }
})
</script>

<style lang="scss" scoped></style>

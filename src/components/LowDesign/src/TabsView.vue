<template>
  <div v-if="showType == 'view'" class="h-100%">
    <TabsControl v-if="isInit" ref="controlRef" v-bind="tabsVBind || {}"></TabsControl>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </div>
  <DesignPopup v-else v-model="popupShow" v-bind="popupVBind" v-model:isFull="isFull">
    <TabsControl v-if="isInit" ref="controlRef" v-bind="tabsVBind || {}"></TabsControl>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </DesignPopup>
</template>

<script setup lang="ts">
import { designPopup } from './types/designPopup'
import { useWindowSize } from '@vueuse/core'

defineOptions({ name: 'TabsView' })

interface Props {
  tabsData: object //标签页配置
  tabsParams?: any //标签页配置
  defaultTab?: string | number //默认显示标签
  lazy?: boolean //是否开启懒加载
  popOption?: designPopup //弹窗配置
  showType?: 'view' | 'dialog' | 'drawer' //显示类型
  calcTabsNum?: number
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = withDefaults(defineProps<Props>(), {
  showType: 'dialog'
})
const isInit = ref(false)
const isFull = ref(false)

const controlRef = ref<any>({})
const windowSize = useWindowSize()

const heightData = computed(() => {
  const obj = { tabHeight: '', calcNum: 0 }
  let defaultHeight = 57
  const tabPosition = props.tabsParams?.tabPosition
  const footerBtn = props.popOption?.footerBtn
  if (!tabPosition || ['', undefined, 'top', 'bottom'].includes(tabPosition))
    defaultHeight = defaultHeight + 41
  if (footerBtn && footerBtn.length) defaultHeight = defaultHeight + 53
  if (props.calcTabsNum) {
    defaultHeight = defaultHeight + props.calcTabsNum + (props.calcTabsNum == 55 ? 40 : 0)
  }
  if (isFull.value) {
    obj.tabHeight = `calc(100vh - ${defaultHeight}px)`
    obj.calcNum = defaultHeight
  } else {
    obj.tabHeight = `calc(90vh - 70px - ${defaultHeight}px)`
    obj.calcNum = windowSize.height.value * 0.1 + defaultHeight + 110
  }
  return obj
})

const tabsVBind = computed(() => {
  return {
    tabsData: props.tabsData,
    tabsParams: props.tabsParams,
    heightData: heightData.value,
    defaultTab: props.defaultTab,
    lazy: props.lazy,
    calcTabsNum: props.calcTabsNum || 0
  }
})
const popupVBind = computed(() => {
  return {
    ...props.popOption,
    controlType: props.showType as designPopup['controlType']
  }
})

const initControl = async () => {
  isInit.value = false
  setTimeout(() => {
    isInit.value = true
  }, 30)
}

watch(
  () => popupShow.value,
  (val) => {
    if (val) initControl()
  }
)

watch(
  () => Object.keys(props.tabsData).length,
  (val) => {
    if (val > 0) initControl()
  },
  { immediate: true }
)

defineExpose({ controlRef, initControl })
</script>

<style lang="scss" scoped></style>

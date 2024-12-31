<template>
  <div v-if="showType == 'view' || !showType" class="p-20px">
    <LowTable v-if="isInit" ref="controlRef" v-bind="tableVBind"></LowTable>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </div>
  <DesignPopup v-else v-model="popupShow" v-model:isFull="isFull" v-bind="popupVBind">
    <div v-if="isInit" class="p-20px">
      <LowTable ref="controlRef" v-bind="tableVBind"></LowTable>
    </div>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </DesignPopup>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { designPopup } from './types/designPopup'

defineOptions({ name: 'TableView' })

interface Props {
  tableId: string //表单开发id
  fixedSearch?: object //固定表格搜索值（每次查询都会带上）
  enhanceData?: object //传递给表格js增强内部调用配置
  popOption?: designPopup //弹窗配置
  showType?: 'view' | 'dialog' | 'drawer' //显示类型
  calcNum?: number
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = withDefaults(defineProps<Props>(), {
  showType: 'dialog'
})
const isInit = ref(false)
const controlRef = ref<any>()
const isFull = ref(false)

const windowSize = useWindowSize()
const calcHeight = computed(() => {
  if (props.calcNum) return props.calcNum
  const footerBtn = props.popOption?.footerBtn
  let num = isFull.value ? 20 : windowSize.height.value * 0.1 + 147
  if (footerBtn && footerBtn.length) num = num + 54
  return num
})

const tableVBind = computed(() => {
  return {
    tableId: props.tableId,
    calcHeight: calcHeight.value,
    fixedSearch: props.fixedSearch,
    enhanceData: props.enhanceData
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
  () => props.tableId,
  (val, oldVal) => {
    if (val != oldVal) initControl()
  },
  { immediate: true }
)

watch(
  () => popupShow.value,
  (val) => {
    if (val) initControl()
  }
)

defineExpose({ controlRef, initControl })
</script>

<style lang="scss" scoped></style>

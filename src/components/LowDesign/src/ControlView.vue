<template>
  <div v-if="showType == 'view'" class="p-20px">
    <component
      v-if="isInit"
      :is="componentData"
      ref="controlRef"
      v-bind="controlParams || {}"
    ></component>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </div>
  <DesignPopup v-else v-model="popupShow" v-bind="popupVBind">
    <div class="p-20px" v-if="isInit">
      <component :is="componentData" ref="controlRef" v-bind="controlParams || {}"></component>
    </div>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </DesignPopup>
</template>

<script setup lang="ts">
import { designPopup } from './types/designPopup'
import { registerComp } from '../src/utils/registerComponent'

defineOptions({ name: 'ControlView' })

interface Props {
  controlName?: string //控件名称
  controlPath?: string //控件相对路径
  controlParams?: object //控件配置
  popOption?: designPopup //弹窗配置
  showType?: 'view' | 'dialog' | 'drawer' //显示类型
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = withDefaults(defineProps<Props>(), {
  showType: 'dialog'
})
const isInit = ref(false)
let component = markRaw({})

const controlRef = ref<any>()

const popupVBind = computed(() => {
  return {
    ...props.popOption,
    controlType: props.showType as designPopup['controlType']
  }
})

const componentData = computed(() => {
  if (!props.controlPath && !props.controlName) return ''
  if (props.controlPath) return component
  else return props.controlName
})
const initControl = async () => {
  isInit.value = false
  component = registerComp(props.controlPath) as any
  setTimeout(() => {
    isInit.value = true
  }, 30)
}

watch(
  () => props.controlPath,
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

<template>
  <div v-if="columnItem.type == 'title'" :style="columnItem.styles">{{ columnItem.value }}</div>
  <div
    v-else-if="columnItem.type == 'buttonList'"
    class="w-100%"
    :style="{ textAlign: columnItem.params.location }"
  >
    <template v-for="item in columnItem.params.buttonList" :key="item.prop">
      <el-button :class="{ 'layout-btn': true, hide: !item.display }" v-bind="item" icon="">
        <span class="mr-3px" v-if="item.icon">
          <Icon :size="14" :icon="item.icon" />
        </span>
        <span>{{ item.label }}</span>
      </el-button>
    </template>
  </div>
  <div
    v-else-if="columnItem.type == 'customControl'"
    class="color-#999"
    :class="{
      'h-32px': formOption.size == 'default',
      'h-40px': formOption.size == 'large',
      'h-24px': formOption.size == 'small'
    }"
  >
    请在预览查看控件{{ columnItem.componentName ? `(${columnItem.componentName})` : '' }}
  </div>
  <div v-else-if="columnItem.type == 'markDown'" class="w-100%">
    <MarkDown
      :placeholder="placeholderObj.placeholder"
      :column="{ editorOption: { height: '200px' } }"
    ></MarkDown>
  </div>
  <component
    v-else-if="isShow"
    class="w-100%"
    :is="getComponentName(columnItem.type, columnItem.controlType, columnItem.component)"
    v-bind="vBind"
    :class="{ flex: !['ueditor'].includes(columnItem.type) }"
    v-model="defaultValue"
    :placeholder="placeholderObj.placeholder"
    :startPlaceholder="placeholderObj.startPlaceholder"
    :endPlaceholder="placeholderObj.endPlaceholder"
    :readonly="true"
  >
  </component>
</template>

<script setup lang="ts">
import { handleStrObj } from '@/utils/lowDesign'
import { filter } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
defineOptions({ name: 'LayoutItem' })

const props = defineProps({
  columnItem: {
    type: Object,
    default: () => {
      return {}
    }
  },
  controlParams: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const { columnItem, controlParams } = toRefs(props)

const { formOption } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType
const isShow = ref(false)
const defaultValue = ref<any>()

const vBind = computed(() => {
  let dicData = columnItem.value.dicData || []
  let { dicType, delDicValue, type } = columnItem.value
  if (dicType && delDicValue && columnItem.value[`${dicType}DicData`]) {
    if (['tree', 'cascader'].includes(type)) {
      dicData = filter(
        columnItem.value[`${dicType}DicData`],
        (item) => {
          return !delDicValue.includes(item.value)
        },
        { children: 'children', id: 'value' }
      )
    } else {
      dicData = columnItem.value[`${dicType}DicData`].filter(
        (item) => !delDicValue.includes(item.value)
      )
    }
  } else if (dicType) dicData = columnItem.value[`${dicType}DicData`]
  let moreData = { dic: dicData }
  const data = Object.assign(cloneDeep(columnItem.value), cloneDeep(controlParams.value), moreData)
  if (type == 'number') data.class = `avue-number-position-${data.textPosition}`
  return data
})
const placeholderObj = computed(() => {
  const { type, controlType, label, placeholder, startPlaceholder, endPlaceholder } =
    columnItem.value
  let placeholderObj = {
    placeholder: placeholder,
    startPlaceholder: startPlaceholder,
    endPlaceholder: endPlaceholder
  }
  let prefix = '请选择'
  if (['input', 'textarea', 'number', 'password', 'monacoEditor', 'markDown'].includes(type))
    prefix = '请输入'
  if (!placeholder) placeholderObj.placeholder = `${prefix} ${label}`
  if (['date', 'time'].includes(controlType) && type.indexOf('range') != -1) {
    if (!startPlaceholder) placeholderObj.startPlaceholder = `${prefix} 开始${label}`
    if (!endPlaceholder) placeholderObj.endPlaceholder = `${prefix} 结束${label}`
  }
  return placeholderObj
})

watch(
  () => columnItem.value.value,
  (val: any) => {
    const { controlType } = columnItem.value
    if (['input', 'array', 'select'].includes(controlType)) defaultValue.value = val
  }
)

const setShow = () => {
  isShow.value = false
  nextTick(() => (isShow.value = true))
}
const getComponentName = (type, controlType, component) => {
  let avueFormKey = 'avue-'
  let controlName = type || 'input'
  if (component) return component
  if (['number', 'tree', 'table', 'map', 'color'].includes(type)) controlName = `input-${type}`
  if (
    [
      'textarea',
      'password',
      'monacoEditor',
      'dicTableSelect',
      'userSelect',
      'deptSelect',
      'markDown'
    ].includes(type)
  )
    controlName = 'input'
  if (['date', 'time', 'upload'].includes(controlType)) controlName = controlType
  if (type == 'regionSelect') controlName = 'cascader'
  return `${avueFormKey}${controlName}`
}

watchEffect(() => {
  const type = columnItem.value.type
  if (type == 'title') {
    columnItem.value.styles = handleStrObj(columnItem.value.stylesStr)
  }
  if (type == 'textarea') {
    if (columnItem.value.minRows !== undefined) setShow()
  }
  if (['time', 'timerange'].includes(type)) setShow()
  if (['select', 'tree', 'cascader'].includes(type) && columnItem.value.multiple) setShow()
})

onMounted(() => {
  if (['image', 'file'].includes(columnItem.value.type)) defaultValue.value = []
  isShow.value = true
})
</script>

<style lang="scss" scoped></style>

<template>
  <div v-if="showType == 'view'">
    <LowForm
      ref="controlRef"
      v-if="isInit"
      v-bind="formVBind"
      :beforeClose="formBeforeClose"
    ></LowForm>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </div>
  <DesignPopup v-else v-model="popupShow" v-bind="popupVBind" :handleClose="popupHandleClose">
    <LowForm
      ref="controlRef"
      v-if="isInit"
      v-bind="formVBind"
      :beforeClose="formBeforeClose"
    ></LowForm>
    <div v-else class="h-200px" v-loading="!isInit"></div>
  </DesignPopup>
</template>

<script setup lang="ts">
import { designPopup } from './types/designPopup'
import { cloneDeep } from 'lodash-es'
import * as FormApi from '@/api/design/form'
import * as TableApi from '@/api/design/table'

defineOptions({ name: 'FormView' })

interface DataOption {
  tableId: string //表单开发id
  dataId?: string //数据id
}

interface Props {
  formId: string //表单id
  showButton?: boolean //是否显示操作按钮
  formType?: 'add' | 'edit' | 'view' //表单类型
  handleType?: 'default' | 'returnData' //处理类型
  showType?: 'view' | 'dialog' | 'drawer' //显示类型
  dataOption?: DataOption //数据配置
  popOption?: designPopup //弹窗配置
  defaultData?: object //表单默认数据
  enhanceData?: object //传递给表单js增强内部调用配置
  beforeClose?: Function
  optionsData?: object | string //表单配置
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = withDefaults(defineProps<Props>(), {
  showType: 'dialog',
  formType: 'add',
  showButton: true
})

const isInit = ref(false)
const formOption = ref<any>({})
const tableDetail = ref({})
const controlRef = ref<any>()

const defaultBtn = ref([
  {
    params: { type: 'danger' },
    name: '清空',
    loading: false,
    display: false,
    icon: 'ant-design:clear-outlined',
    clickFun: () => {
      if (controlRef.value) controlRef.value.handleClear()
    }
  },
  {
    params: { type: 'primary' },
    name: '保存',
    loading: true,
    display: false,
    icon: 'material-symbols:check-rounded',
    clickFun: async (loading) => {
      if (controlRef.value) await controlRef.value.handleSubmit(true, loading)
    }
  },
  {
    params: {},
    name: '取消',
    loading: false,
    display: true,
    icon: 'material-symbols:close-rounded',
    clickFun: () => {
      popupHandleClose()
    }
  }
])

const closeData = ref<any>({})

const formVBind = computed(() => {
  return {
    formId: props.formId,
    tableId: props.dataOption?.tableId,
    formType: props.formType || 'add',
    handleType: props.handleType,
    formOption: formOption.value,
    defaultData: { ...(props.defaultData || {}), ...tableDetail.value },
    enhanceData: props.enhanceData || {}
  }
})

const popupVBind = computed(() => {
  return {
    ...props.popOption,
    controlType: props.showType as designPopup['controlType'],
    footerBtn: [...(props.popOption?.footerBtn || []), ...defaultBtn.value]
  }
})

const popupHandleClose = (done?) => {
  if (!done) done = () => (popupShow.value = false)
  const { type, form, loading } = closeData.value
  const doneFun = () => {
    if (loading) loading()
    done()
  }
  if (type && props.beforeClose) {
    props.beforeClose(type, doneFun, form, loading, props.formId)
  } else props.beforeClose ? props.beforeClose('close', doneFun) : doneFun()
}

const formBeforeClose = (type, form, loading) => {
  closeData.value = { type, form, loading }
  popupHandleClose()
  setTimeout(() => {
    closeData.value = {}
  }, 30)
}

const getOption = () => {
  return new Promise(async (resolve) => {
    if (props.optionsData) {
      if (typeof props.optionsData == 'string') {
        formOption.value = JSON.parse(props.optionsData || `{}`)
      } else formOption.value = cloneDeep(props.optionsData)
    } else {
      const data = await FormApi.getFormDetail({ desFormId: props.formId })
      formOption.value = JSON.parse(data.desformJson || `{}`)
    }

    if (props.showType != 'view') {
      const { submitText, emptyText, emptyBtn, submitBtn } = formOption.value
      defaultBtn.value[0] = { ...defaultBtn.value[0], name: emptyText, display: emptyBtn }
      defaultBtn.value[1] = { ...defaultBtn.value[1], name: submitText, display: submitBtn }
      formOption.value.isEmptyBtn = false
      formOption.value.isSubmitBtn = false
    }
    if (props.showButton === false) {
      formOption.value.isEmptyBtn = false
      formOption.value.isSubmitBtn = false
      defaultBtn.value = []
    }
    resolve(true)
  })
}
const getTableDetail = () => {
  return new Promise(async (resolve) => {
    tableDetail.value = {}
    if (props.dataOption?.tableId && props.dataOption.dataId) {
      let data = await TableApi.getTableDetail(
        props.dataOption.tableId,
        props.dataOption.dataId,
        false
      )
      if (data.jeelowcode_subtable_data) {
        data = { ...data, ...data.jeelowcode_subtable_data }
        delete data.jeelowcode_subtable_data
      }
      tableDetail.value = data
    }
    resolve(true)
  })
}

const initControl = async () => {
  isInit.value = false
  if (!props.formId) return
  if (!formOption.value.columnObj) await getOption()
  await getTableDetail()
  isInit.value = true
}

watch(
  () => props.formId,
  (val, oldVal) => {
    if (val != oldVal) {
      formOption.value = {}
      initControl()
    }
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

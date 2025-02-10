<template>
  <div class="sub-form" :class="[subClassName]">
    <avue-form v-loading="loading" ref="formRef" v-model="formData" :option="formOption">
      <!-- 自定义表单 -->
      <template v-for="c in slotData.form" :key="c.prop" #[c.prop]="scope">
        <AvueSlot
          slotType="form"
          :scope="{ ...scope, type, disabled }"
          :control="c"
          v-model="formData[c.prop]"
        ></AvueSlot>
      </template>
    </avue-form>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import useMEDialog from '@/hooks/design/useMEDialog'
import { setFormLazyCacheData } from '../../utils/tableUtil'
defineOptions({ name: 'SubForm' })

interface Props {
  prop: string
  tableId: string
  optionData: object
  type: string
  disabled: boolean
}
const props = defineProps<Props>()

const formData = defineModel<object>({ default: () => {} })

const { MEDialog, MEData, openMEDialog } = useMEDialog()

const loading = ref(true)
const formOption = ref({
  submitBtn: false,
  emptyBtn: false,
  detail: false,
  column: {}
})
const controlObj = ref<any>({})
const componentObj = ref({})

const formRef = ref()

const subClassName = computed(() => {
  return `sub-table-${props.prop}`
})

const slotData = computed(() => {
  const slotObj = { form: [] as any[] }
  for (let key in controlObj.value) {
    controlObj.value[key].forEach((item) => {
      const { slotList } = item
      if (!slotList.length) return
      const obj: any = { controlType: key }
      if (key == 'monacoEditor') {
        obj.click = (scope) =>
          openMEDialog(Object.assign(scope.column, { disabled: scope.disabled }), formData.value)
      }
      if (key == 'customControl') obj.getComponent = (key) => componentObj.value[key]
      slotList.forEach((type) => {
        if (['search', 'list'].includes(type)) return
        if (slotObj[type]) slotObj[type].push({ ...item, ...obj })
      })
    })
  }
  return slotObj
})

const initForm = () => {
  if (props.type == 'view') formOption.value.detail = true
  componentObj.value = props.optionData['componentData']
  controlObj.value = props.optionData['control']
  formOption.value.column = props.optionData['tableOption'].column
  loading.value = false
  setTimeout(() => {
    formRef.value.dicInit()
    setFormLazyCacheData(formOption.value.column, controlObj.value, formData.value).then(
      (lazyData) => {
        for (const key in lazyData) {
          lazyData[key].props.forEach(
            (prop) => (formOption.value.column[prop].cacheData = lazyData[key].data)
          )
        }
      }
    )
  }, 100)
}

const verifyForm = () => {
  const errorObj = { valid: true, prop: '', errorMsg: '', tabProp: props.prop }
  return new Promise(async (resolve) => {
    formRef.value.validate(async (valid, hide, msg) => {
      hide()
      if (!valid) {
        const oneKey = Object.keys(msg)[0]
        errorObj.valid = false
        errorObj.prop = oneKey
        errorObj.errorMsg = msg[oneKey].message
      }
      resolve(errorObj)
    })
  })
}

onMounted(() => {
  initForm()
})

defineExpose({ prop: props.prop, tableId: props.tableId, formOption: formOption.value, verifyForm })
</script>

<style lang="scss" scoped>
.sub-form {
  ::v-deep(.avue-form) {
    .el-form-item {
      margin-bottom: 18px !important;
    }

    .el-form-item .el-form-item {
      margin-bottom: 0 !important;
    }
  }
}
</style>

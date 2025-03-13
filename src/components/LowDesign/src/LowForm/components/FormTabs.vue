<template>
  <div class="form-tabs" :class="[`form-tabs__${prop}`]">
    <el-tabs
      v-if="isInit"
      v-model="tabsValue"
      v-bind="tabsOption.params"
      :before-leave="beforeLeave"
      @tab-change="tabChange"
      class="demo-tabs"
    >
      <el-tab-pane
        v-for="(item, key) in tabsOption.column"
        :key="key"
        :label="item.label"
        :name="item.value"
        :class="`control-${key}`"
      >
        <avue-form
          :ref="(el) => (avueFormRef[key] = el)"
          v-model="tabsData[key]"
          :option="item"
          :key="key"
          :upload-before="uploadBefore"
          :upload-exceed="uploadExceed"
          :upload-sized="uploadSized"
          :upload-preview="uploadPreview"
        >
          <!-- 自定义表单 -->
          <template v-for="c in slotData[key].form" :key="c.prop" #[c.prop]="scope">
            <AvueSlot
              :ref="(el) => (formSlotRef[`${key}_${c.prop}`] = el)"
              slotType="form"
              :scope="scope"
              :control="c"
              :formType="formType"
              v-model="tabsData[key][c.prop]"
              @set-form-data="(prop, val) => (tabsData[key][prop] = val)"
            ></AvueSlot>
          </template>
          <!-- 表格布局 -->
          <template
            v-for="c in controlObj['layoutTabs_' + props.prop + '_' + key].layoutTable"
            :key="c.prop"
            #[c.prop]="scope"
          >
            <FormTable
              :ref="(el) => (formTableRef[c.prop] = el)"
              v-model="tabsData[key][c.prop]"
              v-bind="{
                column: scope.column,
                disabled: scope.disabled,
                size: scope.size,
                prop: c.prop,
                formType
              }"
            ></FormTable>
          </template>
        </avue-form>
      </el-tab-pane>
    </el-tabs>
    <DesignPopup
      v-if="isMonacoEditor"
      v-model="MEDialog.value"
      v-bind="MEDialog.params"
      :isBodyFull="true"
    >
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import useMEDialog from '@/hooks/design/useMEDialog'
import useAvueUpload from '@/hooks/design/useAvueUpload'
import { lowFormKey, LowFormType } from '@/utils/symbols'
import { formattingStrFunction } from '@/utils/lowDesign'
import { TabsEnhanceObj } from '../../utils/formUtil'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'FormTabs' })

interface Props {
  prop: string
  disabled: boolean
  size: string
  formType: string
  modelValue: object
  column: any
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => {
    return {}
  }
})
const {
  controlObj,
  rulesObj,
  useFun,
  useImport,
  enhanceData,
  message,
  formData,
  viewLoading,
  rendControlData,
  Vue,
  route,
  routes,
  getComponent,
  enhanceErrorTip,
  handleMonacoEditorClick
} = inject<LowFormType>(lowFormKey) as LowFormType

const avueFormRef = ref<any>({})
const formSlotRef = ref({})
const formTableRef = ref({})
const tabsOption = ref({}) as any
const tabsData = ref(props.modelValue || {})
const tabsValue = ref('0')
const tabsEnhanceObj = ref<TabsEnhanceObj>({})
const isInit = ref(false)
const componentObj = ref({})

const { MEDialog, MEData, openMEDialog } = useMEDialog()
const { uploadBefore, uploadExceed, uploadSized, uploadPreview } = useAvueUpload()

const emit = defineEmits(['update:modelValue'])

const parentKey = computed(() => {
  return 'layoutTabs_' + props.prop
})

const isMonacoEditor = computed(() => {
  let bool = false
  for (let key in controlObj.value) {
    if (bool) break
    if (key.indexOf(`layoutTabs_${props.prop}_`) === 0) {
      if (controlObj.value[key].monacoEditor) bool = true
    }
  }
  return bool
})

const slotData = computed(() => {
  const slotObj = {}
  for (let tabKey in tabsOption.value.column) {
    slotObj[tabKey] = { list: [] as any[], form: [] as any[] }
    const controlData = controlObj.value[`${parentKey.value}_${tabKey}`]
    for (let key in controlData) {
      controlData[key].forEach((item) => {
        const { slotList } = item
        if (!slotList.length) return
        const obj: any = { controlType: key }
        if (key == 'monacoEditor') {
          obj.click = (scope) => {
            let params = scope.column.params
            params = handleMonacoEditorClick(params, executeStrFunction)
            openMEDialog(
              Object.assign(scope.column, { disabled: scope.disabled }),
              tabsData.value[tabKey]
            )
          }
        }
        if (key == 'customControl') obj.getComponent = (key) => componentObj.value[key]
        else if (['buttonList', 'comboBox'].includes(key)) {
          obj.click = (clickStr, obj, errorTip) => {
            executeStrFunction(clickStr, [obj], errorTip)
          }
        }
        slotList.forEach((type) => {
          if (slotObj[tabKey][type]) slotObj[tabKey][type].push({ ...item, ...obj })
        })
      })
    }
  }

  return slotObj
})

watch(
  () => props.modelValue,
  (val) => {
    tabsData.value = val
  }
)
watch(
  () => tabsData.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

const initFun = () => {
  componentObj.value = getComponent().value
  const tabsEnhanceFun = executeJsEnhance(
    props.column.tabsEnhanceStr,
    props.prop + ' 选项卡增强配置初始化异常，请检查增强内容'
  )
  tabsEnhanceObj.value = tabsEnhanceFun || {}
  const formOption = { ...props.column.formOption, menuBtn: false, size: props.size }
  tabsOption.value = { ...props.column }
  delete tabsOption.value.formOption
  for (let key in tabsOption.value.column) {
    tabsOption.value.column[key] = { ...tabsOption.value.column[key], ...formOption }
    if (!tabsData.value[key]) tabsData.value[key] = {}
  }
  initRule()
  try {
    if (tabsEnhanceObj.value.initTabs) tabsEnhanceObj.value.initTabs()
  } catch (error) {
    enhanceErrorTip(props.prop + ' 选项卡增强配置【initTabs】方法执行异常，请检查', error)
  }
  isInit.value = true
}

const initRule = () => {
  const setRule = (column, ruleKey, tabKey) => {
    const tabRuleObj = rulesObj.value[ruleKey]
    for (const prop in column) {
      if (column[prop].type == 'comboBox') {
        column[prop].rules = [
          {
            validator: (rule, value, callback) => {
              formSlotRef.value[`${tabKey}_${prop}`]?.slotRef
                ?.validate()
                .then((bool) => (bool ? callback() : callback(new Error(''))))
            },
            trigger: 'change'
          }
        ]
        setRule(column[prop].column, `${column[prop].type}_${prop}`, tabKey)
      }
    }
    for (const prop in tabRuleObj) {
      tabRuleObj[prop].forEach(({ index, rule, ruleStr, type }) => {
        if (column[prop] && type == 'customRule') {
          const ruleData = cloneDeep(rule)
          const obj = executeStrFunction(`()=>{${ruleStr}}`)
          if (obj instanceof Object) for (const k in obj) ruleData[k] = obj[k]
          column[prop].rules.splice(index, 0, ruleData)
        }
      })
    }
  }
  for (let tabKey in tabsOption.value.column) {
    const tabData = tabsOption.value.column[tabKey]
    if (Object.keys(tabData.column || {}).length)
      setRule(tabData.column, `${parentKey.value}_${tabKey}`, tabKey)
    if (tabData.group?.length) {
      tabData.group = tabData.group.map((item) => {
        if (Object.keys(item.column || {}).length)
          setRule(item.column, `${parentKey.value}_${tabKey}`, tabKey)
        return item
      })
    }
  }
}

const beforeLeave = async (tabName, oldName) => {
  if (tabsEnhanceObj.value.beforeLeave) {
    const tabKeys = Object.keys(tabsOption.value.column)
    return tabsEnhanceObj.value.beforeLeave(tabKeys[tabName], tabKeys[oldName])
  }
  return true
}
const tabChange = (tabName) => {
  if (tabsEnhanceObj.value.tabChange) {
    const tabKeys = Object.keys(tabsOption.value.column)
    tabsEnhanceObj.value.tabChange(tabKeys[tabName])
  }
}

const verifyForm = () => {
  let errorObj = {
    dom: null as Element | null,
    valid: true,
    setTabsValue: setTabsValue,
    tabKey: '',
    prop: '',
    errorMsg: ''
  }
  return new Promise(async (resolve) => {
    let promiseArr = [] as any
    for (let key in avueFormRef.value) {
      promiseArr.push(
        new Promise((subResolve) => {
          avueFormRef.value[key].validate(async (valid, hide, msg) => {
            hide()
            if (!valid && errorObj.valid) {
              const oneKey = Object.keys(msg)[0]
              const tabsDom = document.querySelector(`.control-${props.prop}`)
              const tabDom = tabsDom
                ? tabsDom.querySelector(`.form-tabs .el-tabs__content .control-${key}`)
                : null
              if (tabDom) errorObj.dom = tabDom.querySelector(`.control-${oneKey}`)
              errorObj = {
                ...errorObj,
                valid: false,
                tabKey: key,
                prop: oneKey,
                errorMsg: msg[oneKey].message
              }
            }
            await handleTableVerify(key, errorObj)
            subResolve(true)
          })
        })
      )
    }
    await Promise.all(promiseArr)
    resolve(errorObj)
  })
}
const setTabsValue = (tabProp) => {
  tabsValue.value = Object.keys(tabsOption.value.column).findIndex((prop) => prop == tabProp) + ''
}
const handleTableVerify = (tabProp, errorObj) => {
  return new Promise(async (resolve) => {
    let tabControl = controlObj.value[`${props.column.type}_${props.prop}_${tabProp}`]
    if (tabControl && tabControl.layoutTable) {
      let promiseArr = [] as any
      tabControl.layoutTable.forEach(({ prop }) => {
        promiseArr.push(
          new Promise((subResolve) => {
            formTableRef.value[prop].verifyForm().then((res) => {
              if (!res.valid && errorObj.valid) {
                errorObj = {
                  ...errorObj,
                  valid: false,
                  dom: res.dom,
                  tabKey: tabProp,
                  prop: res.prop,
                  errorMsg: res.errorMsg
                }
              }
              subResolve(true)
            })
          })
        )
      })
      await Promise.all(promiseArr)
    }
    resolve(errorObj)
  })
}

const clearValue = () => {
  for (let key in formTableRef.value) {
    formTableRef.value[key].clearValue()
  }
  for (let key in avueFormRef.value) {
    avueFormRef.value[key].resetForm()
  }
}

const executeJsEnhance = (enhance: string, errTip?: string) => {
  if (!enhance) return
  enhance = formattingStrFunction(enhance)
  try {
    const fun = eval(`(function getEnhance(){
      ${enhance}
    })`)
    return fun()
  } catch (error) {
    enhanceErrorTip(errTip || '', error)
  }
}
const executeStrFunction = (str: string, params?: Array<any>, errTip?: string) => {
  try {
    const fun = eval(`(function getFun(){return ${str}})()`)
    if (params) return fun.apply(null, params)
    else return fun()
  } catch (error) {
    enhanceErrorTip(errTip || '', error)
  }
}

onMounted(() => {
  initFun()
})

defineExpose({
  prop: props.prop,
  type: props.column.type,
  tabsOption,
  tabsData,
  tabsValue,
  avueFormRef,
  formTableRef,
  verifyForm,
  clearValue
})
</script>

<style lang="scss" scoped></style>

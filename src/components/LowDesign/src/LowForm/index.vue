<template>
  <div class="low-form" :class="[`low-form__${formId}`]">
    <avue-form
      v-if="isInit"
      :ref="(el) => (avueFormRef = el)"
      v-loading="viewLoading"
      v-model="formData"
      :option="formOption"
      :upload-before="uploadBefore"
      :upload-exceed="uploadExceed"
      :upload-sized="uploadSized"
      :upload-preview="uploadPreview"
    >
      <!-- 自定义表单按钮 -->
      <template #menu-form="{ size, disabled }">
        <el-button
          v-if="formOption.isSubmitBtn"
          type="primary"
          :size="size"
          :loading="submitLoading"
          :disabled="disabled"
          @click="handleSubmit(true)"
        >
          <Icon :size="14" icon="ep:check"></Icon>
          <span class="ml-6px">{{ formOption.submitText || '提交' }}</span>
        </el-button>
        <el-button
          v-if="formOption.isEmptyBtn"
          :size="size"
          :disabled="disabled"
          @click="handleClear"
        >
          <Icon :size="14" icon="ep:delete"></Icon>
          <span class="ml-6px">{{ formOption.emptyText || '清空' }}</span>
        </el-button>
      </template>
      <!-- 自定义表单 -->
      <template v-for="c in slotData.form" :key="c.prop" #[c.prop]="scope">
        <AvueSlot
          :ref="(el) => (formSlotRef[c.prop] = el)"
          slotType="form"
          :scope="scope"
          :control="c"
          :formType="formType"
          v-model="formData[c.prop]"
        ></AvueSlot>
      </template>
      <!-- 表格布局 -->
      <template
        v-for="{ prop } in controlObj.lowForm?.layoutTable || []"
        :key="prop"
        #[prop]="scope"
      >
        <FormTable
          :ref="(el) => (formTableRef[prop] = el)"
          v-model="formData[prop]"
          v-bind="{
            column: Object.assign(scope.column, subFormOption),
            disabled: scope.disabled,
            size: scope.size,
            prop: prop,
            formType
          }"
        ></FormTable>
      </template>
      <!-- 选项卡布局 -->
      <template
        v-for="{ prop } in controlObj.lowForm?.layoutTabs || []"
        :key="prop"
        #[prop]="scope"
      >
        <FormTabs
          :ref="(el) => (formTabsRef[prop] = el)"
          v-model="formData"
          v-bind="{
            column: Object.assign(scope.column, subFormOption),
            disabled: scope.disabled,
            size: scope.size,
            prop: prop,
            formType
          }"
        ></FormTabs>
      </template>
    </avue-form>
    <div class="h-100px w-100%" v-loading="viewLoading" v-else></div>

    <DesignPopup
      v-if="controlObj.lowForm && controlObj.lowForm.monacoEditor"
      v-model="MEDialog.value"
      v-bind="MEDialog.params"
      :isBodyFull="true"
    >
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>

    <template v-for="item in rendControlData" :key="item.key">
      <component
        :ref="(el) => (componentRef[item.key] = el)"
        :is="componentObj[item.random]"
        v-bind="item.params || {}"
        v-model="item.show"
      ></component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { FormTable, FormTabs } from './components/index'
import useMEDialog from '@/hooks/design/useMEDialog'
import useAvueUpload from '@/hooks/design/useAvueUpload'
import {
  JsEnhanceObj,
  initFormOption,
  findOptionField,
  findRefOptionField,
  formDataFormatting,
  submitDataFormatting
} from '../utils/formUtil'
import { addScssStyle, delScssStyle, setDeepObject } from '../utils/util'
import { registerComp } from '../utils/registerComponent'
import { formattingStrFunction } from '@/utils/lowDesign'
import { lowFormKey } from '@/utils/symbols'
import { cloneDeep } from 'lodash-es'
import * as TableApi from '@/api/design/table'
import controlPath from '../controlPath'
import defaultUseObj from '../utils/defaultUseUtil'
import * as Vue from 'vue'

defineOptions({ name: 'LowForm' })

interface Props {
  formType: 'add' | 'edit' | 'view' //表单类型
  formOption: any //表单配置
  handleType?: 'default' | 'returnData' //处理类型
  defaultData?: object //默认值
  enhanceData?: object //传递给表单js增强内部调用配置
  formId?: string //表单设计id
  tableId?: string //表单开发id
  defaultIsOpen?: boolean //默认存储是否使用open接口
  beforeClose?: Function //关闭前回调处理
  isPreview?: boolean //是否为设计器预览
}

const props = defineProps<Props>()

const reload = parseInt(Math.random() * 1000000 + '')
const formOption = ref(props.formOption || {})
const formData = ref({})
const jsEnhanceObj = ref<JsEnhanceObj>({})
const controlObj = ref<any>({})
const rulesObj = ref<any>({})
const componentObj = ref({})
const rendControlData = ref<any>({})
let useImport = reactive({})

const isInit = ref(false)
const viewLoading = ref(false)
const submitLoading = ref(false)

const avueFormRef = ref<any>(null)
const formSlotRef = ref({})
const formTableRef = ref({})
const formTabsRef = ref({})
const componentRef = ref({})

const { MEDialog, MEData, openMEDialog } = useMEDialog()
const { uploadBefore, uploadExceed, uploadSized, uploadPreview } = useAvueUpload()
const message = useMessage()
const route = useRoute()
const routes = useRouter()

const slotData = computed(() => {
  const slotObj = { list: [] as any[], form: [] as any[] }
  const controlData = controlObj.value.lowForm
  for (let key in controlData) {
    controlData[key].forEach((item) => {
      const { slotList } = item
      if (!slotList.length) return
      const obj: any = { controlType: key }
      if (key == 'monacoEditor') {
        obj.click = (scope) => {
          let params = scope.column.params
          params = handleMonacoEditorClick(params, executeStrFunction)
          openMEDialog(Object.assign(scope.column, { disabled: scope.disabled }), formData.value)
        }
      } else if (key == 'customControl') obj.getComponent = (key) => componentObj.value[key]
      else if (['buttonList', 'comboBox'].includes(key)) {
        obj.click = (clickStr, obj, errorTip) => {
          executeStrFunction(clickStr, [obj], errorTip)
        }
      }
      slotList.forEach((type) => {
        if (slotObj[type]) slotObj[type].push({ ...item, ...obj })
      })
    })
  }
  return slotObj
})

const subFormOption = computed(() => {
  return {
    formOption: {
      labelPosition: formOption.value.labelPosition,
      labelSuffix: formOption.value.labelSuffix,
      labelWidth: formOption.value.labelWidth,
      gutter: formOption.value.gutter,
      detail: formOption.value.detail
    }
  }
})

const initForm = async () => {
  isInit.value = false
  viewLoading.value = true
  formOption.value = {}
  formData.value = {}
  const { option, control, ruleObj, componentData, jsEnhance, scssEnhance } = initFormOption(
    props.formOption,
    props.formType
  )
  if (props.formOption.isSubmitBtn === undefined) {
    option['isSubmitBtn'] = option['submitBtn']
    option['isEmptyBtn'] = option['emptyBtn']
  }

  componentObj.value = componentData
  jsEnhanceObj.value =
    executeJsEnhance(jsEnhance, '表单设计：js增强初始化异常，请检查增强内容' + props.formId) || {}
  if (scssEnhance) addScssStyle(scssEnhance, props.formId || reload, 'form')
  controlObj.value = control
  formOption.value = option
  rulesObj.value = ruleObj
  initRule('lowForm')
  //初始化其他模块导入
  try {
    if (jsEnhanceObj.value.initImport) useImport = await jsEnhanceObj.value.initImport()
  } catch (error) {
    enhanceErrorTip('js增强【initImport】方法执行异常，请检查', error)
  }
  //执行初始化增强
  try {
    if (jsEnhanceObj.value.initOption) jsEnhanceObj.value.initOption()
  } catch (error) {
    enhanceErrorTip('js增强【initOption】方法执行异常，请检查', error)
  }
  //初始化数据
  let defaultData = {}
  if (props.defaultData) defaultData = cloneDeep(props.defaultData)
  try {
    if (jsEnhanceObj.value.initData) defaultData = await jsEnhanceObj.value.initData(defaultData)
  } catch (error) {
    enhanceErrorTip('js增强【initData】方法执行异常，请检查', error)
  }
  formDataFormatting(formOption.value, defaultData, props.formType)
  formData.value = { ...formData.value, ...defaultData }

  //隐藏默认按钮
  formOption.value.submitBtn = false
  formOption.value.emptyBtn = false
  isInit.value = true
  viewLoading.value = false
}
const verifyForm = () => {
  return new Promise((resolve) => {
    let errorObj = {} as any
    avueFormRef.value.validate(async (valid, hide, msg) => {
      hide()
      let promiseArr = [] as any
      for (let key in formTableRef.value) {
        promiseArr.push(formTableRef.value[key].verifyForm())
      }
      for (let key in formTabsRef.value) promiseArr.push(formTabsRef.value[key].verifyForm())
      let verifyRes = await Promise.all(promiseArr)
      if (valid) {
        for (const i in verifyRes) {
          if (Object.keys(errorObj).length) break
          if (!verifyRes[i].valid) {
            errorObj = verifyRes[i]
            if (verifyRes[i].tabKey) verifyRes[i].setTabsValue(verifyRes[i].tabKey)
          }
        }
      } else if (!valid) {
        const oneKey = Object.keys(msg)[0]
        errorObj = {
          dom: document.querySelector(`.low-form .control-${oneKey}`),
          prop: oneKey,
          errorMsg: msg[oneKey].message,
          valid
        }
      }
      let parentDom = document.querySelector('.low-form')?.parentElement
      if (parentDom && errorObj.dom) {
        const parentRect = parentDom.getBoundingClientRect()
        const errorRect = errorObj.dom.getBoundingClientRect()
        parentDom.scrollTo({
          top: parentDom.scrollTop + (errorRect.top - parentRect.top) - parentRect.height / 3,
          behavior: 'smooth'
        })
      }
      if (errorObj.valid === false) await handleError(errorObj)
      resolve(errorObj.valid !== false)
    })
  })
}
const handleSubmit = (isVerify?: Boolean, done?: Function) => {
  return new Promise(async (resolve) => {
    let verify = true
    let form: any = {}
    const tableId = props.tableId || formOption.value.tableDesignId
    const isDefault = !props.isPreview && formOption.value.isSubmitTable && tableId
    const loading = async (bool = true) => {
      if (bool) {
        if (!props.isPreview && (isDefault || props.beforeClose)) {
          try {
            if (jsEnhanceObj.value.afterSubmit) await jsEnhanceObj.value.afterSubmit(form)
          } catch (error) {
            enhanceErrorTip('js增强【afterSubmit】方法执行异常，请检查', error)
          }
        }
      }
      if (isDefault && !props.beforeClose) message.success('提交成功')
      if (done) done()
      submitLoading.value = false
      viewLoading.value = false
    }
    submitLoading.value = true
    if (isVerify) verify = (await verifyForm()) as boolean
    if (!verify) return loading(false)
    viewLoading.value = true
    form = cloneDeep(formData.value) as any
    submitDataFormatting(formOption.value, form)
    try {
      if (jsEnhanceObj.value.beforeSubmit) form = await jsEnhanceObj.value.beforeSubmit(form)
      if (isDefault) form.id = await handleDefault(props.formType, tableId, form)
      if (props.beforeClose) props.beforeClose('submit', form, loading)
      else loading()
      return resolve(form)
    } catch (error) {
      if (error !== undefined) enhanceErrorTip('js增强【beforeSubmit】方法执行异常，请检查', error)
      loading(false)
      resolve(false)
    }
  })
}
const handleDefault = (type, tableId, form) => {
  return new Promise((resolve, reject) => {
    if (!['add', 'edit'].includes(type)) return reject()
    const apiName = type == 'add' ? 'saveTableData' : 'updateTableData'
    TableApi[apiName](tableId, form, props.defaultIsOpen)
      .then((res) => {
        resolve(type == 'add' ? res : form.id)
      })
      .catch(() => reject())
  })
}

const handleClear = () => {
  for (let key in formTableRef.value) formTableRef.value[key].clearValue()
  for (let key in formTabsRef.value) formTabsRef.value[key].clearValue()
  avueFormRef.value.resetForm()
  try {
    if (jsEnhanceObj.value.afterReset) jsEnhanceObj.value.afterReset()
  } catch (error) {
    enhanceErrorTip('js增强【afterReset】方法执行异常，请检查', error)
  }
}
const handleError = (msg) => {
  return new Promise(async (resolve) => {
    let bool = true
    try {
      if (jsEnhanceObj.value.verifyError) {
        bool = await jsEnhanceObj.value.verifyError(msg)
      }
    } catch (error) {
      enhanceErrorTip('js增强【verifyError】方法执行异常，请检查', error)
    }
    if (bool) message.info('请完善表单信息')
    resolve(true)
  })
}
const getComponentRandom = (path) => {
  let random = componentObj.value['pathOnly'][path]
  if (!random) {
    random = `key_${Math.ceil(Math.random() * 9999999)}`
    componentObj.value['pathOnly'][path] = random
    componentObj.value[random] = registerComp(path)
  }
  return random
}
const initEnhanceUseFun = () => {
  return {
    /**
     * 提交表单
     * @param isVerify 是否校验
     */
    submitForm: (isVerify) => {
      return handleSubmit(isVerify)
    },
    /**
     * 获取控件配置
     * @param prop 数据绑定key
     * @param isDeep 是否深拷贝
     * @param parentProp 父级 数据绑定key
     */
    getPropConfig: (prop, isDeep = false, parentProp) => {
      let config: any = null
      if (isInit.value) {
        config = findRefOptionField(
          {
            formOption: formOption.value,
            formTableRef: formTableRef.value,
            formTabsRef: formTabsRef.value
          },
          prop,
          parentProp
        )
      } else config = findOptionField(formOption.value, prop, parentProp)
      return isDeep ? cloneDeep(config) : config
    },
    /**
     * 设置控件配置
     * @param prop 数据绑定key
     * @param config 需修改的配置，非覆盖，格式Object,支持深结构修改 例：'params.deep.deep'
     * @param parentProp 非必传，布局控件内部子控件修改配置，需要传递对应修改字段的父prop（可不传但如果有重复的key，不能保证找到正确字段进行配置修改）
     */
    setPropConfig: (prop, config, parentProp) => {
      //非新增不能设置value
      if (props.formType != 'add' && config.value !== undefined) {
        delete config.value
      }
      const curConfig = useFun.getPropConfig(prop, false, parentProp)
      if (!curConfig) enhanceErrorTip(`调用useFun.setPropConfig方法，未找到字段：${prop}`, '')
      else setDeepObject(curConfig, config)
    },
    /**
     * 初始化控件
     * @param type 控件类型
     * @param refKey 控件ref名称
     * @param params 控件配置参数
     */
    controlInit: (type, refKey, params) => {
      const path = controlPath[type]?.path || ''
      if (path) {
        const random = getComponentRandom(path)
        rendControlData.value[refKey] = { show: false, key: refKey, random, params }
      }
    },
    //格式化当前表单数据并查询回显文本
    initDicText: () => {
      formDataFormatting(formOption.value, formData.value, props.formType)
    },
    getVue: () => Vue,
    ...defaultUseObj
  }
}
const initRule = (ruleKey) => {
  const setRule = (column, key = ruleKey) => {
    for (const prop in column) {
      if (column[prop].type == 'comboBox') {
        column[prop].rules = [
          {
            validator: (rule, value, callback) => {
              formSlotRef.value[prop]?.slotRef
                ?.validate()
                .then((bool) => (bool ? callback() : callback(new Error(''))))
            },
            trigger: 'change'
          }
        ]
        setRule(column[prop].column, `${column[prop].type}_${prop}`)
      }
    }
    for (const prop in rulesObj.value[key]) {
      rulesObj.value[key][prop].forEach(({ index, rule, ruleStr, type }) => {
        if (column[prop] && type == 'customRule') {
          const ruleData = cloneDeep(rule)
          const obj = executeStrFunction(`()=>{${ruleStr}}`)
          if (obj instanceof Object) for (const k in obj) ruleData[k] = obj[k]
          column[prop].rules.splice(index, 0, ruleData)
        }
      })
    }
  }
  if (Object.keys(formOption.value.column || {}).length) setRule(formOption.value.column)
  if (formOption.value.group?.length) {
    formOption.value.group = formOption.value.group.map((item) => {
      if (Object.keys(item.column || {}).length) setRule(item.column)
      return item
    })
  }
}

const handleMonacoEditorClick = (params, fun) => {
  if (params.clickObj) {
    for (const key in params.clickObj) {
      const clickStrObj = params.clickObj[key]
      if (params[key]) {
        params[key] = params[key].map((btn) => {
          btn.clickFun = (loading) => {
            const clickStr = clickStrObj[btn.prop]
            if (clickStr) return fun(clickStr, [loading])
            else return loading ? loading() : ''
          }
          return btn
        })
      }
    }
  }
  return params
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
    enhanceErrorTip(errTip, error)
  }
}
const executeStrFunction = (str: string, params?: Array<any>, errTip?: string) => {
  try {
    const fun = eval(`(function getFun(){return ${str}})()`)
    if (params) return fun.apply(null, params)
    else return fun()
  } catch (error) {
    enhanceErrorTip(errTip, error)
  }
}
const enhanceErrorTip = (tip, error) => {
  console.warn(`${tip}
    ${error}`)
}
const useFun = reactive(initEnhanceUseFun())

onMounted(async () => {
  initForm()
})

onUnmounted(() => {
  if (props.formId || reload) delScssStyle(props.formId || reload, 'form')
})

provide(lowFormKey, {
  controlObj,
  rulesObj,
  useFun,
  useImport,
  message,
  enhanceData: props.enhanceData,
  formData,
  viewLoading,
  rendControlData,
  Vue,
  route,
  routes,
  getComponent: () => componentObj,
  enhanceErrorTip,
  handleMonacoEditorClick
})

defineExpose({
  formData,
  formOption,
  viewLoading,
  avueFormRef,
  formTableRef,
  formTabsRef,
  componentRef,
  useFun,
  handleSubmit,
  handleClear,
  verifyForm
})
</script>

<style lang="scss" scoped>
@import url('../styles/form.scss');
</style>

<template>
  <div class="control-config">
    <el-form
      label-suffix="："
      v-if="option && Object.keys(option).length > 0"
      labelPosition="top"
      labelWidth="90px"
    >
      <el-collapse v-model="collapseValue">
        <el-collapse-item name="1" title="基本属性">
          <div class="text-12px">控件类型：{{ option.type }}</div>
          <el-form-item label="数据绑定key">
            <div class="w-100% flex">
              <el-select
                v-model="option.prop"
                style="width: 100%"
                placeholder="请选择数据绑定Key"
                filterable
                allow-create
                clearable
                v-if="propDicData.length"
              >
                <el-option
                  v-for="item in propDicData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

              <el-input
                v-else
                class="flex-1"
                v-model="option.prop"
                clearable
                placeholder="数据绑定key"
              ></el-input>
              <el-button
                class="ml-5px text-13px!"
                type="primary"
                plain
                @click="copyText(option.prop)"
                >复制key</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="class类名设置（多个类名空格隔开）">
            <el-input v-model="option.className" placeholder="class类名设置"></el-input>
          </el-form-item>
          <el-form-item label="标题设置" v-if="option.type != 'layoutTabs'">
            <template #label="{ label }">
              <span>{{ label }}</span>
              <el-checkbox
                v-if="
                  !(
                    ['layoutTable', 'comboBox'].includes(parentData.type) ||
                    ['layoutGroup'].includes(option.type)
                  )
                "
                v-model="option.hideLabel"
                label="隐藏标题"
                size="small"
              />
            </template>
            <div class="flex w-100%" v-if="!option.hideLabel">
              <el-input
                class="flex-1"
                v-model="option.label"
                clearable
                placeholder="标题"
              ></el-input>
              <el-button
                v-if="tableDesignId && fieldObj[option.prop]"
                class="ml-5px text-13px! flex-basis-80px flex-shrink-0"
                type="primary"
                plain
                @click="setLabel"
              >
                自动填写
              </el-button>
            </div>

            <template v-if="parentData.type != 'comboBox'">
              <div class="mt-10px flex" v-if="option.controlType != 'layout' && !option.hideLabel">
                <el-input-number
                  v-model="option.labelWidth"
                  class="mr-10px w-50%"
                  :min="0"
                  :step="10"
                  placeholder="标题宽度"
                ></el-input-number>
                <el-select
                  class="w-50%"
                  v-model="option.labelPosition"
                  placeholder="标题位置"
                  clearable
                >
                  <el-option label="上" value="top"></el-option>
                  <el-option label="左" value="left"></el-option>
                  <el-option label="右" value="right"></el-option>
                </el-select>
              </div>
              <el-input
                v-if="option.controlType != 'layout' && !option.hideLabel"
                v-model="option.labelTip"
                class="mt-10px"
                clearable
                placeholder="标题提示"
              ></el-input>
            </template>
          </el-form-item>
          <el-form-item label="表格配置" v-if="parentData.type == 'layoutTable'">
            <div class="w-100%">
              <div class="w-100% flex">
                <span class="option-label flex-basis-42px! flex-shrink-0">列宽：</span>
                <el-input-number
                  v-model="option.width"
                  placeholder=""
                  :controls="false"
                ></el-input-number>
                <span class="option-label pl-10px flex-basis-86px! flex-shrink-0">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="最小列宽会把剩余宽度按比例分配给设置了最小列宽的列"
                    placement="top"
                  >
                    <Icon :size="12" icon="ep:info-filled"></Icon>
                  </el-tooltip>
                  最小列宽：
                </span>
                <el-input-number
                  v-model="option.minWidth"
                  placeholder=""
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="表单设置">
            <div v-if="option.controlType != 'layout'" class="w-100%">
              <div class="w-100% flex">
                <span class="option-label">占位栅格：</span>
                <el-input-number
                  class="flex-1"
                  v-model="option.span"
                  placeholder="表单栅格"
                  :min="2"
                  :max="24"
                ></el-input-number>
              </div>

              <div class="mt-5px w-100% flex">
                <span class="option-label">左间隔：</span>
                <el-input-number
                  class="flex-1"
                  v-model="option.offset"
                  placeholder="栅格左侧的间隔格数"
                  :min="0"
                  :max="24"
                ></el-input-number>
              </div>
              <div class="mt-5px w-100% flex" v-if="parentData.type != 'comboBox'">
                <span class="option-label"></span>
                <el-checkbox :key="option.prop" v-model="option.row">
                  后面内容从新的一行展示
                </el-checkbox>
              </div>

              <div
                class="mt-10px w-100% flex"
                v-if="
                  !(
                    ['select', 'upload', 'noDefaule'].includes(option.controlType) ||
                    ['buttonList', 'comboBox'].includes(option.type)
                  )
                "
              >
                <span class="option-label">{{
                  option.type == 'title' ? '文本内容' : '默认值：'
                }}</span>
                <div class="flex-1">
                  <component
                    v-if="showDefault"
                    :is="defaultValComponent(option.type, option.controlType, option.component)"
                    v-model="option.value"
                    v-bind="option"
                    :disabled="false"
                    :readonly="false"
                    :placeholder="option.type == 'title' ? '文本内容' : '默认值：'"
                  ></component>
                </div>
              </div>
              <div
                class="mt-10px w-100% flex"
                v-if="
                  !(
                    ['layout', 'title'].includes(option.controlType) ||
                    ['buttonList', 'comboBox'].includes(option.type)
                  )
                "
              >
                <span class="option-label">校验配置：</span>
                <div class="flex-1">
                  <el-input
                    v-model="option.verifyConfig"
                    readonly
                    @click="openVerify"
                    placeholder="校验配置"
                  ></el-input>
                </div>
              </div>
              <!-- v-if="![].includes(option.type)" -->
              <div class="mt-10px flex flex-wrap">
                <el-checkbox
                  v-if="['input'].includes(option.controlType)"
                  :key="option.prop"
                  v-model="option.readonly"
                >
                  只读</el-checkbox
                >
                <el-checkbox
                  v-if="!['title', 'comboBox'].includes(option.type)"
                  v-model="option.disabled"
                  :key="option.prop"
                  >禁用</el-checkbox
                >
                <el-checkbox v-model="option.display" :key="option.prop">可见</el-checkbox>
                <el-checkbox
                  v-if="!['switch', 'buttonList', 'title', 'comboBox'].includes(option.type)"
                  v-model="option.required"
                  :key="option.prop"
                  >必填</el-checkbox
                >
                <el-checkbox
                  v-model="option.clearable"
                  :key="option.prop"
                  v-if="
                    ['input', 'select', 'date', 'time'].includes(option.controlType) &&
                    !['textarea', 'radio', 'checkbox', 'switch'].includes(option.type)
                  "
                  >可清空</el-checkbox
                >
              </div>
            </div>
            <div v-else>
              <div class="mt-10px flex flex-wrap">
                <el-checkbox v-model="option.display" :key="option.prop">可见</el-checkbox>
              </div>
            </div>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="2" title="组件属性">
          <component
            :is="currComponent"
            v-model="option"
            @open-med="configOpenMEDialog"
            @copy-text="copyText"
          ></component>
        </el-collapse-item>
        <el-collapse-item
          name="3"
          title="更多组件配置"
          v-if="
            ![
              'layoutGroup',
              'layoutTabs',
              'layoutTable',
              'buttonList',
              'monacoEditor',
              'ueditor',
              'customControl'
            ].includes(option.type)
          "
        >
          <div class="mb-4px flex items-center text-12px">
            <div>更多配置请参考：</div>
            <a
              class="el-link el-link--primary is-underline"
              href="https://avuejs.com/form/form-doc.html"
              target="_blank"
            >
              <span class="el-link__inner h-18px text-12px">Avue文档</span>
            </a>
          </div>
          <el-form-item>
            <el-input
              v-model="option.moreOptionStr"
              readonly
              placeholder="更多组件配置"
              @click="openMoreView"
            ></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-empty v-else description="拖拽字段进行配置" class="h-100% flex items-center"></el-empty>
    <div class="h-50px"></div>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #default>
        <MonacoEditor
          class="bg-#1e1e1e"
          v-model="MEData.value"
          v-bind="MEData.params"
        ></MonacoEditor>
      </template>
    </DesignPopup>
    <DesignPopup
      v-model="verifyDialog.value"
      :title="verifyDialog.title"
      :handleClose="verifyDialog.handleClose"
      :dialog-params="verifyDialog.dialogParams"
      :isBodyFull="true"
    >
      <template #default>
        <VerifyOption
          ref="verifyRef"
          v-model="verifyDialog.verifyStr"
          :show="verifyDialog.value"
          :filterKey="verifyFilterKey"
          :isSub="parentData.type == 'layoutTable'"
        ></VerifyOption>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import componentData from './config/index'
import useCopyText from '@/hooks/design/useCopyText'
import useMEDialog from '@/hooks/design/useMEDialog'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import { VerifyOption } from '@/views/lowdesign/general/components/index'
defineOptions({ name: 'ControlConfig' })

const props = defineProps({
  modelValue: Object,
  tableDesignId: String
})
const { parentData, tableDbOptions, tableSubDbOptions } = inject<lowFormDesignType>(
  lowFormDesignKey
) as lowFormDesignType

const emit = defineEmits(['update:modelValue'])

const option = ref<any>(props.modelValue)
const collapseValue = ref(['1', '2', '3'])
const showDefault = ref(true)
const verifyDialog = ref({
  value: false,
  title: '',
  verifyStr: '',
  handleClose: (done) => {
    done()
  },
  dialogParams: {
    closeOnPressEscape: true,
    closeOnClickModal: true
  }
})

const verifyRef = ref()

const { MEDialog, MEData, openMEDialog } = useMEDialog()
const { copyText } = useCopyText()

const currComponent = computed(() => {
  const prefix = 'Config'
  const { type, controlType, component } = option.value
  if ((!type || component) && type != 'ueditor') return component
  let controlName = 'input'

  if (type) controlName = type
  if (['textarea', 'number', 'password'].includes(type)) controlName = 'input'
  if (['cascader'].includes(type)) controlName = 'tree'
  if (['radio', 'checkbox'].includes(type)) controlName = 'select'
  if (['date', 'time'].includes(controlType)) controlName = 'dateTime'
  if (['array', 'upload'].includes(controlType)) controlName = controlType
  controlName = controlName.charAt(0).toUpperCase() + controlName.slice(1)
  return componentData[`${prefix}${controlName}`]
})

const propDicData = computed(() => {
  const type = option.value.type
  if (!props.tableDesignId || ['layoutGroup', 'layoutTabs'].includes(type)) return []
  const dicItem = tableDbOptions['value'][props.tableDesignId] || {}
  if (type == 'layoutTable') {
    if (dicItem.subList) return dicItem.subList
  }
  if (parentData['value'].type == 'layoutTable') {
    const dicItem = tableSubDbOptions['value'][parentData['value'].prop]
    if (dicItem) return dicItem.field
    else return []
  }
  return dicItem?.field || []
})

const fieldObj = computed(() => {
  const obj = {}
  if (parentData['value'].type == 'layoutTable') {
    const dicItem = tableSubDbOptions['value'][parentData['value'].prop]
    if (dicItem) dicItem.field.forEach((item) => (obj[item.value] = item))
  } else if (props.tableDesignId) {
    tableDbOptions['value'][props.tableDesignId]?.field.forEach((item) => (obj[item.value] = item))
  }
  return obj
})

const verifyFilterKey = computed(() => {
  if (parentData['value'].type != 'layoutTable') return ['only']
  else return []
})

watch(
  () => props.modelValue,
  (val: object) => {
    option.value = val
  }
)
watch(
  () => option.value,
  (val: object) => {
    emit('update:modelValue', val)
  }
)

watch(
  () => option.value.type,
  (val, oldVal) => {
    if ((val == 'timerange' && oldVal == 'time') || (val == 'time' && oldVal == 'timerange')) {
      showDefault.value = false
      setTimeout(() => {
        showDefault.value = true
      }, 0)
    }
  }
)

const defaultValComponent = (type, controlType, component) => {
  let avueFormKey = 'avue-'
  let controlName = type || 'input'
  if (component == 'xxx') return component
  if (['textarea', 'password', 'title'].includes(type)) controlName = 'input'
  if (['number'].includes(type)) controlName = `input-${type}`
  if (['date', 'time', 'array'].includes(controlType)) controlName = controlType
  return `${avueFormKey}${controlName}`
}
const configOpenMEDialog = (column) => {
  openMEDialog(column, option.value)
}
const openMoreView = () => {
  if (!option.value.moreOptionStr)
    option.value.moreOptionStr = `return {

}`
  configOpenMEDialog({ prop: 'moreOptionStr', label: '更多组件配置' })
}

const setLabel = () => {
  option.value.label = fieldObj.value[option.value.prop].name
}

const openVerify = () => {
  verifyDialog.value = {
    value: true,
    title: `${option.value.prop} 校验配置（${option.value.label}）`,
    verifyStr: option.value.verifyConfig,
    handleClose: (done) => {
      const verifyStr = verifyRef.value.getOptionStr()
      done()
      setTimeout(() => {
        option.value.verifyConfig = verifyStr
      }, 30)
    },
    dialogParams: verifyDialog.value.dialogParams
  }
}
</script>

<style lang="scss" scoped>
.control-config {
  ::v-deep(.el-form) {
    .option-label {
      flex: 0 0 70px;
    }

    .el-form-item {
      margin-bottom: 10px;

      input {
        font-size: 13px;

        &::placeholder {
          font-size: 13px;
        }
      }
    }
  }

  ::v-deep(.el-collapse) {
    .el-collapse-item__header {
      padding-left: 10px;
    }

    .el-collapse-item__content {
      padding: 0 10px;
    }
  }

  ::v-deep(.el-input-number) {
    .el-input__inner {
      text-align: center !important;
    }
  }
}
</style>

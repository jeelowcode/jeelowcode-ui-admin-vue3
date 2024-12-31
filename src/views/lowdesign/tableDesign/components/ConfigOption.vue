<template>
  <div class="config-option table-design-option">
    <el-container class="h-100%">
      <el-aside width="220px" class="left-tree">
        <template v-for="(config, index) in listData" :key="config.title">
          <div
            class="flex items-center mb-10px text-14px font-600 c-#333 cursor-pointer"
            @click="setCollapse(index)"
          >
            <Icon
              v-if="collapseObj[index] || collapseObj[index] === undefined"
              :size="14"
              icon="ep:caret-bottom"
            ></Icon>
            <Icon v-else :size="14" icon="ep:caret-right"></Icon>
            <span class="ml-2px">{{ config.title }}</span>
          </div>
          <el-collapse-transition>
            <div
              class="ml-10px"
              v-show="collapseObj[index] === undefined ? true : collapseObj[index]"
            >
              <draggable
                class="config-content"
                tag="div"
                :list="config.list"
                :group="{ name: 'config', pull: 'clone', put: false }"
                ghost-class="config-ghost"
                :sort="false"
                item-key="value"
              >
                <template #item="{ element }">
                  <div class="config-item" @click="setOption(element)">
                    <span>{{ element.label }}</span>
                  </div>
                </template>
              </draggable>
            </div>
          </el-collapse-transition>
        </template>
        <div class="text-center pb-20px">
          <el-button @click="openEditor" class="w-100%">
            更多配置
            <span class="text-12px c-[var(--el-color-primary)]" v-if="customStr != defStr"
              >（已编写）</span
            >
          </el-button>
        </div>
      </el-aside>
      <el-main class="main-option">
        <div class="option-title table-item-row">
          <div class="row-item">
            <div class="cell">序号</div>
          </div>
          <div class="row-item text-center">
            <div class="cell">配置名称</div>
          </div>
          <div class="row-item">
            <div class="cell">配置值</div>
          </div>
          <div class="row-item">
            <div class="cell">操作</div>
          </div>
        </div>
        <div class="option-content">
          <draggable
            class="content-draggable"
            :list="optionList"
            :group="{ name: 'option', put: true }"
            ghost-class="option-ghost"
            :animation="300"
            handle=".move-box"
            item-key="prop"
            @add="handleAddColumn"
          >
            <template #item="{ element, index }">
              <div class="option-item table-item-row">
                <div class="row-item move-box">
                  <div class="cell">{{ index + 1 }}</div>
                </div>
                <div class="row-item move-box">
                  <div class="cell"
                    ><avue-text-ellipsis
                      :key="element.value"
                      :text="element.label"
                      :height="40"
                      :width="196"
                      use-tooltip
                      placement="top"
                    >
                      <template #more>
                        <small>...</small>
                      </template>
                    </avue-text-ellipsis>
                  </div>
                </div>
                <div class="row-item">
                  <div class="cell">
                    <template v-if="element.type == 'input' || !element.type">
                      <avue-input
                        v-model="element.val"
                        placeholder="请输入"
                        v-bind="element.params || {}"
                      ></avue-input>
                    </template>
                    <template v-else-if="element.type == 'number'">
                      <avue-input-number
                        v-model="element.val"
                        v-bind="element.params || {}"
                        placeholder="请输入"
                      ></avue-input-number>
                    </template>
                    <template v-else-if="element.type == 'color'">
                      <avue-input-color
                        v-model="element.val"
                        v-bind="element.params || {}"
                        placeholder="请选择"
                      ></avue-input-color>
                    </template>
                    <template v-else-if="element.type == 'select'">
                      <avue-select
                        v-model="element.val"
                        v-bind="element.params || {}"
                        placeholder="请选择"
                        :dic="element.dic"
                      ></avue-select>
                    </template>
                    <template v-else-if="element.type == 'radio'">
                      <avue-radio
                        v-model="element.val"
                        :dic="element.dic"
                        v-bind="element.params || {}"
                      ></avue-radio>
                    </template>
                    <template v-else-if="element.type == 'switch'">
                      <avue-switch
                        v-model="element.val"
                        :dic="element.dic"
                        v-bind="element.params || {}"
                      ></avue-switch>
                    </template>
                    <div class="tip" v-if="element.valTipShow == element.val && element.valTip">
                      {{ element.valTip }}
                    </div>
                  </div>
                </div>
                <div class="row-item">
                  <div class="cell">
                    <el-button type="danger" link text @click="delRow(element)"> 删除 </el-button>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </el-main>
    </el-container>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import controlOption from '@/components/LowDesign/src/utils/controlOption'
import { handleStrObj } from '@/utils/lowDesign'
import useMEDialog from '@/hooks/design/useMEDialog'

defineOptions({ name: 'ConfigOption' })

interface Props {
  configKey: Array<string>
  show: boolean
}
const props = defineProps<Props>()
const optionStr = defineModel<string>({ default: '' })

const message = useMessage() // 消息弹窗
const { MEDialog, MEData, openMEDialog } = useMEDialog()

const collapseObj = ref({})

const listData = ref<any>([])
const optionList = ref<any>([])
let defStr = `return {

}`
const customStr = ref(defStr)

const optionKey = computed(() => {
  return optionList.value.filter((item) => item.prop).map((item) => item.value)
})

const openEditor = () => {
  openMEDialog(
    {
      prop: 'value',
      label: '更多配置编辑',
      params: {
        width: '50%',
        headerBtn: [
          {
            name: `配置参考地址`,
            clickFun: () => {
              window.open('https://avuejs.com/crud/crud-doc.html')
            },
            params: { size: 'small' }
          }
        ]
      }
    },
    customStr
  )
}

const initFun = () => {
  listData.value = []
  optionList.value = []
  customStr.value = defStr
  if (props.configKey.length) {
    props.configKey.forEach((key) => {
      if (controlOption[key]) listData.value = [...listData.value, ...controlOption[key]]
    })
    for (const index in listData.value) collapseObj.value[index] = Number(index) == 0
  }
  if (listData.value.length) {
    if (optionStr.value && optionStr.value.indexOf('option_str')) {
      const data = cloneDeep(listData.value)
      const dataObj = {}
      data.forEach((typeItem) => typeItem.list.forEach((item) => (dataObj[item.value] = item)))
      const { custom_str, option_str } = handleStrObj(optionStr.value) as any
      if (custom_str) customStr.value = custom_str
      if (option_str) {
        const option = handleStrObj(option_str)
        for (let key in option) {
          if (dataObj[key])
            optionList.value.push({
              ...dataObj[key],
              val: option[key],
              prop: `option_${Math.ceil(Math.random() * 9999999)}`
            })
        }
      }
    }
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) initFun()
  }
)
const setCollapse = (index) => {
  for (let key in collapseObj.value) {
    collapseObj.value[key] = key == index ? !collapseObj.value[key] : false
  }
}

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(optionList.value[newIndex])
  if (optionKey.value.includes(data.value)) {
    optionList.value = optionList.value.filter((item) => item.prop)
    message.info('该配置已存在')
    return
  }
  if (!data.prop) data.prop = `option_${Math.ceil(Math.random() * 9999999)}`
  delete data.icon
  optionList.value[newIndex] = data
}
const setOption = (row) => {
  optionList.value.push(row)
  handleAddColumn({ newIndex: optionList.value.length - 1 })
  setTimeout(() => {
    getOptionStr()
  }, 300)
}

const delRow = (row) => {
  optionList.value = optionList.value.filter((item) => item.prop != row.prop)
}

const getOptionStr = () => {
  if (optionList.value.length === 0 && customStr.value == defStr) {
    return ''
  }

  let optionStr = 'return {'
  const setValue = (value) => {
    if (typeof value == 'string') value = `'${value}'`
    if (value instanceof Array) {
      let text = ''
      value.forEach((item, index) => {
        text = `${text}${index != 0 ? ',' : ''}${setValue(item)}`
      })
      return `[${text}]`
    }
    return value
  }

  optionList.value.forEach((item) => {
    optionStr = `${optionStr}
    "${item.value}":${setValue(item.val)},`
  })
  optionStr = `${optionStr}
}`
  return `return {
    option_str:${'`'}${optionStr}${'`'},
    custom_str: ${'`'}${customStr.value}${'`'},
  }`
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.config-option {
  width: 100%;
  height: 100%;
  margin-top: -1px;

  .left-tree {
    padding: 10px;
    border: 1px solid #f1f1f1;

    .config-item {
      width: 160px;
      padding: 4px 8px;
      margin-bottom: 10px;
      font-size: 14px;
      cursor: move;
      background-color: #f4f6fc;
      border: 1px dashed #f4f6fc;

      &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }
    }
  }

  .main-option {
    padding: 0;
    border: 1px solid #f1f1f1;
    border-left: 0;

    .option-content {
      height: calc(100% - 41px);

      .content-draggable {
        height: 100%;
        padding-bottom: 55px;
        overflow-y: auto;
        box-sizing: border-box;

        &::-webkit-scrollbar {
          width: 0;
        }
      }

      .option-ghost {
        position: relative;
        width: 0 !important;
        height: 40px;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 1px 2px 0;
        overflow: hidden;
        font-size: 0;
        background: white;
        border-left: 5px solid var(--el-color-primary);
        content: '';
        outline: none 0;
        box-sizing: border-box;
      }
    }

    .table-item-row {
      display: flex;
      align-items: end;

      .row-item {
        height: 100%;
        min-height: 32px;
        padding: 4px 0;
        font-size: 14px;
        line-height: 32px;
        border-bottom: 1px solid #dcdfe6;

        .cell {
          position: relative;
          padding: 0 12px;

          & > div {
            width: 100%;
          }

          .tip {
            position: absolute;
            bottom: -5px;
            left: 0;
            padding-right: 10px;
            font-size: 12px;
            color: #e6a23c;
            text-align: right;
            box-sizing: border-box;
          }
        }

        &:nth-child(1) {
          flex-basis: 60px;
          text-align: center;
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(2) {
          flex-basis: 260px;
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(3) {
          flex: 1;
          line-height: normal;
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(4) {
          flex-basis: 110px;
          text-align: center;
        }

        &.move-box {
          cursor: move;
        }
      }
    }

    .option-title {
      background-color: #fafafa;

      .row-item:nth-child(3) {
        line-height: 32px;
      }
    }
  }

  .right-custom {
    .custom-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 4px 0;
      font-size: 14px;
      line-height: 32px;
      text-align: center;
      background-color: #fafafa;
      border: 1px solid #dcdfe6;
    }

    .custom-content {
      width: 100%;
      height: calc(100% - 42px);
    }
  }
}
</style>

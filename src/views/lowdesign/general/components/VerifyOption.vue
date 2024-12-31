<template>
  <div class="verify-option">
    <el-container class="h-100%">
      <el-aside width="220px" class="left-tree">
        <div class="verify-title">
          <span>校验类型</span>
        </div>
        <div class="verify-draggable">
          <draggable
            class="verify-content"
            tag="div"
            :list="verifyTypeList"
            :group="{ name: 'config', pull: 'clone', put: false }"
            ghost-class="verify-ghost"
            :sort="false"
            item-key="value"
          >
            <template #item="{ element }">
              <div class="verify-item" @click="setOption(element)">
                <span>{{ element.label }}</span>
              </div>
            </template>
          </draggable>
        </div>
      </el-aside>
      <el-main class="main-option">
        <div class="option-title table-item-row">
          <div class="row-item">
            <div class="cell">序号</div>
          </div>
          <div class="row-item text-center">
            <div class="cell">校验类型</div>
          </div>
          <div class="row-item">
            <div class="cell">校验表达式</div>
          </div>
          <div class="row-item">
            <div class="cell">启用状态</div>
          </div>
          <div class="row-item">
            <div class="cell">操作</div>
          </div>
        </div>
        <div class="option-content">
          <draggable
            class="content-draggable"
            :list="verifyList"
            :group="{ name: 'option', put: true }"
            ghost-class="option-ghost"
            :animation="300"
            handle=".move-box"
            item-key="prop"
            @add="handleAddColumn"
          >
            <template #item="{ element, index }">
              <div class="option-item table-item-row mt--2px">
                <div class="row-item move-box">
                  <div class="cell">{{ index + 1 }}</div>
                </div>
                <div class="row-item move-box">
                  <div class="cell">
                    <avue-text-ellipsis
                      :key="element.value"
                      :text="element.label"
                      :height="40"
                      :width="140"
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
                    <template v-if="element.controlType == 'length'">
                      <div class="flex items-center">
                        <span>最小长度：</span>
                        <avue-input-number
                          class="flex-basis-90px flex-shrink-0"
                          v-model="element.leng_min"
                        ></avue-input-number>
                        <span class="ml-10px">最大长度：</span>
                        <avue-input-number
                          class="flex-basis-90px flex-shrink-0"
                          v-model="element.leng_max"
                        ></avue-input-number>
                        <span class="ml-10px">输入类型：</span>
                        <avue-select
                          class="flex-basis-100px flex-shrink-0"
                          v-model="element.leng_type"
                          :dic="lengTypeDic"
                        ></avue-select>
                      </div>
                    </template>
                    <template v-else-if="element.controlType == 'regExp'">
                      <div class="flex items-center">
                        <span>正则：</span>
                        <avue-input
                          class="reg-exp-input flex-1"
                          v-model="element.regExp"
                          :placeholder="element.tip"
                          prepend="/"
                          append="/"
                        ></avue-input>
                        <span class="ml-10px">失败提示语：</span>
                        <avue-input
                          class="flex-basis-120px flex-shrink-0"
                          v-model="element.msg"
                        ></avue-input>
                      </div>
                    </template>
                    <template v-else-if="element.controlType == 'MEditor'">
                      <avue-input
                        v-model="element.customStr"
                        readonly
                        @click="openEditor(index)"
                      ></avue-input>
                    </template>
                    <template v-else-if="patternObj[element.type] || element.tip">
                      <div class="h-32px line-height-32px">
                        {{
                          patternObj[element.type] ||
                          (isSub ? element.subTip || element.tip : element.tip)
                        }}
                      </div>
                    </template>
                  </div>
                </div>
                <div class="row-item">
                  <div class="cell">
                    <avue-switch v-model="element.display" :dic="switchDic"></avue-switch>
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
import { rulesVerify, patternObj } from '@/components/LowDesign/src/utils/verifyOption'
import useMEDialog from '@/hooks/design/useMEDialog'

defineOptions({ name: 'VerifyOption' })

interface Props {
  show: boolean
  isSub?: boolean
  filterKey?: string[]
}
const props = defineProps<Props>()
const verifyStr = defineModel<string>({ default: '' })

const message = useMessage() // 消息弹窗
const { MEDialog, MEData, openMEDialog } = useMEDialog()

const switchDic = [
  { label: '', value: false },
  { label: '', value: true }
]
const lengTypeDic = [
  { label: '任意字符', value: 'all' },
  { label: '数字', value: 'number' },
  { label: '字母', value: 'alphabet' },
  { label: '中文', value: 'chinese' }
]

const verifyList = ref<any>([])

const verifyTypeList = computed(() => {
  if (props.filterKey) {
    return rulesVerify.filter((item) => !props.filterKey?.includes(item.type))
  }
  return rulesVerify
})

const onlyKeyList = computed(() => {
  return verifyList.value
    .filter((item) => !['customRegExp', 'customRule'].includes(item.type) && item.prop)
    .map((item) => item.type)
})

const openEditor = (index) => {
  openMEDialog(
    {
      prop: 'customStr',
      label: '自定义校验规则',
      params: {
        width: '50%'
      }
    },
    verifyList.value[index]
  )
}

const initFun = () => {
  verifyList.value = []
  if (verifyStr.value) verifyList.value = JSON.parse(verifyStr.value)
}

watch(
  () => props.show,
  (val) => {
    if (val) initFun()
  }
)

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(verifyList.value[newIndex])
  if (onlyKeyList.value.includes(data.type)) {
    verifyList.value = verifyList.value.filter((item) => item.prop)
    message.info('该校验类型已存在')
    return
  }
  if (data.type == 'leng') data.leng_type = 'all'
  if (data.type == 'customRule')
    data.customStr = `return {
  validator: (rule, value, callback) => {
    if (!value) {
      callback(new Error('值不能为空')) //校验失败
    } else {
      callback() //校验成功
    }
  },
  trigger: 'blur'
}`
  if (!data.prop) data.prop = `option_${Math.ceil(Math.random() * 9999999)}`
  data.display = true
  verifyList.value[newIndex] = data
}
const setOption = (row) => {
  verifyList.value.push(row)
  handleAddColumn({ newIndex: verifyList.value.length - 1 })
  setTimeout(() => {
    getOptionStr()
  }, 300)
}

const delRow = (row) => {
  verifyList.value = verifyList.value.filter((item) => item.prop != row.prop)
}

const getOptionStr = () => {
  if (verifyList.value.length) return JSON.stringify(verifyList.value)
  else ''
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.verify-option {
  width: 100%;
  height: 100%;
  margin-top: -1px;

  .left-tree {
    padding: 10px;
    border: 1px solid #f1f1f1;

    .verify-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      cursor: pointer;

      .el-icon {
        color: #666;
      }
    }

    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }

    .verify-draggable {
      margin-left: 10px;
    }

    .verify-item {
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
        height: 32px;
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
          padding: 0 12px;

          & > div {
            width: 100%;
          }

          .reg-exp-input {
            ::v-deep(.el-input) {
              .el-input-group__prepend,
              .el-input-group__append {
                padding: 0 8px !important;
              }
            }
          }
        }

        &:nth-child(1) {
          flex-basis: 60px;
          text-align: center;
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(2) {
          flex-basis: 170px;
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
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(5) {
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

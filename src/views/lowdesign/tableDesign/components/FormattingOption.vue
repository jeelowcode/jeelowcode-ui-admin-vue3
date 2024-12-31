<template>
  <div class="formatting-option table-design-option">
    <el-tabs v-model="tabsValue" tab-position="top" type="border-card">
      <el-tab-pane name="group">
        <template #label>
          <el-radio v-model="tabsValue" label="group">JAVA表达式处理</el-radio>
        </template>
        <el-container class="h-100%">
          <el-aside width="180px" class="left-tree">
            <div class="formatting-title">
              <span>配置工具</span>
            </div>
            <div class="formatting-draggable">
              <draggable
                class="formatting-content"
                tag="div"
                :list="optionUtil"
                :group="{ name: 'config', pull: 'clone', put: false }"
                ghost-class="formatting-ghost"
                :sort="false"
                item-key="value"
              >
                <template #item="{ element }">
                  <div class="formatting-item" @click="setOption(element)">
                    <span>{{ element.label }}</span>
                  </div>
                </template>
              </draggable>
            </div>
          </el-aside>
          <el-main class="main-option">
            <div class="option-content">
              <draggable
                class="content-draggable"
                :list="formattingList"
                :group="{ name: 'option', put: true }"
                ghost-class="option-ghost"
                :animation="300"
                handle=".move-icon"
                item-key="prop"
                @add="handleAddColumn"
              >
                <template #item="{ element }">
                  <div class="formatting-control">
                    <template v-if="element.value == 'fieldSelect'">
                      <avue-select
                        class="w-200px"
                        v-model="element.text"
                        :dic="fieldList"
                        :class="['select_' + element.prop + '_filed']"
                        :style="{ width: element.width_filed || '80px' }"
                        placeholder="请选择 字段"
                        @change="() => setSelectWidth(element, 5, '_filed')"
                      ></avue-select>
                    </template>
                    <template v-if="element.value == 'modeType'">
                      <avue-select
                        class="w-100px"
                        v-model="element.text"
                        :dic="modeType"
                        :class="['select_' + element.prop + '_mode']"
                        :style="{ width: element.width_mode || '80px' }"
                        placeholder="计算方式"
                        @change="() => setSelectWidth(element, 5, '_mode')"
                      ></avue-select>
                    </template>
                    <template v-if="element.value == 'parenthesis'">
                      <avue-select
                        class="w-100px"
                        v-model="element.text"
                        :dic="parenthesis"
                        :class="['select_' + element.prop + '_par']"
                        :style="{ width: element.width_par || '80px' }"
                        placeholder="括号运算符"
                        @change="() => setSelectWidth(element, 5, '_par')"
                      ></avue-select>
                    </template>
                    <template v-if="element.value == 'modeNum'">
                      <avue-input-number
                        class="w-80px!"
                        v-model="element.text"
                        :controls="false"
                        placeholder="计算值"
                      ></avue-input-number>
                    </template>
                    <template v-if="element.value == 'joinStr'">
                      <avue-input
                        class="w-120px"
                        v-model="element.text"
                        placeholder="拼接字符"
                      ></avue-input>
                    </template>
                    <div class="del-icon" @click="delRow(element)">
                      <Icon color="#F56C6C" :size="22" icon="lets-icons:dell-fill" class="mr-3px" />
                    </div>
                    <div class="move-icon">
                      <Icon :size="22" icon="mingcute:move-line" class="mr-3px" />
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
            <div class="formatting-result flex h-60px box-border p-10px">
              <div class="flex-basis-85px flex-shrink-0">输 出 内 容：</div>
              <div class="flex-1 flex flex-wrap gap-x-20px">
                <span v-for="(item, index) in valueText" :key="index">
                  {{ item.type == 'CALCULATE' ? '计算' : '拼接' }}：<span class="c-#409EFF">{{
                    item.value
                  }}</span>
                </span>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane name="custom" class="pl-20px pr-20px pt-10px">
        <template #label>
          <el-radio v-model="tabsValue" label="custom">JAVA函数处理</el-radio>
        </template>
        <div class="custom-box">
          <div class="flex items-center mt-10px">
            <div class="flex-basis-140px">JAVA类名/Sping Key：</div>
            <avue-input
              class="flex-1"
              v-model="customValue.javaPath"
              placeholder="请输入 JAVA类名/Sping Key"
            ></avue-input>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'FormattingOption' })

interface Props {
  show: boolean
  fieldList: Array<any>
}
interface TextList {
  value: string
  type: 'CALCULATE' | 'CONCAT'
}
const props = defineProps<Props>()
const formattingStr = defineModel<string>({ default: '' })
const formattingList = ref<any>([])

const tabsValue = ref('group')
const customValue = ref({
  javaPath: ''
})
const modeType = [
  { label: '加法', value: ' + ' },
  { label: '减法', value: ' - ' },
  { label: '乘法', value: ' * ' },
  { label: '除法', value: ' / ' },
  { label: '取余', value: ' % ' },
  { label: '取模', value: ' mod ' }
]
const parenthesis = [
  { label: '左括号', value: ' ( ' },
  { label: '右括号', value: ' ) ' }
]

const optionUtil = [
  { label: '字段选择', value: 'fieldSelect', type: 'CALCULATE' },
  { label: '计算方式', value: 'modeType', type: 'CALCULATE' },
  { label: '括号运算符', value: 'parenthesis', type: 'CALCULATE' },
  { label: '计算值', value: 'modeNum', type: 'CALCULATE' },
  { label: '拼接字符', value: 'joinStr', tip: '拼接字符 例如：() - 等', type: 'CONCAT' }
]

const valueText = computed(() => {
  let groupText = ''
  let lastType: 'CALCULATE' | 'CONCAT'
  let textList: TextList[] = []
  formattingList.value.forEach((item) => {
    let text = item.text
    if (item.value == 'fieldSelect' && text) text = '#{' + text + '}'
    if (item.value == 'modeNum' && text === null) text = ''
    if (!lastType || lastType == item.type) {
      groupText = `${groupText}${text}`
      if (!textList.length) textList.push({ value: groupText, type: item.type })
      else textList[textList.length - 1].value = groupText
    } else {
      groupText = text
      textList.push({ value: groupText, type: item.type })
    }
    lastType = item.type
  })
  return textList
})

const initFun = () => {
  const optionObj = {}
  optionUtil.forEach((item) => (optionObj[item.value] = item))
  formattingList.value = []
  if (formattingStr.value) {
    const { list, custom, valueType } = JSON.parse(formattingStr.value)
    customValue.value = custom || { javaPath: '' }
    tabsValue.value = valueType || 'group'
    if (list) {
      formattingList.value = list.map((item) => {
        return {
          ...optionObj[item.value],
          ...item,
          prop: `option_${Math.ceil(Math.random() * 9999999)}`
        }
      })
    }
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) initFun()
  }
)

const setSelectWidth = (element, num = 0, addClass = '') => {
  setTimeout(() => {
    const el = document.querySelector(
      `.main-option .select_${element.prop}${addClass} .el-select__selected-item.el-select__placeholder span`
    ) as HTMLSpanElement
    if (!el) return
    const width = el.offsetWidth
    element[`width${addClass}`] = width + 40 + num + 'px'
  }, 30)
}

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(formattingList.value[newIndex])
  if (!data.prop) data.prop = `option_${Math.ceil(Math.random() * 9999999)}`
  if (data.value == 'modeNum') data.text = null
  else data.text = ''
  if (data.value == 'parenthesis') {
    let valueIndex: number | null = null
    const groupText = valueText.value[valueText.value.length - 1].value || ''
    const lastLeft = groupText.lastIndexOf(' ( ')
    const lastRight = groupText.lastIndexOf(' ) ')
    if ((lastLeft == -1 && lastRight == -1) || lastRight > lastLeft) {
      valueIndex = 0
    } else valueIndex = 1
    if (valueIndex !== null) data.text = parenthesis[valueIndex].value
  }
  delete data.label

  formattingList.value[newIndex] = data
}
const setOption = (row) => {
  formattingList.value.push(row)
  handleAddColumn({ newIndex: formattingList.value.length - 1 })
  setTimeout(() => {
    getOptionStr()
  }, 300)
}

const delRow = (row) => {
  formattingList.value = formattingList.value.filter((item) => item.prop != row.prop)
}

const getOptionStr = () => {
  if (formattingList.value.length || customValue.value)
    return JSON.stringify({
      list: formattingList.value.map((item) => {
        return { value: item.value, text: item.text }
      }),
      valueType: tabsValue.value,
      group: valueText.value.filter((item) => item.value !== ''),
      custom: customValue.value
    })
  else ''
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.formatting-option {
  width: 100%;
  height: 100%;

  .left-tree {
    padding: 10px;
    border-right: 1px solid #f1f1f1;

    .formatting-title {
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

    .formatting-draggable {
      margin-left: 10px;
    }

    .formatting-item {
      width: 120px;
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
    border-left: 0;

    .option-content {
      height: calc(100% - 60px);

      .content-draggable {
        display: flex;
        height: 100%;
        padding: 10px;
        padding-bottom: 55px;
        overflow-y: auto;
        box-sizing: border-box;
        flex-wrap: wrap;
        gap: 10px 8px;
        align-content: flex-start;

        .formatting-control {
          position: relative;

          .del-icon {
            position: absolute;
            top: -9px;
            left: -8px;
            display: none;
            cursor: pointer;
          }

          .move-icon {
            position: absolute;
            right: -14px;
            bottom: -9px;
            display: none;
            cursor: move;
          }

          &:hover {
            .del-icon {
              display: block;
            }

            .move-icon {
              display: block;
            }
          }
        }
      }

      .option-ghost {
        position: relative;
        width: 0 !important;
        height: 32px;
        min-width: 0 !important;
        padding: 0 !important;
        overflow: hidden;
        font-size: 0;
        background: white;
        border-left: 5px solid var(--el-color-primary);
        content: '';
        outline: none 0;
        box-sizing: border-box;
      }
    }

    .formatting-result {
      border-top: 1px solid #dcdfe6;
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

  .custom-box {
    height: calc(100% - 51px);
  }

  ::v-deep(.el-tabs) {
    height: 100%;
    border: none;

    .el-tabs__header {
      margin-right: 0;

      .el-tabs__item {
        justify-content: center;
      }
    }

    .el-tabs__content {
      height: calc(100% - 39px);
      padding: 0;

      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>

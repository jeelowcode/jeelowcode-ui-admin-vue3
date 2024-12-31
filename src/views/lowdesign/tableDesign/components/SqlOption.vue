<template>
  <div class="summary-top-option table-design-option" :class="{ full: type == 'virtualSql' }">
    <div class="formatting-content flex items-center" v-if="type == 'summaryTop'">
      <div>统计控件：</div>
      <div class="flex-basis-90px mr-10px">
        <avue-select
          v-model="summaryControl"
          :dic="dicObj.summaryControl"
          :clearable="false"
        ></avue-select>
      </div>
      <div class="flex-1 flex items-center" v-if="summaryControl == 'text'">
        <div class="flex-basis-145px">返回值格式化配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj.text"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                格式化配置为：
                <span class="c-#409EFF">#{sex}：#{cou}人</span>
              </div>
              <div>
                返回值会被格式化为：
                <span class="c-#409EFF">["男：2人","女：3人"]</span>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="flex-1 flex items-center" v-else-if="summaryControl == 'card'">
        <div class="flex-basis-70px flex-shrink-0">名称配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj.card_name"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                名称配置为：
                <span class="c-#409EFF">#{sex}生</span>
              </div>
              <div>
                名称显示为：
                <span class="c-#409EFF">男生 女生</span>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="flex-basis-70px flex-shrink-0 ml-10px">值配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj.card_value"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                值配置为：
                <span class="c-#409EFF">#{cou}</span>
              </div>
              <div>
                值显示为：
                <span class="c-#409EFF">3 2</span>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="flex-1 flex items-center" v-else-if="['line', 'bar'].includes(summaryControl)">
        <div class="flex-basis-70px flex-shrink-0">X轴配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj[`${summaryControl}_x`]"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                X轴配置为：
                <span class="c-#409EFF">#{sex}生</span>
              </div>
              <div>
                X轴显示为：
                <span class="c-#409EFF">男生 女生</span>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="flex-basis-70px flex-shrink-0 ml-10px">Y轴配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj[`${summaryControl}_y`]"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                Y轴配置为：
                <span class="c-#409EFF">#{cou}</span>
              </div>
              <div>
                Y轴显示为：
                <span class="c-#409EFF">3 2</span>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="flex-basis-95px flex-shrink-0 ml-10px">Y轴单位名称：</div>
        <el-input
          class="flex-basis-80px flex-shrink-0"
          @keydown.space="(e) => e.stopPropagation()"
          v-model="formattingObj[`${summaryControl}_y_unit`]"
        ></el-input>
      </div>
      <div class="flex-1 flex items-center" v-else-if="summaryControl == 'pie'">
        <div class="flex-basis-70px flex-shrink-0">名称配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj.pie_name"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                名称配置为：
                <span class="c-#409EFF">#{sex}生</span>
              </div>
              <div>
                名称显示为：
                <span class="c-#409EFF">男生 女生</span>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="flex-basis-70px flex-shrink-0 ml-10px">值配置：</div>
        <el-popover placement="bottom-start" :width="400">
          <template #reference>
            <el-input
              @keydown.space="(e) => e.stopPropagation()"
              v-model="formattingObj.pie_value"
            ></el-input>
          </template>
          <div>
            <div class="text-16px">示例 </div>
            <div class="line-height-32px">
              <div>
                SQL返回值为：
                <span class="c-#409EFF">[{sex: "男", cou: 2}, {sex: "女", cou: 3}]</span>
              </div>
              <div>
                值配置为：
                <span class="c-#409EFF">#{cou}</span>
              </div>
              <div>
                值显示为：
                <span class="c-#409EFF">3 2</span>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="flex-basis-100px flex-shrink-0 ml-10px">值的单位名称：</div>
        <el-input
          class="flex-basis-80px flex-shrink-0"
          @keydown.space="(e) => e.stopPropagation()"
          v-model="formattingObj.pie_unit"
        ></el-input>
      </div>
    </div>
    <el-tabs v-model="tabsValue" tab-position="top" type="border-card">
      <el-tab-pane name="group">
        <template #label>
          <el-radio v-model="tabsValue" label="group">{{ typeLabel }}SQL配置</el-radio>
        </template>
        <el-container class="h-100%">
          <el-aside width="190px" class="left-tree">
            <div class="summary-title">
              <span>配置工具</span>
            </div>
            <div class="summary-draggable">
              <draggable
                class="summary-content"
                tag="div"
                :list="optionUtil"
                :group="{ name: 'config', pull: 'clone', put: false }"
                ghost-class="summary-ghost"
                :sort="false"
                item-key="value"
              >
                <template #item="{ element }">
                  <div class="summary-item">
                    <span>{{ element.label }}</span>
                  </div>
                </template>
              </draggable>
            </div>
          </el-aside>
          <el-main class="main-option">
            <div
              v-for="(item, index) in optionsList"
              :key="index"
              :class="{ 'option-box': item.type != 'text' }"
            >
              <div v-if="item.type == 'text'" class="default-text">{{ item.value }}</div>
              <div v-else class="h-100%">
                <div class="option-content" :class="{ full: !sqlObj[item.type].length }">
                  <draggable
                    :class="`content-draggable-${item.type}`"
                    :list="sqlObj[item.type]"
                    :group="{ name: 'option', put: true }"
                    ghost-class="option-ghost"
                    :animation="300"
                    handle=".move-icon"
                    item-key="prop"
                    @add="(e) => handleAddColumn(item.type, e)"
                  >
                    <template #item="{ element }">
                      <div class="summary-control">
                        <template v-if="element.value == 'fieldSelect'">
                          <div class="summary-fun-content flex items-center">
                            <avue-select
                              :class="['select_' + element.prop]"
                              :style="{ width: element.width || '120px' }"
                              v-model="element.text"
                              :dic="fieldList"
                              placeholder="字段"
                              @change="() => setSelectWidth(element, 5)"
                            ></avue-select>
                            <div class="w-20px text-14px text-center" v-show="element.alias"
                              >AS</div
                            >
                            <avue-input
                              class="alias w-80px"
                              v-model="element.alias"
                              placeholder="别名"
                            ></avue-input>
                          </div>
                        </template>
                        <template v-if="element.value == 'summaryFun'">
                          <div class="summary-fun-content flex items-center">
                            <avue-select
                              :class="['select_' + element.prop + '_summary']"
                              :style="{ width: element.width_summary || '100px' }"
                              v-model="element.text"
                              :dic="summaryType"
                              placeholder="统计函数"
                              filterable
                              allowCreate
                              @change="() => setSelectWidth(element, 3, '_summary')"
                            ></avue-select>
                            <div
                              class="flex items-center"
                              v-show="element.text && summaryTypeValueList.includes(element.text)"
                            >
                              <div class="w-20px text-16px text-center mt--5px">(</div>
                              <avue-select
                                :class="['select_' + element.prop + '_filed']"
                                :style="{ width: element.width_filed || '80px' }"
                                class="summary_filed-select"
                                v-model="element.params"
                                :dic="fieldList"
                                placeholder="字段"
                                @change="() => setSelectWidth(element, -19, '_filed')"
                              ></avue-select>
                              <div class="w-20px text-16px text-center mt--5px">)</div>
                              <div class="w-20px text-14px text-center" v-show="element.alias"
                                >AS</div
                              >
                              <avue-input
                                class="alias w-80px"
                                v-model="element.alias"
                                placeholder="别名"
                              ></avue-input>
                            </div>
                          </div>
                        </template>
                        <template v-for="control in controlList" :key="control.type">
                          <template v-if="control.type == element.value">
                            <div class="border-box flex items-center">
                              <div class="pr-10px">{{ control.value }}</div>
                              <el-popover
                                placement="bottom-start"
                                :popperStyle="{ width: 'auto', height: 'auto' }"
                                trigger="click"
                              >
                                <template #reference>
                                  <div v-if="element.text" class="text-14px pr-10px cursor-pointer">
                                    {{ element.text }}
                                  </div>
                                  <div v-else class="text-12px c-#999">
                                    {{ control.tip }}
                                  </div>
                                </template>
                                <div class="w-40vw h-200px">
                                  <MonacoEditor
                                    v-model="element.text"
                                    language="mysql"
                                    :editorOption="{ minimap: false }"
                                  />
                                </div>
                              </el-popover>
                            </div>
                          </template>
                        </template>
                        <template v-if="element.value == 'custom'">
                          <div class="border-box">
                            <el-popover
                              placement="bottom-start"
                              :popperStyle="{ width: 'auto', height: 'auto' }"
                              trigger="click"
                            >
                              <template #reference>
                                <div v-if="element.text" class="text-14px pr-10px cursor-pointer">
                                  {{ element.text }}
                                </div>
                                <div v-else class="text-12px c-#999"> 点击输入自定义SQL</div>
                              </template>
                              <div class="w-40vw h-200px">
                                <MonacoEditor
                                  v-model="element.text"
                                  language="mysql"
                                  :editorOption="{ minimap: false }"
                                />
                              </div>
                            </el-popover>
                          </div>
                        </template>
                        <div class="del-icon" @click="delRow(item.type, element)">
                          <Icon
                            color="#F56C6C"
                            :size="22"
                            icon="lets-icons:dell-fill"
                            class="mr-3px"
                          />
                        </div>
                        <div class="move-icon" @click="delRow(item.type, element)">
                          <Icon :size="22" icon="mingcute:move-line" class="mr-3px" />
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>
              </div>
            </div>

            <div class="summary-result flex h-60px box-border p-10px mt-20px">
              <div class="flex-basis-85px flex-shrink-0">输 出 内 容：</div>
              <div class="flex-1 flex flex-wrap gap-x-10px">
                <div v-if="type == 'virtualSql'" class="c-#67C23A">SELECT (</div>
                <span
                  v-for="item in valueText"
                  :key="item.text"
                  :class="[
                    item.color ? `c-${item.color}` : `c-#333 .dark:c-[var(--el-text-color-regular)]`
                  ]"
                  >{{ item.text }}</span
                >
                <div v-if="type == 'virtualSql'" class="c-#67C23A">
                  ) FROM {{ tableName }} tbl
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane name="custom" class="pl-20px pr-20px pt-10px">
        <template #label>
          <el-radio v-model="tabsValue" label="custom">自定义{{ typeLabel }}SQL</el-radio>
        </template>
        <div class="pb-10px text-16px">
          <span>自定义{{ typeLabel }}SQL语句</span>
          <span class="text-14px c-#E6A23C ml-10px" v-if="type == 'summaryTop'">
            当前表的数据源：#{jeelowcode_summary_table}
          </span>
        </div>
        <div class="custom-box">
          <MonacoEditor v-model="customValue" language="mysql"></MonacoEditor>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { dicObj } from '../designData'
defineOptions({ name: 'SqlOption' })

interface Props {
  type: 'summaryTop' | 'virtualSql'
  show: boolean
  fieldList: Array<any>
  tableName?: string
}
const props = defineProps<Props>()
const sqlStr = defineModel<string>({ default: '' })

const summaryControl = ref('text')
const formattingObj = ref<any>({})
const formattingKey = [
  //文本
  'text',
  //卡片
  'card_name',
  'card_value',
  //折线图
  'line_x',
  'line_y',
  'line_y_unit',
  //柱状图
  'bar_x',
  'bar_y',
  'bar_y_unit',
  //饼图
  'pie_value',
  'pie_name',
  'pie_unit'
]
formattingKey.forEach((key) => (formattingObj.value[key] = ''))
const sqlObj = ref({
  top: [],
  buttom: []
})
const typeLabel = ref('')
const optionUtil = [
  { label: '字段选择', value: 'fieldSelect' },
  { label: '过滤（WHERE）', value: 'where' },
  { label: '统计函数', value: 'summaryFun' },
  { label: '分组（GROUP BY）', value: 'groupBy' },
  { label: '筛选（HAVING）', value: 'having' },
  { label: '排序（ORDER BY）', value: 'orderBy' },
  { label: '自定义SQL', value: 'custom' }
]
const summaryType = [
  { label: 'COUNT', value: 'COUNT' },
  { label: 'SUM', value: 'SUM' },
  { label: 'AVG', value: 'AVG' },
  { label: 'MAX', value: 'MAX' },
  { label: 'MIN', value: 'MIN' },
  { label: '其他函数请直接输入', value: '-1', disabled: true }
]
const controlList = [
  { type: 'where', value: 'WHERE', tip: '点击输入WHERE过滤条件' },
  { type: 'groupBy', value: 'GROUP BY', tip: '点击输入分组SQL' },
  { type: 'having', value: 'HAVING', tip: '点击输入having条件' },
  { type: 'orderBy', value: 'ORDER BY', tip: '点击输入排序SQL 例如：id DESC' }
]
const optionsList = ref([
  { type: 'text', value: 'SELECT' },
  { type: 'top' },
  { type: 'text', value: 'FROM (当前表的数据源) tbl' },
  { type: 'buttom' }
])
const summaryTypeValueList = summaryType.map((item) => item.value)

const tabsValue = ref('group')
const customValue = ref('')

const valueText = computed(() => {
  const sqlList: any[] = [{ text: 'SELECT ' }]
  for (const key in sqlObj.value) {
    if (key == 'buttom') {
      if (props.type == 'summaryTop') {
        sqlList.push({
          text: ' FROM (当前表的数据源) tbl ',
          practical: ' FROM (#{jeelowcode_summary_table}) tbl '
        })
      } else if (props.type == 'virtualSql') sqlList.push({ text: ' FROM ' })
    }
    let lastType = ''
    let sqlText = ''
    sqlObj.value[key].forEach((item) => {
      const value = item.value
      const text = item.text === undefined ? '' : item.text
      const isComma = ['fieldSelect', 'summaryFun'].includes(lastType)
      if (isComma) sqlText = sqlText + ', '
      if (['fieldSelect', 'custom'].includes(value)) {
        sqlText = `${sqlText}${text}${item.alias ? ' AS ' + item.alias : ''}`
      } else if (value == 'summaryFun') {
        if (summaryTypeValueList.includes(text)) {
          sqlText =
            sqlText + `${text}(${item.params || ''})${item.alias ? ' AS ' + item.alias : ''}`
        } else sqlText = sqlText + text
      } else if (value == 'where') sqlText = sqlText + `WHERE ${item.text || ''} `
      else if (value == 'groupBy') sqlText = sqlText + `GROUP BY ${item.text || ''} `
      else if (value == 'orderBy') sqlText = sqlText + `ORDER BY ${item.text || ''} `
      else if (value == 'having') sqlText = sqlText + `HAVING ${item.text || ''} `
      lastType = item.value
    })
    sqlList.push({ text: sqlText, color: '#409EFF' })
  }
  return sqlList
})

const initFun = () => {
  if (props.type == 'summaryTop') {
    typeLabel.value = '统计'
    summaryControl.value = 'text'
    formattingObj.value = {}
    formattingKey.forEach((key) => (formattingObj.value[key] = ''))
  } else if (props.type == 'virtualSql') {
    optionsList.value[2].value = 'FROM'
    typeLabel.value = '格式化'
  }
  sqlObj.value = { top: [], buttom: [] }
  if (sqlStr.value && sqlStr.value.indexOf('sqlObj') !== -1) {
    const data = JSON.parse(sqlStr.value)
    customValue.value = data.custom
    tabsValue.value = data.valueType
    if (props.type == 'summaryTop') {
      formattingObj.value = data.formattingObj
      summaryControl.value = data.summaryControl || 'text'
    }

    for (let key in data.sqlObj) {
      data.sqlObj[key].forEach((item) => {
        sqlObj.value[key].push({
          ...item,
          prop: `option_${Math.ceil(Math.random() * 9999999)}`
        })
      })
    }
  } else {
    customValue.value = ''
    tabsValue.value = 'group'
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

const handleAddColumn = (dataKey, e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(sqlObj.value[dataKey][newIndex])
  if (!data.prop) data.prop = `option_${Math.ceil(Math.random() * 9999999)}`

  if (data.value == 'groupBy') {
    const fieldArr = []
    sqlObj.value.top.forEach((item) => {
      if (item['value'] == 'fieldSelect' && item['text']) fieldArr.push(item['text'])
    })
    if (fieldArr.length) data.text = fieldArr.join(',')
  }
  delete data.label

  sqlObj.value[dataKey][newIndex] = data
}

const delRow = (dataKey, row) => {
  sqlObj.value[dataKey] = sqlObj.value[dataKey].filter((item) => item.prop != row.prop)
}

const getOptionStr = () => {
  if (sqlObj.value.top.length || sqlObj.value.buttom.length || customValue.value) {
    const copySqlObj = cloneDeep(sqlObj.value)
    for (let key in copySqlObj) {
      copySqlObj[key] = copySqlObj[key].map((item) => {
        delete item.prop
        return item
      })
    }
    const obj: any = {
      sqlObj: copySqlObj,
      valueType: tabsValue.value,
      custom: customValue.value,
      group: valueText.value.map((item) => item.practical || item.text).join('')
    }
    if (props.type == 'summaryTop') {
      obj.formattingObj = formattingObj.value
      obj.summaryControl = summaryControl.value
    }
    return JSON.stringify(obj)
  } else ''
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.summary-top-option {
  width: 100%;
  height: 100%;

  .formatting-content {
    padding: 5px 10px;
    background-color: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .left-tree {
    padding: 10px;
    border-right: 1px solid #f1f1f1;

    .summary-title {
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

    .summary-draggable {
      margin-left: 10px;
    }

    .summary-item {
      width: 130px;
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

    .default-text {
      padding: 10px;
      font-size: 16px;
      color: #409eff;
    }

    .option-box {
      height: calc((100% - 60px) / 2 - 60px);
      min-height: 100px;
    }

    .option-content {
      position: relative;
      width: calc(100% - 20px);
      height: 100%;
      margin-left: 10px;
      border: 1px solid #f1f1f1;

      &.full {
        &::before {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 16px;
          color: #999;
          content: '拖拽左侧配置工具，配置统计SQL';
        }
      }

      .content-draggable-top,
      .content-draggable-buttom {
        display: flex;
        height: 100%;
        padding: 10px;
        padding-bottom: 40px;
        overflow-y: auto;
        box-sizing: border-box;
        flex-wrap: wrap;
        gap: 10px 8px;
        align-content: flex-start;

        .summary-control {
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

    .summary-result {
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
    height: calc(100% - 43px);
    border: none;

    .el-tabs__header {
      margin-right: 0;

      .el-tabs__nav {
        .el-tabs__item {
          justify-content: center;
        }
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

.border-box {
  min-height: 30px;
  padding: 1px 11px;
  line-height: 30px;
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

.summary-fun-content {
  padding: 1px;
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;

  ::v-deep(.el-input__wrapper),
  ::v-deep(.el-select__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;

    .el-input__inner {
      text-align: center;
    }
  }

  .summary_filed-select {
    ::v-deep(.el-select__wrapper) {
      padding-right: 0;
      padding-left: 0;
    }
  }

  .alias {
    ::v-deep(.el-input) {
      .el-input__inner {
        text-align: left;
      }
    }
  }
}

.summary-top-option.full ::v-deep(.el-tabs) .el-tabs__content {
  height: 100%;
}
</style>

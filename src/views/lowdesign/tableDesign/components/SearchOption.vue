<template>
  <div class="search-option table-design-option">
    <el-container class="search-content">
      <el-aside width="240px" class="left-tree">
        <div class="search-title">
          <span>字段名称</span>
        </div>
        <div class="search-draggable">
          <draggable
            class="search-content"
            tag="div"
            :list="filedList"
            :group="{ name: 'config', pull: 'clone', put: false }"
            ghost-class="search-ghost"
            :search="false"
            item-key="value"
          >
            <template #item="{ element }">
              <div class="search-item" @click="setOption(element)">
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
            <div class="cell">字段名称</div>
          </div>
          <div class="row-item">
            <div class="cell">类型</div>
          </div>
          <div class="row-item">
            <div class="cell">where条件</div>
          </div>
          <div class="row-item">
            <div class="cell">操作</div>
          </div>
        </div>
        <div class="option-content">
          <draggable
            class="content-draggable"
            :list="searchList"
            :group="{ name: 'option', put: true }"
            ghost-class="option-ghost"
            :animation="300"
            handle=".move-box"
            item-key="prop"
            @add="handleAddColumn"
          >
            <template #item="{ element, index }">
              <div class="option-item table-item-row mt--2px" v-if="element.textList">
                <div class="row-item move-box">
                  <div class="cell">{{ index + 1 }}</div>
                </div>
                <div class="row-item">
                  <div class="cell">
                    <avue-input
                      v-if="element.controlType != 'custom'"
                      class="flex-1"
                      v-model="element.textList[0].value"
                      placeholder="字段名称"
                    ></avue-input>
                  </div>
                </div>
                <div class="row-item">
                  <div class="cell">
                    <avue-select
                      v-model="element.condition"
                      :dic="conditionDic"
                      @change="(data) => typeChange(data, index)"
                    ></avue-select>
                  </div>
                </div>
                <div class="row-item">
                  <div class="cell flex items-center gap-x-6px">
                    <template v-if="['default', 'text'].includes(element.controlType)">
                      <avue-input
                        class="flex-1"
                        v-if="element.controlType != 'text'"
                        v-model="element.textList[2].value"
                        placeholder="值"
                      ></avue-input>
                    </template>
                    <template v-else-if="element.controlType == 'between'">
                      <avue-input
                        class="flex-1"
                        v-if="element.controlType != 'text'"
                        v-model="element.textList[2].value"
                        placeholder="值"
                      ></avue-input>
                      <span class="flex-shrink-0">{{ element.textList[3].value }}</span>
                      <avue-input
                        class="flex-1"
                        v-if="element.controlType != 'text'"
                        v-model="element.textList[4].value"
                        placeholder="值"
                      ></avue-input>
                    </template>
                    <template v-else-if="element.controlType == 'in'">
                      <span class="flex-shrink-0">{{ element.textList[2].value }}</span>
                      <avue-select
                        v-model="element.textList[3].value"
                        multiple
                        filterable
                        allowCreate
                        :dic="[{ label: '请直接输入值', value: 'tip', disabled: true }]"
                      ></avue-select>
                      <span class="flex-shrink-0">{{ element.textList[4].value }}</span>
                    </template>
                    <template v-else-if="element.controlType == 'custom'">
                      <el-popover
                        placement="bottom-start"
                        :popperStyle="{ width: 'auto', height: 'auto' }"
                        trigger="click"
                      >
                        <template #reference>
                          <avue-input
                            class="flex-1"
                            v-model="element.textList[0].value"
                            placeholder="自定义where"
                            readonly
                          ></avue-input>
                        </template>
                        <div class="w-40vw h-200px">
                          <MonacoEditor
                            v-model="element.textList[0].value"
                            language="mysql"
                            :editorOption="{ minimap: false }"
                          />
                        </div>
                      </el-popover>
                    </template>
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
    <div class="flex items-start pt-4px pb-4px pl-10px pr-10px">
      <div class="flex-shrink-0">输出的where条件：</div>
      <div class="flex-1 flex flex-wrap gap-x-6px">
        <template v-for="(item, index) in whereList" :key="index">
          <span>AND</span>
          <span class="c-#409EFF">{{ item }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'SearchOption' })

interface Props {
  show: boolean
  filedList: Array<any>
}
const props = defineProps<Props>()
const searchStr = defineModel<string>({ default: '' })

const searchList = ref<any>([])
const conditionDic = [
  { label: '>（大于）', value: 'GT' },
  { label: '>=（大于等于）', value: 'GE' },
  { label: '<（小于）', value: 'LT' },
  { label: '<=（小于等于）', value: 'LE' },
  { label: '=（等于）', value: 'EQ' },
  { label: '!=（不等于）', value: 'NE' },
  { label: 'BETWEEN（范围内）', value: 'BETWEEN' },
  { label: 'NOT BETWEEN（不在范围内）', value: 'NOT_BETWEEN' },
  { label: 'IN（ 指定数组内）', value: 'IN' },
  { label: 'NOT IN（不在指定数组内）', value: 'NOT_IN' },
  { label: 'LIKE（模糊）', value: 'LIKE' },
  { label: 'NOT LIKE（模糊取反）', value: 'NOT_LIKE' },
  { label: 'IS NULL（为空）', value: 'IS_NULL', type: 'text' },
  { label: 'IS NOT NULL（不为空）', value: 'IS_NOT_NULL', type: 'text' },
  { label: '自定义', value: 'custom', type: 'custom' }
]

const whereList = computed(() => {
  if (searchList.value.length) {
    const textList = getOptionStr('whereMap')
    return textList
  }
  return ''
})

const initFun = () => {
  searchList.value = []
  if (searchStr.value) searchList.value = JSON.parse(searchStr.value).searchList
}
const typeChange = ({ value, item }, index) => {
  const row = searchList.value[index]
  const text = item.label.split('（')[0]
  const textList = [
    { type: 'text', value: searchList.value[index].textList[0].value },
    { type: 'text', value: text }
  ]
  let type = ''
  if (['GT', 'GE', 'LT', 'LE', 'EQ', 'NE', 'LIKE', 'NOT_LIKE'].includes(value)) {
    textList.push({ type: 'input', value: '' })
    type = 'default'
  } else if (['IS_NULL', 'IS_NOT_NULL'].includes(value)) {
    type = 'text'
  } else if (['BETWEEN', 'NOT_BETWEEN'].includes(value)) {
    textList.push(
      { type: 'input', value: '' },
      { type: 'text', value: 'AND' },
      { type: 'input', value: '' }
    )
    type = 'between'
  } else if (['IN', 'NOT_IN'].includes(value)) {
    textList.push(
      { type: 'text', value: '(' },
      { type: 'input', value: [] },
      { type: 'text', value: ')' }
    )
    type = 'in'
  } else if (value == 'custom') {
    row.textList = [{ type: 'text', value: '' }]
    row.controlType = 'custom'
    return
  }
  row.textList = textList
  row.controlType = type
}

watch(
  () => props.show,
  (val) => {
    if (val) initFun()
  }
)

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(searchList.value[newIndex])
  if (!data.prop) data.prop = `option_${Math.ceil(Math.random() * 9999999)}`
  data.textList = [{ type: 'text', value: data.value }]
  delete data.label
  delete data.value
  searchList.value[newIndex] = data
}
const setOption = (row) => {
  searchList.value.push(row)
  handleAddColumn({ newIndex: searchList.value.length - 1 })
}

const delRow = (row) => {
  searchList.value = searchList.value.filter((item) => item.prop != row.prop)
}

const getOptionStr = (getType = 'str') => {
  if (searchList.value.length) {
    if (getType == 'str') {
      return JSON.stringify({
        searchList: searchList.value,
        whereList: getWhereList()
      })
    } else if (getType == 'whereMap') return getWhereList()
  } else ''
}

const getWhereList = () => {
  const list: string[] = []
  searchList.value.forEach((item) => {
    let text = ''
    if (item.controlType == 'custom') text = item.textList[0].value
    else if (item.textList && item.textList.length) {
      item.textList.forEach((child) => {
        text = `${text}${text ? ' ' : ''}${
          child.type == 'text' ? child.value : handleValue(item.type, child.value)
        }`
      })
    }
    list.push(text)
  })
  return list
}
const handleValue = (filedType, value) => {
  let whereType = 'string'
  const valueType = value instanceof Array ? 'array' : 'string'

  const setValueFormat = (val) => {
    let text = val
    if (whereType == 'string' && val.indexOf(`'`) == -1) {
      text = `'${val}'`
    }
    return text
  }
  if (['BigInt', 'BigDecimal', 'Integer'].includes(filedType)) whereType = 'number'
  if (valueType == 'string') value = [value]
  value = value.map((item) => setValueFormat(item)).join(',')
  return value
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.search-option {
  width: 100%;
  height: 100%;
  margin-top: -1px;

  .search-content {
    height: calc(100% - 60px);
  }

  .left-tree {
    padding: 10px;
    border: 1px solid #f1f1f1;

    .search-title {
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

    .search-draggable {
      margin-left: 10px;
    }

    .search-item {
      width: 180px;
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

      .row-item {
        display: flex;
        align-items: center;
        height: auto;
        min-height: 32px;
        padding: 4px 0;
        font-size: 14px;
        line-height: 32px;
        border-bottom: 1px solid #dcdfe6;

        .cell {
          flex: 1;
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
          flex-basis: 230px;
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(3) {
          flex-basis: 180px;
          line-height: normal;
          text-align: center;
          border-right: 1px solid #dcdfe6;
        }

        &:nth-child(4) {
          flex: 1;
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

      .row-item:nth-child(4) {
        line-height: 32px;
        text-align: center;
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

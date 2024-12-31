<template>
  <div class="sort-option table-design-option">
    <el-container class="h-100%">
      <el-aside width="240px" class="left-tree">
        <div class="sort-title">
          <span>字段名称</span>
        </div>
        <div class="sort-draggable">
          <draggable
            class="sort-content"
            tag="div"
            :list="filedList"
            :group="{ name: 'config', pull: 'clone', put: false }"
            ghost-class="sort-ghost"
            :sort="false"
            item-key="value"
          >
            <template #item="{ element }">
              <div class="sort-item" @click="setOption(element)">
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
            <div class="cell">排序方式</div>
          </div>
          <div class="row-item">
            <div class="cell">操作</div>
          </div>
        </div>
        <div class="option-content">
          <draggable
            class="content-draggable"
            :list="sortList"
            :group="{ name: 'option', put: true }"
            ghost-class="option-ghost"
            :animation="300"
            handle=".move-box"
            item-key="column"
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
                      :text="filedObj[element.column]"
                      :height="40"
                      :width="220"
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
                    <avue-select v-model="element.order" :dic="dicObj.orderByType"></avue-select>
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
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { dicObj } from '@/views/lowdesign/tableDesign/designData'

defineOptions({ name: 'SortOption' })

interface Props {
  show: boolean
  filedList: Array<any>
}
const props = defineProps<Props>()
const sortStr = defineModel<string>({ default: '' })

const message = useMessage() // 消息弹窗

const sortList = ref<any>([])

const sortPropList = computed(() => {
  return sortList.value.filter((item) => item.column).map((item) => item.column)
})
const filedObj = computed(() => {
  const obj = {}
  props.filedList.forEach((item) => (obj[item.value] = item.label))
  return obj
})

const initFun = () => {
  sortList.value = []
  if (sortStr.value) sortList.value = JSON.parse(sortStr.value)
}

watch(
  () => props.show,
  (val) => {
    if (val) initFun()
  }
)

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(sortList.value[newIndex])
  if (sortPropList.value.includes(data.value)) {
    sortList.value = sortList.value.filter((item) => item.column)
    message.info('该字段已存在')
    return
  }
  data.order = 'asc'
  data.column = data.value
  delete data.value
  delete data.label
  sortList.value[newIndex] = data
}
const setOption = (row) => {
  sortList.value.push(row)
  handleAddColumn({ newIndex: sortList.value.length - 1 })
  setTimeout(() => {
    getOptionStr()
  }, 300)
}

const delRow = (row) => {
  sortList.value = sortList.value.filter((item) => item.column != row.column)
}

const getOptionStr = () => {
  if (sortList.value.length) return JSON.stringify(sortList.value)
  else ''
}

onMounted(() => {
  initFun()
})

defineExpose({ getOptionStr })
</script>

<style lang="scss" scoped>
.sort-option {
  width: 100%;
  height: 100%;
  margin-top: -1px;

  .left-tree {
    padding: 10px;
    border: 1px solid #f1f1f1;

    .sort-title {
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

    .sort-draggable {
      margin-left: 10px;
    }

    .sort-item {
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
          flex-basis: 250px;
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

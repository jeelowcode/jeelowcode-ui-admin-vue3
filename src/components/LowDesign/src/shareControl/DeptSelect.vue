<template>
  <div class="dept-select-box w-100%">
    <div class="dept-input" :class="[{ disabled }, type, size]" @click="openDeptSelect">
      <div class="dept-text-list" v-if="selectId.length">
        <el-tag
          v-for="id in selectId"
          :key="id"
          :closable="!disabled && !column.readonly"
          type="info"
          :size="size"
          @close="tagValueClose(id)"
        >
          {{ getCurrText(id) }}
        </el-tag>
      </div>
      <div class="empty-text" v-else>{{ placeholderText }}</div>
      <div class="dept-num" v-if="column.multiple && selectId.length >= 2">
        已选择
        <span>{{ selectId.length }}</span>
        个
      </div>
    </div>
    <DesignPopup
      v-if="['add', 'edit'].includes(type)"
      v-model="dialogData.value"
      v-model:isFull="dialogData.isFull"
      v-bind="dialogData.params"
      :isBodyFull="true"
    >
      <template #default>
        <el-container class="h-100%" v-loading="loading">
          <el-main class="box-border">
            <avue-tree
              ref="deptRef"
              class="dept-tree"
              :option="treeDeptOption"
              :data="treeDeptData"
              @check-change="checkChange"
              @node-click="nodeClick"
            >
              <template #default="{ data }">
                <span
                  class="el-tree-node__label"
                  :class="{
                    active:
                      !column.multiple && data[treeDeptOption.props.value] == deptSelect[0]?.deptId
                  }"
                >
                  {{ data[treeDeptOption.props.label] }}
                </span>
              </template>
            </avue-tree>
          </el-main>
          <el-aside width="200px">
            <div
              class="h-100% flex-basis-200px flex-shrink-0"
              :style="{ borderLeft: 'var(--el-border)' }"
            >
              <div
                class="box-border h-31px pb-5px pt-5px text-center"
                :style="{ borderBottom: 'var(--el-border)' }"
              >
                <span>已选择（{{ deptSelectId.length }}）</span>
                <el-button
                  class="mt--3px p-0"
                  type="primary"
                  link
                  v-if="deptSelectId.length"
                  @click="deepClear"
                >
                  清空
                </el-button>
              </div>
              <div
                class="box-border flex flex-wrap items-center overflow-x-hidden overflow-y-auto p-10px"
                :style="{
                  height: 'calc(100% - 31px)',
                  columnGap: '6px',
                  rowGap: '6px',
                  alignContent: 'start'
                }"
              >
                <el-tag
                  v-for="id in deptSelectId"
                  :key="id"
                  :closable="true"
                  type="info"
                  :size="size"
                  class="h-auto! py-4px! ws-break-spaces! break-anywhere! line-height-none"
                  @close="tagTableClose(id)"
                >
                  {{ getCurrText(id) }}
                </el-tag>
              </div>
            </div>
          </el-aside>
        </el-container>
      </template>
    </DesignPopup>
    <DesignPopup
      v-else
      v-model="detailDialog"
      :width="800"
      :title="`<span>${column.label}</span><span class='text-14px'>（共${selectId.length}条）</span>`"
      :dialogParams="{ alignCenter: true }"
    >
      <template #default>
        <div class="h-100% box-border flex p-20px">
          <div
            class="box-border flex flex-wrap items-center overflow-x-hidden overflow-y-auto"
            :style="{
              height: '100%',
              columnGap: '6px',
              rowGap: '6px',
              alignContent: 'start'
            }"
          >
            <el-tag
              v-for="id in selectId"
              :key="id"
              type="info"
              :size="size"
              class="h-auto! py-4px! ws-break-spaces! break-anywhere! line-height-none"
            >
              {{ lowStore.dicObj[dicKey]?.[id] || id }}
            </el-tag>
          </div>
        </div>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import { useLowStoreWithOut } from '@/store/modules/low'
import { listToTree } from '@/utils/tree'
import * as DicApi from '@/api/design/dic/index'

defineOptions({ name: 'DeptSelect' })

interface Column {
  label: string
  findType: 'all' | 'now' | 'sub' //查询类型
  disabledIds: Array<string> //禁止选择的id
  multiple?: boolean //多选
  checkStrictly?: boolean //父子不互相关联
  accordion?: boolean //每次只展开一个同级树节点
  separator?: string //分隔符
  readonly?: boolean
  placeholder?: string
  textFormatter?: string //回显名称格式化
}
interface Props {
  column: Column
  prop: string
  type: string
  size?: 'small' | 'large' | 'default'
  disabled?: boolean
}
const props = defineProps<Props>()
const model = defineModel<string>()
const lowStore = useLowStoreWithOut()
const dicKey = 'deptSelect'

const loading = ref(false)
const timer = ref<any>(null)
const deptSelect = ref<any>([])
const deptSelectId = ref<Array<number | string>>([])
const treeDeptOption = ref({
  addBtn: false,
  nodeKey: 'deptId',
  multiple: props.column.multiple,
  checkStrictly: props.column.checkStrictly,
  accordion: props.column.accordion,
  props: { label: 'deptName', value: 'deptId', childern: 'childern' }
})
const treeDeptData = ref([])
const dialogData = ref({
  value: false,
  isFull: false,
  params: {
    width: '600px',
    title: '选择 ' + (props.column.label || '部门'),
    footerBtn: [
      {
        params: {},
        name: '取消',
        icon: 'material-symbols:close-rounded',
        clickFun: () => {
          dialogData.value.value = false
        }
      },
      {
        params: { type: 'primary' },
        name: '确定',
        icon: 'material-symbols:check-rounded',
        clickFun: () => {
          dialogData.value.value = false
          model.value = getCurrDeptSelect().join(',')
        }
      }
    ],
    dialogParams: {
      closeOnPressEscape: true
    }
  }
})
const detailDialog = ref(false)

const deptRef = ref()

const selectId = computed(() => {
  if (!model.value) return []
  if (typeof model.value != 'string') {
    try {
      return (model.value as Number).toString()
    } catch (error) {
      return []
    }
  }
  return model.value.split(',')
})

const placeholderText = computed(() => {
  let text = ''
  if (!props.disabled && !props.column.readonly) {
    text = props.column.placeholder || `请选择 ${props.column.label || '部门'}`
  }
  return text
})

const getCurrText = (id) => {
  const text = lowStore.dicObj[dicKey]?.[id] || ''
  const formatter = props.column.textFormatter
  if (formatter) {
    return formatter.replace(/{dicCode}/g, id).replace(/{dicText}/g, text)
  }
  return text || id
}

const deepClear = () => {
  if (props.column.multiple) deptRef.value.setCheckedKeys([])
  else {
    deptRef.value.setCurrentKey(null)
    deptSelect.value = []
  }
}
const checkChange = () => {
  if (!props.column.multiple) return false
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    deptSelect.value = deptRef.value.getCheckedNodes()
  }, 30)
}
const nodeClick = (data) => {
  if (props.column.multiple) return false
  if (deptSelect.value.length && deptSelect.value[0].deptId == data.deptId) deepClear()
  else deptSelect.value = [data]
}
const openDeptSelect = () => {
  if (props.column['onClick']) props.column['onClick']({ value: model.value, column: props.column })
  else if (props.column['click'])
    props.column['click']({ value: model.value, column: props.column })
  if (props.disabled || props.column.readonly) {
    if (selectId.value && selectId.value.length) detailDialog.value = true
    return
  }
  dialogData.value.value = true
}

const tagValueClose = (id) => {
  let list = model.value ? model.value.split(',') : []
  list = list.filter((key) => key != id)
  model.value = list.join(',')
}
const tagTableClose = (id) => {
  if (props.column.multiple) {
    deptRef.value.setChecked(id, false)
  } else deepClear()
}
const getCurrDeptSelect = () => {
  const dicObj = {}
  const ids = deptSelect.value.map((item) => {
    if (item.deptId) dicObj[item.deptId] = item.deptName
    return item.deptId
  })
  lowStore.setDicObj(dicKey, dicObj)
  return ids
}

const getDeptList = (getType) => {
  const { multiple, disabledIds } = props.column
  let currData: any = {}
  return new Promise(async (resolve) => {
    let data = await DicApi.getUserSelectDeptList(props.column.findType)
    data = data.map((item) => {
      if (disabledIds && disabledIds.includes(item.deptId)) item.disabled = true
      if (getType == 'init' && !multiple && selectId.value.includes(item.deptId)) currData = item
      return item
    })
    treeDeptData.value = listToTree(data, { id: 'deptId', pid: 'deptPid', children: 'children' })

    if (getType == 'init' && selectId.value.length) {
      setTimeout(() => {
        if (multiple) deptRef.value.setCheckedKeys(selectId.value)
        else if (currData.deptId) {
          deptRef.value.setCurrentKey(currData.deptId)
          deptSelect.value = [currData]
        }
      }, 30)
    }
    resolve(true)
  })
}

watch(
  () => model.value,
  (value, oldVal) => {
    if (oldVal !== undefined) {
      if (props.column['onChange']) props.column['onChange']({ value, column: props.column })
      else if (props.column['change']) props.column['change']({ value, column: props.column })
    }
  }
)

watch(
  () => dialogData.value.value,
  (val) => {
    if (!val) {
      if (deptRef.value) deepClear()
      return
    }
    getDeptList('init')
  }
)

watch(
  () => deptSelect.value,
  (val) => {
    deptSelectId.value = getCurrDeptSelect()
    dialogData.value.params.footerBtn[1].name = `确定（${val.length}）`
  }
)
</script>

<style lang="scss" scoped>
.dept-tree {
  .el-tree-node__label {
    &.active {
      color: var(--el-color-primary);
    }
  }
}

.dept-input {
  display: flex;
  height: var(--el-component-size);
  font-size: var(--el-text-base);
  color: var(--el-input-text-color, var(--el-text-color-regular));
  cursor: pointer;
  background-color: var(--el-bg-color);
  background-image: none;
  border: var(--el-border);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-sizing: border-box;
  align-items: center;

  .dept-text-list {
    display: flex;
    height: 100%;
    flex: 1;
    padding: 0 11px;
    overflow-x: hidden;
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 6px;
  }

  .empty-text {
    margin: 0 10px;
    overflow: hidden;
    color: #999;
    text-align: left;
    flex: 1;
    text-wrap: nowrap;
  }

  .dept-num {
    height: 100%;
    padding-right: 10px;
    padding-left: 10px;
    line-height: var(--el-component-size);
    color: var(--el-text-color-regular);
    background-color: var(--el-fill-color-light);

    span {
      display: inline-block;
      padding: 0 2px;
      color: var(--el-color-primary);
    }
  }

  &.disabled {
    &.edit,
    &.add {
      background-color: var(--el-disabled-bg-color);
    }

    &.view {
      border: none;

      .dept-text-list {
        padding: 0;
      }

      .dept-num {
        margin-right: -20px;
      }
    }
  }

  &.small {
    height: var(--el-component-size-small);
    font-size: var(--el-font-size-extra-small);

    .dept-num {
      height: var(--el-component-size-small);
    }
  }

  &.large {
    height: var(--el-component-size-large);
    font-size: var(--el-font-size-large);

    .dept-num {
      height: var(--el-component-size-large);
    }
  }
}
</style>

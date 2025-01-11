<template>
  <el-form-item label="占位内容">
    <el-input v-model="option.placeholder" clearable placeholder="占位内容"></el-input>
  </el-form-item>
  <div class="el-form-item el-form-item--small el-form--label-top flex flex-col">
    <label class="el-form-item__label p-0! block! text-14px!">字典配置：</label>
    <div class="select-dic el-form-item__content w-100%">
      <el-tabs v-model="option.dicType" stretch>
        <el-tab-pane label="静态数据" name="static">
          <el-tree
            ref="tree"
            :data="option.staticDicData"
            default-expand-all
            node-key="value"
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <div class="flex">
                <el-input
                  class="mr-5px"
                  size="small"
                  v-model="data.label"
                  placeholder="label"
                ></el-input>
                <el-input size="small" v-model="data.value" placeholder="value"></el-input>
                <span>
                  <el-button class="ml-2px!" text link size="small" @click="handleNodeAdd(data)">
                    <Icon :size="14" icon="formkit:add" />
                  </el-button>
                  <el-button
                    class="ml-2px!"
                    text
                    link
                    type="danger"
                    size="small"
                    @click="handleNodeRemove(node, data)"
                  >
                    <Icon :size="14" icon="mi:delete" />
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
          <div class="ml-22px">
            <el-button type="primary" text link @click="handleAddFields">添加父级</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="字典数据" name="code">
          <el-select
            v-model="option.dicCode"
            class="w-100%"
            placeholder="请选择绑定的字典"
            filterable
            allow-create
            clearable
            @change="getDicData"
          >
            <el-option
              v-for="item in dictOptions"
              :key="item.type"
              :label="`${item.name}(${item.type})`"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-tab-pane>
        <el-tab-pane label="字典数据" name="table">
          <TableDicOption v-model="option" type="tree"></TableDicOption>
        </el-tab-pane>
        <el-tab-pane label="远端数据" name="remote">
          <el-input
            v-model="option.remoteOptionStr"
            placeholder="远端数据配置"
            readonly
            @click="openRemoteOption"
          ></el-input>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-form-item label="字典排除值" v-if="['static', 'code'].includes(option.dicType)">
    <avue-input-tree
      v-if="option.type == 'tree'"
      v-model="option.delDicValue"
      placeholder="请选择字典排除值"
      :dic="option[`${option.dicType}DicData`]"
      filterable
      clearable
      multiple
      checkStrictly
    ></avue-input-tree>
    <avue-cascader
      v-if="option.type == 'cascader'"
      class="w-100%"
      v-model="option.delDicValue"
      :dic="option[`${option.dicType}DicData`]"
      placeholder="请选择字典排除值"
      multiple
      filterable
      clearable
      checkStrictly
      :props="cascaderProps"
    >
    </avue-cascader>
  </el-form-item>
  <el-form-item label="默认值" v-if="['static', 'code'].includes(option.dicType)">
    <avue-input-tree
      v-if="showDefault && option.type == 'tree'"
      v-model="option.value"
      :dic="defaultDic"
      filterable
      :multiple="option.multiple"
      :checkStrictly="option.checkStrictly"
      :parent="option.parent"
      placeholder="请选择默认值"
    ></avue-input-tree>
    <avue-cascader
      v-if="showDefault && option.type == 'cascader'"
      v-model="option.value"
      :dic="defaultDic"
      filterable
      :multiple="option.multiple"
      :checkStrictly="option.checkStrictly"
      :showAllLevels="option.showAllLevels"
      placeholder="请选择默认值"
    ></avue-cascader>
    <div v-else class="h-32px"></div>
  </el-form-item>
  <el-form-item v-if="option.type == 'tree'" label="操作配置">
    <el-checkbox v-model="option.multiple"> 多选 </el-checkbox>
    <el-checkbox v-model="option.filterable"> 可搜索 </el-checkbox>
    <el-checkbox v-model="option.defaultExpandAll"> 展开所有节点 </el-checkbox>
    <el-checkbox v-model="option.accordion"> 手风琴模式 </el-checkbox>
    <el-checkbox v-model="option.virtualize"> 虚拟Dom模式 </el-checkbox>
  </el-form-item>
  <el-form-item v-if="option.type == 'cascader'" label="操作配置">
    <el-checkbox v-model="option.multiple"> 多选 </el-checkbox>
    <el-checkbox v-model="option.filterable"> 可搜索 </el-checkbox>
    <el-checkbox v-model="option.showAllLevels"> 显示完整路径 </el-checkbox>
    <el-checkbox v-model="option.emitPath"> 存储完整路径 </el-checkbox>
  </el-form-item>
  <el-form-item v-if="option.multiple" label="多选配置" label-width="110px">
    <el-checkbox v-model="option.parent" v-if="option.type == 'tree'"> 可选父级 </el-checkbox>
    <el-checkbox v-model="option.checkStrictly"> 父子不互相关联 </el-checkbox>
    <el-checkbox v-model="option.collapseTags"> 折叠选中值 </el-checkbox>
    <el-checkbox v-show="option.collapseTags" v-model="option.collapseTagsTooltip">
      鼠标悬停显示所有折叠选中标签
    </el-checkbox>
    <el-col :md="12" :xs="24" v-show="option.collapseTags">
      <div class="text-12px">选中超过多少开始折叠</div>
      <el-input-number v-model="option.maxCollapseTags"></el-input-number>
    </el-col>
  </el-form-item>
</template>

<script setup lang="ts">
import { useDictStoreWithOut } from '@/store/modules/dict'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import { filter } from '@/utils/tree'
import { TableDicOption } from '../index'

defineOptions({ name: 'ConfigTree' })

const props = defineProps({
  modelValue: Object
})
const { dictOptions } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType
const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const dictStore = useDictStoreWithOut()

const option = ref<any>(props.modelValue)
const cascaderProps = ref({ multiple: true, checkStrictly: true })
const showDefault = ref(true)
const defaultDic = computed(() => {
  const dic = option.value[`${option.value.dicType}DicData`] || []
  if (option.value.delDicValue) {
    const delDic = option.value.type == 'tree' ? option.value.delDicValue : []
    if (option.value.type == 'cascader') {
      option.value.delDicValue.forEach((item) => {
        if (item instanceof Array) delDic.push(item[item.length - 1])
      })
    }
    return filter(dic, (item) => !delDic.includes(item.value), {
      children: 'children',
      id: 'value'
    })
  }
  return dic
})

const initDefault = (isSetVal = true) => {
  showDefault.value = false
  setTimeout(() => {
    showDefault.value = true
  }, 0)
  if (isSetVal) option.value.value = option.value.multiple ? [] : ''
}

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
  [() => option.value.multiple, () => option.value.parent, () => option.value.checkStrictly],
  () => {
    initDefault()
  }
)

watch(
  () => option.value.showAllLevels,
  () => {
    initDefault(false)
  }
)

const handleAddFields = () => {
  const i = Math.ceil(Math.random() * 99999)
  if (!option.value.staticDicData) option.value.staticDicData = []
  option.value.staticDicData.push({ label: `字段${i}`, value: `field_${i}` })
}

const handleNodeAdd = (data) => {
  const i = Math.ceil(Math.random() * 99999)
  if (!data.children) data.children = []
  data.children.push({ label: `字段${i}`, value: `field_${i}` })
}
const handleNodeRemove = (node, data) => {
  const parent = node.parent
  const children = parent.data.children || parent.data
  const delIndex = children.findIndex(
    (item) => item.label == item.label && item.value == data.value
  )
  children.splice(delIndex, 1)
}

const getDicData = (code) => {
  option.value.codeDicData = []
  if (dictStore.dictMap[code]) option.value.codeDicData = dictStore.dictMap[code]
}

const openRemoteOption = () => {
  emit('open-med', {
    prop: 'remoteOptionStr',
    label: '远端数据配置',
    params: {
      headerBtn: [
        {
          name: '复制配置示例',
          icon: 'solar:copy-outline',
          clickFun: () => {
            let example = `测试`
            emit('copy-text', example)
          },
          params: {
            size: 'small',
            type: 'primary'
          }
        }
      ]
    }
  })
}
</script>

<style lang="scss" scoped>
.select-dic {
  :deep(.el-tabs) {
    width: 100%;

    .el-tabs__header {
      margin-bottom: 5px;
    }
  }
}
</style>

<template>
  <el-form-item label="占位内容" v-if="!['radio', 'checkbox'].includes(option.type)">
    <el-input v-model="option.placeholder" clearable placeholder="占位内容"></el-input>
  </el-form-item>
  <div class="el-form-item el-form-item--small el-form--label-top">
    <label class="el-form-item__label" style="padding: 0">字典配置：</label>
    <div class="el-form-item__content select-dic w-100%">
      <el-tabs v-model="option.dicType" stretch>
        <el-tab-pane label="静态数据" name="static">
          <div class="pl-20px">
            <el-checkbox
              v-model="option.isDesc"
              size="small"
              v-if="!['radio', 'checkbox'].includes(option.type)"
            >
              是否显示描述</el-checkbox
            >
            <el-checkbox v-model="option.isDisabled" size="small"> 是否显示禁用 </el-checkbox>
          </div>
          <draggable
            tag="div"
            :list="option.staticDicData || []"
            :group="{ name: 'dic' }"
            ghost-class="dic-ghost"
            handle=".drag-item"
            :animation="300"
            item-key="value"
          >
            <template #item="{ element, index }">
              <div class="mb-5px w-100% flex items-center">
                <Icon
                  class="drag-item mr-2px cursor-move"
                  icon="fluent:drag-20-regular"
                  :size="16"
                />
                <div>
                  <div class="flex">
                    <el-input
                      class="mr-5px"
                      clearable
                      v-model="element.label"
                      placeholder="label"
                    ></el-input>
                    <el-input clearable v-model="element.value" placeholder="value"></el-input>
                  </div>
                  <div class="mt-2px flex">
                    <el-input
                      v-if="option.isDesc"
                      size="small"
                      clearable
                      v-model="element.desc"
                      placeholder="描述"
                    ></el-input>
                    <el-checkbox
                      v-model="element.disabled"
                      v-if="option.isDisabled"
                      :class="{ 'ml-10px': option.isDesc }"
                      size="small"
                    >
                      禁用
                    </el-checkbox>
                  </div>
                </div>

                <el-button
                  class="ml-5px h-20px! w-20px! p-2px!"
                  @click="handleRemoveFields(index)"
                  circle
                  plain
                  type="danger"
                  icon="el-icon-minus"
                ></el-button>
              </div>
            </template>
          </draggable>
          <div class="ml-22px">
            <el-button type="primary" text link @click="handleAddFields">添加字典</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="字典数据" name="code">
          <el-select
            v-model="option.dicCode"
            style="width: 100%"
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
        <el-tab-pane label="表格字典" name="table">
          <TableDicOption v-model="option" type="select"></TableDicOption>
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
    <avue-select
      v-model="option.delDicValue"
      :dic="option[`${option.dicType}DicData`]"
      filterable
      clearable
      multiple
      placeholder="请选择字典排除值"
    ></avue-select>
  </el-form-item>
  <el-form-item label="默认值" v-if="['static', 'code'].includes(option.dicType)">
    <avue-select
      v-if="showDefault"
      v-model="option.value"
      :dic="defaultDic"
      filterable
      clearable
      :multiple="option.multiple"
      placeholder="请选择默认值"
    ></avue-select>
    <div v-else class="h-32px"></div>
  </el-form-item>
  <el-form-item label="操作配置" v-if="!['radio', 'checkbox'].includes(option.type)">
    <el-checkbox v-model="option.multiple"> 多选 </el-checkbox>
    <el-checkbox v-model="option.filterable"> 可搜索 </el-checkbox>
    <el-checkbox v-model="option.allowCreate"> 可输入 </el-checkbox>
    <el-checkbox v-model="option.virtualize"> 虚拟Dom模式 </el-checkbox>
  </el-form-item>
  <el-form-item
    label="多选配置"
    v-if="!['radio', 'checkbox'].includes(option.type) && option.multiple"
  >
    <el-checkbox v-model="option.collapseTags"> 折叠选中值 </el-checkbox>
    <el-checkbox v-model="option.collapseTagsTooltip"> 鼠标悬停显示所有折叠选中标签 </el-checkbox>
    <el-row :gutter="10">
      <el-col :md="12" :xs="24">
        <div class="text-12px">选中超过多少开始折叠</div>
        <el-input-number v-model="option.maxCollapseTags">maxCollapseTags</el-input-number>
      </el-col>
      <el-col :md="12" :xs="24">
        <div class="text-12px">多选数量限制</div>
        <el-input-number v-model="option.limit" placeholder="不限制" :min="1"></el-input-number>
      </el-col>
    </el-row>
  </el-form-item>
  <el-form-item label="样式配置" v-if="option.type == 'radio'">
    <el-checkbox v-model="option.border"> 显示边框 </el-checkbox>
    <el-checkbox v-model="option.button"> 按钮组样式 </el-checkbox>
  </el-form-item>
  <el-form-item label="操作配置" v-if="option.type == 'checkbox'">
    <el-checkbox v-model="option.all"> 显示全选 </el-checkbox>
    <el-checkbox v-model="option.border"> 显示边框 </el-checkbox>
  </el-form-item>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import { TableDicOption } from '../index'

defineOptions({ name: 'ConfigSelect' })

interface Props {
  modelValue: object
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: Object
})
const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { dictOptions, example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const dictStore = useDictStoreWithOut()
const option = ref<any>(props.modelValue)
const showDefault = ref(true)

const defaultDic = computed(() => {
  const dic = option.value[`${option.value.dicType}DicData`] || []
  if (option.value.delDicValue) {
    return dic.filter((item) => !option.value.delDicValue.includes(item.value))
  }
  return dic
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
  () => option.value.allowCreate,
  (val: boolean) => {
    if (val) option.value.filterable = true
  }
)
watch(
  () => option.value.multiple,
  (val: boolean) => {
    showDefault.value = false
    setTimeout(() => {
      showDefault.value = true
    }, 0)
    option.value.value = val ? [] : ''
  }
)
watch(
  () => option.value.delDicValue,
  (val) => {
    if (!val) option.value.delDicValue = []
  },
  { immediate: true }
)

const handleAddFields = () => {
  const i = Math.ceil(Math.random() * 9999)
  if (!option.value.staticDicData) option.value.staticDicData = []
  option.value.staticDicData.push({ label: `字典_${i}`, value: `dic_${i}` })
}
const handleRemoveFields = (index) => {
  option.value.staticDicData.splice(index, 1)
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
            emit('copy-text', example.remoteExample)
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

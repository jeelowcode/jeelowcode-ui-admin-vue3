<template>
  <el-form-item label="字典Table">
    <el-select
      class="w-100%"
      v-model="option.dictTable"
      clearable
      filterable
      placeholder="请选择字典Table"
      @change="tableChange"
    >
      <template v-for="item in tableDic" :key="item.value">
        <el-option
          v-if="type != 'tree' || (type == 'tree' && item.tableType == 2)"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </template>
    </el-select>
  </el-form-item>
  <el-form-item label="字典Code">
    <el-select
      class="w-100%"
      v-model="option.dictCode"
      clearable
      filterable
      placeholder="请选择字典Code"
    >
      <el-option
        v-for="item in codeDic"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="字典Text">
    <el-select
      class="w-100%"
      v-model="option.dictText"
      clearable
      filterable
      placeholder="请选择字典Text"
    >
      <el-option
        v-for="item in textDic"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="字典显示列" v-if="type == 'dicTableSelect'">
    <el-select
      class="w-100%"
      v-model="option.dictTableColumn"
      clearable
      filterable
      multiple
      placeholder="请选择字典显示列"
    >
      <el-option
        v-for="item in textDic"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'TableDicOption' })

const props = defineProps({
  modelValue: Object,
  type: String
})

const emit = defineEmits(['update:modelValue'])
const { tableDbOptions, tableSubDb } = inject<lowFormDesignType>(
  lowFormDesignKey
) as lowFormDesignType
const option = ref<any>(props.modelValue)
const nullDic = [{ label: '请先选择 字典Table', value: '-1', disabled: true }]

const tableDic = computed(() => {
  return Object.assign(unref(tableDbOptions), unref(tableSubDb)) as any
})
const codeDic = computed(() => {
  if (option.value.dictTable) {
    return [
      {
        label: '请确保绑定的字段在表内值是唯一的,否会导致数据异常（一般绑定id）',
        value: 'jeelowcode-tiop',
        disabled: true
      },
      ...(tableDbOptions['value'][option.value.dictTable].field || [])
    ]
  } else return nullDic
})
const textDic = computed(() => {
  if (option.value.dictTable) {
    return tableDbOptions['value'][option.value.dictTable].field
  } else return nullDic
})

const tableChange = () => {
  option.value.dictCode = 'id'
  option.value.dictText = ''
  option.value.dictTableColumn = []
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
</script>

<style lang="scss" scoped></style>

<template>
  <el-form-item label="查询类型">
    <avue-select v-model="option.findType" :dic="controlOption.dicObj.userFindType"></avue-select>
  </el-form-item>
  <el-form-item label="列显示字段">
    <avue-select
      v-model="option.columnKey"
      multiple
      :dic="controlOption.dicObj.userColumn"
    ></avue-select>
  </el-form-item>
  <el-form-item label="回显名称格式化">
    <avue-select
      v-model="option.textFormatter"
      :dic="dictTextFormatter"
      filterable
      allowCreate
      placeholder="请选择回显名称格式化"
    ></avue-select>
  </el-form-item>
  <el-form-item label="操作配置">
    <el-checkbox :key="option.prop" v-model="option.multiple"> 多选 </el-checkbox>
    <el-checkbox :key="option.prop" v-model="option.avatar"> 头像 </el-checkbox>
  </el-form-item>
  <div class="flex items-center gap-x-20px">
    <el-form-item label="最大选择数" class="flex-1">
      <avue-input-number :min="1" v-model="option.limit"> </avue-input-number>
    </el-form-item>
    <el-form-item label="分隔符" class="flex-1">
      <avue-input v-model="option.separator"> </avue-input>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import controlOption from '@/components/LowDesign/src/utils/controlOption'
import { dictTextFormatter } from '@/components/LowFormDesign/utils/util'

defineOptions({ name: 'DicTableSelect' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const {} = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)

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

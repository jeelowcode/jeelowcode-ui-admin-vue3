<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="12" :xs="24">
        <el-form-item label="数组框类型">
          <avue-select
            v-model="option.type"
            placeholder="请选择 数组框类型"
            type="tree"
            :dic="arrayType"
          ></avue-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :xs="24">
        <el-form-item label="最大框的个数">
          <el-input-number
            :min="1"
            v-model="option.limit"
            clearable
            placeholder="不限制"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="操作配置">
      <el-checkbox v-model="option.alone"> 单个模式 </el-checkbox>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigArray' })

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const option = ref<any>(props.modelValue)
const arrayType = ref([
  { label: '文本', value: 'array' },
  { label: '图片', value: 'img' },
  { label: '超链接', value: 'url' }
])

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
  () => option.value.alone,
  (alone: string[]) => {
    let length = option.value.value ? option.value.value.length : 0
    if (alone && length > 1)
      option.value.value = option.value.value.filter((_item, index) => index < 1)
  }
)
</script>

<style lang="scss" scoped></style>

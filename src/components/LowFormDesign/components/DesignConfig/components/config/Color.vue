<template>
  <div>
    <el-form-item label="颜色格式">
      <avue-select
        v-model="option.colorFormat"
        placeholder="请选择颜色格式"
        :dic="option.showAlpha ? formatTsList : formatList"
      ></avue-select>
    </el-form-item>
    <el-form-item label="默认值">
      <avue-input-color
        v-if="showDefault"
        v-model="option.value"
        :colorFormat="option.colorFormat"
        :showAlpha="option.showAlpha"
        placeholder="默认值"
      ></avue-input-color>
      <div v-else class="h-32px"></div>
    </el-form-item>
    <el-form-item label="预定义颜色">
      <avue-array v-model="option.predefine" placeholder="请输入预定义颜色"></avue-array>
    </el-form-item>
    <el-form-item label="操作配置">
      <el-checkbox v-model="option.showAlpha">透明度选择</el-checkbox>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigColor' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const option = ref<any>(props.modelValue)
const formatList = ref([
  { label: 'rgb【例：rgb(255,255,255)】', value: 'rgb' },
  { label: 'hsl【例：hsla(0,0%,100%)】', value: 'hsl' },
  { label: 'hsv【例：hsv(0,0%,100%)】', value: 'hsv' },
  { label: 'hex【例：#FFFFFF】', value: 'hex' }
])
const formatTsList = ref([
  { label: 'rgba【例：rgba(255,255,255,1)】', value: 'rgb' },
  { label: 'hsla【例：hsla(0,0%,100%,1)】', value: 'hsl' },
  { label: 'hsva【例：hsva(0,0%,100%,1)】', value: 'hsv' },
  { label: 'hex【例：#FFFFFFFF】', value: 'hex' }
])
const showDefault = ref(true)

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
watch([() => option.value.colorFormat, () => option.value.showAlpha], () => {
  showDefault.value = false
  setTimeout(() => {
    showDefault.value = true
  }, 0)
  option.value.value = ''
})
// watch(
//   () => option.value.showAlpha,
//   () => {
//     showDefault.value = false
//     setTimeout(() => {
//       showDefault.value = true
//     }, 0)
//     option.value.value = ''
//   }
// )
</script>

<style lang="scss" scoped></style>

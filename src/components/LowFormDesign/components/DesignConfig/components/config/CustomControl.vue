<template>
  <el-form-item label="控件状态">
    <avue-radio v-model="option.isGlobal" :dic="dic" button></avue-radio>
  </el-form-item>
  <el-form-item label="控件所在文件相对的路径" v-if="!option.isGlobal">
    <el-input v-model="option.controlUrl" placeholder="例：components/....">
      <template #prepend>src/</template>
    </el-input>
  </el-form-item>
  <el-form-item label="控件名称" v-if="option.isGlobal">
    <el-input v-model="option.controlName" placeholder="例：el-input"></el-input>
  </el-form-item>
  <el-form-item label="控件配置">
    <el-input
      v-model="option.controlOptionStr"
      readonly
      placeholder="控件配置"
      @click="openEditView('controlOptionStr', '控件配置')"
    ></el-input>
  </el-form-item>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigCustomControl' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])

const option = ref<any>(props.modelValue)
const dic = ref([
  { label: '未全局注册', value: false },
  { label: '已全局注册', value: true }
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

const openEditView = (prop, label) => {
  if (!option.value.controlOptionStr) {
    option.value.controlOptionStr = `return {

}`
  }

  emit('open-med', { prop, label })
}
</script>

<style lang="scss" scoped></style>

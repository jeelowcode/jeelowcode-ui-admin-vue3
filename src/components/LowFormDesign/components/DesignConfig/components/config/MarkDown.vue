<template>
  <el-form-item label="v-md-editor配置">
    <div class="mb-4px flex items-center text-12px">
      <div>配置请参考：</div>
      <a
        class="el-link el-link--primary is-underline"
        href="https://code-farmer-i.github.io/vue-markdown-editor/zh/api.html#props"
        target="_blank"
      >
        <span class="el-link__inner h-18px text-12px">v-md-editor文档</span>
      </a>
    </div>
    <el-input
      v-model="option.editorOptionStr"
      readonly
      placeholder="v-md-editor配置"
      @click="openEditView('editorOptionStr', 'v-md-editor配置')"
    ></el-input>
  </el-form-item>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigMarkDown' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)

const exampleObj = {
  editorOptionStr: example.MarkDownExample
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

const openEditView = (prop, label) => {
  emit('open-med', {
    prop,
    label,
    params: {
      headerBtn: [
        {
          name: `复制配置示例`,
          icon: 'solar:copy-outline',
          clickFun: () => {
            emit('copy-text', exampleObj[prop] || '')
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

<style lang="scss" scoped></style>

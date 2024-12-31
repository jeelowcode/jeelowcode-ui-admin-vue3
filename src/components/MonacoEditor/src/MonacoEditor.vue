<template>
  <div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
</template>
<script setup lang="ts">
import { useMonacoEditor } from '@/hooks/design/useMonacoEditor'
import { onMounted, computed, watch } from 'vue'

interface Props {
  width?: string | number
  height?: string | number
  language?: string
  editorOption?: Object
  providerType?: 'tableJsEnhance' | 'formEnhance' | ''
  modelValue: string
}
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  language: 'javascript',
  providerType: '',
  editorOption: () => ({}),
  modelValue: ''
})

const emits = defineEmits<{
  (e: 'blue'): void
  (e: 'update:modelValue', val: string): void
}>()

const monacoEditorStyle = computed(() => {
  return {
    width: typeof props.width === 'string' ? props.width : props.width + 'px',
    height: typeof props.height === 'string' ? props.height : props.height + 'px'
  }
})

const {
  monacoEditorRef,
  createEditor,
  updateVal,
  updateOptions,
  getEditor,
  setLanguage,
  formatDoc
} = useMonacoEditor(props.language)

const getValue = () => {
  return props.modelValue
}

onMounted(() => {
  const monacoEditor = createEditor(props.editorOption, props.providerType)
  updateMonacoVal(props.modelValue)
  monacoEditor?.onDidChangeModelContent(() => {
    emits('update:modelValue', monacoEditor!.getValue())
  })
  monacoEditor?.onDidBlurEditorText(() => {
    emits('blue')
  })
})

watch(
  () => props.modelValue,
  () => {
    updateMonacoVal(props.modelValue)
  }
)

watch(
  () => props.language,
  () => {
    if (props.language) setLanguage(props.language)
  }
)
watch(
  () => props.editorOption,
  () => {
    updateOptions(props.editorOption, props.providerType)
  },
  { deep: true }
)

function updateMonacoVal(val: string) {
  if (val !== getEditor()?.getValue()) {
    updateVal(val)
  }
}

defineExpose({ updateOptions, getValue, formatDoc })
</script>

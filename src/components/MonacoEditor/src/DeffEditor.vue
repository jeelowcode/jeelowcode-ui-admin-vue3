<template>
  <div ref="deffEditorRef" :style="deffEditorStyle"></div>
</template>
<script setup lang="ts">
import { useDiffEditor } from '@/hooks/design/useMonacoEditor'
import { onMounted, computed, watch } from 'vue'

interface Props {
  width?: string | number
  height?: string | number
  language?: string
  editorOption?: Object
  providerType?: 'tableJsEnhance' | 'formEnhance' | ''
  modelValue: string
  oldValue?: string
}
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  language: 'javascript',
  editorOption: () => ({}),
  modelValue: ''
})

const emits = defineEmits<{
  (e: 'blue'): void
  (e: 'update:modelValue', val: string): void
}>()

const deffEditorStyle = computed(() => {
  return {
    width: typeof props.width === 'string' ? props.width : props.width + 'px',
    height: typeof props.height === 'string' ? props.height : props.height + 'px'
  }
})

const { deffEditorRef, createDeffEditor, getEditor, updateVal, setLanguage } = useDiffEditor(
  props.language,
  props.modelValue,
  props.oldValue
)

onMounted(() => {
  const { modifiedText } = createDeffEditor(props.editorOption, props.providerType) as any
  updateMonacoVal(props.modelValue)
  modifiedText?.onDidChangeContent(() => {
    emits('update:modelValue', modifiedText!.getValue())
  })
})

watch(
  () => props.modelValue,
  () => {
    updateMonacoVal(props.modelValue)
  }
)
watch(
  () => props.oldValue,
  (val) => {
    updateMonacoVal(val || '', 'original')
  }
)

watch(
  () => props.language,
  () => {
    if (props.language) setLanguage(props.language, props.providerType)
  }
)

function updateMonacoVal(val: string, type = 'modified') {
  if (val !== getEditor(type)?.getValue()) {
    updateVal(val, type)
  }
}

defineExpose({ getValue: () => getEditor('modified')?.getValue() })
</script>

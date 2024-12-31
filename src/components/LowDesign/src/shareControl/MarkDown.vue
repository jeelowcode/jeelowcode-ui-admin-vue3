<template>
  <div class="pr-4px box-border">
    <div v-if="isPreview" class="preview-box">
      <v-md-preview :text="model"></v-md-preview>
    </div>
    <v-md-editor
      v-else
      ref="editorRef"
      v-model="model"
      height="400px"
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | tip todo-list | link image code"
      v-bind="column?.editorOption || {}"
      :placeholder="placeholderText"
    ></v-md-editor>
  </div>
</template>

<script setup lang="ts">
import * as TableApi from '@/api/design/table'

defineOptions({ name: 'MarkDown' })

interface Column {
  label?: string
  readonly?: boolean
  placeholder?: string
  editorOption?: object
}
interface Props {
  column?: Column
  prop?: string
  type?: string
  disabled?: boolean
}
const props = defineProps<Props>()
const model = defineModel<string>()

const editorRef = ref()

const placeholderText = computed(() => {
  let text = ''
  if (!props.disabled && props.column?.readonly === true) {
    text = props.column.placeholder ? props.column.placeholder : `请输入 ${props.column.label}`
  }
  return text
})

const isPreview = computed(() => {
  if (props.type == 'view' || props.column?.readonly) return true
  return false
})

const handleUploadImage = async (event, insertImage, files) => {
  const formData = new FormData()
  formData.append('updateSupport', '0')
  formData.append('file', files[0])
  const { data: data } = await TableApi.upLoadData(formData)
  insertImage({ url: data.fileUrl, des: '图片描述' })
}

watch(
  () => props.disabled,
  (val) => {
    editorRef.value.codemirrorInstance.options.readOnly = val
  }
)
</script>

<style lang="scss" scoped>
.v-md-editor {
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: none;
}

.preview-box {
  max-height: 50vh;
  overflow-y: auto;

  ::v-deep(.v-md-editor-preview) {
    .github-markdown-body {
      padding-right: 0 !important;
      padding-left: 0 !important;
    }
  }
}
</style>

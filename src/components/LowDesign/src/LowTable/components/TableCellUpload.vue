<template>
  <div class="table-cell-upload">
    <div>
      <div
        class="upload-show-box flex items-center justify-center cursor-pointer"
        v-if="urlList && urlList.length"
        @click="openUploadDetail()"
      >
        <template v-for="i in showNum" :key="i">
          <template v-if="urlList[i - 1]">
            <div class="avue-crud__img" v-if="column.controlType == 'image'">
              <img :src="urlList[i - 1]" class="flex mr-4px!" />
            </div>
            <div v-else class="flex mr-4px">
              <avue-text-ellipsis
                :text="fileNameList[i - 1]"
                :height="32"
                use-tooltip
                placement="top"
              />
              <span v-if="i != showNum" class="ml-5px"> | </span>
            </div>
          </template>
        </template>
        <el-tag v-if="urlList.length > showNum"> +{{ urlList.length - showNum }} </el-tag>
        <Icon v-if="type != 'view'" class="ml-4px mt-4px" :size="14" icon="ep:edit"></Icon>
      </div>
      <div
        v-else-if="type != 'view'"
        class="flex items-center justify-center cursor-pointer"
        @click="openUploadDetail()"
      >
        <el-button type="primary" plain>+ 点击上传</el-button>
      </div>
    </div>
    <DesignPopup v-model="dialogData.value" v-bind="dialogData.params">
      <div class="p-20px">
        <avue-form
          :option="formOption"
          v-model="formData"
          :upload-before="uploadBefore"
          :upload-exceed="uploadExceed"
          :upload-sized="uploadSized"
          :upload-preview="uploadPreview"
        ></avue-form>
      </div>
      <template #footer>
        <el-button @click="dialogData.value = false">取 消</el-button>
        <el-button type="primary" @click="setUploadData">确 定</el-button>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import useAvueUpload from '@/hooks/design/useAvueUpload'
interface Props {
  row: object
  index: number
  column: any
  type: 'view' | 'edit' | 'add'
  setCellData?: Function
}
const props = defineProps<Props>()
const { uploadBefore, uploadExceed, uploadSized, uploadPreview } = useAvueUpload()
const dialogData = ref({
  value: false,
  params: {
    title: '预览',
    width: '50%',
    isFooter: false
  }
})

const formData = ref({})

const formOption = ref({
  detail: true,
  submitBtn: false,
  emptyBtn: false,
  column: {}
})

const propKey = computed(() => {
  return props.column.prop
})

const showNum = computed(() => {
  const num = props.column.showNum
  if (!num || num <= 0) return 1
  return num
})

const urlList = computed(() => {
  const url = props.row[propKey.value]
  let urlList: any = []
  if (url instanceof Array) urlList = url
  else urlList = url ? url.split(',') : []
  return urlList
})

const fileNameList = computed(() => {
  const list: string[] = []
  if (urlList.value?.length) {
    urlList.value.forEach((url) => {
      const urls = url.split('/') || []
      list.push(urls[urls.length - 1])
    })
  }
  return list
})

const setUploadData = () => {
  if (props.setCellData) {
    props.setCellData({ [propKey.value]: formData.value[propKey.value] }, props.index)
  }
  dialogData.value.value = false
}

const openUploadDetail = () => {
  formOption.value = {
    ...formOption.value,
    detail: props.type == 'view',
    column: {
      [propKey.value]: {
        ...props.column
      }
    }
  }
  formData.value = { [propKey.value]: urlList.value }
  dialogData.value.params.title = `${props.type == 'view' ? '预览' : '上传'} ${props.column.label}`
  dialogData.value.params.isFooter = props.type != 'view'
  dialogData.value.value = true
}
</script>

<style lang="scss" scoped></style>

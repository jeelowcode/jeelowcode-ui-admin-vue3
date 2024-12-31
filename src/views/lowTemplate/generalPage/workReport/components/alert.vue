<template>
  <div>
    <el-alert v-for="item in defineData" :key="item.id" type="info">
      <template #title>
        <el-avatar :size="28" class="mr-5px" :src="item.imgUrl" />
        <span class="c-#666666 mr-10px">{{ item.name }}</span>
        <span class="c-#999999 text-12px">{{ item.time }}</span>
      </template>
      <template #default>
        <span class="c-#999999">{{ item.content }}</span>
      </template>
    </el-alert>

    <div class="flex h-60px mb-10px bottom">
      <el-input type="text" placeholder="请输入批阅内容" v-model="inputVal" />
      <el-button type="primary" @click="fbBtn">发布</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
interface DefineData {
  id: number
  imgUrl: string
  name: string
  time: string
  content: string
}

const props = defineProps<{
  data?: DefineData[]
}>()

const defineData = ref(props.data)
const inputVal = ref('')
let dataLength = ref(0)
const fbBtn = () => {
  if (!inputVal.value) return
  dataLength.value = defineData.value?.length || 0
  let endVal = defineData.value![dataLength.value - 1]
  let id = endVal.id
  defineData.value![dataLength.value] = {
    id: id,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    content: inputVal.value
  }
  inputVal.value = ''
}
</script>

<style lang="scss" scoped>
::v-deep(.el-alert) {
  height: 90px;
  margin-bottom: 20px;
  background-color: rgb(249 249 249 / 49.8%);
  border: 1px solid rgb(233 233 233 / 100%);
  border-radius: 0;

  .el-alert__content {
    height: 72px;
    align-items: baseline;

    .el-alert__title {
      display: flex;
      font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 14px;
      font-weight: 400;
      align-items: end;
    }

    .el-alert__description {
      font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 14px;
      font-weight: 400;
    }

    .el-alert__close-btn {
      font-size: 12px;
    }
  }
}

.bottom {
  ::v-deep(.el-input) {
    border: 1px solid rgb(233 233 233 / 100%);

    .el-input__wrapper {
      border-radius: 0;
      box-shadow: none;
    }

    &:hover {
      border-color: #409eff;
    }
  }

  .el-button {
    width: 80px;
    height: 60px;
    font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
    border-radius: 0;
  }
}
</style>

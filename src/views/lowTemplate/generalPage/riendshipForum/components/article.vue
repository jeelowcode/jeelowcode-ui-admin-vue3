<template>
  <div class="article">
    <div
      class="w-[calc(100%-80px)] h-110px flex items-center bg-#f9f9f9 b-1px b-solid b-#e9e9e9 pl-40px pr-40px"
    >
      <div>
        <div class="h-36px flex items-center">
          <div class="font-wryh font-700 text-20px c-#666666 mr-15px">
            {{ data.htbt }}
          </div>
          <div class="flex mr-10px" v-if="data.sd && data.sd == '1'">
            <Icon icon="solar:lock-linear"></Icon>
          </div>
          <div
            class="w-52px h-20px bg-#0099ff rounded-2xl c-white flex justify-center items-center text-12px mr-10px"
            v-if="data.zd && data.zd == '1'"
          >
            置顶
          </div>
          <div
            class="w-52px h-20px bg-#ff7a8c rounded-2xl c-white flex justify-center items-center text-12px"
            v-if="data.rm && data.rm == '1'"
          >
            热门
          </div>
        </div>
        <div class="h-38.4px flex items-center">
          <el-avatar :size="20" :src="data.cytx" />
          <span class="font-wryh ml-10px text-14px c-#999999">{{ data.$create_user }}</span>
          <span class="font-wryh ml-10px text-14px c-#999999 flex items-center">
            <Icon icon="mingcute:time-line" :size="17"></Icon>
            {{ data.create_time }}
          </span>
        </div>
      </div>
      <div class="ml-auto">
        <el-button type="primary" plain style="width: 80px; height: 35px" @click="bjBtn">
          <Icon icon="fa6-solid:pen" :size="15" class="mr-2px"></Icon>
          编辑
        </el-button>
      </div>
    </div>
    <div class="w-[calc(100%-80px)] pl-40px pr-40px b-1px b-t-0 b-solid b-#e9e9e9">
      <div class="pt-30px" v-html="vHtml" style="line-height: 32px"> </div>
      <div class="w-100% text-right c-#999 font-wryh"> 最后编辑时间：2020-11-24 10:00:00 </div>

      <div class="mt-50px">
        <div class="flex items-center mb-30px">
          <div class="w-6px h-18px bg-#409EFF mr-8px"></div>
          <span class="font-wryh font-700 c-#666666"> 发布评论 </span>
        </div>
        <div class="flex h-60px mb-10px bottom">
          <el-input type="text" placeholder="请输入批阅内容" v-model="inputVal" />
          <el-button type="primary" @click="fbBtn">发布</el-button>
        </div>
      </div>
      <div>
        <div>
          <div class="flex items-center mt-40px mb-20px">
            <div class="w-6px h-18px bg-#409EFF mr-8px"></div>
            <span class="font-wryh font-700 c-#666666 mr-3px"> 评论记录 </span>
            <span class="font-400 c-#666666"> 10条 </span>
          </div>
        </div>
        <el-alert v-for="item in defineData" :key="item.id" type="info" :closable="false">
          <template #title>
            <el-avatar :size="28" class="mr-5px" :src="item.imgUrl" />
            <span class="c-#666666 mr-10px">{{ item.name }}</span>
            <span class="c-#999999 text-12px">{{ item.time }}</span>
          </template>
          <template #default>
            <span class="c-#999999">{{ item.content }}</span>
            <div class="like flex">
              <Icon
                icon="iconamoon:like-bold"
                class="mr-2px cursor-pointer"
                :class="item.isLike ? 'c-red' : ''"
                @click="likeClick(item.id)"
              ></Icon>
              {{ item.like }}
            </div>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'

interface Data {
  htbt: string
  create_time: string
  $create_user: string
  cytx: string
  rm: string
  sd: string
  zd: string
}

const prop = defineProps<{
  data: Data
  hideFun: Function
}>()

const data = prop.data

const bjBtn = () => {
  prop.hideFun!()
}

const vHtml = ref(
  '<div id="u90044_text" class="text ">  <p><span>近日，在阿里云2020年云栖大会上，阿里云智能网络产品研究员祝顺民重磅发布了多款网络新品，其中之一就是应用负载均衡ALB。ALB产品定位应用层高级负载，具备超强性能、安全可靠、面向云原生、即开即用等优势价值，提供弹性自动伸缩、QUIC协议支持、基于内容的高级路由、自带DDoS安全防护、云原生应用、弹性灵活计费等产品能力，满足越来越多元化的应用层负载需求。</span></p><br><p><span>说到负载均衡，很多朋友或许都会想到经典负载均衡，阿里云负载均衡SLB发布近十年，为各行各业的用户提供强大稳定的负载分担能力，解决大并发流量负载分担，消除单点故障，提高业务可用性。但随着企业和互联网业务高速发展，业务形态和需求不断变化，诸多业务场景已经无法单纯的用传统负载均衡来满足全部需求。在大互联网业务、电商大促、音视频、移动互联网应用、游戏业务、金融服务、云原生开发应用等场景中，存在大量高性能、弹性、多协议七层转发、安全、云原生等需求，急需新产品设计来满足。</span></p><p><span><br></span></p> </div>'
)

const defineData = ref([
  {
    id: 1,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: '2019-03-23 22:31',
    content: '非常不错的分享，对我们的工作很有参考价值。',
    like: 100,
    isLike: false
  },
  {
    id: 2,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: '2019-03-23 22:31',
    content: '非常不错的分享，对我们的工作很有参考价值。',
    like: 100,
    isLike: false
  },
  {
    id: 3,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: '2019-03-23 22:31',
    content: '非常不错的分享，对我们的工作很有参考价值。',
    like: 100,
    isLike: false
  }
])

let likeIdList = ref<number[]>([])
const inputVal = ref('')
let dataLength = ref(0)
const fbBtn = () => {
  if (!inputVal.value) return
  dataLength.value = defineData.value?.length || 0
  let endVal = defineData.value![dataLength.value - 1]
  let id = endVal.id + 1
  defineData.value![dataLength.value] = {
    id: id,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    content: inputVal.value,
    like: 0,
    isLike: false
  }
  inputVal.value = ''
}

const likeClick = (id) => {
  defineData.value = defineData.value.map((item) => {
    if (id == item.id) {
      let index = likeIdList.value.indexOf(id)
      if (index == -1) {
        likeIdList.value.push(item.id)
        return {
          ...item,
          like: item.like + 1,
          isLike: true
        }
      } else {
        likeIdList.value.splice(index, 1)
        return {
          ...item,
          like: item.like - 1,
          isLike: false
        }
      }
    }
    return item
  })
}
</script>

<style lang="scss" scoped>
.article {
  .font-wryh {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
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

  ::v-deep(.el-alert) {
    height: 90px;
    padding: 0 20px;
    margin-bottom: 20px;
    background-color: rgb(249 249 249 / 49.8%);
    border: 1px solid rgb(233 233 233 / 100%);
    border-radius: 0;

    .el-alert__content {
      height: 100%;
      align-items: baseline;

      .el-alert__title {
        display: flex;
        height: 50px;
        font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 14px;
        font-weight: 400;
        align-items: center;
      }

      .el-alert__description {
        font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 14px;
        font-weight: 400;

        .like {
          position: absolute;
          top: 50%;
          right: 20px;
          font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
          font-size: 12px;
          color: #999;
          transform: translateY(-50%);
        }
      }

      .el-alert__close-btn {
        font-size: 12px;
      }
    }
  }
}
</style>

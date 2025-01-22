<template>
  <div class="w-100% flex gap-x-20px">
    <div class="w-80%">
      <div
        class="h-260px flex pl-10px pt-10px mb-20px bg-white big-radius .dark:bg-#1A2744"
        style="width: calc(100% - 10px)"
      >
        <div
          class="bg-#3370FF w-45% pb-10px mr-10px flex big-radius blue_box_shadow pointer"
          style="height: calc(100% - 20px)"
        >
          <div class="w-50% pt-10px pb-10px pl-20px pr-20px">
            <div class="text-white text-32px font-bold mb-5px nowrap">转化率</div>
            <div
              class="text-white text-14px flex items-center nowrap"
              style="font-family: Arial, Helvetica, sans-serif"
            >
              {{ conversion.sj }}
              <div
                class="w-15px h-15px bg-white rounded-md flex items-center justify-center ml-10px"
              >
                <Icon icon="bytesize:chevron-bottom" :size="12" class="text-black"></Icon>
              </div>
            </div>
            <div class="mt-30px flex nowrap">
              <div class="w-50% text-white b-l-0 b-t-0 b-b-0 b-r-1px b-#709BFF b-solid">
                <div class="text-12px">成功客户数</div>
                <div class="text-16px font-bold mt-5px">{{ conversion.cgkhs }}</div>
              </div>
              <div class="w-50% text-white ml-30px">
                <div class="text-12px">新增会员数</div>
                <div class="text-16px font-bold mt-5px">{{ conversion.xzhys }}</div>
              </div>
            </div>
            <div
              class="mt-30px flex bg-white h-49px pt-5px rounded-md text-blue-600 w-183px pl-20px .dark:bg-#1A2744"
              style="align-items: baseline"
            >
              <span class="text-14px">客单价：</span>
              <span class="text-32px font-bold ml-10px">{{ conversion.kdj }}</span>
            </div>
          </div>
          <div class="w-50%">
            <Echart :options="oilGauge_option" width="100%" height="250px" />
          </div>
        </div>
        <div class="oilGauge_line .dark:b-#525C73">
          <div class="grid gap-x-20px grid-cols-4 ml-20px">
            <div
              class="truncate flex-shrink-0"
              v-for="item in ConversionList"
              :key="item.titleCode"
            >
              <div class="flex" style="align-items: baseline">
                <span class="font-bold text-28px">{{ item.nowNum }}</span>
                <template v-if="item.nowNum >= item.beforeNum">
                  <div class="arrow-top flex justify-center ml-10px">
                    <Icon icon="mdi:arrow-top-bold" class="text-white .dark:text-black"></Icon>
                  </div>
                </template>
                <template v-else>
                  <div class="arrow-bottom flex items-center justify-center ml-10px">
                    <Icon icon="mdi:arrow-bottom-bold" class="text-white .dark:text-black"></Icon>
                  </div>
                </template>
              </div>
              <div class="text-14px mt-5px">
                <span class="text-13px">/</span>
                昨日：{{ item.beforeNum }}
              </div>
              <div class="mt-5px pb-5px">
                <div
                  :class="defaultConversion == item.titleCode ? 'active-conversion' : ''"
                  class="text-14px c-#A2A7C2 cursor-pointer .dark:text-white"
                  @click="clickSelectConversion(item.titleCode)"
                  style="width: max-content"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
          </div>

          <div class="oilGauge_line_echart">
            <Echart :options="oilGauge_line_option" width="100%" height="150px" />
          </div>
        </div>
      </div>
      <div class="w-100% flex gap-x-20px">
        <div
          class="h-390px w-50% p-10px mb-20px bg-white big-radius flex items-center .dark:bg-#1A2744"
        >
          <div class="w-100%">
            <div class="h-150px text-25px flex items-center justify-center mb-20px">
              <template v-if="typeof advertising == 'string'">
                {{ advertising }}
              </template>
              <template v-else-if="typeof advertising == 'object'">
                <el-carousel height="150px" class="w-100% rounded-xl">
                  <el-carousel-item
                    class="text-center"
                    v-for="(item, index) in advertising"
                    :key="index"
                  >
                    <el-image :src="item.imgUrl" class="h-100% w-100%" fit="cover"></el-image>
                  </el-carousel-item>
                </el-carousel>
              </template>
            </div>
            <div class="pt-10px b-solid b-l-0 b-r-0 b-b-0 b-t-1px b-#5D677D">
              <div class="flex">
                <div>
                  <span class="c-#FF0000 font-bold .dark:text-white">
                    某赞商家&thinsp;&thinsp;<span class="c-#ED6A0C font-bold .dark:text-white"
                      >不打烊</span
                    >
                  </span>
                </div>
                <div
                  class="flex items-center ml-20px pl-20px b-solid b-t-0 b-r-0 b-b-0 b-l-2px b-#EEF1FF"
                >
                  <el-avatar src="/img/avatar1.png" size="small" />
                  <span class="c-#FF0000 font-bold text-13px ml-10px .dark:text-white">
                    某赞护航
                    <span class="ml-15px font-100">为你的生意保驾护航</span>
                  </span>
                </div>
              </div>
              <div class="h-155px flex mt-20px bg-#EEF1FF small-radius .dark:bg-black">
                <div class="w-65% h-100% flex items-center">
                  <div
                    class="text-12px h-90% flex justify-center p-l-25px"
                    style="flex-direction: column"
                  >
                    <div
                      v-for="(item, index) in merchantIntroduction"
                      :key="item.title + index"
                      class="flex-auto flex items-center div_to_ul"
                    >
                      <span class="mr-10px shrink-0 w-50px">{{ item.title }}</span>
                      <span
                        class="truncate w-170px b-solid b-t-0 b-r-0 b-b-0 b-l-1px b-#E0E6ED pl-10px"
                      >
                        {{ item.content }}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="w-35% bg-#3370FF m-10px p-20px small-radius cursor-pointer c-white blue_box_shadow"
                >
                  <div class="text-11px"> 查看全部经验建议 </div>
                  <div class="text-32px h-60px" style="line-height: 60px"> {{ sjjysl }} </div>
                  <div class="text-13px flex items-center">
                    /家商家已学习
                    <Icon icon="si:arrow-right-fill" :size="24" class="ml-auto"></Icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-390px w-50% p-10px mb-20px bg-white big-radius .dark:bg-#1A2744">
          <div class="p-10px flex" style="height: calc(100% - 20px)">
            <div class="w-180px">
              <div class="font-bold text-22px"> 智能助手 </div>
              <div class="c-#A2A7C2 text-13px mt-5px .dark:text-white">
                感受下某赞黑科技的力量
              </div>
              <div class="w-180px h-180px animation-box mt-30px">
                <div
                  class="znzs-one w-180px h-180px bg-#f8f8fd .dark:bg-#56607A"
                  :class="znzsType == 'hover' ? 'hover' : ''"
                >
                </div>
                <div
                  class="znzs-two w-150px h-150px bg-#e8eafb .dark:bg-#9098B4"
                  :class="znzsType == 'hover' ? 'hover' : ''"
                >
                </div>
                <div class="znzs-three w-130px h-130px" :class="znzsType == 'hover' ? 'hover' : ''">
                </div>
                <div class="znzs-four w-110px h-110px"> </div>
                <div class="znzs-xdcl text-13px text-white">项待处理 </div>
                <div class="znzs-ck pointer w-60px h-60px c-white text-52px font-bold text-center">
                  <div
                    class="znzs-sz h-300px w-100%"
                    :class="znzsType == 'nothover' ? 'nothover' : ''"
                    @mouseover="znzsMouseover"
                    @mouseout="znzsMouseout"
                  >
                    <div
                      class="h-60px"
                      style="line-height: 60px"
                      v-for="item in animationList"
                      :key="item"
                    >
                      {{ item }}
                    </div>
                    <div class="h-76px" style="line-height: 60px">
                      <Icon icon="charm:chevrons-up" :size="36" class=""></Icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center mt-50px">
                <div
                  class="w-140px h-40px text-14px flex items-center justify-center cursor-pointer bg-#3370FF c-white small-radius"
                >
                  去解决掉TA
                </div>
              </div>
            </div>
            <div class="h-100% znzs-tabs ml-10px" style="width: calc(100% - 180px)">
              <el-tabs v-model="activeName" class="" @tab-click="handleClick">
                <el-tab-pane label="全部" name="1"></el-tab-pane>
                <el-tab-pane label="店铺基础" name="2"></el-tab-pane>
                <el-tab-pane label="商品体验" name="3"></el-tab-pane>
                <el-tab-pane label="物流体验" name="4"></el-tab-pane>
              </el-tabs>
              <div class="tabs-position-icon">
                <Icon icon="material-symbols:menu" :size="26"></Icon>
              </div>
              <div>
                <Echart :options="znzs_option" width="300px" height="190px" />
              </div>
              <div class="grid grid-rows-3 text-11px gap-y-20px mt-20px">
                <div
                  v-for="(item, index) in znzsIntroduce"
                  :key="item.xxnra + index"
                  class="flex items-center"
                >
                  <template v-if="item.jjcd == 1">
                    <el-image src="/img/hq1.png" fit="contain" class="h-15px"></el-image>
                  </template>
                  <template v-else-if="item.jjcd == 0">
                    <el-image src="/img/lq1.png" fit="contain" class="h-15px"></el-image>
                  </template>
                  <div class="ml-15px flex truncate w-190px">
                    <div class="truncate" style="max-width: 100%; flex-shrink: 0">
                      {{ item.xxnra }}
                    </div>
                    <div v-if="item.xxnrb" class="c-#C7CCD0 ml-5px truncate .dark:text-white">
                      {{ item.xxnrb }}</div
                    >
                  </div>
                  <span class="ml-auto c-#3370FF cursor-pointer .dark:text-white">
                    {{ item.btname }}
                  </span>
                </div>
              </div>
              <div class="mt-20px text-11px c-#3370FF cursor-pointer .dark:text-white">
                还有 {{ overviewPendingLen }} 条内容，查看全部内容
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100% flex gap-x-30px">
        <div class="h-115px w-95% mb-20px big-radius flex gap-x-30px">
          <div
            class="w-100% bg-#1DC9B7 small-radius c-white"
            style="box-shadow: 0 3px 20px rgb(29 201 183 / 29.8%)"
          >
            <div class="h-100% pl-20px pr-20px flex items-center">
              <div class="w-75%">
                <div class="font-bold text-24px mb-10px">微信小程序</div>
                <div class="text-13px truncate">抢占微信设计流量红利</div>
              </div>
              <div class="w-25%">
                <el-image src="/img/wxxcx1.png" fit="contain" class="h-45px" />
              </div>
            </div>
          </div>
          <div class="w-100% bg-#3370FF blue_box_shadow small-radius c-white">
            <div class="h-100% pl-20px pr-20px flex items-center">
              <div class="w-75%">
                <div class="font-bold text-24px mb-10px">百度小程序</div>
                <div class="text-13px truncate">打造商家新官网</div>
              </div>
              <div class="w-25%">
                <el-image src="/img/wxxcx1.png" fit="contain" class="h-45px" />
              </div>
            </div>
          </div>
          <div
            class="w-100% bg-#C227FC small-radius c-white"
            style="box-shadow: 0 3px 20px rgb(194 39 252 / 29.8%)"
          >
            <div class="h-100% pl-20px pr-20px flex items-center">
              <div class="w-75%">
                <div class="font-bold text-24px mb-10px">分销市场</div>
                <div class="text-13px truncate">一键上架，快速补充货源</div>
              </div>
              <div class="w-25%">
                <el-image src="/img/fxsc.png" fit="contain" class="h-45px" />
              </div>
            </div>
          </div>
          <div
            class="w-100% bg-#F2637B small-radius c-white"
            style="box-shadow: 0 3px 20px rgb(242 99 123 / 29.8%)"
          >
            <div class="h-100% pl-20px pr-20px flex items-center">
              <div class="w-75%">
                <div class="font-bold text-24px mb-10px">多人拼团</div>
                <div class="text-13px truncate">裂变式营销玩法</div>
              </div>
              <div class="w-25%">
                <el-image src="/img/pin.png" fit="contain" class="h-45px" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="h-115px w-5% pr-10px pl-10px mb-20px bg-#3370FF blue_box_shadow flex justify-center small-radius text-white text-12px"
        >
          <div class="w-50% h-100% mt-10px leading-6 cursor-pointer">
            更多最新推荐
            <Icon icon="pepicons-pop:arrow-left" :size="24"></Icon>
          </div>
        </div>
      </div>
      <div class="w-100% flex gap-x-30px">
        <div
          class="h-115px w-5% pr-10px pl-10px mb-20px bg-#3370FF blue_box_shadow flex justify-center small-radius text-white text-12px"
        >
          <div class="w-50% h-100% mt-10px leading-6 cursor-pointer">
            全部经营建议
            <Icon icon="pepicons-pop:arrow-right" :size="24"></Icon>
          </div>
        </div>
        <div class="h-115px w-95% mb-20px big-radius flex gap-x-30px">
          <div
            v-for="(item, index) in jyjyList"
            :key="item.title + index"
            class="w-100% bg-white small-radius .dark:bg-#1A2744"
          >
            <div class="h-100% pl-20px pr-20px flex items-center">
              <div class="w-25%">
                <el-image :src="item.imgUrl" fit="contain" />
              </div>
              <div class="w-75% ml-5px">
                <div class="font-bold text-24px mb-10px">{{ item.title }}</div>
                <div class="text-12px c-#A2A7C2 truncate .dark:text-white">{{
                  item.introduction
                }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100% mb-20px">
        <div class="h-240px p-20px pl-40px bg-white small-radius .dark:bg-#1A2744">
          <div class="font-bold text-24px"> 学习交流 </div>
          <div class="text-14px mt-5px c-#A2A7C2 .dark:text-white">
            成长必经之路，好好看，好好学...
          </div>
          <div class="w-85% mt-20px flex">
            <div class="w-100% grid gap-x-30px gap-y-20px grid-cols-3">
              <div
                class="pl-10px h-66px flex items-center bg-#EEF1FF small-radius .dark:bg-black"
                v-for="(item, index) in learningExchangeList"
                :key="index"
              >
                <div class="w-25%">
                  <el-image :src="item.imgUrl" fit="contain" />
                </div>
                <div class="w-75%">
                  <div class="font-bold mb-5px">{{ item.title }}</div>
                  <div class="text-12px c-#A2A7C2 truncate .dark:text-white">{{
                    item.introduce
                  }}</div>
                </div>
              </div>
            </div>
            <div
              class="h-150px w-60px pr-10px pl-10px ml-30px bg-#3370FF blue_box_shadow flex justify-center small-radius text-white text-12px"
            >
              <div class="w-50% h-100% mt-10px leading-8 cursor-pointer">
                更多渠道学习
                <Icon icon="pepicons-pop:arrow-left" :size="24"></Icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100%">
        <div class="h-240px p-20px pl-40px bg-white small-radius .dark:bg-#1A2744">
          <div class="font-bold text-24px"> 更多服务 </div>
          <div class="text-14px mt-5px c-#A2A7C2 .dark:text-white"> 想要找找其他的服务 </div>
          <div class="flex h-130px mt-30px">
            <div class="grid grid-cols-8 grid-rows-1 h-100%">
              <div
                v-for="(item, index) in moreServicesList"
                :key="item.title + index"
                class="bg-#EEF1FF small-radius mr-20px h-130px flex items-center justify-center .dark:bg-black"
                style="flex-direction: column; min-width: 90px"
              >
                <div class="">
                  <el-image :src="item.imgUrl" fit="contain" />
                </div>
                <div class="font-bold mt-15px"> {{ item.title }} </div>
              </div>
            </div>
            <div
              class="w-70px h-100% pr-5px pl-5px bg-#3370FF blue_box_shadow small-radius text-white text-12px"
            >
              <div class="ml-10px mr-10px h-100% mt-10px leading-8 text-center cursor-pointer">
                或者没你想要的？联系我
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-20% flex-shrink-0">
      <div class="w-100%">
        <div class="h-300px p-20px bg-white mb-20px big-radius flex items-center .dark:bg-#1A2744">
          <div class="w-100%">
            <div class="text-21px font-bold"> 如果你需要帮助 </div>
            <div class="text-13px c-#A2A7C2 mt-5px mb-20px .dark:text-white"> 随时呼叫我... </div>
            <div class="w-100%">
              <div
                class="h-60px mb-15px bg-#EEF1FF small-radius flex items-center pl-10px pr-10px .dark:bg-black"
                v-for="(item, index) in bzList"
                :key="item.title + index"
              >
                <el-image :src="item.imgUrl" fit="contain" class="h-30px" />
                <div class="ml-15px">
                  <div class="text-14px font-bold">{{ item.title }}</div>
                  <div class="c-#A2A7C2 text-11px .dark:text-white">{{ item.introduction }}</div>
                </div>
                <Icon
                  icon="pepicons-pop:arrow-right"
                  :size="24"
                  class="ml-auto cursor-pointer"
                ></Icon>
              </div>
            </div>
          </div>
        </div>
        <div class="h-300px p-20px bg-white mb-20px big-radius flex items-center .dark:bg-#1A2744">
          <div class="w-100%">
            <div class="text-21px font-bold"> 有你的服务通知 </div>
            <div class="text-13px c-#A2A7C2 mt-5px mb-20px .dark:text-white"> 随时关注动态... </div>
            <div class="w-100% grid gap-y-15px">
              <div
                class="bg-#EEF1FF small-radius p-10px pt-13px pb-13px .dark:bg-black"
                v-for="(item, index) in fwtzList"
                :key="index"
              >
                <div class="font-bold"> {{ item.title }} </div>
                <div class="c-#A2A7C2 text-12px mt-5px .dark:text-white">
                  {{ item.content }}
                </div>
                <div class="flex justify-center mt-10px">
                  <div class="flex justify-between text-12px c-#3370FF w-60% .dark:text-white">
                    <div class="cursor-pointer">查看详情</div>
                    <div class="cursor-pointer">我知道了</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template v-for="(item, index) in rightList" :key="item.title + index">
          <div
            :class="item.h == '210' ? 'h-210px' : 'h-240px'"
            class="p-20px bg-white mb-20px big-radius flex items-center .dark:bg-#1A2744"
          >
            <div class="w-100%">
              <div class="text-23px font-bold"> {{ item.title }} </div>
              <div class="text-14px c-#3370FF mt-5px mb-15px cursor-pointer .dark:text-white">
                查看全部
              </div>
              <div class="w-100%">
                <div
                  class="bg-#EEF1FF small-radius p-10px h-130px .dark:bg-black"
                  style="width: calc(100% - 20px)"
                >
                  <div class="font-bold mb-15px">{{ item.totalTitle }}</div>
                  <div class="c-#A2A7C2 w-100% text-11px grid grid-rows-4">
                    <div
                      v-for="(cItem, cIndex) in item.content"
                      :key="cItem.title + cIndex"
                      class="mb-5px cursor-pointer .dark:text-white"
                      :class="cItem.type == 'success' ? 'c-#F2637B' : 'flex'"
                    >
                      {{ cItem.title }}
                      <div v-if="cItem.type == 'info'" class="ml-auto">
                        <Icon icon="mingcute:right-line" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/Icon/src/Icon.vue'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import type { TabsPaneContext } from 'element-plus'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { getTableList, batchGetTableList } from '@/api/design/report'

defineOptions({ name: 'Home10' })

interface Advertising {
  imgUrl: string
}
interface ZnzsIntroduce {
  jjcd: number
  xxnra: string
  xxnrb?: string
  btname?: string
}
interface FwtzList {
  content: string
  title: string
}
interface RightListContent {
  type: string
  title: string
}
interface RightList {
  title: string
  h: string
  totalTitle?: string
  content?: RightListContent[]
}
interface MerchantIntroduction {
  title: string
  content: string
}

const conversion = ref({
  cgkhs: 0,
  sj: '',
  kdj: 0,
  xzhys: 0
})

const oilGaugeValue = ref(45)
const oilGaugeCode = ref('%')
const oilGaugeSubtext = ref('访问-支付转化率')
const oilGaugemax = ref(100)

// 访问-支付转化率
const oilGauge_option = ref({
  title: [
    {
      text: `{primary|${oilGaugeValue.value}}\t{point|${oilGaugeCode.value}}`,
      left: 'center',
      top: 'center',
      textStyle: {
        rich: {
          primary: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 32,
            lineHeight: 67.2
          },
          point: {
            fontSize: 12,
            lineHeight: 22,
            color: 'white',
            padding: [10, -10, 0, -5]
          }
        }
      }
    },
    {
      left: 'center',
      top: '70%',
      subtext: `${oilGaugeSubtext.value}`,
      subtextStyle: {
        color: 'white',
        fontSize: 12,
        x: '20%'
      }
    }
  ],
  angleAxis: {
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    min: 0,
    max: 6.666,
    startAngle: 225
  },
  radiusAxis: {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    },
    data: ['a', 'b', 'c'],
    z: 10
  },
  polar: {
    radius: '105%'
  },
  series: [
    {
      type: 'gauge',
      splitNumber: 20,
      max: oilGaugemax.value,
      radius: '75%',
      detail: {
        show: false
      },
      axisLine: {
        // 坐标轴线
        show: false,
        lineStyle: {
          color: [
            [0, '#ADC6FF'],
            [1, '#ADC6FF']
          ],
          width: 0,
          opacity: 0
        }
      },
      data: [
        {
          name: '',
          value: oilGaugeValue.value
        }
      ],
      splitLine: {
        length: 20, //长刻度节点线长度
        lineStyle: {
          width: 4,
          color: '#ADC6FF'
        } //刻度节点线
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        color: '#333',
        fontSize: 18
      },
      pointer: {
        show: true,
        icon: 'roundRect',
        length: '60%',
        offsetCenter: [0, -25],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'white'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ]
          },
          opacity: 0.9
        }
      }
    }
  ],
  tooltip: {
    show: false
  }
})

// 折线图
const goTo = ref<number[]>([])
const goOut = ref<number[]>([])
const oilGaugeLineXAxis = ref<string[]>([])
const showoilGaugeLineLable = ref('')
const ConversionList = ref([
  { nowNum: 0, beforeNum: 0, title: '支付金额', titleCode: 'zfje' },
  { nowNum: 0, beforeNum: 0, title: '支付订单', titleCode: 'zfdd' },
  { nowNum: 0, beforeNum: 0, title: '浏览量', titleCode: 'lll' },
  { nowNum: 0, beforeNum: 0, title: '访客数', titleCode: 'fks' }
])
const defaultConversion = ref('')
let oilGaugeMarkPoint = computed(() => {
  let str = {
    goTo: ['1', goTo.value[0] || 0],
    goOut: ['1', goOut.value[0] || 0]
  }
  return str
})
const oilGauge_line_option = ref<any>({
  color: ['#F2F4F5', '#3571FE'],
  grid: {
    top: '15%',
    bottom: '0',
    left: '0',
    right: '0'
  },
  xAxis: [
    {
      show: false,
      boundaryGap: false,
      data: oilGaugeLineXAxis.value
    }
  ],
  yAxis: [
    {
      show: false
    }
  ],
  series: [
    {
      name: '昨天',
      type: 'line',
      symbolSize: 0,
      smooth: true,
      lineStyle: {
        normal: {
          width: 2
        }
      },
      data: goTo.value,
      silent: true
    },
    {
      name: '今天',
      type: 'line',
      symbol: 'circle',
      symbolSize: 0,
      smooth: true,
      lineStyle: {
        normal: {
          width: 3
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#326ffd5f' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#326ffd13' // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        }
      },
      data: goOut.value,
      silent: true
    },
    {
      type: 'line',
      data: [],
      markLine: {
        symbol: 'none',
        lineStyle: {
          type: 'dashed'
        },
        data: [
          [
            {
              xAxis: 0,
              yAxis: 0
            },
            {
              xAxis: 0,
              yAxis: 0,
              label: {
                formatter: `{aa|${showoilGaugeLineLable.value}}`,
                rich: {
                  aa: {
                    color: 'rgba(100, 108, 154, 0.6)',
                    fontSize: 12
                  }
                },
              }
            }
          ],
          [
            {
              xAxis: 0,
              yAxis: 0
            },
            {
              xAxis: 0,
              yAxis: 0,
              label: {
                formatter: `{aaa|}`,
                rich: {
                  aaa: {
                    color: 'rgba(100, 108, 154, 0.6)',
                    fontSize: 12
                  }
                }
              }
            }
          ]
        ]
      },
      markPoint: {
        data: [
          {
            coord: oilGaugeMarkPoint.value['goTo'],
            symbol: 'circle',
            symbolSize: 16,
            label: {
              formatter: '昨日',
              color: 'rgba(100, 108, 154, 0.6)',
              offset: [20, -10]
            },
            itemStyle: {
              color: 'rgba(255, 255, 255, 0)'
            }
          },
          {
            coord: oilGaugeMarkPoint.value['goOut'],
            symbol: 'circle',
            symbolSize: 16,
            label: {
              formatter: '今日',
              color: '#3571FE',
              offset: [20, -10]
            },
            itemStyle: {
              color: 'rgba(255, 255, 255, 0)',
              silent: true
            }
          }
        ]
      },
      silent: true
    }
  ]
})
const initConversion = (realtimeData) => {
  ConversionList.value.forEach((ele) => {
    ele.nowNum = realtimeData[ele.titleCode].jr
    ele.beforeNum = realtimeData[ele.titleCode].zr
    realtimeData[ele.titleCode].flag == 1
      ? (defaultConversion.value = ele.titleCode)
      : (defaultConversion.value = 'zfje')
  })

  realtimeData.data.forEach((ele) => {
    goTo.value.push(ele.zr)
    oilGaugeLineXAxis.value.push(ele.sj)
    if (ele.jr) goOut.value.push(ele.jr)
  })

  let goOutLength = goOut.value.length - 1
  let nowGoOut = goOut.value[goOutLength]
  let nowGoTo = goTo.value[goOutLength]

  nowGoOut < nowGoTo
    ? (showoilGaugeLineLable.value = '加把劲，就上去了...')
    : (showoilGaugeLineLable.value = '')
  const series2 = oilGauge_line_option.value.series[2]

  series2.markLine.data[0][0].xAxis = goOutLength
  series2.markLine.data[0][1].xAxis = goOutLength
  series2.markLine.data[0][1].yAxis = nowGoOut
  series2.markLine.data[0][1].label.formatter = `{aa|${showoilGaugeLineLable.value}}`
  series2.markLine.data[1][1].label.formatter = `{aaa|更新时间：${realtimeData.gxsj}}`
  series2.markLine.data[1][0].xAxis = goOutLength
  series2.markLine.data[1][1].xAxis = goOutLength
  series2.markLine.data[1][1].yAxis = nowGoOut + nowGoTo + 20
  series2.markPoint.data[0].coord = oilGaugeMarkPoint.value.goTo
  series2.markPoint.data[1].coord = oilGaugeMarkPoint.value.goOut
}
const clickSelectConversion = async (val) => {
  let res = await getTableList('example_overview_realtime_data', { type: 3 })
  goTo.value = []
  goOut.value = []
  oilGaugeLineXAxis.value = []
  initConversion(res.records[0])
  defaultConversion.value = val
}

const moreServicesList = ref([
  {
    imgUrl: '/img/gdfw.png',
    title: '零售'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '教育'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '美业'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '某赞精选'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '某赞担保'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '跨境服务'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '某赞分销'
  },
  {
    imgUrl: '/img/gdfw.png',
    title: '我要推广'
  }
])

const learningExchangeList = ref([
  {
    title: '商家论坛',
    introduce: '百万商家互通互助',
    imgUrl: '/img/xxjl.png'
  },
  {
    title: '线下培训',
    introduce: '点击查看全国活动',
    imgUrl: '/img/xxjl.png'
  },
  {
    title: '服务市场',
    introduce: '服务商帮你经营',
    imgUrl: '/img/xxjl.png'
  },
  {
    title: '在线课堂',
    introduce: '资深专家视频授课',
    imgUrl: '/img/xxjl.png'
  },
  {
    title: '本地商盟',
    introduce: '加入本地商家联盟',
    imgUrl: '/img/xxjl.png'
  },
  {
    title: '定制服务',
    introduce: '定制开发专享功能',
    imgUrl: '/img/xxjl.png'
  }
])

const rightList = ref<RightList[]>([
  {
    title: '规则中心',
    h: '210'
  },
  {
    title: '产品动态',
    h: '240'
  },
  {
    title: '学习中心',
    h: '240'
  }
])

// 广告区域
// const advertising = ref<string | Advertising[]>('广告banner')
const advertising = ref<string | Advertising[]>([{ imgUrl: '/img/sygl1.png' }])
const sjjysl = ref('')

const merchantIntroduction = ref<MerchantIntroduction[]>()

const jyjyList = ref([
  {
    imgUrl: '',
    whiteImgUrl: '/img/whitelltz.png',
    blackImgUrl: '/img/blacklltz.png',
    title: '流量拓展',
    introduction: '小程序分享至朋友圈'
  },
  {
    imgUrl: '',
    whiteImgUrl: '/img/whitehyzm.png',
    blackImgUrl: '/img/blackhyzm.png',
    title: '会员招募',
    introduction: 'App端支持办理会员卡'
  },
  {
    imgUrl: '',
    whiteImgUrl: '/img/whitefyzd.png',
    blackImgUrl: '/img/blackfyzd.png',
    title: '费用账单',
    introduction: '便捷管理店铺账目收支'
  },
  {
    imgUrl: '',
    whiteImgUrl: '/img/whitesptg.png',
    blackImgUrl: '/img/blacksptg.png',
    title: '商品推广',
    introduction: '多平台推广商品类目信息'
  }
])

const bzList = ref([
  {
    imgUrl: '/img/zxkf.png',
    title: '在线客服',
    introduction: '电话：057 - 8888 8888'
  },
  {
    imgUrl: '/img/zmkf.png',
    title: '桌面在线客服',
    introduction: '即时应答客户在线咨询'
  },
  {
    imgUrl: '/img/sjkf.png',
    title: '移动客户端',
    introduction: '使用手机、Pad管理店铺'
  }
])

const znzsType = ref('hover')
const znzsMouseover = () => {
  znzsType.value = 'hover'
}
const znzsMouseout = () => {
  znzsType.value = 'nothover'
}
const activeName = ref('1')
const initZnzs = (data) => {
  znzsSeries.value = [data.dfhdd, data.dhfkf, data.yzxsp, data.dtkdd, data.pdzkh]
  znzs_option.value.series.data = znzsSeries.value
}
// 点击智能助手tabs事件
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  let res = await getTableList('example_overview_intelligent_assistants', {
    type: tab.props.name
  })
  initZnzs(res.records[0])
}
const znzsSeries = ref<number[]>([])
const znzs_option = ref({
  grid: {
    left: '0',
    right: '0',
    bottom: '20%',
    top: '12%'
  },
  xAxis: {
    type: 'category',
    data: ['待发货订单', '待回复客服', '已滞销商品', '待退款订单', '排队中客户'],
    axisLine: {
      lineStyle: {
        color: 'white'
      }
    },
    axisLabel: {
      color: '#C7CCD0', // x轴颜色
      fontWeight: 'lighter',
      fontSize: '9',
      width: 30,
      lineHeight: 13,
      overflow: 'break'
    },
    axisTick: {
      show: false
    }
  },
  yAxis: [
    {
      show: false,
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    }
  ],
  series: {
    name: '系列一',
    type: 'bar',
    barWidth: '16',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#7523FD' },
          { offset: 1, color: '#356DFF' }
        ]
      },
      borderRadius: 2
    },
    label: {
      show: true,
      position: 'top',
      color: 'black',
      fontSize: 12
    },
    data: znzsSeries.value
  }
})

const animationList = ref<number[]>([])
const overviewPendingLen = ref(0)
const znzsIntroduce = ref<ZnzsIntroduce[]>([])
const numTop = ref('')

const fwtzList = ref<FwtzList[]>([])

const appStore = useAppStore()
const markData = oilGauge_line_option.value.series[2].markLine
const markPoint = oilGauge_line_option.value.series[2].markPoint

const switchMode = () => {
  // 判断是否为暗色模式
  const { wsCache } = useCache()
  if (wsCache.get(CACHE_KEY.IS_DARK)) {
    document.documentElement.style.setProperty('--tabs-item-color', 'white')
    znzs_option.value.series.label.show = false
    znzs_option.value.xAxis.axisLabel.color = 'white'
    znzs_option.value.xAxis.axisLine.lineStyle.color = '#1A2744'

    jyjyList.value.forEach((ele) => {
      ele.imgUrl = ele.blackImgUrl
    })

    oilGauge_line_option.value.color = ['#848C9B', '#3571FE']
    if (markData) {
      markData.data[0][1].label.rich.aa.color = 'white'
      markData.data[1][1].label.rich.aaa.color = 'white'
    }
    if (markPoint) {
      markPoint.data[0].label.color = 'white'
      markPoint.data[1].label.color = 'white'
    }
  } else {
    jyjyList.value.forEach((ele) => {
      ele.imgUrl = ele.whiteImgUrl
    })
  }
}

watch(
  () => appStore.isDark,
  (val) => {
    if (val) {
      document.documentElement.style.setProperty('--tabs-item-color', 'white')
      znzs_option.value.series.label.show = false
      znzs_option.value.xAxis.axisLabel.color = 'white'
      znzs_option.value.xAxis.axisLine.lineStyle.color = '#1A2744'
      jyjyList.value.forEach((ele) => {
        ele.imgUrl = ele.blackImgUrl
      })
      oilGauge_line_option.value.color = ['#848C9B', '#3571FE']
      if (markData) {
        markData.data[0][1].label.rich.aa.color = 'white'
        markData.data[1][1].label.rich.aaa.color = 'white'
      }
      if (markPoint) {
        markPoint.data[0].label.color = 'white'
        markPoint.data[1].label.color = 'white'
      }
      // 暗色
    } else {
      document.documentElement.style.setProperty('--tabs-item-color', 'rgb(100 108 154 / 60%)')
      znzs_option.value.series.label.show = true
      znzs_option.value.xAxis.axisLabel.color = '#C7CCD0'
      znzs_option.value.xAxis.axisLine.lineStyle.color = 'white'
      jyjyList.value.forEach((ele) => {
        ele.imgUrl = ele.whiteImgUrl
      })
      oilGauge_line_option.value.color = ['#F2F4F5', '#3571FE']
      if (markData) {
        markData.data[0][1].label.rich.aa.color = 'rgba(100, 108, 154, 0.6)'
        markData.data[1][1].label.rich.aaa.color = 'rgba(100, 108, 154, 0.6)'
      }
      if (markPoint) {
        markPoint.data[0].label.color = 'rgba(100, 108, 154, 0.6)'
        markPoint.data[1].label.color = 'rgba(100, 108, 154, 0.6)'
      }
    }
  }
)

const init = async () => {
  let oneres = await batchGetTableList(
    'example_overview_conversion,example_overview_merchant,example_overview_merchant_cou,example_overview_realtime_data,example_overview_intelligent_assistants,example_overview_pending,example_overview_service_notices'
  )

  conversion.value = oneres.example_overview_conversion.records[0]
  oilGaugeValue.value = oneres.example_overview_conversion.records[0].fwzfzhl
  merchantIntroduction.value = oneres.example_overview_merchant.records
  sjjysl.value = oneres.example_overview_merchant_cou.records[0].cou
  let realtimeData = oneres.example_overview_realtime_data.records[0]
  let intelligentAssistants = oneres.example_overview_intelligent_assistants.records[0]
  let overviewPending = oneres.example_overview_pending.records
  initConversion(realtimeData)
  initZnzs(intelligentAssistants)     
  numTop.value = '-' + overviewPending.length * 60 + 'px'
  for (let i = 1; i <= overviewPending.length; i++) {
    animationList.value.push(i)
  }
  animationList.value.reverse()
  if (overviewPending.length > 3) {
    overviewPendingLen.value = overviewPending.length - 3
  }
  znzsIntroduce.value = overviewPending.slice(0, 3)
  fwtzList.value = oneres.example_overview_service_notices.records

  let endres = await batchGetTableList(
    'example_overview_rulescenter,example_overview_productnews,example_overview_learningcenter'
  )
  let rulescenter = endres.example_overview_rulescenter.records
  let productnews = endres.example_overview_productnews.records
  let learningcenter = endres.example_overview_learningcenter.records
  rightList.value[0].content = rulescenter
  rightList.value[0].totalTitle = '共计' + rulescenter.length + '条信息'
  rightList.value[1].content = productnews
  rightList.value[1].totalTitle = '共计' + productnews.length + '条信息'
  rightList.value[2].content = learningcenter
  rightList.value[2].totalTitle = '共计' + learningcenter.length + '条信息'
}

onMounted(() => {
  switchMode()
  init()
})
</script>

<style lang="scss" scoped>
@keyframes slideBorder {
  from {
    width: 0;
    transform: translateX(-100%);
  }

  to {
    width: 15px;
    transform: translateX(-50%);
  }
}

@keyframes znzsHoverAnimation {
  from {
    top: 0;
  }

  to {
    top: v-bind('numTop');
  }
}

@keyframes znzsNotHoverAnimation {
  from {
    top: -700px;
  }

  to {
    top: 0;
  }
}

@keyframes znzsBgHoverAnimation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.pointer {
  cursor: pointer;
}

.big-radius {
  border-radius: 15px;
}

.small-radius {
  border-radius: 7px;
}

.nowrap {
  white-space: nowrap;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  margin: 0;
  line-height: 150px;
  color: #475669;
  text-align: center;
  opacity: 0.75;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.text-white {
  color: white;
}

.arrow-top {
  width: 14px;
  height: 14px;
  background-color: #f2637b;
  border-radius: 5px;
  align-items: self-end;

  .el-icon {
    transform: scale(0.8);
  }
}

.arrow-bottom {
  width: 14px;
  height: 14px;
  background-color: #1dc9b7;
  border-radius: 5px;

  .el-icon {
    transform: scale(0.8);
  }
}

.active-conversion {
  position: relative;
  font-weight: bold;
  color: rgb(51 112 255);

  &::before {
    position: absolute;
    bottom: -5px;
    left: 50%;
    height: 2px;
    background-color: #3370ff;
    content: '';
    animation: slideBorder 0.3s forwards;
  }
}

.oilGauge_line {
  position: relative;
  width: calc(55% - 11px);
  border-left: 1px solid #e6ebf2;

  .oilGauge_line_echart {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}

.div_to_ul {
  position: relative;

  span:hover {
    color: rgb(88 103 221);
  }

  &::before {
    position: absolute;
    top: 50%;
    left: -12px;
    width: 5px;
    height: 5px;
    background-color: black;
    border-radius: 50%;
    content: '';
    transform: translate(0, -50%);
  }
}

.blue_box_shadow {
  box-shadow: 0 3px 20px rgb(51 112 255 / 29.8%);
}

.animation-box {
  position: relative;

  .znzs-one {
    border-radius: 50%;

    &.hover {
      animation: znzsBgHoverAnimation 3s forwards;
    }
  }

  .znzs-two {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);

    &.hover {
      animation: znzsBgHoverAnimation 2s forwards;
    }
  }

  .znzs-three {
    position: absolute;
    top: 50%;
    left: 50%;
    background-image: url('http://oss.yckxt.com/chatgpt/upload/1/2024-10-11/1/u19654.png');
    background-size: 100%;
    border-radius: 50%;
    transform: translate(-50%, -50%);

    &.hover {
      animation: znzsBgHoverAnimation 1s forwards;
    }
  }

  .znzs-four {
    position: absolute;
    top: 50%;
    left: 50%;
    background-image: url('http://oss.yckxt.com/chatgpt/upload/1/2024-10-11/1/u19655_2.png');
    background-size: 100%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .znzs-xdcl {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .znzs-ck {
    position: absolute;
    top: 47%;
    left: 50%;
    overflow: hidden;
    transform: translate(-50%, -50%);

    .znzs-sz {
      position: absolute;
      top: 0;
      left: 0;

      &:hover {
        animation: znzsHoverAnimation 0.5s forwards;
      }
    }

    .znzs-sz.nothover {
      animation: znzsNotHoverAnimation 0.5s forwards;
    }
  }
}

.znzs-tabs {
  position: relative;

  .tabs-position-icon {
    position: absolute;
    top: 22px;
    right: 0;
    transform: translate(-50%, -50%);
  }
}

::v-deep(.el-tabs) {
  .el-tabs__header {
    margin-bottom: 0;

    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        .el-tabs__active-bar {
          background-color: #3370ff;
          transform: translateX(5px);
        }

        .el-tabs__item {
          $tabsItemColor: var(--tabs-item-color, rgb(100 108 154 / 60%));

          padding: 0 5px;
          font-size: 13px;
          color: $tabsItemColor;

          &:hover {
            color: rgb(51 112 255);
          }

          &.is-active {
            font-weight: bold;
            color: #3370ff;
          }
        }
      }

      &::after {
        height: 0;
        // color:#326ffd13
      }
    }
  }
}
</style>

<template>
  <div class="w-100%">
    <div class="w-100% flex gap-x-20px">
      <div class="el-card top-card">
        <div class="card-box">
          <div class="text text-gray-500">月销售金额(元)</div>
          <Icon color="#bdbdbd" class="cursor-pointer" icon="quill:warning-alt" />
        </div>
        <span class="text-value">
          <avue-count-up :end="topList?.yxsje.value"></avue-count-up>
        </span>
        <div class="card-box mt-20px">
          <div class="text">
            <span class="mr-5px text-gray-500">周同比</span>
            <Icon
              v-if="topList?.yxsje.ztbType == 'top'"
              :size="12"
              color="#F56C6C"
              icon="ep:caret-top"
            ></Icon>
            <Icon
              v-else-if="topList?.yxsje.ztbType == 'bottom'"
              :size="12"
              color="#19BE6B"
              icon="ep:caret-bottom"
            ></Icon>
            <span>{{ topList?.yxsje.ztb }}</span>
          </div>
          <div class="text">
            <span class="mr-5px text-gray-500">日环比</span>
            <Icon
              v-if="topList?.yxsje.rhbType == 'top'"
              :size="12"
              color="#F56C6C"
              icon="ep:caret-top"
            ></Icon>
            <Icon
              v-else-if="topList?.yxsje.rhbType == 'bottom'"
              :size="12"
              color="#19BE6B"
              icon="ep:caret-bottom"
            ></Icon>
            <span>{{ topList?.yxsje.rhb }}</span>
          </div>
        </div>
      </div>
      <div class="el-card top-card">
        <div class="card-box">
          <div class="text text-gray-500">月回款金额(元)</div>
          <Icon color="#bdbdbd" class="cursor-pointer" icon="quill:warning-alt" />
        </div>
        <span class="text-value">
          <avue-count-up :end="topList?.yhkje.value"></avue-count-up>
        </span>
        <div class="card-box w-[calc(100%+20px)]! ml--10px">
          <div class="pos-relative w-100%">
            <Echart
              class="w-100% mt-10px pos-absolute left-0 top--30px"
              :options="returned_money_option"
              width="100%"
              height="60px"
            />
          </div>
        </div>
      </div>
      <div class="el-card top-card">
        <div class="card-box">
          <div class="text text-gray-500">本月成交订单</div>
          <Icon color="#bdbdbd" class="cursor-pointer" icon="quill:warning-alt" />
        </div>
        <span class="text-value">
          <avue-count-up :end="topList?.bycjdd.value"></avue-count-up>
        </span>
        <div class="card-box w-[calc(100%+20px)]! ml--10px">
          <div class="pos-relative w-100%">
            <Echart
              class="w-100% mt-10px pos-absolute left-0 top--30px"
              :options="submit_order_option"
              width="100%"
              height="60px"
            />
          </div>
        </div>
      </div>
      <div class="el-card top-card pos-relative">
        <div class="card-box">
          <div class="text text-gray-500">完成销售目标</div>
          <Icon class="cursor-pointer" color="#bdbdbd" icon="quill:warning-alt" />
        </div>
        <div class="text-value">{{ topList?.wcxsmb.value }}%</div>
        <div class="pos-absolute right-30px top-50px">
          <el-progress
            type="circle"
            :percentage="completeValue"
            :stroke-width="9"
            :width="60"
            :show-text="false"
            :indeterminate="true"
          ></el-progress>
        </div>
      </div>
      <div class="el-card top-card">
        <div class="card-box">
          <div class="text text-gray-500">回款达成率</div>
          <Icon color="#bdbdbd" class="cursor-pointer" icon="quill:warning-alt" />
        </div>
        <div class="text-value mb-30px!">{{ topList?.hkdcl.value }}%</div>
        <el-progress
          :percentage="returnedValue"
          :stroke-width="9"
          :show-text="false"
          class="jdt"
        ></el-progress>
      </div>
    </div>
    <div class="w-100% flex gap-x-20px">
      <div class="flex-grow-3 flex-shrink flex-basis-0">
        <el-card header="数据简报">
          <div class="data-bulletin grid grid-cols-4 gap-y-4 text-center py-10px">
            <template v-for="(item, index) in dataBulletin" :key="index">
              <div class="p-14px">
                <div class="text-gray-500 text-14px">{{ item.label }}</div>
                <div class="text-28px fw-bold c-#666 dark:c-[var(--el-text-color-primary)]">
                  <avue-count-up :end="item.value"></avue-count-up>
                </div>
                <div :style="{ color: item.type == 'pos' ? '#19BE6B' : '#F56C6C' }"
                  >{{ item.type == 'pos' ? '+' : '-' }}{{ item.percent }}</div
                >
              </div>
            </template>
          </div>
        </el-card>
        <el-card header="业绩目标">
          <Echart :options="target_bar_option" width="100%" height="350px" />
        </el-card>
        <el-card header="销售预测">
          <Echart :options="forecast_bar_option" width="100%" height="350px" />
        </el-card>
        <el-card header="销售漏斗">
          <div id="forecast-funnel-chart" class="w-100% h-350px"></div>
        </el-card>
      </div>
      <div class="flex-grow-2 flex-shrink flex-basis-0">
        <el-card header="销售排名">
          <div class="ranking-box">
            <div class="flex items-center gap-x-10px text-left text-12px c-#999 px-14px mb-10px">
              <div v-for="(item, index) in rankingTopList" :key="index" :class="item.width">{{
                item.label
              }}</div>
            </div>
            <template v-for="(item, index) in rankingList" :key="index">
              <div
                class="flex items-center gap-x-10px text-left text-12px c-#666 p-14px b-0 b-b-1px b-[var(--el-card-border-color)] b-solid"
              >
                <div class="w-10% text-left">
                  <div
                    class="w-23px h-23px text-center line-height-23px bg-#ccc border-rd-4px c-#fff"
                    :style="index < 3 ? { background: '#ff9900' } : ''"
                    >{{ index + 1 }}</div
                  >
                </div>
                <div class="w-20%">{{ item.name }}</div>
                <div class="w-25%">{{ item.money }}</div>
                <div class="w-45%">
                  <el-progress
                    :percentage="item.percent"
                    :stroke-width="8"
                    :color="rankingColor[index] || '#409EFF'"
                  ></el-progress>
                </div>
              </div>
            </template>
          </div>
        </el-card>
        <el-card header="快捷菜单">
          <div class="fast-menu-box grid grid-cols-3 gap-y-20px c-#666 dark:c-#cfd3dc">
            <template v-for="(item, index) in fastMenuList" :key="index">
              <div
                class="flex justify-center items-center flex-col hover:bg-#f1f1f1 hover:b-#dedddd! hover:dark:bg-#1e1e1e cursor-pointer"
              >
                <div class="h-70px w-70px flex justify-center items-center">
                  <Icon :icon="item.icon" :size="item.size"></Icon>
                </div>
                <div class="mt-4px text-12px">{{ item.label }}</div>
              </div>
            </template>
          </div>
        </el-card>
        <el-card header="系统通知">
          <div class="notifier-box">
            <template v-for="(item, index) in notifierList" :key="index">
              <div class="flex items-center py-12px px-10px">
                <div class="bg-#F56C6C w-4px h-4px border-rd-50% flex-shrink-0"></div>
                <div class="text-14px flex-1 ml-5px mr-20px">{{ item.label }}</div>
                <div class="text-gray-500 text-12px flex-shrink-0">{{ item.time }}</div>
              </div>
            </template>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { batchGetTableList } from '@/api/design/report'

defineOptions({ name: 'Home4' })

interface TopList {
  bycjdd: {
    data: number[]
    value: string
  }
  hkdcl: {
    value: number
  }
  wcxsmb: {
    value: number
  }
  yhkje: {
    data: number[]
    value: string
  }
  yxsje: {
    value: string
    rhb: string
    rhbType: string
    ztb: string
    ztbType: string
  }
}
interface DataBulletin {
  label: string
  dictionary: string
  value?: string
  percent?: string
  type?: string
}
interface RankingList {
  name: string
  money: string
  percent: number
}
interface RankingTopList {
  label: string
  width: string
}
interface SalesTarget {
  cjje: string
  date: string
  mbje: string
}
interface SalesForecast {
  yjxsje: string
  date: string
  glje: string
}
interface SalesFunnelgraphic {
  dictionary: string
  name: string
  value?: number
}
interface NotifierList {
  label: string
  time: string
}

let topList = ref<TopList>()

let returned_money_option = ref({
  grid: { bottom: '60%', containLabel: false },
  xAxis: {
    show: false,
    type: 'category',
    boundaryGap: false
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      data: topList.value?.yhkje.data,
      type: 'line',
      symbol: 'none',
      smooth: true,
      areaStyle: {
        color: '#FF7A8C'
      },
      lineStyle: {
        color: '#FF7A8C'
      }
    }
  ]
})
const submit_order_option = ref({
  grid: { bottom: '60%', containLabel: false },
  xAxis: {
    show: false,
    type: 'category'
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      data: topList.value?.bycjdd.data,
      type: 'bar',
      itemStyle: {
        color: '#52C1F5'
      }
    }
  ]
})
const completeValue = ref(0)
const returnedValue = ref(0)

const dataBulletin = ref<DataBulletin[]>([
  { label: '新增客户', dictionary: 'xzkh' },
  { label: '新增线索', dictionary: 'xzxs' },
  { label: '新增商机', dictionary: 'xzsj' },
  { label: '新增订单', dictionary: 'xzdd' },
  { label: '新增联系人', dictionary: 'xnlxr' },
  { label: '跟进次数', dictionary: 'gjcs' },
  { label: '处理任务', dictionary: 'clrw' },
  { label: '处理工单', dictionary: 'clgd' }
])

const salesTarget = ref<SalesTarget[]>()
let salesTargetXAxis = ref<string[]>([])
let salesTargetSeries1 = ref<string[]>([])
let salesTargetSeries2 = ref<string[]>([])
const target_bar_option = ref({
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  tooltip: { trigger: 'item' },
  legend: { data: ['目标金额', '成交金额'] },
  xAxis: {
    data: salesTargetXAxis.value
  },
  yAxis: {},
  series: [
    {
      name: '目标金额',
      type: 'bar',
      data: salesTargetSeries1.value,
      color: '#6CCAF6'
    },
    {
      name: '成交金额',
      type: 'bar',
      data: salesTargetSeries2.value,
      color: '#93D99A'
    }
  ]
})

const salesForecast = ref<SalesForecast[]>()
let salesForecastXAxis = ref<string[]>([])
let salesForecastSeries1 = ref<string[]>([])
let salesForecastSeries2 = ref<string[]>([])
const forecast_bar_option = ref({
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  tooltip: { trigger: 'item' },
  legend: { data: ['预计销售金额', '概率金额'] },
  xAxis: {
    data: salesForecastXAxis.value
  },
  yAxis: {},
  series: [
    {
      name: '预计销售金额',
      type: 'bar',
      data: salesForecastSeries1.value,
      color: '#FF8E9D'
    },
    {
      name: '概率金额',
      type: 'bar',
      data: salesForecastSeries2.value,
      color: '#88AEFB'
    }
  ]
})

const salesFunnelgraphic = ref<SalesFunnelgraphic[]>([
  { name: '初步洽谈', dictionary: 'cbqt' },
  { name: '深入沟通', dictionary: 'srgt' },
  { name: '产品报价', dictionary: 'cpbj' },
  { name: '成交商机', dictionary: 'cjsj' },
  { name: '流失商机', dictionary: 'lssj' }
])
const forecast_funnel_option = ref({
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Funnel',
      type: 'funnel',
      width: '90%',
      height: '100%',
      left: '5%',
      top: '3%',
      label: {
        position: 'right'
      },
      data: salesFunnelgraphic.value
    }
  ]
})

const rankingColor = ref(['#FB6260', '#FFA94C', '#4BCED0'])

const rankingTopList = ref<RankingTopList[]>([
  {
    label: '排名',
    width: 'w-10%'
  },
  {
    label: '姓名',
    width: 'w-20%'
  },
  {
    label: '销售金额',
    width: 'w-25%'
  },
  {
    label: '完成目标',
    width: 'w-45%'
  }
])
const rankingList = ref<RankingList[]>()

const fastMenuList = ref([
  { label: '客户管理', size: 65, icon: 'la:user-tie' },
  { label: '线索管理', size: 55, icon: 'akar-icons:light-bulb' },
  { label: '商机管理', size: 55, icon: 'hugeicons:money-add-01' },
  { label: '联系人管理', size: 45, icon: 'uiw:user' },
  { label: '写新跟进', size: 55, icon: 'ph:pen' },
  { label: '回款管理', size: 55, icon: 'fluent:calendar-reply-32-light' },
  { label: '发票管理', size: 55, icon: 'hugeicons:invoice-01' },
  { label: '费用管理', size: 50, icon: 'teenyicons:cost-estimate-outline' },
  { label: '报销管理', size: 55, icon: 'hugeicons:money-bag-02' },
  { label: '工作报告', size: 55, icon: 'line-md:document-report' },
  { label: '工单管理', size: 60, icon: 'material-symbols-light:order-approve-outline-sharp' },
  { label: '产品管理', size: 55, icon: 'fluent-mdl2:product' }
])

const notifierList = ref<NotifierList[]>()

const init = async () => {
  let oneres = await batchGetTableList(
    'example_client_month_data,example_client_data_briefs,example_client_salesman_rank,example_client_sales_target'
  )

  topList.value = oneres.example_client_month_data.records[0]
  returned_money_option.value.series[0].data = topList.value?.yhkje.data
  submit_order_option.value.series[0].data = topList.value?.bycjdd.data
  completeValue.value = topList.value?.wcxsmb.value || 0
  returnedValue.value = topList.value?.hkdcl.value || 0
  dataBulletin.value = dataBulletin.value.map((item) => {
    return (item = {
      ...item,
      ...oneres.example_client_data_briefs.records[0][item.dictionary]
    })
  })
  rankingList.value = oneres.example_client_salesman_rank.records
  salesTarget.value = oneres.example_client_sales_target.records
  salesTarget.value?.forEach((ele) => {
    salesTargetXAxis.value.push(ele.date)
    salesTargetSeries1.value.push(ele.mbje)
    salesTargetSeries2.value.push(ele.cjje)
  })
  target_bar_option.value.xAxis.data = salesTargetXAxis.value
  target_bar_option.value.series[0].data = salesTargetSeries1.value
  target_bar_option.value.series[1].data = salesTargetSeries2.value

  let endres = await batchGetTableList(
    'example_client_sales_forecast,example_client_sales_funnelgraphic,example_client_system_notification'
  )
  salesForecast.value = endres.example_client_sales_forecast.records
  salesForecast.value?.forEach((ele) => {
    salesForecastXAxis.value.push(ele.date)
    salesForecastSeries1.value.push(ele.yjxsje)
    salesForecastSeries2.value.push(ele.glje)
  })
  forecast_bar_option.value.xAxis.data = salesForecastXAxis.value
  forecast_bar_option.value.series[0].data = salesForecastSeries1.value
  forecast_bar_option.value.series[1].data = salesForecastSeries2.value

  salesFunnelgraphic.value = salesFunnelgraphic.value.map((item) => {
    return (item = {
      ...item,
      value: endres.example_client_sales_funnelgraphic.records[0][item.dictionary]
    })
  })
  forecast_funnel_option.value.series[0].data = salesFunnelgraphic.value
  notifierList.value = endres.example_client_system_notification.records
}

onMounted(async () => {
  await init()
  let xsldId = document.getElementById('forecast-funnel-chart')
  if (xsldId) {
    let forecastFunnelChart = echarts.init(xsldId)
    forecastFunnelChart.setOption(forecast_funnel_option.value)
  }

  const timer_1 = setInterval(() => {
    completeValue.value = completeValue.value + 10
    if (completeValue.value >= 75) {
      completeValue.value = 75
      clearInterval(timer_1)
    }
  }, 20)
  const timer_2 = setInterval(() => {
    returnedValue.value = returnedValue.value + 10
    if (returnedValue.value >= 80) {
      returnedValue.value = 80
      clearInterval(timer_2)
    }
  }, 20)
})
</script>

<style lang="scss" scoped>
.top-card {
  position: relative;
  padding: 15px;
  margin-top: 0 !important;
  border-radius: 10px;
  box-shadow: var(--el-box-shadow-light);
  flex: 1;

  .card-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    .text-value {
      margin-bottom: 15px;
      font-size: 30px;
      font-weight: 700;
    }
  }

  .text-value {
    margin-bottom: 15px;
    font-size: 28px;
    font-weight: bold;
  }
}

::v-deep(.el-card) {
  margin-top: 20px;
  border-radius: 8px;

  .el-card__header {
    font-weight: bold;
  }

  .el-card__body {
    .data-bulletin {
      & > div {
        border-right: 1px solid var(--el-card-border-color);

        &:nth-child(4n) {
          border-right: none;
        }
      }
    }

    .ranking-box {
      .el-progress__text {
        font-size: 12px !important;
      }
    }

    .fast-menu-box > div {
      padding: 10px 0;
      border: 1px solid transparent;
    }

    .notifier-box > div {
      border-bottom: 1px solid var(--el-card-border-color);
    }

    .notifier-box > div:nth-child(1) {
      padding-top: 0;
    }
  }
}
</style>

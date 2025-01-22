<template>
  <div class="w-100%">
    <div class="box">
      <div class="box-left">
        <div class="top .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <p class="title .dark:c-#fff!">我的待办</p>
          <div class="top-content">
            <div class="top-content-box" v-for="(item, index) in data" :key="index">
              <img :src="item.img" alt="" />
              <div style="margin-left: 15px">
                <p class="text .dark:c-#fff!" style="font-size: 28px">{{ item.num }}</p>
                <p class="text font .dark:c-#ccc!">{{ item.title }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="center .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <p class="title .dark:c-#fff!">常用功能</p>
          <div class="center-box">
            <div class="content-box" v-for="(item, index) in cygnData" :key="index">
              <div class="img" :class="'bj' + index">
                <img :src="item.src" alt="" />
              </div>
              <div class="font .dark:c-#fff!" style="margin-top: 15px">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <div class="bottom .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <div class="bottom-top">
            <p class="bottom-top-title .dark:c-#fff!">业务处理</p>
            <el-menu
              :default-active="cwclType"
              :ellipsis="false"
              mode="horizontal"
              @select="handleSelect"
              style="padding: 0 !important; margin: 0 !important"
            >
              <el-menu-item v-for="item in cwclTypeList" :key="item.type" :index="item.type">{{
                item.name
              }}</el-menu-item>
            </el-menu>
          </div>
          <el-table
            class="custom-row-gap"
            :data="cwclTableData"
            style="width: 100%"
            :header-cell-style="{
              height: '50px',
              fontFamily: `'微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important`,
              fontWeight: ' 700 !important',
              color: '#666666 !important'
            }"
            :cell-style="{
              height: '44.2px',
              fontFamily: `'微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important`,
              fontWeight: ' 400 !important',
              color: '#666666 !important'
            }"
          >
            <el-table-column prop="tjsj" label="提交时间" width="170" />
            <el-table-column prop="bxlx" label="报销类型" width="140" />
            <el-table-column prop="spdh" label="审批单号" width="140" />
            <el-table-column prop="bxje" label="报销金额" width="140" />
            <el-table-column prop="spdx" label="审批对象" width="140" />
            <el-table-column fixed="right" label="操作" min-width="120" align="center">
              <template #default>
                <el-button link type="primary" size="small" @click="handleClick">
                  <Icon
                    icon="icon-park-solid:right-c"
                    width="12"
                    height="12"
                    style="color: #2391ff"
                  />
                  <span style="margin-left: 5px; font-size: 14px">查看详情</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="box-right">
        <div class="box-right-top .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <div class="title .dark:c-#fff!">预警信息</div>
          <div class="list" v-for="(item, index) in yjxxdata" :key="index">
            <span class="list-left .dark:c-#ccc!">{{ item.name }}</span>
            <span class="list-right" :class="index % 2 == 0 ? 'text-color' : ''">{{
              item.num
            }}</span>
          </div>
        </div>
        <div class="box-right-center .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <div style="display: flex; justify-content: space-between">
            <div class="title .dark:c-#fff!"> 年度经营目标</div>
            <div class="title" style="font-size: 24px; color: #279df5">
              <span class="fontFamily .dark:c-#fff!">{{ annualIndicators1?.ndjymb }}</span>
              <span style="font-size: 14px; color: #666" class=".dark:c-#ccc!"> 万 </span>
            </div>
          </div>
          <div class="ndmb">
            <el-progress
              type="circle"
              :percentage="annualIndicators1?.wcl"
              :stroke-width="16"
              :width="166"
            >
              <template #default>
                <span class="percentage-label .dark:c-#ccc!" style="color: #20a0ff"> 完成率 </span>
                <span class="percentage-value" style="color: #20a0ff">
                  {{ annualIndicators1?.wcl }}%
                </span>
              </template>
            </el-progress>
          </div>
          <div class="text .dark:c-#ccc!">
            已完成目标：
            <span class="fontFamily" style="font-size: 24px; font-weight: 700; color: #fbaf4f">
              {{ annualIndicators1?.ywcmb }}
            </span>
            万
          </div>
        </div>
        <div class="box-right-center .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <div style="display: flex; justify-content: space-between">
            <div class="title .dark:c-#fff!">年度回款目标</div>
            <div class="title" style="font-size: 24px; color: #279df5">
              <span class="fontFamily .dark:c-#fff!">{{ annualIndicators2?.ndhkmb }}</span>
              <span style="font-size: 14px; color: #666" class=".dark:c-#ccc!"> 万</span>
            </div>
          </div>
          <div class="ndmb">
            <el-progress
              type="circle"
              :percentage="annualIndicators2?.wcl"
              :stroke-width="16"
              status="success"
              :width="166"
            >
              <template #default>
                <span class="percentage-label .dark:c-#ccc!">完成率</span>
                <span class="percentage-value">{{ annualIndicators2?.wcl }}%</span>
              </template>
            </el-progress>
          </div>
          <div class="text .dark:c-#ccc!">
            已完成目标
            <span class="fontFamily" style="font-size: 24px; font-weight: 700; color: #fbaf4f">
              {{ annualIndicators2?.ywcmb }}
            </span>
            万
          </div>
        </div>
      </div>
    </div>
    <div class="w-100% eCharts">
      <div class="eCharts-left .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <div class="eCharts-left-top">
          <div class="title .dark:c-#fff!">账户余额</div>
          <div class="font .dark:c-#ccc!">
            <span>合计：</span>
            <span
              class="fontFamily .dark:c-#fff!"
              style="font-size: 20px; font-weight: 700; color: #2b9ef7"
              >{{ zhyeNum }}</span
            >
            <span style="margin-left: 5px">万</span>
          </div>
        </div>
        <div>
          <div
            style="display: flex; align-items: center; line-height: 50px"
            v-for="(item, index) in zhyedata"
            :key="index"
          >
            <div class="font-title .dark:c-#ccc!" style="width: 17%">{{ item.name }}</div>
            <div style="width: 79%">
              <el-progress :percentage="item.jdt" :stroke-width="10">
                <span
                  style="
                    margin-left: 30px;
                    font-family: ArialMT, Arial, sans-serif;
                    font-size: 16px;
                  "
                  >{{ item.num }}</span
                >
              </el-progress>
            </div>
          </div>
        </div>
      </div>
      <div class="eCharts-right .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <div class="eCharts-right-top">
          <div class="title .dark:c-#fff!">收支预测</div>
        </div>
        <div id="szycMain" style="width: 600px; height: 300px"></div>
      </div>
    </div>
    <div class="w-100% eCharts">
      <div class="eCharts-left .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <div class="eCharts-left-top">
          <div class="title .dark:c-#fff!">费用结构</div>
        </div>
        <div id="fyjgMain" style="width: 600px; height: 300px"></div>
      </div>
      <div class="eCharts-right .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <div class="eCharts-right-top">
          <div class="title .dark:c-#fff!">收入结构</div>
        </div>
        <div id="srjgMain" style="width: 600px; height: 300px"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { getTableList, batchGetTableList } from '@/api/design/report'
import { ElMessage } from 'element-plus'

interface Data {
  dictionary: string
  img: string
  title: string
  num?: string
}
interface CwclTableData {
  tjsj: string
  bxlx: string
  spdh: string
  bxje: string
  spdx: string
}

interface Yjxxdata {
  dictionary: string
  name: string
  num?: string
}
interface CircularProgress {
  ndjymb: number
  wcl: number
  ywcmb: number
  ndhkmb: number
}
interface Zhyedata {
  name: string
  num: number
  jdt: number
}
type Szyc = [[string, string | number, string | number]]

//我的待办
let data = ref<Data[]>([
  { dictionary: 'dclgd', img: '/img/img1.svg', title: '待处理工单' },
  { dictionary: 'dbxmx', img: '/img/img2.svg', title: '待报销明细' },
  { dictionary: 'dtjhb', img: '/img/img3.svg', title: '待提交汇报' },
  { dictionary: 'dtjbb', img: '/img/img4.svg', title: '待提交报表' }
])

//常用功能
const cygnData = reactive([
  { src: '/img/tb1.svg', title: '资金收支报表' },
  { src: '/img/tb2.svg', title: '资产负债报表' },
  { src: '/img/tb3.svg', title: '企业利润报表' },
  { src: '/img/tb4.svg', title: '现金流量报表' },
  { src: '/img/tb5.svg', title: '项目报告列表' },
  { src: '/img/tb6.svg', title: '责任中心报告' }
])

//预警信息
let yjxxdata = ref<Yjxxdata[]>([
  {
    dictionary: 'dqysk',
    name: '到期应收款'
  },
  {
    dictionary: 'yqysk',
    name: '逾期应收款'
  },
  {
    dictionary: 'dqyfk',
    name: '到期应付款'
  },
  {
    dictionary: 'yqyfk',
    name: '逾期应付款'
  }
])

// 年度经营目标
const annualIndicators1 = ref<CircularProgress>()

// 年度回款目标
const annualIndicators2 = ref<CircularProgress>()

//账户余额
const zhyeNum = ref('')
let zhyedata = ref<Zhyedata[]>()

//收支预测
const szycDataset = ref<Szyc>([['product', '预计收入', '预计支出']])
const szycOption = reactive({
  legend: {
    // data: ['系列1', '系列2'],
    orient: 'horizontal',
    x: 'center', // 可以是 'center'、'left'、'right' 等
    y: 'bottom' // 可以是 'top'、'center'、'bottom' 等，或者是具体的像素值
  },
  tooltip: {},
  dataset: {
    source: szycDataset.value
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false // 设置X轴不显示刻度
    }
  },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [
    {
      type: 'bar',
      itemStyle: {
        // 设置柱形图的颜色
        color: '#2c9ef7'
      }
    },
    {
      type: 'bar',
      itemStyle: {
        // 设置柱形图的颜色
        color: '#0dd78d'
      }
    }
  ]
})

//费用结构
const fyjgOption = reactive({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    top: 'bottom',
    icon: 'circle'
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '58%',
      center: ['50%', '40%'],
      color: ['#2c9ef7', '#aa89fe', '#fdad4e', '#0dd78d'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        normal: {
          formatter: '{b}\n\n¥{c}',
          textStyle: {
            color: '#999999',
            fontSize: 12
          }
        }
      }
    }
  ]
})

//收入结构
const srjgOption = reactive({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    top: 'bottom',
    icon: 'circle'
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '40%'],
      color: ['#2c9ef7', '#5cb9ff', '#abdbff', '#d0ebff'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        normal: {
          formatter: '{b}\n \n ¥{c}',
          textStyle: {
            color: '#999999',
            fontSize: 12
          }
        }
      }
    }
  ]
})

// 业务处理
const cwclType = ref('1')
const cwclTableData = ref<CwclTableData[]>()
const cwclTypeList = ref([
  { name: '待我审批', type: '1' },
  { name: '超期待审', type: '2' },
  { name: '我提交的', type: '3' },
  { name: '被退回的', type: '4' }
])

const handleSelect = async (key: string, keyPath: string[]) => {
  let res = await getTableList('example_systemmonitor_business_processing', { type: key })
  cwclTableData.value = res.records
}
const handleClick = () => {
  ElMessage({
    message: '查看详情',
    type: 'success'
  })
}

// 通用函数，用于初始化 ECharts 图表
const initEcharts = (domElementId, option) => {
  const domElement = document.getElementById(domElementId)
  if (domElement) {
    const chart = echarts.init(domElement)
    domElement.removeAttribute('_echarts_instance_')
    chart.setOption(option)
  }
}

const echartFun = () => {
  initEcharts('szycMain', szycOption)
  initEcharts('fyjgMain', fyjgOption)
  initEcharts('srjgMain', srjgOption)
}

const init = async () => {
  let oneres = await batchGetTableList(
    'example_signagetwo_pending,example_systemmonitor_business_processing,example_systemmonitor_warning_messages,example_systemmonitor_business_target'
  )
  let signagetwoPending = oneres.example_signagetwo_pending.records[0]
  let businessProcessing = oneres.example_systemmonitor_business_processing.records
  let warningMessages = oneres.example_systemmonitor_warning_messages.records[0]
  let businessTarget = oneres.example_systemmonitor_business_target.records[0]
  data.value = data.value.map((item) => {
    return (item = {
      ...item,
      num: signagetwoPending[item.dictionary]
    })
  })
  cwclTableData.value = businessProcessing
  yjxxdata.value = yjxxdata.value.map((item) => {
    return (item = {
      ...item,
      num: warningMessages[item.dictionary]
    })
  })
  annualIndicators1.value = businessTarget

  let endres = await batchGetTableList(
    'example_systemmonitor_payback_target,example_systemmonitor_account_balance,example_systemmonitor_Income_expenditure_forecasts,example_systemmonitor_fee_structure,example_systemmonitor_Income_structure'
  )

  let paybackTarget = endres.example_systemmonitor_payback_target.records[0]
  let accountBalance = endres.example_systemmonitor_account_balance.records
  let expenditureForecasts = endres.example_systemmonitor_Income_expenditure_forecasts.records
  let feeStructure = endres.example_systemmonitor_fee_structure.records
  let incomestructure = endres.example_systemmonitor_Income_structure.records
  annualIndicators2.value = paybackTarget
  zhyedata.value = accountBalance
  zhyeNum.value = accountBalance.reduce((a, b) => {
    return a + b.num
  }, 0)
  expenditureForecasts.forEach((ele) => {
    szycDataset.value.push([ele.sj, ele.yjsr, ele.yjzc])
  })
  szycOption.dataset.source = szycDataset.value
  fyjgOption.series[0].data = feeStructure
  srjgOption.series[0].data = incomestructure
}

onMounted(async () => {
  await init()
  echartFun()
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  width: 100%;
  justify-content: space-between;

  p {
    padding: 0;
    margin: 0;
  }

  .box-left {
    width: 72.3%;
    // height: 300px;
    // background: red;

    .title {
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 16px;
      font-weight: 700;
      line-height: 60px;
      color: #333;
      text-align: left;
    }

    .top {
      padding: 0 20px 20px;
      background: #fff;
      border-radius: 5px;

      .text {
        font-family: 'Montserrat Bold', 'Montserrat Regular', Montserrat, sans-serif;
        font-weight: 700;
        color: #333;
      }

      .top-content {
        display: flex;
        justify-content: space-between;
        margin: 25px;

        .top-content-box {
          display: flex;
          justify-content: space-between;
          align-items: center;

          img {
            width: 48px;
            height: 48px;
          }
        }
      }
    }

    .center {
      padding: 0 20px 10px;
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;

      .center-box {
        display: flex;
        padding-bottom: 20px;
        margin-top: 10px;
        justify-content: space-evenly;

        .content-box {
          width: 100px;
          text-align: center;
          // background: red;

          .img {
            display: flex;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .bottom {
      padding: 0 20px;
      padding-bottom: 35px;
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;

      .bottom-top {
        display: flex;
        margin-bottom: 8px;
        justify-content: space-between;

        .bottom-top-title {
          height: 40px;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 52px;
          color: #333;
          text-align: left;
        }
      }
    }
  }

  .box-right {
    width: 26.3%;
    // height: 300px;
    // background: blue;

    .title {
      // margin-bottom: 20px;
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 60px;
      color: #333;
      text-align: left;
    }

    .box-right-top {
      padding: 0 20px 20px;
      background: #fff;
      border-radius: 5px;

      .list {
        display: flex;
        justify-content: space-between;
        // margin-bottom: 15px;
        line-height: 40px;

        .list-left {
          font-family: '微软雅黑', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          color: #666;
          text-align: left;
        }

        .list-right {
          font-family: 'Montserrat Bold', 'Montserrat Regular', Montserrat, sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          color: #0fd1b6;
          text-align: right;
        }
      }
    }

    .box-right-center {
      padding: 0 20px 20px;
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;

      .ndmb {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 10px;
      }

      .text {
        margin-top: 20px;
        font-family: '微软雅黑', sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        color: #797979;
        text-align: center;
      }
    }
  }
}

.eCharts {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  .title {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 60px;
    color: #333;
    text-align: left;
  }

  .eCharts-left {
    width: 46.1%;
    padding: 0 20px 20px;
    line-height: 60px;
    background: #fff;
    border-radius: 5px;

    .eCharts-left-top {
      display: flex;
      justify-content: space-between;
    }

    .eCharts-right-top {
      display: flex;
      justify-content: space-between;
    }
  }

  .eCharts-right {
    width: 46.1%;
    padding: 0 20px;
    background: #fff;
    border-radius: 5px;
  }
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-family: Arial-BoldMT, 'Arial Bold', Arial, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #13ce66;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-family: ArialMT, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #666 !important;
}

.el-menu--horizontal.el-menu {
  border: 0 !important;
}

.bj0 {
  background: #2c9ef7;
}

.bj1 {
  background: #b591f5;
}

.bj2 {
  background: #11d88f;
}

.bj3 {
  background: #ffad52;
}

.bj4 {
  background: #10d1b7;
}

.bj5 {
  background: #f67263;
}

.text-color {
  color: #f6716e !important;
}

.font {
  font-family: '微软雅黑', sans-serif !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #666;
}

.fontFamily {
  font-family: 'Montserrat Bold', 'Montserrat Regular', Montserrat, sans-serif !important;
}

.font-title {
  font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif !important;
  font-size: 14px !important;
  font-weight: 400;
  color: #666;
}

::v-deep .el-table--default .el-table__cell {
  padding: 0 !important; /* 根据需要调整这个值来增加或减少行间距 */
}
</style>

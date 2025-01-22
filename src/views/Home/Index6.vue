<template>
  <div class="w-100%">
    <div class="w-100% top-box">
      <div
        class="top-card bg-#fff .dark:bg-#1D1E1F! b-1px b-transparent .dark:b-#2A2B2C b-solid"
        v-for="(item, index) in topCardList"
        :class="item.border"
        :key="index"
      >
        <div class="card-box">
          <div class="title">{{ item.title }}</div>
          <Icon
            icon="akar-icons:info-fill"
            width="48"
            height="48"
            class="cursor-pointer"
            style="color: #bdbdbd"
          />
        </div>
        <span class="text-value .dark:c-#fff!">
          <span v-if="item.unit == '￥'">{{ item.unit }}</span>

          <avue-count-up :end="item.num"></avue-count-up>
          <span v-if="item.unit == '家'" class="text-dw">{{ item.unit }}</span>
        </span>
        <div class="card-box mt-10px">
          <div class="" style="display: flex; align-items: center; height: 12px">
            <span v-if="item.type == 'pos'" class="icon">
              <Icon icon="ep:top" width="12" height="12" style="color: #f56c6c" />
            </span>
            <span v-else-if="item.type == 'neg'" class="icons">
              <Icon icon="ep:bottom" width="12" height="12" style="color: #19be6b" />
            </span>
            <span
              class="text-ts"
              :class="item.type == 'pos' ? 'text-zeng' : item.type == 'neg' ? 'text-jian' : ''"
              >{{ item.percentage }}</span
            >
            <span class="mr-5px text"> {{ item.tendency }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
      <div class="content-left">
        <p class="content-title .dark:c-#fff!">商户外拓</p>
        <div class="jdt" v-for="(item, index) in jdtData" :key="index">
          <div class="jdt-top">
            <div style="display: flex; align-items: center" class="jdt-top-text">
              <span class="acitive" :class="'bj' + (index >= 3 ? 0 : index)"></span>
              {{ item.title }}
            </div>
            <div class=".dark:c-#fff!">
              <span class="num .dark:c-#fff!">{{ item.leftNum }}</span>
              <span class="num" style="font-size: 14px; font-weight: 400"
                >/{{ item.rightNum }}</span
              >
              <span class="jdt-top-text .dark:c-#fff!">{{ item.dw }}</span>
            </div>
          </div>
          <div class="jdt-bottom demo-progress">
            <el-progress
              :text-inside="true"
              :stroke-width="12"
              :percentage="item.jd"
              :status="item.type"
            />
          </div>
        </div>
      </div>
      <div class="content-center">
        <p class="content-title .dark:c-#fff!">商户分布</p>
        <div id="main" style="width: 380px; height: 300px"></div>
      </div>
      <div class="content-right">
        <p class="content-title .dark:c-#fff!">交易漏斗</p>
        <div id="ldMain" style="width: 380px; height: 280px"></div>
      </div>
    </div>
    <div class="eCharts">
      <div
        class="eCharts-left .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent .dark:c-#fff!"
      >
        <div class="eCharts-title .dark:c-#fff!">
          <p>日交易额</p>
          <p style="font-size: 14px" class="font">￥6,000,000</p>
        </div>
        <div id="zxtMain" style="width: 380px; height: 300px"></div>
      </div>
      <div class="eCharts-center .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <div class="eCharts-title .dark:c-#fff!">
          <p>周订单量</p>
          <p style="font-size: 16px" class="font">10,000<span class="fontFamily">单</span></p>
        </div>
        <div id="zddlMain" style="width: 380px; height: 300px"></div>
      </div>
      <div
        class="eCharts-right .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent"
        style="position: relative"
      >
        <div style="position: absolute">
          <div class="eCharts-title .dark:c-#fff! w-100%">
            <p>开拓商家</p>
            <p style="margin-left: 235px; font-size: 14px">1,000家</p>
          </div>
        </div>
        <div id="ktsjMain" style="width: 360px; height: 335px" class=".dark:c-#fff!"></div>
      </div>
    </div>
    <div class="eCharts-cjje .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
      <div class="cjje-top">
        <div class="cjje-top-left .dark:c-#fff!">成交金额趋势</div>
        <div class="cjje-top-right">
          <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
            <el-radio-button
              v-for="(item, index) in cjjeTabList"
              :key="index"
              :value="item.label"
              @change="clickCjje(item.type)"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div id="cjjeMain" style="width: 1400px; height: 300px"></div>
    </div>
    <div
      class="eCharts-cjje .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent"
      style="padding-top: 0"
    >
      <div class="cjje-top">
        <div class="cjje-top-left .dark:c-#fff!" style="height: 60px; line-height: 60px">
          成交金额趋势
        </div>
      </div>
      <div>
        <Table></Table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import Table from './components/table.vue'
import { getTableList, batchGetTableList } from '@/api/design/report'

defineOptions({ name: 'Home6' })

interface TopCardList {
  dictionary: string
  border: string
  tendency: string
  title: string
  unit: string
  type?: string
  num?: string
  percentage?: string
}

interface JdtData {
  dictionary: string
  title: string
  dw: string
  jd?: number
  type: any
  leftNum?: number
  rightNum?: number
}

interface OptionSeriesData {
  name: string
  value: number
}

type Ktsj = [string, string | number, string | number]

let topCardList = ref<TopCardList[]>([
  { title: '商户总数', dictionary: 'shzs', tendency: '环比上周', border: '', unit: '家' },
  { title: '开拓中商户', dictionary: 'ktzsh', tendency: '环比上周', border: '', unit: '家' },
  { title: '总访问量', dictionary: 'zfwl', tendency: '环比上周', border: '', unit: '' },
  { title: '总交易额', dictionary: 'zjye', tendency: '环比上周', border: '', unit: '￥' },
  { title: '总订单量', dictionary: 'zddl', tendency: '环比上周', border: '', unit: '' },
  { title: '客单价', dictionary: 'kdj', tendency: '环比上周', border: '', unit: '￥' }
])

const jdtData = ref<JdtData[]>([
  { title: '已计划', dictionary: 'yjh', dw: '家', type: '' },
  { title: '已完成', dictionary: 'ywc', dw: '家', type: 'exception' },
  { title: '开拓中', dictionary: 'ktz', dw: '家', type: 'warning' },
  { title: '洽谈中', dictionary: 'qtz', dw: '家', type: '' }
])

//环形图
let currentIndex = ref(0) // 当前高亮图形在饼图数据中的下标
const highlightPie = (option, myChart) => {
  // 遍历饼图数据，取消所有图形的高亮效果
  for (var idx in option) {
    myChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: idx
    })
  }
  // 高亮当前图形
  myChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: currentIndex.value
  })

}
// 饼图自动轮播
const handleChartLoop = (option, myChart) => {
  if (!myChart) {
    return
  }
  highlightPie(option, myChart)
  // 用户鼠标悬浮到某一图形时，高亮鼠标悬浮的图形
  myChart.on('mouseover', (params) => {
    currentIndex.value = params.dataIndex
    highlightPie(option, myChart)
  })
}
let optionSeriesData = ref<OptionSeriesData[]>([])
const option = reactive({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    left: 'right',
    orient: 'vertical',
    align: 'left',
    top: 'center',
    icon: 'circle',
    itemGap: 25,
    // 图例文本格式化
    formatter: function (name) {
      // 在这里可以获取到对应数据项的值
      var data = optionSeriesData.value
      for (var i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          return name + ' ' + data[i].value
        }
      }
      return name
    }
  },
  color: ['#50b5ff', '#ffc542', '#ff7474', '#50b5ff', '#8167f5'],
  series: [
    {
      type: 'pie',
      label: {
        show: false,
        position: 'center',
        formatter: '{d}%\n\n{b}',
        fontSize: 20
      },
      legendHoverLink: false,
      center: ['30%', '45%'],
      data: [],
      labelLine: {
        show: false // 关闭指示线
      },
      radius: ['48%', '70%'],
      emphasis: {
        label: {
          show: true
        }
      }
    }
  ]
})

//漏斗
const ldOption = reactive({
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    containLabel: true
  },
  series: [
    {
      name: '',
      type: 'funnel',
      left: '10%',
      top: 20,
      bottom: 60,
      width: '75%',
      min: 0,
      max: 50000,
      minSize: '30%',
      maxSize: '70%',
      sort: 'descending',
      gap: 0,
      color: ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16'],
      label: {
        show: true,
        position: 'inside',
        formatter: '{b} : {c}'
      },
      itemStyle: {
        borderWidth: 0
      },
      data: []
    }
  ]
})

//日交易额
let dailyTurnoverXAxis = ref<string[]>([])
let dailyTurnoverSeries = ref<number[]>([])
const zxtOption = reactive({
  grid: {
    top: '10%', // 调整顶部的空白间距，也可以使用像素值，例如 '50px'
    bottom: '20%'
  },
  xAxis: {
    type: 'category',
    data: dailyTurnoverXAxis.value,
    axisTick: {
      show: false // 设置X轴不显示刻度
    }
  },
  yAxis: {
    type: 'value',
    offset: -7,
    max: '50000',
    axisLabel: {
      textStyle: {
        fontSize: 12 // 增大字体大小
      }
    }
  },
  series: [
    {
      data: dailyTurnoverSeries.value,
      type: 'line',
      symbol: 'none',
      smooth: false, // 是否平滑曲线显示
      lineStyle: {
        color: '#51d351', // 折线颜色
        width: 2 // 折线宽度
      }
    }
  ]
})

// 周订单量
let weeklyOrdersXAxis = ref<string[]>([])
let weeklyOrdersSeries = ref<number[]>([])
const zddlOption = reactive({
  grid: {
    top: '10%', // 调整顶部的空白间距，也可以使用像素值，例如 '50px'
    bottom: '20%'
  },
  xAxis: {
    type: 'category',
    data: weeklyOrdersXAxis.value,
    axisTick: {
      show: false // 设置X轴不显示刻度
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: weeklyOrdersSeries.value,
      type: 'bar',
      barWidth: '35%',
      itemStyle: {
        // 设置柱形图的颜色
        color: '#409eff',
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
})

//开拓商家
let expansionNumberDataset = ref<Ktsj[]>([['product', '目标开拓数', '实际开拓数']])
const ktsjOption = reactive({
  theme: 'dark',
  grid: {
    top: '15%', // 调整顶部的空白间距，也可以使用像素值，例如 '50px'
    bottom: '20%'
  },
  legend: {
    icon: 'circle' // 设置图例标记为圆形
  },
  tooltip: {},
  dataset: {
    source: expansionNumberDataset.value
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
      barWidth: '20%',
      itemStyle: {
        // 设置柱形图的颜色
        color: '#52c1f5',
        borderRadius: [4, 4, 0, 0]
      }
    },
    {
      type: 'bar',
      barWidth: '20%',
      itemStyle: {
        // 设置柱形图的颜色
        color: '#ff7a8c',
        borderRadius: [5, 5, 0, 0]
      }
    }
  ]
})

//成交金额趋势
const tabPosition = ref('最近1周')
const cjjeTabList = ref([
  {
    label: '最近1周',
    type: 1
  },
  {
    label: '最近30天',
    type: 2
  },
  {
    label: '最近半年',
    type: 3
  },
  {
    label: '最近1年',
    type: 4
  }
])
let transactionAmountXAxis = ref<string[]>([])
let transactionAmountSeries1 = ref<string[]>([])
let transactionAmountSeries2 = ref<string[]>([])
const cjjeOption = ref({
  grid: {
    left: '4%',
    top: '5%', // 调整顶部的空白间距，也可以使用像素值，例如 '50px'
    bottom: '20%'
  },
  legend: {
    top: 'bottom',
    data: ['线上成交', '线下成交'],
    icon: 'rectangle'
  },
  xAxis: {
    data: transactionAmountXAxis.value
  },
  yAxis: {},
  series: [
    {
      name: '线上成交',
      data: transactionAmountSeries1.value,
      type: 'line',
      symbol: 'none',
      smooth: false,
      areaStyle: {
        color: '#b2e0ff',
        opacity: 0.8
      }
      // symbol: 'circle',
    },
    {
      name: '线下成交',
      data: transactionAmountSeries2.value,
      type: 'line',
      symbol: 'none',
      smooth: false,
      areaStyle: {
        color: '#ffd7dc',
        opacity: 0.8
      }
      // symbol: 'circle',
    }
  ]
})
const clickCjje = async (type) => {
  let res = await getTableList('example_trader_transaction_amount', { type: type })
  transactionAmountXAxis.value = []
  transactionAmountSeries1.value = []
  transactionAmountSeries2.value = []
  res.records.forEach((ele) => {
    transactionAmountXAxis.value.push(ele.sj)
    transactionAmountSeries1.value.push(ele.xscj)
    transactionAmountSeries2.value.push(ele.xxcj)
  })
  cjjeOption.value.xAxis.data = transactionAmountXAxis.value
  cjjeOption.value.series[0].data = transactionAmountSeries1.value
  cjjeOption.value.series[1].data = transactionAmountSeries2.value
  nextTick(() => {
    const cjjeChart = echarts.init(document.getElementById('cjjeMain'))
    cjjeChart.setOption(cjjeOption.value)
  })
}

// 通用函数，用于初始化 ECharts 图表
const initEcharts = (domElementId, option) => {
  const domElement = document.getElementById(domElementId)
  if (domElement) {
    const chart = echarts.init(domElement)
    domElement.removeAttribute('_echarts_instance_')
    chart.setOption(option)
    if (domElementId == 'main') {
      handleChartLoop(option.series[0].data, chart)
    }
  }
}

const echartFun = () => {
  initEcharts('ldMain', ldOption)
  initEcharts('zxtMain', zxtOption)
  initEcharts('zddlMain', zddlOption)
  initEcharts('ktsjMain', ktsjOption)
  initEcharts('main', option)
  initEcharts('cjjeMain', cjjeOption.value)
}

const init = async () => {
  let oneres = await batchGetTableList(
    'example_trader_count_data,example_trader_expansion,example_trader_merchant_distribution,example_trader_transaction_funneldiagram'
  )

  topCardList.value = topCardList.value.map((item, index) => {
    const cardData = oneres.example_trader_count_data.records[0][item.dictionary]
    item = { ...item, ...cardData, border: 'border' + index }
    return item
  })
  jdtData.value = jdtData.value.map((item) => {
    const cardData = oneres.example_trader_expansion.records[0][item.dictionary]
    item = { ...item, ...cardData, jd: (cardData.leftNum / cardData.rightNum) * 100 }
    return item
  })
  option.series[0].data = oneres.example_trader_merchant_distribution.records
  optionSeriesData.value = oneres.example_trader_merchant_distribution.records
  ldOption.series[0].data = oneres.example_trader_transaction_funneldiagram?.records

  let endres = await batchGetTableList(
    'example_trader_daily_turnover,example_trader_weekly_orders,example_trader_expansion_number,example_trader_transaction_amount'
  )

  endres.example_trader_daily_turnover?.records.forEach((ele) => {
    dailyTurnoverXAxis.value.push(ele.sj)
    dailyTurnoverSeries.value.push(ele.data)
  })
  zxtOption.xAxis.data = dailyTurnoverXAxis.value
  zxtOption.series[0].data = dailyTurnoverSeries.value
  endres.example_trader_weekly_orders.records.forEach((ele) => {
    weeklyOrdersXAxis.value.push(ele.sj)
    weeklyOrdersSeries.value.push(ele.data)
  })
  zddlOption.xAxis.data = weeklyOrdersXAxis.value
  zddlOption.series[0].data = weeklyOrdersSeries.value
  expansionNumberDataset.value.push(
    ...endres.example_trader_expansion_number.records.map((item) => [
      item.sj,
      item.mbkts,
      item.sjkts
    ])
  )
  endres.example_trader_transaction_amount.records.forEach((ele) => {
    transactionAmountXAxis.value.push(ele.sj)
    transactionAmountSeries1.value.push(ele.xscj)
    transactionAmountSeries2.value.push(ele.xxcj)
  })
  cjjeOption.value.xAxis.data = transactionAmountXAxis.value
  cjjeOption.value.series[0].data = transactionAmountSeries1.value
  cjjeOption.value.series[1].data = transactionAmountSeries2.value
}

onMounted(async () => {
  await init()
  echartFun()
})
</script>

<style lang="scss" scoped>
.real-time-data {
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #999;
  align-items: flex-end;

  .title {
    // color: #666666;
    font-size: 15px;
    font-weight: 700;
  }
}

.top-box {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.top-card {
  flex-basis: calc(16.6% - 12px);
  flex-shrink: 1;
  min-width: 168px;
  padding: 15px;
  // border-radius: 10px;
  box-shadow: var(--el-box-shadow-light);
  box-sizing: border-box;

  .card-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-family: '微软雅黑', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      color: #999;
    }

    .tendency {
      width: 24px;
      height: 17px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .text-ts {
      margin: 0 3px;
      font-family: Montserrat, sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
    }

    .text {
      margin-left: 1px;
      font-family: '微软雅黑', sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
      color: #999;
    }
  }

  .text-value {
    font-family: 'Montserrat Bold', Montserrat, sans-serif;
    font-size: 24px;
    font-weight: 700;
    font-weight: bold;
    line-height: 32px;
    color: #333;
  }

  .card-box.top {
    .text {
      color: rgb(7 183 138);
    }

    .ascent {
      background-image: url('@/assets/svgs/top.svg');
    }
  }

  .card-box.bottom {
    .text {
      color: rgb(250 80 135);
    }

    .descent {
      background-image: url('@/assets/svgs/bottom.svg');
    }
  }

  .text-dw {
    margin-left: 8px;
    font-family: '微软雅黑', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #333;
  }
}

.content {
  display: flex;
  padding: 10px 30px 0;
  margin-top: 20px;
  background: #fff;
  justify-content: space-between;

  p {
    height: 60px;
    padding: 0;
    margin: 0;
    line-height: 60px;
  }

  .content-title {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    color: #666;
    text-align: left;
  }

  .content-left {
    width: 30%;

    .jdt {
      margin-top: 20px;

      .jdt-top {
        display: flex;
        width: 100%;
        justify-content: space-between;
        font-size: 14px;
        color: #666;

        .jdt-top-text {
          font-family: '微软雅黑', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #666;
        }

        .num {
          font-family: 'Montserrat Bold', Montserrat, sans-serif;
          font-size: 16px;
          font-weight: 700;
        }

        .acitive {
          display: block;
          width: 10px;
          height: 10px;
          margin-right: 5px;
          // background: red;
          border-radius: 50%;
        }
      }

      .jdt-bottom {
        margin-top: 10px;
      }
    }
  }

  .content-center {
    width: 30%;
  }

  .content-right {
    width: 30%;
  }
}

.eCharts {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  .eCharts-title {
    display: flex;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 28px;
    color: #666;
    text-align: left;
    justify-content: space-between;

    p {
      padding: 0;
      margin: 0;
    }
  }

  .eCharts-left {
    width: 27.5%;
    padding: 10px 30px 0;
    background: #fff;
  }

  .eCharts-center {
    width: 27.5%;
    padding: 10px 30px 0;
    background: #fff;
  }

  .eCharts-right {
    width: 27.5%;
    padding: 10px 30px 0;
    background: #fff;
  }
}

.eCharts-cjje {
  padding: 10px 30px 30px;
  margin-top: 20px;
  background: #fff;

  p {
    padding: 0;
    margin: 0;
  }

  .cjje-top {
    display: flex;
    justify-content: space-between;

    .cjje-top-left {
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 16px;
      font-weight: 700;
      line-height: 28px;
      color: #686a6d;
      text-align: left;
    }
  }
}

.border0 {
  border-left: 5px solid #fb6260;
}

.border1 {
  border-left: 5px solid #09f;
}

.border2 {
  border-left: 5px solid #8167f5;
}

.border3 {
  border-left: 5px solid #51d351;
}

.border4 {
  border-left: 5px solid #ff7a8c;
}

.border5 {
  border-left: 5px solid #ffa94c;
}

.text-zeng {
  color: #f56c6c;
}

.text-jian {
  color: #19be6b;
}

.demo-progress .el-progress--line {
  max-width: 600px;
  margin-bottom: 15px;
}

.bj0 {
  background: #409eff;
}

.bj1 {
  background: #f56c6c;
}

.bj2 {
  background: #e6a23c;
}

.icon {
  margin-top: 7px;
}

.icons {
  margin-top: 4px;
}

.font {
  font-family: 'Montserrat Bold', Montserrat, sans-serif !important;
}

.fontFamily {
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important;
}

::v-deep .el-progress-bar__innerText {
  margin-top: -8px !important;
  line-height: 12px !important;
}

::v-deep .style {
  top: -50px !important;
}
</style>

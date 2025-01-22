<template>
  <div class="w-100%">
    <div class="w-100% flex mb-20px real-time-data">
      <div class="mr-10px title text-gray-500">实时数据</div>
      <div class="">更新时间 2022-06-15 12:00</div>
    </div>
    <div class="w-100% grid gap-x-15px gap-y-10px grid-cols-6">
      <div
        class="top-card bg-#fff .dark:bg-#1D1E1F! b-1px b-transparent .dark:b-#2A2B2C b-solid"
        v-for="(item, index) in topCardList"
        :key="index"
      >
        <div class="card-box mb-5px">
          <div class="text text-gray-500">{{ item.title }}</div>
        </div>
        <span class="text-value">
          <avue-count-up :end="item.value"></avue-count-up>
        </span>
        <div class="card-box mt-10px" :class="item.type == '1' ? 'top' : 'bottom'">
          <div class="text">
            <span class="mr-5px">同比昨日 {{ item.button }}</span>
          </div>
          <div class="tendency" :class="item.type == '1' ? 'ascent' : 'descent'"> </div>
        </div>
      </div>
    </div>
    <div class="w-100% flex gap-x-20px">
      <div class="flex-basis-65%" style="width: calc(65% - 20px)">
        <div
          class="real-echart pt-20px b-1px .dark:bg-#1D1E1F! b-transparent .dark:b-#2A2B2C b-solid"
        >
          <div class="util-box">
            <div class="util-title ml-20px">
              <div class="placeholder mr-7px"></div>
              <div class=".dark:c-#E5EAF3"> 订单及销量趋势 </div>
            </div>
            <div class="util">
              <el-button-group>
                <el-button
                  v-for="item in typeList1"
                  :key="item.type"
                  :type="item.type == isActive1 ? 'primary' : ''"
                  @click="clickFluctuate(item.type)"
                >
                  {{ item.title }}
                </el-button>
              </el-button-group>
              <div class="cursor-pointer text-14px" @click="clickBtn">
                查看更多
                <span style="font-weight: bold"> > </span>
              </div>
            </div>
          </div>
          <Echart
            :options="fluctuate_option"
            style="z-index: 1"
            class="mt--28px"
            width="100%"
            height="368px"
          />
        </div>
        <div
          class="real-echart pt-20px b-1px .dark:bg-#1D1E1F! b-transparent .dark:b-#2A2B2C b-solid"
        >
          <div class="util-box">
            <div class="util-title ml-20px">
              <div class="placeholder mr-7px"></div>
              <div class=".dark:c-#E5EAF3"> 新增用户及会员趋势 </div>
            </div>
            <div class="util">
              <el-button-group>
                <el-button
                  v-for="item in typeList3"
                  :key="item.type"
                  :type="item.type == isActive3 ? 'primary' : ''"
                  @click="clickBrokenLine(item.type)"
                >
                  {{ item.title }}
                </el-button>
              </el-button-group>
              <div class="look-more cursor-pointer" @click="clickBtn">
                查看更多
                <span style="font-weight: bold"> > </span>
              </div>
            </div>
          </div>
          <Echart :options="broken_line_option" class="mt--28px" width="100%" height="368px" />
        </div>
        <div
          class="real-echart pt-20px b-1px .dark:bg-#1D1E1F! b-transparent .dark:b-#2A2B2C b-solid"
        >
          <div class="util-box">
            <div class="util-title ml-20px">
              <div class="placeholder mr-7px"></div>
              <div class=".dark:c-#E5EAF3"> 待处理订单 </div>
            </div>
            <div class="util">
              <div class="look-more cursor-pointer" @click="clickBtn">
                查看更多
                <span style="font-weight: bold"> > </span>
              </div>
            </div>
          </div>
          <div class="m-20px pb-30px">
            <avue-crud
              ref="crudRef"
              v-model="form"
              :option="option"
              :row-style="rowStyle"
              :header-cell-class-name="headerCellClassName"
              :data="data"
            >
              <template #menu="{ size, row, index }">
                <el-button @click="tip(row, index)" text type="primary" :size="size">
                  <div class="bj-btn mr-3px">
                    <Icon :size="11" icon="ep:arrow-right-bold"></Icon>
                  </div>
                  订单详情
                </el-button>
              </template>
            </avue-crud>
          </div>
        </div>
      </div>
      <div class="flex-basis-35% w-35%">
        <div
          class="real-echart pt-20px b-1px .dark:bg-#1D1E1F! b-transparent .dark:b-#2A2B2C b-solid"
        >
          <div class="util-box">
            <div class="util-title ml-20px">
              <div class="placeholder mr-7px"></div>
              <div class=".dark:c-#E5EAF3"> 商品销量占比 </div>
            </div>
            <div class="util">
              <el-button-group>
                <el-button
                  v-for="item in typeList2"
                  :key="item.type"
                  :type="item.type == isActive2 ? 'primary' : ''"
                  @click="clickCyclicAnnular(item.type)"
                >
                  {{ item.title }}
                </el-button>
              </el-button-group>
              <div class="look-more cursor-pointer" @click="clickBtn">
                查看更多
                <span style="font-weight: bold"> > </span>
              </div>
            </div>
          </div>
          <Echart :options="cyclic_annular_option" class="mt--28px" width="100%" height="368px" />
        </div>
        <div
          class="real-echart pt-20px b-1px .dark:bg-#1D1E1F! b-transparent .dark:b-#2A2B2C b-solid"
        >
          <div class="util-box">
            <div class="util-title ml-20px">
              <div class="placeholder mr-7px"></div>
              <div class=".dark:c-#E5EAF3"> 用户访问趋势 </div>
            </div>
            <div class="util">
              <el-button-group>
                <el-button
                  v-for="item in typeList4"
                  :key="item.type"
                  :type="item.type == isActive4 ? 'primary' : ''"
                  @click="clickBdt(item.type)"
                >
                  {{ item.title }}
                </el-button>
              </el-button-group>
              <div class="look-more cursor-pointer" @click="clickBtn">
                查看更多
                <span style="font-weight: bold"> > </span>
              </div>
            </div>
          </div>
          <Echart :options="fluctuate_option2" class="mt--28px" width="100%" height="368px" />
        </div>
        <div
          class="real-echart pt-20px b-1px .dark:bg-#1D1E1F! b-transparent .dark:b-#2A2B2C b-solid"
        >
          <div class="util-box">
            <div class="util-title ml-20px">
              <div class="placeholder mr-7px"></div>
              <div class=".dark:c-#E5EAF3"> 本月单品销量排名 </div>
            </div>
            <div class="util">
              <div class="look-more cursor-pointer" @click="clickBtn">
                查看更多
                <span style="font-weight: bold"> > </span>
              </div>
            </div>
          </div>
          <div class="m-20px pb-30px">
            <avue-crud
              ref="crudRef2"
              v-model="form2"
              :option="option2"
              :row-style="rowStyle"
              :header-cell-class-name="headerCellClassName"
              :data="data2"
            >
            </avue-crud>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { ElMessage } from 'element-plus'
import { getTableList, batchGetTableList } from '@/api/design/report'
import * as TableApi from '@/api/design/table'

defineOptions({ name: 'Home5' })

interface TopCardList {
  dictionary: string
  title: string
  button?: string
  type?: string
  value?: number
}
interface CyclicAnnularSeries {
  name: string
  value: number
}

let topCardList = ref<TopCardList[]>([
  { title: '今日交易额（元）', dictionary: 'jrjye' },
  { title: '今日订单量（元）', dictionary: 'jrddl' },
  { title: '今日浏览量', dictionary: 'jrlll' },
  { title: '今日访问用户', dictionary: 'jrfwyh' },
  { title: '今日注册用户', dictionary: 'jrzcyh' },
  { title: '今日新增会员', dictionary: 'jrxzhy' }
])

const isActive1 = ref(1)
const isActive2 = ref(1)
const isActive3 = ref(1)
const isActive4 = ref(1)

const typeList1 = ref([
  { title: '本周', type: 1 },
  { title: '本月', type: 2 },
  { title: '本年', type: 3 }
])
const typeList2 = ref([
  { title: '本周', type: 1 },
  { title: '本月', type: 2 },
  { title: '本年', type: 3 }
])
const typeList3 = ref([
  { title: '本周', type: 1 },
  { title: '本月', type: 2 },
  { title: '本年', type: 3 }
])
const typeList4 = ref([
  { title: '本周', type: 1 },
  { title: '本月', type: 2 },
  { title: '本年', type: 3 }
])

// 波动图
const fluctuateXAxis = ref<string[]>([])
const fluctuateSeries1 = ref<string[]>([])
const fluctuateSeries2 = ref<string[]>([])
const fluctuate_option = ref({
  tooltip: {
    trigger: 'axis'
  },
  color: ['#4FA7FF', '#39EDD6'],
  legend: {
    data: ['销售额', '订单量'],
    icon: 'rich',
    show: true,
    itemWidth: 12,
    itemHeight: 12,
    textStyle: {
      color: '#666666',
      fontSize: '12px'
    },

    bottom: 20,
    right: 'center',
    itemGap: 20
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: 70,
    top: '16%',
    containLabel: true
  },
  xAxis: {
    data: fluctuateXAxis.value,
    type: 'category',
    boundaryGap: false,
    axisLine: {
      symbol: 'none',
      lineStyle: {
        color: '#EBEBEB'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      color: '#999999',
      fontSize: 12,
      padding: [10, 0, 0, 0],
      align: 'center'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#6071A9',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#EBEBEB',
        type: 'solid'
      }
    }
  },
  series: [
    {
      name: '销售额',
      type: 'line',
      data: fluctuateSeries1.value,
      smooth: true,
      lineStyle: {
        width: 0
      },
      areaStyle: {
        opacity: 0.8
      },
      symbol: 'none'
    },
    {
      name: '订单量',
      data: fluctuateSeries2.value,
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 0
      },
      areaStyle: {
        opacity: 0.8
      },
      symbol: 'none'
    }
  ]
})

// 波动图2
const fluctuate2XAxis = ref<string[]>([])
const fluctuate2Series = ref<string[]>([])
const fluctuate_option2 = ref({
  tooltip: {
    trigger: 'axis'
  },
  color: ['#FFA83C'],
  legend: {
    data: ['访问用户'],
    icon: 'rich',
    show: true,
    itemWidth: 12,
    itemHeight: 12,
    textStyle: {
      color: '#666666',
      fontSize: '12px'
    },

    bottom: 20,
    right: 'center',
    itemGap: 20
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: 70,
    top: '16%',
    containLabel: true
  },
  xAxis: {
    data: fluctuate2XAxis.value,
    type: 'category',
    boundaryGap: false,
    axisLine: {
      symbol: 'none',
      lineStyle: {
        color: '#EBEBEB'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      color: '#999999',
      fontSize: 12,
      padding: [10, 0, 0, 0],
      align: 'center'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#6071A9',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#EBEBEB',
        type: 'solid'
      }
    }
  },
  series: [
    {
      name: '访问用户',
      type: 'line',
      data: fluctuate2Series.value,
      smooth: true,
      lineStyle: {
        width: 0
      },
      areaStyle: {
        opacity: 0.6
      },
      symbol: 'none'
    }
  ]
})

// 环状图
const cyclicAnnularSeries = ref<CyclicAnnularSeries[]>()
const cyclicAnnularSeriesNum = ref(0)
const cyclic_annular_option = ref({
  // 环形图中间默认显示文字
  color: ['#2391FF', '#FF745A', '#FFC328', '#8167F5', '#07E8AE'],
  tooltip: {
    extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.15);',
    backgroundColor: 'rgba(0,0,0,0.75)',
    textStyle: {
      color: '#FFFFFF'
    },
    formatter: (param) => {
      let { name, data } = param
      let result = `<div>${name}：${data.xse}</div>`
      return result
    }
  },
  legend: {
    orient: 'vertial',
    itemHeight: 12,
    icon: 'circle',
    top: '30%',
    right: '10%',
    itemGap: 20,
    data: cyclicAnnularSeries.value,
    textStyle: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.65)',
      rich: {
        a: {
          padding: [0, 0, 0, 40],
          fontSize: 14,
          fontWeight: '700'
        }
      }
    },
    formatter: (name) => {
      const value = cyclicAnnularSeries.value?.find((item) => item.name === name)
      return `${name}` + '{a|' + value?.value + '%' + '}'
    }
  },
  series: [
    {
      type: 'pie',
      center: ['30%', '50%'],
      radius: ['35%', '55%'],
      label: {
        position: 'center',
        formatter: () => {
          return [`{tit|销售总额}`, `{num|${cyclicAnnularSeriesNum.value}}`].join('\n')
        },
        rich: {
          tit: {
            fontSize: 16,
            color: '#999999',
            fontWeight: 400,
            align: 'center'
          },
          num: {
            padding: [10, 0, 0, 0],
            fontSize: 28,
            fontWeight: 'bold',
            color: '#333333',
            align: 'center'
          }
        }
      },
      data: cyclicAnnularSeries.value
    }
  ]
})

// 折线图
const brokenLineXAxis = ref<string[]>([])
const brokenLineSeries1 = ref<string[]>([])
const brokenLineSeries2 = ref<string[]>([])
const broken_line_option = ref({
  tooltip: {
    trigger: 'axis'
  },
  color: ['#4FA7FF', '#39EDD6'],
  legend: {
    data: ['新增用户', '新增会员'],
    icon: 'rich',
    show: true,
    itemWidth: 12,
    itemHeight: 12,
    textStyle: {
      color: '#666666',
      fontSize: '12px'
    },
    bottom: 20,
    right: 'center',
    itemGap: 20
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: 70,
    top: '16%',
    containLabel: true
  },
  xAxis: {
    data: brokenLineXAxis.value,
    type: 'category',
    boundaryGap: false,
    axisLine: {
      symbol: 'none',
      lineStyle: {
        color: '#EBEBEB'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      color: '#999999',
      fontSize: 12,
      padding: [10, 0, 0, 0],
      align: 'center'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#6071A9',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#EBEBEB',
        type: 'solid'
      }
    }
  },
  series: [
    {
      name: '新增用户',
      type: 'line',
      data: brokenLineSeries1.value,
      lineStyle: {
        width: 1
      },
      symbol: 'none'
    },
    {
      name: '新增会员',
      data: brokenLineSeries2.value,
      type: 'line',
      lineStyle: {
        width: 1
      },
      symbol: 'none'
    }
  ]
})

const option = ref({
  editBtn: false,
  addBtn: false,
  delBtn: false,
  searchBtn: false,
  refreshBtn: false,
  columnBtn: false,
  border: false,
  menuWidth: 120,
  column: [
    {
      label: '订单编号',
      overHidden: true,
      prop: 'bh',
      width: '120'
    },
    {
      label: '商品名称',
      overHidden: true,
      prop: 'name',
      width: '200'
    },
    {
      label: '下单时间',
      overHidden: true,
      prop: 'xdsj',
      width: '110',
      type: "datetime",
      format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      label: '数量',
      overHidden: true,
      prop: 'num'
    },
    {
      label: '金额',
      overHidden: true,
      prop: 'money',
      html: true,
      formatter: (val) => {
        let text = ''
        if (val.money) {
          if (val.money.toString().indexOf('￥') == -1) {
            text = '￥' + val.money
          } else {
            text = val.money
          }
        } else {
          text = '￥0'
        }
        return `<span>${text}</span>`
      }
    },
    {
      label: '状态',
      overHidden: true,
      prop: 'status',
      html: true,
      formatter: (val) => {
        let color = ''
        let text = ''
        if (val.status == '1') {
          color = '#409EFF'
          text = '待发货'
        } else if (val.status == '2') {
          color = '#FF9900'
          text = '待付款'
        } else if (val.status == '3') {
          color = '#F56C6C'
          text = '待退款'
        }
        return (
          '<div class="flex items-center justify-center text-12px">' +
          `<div class="w-5px h-5px mr-3px " style="background-color:${color};border-radius: 100%;"></div><div>` +
          text +
          '</div></div>'
        )
      }
    }
  ]
})
const option2 = ref({
  menu: false,
  addBtn: false,

  border: false,
  menuWidth: 120,
  column: [
    {
      label: '排名',
      overHidden: true,
      prop: 'pm',
      width: 70,
      html: true,
      formatter: (val) => {
        let selectedArr = [1, 2, 3]
        let pmHtmlColor = ''
        if (selectedArr.includes(val.pm)) {
          pmHtmlColor = '#FF9500'
        } else {
          pmHtmlColor = '#2391FF'
        }

        return (
          `<div class="w-25px h-25px" style="margin:0 auto;background-color:${pmHtmlColor};color:white;border-radius:5px;font-weight:bold">` +
          val.pm +
          '</div>'
        )
      }
    },
    {
      label: '商品名称',
      overHidden: true,
      prop: 'name'
    },
    {
      label: '销量',
      overHidden: true,
      prop: 'sl'
    },
    {
      label: '销售额',
      overHidden: true,
      prop: 'sse',
      html: true,
      formatter: (val) => {
        let text = ''
        if (val.sse) {
          if (val.sse.toString().indexOf('￥') == -1) {
            text = '￥' + val.sse
          } else {
            text = val.sse
          }
        } else {
          text = '￥0'
        }
        return `<span>${text}</span>`
      }
    }
  ]
})

const fluctuateUtil = (data) => {
  fluctuateXAxis.value = []
  fluctuateSeries1.value = []
  fluctuateSeries2.value = []
  data.forEach((ele) => {
    fluctuateXAxis.value.push(ele.sj)
    fluctuateSeries1.value.push(ele.xse)
    fluctuateSeries2.value.push(ele.ddl)
  })
  fluctuate_option.value.xAxis.data = fluctuateXAxis.value
  fluctuate_option.value.series[0].data = fluctuateSeries1.value
  fluctuate_option.value.series[1].data = fluctuateSeries2.value
}
const clickFluctuate = async (type) => {
  let res = await getTableList('example_order_sales', { type: type })
  fluctuateUtil(res.records)
  isActive1.value = type
}

const cyclicAnnularUtil = (data) => {
  cyclicAnnularSeriesNum.value = 0
  cyclicAnnularSeriesNum.value = data.reduce((a, b) => {
    let num = +b.xse
    return a + num
  }, 0)

  cyclicAnnularSeries.value = data
  cyclic_annular_option.value.series[0].data = cyclicAnnularSeries.value
}
const clickCyclicAnnular = async (type) => {
  let res = await getTableList('example_order_sales_percentage', { type: type })
  cyclicAnnularUtil(res.records)
  isActive2.value = type
}

const brokenLineUtil = (data) => {
  brokenLineXAxis.value = []
  brokenLineSeries1.value = []
  brokenLineSeries2.value = []
  data.forEach((ele) => {
    brokenLineXAxis.value.push(ele.sj)
    brokenLineSeries1.value.push(ele.xzyh)
    brokenLineSeries2.value.push(ele.xzhy)
  })
  broken_line_option.value.xAxis.data = brokenLineXAxis.value
  broken_line_option.value.series[0].data = brokenLineSeries1.value
  broken_line_option.value.series[1].data = brokenLineSeries2.value
}
const clickBrokenLine = async (type) => {
  let res = await getTableList('example_new_user_num', { type: type })
  brokenLineUtil(res.records)
  isActive3.value = type
}

const bdtUtil = (data) => {
  fluctuate2XAxis.value = []
  fluctuate2Series.value = []
  data.forEach((ele) => {
    fluctuate2XAxis.value.push(ele.sj)
    fluctuate2Series.value.push(ele.fwyh)
  })
  fluctuate_option2.value.xAxis.data = fluctuate2XAxis.value
  fluctuate_option2.value.series[0].data = fluctuate2Series.value
}

const clickBdt = async (type) => {
  let res = await getTableList('example_user_visits', { type: type })
  bdtUtil(res.records)
  isActive4.value = type
}

let data: any = ref()
let data2: any = ref()
const form = ref({})
const form2 = ref({})

function rowStyle({ row, rowIndex }) {
  if (appStore.isDark) return { backgroundColor: '#1D1E1F' }

  if (rowIndex % 2 === 1) {
    return {
      backgroundColor: '#F2F2F2'
    }
  }
}

function headerCellClassName() {
  if (appStore.isDark) return 'header-cell'
}

const appStore = useAppStore()

watch(
  () => appStore.isDark,
  (val) => {
    if (val) {
      cyclic_annular_option.value.legend.textStyle.color = '#CCCCCC'
    } else {
      cyclic_annular_option.value.legend.textStyle.color = 'rgba(0,0,0,0.65)'
    }
  }
)

const clickBtn = () => {
  ElMessage({
    message: '点击了查看更多',
    type: 'success'
  })
}

function tip(row: object, index: number): void {
  ElMessage({
    message: '订单详情',
    type: 'success'
  })
}

const init = async () => {
  let oneres = await batchGetTableList(
    'example_today_data,example_order_sales,example_order_sales_percentage'
  )

  let todayData = oneres.example_today_data.records[0]
  let orderSales = oneres.example_order_sales.records
  let salesPercentage = oneres.example_order_sales_percentage.records
  topCardList.value = topCardList.value.map((item) => {
    return (item = {
      ...item,
      button: todayData[item.dictionary].button,
      type: todayData[item.dictionary].type,
      value: todayData[item.dictionary].value
    })
  })
  fluctuateUtil(orderSales)
  cyclicAnnularUtil(salesPercentage)

  let endres = await batchGetTableList(
    'example_new_user_num,example_user_visits,example_product_sales_rank'
  )
  let userNum = endres.example_new_user_num.records
  let userVisits = endres.example_user_visits.records
  brokenLineUtil(userNum)
  bdtUtil(userVisits)
  data2.value = endres.example_product_sales_rank.records
  let { records: bdkfData } = await TableApi.getTableList(
    '1847456813371498498',
    { pageNo: 1, pageSize: 10 },
    false
  )
  data.value = bdkfData
}
onMounted(async () => {
  // 判断是否为暗色模式
  const { wsCache } = useCache()
  if (wsCache.get(CACHE_KEY.IS_DARK)) {
    cyclic_annular_option.value.legend.textStyle.color = '#CCCCCC'
  }
  init()
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

.top-card {
  padding: 15px;
  border-radius: 10px;
  box-shadow: var(--el-box-shadow-light);
  box-sizing: border-box;

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

    .tendency {
      width: 24px;
      height: 17px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
    }
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

  .text-value {
    margin-bottom: 15px;
    font-size: 28px;
    font-weight: bold;
  }
}

.real-echart {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  flex-shrink: 0;

  .util-box {
    position: relative;
    z-index: 20;
    display: flex;
    width: 100%;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;

    .util-title {
      display: flex;
      font-size: 14px;
      font-weight: 600;
      color: rgb(102 102 102);
      align-items: center;

      .placeholder {
        width: 5px;
        height: 16px;
        background-color: rgb(49 167 255);
      }
    }

    .util {
      display: flex;
      padding-right: 30px;
      margin-left: auto;
      font-size: 12px;
      color: #999;
      text-align: right;
      align-items: center;

      .el-button-group {
        display: flex;
        margin-right: 27px;
        flex-wrap: nowrap;

        .el-button {
          height: 28px;
          font-size: 12px;
          border: 1px solid var(--el-color-primary);
        }
      }

      .look-more {
        text-wrap: nowrap;
        font-size: 14px;
      }
    }
  }
}

::v-deep(.el-card) {
  .avue-crud__header {
    display: none;
  }

  .header-cell {
    background-color: #1f1f1f !important;
    border-top: 1px solid var(--el-card-border-color);
  }

  .header-cell:first-child {
    border-left: 1px solid var(--el-card-border-color);
  }

  .header-cell:last-child {
    border-right: 1px solid var(--el-card-border-color);
  }

  .el-table__header {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;

    .el-table__cell {
      font-size: 14px;
      color: rgb(102 102 102);
      background-color: #efefef;
    }
  }

  .el-table__cell {
    height: 45px;
    padding: 0;

    .avue-crud__menu {
      .el-button {
        font-size: 14px;

        .bj-btn {
          display: flex;
          width: 14px;
          height: 13px;
          color: white;
          background-color: #2391ff;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .el-table__row {
    height: 45px;
    font-size: 14px;
  }

  .el-table__row {
    td:last-child {
      border-right: 1px solid var(--el-card-border-color);
    }

    td:first-child {
      border-left: 1px solid var(--el-card-border-color);
    }

    .menuClassName {
      border-right: 1px solid var(--el-card-border-color);
    }
  }
}
</style>

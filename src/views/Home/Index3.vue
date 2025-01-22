<template>
  <div class="w-100%">
    <div class="flex justify-between items-center">
      <div
        class="w-[calc(50%-50px)] py-16px px-20px bg-#fff border-rd-10px b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid"
      >
        <h5 class="text">服务器基本信息</h5>
        <div class="w-100% inline-grid grid-cols-4 gap-4 text-center">
          <div class="left-bottom-box" v-for="(item, index) in topLeftData" :key="index">
            <p>{{ item.title }}</p>
            <div>
              <span>{{ item.num }}</span> {{ item.dw }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex w-[calc(50%-50px)] px-20px bg-#fff border-rd-10px justify-between items-center b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid"
      >
        <div class="conter-right-box" v-for="(item, index) in arr" :key="index">
          <p class="text-conter">{{ item.title }}</p>
          <div class="chart">
            <Echart :options="syl_pie_option" width="140px" height="130px"></Echart>
          </div>
        </div>
        <!-- <div class="conter-right-box">
          <p class="text-conter">内存使用率</p>
          <div class="chart">
            <Echart :options="syl_pie_option" width="140px" height="130px"></Echart>
          </div>
        </div>
        <div class="conter-right-box">
          <p class="text-conter">系统平均负载（1m）</p>
          <div class="chart">
            <Echart :options="syl_pie_option" width="140px" height="130px"></Echart>
          </div>
        </div> -->
      </div>
    </div>
    <div class="flex justify-between mt-20px">
      <div
        class="w-[calc(50%-50px)] bg-#fff border-rd-10px p-20px b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid"
      >
        <Echart :options="cpu_line_option" width="100%" height="350px" />
      </div>
      <div
        class="w-[calc(50%-50px)] bg-#fff border-rd-10px p-20px b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid"
      >
        <Echart :options="nc_line_option" width="100%" height="350px" />
      </div>
    </div>
    <div class="flex justify-between mt-20px">
      <div
        class="w-[calc(50%-50px)] bg-#fff border-rd-10px p-20px b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid"
      >
        <Echart :options="ll_line_option" width="100%" height="350px" />
      </div>
      <div
        class="w-[calc(50%-50px)] bg-#fff border-rd-10px p-20px b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid"
      >
        <Echart :options="cp_line_option" width="100%" height="350px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { batchGetTableList } from '@/api/design/report'

defineOptions({ name: 'Home3' })

interface TopLeftData {
  title: string
  dw: string
  dictionary: string
  num?: number
}

const topLeftData = ref<TopLeftData[]>([
  { title: '系统运行时间', dw: '天', dictionary: 'xtyxsj' },
  { title: 'cpu核心数', dw: '', dictionary: 'cpuhxs' },
  { title: '内存总量', dw: 'G', dictionary: 'nczl' },
  { title: '系统平均负数', dw: '', dictionary: 'xtpjfz' }
])

const arr = ref<any>([
  { title: 'CPU使用率（1m）', dictionary: 'cpusyl' },
  { title: '内存使用率', dictionary: 'ncsyl' },
  { title: '系统平均负载（1m）', dictionary: 'xtpjfzl' }
])

const syl_pie_option = ref<any>({
  title: { text: '50%', left: 'center', top: 'center' },
  series: [
    {
      type: 'pie',
      stillShowZeroSum: false,
      label: { show: false },
      hoverAnimation: false,
      data: [
        { value: 100, name: 'A' },
        { value: 0, name: 'B' }
      ],
      itemStyle: {
        normal: {
          color: function (params) {
            var colors = ['#e9e9e9', '#0099ff', '#51d351']
            return colors[params.dataIndex % colors.length]
          }
        }
      },
      radius: ['50%', '70%']
    }
  ]
})

const cpuLineXAxis = ref<string[]>([])
const cpuLineSeries = ref<string[]>([])
const cpu_line_option = reactive<any>({
  title: {
    text: 'CPU使用率',
    textStyle: {}
  },
  tooltip: {},
  legend: { data: ['使用率'], x: 'right', selectedMode: false },
  xAxis: {
    data: cpuLineXAxis.value
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '使用率',
      data: cpuLineSeries.value,
      type: 'line',
      stack: 'x',
      areaStyle: { color: '#ffd7dc' },
      itemStyle: { normal: { color: '#ffd7dc', lineStyle: { color: '#ff7a8c' } } }
    }
  ]
})
const ncLineXAxis = ref<string[]>([])
const ncLineSeries = ref<string[]>([])
const nc_line_option = reactive<any>({
  title: {
    text: '内存使用率',
    textStyle: {}
  },
  tooltip: {},
  legend: { data: ['使用率'], x: 'right', selectedMode: false },
  xAxis: {
    data: ncLineXAxis.value
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '使用率',
      data: ncLineSeries.value,
      type: 'line',
      stack: 'x',
      areaStyle: { color: '#b2e0ff' },
      itemStyle: { normal: { color: '#b2e0ff', lineStyle: { color: '#0099ff' } } }
    }
  ]
})
const llLineXAxis = ref<string[]>([])
const llLineSeries1 = ref<string[]>([])
const llLineSeries2 = ref<string[]>([])
const ll_line_option = reactive<any>({
  title: {
    text: '服务器流量',
    textStyle: {}
  },
  tooltip: {},
  legend: { data: ['上传', '下载'], x: 'right', selectedMode: false },
  xAxis: { data: llLineXAxis.value },
  yAxis: { type: 'value' },
  series: [
    {
      name: '上传',
      data: llLineSeries1.value,
      type: 'line',
      // stack: 'x',
      areaStyle: { color: '#caf1ca' },
      itemStyle: { normal: { color: '#51d351', lineStyle: { color: '#51d351' } } }
    },
    {
      name: '下载',
      data: llLineSeries2.value,
      type: 'line',
      // stack: 'x',
      areaStyle: { color: '#ffe5c9' },
      itemStyle: { normal: { color: '#ffb465', lineStyle: { color: '#ffb465' } } }
    }
  ]
})
const cpLineXAxis = ref<string[]>([])
const cpLineSeries1 = ref<string[]>([])
const cpLineSeries2 = ref<string[]>([])
const cp_line_option = reactive<any>({
  title: {
    text: '服务器磁盘IO',
    textStyle: {}
  },
  tooltip: {},
  legend: { data: ['输出', '输入'], x: 'right', selectedMode: false },
  xAxis: { data: cpLineXAxis.value },
  yAxis: { type: 'value' },
  series: [
    {
      name: '输出',
      data: cpLineSeries1.value,
      type: 'line',
      // stack: 'x',
      areaStyle: { color: '#bdf1f1' },
      itemStyle: { normal: { color: '#78e3e4', lineStyle: { color: '#78e3e4' } } }
    },
    {
      name: '输入',
      data: cpLineSeries2.value,
      type: 'line',
      // stack: 'x',
      areaStyle: { color: '#d9d1fc' },
      itemStyle: { normal: { color: '#8167f5', lineStyle: { color: '#8167f5' } } }
    }
  ]
})
const textStyle = reactive({
  color: ''
})
const appStore = useAppStore()

const init = async () => {
  let oneres = await batchGetTableList(
    'example_systemmonitor_server_information,example_systemmonitor_cpu_utilization,example_systemmonitor_memory_utilization,example_systemmonitor_server_traffic,example_systemmonitor_disk_io'
  )

  let serverInformation = oneres.example_systemmonitor_server_information.records[0]
  topLeftData.value = topLeftData.value.map((item) => {
    return (item = {
      ...item,
      num: serverInformation[item.dictionary]
    })
  })
  arr.value = arr.value.map((item) => {
    syl_pie_option.value.title.text = serverInformation[item.dictionary] + '%'
    syl_pie_option.value.series[0].data[1].value = serverInformation[item.dictionary]
    return item
  })
  //CPU使用率
  let cpuUtilization = oneres.example_systemmonitor_cpu_utilization.records
  cpuUtilization.forEach((ele) => {
    cpuLineXAxis.value.push(ele.sj)
    cpuLineSeries.value.push(ele.syl)
  })
  //内存使用率
  let memoryUtilization = oneres.example_systemmonitor_memory_utilization.records
  memoryUtilization.forEach((ele) => {
    ncLineXAxis.value.push(ele.sj)
    ncLineSeries.value.push(ele.syl)
  })
  //服务器流量
  let serverTraffic = oneres.example_systemmonitor_server_traffic.records
  serverTraffic.forEach((ele) => {
    llLineXAxis.value.push(ele.sj)
    llLineSeries1.value.push(ele.sc)
    llLineSeries2.value.push(ele.xz)
  })
  //服务器磁盘IO
  let diskIo = oneres.example_systemmonitor_disk_io.records
  diskIo.forEach((ele) => {
    cpLineXAxis.value.push(ele.sj)
    cpLineSeries1.value.push(ele.sc)
    cpLineSeries2.value.push(ele.sr)
  })
}

onMounted(async () => {
  await init()
  // 判断是否为暗色模式
  const { wsCache } = useCache()
  if (wsCache.get(CACHE_KEY.IS_DARK)) {
    textStyle.color = '#E5EAF3'
    cpu_line_option.title.textStyle = textStyle
    nc_line_option.title.textStyle = textStyle
    ll_line_option.title.textStyle = textStyle
    cp_line_option.title.textStyle = textStyle
  }
})

watch(
  () => appStore.isDark,
  (val) => {
    if (val) {
      textStyle.color = '#E5EAF3'
    } else {
      textStyle.color = 'black'
    }
    cpu_line_option.title.textStyle = textStyle
    nc_line_option.title.textStyle = textStyle
    ll_line_option.title.textStyle = textStyle
    cp_line_option.title.textStyle = textStyle
  }
)
</script>

<style lang="scss" scoped>
h5,
p {
  padding: 0;
  margin: 0;
}

.conter-right-box {
  width: 200px;
  text-align: center;

  .text-conter {
    margin-top: 15px;
    font-size: 14px;
  }

  .chart {
    display: flex;
    width: 100%;
    justify-content: center;
  }
}

.left-bottom-box {
  margin: 20px 0;
  font-size: 12px;
  text-align: center;

  span {
    font-size: 28px;
    font-weight: 600;
  }
}

.text {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
</style>

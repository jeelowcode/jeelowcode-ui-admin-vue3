<template>
  <div class="w-100%">
    <div class="w-100% flex gap-y-20px home-top">
      <div class="el-card top-card flex items-center" v-for="(item, index) in tabList" :key="index">
        <div class="left">
          <span class="text-value">
            <avue-count-up :end="item.countUp"></avue-count-up>
          </span>
          <div class="text mt-10px">
            <span class="mr-5px">{{ item.title }}</span>
          </div>
        </div>
        <div>
          <el-image :src="item.imgUrl" fit="contain"></el-image>
        </div>
      </div>
    </div>
    <div class="w-100% flex gap-x-20px mt-30px ml-10px mr-10px">
      <div class="w-35%">
        <el-calendar v-model="value">
          <template #header>
            <span>{{ calendarDate }}</span>
          </template>
        </el-calendar>
      </div>
      <div class="echart-util bold bg-white .dark:bg-#1D1E1F">
        <Echart :options="visitor_option" width="100%" height="314px" />
      </div>
    </div>
    <div class="w-100% flex gap-x-20px mt-30px ml-10px mr-10px">
      <div class="echart-util bold bg-white .dark:bg-#1D1E1F">
        <Echart :options="salesVolume_option" width="100%" height="314px" />
      </div>
      <div class="echart-util reverse bg-white .dark:bg-#1D1E1F">
        <Echart :options="cyclic_annular_option" width="100%" height="314px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { batchGetTableList } from '@/api/design/report'

defineOptions({ name: 'Home8' })

interface CyclicAnnular {
  name: string
  dictionary: string
  value?: number
}

const tabList = ref([
  { countUp: 0, title: '今日访客数(人)', imgUrl: '/img/sjhy1.png', dictionary: 'today_visitors' },
  {
    countUp: 0,
    title: '今日会员访问数(人)',
    imgUrl: '/img/sjhy2.png',
    dictionary: 'today_member_visitors'
  },
  {
    countUp: 0,
    title: '今日会员付费数(人)',
    imgUrl: '/img/sjhy3.png',
    dictionary: 'today_paid_member'
  },
  { countUp: 0, title: '新增会员数(人)', imgUrl: '/img/sjhy4.png', dictionary: 'today_new_member' }
])

const value = ref(new Date())
const calendarDate = formatDate(new Date(), 'YYYY-MM-DD')

// 实时访客量
const visitorXAxis = ref<string[]>([])
const visitorSeries = ref<number[]>([])
const visitor_option = ref({
  tooltip: {
    trigger: 'axis'
  },
  title: {
    text: '实时访客量',
    textStyle: {
      fontSize: 20,
      color: 'black'
    },
    left: 25
  },
  color: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: '#EDE8FE' // 0% 处的颜色
      },
      {
        offset: 1,
        color: '#F8F7FC' // 100% 处的颜色
      }
    ],
    global: false // 缺省为 false
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: 20,
    top: '16%',
    containLabel: true
  },
  xAxis: {
    data: visitorXAxis.value,
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
      color: 'black',
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
    },
    offset: 10
  },
  series: [
    {
      name: '访客量',
      type: 'line',
      data: visitorSeries.value,
      smooth: true,
      lineStyle: {
        width: 5,
        color: '#5D77FF'
      },
      areaStyle: {
        opacity: 0.7
      },
      emphasis: { disabled: true },
      symbol: 'none'
    }
  ]
})

// 销售额
const salesVolumeXAxis = ref<string[]>([])
const salesVolumeSeries = ref<number[]>([])
const salesVolume_option = ref({
  tooltip: {
    trigger: 'axis'
  },
  title: {
    text: '销售额(元)',
    textStyle: {
      fontSize: 20,
      color: 'black'
    },
    left: 25
  },
  color: ['#6F7EFD'],
  grid: {
    left: '4%',
    right: '4%',
    bottom: 20,
    top: '16%',
    containLabel: true
  },
  xAxis: {
    data: salesVolumeXAxis.value,
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
      color: 'black',
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
        width: 0
      }
    },
    offset: 10
  },
  series: [
    {
      type: 'line',
      data: salesVolumeSeries.value,
      smooth: true,
      lineStyle: {
        width: 0
      },
      areaStyle: {
        opacity: 1
      },
      emphasis: { disabled: true },
      symbol: 'none'
    }
  ]
})

// 环状图
const cyclic_annular_option_data = ref<CyclicAnnular[]>([
  { name: '男装', dictionary: 'nz' },
  { name: '鞋包', dictionary: 'xb' },
  { name: '母婴', dictionary: 'my' },
  { name: '数码', dictionary: 'sm' }
])

const cyclic_annular_option = ref({
  title: {
    text: '',
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#5E78FD'
    },
    subtext: '',
    subtextStyle: {
      color: '#999999',
      fontWeight: '600'
    },
    itemGap: 0
  },
  color: ['#5E78FD', '#6E86FD', '#8DA0FF', '#AEBBFF'],
  series: [
    {
      type: 'pie',
      radius: ['35%', '55%'],
      label: {
        formatter: (parms) => {
          return [`{str|${parms.percent}% ${parms.data.name}}`].join('\n')
        },
        rich: {
          str: {
            fontWeight: 'bold',
            align: 'center'
          }
        }
      },
      data: cyclic_annular_option_data.value
    }
  ]
})

const appStore = useAppStore()
watch(
  () => appStore.isDark,
  (val) => {
    if (val) {
      visitor_option.value.title.textStyle.color = 'white'
      salesVolume_option.value.title.textStyle.color = 'white'
    } else {
      visitor_option.value.title.textStyle.color = 'black'
      salesVolume_option.value.title.textStyle.color = 'black'
    }
  }
)
const init = async () => {
  let oneres = await batchGetTableList('example_member_count_data,example_member_realtime_visits')

  let countData = oneres.example_member_count_data.records[0]
  let realtimeVisits = oneres.example_member_realtime_visits.records
  tabList.value = tabList.value.map((item) => {
    return (item = {
      ...item,
      countUp: countData[item.dictionary]
    })
  })
  realtimeVisits.forEach((ele) => {
    visitorXAxis.value?.push(ele.date)
    visitorSeries.value?.push(ele.ssfkl)
  })

  let endres = await batchGetTableList('example_member_sale,example_member_product_percentage')

  let sale = endres.example_member_sale.records
  let productPercentage = endres.example_member_product_percentage.records[0]
  sale.forEach((ele) => {
    salesVolumeXAxis.value?.push(ele.date)
    salesVolumeSeries.value?.push(ele.xse)
  })
  cyclic_annular_option_data.value = cyclic_annular_option_data.value.map((item) => {
    return (item = {
      ...item,
      value: productPercentage[item.dictionary]
    })
  })
  cyclic_annular_option.value.series[0].data = cyclic_annular_option_data.value
  cyclic_annular_option.value.title.text = '￥' + productPercentage.je
  cyclic_annular_option.value.title.subtext = productPercentage.date
}
onMounted(async () => {
  // 判断是否为暗色模式
  const { wsCache } = useCache()
  if (wsCache.get(CACHE_KEY.IS_DARK)) {
    visitor_option.value.title.textStyle.color = 'white'
    salesVolume_option.value.title.textStyle.color = 'white'
  }
  await init()
})
</script>

<style lang="scss" scoped>
.home-top {
  flex-wrap: wrap;

  .top-card {
    width: calc(25% - 50px);
    height: 85px;
    padding: 15px;
    margin: 0 10px;
    margin-top: 0 !important;
    border: none;
    border-radius: inherit;
    flex-shrink: 0;
    justify-content: space-around;
    box-shadow: 0 0 20px rgb(204 204 204 / 34.9%);

    .left {
      font-weight: bold;

      .text-value {
        margin-bottom: 45px;
        font-size: 28px;
      }

      .text {
        font-size: 13px;
      }
    }
  }
}

.echart-util {
  padding: 20px;
  box-shadow: 0 0 20px rgb(204 204 204 / 34.9%);
}

.echart-util.bold {
  width: calc(65% - 80px);
}

.echart-util.reverse {
  width: calc(35% - 40px);
}

::v-deep(.el-calendar) {
  box-shadow: 0 0 20px rgb(204 204 204 / 34.9%);

  .el-calendar__header {
    font-size: 18px;
    font-weight: bold;
    border-bottom: none;
  }

  .el-calendar__body {
    th {
      font-size: 15px;
      font-weight: bold;
    }

    .el-calendar-table__row {
      .is-selected {
        background-color: rgb(0 255 255 / 0%);
      }

      .current,
      .next,
      .prev {
        border: none;

        .el-calendar-day {
          display: flex;
          height: 43px;
          font-size: 14px;
          font-weight: 700;
          justify-content: center;
          align-items: center;
        }
      }
    }

    td {
      // border: none;
    }
  }
}
</style>

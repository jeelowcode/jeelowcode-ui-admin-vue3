<template>
  <div class="w-100%" v-loading="loading">
    <div class="search-top flex justify-right">
      <!-- <div class="search-top flex justify-between"> -->
      <!-- 租户搜索 -->
      <!-- <div>
        <span class="text-13px c-#656565"> 租户名称：</span>
        <el-select
          v-model="zhName"
          placeholder="请选择"
          size="large"
          style="width: 264px"
          @change="selectChange"
        >
          <el-option
            v-for="item in zhOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
      <!-- 切换日期 -->
      <div class="flex">
        <div class="w-200px grid grid-cols-3 mr-20px items-center">
          <div
            class="text-13px text-center cursor-pointer"
            :style="{ color: btnActive == item.name ? '#692AFB' : '#656565' }"
            v-for="item in btnList"
            :key="item.type"
            @click="btnClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <div>
          <el-date-picker
            v-model="pickerValue"
            type="daterange"
            range-separator="~"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD"
            size="default"
            :editable="false"
            @change="pirckerChange"
          />
        </div>
      </div>
    </div>
    <div class="mt-20px">
      <div
        class="text-13px c-#333333 font-700 bg-white h-45px pl-20px flex items-center b-1px b-solid b-#E4E4E4 b-t-0 b-l-0 b-r-0 .dark:b-#6B7280 .dark:c-#6B7280 .dark:bg-#1D1E1F"
      >
        登录次数/使用人数对比分析
      </div>
      <Echart :options="login_option" width="100%" height="423px" />
    </div>
    <div class="grid grid-cols-2 gap-x-20px mt-30px">
      <div class="bg-#fff b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid .dark:bg-#1D1E1F">
        <div
          class="h-45px flex items-center text-13px c-#333333 font-700 pl-20px b-1px b-solid b-#E4E4E4 b-t-0 b-l-0 b-r-0 .dark:c-#6B7280 .dark:b-#6B7280"
          style="font-family: Arial-BoldMT, 'Arial Bold', Arial, sans-serif"
        >
          使用人数最多的模块top5
        </div>
        <div class="p-20px">
          <avue-crud :option="mostOption" :data="mostData"></avue-crud>
        </div>
      </div>
      <div class="bg-#fff b-1px .dark:bg-#1D1E1F .dark:b-#2A2B2C .dark:b-solid">
        <div
          class="h-45px flex items-center text-13px c-#333333 font-700 pl-20px b-1px b-solid b-#E4E4E4 b-t-0 b-l-0 b-r-0 .dark:c-#6B7280 .dark:b-#6B7280"
          style="font-family: Arial-BoldMT, 'Arial Bold', Arial, sans-serif"
        >
          使用人数最少的模块bottom5
        </div>
        <div class="p-20px">
          <avue-crud :option="mostOption" :data="leastData"></avue-crud>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { getTableList, batchGetTableList } from '@/api/design/report'
import { formatDate } from '@/utils/formatTime'
import Icon from '@/components/Icon/src/Icon.vue'

defineOptions({ name: 'Home11' })

interface LoginXdata {
  value: string | number
  textStyle: {
    color: string
    fontSize: number
  }
}
interface TabData {
  mk: string
  pm: number
  syyhs: number
  zzf: string
  zzfFlag: number
}

const cardCellColor = ref('rgb(0 0 0 / 64.7%)')

const loading = ref(false)

const zhName = ref<string>('')
// 租户字典
const zhOption = ref([
  // {
  //   value: 'Option1',
  //   label: 'Option1'
  // }
])
// 租户字典的change
const selectChange = (val) => {
}

// 获取日期
let now = new Date()
const pickerValue = ref<Date | [Date, Date] | [string, string]>()
const dayArr = ref<[string, string]>()
const weekArr = ref<[string, string]>()
const monthArr = ref<[string, string]>()
const getDay = () => {
  let day = formatDate(now, 'YYYY-MM-DD')
  dayArr.value = [day, day]
}
const getWeek = () => {
  var firstDayOfWeek = new Date(now)
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1)
  var lastDayOfWeek = new Date(firstDayOfWeek)
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
  var first =
    firstDayOfWeek.getFullYear() +
    '-' +
    String(firstDayOfWeek.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(firstDayOfWeek.getDate()).padStart(2, '0')
  var last =
    lastDayOfWeek.getFullYear() +
    '-' +
    String(lastDayOfWeek.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(lastDayOfWeek.getDate()).padStart(2, '0')

  weekArr.value = [first, last]
}
const getMonth = () => {
  let month = now.getMonth()
  let year = now.getFullYear()
  var first = formatDate(new Date(year, month, 1), 'YYYY-MM-DD')
  var last = formatDate(new Date(year, month + 1, 0), 'YYYY-MM-DD')
  monthArr.value = [first, last]
}

// 切换日期
const btnList = ref([
  { name: '本日', type: 1 },
  { name: '本周', type: 2 },
  { name: '本月', type: 3 }
])
const btnActive = ref('本月')
const btnClick = (val) => {
  btnActive.value = val.name
  if (val.type == 1) {
    pickerValue.value = dayArr.value
  } else if (val.type == 2) {
    pickerValue.value = weekArr.value
  } else if (val.type == 3) {
    pickerValue.value = monthArr.value
  }
}

const pirckerChange = (val) => {
  btnActive.value = ''
}

// 登录分析柱形图
const loginSeries1 = ref<number[]>([])
const loginSeries2 = ref<number[]>([])
const loginX = ref<any>([])
const loginXutil = ref({
  color: 'rgba(0, 0, 0, 0.647058823529412)',
  fontSize: 14
})
const loginXdata = ref<LoginXdata[]>([])

const login_option = ref({
  backgroundColor: 'white',
  grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
  tooltip: { trigger: 'item' },
  legend: {
    left: 'center',
    bottom: '3%',
    itemGap: 20,
    itemWidth: 34,
    itemHeight: 13,
    textStyle: {
      color: '#656565'
    },
    data: ['登录次数', '使用人数']
  },
  xAxis: {
    axisTick: {
      alignWithLabel: true
    },
    data: loginXdata.value
  },
  yAxis: {
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#E8E8E8'
      }
    }
  },
  series: [
    {
      name: '登录次数',
      type: 'bar',
      color: 'rgba(105, 42, 251, 1)',
      itemStyle: {
        borderRadius: [25, 25, 0, 0]
      },
      barGap: 0,
      data: loginSeries1.value
    },
    {
      name: '使用人数',
      type: 'bar',
      color: 'rgba(54, 203, 203, 0.996078431372549)',
      itemStyle: {
        borderRadius: [25, 25, 0, 0]
      },
      data: loginSeries2.value
    }
  ]
})

const mostOption = ref({
  menu: false,
  header: false,
  border: false,
  height: 350,
  column: [
    {
      // headerAlign: 'right',
      label: '排名',
      prop: 'pm'
    },
    {
      // headerAlign: 'left',
      label: '模块',
      prop: 'mk'
    },
    {
      // headerAlign: 'left',
      label: '使用用户数',
      prop: 'syyhs'
    },
    {
      label: '模块使用数',
      prop: 'mksys'
    }
    // {
    //   headerAlign: 'right',
    //   label: '周涨幅',
    //   prop: 'zzf',
    //   render: ({ row }) => {
    //     let icon
    //     if (row.zzfFlag == 1) {
    //       icon = h(Icon, { icon: 'ep:top', size: 20, color: '#00A854' })
    //     } else {
    //       icon = h(Icon, { icon: 'ep:bottom', size: 20, color: '#F04134' })
    //     }

    //     return h(
    //       'div',
    //       {
    //         style: { display: 'flex', alignItems: 'center', justifyContent: 'right' }
    //       },
    //       [h('span', { style: { marginRight: '5px' } }, row.zzf), icon]
    //     )
    //   }
    // }
  ]
})

const mostData = ref<TabData[]>()
const leastData = ref<TabData[]>()

const appStore = useAppStore()

const init = async () => {
  let oneres = await batchGetTableList('example_sytj_syzdmk,example_sytj_syzsmk')
  mostData.value = oneres.example_sytj_syzdmk.records
  leastData.value = oneres.example_sytj_syzsmk.records
}

onMounted(async () => {
  getDay()
  getWeek()
  getMonth()
  let item = btnList.value.find((r) => r.name == btnActive.value)
  if (item) {
    let arr = [dayArr.value, weekArr.value, monthArr.value]
    pickerValue.value = arr[item.type - 1]
  } else {
    pickerValue.value = monthArr.value
  }

  await init()

  // 判断是否为暗色模式
  const { wsCache } = useCache()
  if (wsCache.get(CACHE_KEY.IS_DARK)) {
    cardCellColor.value = ''
    login_option.value.backgroundColor = '#1D1E1F'
    login_option.value.legend.textStyle.color = '#6B7280'

    loginXdata.value.forEach((ele) => {
      ele.textStyle.color = '#6B7280'
    })
  }
})

watch(
  () => appStore.isDark,
  (val) => {
    if (val) {
      cardCellColor.value = ''
      login_option.value.backgroundColor = '#1D1E1F'
      login_option.value.legend.textStyle.color = '#6B7280'
      loginXdata.value.forEach((ele) => {
        ele.textStyle.color = '#6B7280'
      })
    } else {
      cardCellColor.value = 'rgb(0 0 0 / 64.7%)'
      login_option.value.backgroundColor = 'white'
      login_option.value.legend.textStyle.color = '#656565'
      loginXdata.value.forEach((ele) => {
        ele.textStyle.color = 'rgba(0, 0, 0, 0.647058823529412)'
      })
    }
  }
)

watch(
  () => pickerValue.value,
  async (val) => {
    if (!val) return
    let date = val?.[0] + ',' + val?.[1]
    loading.value = true
    let res = await getTableList('example_sytj_dlsyrs', { date: date })

    let dlsyrs = res.records
    if (dlsyrs && dlsyrs.length > 0) {
      loginXdata.value = []
      loginX.value = []
      loginSeries1.value = []
      loginSeries2.value = []
      dlsyrs.forEach((ele) => {
        loginX.value.push(ele.date)
        loginSeries1.value.push(ele.login_num)
        loginSeries2.value.push(ele.users_num)
      })

      loginX.value.forEach((ele) => {
        if (val?.[0] == val?.[1]) {
          loginXdata.value.push({
            value: ele + ':00',
            textStyle: loginXutil.value
          })
        } else {
          loginXdata.value.push({
            value: ele,
            textStyle: loginXutil.value
          })
        }
      })

      login_option.value.xAxis.data = loginXdata.value
      login_option.value.series[0].data = loginSeries1.value
      login_option.value.series[1].data = loginSeries2.value
      loading.value = false
    }
  }
)
</script>

<style lang="scss" scoped>
h5,
p {
  padding: 0;
  margin: 0;
}

.search-top {
  ::v-deep(.el-select) {
    .el-select__wrapper {
      min-height: 32px;
    }
  }

  ::v-deep(.el-date-editor) {
    width: 280px;

    .el-range__icon {
      font-size: 12px;
    }

    .el-range-input {
      font-size: 12px;
      color: #666;
    }

    .el-range-separator {
      font-size: 12px;
      color: #999;
    }
  }
}

::v-deep(.avue-crud) {
  .el-form {
    .el-table__inner-wrapper {
      .el-table__header-wrapper {
        .el-table__cell {
          height: 57px;

          .cell {
            font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le Regular', 'Microsoft Tai Le',
              sans-serif;
            color: v-bind('cardCellColor');
          }
        }
      }

      .el-table__body {
        .el-table__row {
          height: 57px;

          &:last-child {
            .el-table__cell {
              border-bottom: none;
            }
          }
        }
      }

      &::before {
        height: 0;
      }
    }
  }
}
</style>

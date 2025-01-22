<template>
  <div class="w-100%">
    <div class="search w-100%">
      <p class="title">店铺业绩</p>
      <div>
        <el-input
          v-model="input1"
          style="width: 650px; height: 82px; font-size: 20px"
          size="large"
          placeholder="输入货品编号搜索..."
          :prefix-icon="Search"
        />
      </div>
    </div>
    <div class="w-100% head">
      <template v-for="(item, index) in dpyjData" :key="index">
        <div
          v-if="index == 0"
          class="head-box .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent"
        >
          <p class="font color1" style="font-size: 16px">{{ item.title }}</p>
          <p class="font-family color2 text .dark:c-#fff!"
            ><avue-count-up :end="item.num" :decimals="2"></avue-count-up
          ></p>
          <div class="bottom">
            <div class="bottom-left">
              <div style="margin-top: 11px">
                <img src="../../../public/img/xs1.png" alt="" />
                <span class="font color1" style="margin-left: 10px; font-size: 14px"
                  >试穿转化率</span
                >
              </div>
              <div style="margin-top: 20px">
                <span class="font" style="font-size: 30px; color: #784af6">{{ item.bf }}%</span>
                <span class="font" style="margin-left: 10px; font-size: 14px; color: #974ddb"
                  >本周{{ item.bz }}%</span
                >
              </div>
            </div>
            <div class="bottom-right">
              <div class="jdt">
                <el-progress type="circle" :percentage="0" :width="84" :show-text="false" />
                <img class="img" src="../../../public/img/jdt.png" alt="" />
                <img class="img1" src="../../../public/img/xs.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="index == 1"
          class="head-box .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent"
        >
          <p class="font color1" style="font-size: 16px">{{ item.title }}</p>
          <p class="font-family color2 title color3">
            <avue-count-up :end="item.num" :decimals="2"></avue-count-up>
          </p>
          <span class="font-family color3" style="margin-left: 20px; font-size: 16px"
            >超额 {{ item.ts }}%</span
          >
          <div class="img-box">
            <img class="src" src="../../../public/img/jdt1.png" alt="" />
            <div style="position: relative">
              <img class="huo" src="../../../public/img/huo.png" alt="" />
              <img
                src="../../../public/img/huo1.png"
                style="position: absolute; top: 12px; left: 16.5px; width: 9px; height: 11px"
              />
            </div>
          </div>
          <div class="bottom">
            <div class="box font" style="font-size: 14px; color: #90a0ba">
              <span>目标金额：</span>
              <span>
                <avue-count-up :end="item.mbje" :decimals="2"></avue-count-up>
              </span>
              <img
                src="../../../public/img/bi.png"
                style="width: 13px; height: 14px; margin-left: 6px"
              />
              <div style="position: relative; margin-top: 10px">
                <span>本周区域销售额：</span>
                <span class="font-family" style="margin-right: 5px; font-size: 16px; color: #fed530"
                  >No.1</span
                >
                <img class="gj-img" src="../../../public/img/gj.png" />
                <img class="gj1-img" src="../../../public/img/gj1.png" />
                <img class="gj2-img" src="../../../public/img/gj2.png" />
              </div>
            </div>
            <div>
              <div class="an"
                ><Icon icon="uiw:arrow-right" width="512" height="512" style="color: #fcfbff"
              /></div>
            </div>
          </div>
        </div>
        <div v-else class="head-box .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
          <div class="tb">
            <img src="../../../public/img/tb.png" />
            <img class="tb2-img" src="../../../public/img/tb2.png" />
            <img class="tb4-img" src="../../../public/img/tb4.png" />
            <img class="tb3-img" src="../../../public/img/tb3.png" />
            <img class="tb-img" src="../../../public/img/tb1.png" />
          </div>
          <p class="font color1" style="font-size: 16px">{{ item.title }}</p>
          <p class="font-family color2 title .dark:c-#fff!"
            ><avue-count-up :end="item.num" :decimals="2"></avue-count-up
          ></p>
          <span class="font" style="margin-left: 20px; font-size: 16px; color: #9baac0"
            >已完 {{ item.ts }}%</span
          >
          <div style="width: 88%; margin-top: 12px">
            <el-progress
              :percentage="80"
              :show-text="false"
              :stroke-width="10"
              :color="'#784af6'"
            />
          </div>
          <div class="bottom">
            <div class="box font" style="margin-top: 20px; font-size: 14px; color: #90a0ba">
              <span>目标金额：</span>
              <span><avue-count-up :end="item.mbje" :decimals="2"></avue-count-up></span>
              <img
                src="../../../public/img/bi.png"
                style="width: 13px; height: 14px; margin-left: 6px"
              />
              <div style="position: relative; margin-top: 10px">
                <span>本周区域销售额：</span>
                <span class="font-family color4" style="margin-right: 5px; font-size: 16px"
                  >No.6</span
                >
              </div>
            </div>
            <div>
              <div class="an bj" style="margin-top: 45px"
                ><Icon icon="uiw:arrow-right" width="512" height="512" style="color: #2f3642"
              /></div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="Main w-100%">
      <div class="Main-left .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <p class="title .dark:c-#fff!">销售数据</p>
        <div id="Main-xssj" style="width: 100%; height: 500px"></div>
      </div>
      <div class="Main-content .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <p class="title .dark:c-#fff!">本周数据详情</p>
        <p class="text">{{ title }}</p>
        <div id="bzsjMain" style="width: 100%; height: 200px"></div>
        <div class="list">
          <div class="list-box w-48%" v-for="(item, index) in listData" :key="index">
            <p class="list-box-title font">{{ item.title }}</p>
            <p class="list-box-num font-family" :class="{ acitive: index == 3 }">{{ item.num }}</p>
            <el-button>详情</el-button>
          </div>
        </div>
      </div>
      <div class="Main-right .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <p class="bt font">上周综合提升</p>
        <div class="box W-100%">
          <div class="box-1">
            <span class="font-family">{{ szzhtsData.xse }}</span>
            <span style="font-size: 13px !important"
              ><Icon icon="mdi:arrow-up" width="512" height="512" style="color: #ff3054"
            /></span>
          </div>
          <div class="box-2">
            <span class="font-family">{{ szzhtsData.xsl }}</span>
            <span style="font-size: 10px !important"
              ><Icon icon="mdi:arrow-up" width="512" height="512" style="color: #ff0054"
            /></span>
          </div>
          <div class="box-3">
            <span class="font-family">{{ szzhtsData.sczh }}</span>
            <span style="font-size: 13px !important"
              ><Icon icon="mdi:arrow-up" width="512" height="512" style="color: #ff3054"
            /></span>
          </div>
        </div>
        <div class="list-title">
          <p class="font" v-for="(item, index) in szzhtsData.list" :key="index">{{ item }}</p>
        </div>
        <div class="img-box">
          <img src="../../../public/img/zhts.png" alt="" />
        </div>
        <div class="w-100% btn">
          <el-button>查看详情</el-button>
        </div>
        <div class="list-box">
          <div class="list-box-center" v-for="(item, index) in bdData" :key="index">
            <div style="display: flex; align-items: center">
              <div class="img" :class="{ 'img-bj1': index == 1, 'img-bj2': index == 2 }">
                <img :src="item.src" alt="" />
              </div>
              <p class="bd-title font .dark:c-#cfd3dc!">{{ item.title }}</p>
            </div>
            <div class="img-image" v-if="index != 1">
              <el-image style="width: 36px; height: 36px; margin-right: 10px" :src="url" />
              <el-image style="width: 36px; height: 36px; margin-right: 10px" :src="url" />
              <el-image style="width: 36px; height: 36px; margin-right: 10px" :src="url" />
              <Icon icon="teenyicons:right-outline" width="512" height="512" style="color: #ccc" />
            </div>
            <div style="margin-right: 0" v-else>
              <span
                style="
                  padding: 5px 10px;
                  margin-right: 10px;
                  color: #fff;
                  background: #ff2f54;
                  border-radius: 5px;
                "
                >NEW</span
              >
              <Icon icon="teenyicons:right-outline" width="512" height="512" style="color: #ccc" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { batchGetTableList } from '@/api/design/report'

interface BzsjSeries {
  dictionary: string
  percentage: string
  name: string
  num?: number
  value?: number
}

const input1 = ref('')
const url = '/img/sjsy1.jpeg'

const dpyjData = ref([
  { title: '今日销售额/元', num: 0, bf: 0, bz: 0, dictionary: 'jrxse' },
  { title: '本周销售额/元', num: 0, ts: 0, mbje: 0, dictionary: 'bzxse' },
  { title: '本月销售额/元', num: 0, ts: 0, mbje: 0, dictionary: 'byxse' },
  { title: '本月销售额/元', num: 0, ts: 0, mbje: 0, dictionary: 'bnxse' }
])

const listData = reactive([
  { title: '连单率/%', num: '', dictionary: 'ldv' },
  { title: '一件单量/件', num: '', dictionary: 'yjdl' },
  { title: '大单量/件', num: '', dictionary: 'ddl' },
  { title: '高价单品/件', num: '', dictionary: 'gjdp' }
])

const bdData = ref<any>([
  {
    title: '销售榜单',
    src: '/img/bd1.png',
    list: [{ src: '/img/sjsy1.jpeg' }, { src: '/img/sjsy1.jpeg' }, { src: '/img/sjsy1.jpeg' }]
  },
  {
    title: '我要行动',
    src: '/img/bd2.png',
    list: []
  },
  {
    title: '销售榜单',
    src: '/img/bd3.png',
    list: [{ src: '/img/sjsy1.jpeg' }, { src: '/img/sjsy1.jpeg' }, { src: '/img/sjsy1.jpeg' }]
  }
])

//销售数据
const xssjXAxis = ref<string[]>([])
const xssjSeries1 = ref<number[]>([])
const xssjSeries2 = ref<number[]>([])
const xssjSeries3 = ref<any>([])
const xssjOption = reactive<any>({
  grid: {
    top: '15%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  // tooltip: {
  //     trigger: 'axis'
  // },
  legend: {
    data: ['试穿转化率'],
    right: 0,
    top: '40',
    textStyle: {
      // 设置图例字体颜色
      color: '#9caac1' // 红色
    }
  },
  xAxis: {
    type: 'category',
    data: xssjXAxis.value
  },
  yAxis: {
    type: 'value',
    name: '金额/元',
    nameTextStyle: {
      color: '#90a0ba'
    },
    axisLabel: {
      formatter: '{value} k' // 设置Y轴的显示单位为'单位'
    }
  },
  series: [
    {
      name: '试穿转化率',
      type: 'line',
      showSymbol: false,
      stack: 'b',
      symbol: 'circle',
      connectNulls: true,
      data: xssjSeries1.value,
      lineStyle: {
        color: '#ffc557', // 折线颜色
        width: 2
      },
      itemStyle: {
        normal: {
          color: '#ffc557',
          borderColor: '#ffc557', // 折点边框颜色
          borderWidth: 0 // 折点边框宽度
        }
      }
    },
    {
      name: '柱形图',
      type: 'bar',
      stack: 'a',
      barWidth: '24px',
      color: ['#784af6'],
      data: xssjSeries2.value
    },
    {
      name: 'c',
      type: 'bar',
      stack: 'a',
      barWidth: '24px',
      itemStyle: {
        borderRadius: [10, 10, 0, 0], // 这里设置圆角的大小
        normal: {
          color: function (params) {
            // 定义渐变色
            var colorList = [
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#eb336b' },
                { offset: 0.5, color: '#eb336b' },
                { offset: 1, color: '#784af6' }
              ])
            ]
            return colorList[params.dataIndex % colorList.length]
          }
        }
      },
      color: ['#e23576'],
      data: xssjSeries3.value
    }
  ]
})

//本周数据
const bzsjSeries = ref<BzsjSeries[]>([
  { value: 0, num: 0, name: '提衣次数', dictionary: 'tycs', percentage: 'tycszhl' },
  { value: 0, num: 0, name: '试穿次数', dictionary: 'sccs', percentage: 'sccszhl' },
  { value: 0, num: 0, name: '销售数量', dictionary: 'xssl', percentage: 'xsslzhl' }
])
const title = ref('提衣、试穿、销售转化')
const bzsjOption = reactive<any>({
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['访问来源'],
    textStyle: {
      fontSize: 16,
      fontFamily: `'ArialMT', 'Arial'`
    }
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    containLabel: true
  },
  series: [
    {
      type: 'funnel',
      left: '-18%',
      top: 10,
      bottom: 40,
      width: '100%',
      min: 0,
      max: 2000,
      minSize: '20%',
      maxSize: '80%',
      sort: 'descending',
      z: 1,
      gap: 0,
      color: ['#784af6', '#936ef8', '#ae92fa'],
      label: {
        show: true,
        position: 'right',
        color: '#90a0ba',
        formatter: '{b} : {c}'
      },
      labelLine: {
        show: false // 隐藏标签线
      },
      itemStyle: {
        borderWidth: 0
      },
      data: bzsjSeries.value
    },
    {
      type: 'funnel',
      left: '-18%',
      top: 10,
      bottom: 40,
      width: '100%',
      min: 0,
      max: 2000,
      minSize: '20%',
      maxSize: '80%',
      sort: 'descending',
      gap: 0,
      color: ['#784af6', '#936ef8', '#ae92fa'],
      label: {
        show: true,
        position: 'inside',
        color: '#fff',
        formatter: function (params) {
          // params 是一个包含数据项的对象
          return params.data.num + '%'
        }
      },
      labelLine: {
        show: false // 隐藏标签线
      },
      itemStyle: {
        borderWidth: 0
      },
      data: bzsjSeries.value
    }
  ]
})

//上周综合提升
const szzhtsData = ref<any>({
  xse: '0',
  xsl: '0',
  sczh: '0',
  list: ['销售量', '销售额', '试穿转化']
})

const stackInfo = {}

const echartFun = () => {
  for (let i = 0; i < xssjOption.series[0].data.length; ++i) {
    for (let j = 0; j < xssjOption.series.length; ++j) {
      const stackName = xssjOption.series[j].stack
      if (!stackName) {
        continue
      }
      if (!stackInfo[stackName]) {
        stackInfo[stackName] = {
          stackStart: [],
          stackEnd: []
        }
      }
      const info = stackInfo[stackName]
      const data = xssjOption.series[j].data[i]
      if (data && data !== '-') {
        if (info.stackStart[i] == null) {
          info.stackStart[i] = j
        }
        info.stackEnd[i] = j
      }
    }
  }
  for (let i = 0; i < xssjOption.series.length; ++i) {
    const data = xssjOption.series[i].data
    const info = stackInfo[xssjOption.series[i].stack]
    for (let j = 0; j < xssjOption.series[i].data.length; ++j) {
      // const isStart = info.stackStart[j] === i;
      const isEnd = info.stackEnd[j] === i
      const topBorder = isEnd ? 20 : 0
      const bottomBorder = 0
      data[j] = {
        value: data[j],
        itemStyle: {
          borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
        }
      }
    }
  }
  const xsssjChart = echarts.init(document.getElementById('Main-xssj'))
  xsssjChart.setOption(xssjOption)
  const bzsjChart = echarts.init(document.getElementById('bzsjMain'))
  bzsjChart.setOption(bzsjOption)
}

const init = async () => {
  let oneres = await batchGetTableList(
    'example_datahome_store_performance,example_datahome_sales_data,example_datahome_thisweek_data,example_datahome_lastweek_data'
  )

  let storePerformance = oneres.example_datahome_store_performance.records[0]
  let salesData = oneres.example_datahome_sales_data.records
  let thisweekData = oneres.example_datahome_thisweek_data.records[0]
  let lastweekData = oneres.example_datahome_lastweek_data.records[0]
  salesData.forEach((ele) => {
    xssjXAxis.value.push(ele.sj)
    xssjSeries1.value.push(ele.sczhl)
    xssjSeries2.value.push(ele.je)
    ele.rje ? xssjSeries3.value.push(ele.rje) : xssjSeries3.value.push('-')
  })
  dpyjData.value = dpyjData.value.map((item) => {
    return (item = {
      ...item,
      ...storePerformance[item.dictionary]
    })
  })

  bzsjSeries.value = bzsjSeries.value.map((item) => {
    return (item = {
      ...item,
      value: thisweekData[item.dictionary],
      num: thisweekData[item.percentage]
    })
  })
  bzsjOption.series[0].data = bzsjSeries.value
  bzsjOption.series[1].data = bzsjSeries.value
  listData.forEach((ele) => {
    ele.num = thisweekData[ele.dictionary]
  })
  let lastweekDataKeys = Object.keys(lastweekData)
  lastweekDataKeys.forEach((ele) => {
    szzhtsData.value[ele] = lastweekData[ele]
  })
}

onMounted(async() => {
  await init()
  echartFun()
})
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}

.search {
  display: flex;
  justify-content: space-between;
  height: 82px;
  margin-bottom: 26px;

  .title {
    font-family: ArialMT, Arial;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    color: #90a0ba;
    white-space: nowrap;
  }
}

.head {
  display: flex;
  // justify-content: space-between;
  gap: 40px;

  > .head-box {
    flex: 1;
  }

  .head-box {
    position: relative;
    // width: 350px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;

    .tb {
      position: absolute;
      right: 30px;
      width: 41px;
      height: 46px;
      // background: red;
    }

    .tb-img {
      position: absolute;
      top: 8px;
      right: 7.5px;
      width: 26px;
      height: 29px;
    }

    .tb2-img {
      position: absolute;
      top: 29px;
      right: -3.5px;
      width: 48px;
      height: 7px;
    }

    .tb3-img {
      position: absolute;
      top: 29px;
      right: 15px;
      width: 11px;
      height: 11px;
    }

    .tb4-img {
      position: absolute;
      top: 28px;
      right: 10px;
      width: 22px;
      height: 14px;
    }

    .text {
      display: inline-block;
      margin: 13px 0;
      font-size: 48px;
    }

    .title {
      display: inline-block;
      margin-top: 13px;
      font-size: 48px;
    }

    .img-box {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 5px;

      .src {
        width: 88%;
        height: 10px;
      }

      .huo {
        width: 20px;
        height: 24px;
        margin-left: 10px;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;

    .bottom-left {
      img {
        width: 20px;
        height: 14px;
      }
    }

    .bottom-right {
      position: relative;

      .jdt {
        width: 84px;
        height: 84px;

        .img {
          position: absolute;
          top: -13px;
          right: -13px;
          width: 110px;
          height: 110px;
        }

        .img1 {
          position: absolute;
          top: 30px;
          left: 28px;
          width: 31px;
          height: 23px;
        }
      }
    }

    .box {
      margin-top: 10px;

      .gj-img {
        position: absolute;
        width: 28px;
        height: 25px;
        margin-top: -5px;
        transform: rotate(31deg);
      }

      .gj1-img {
        position: absolute;
        bottom: 3px;
        left: 161.5px;
      }

      .gj2-img {
        position: absolute;
        bottom: 5.5px;
        left: 162.5px;
        transform: rotate(31deg);
      }
    }

    .an {
      width: 48px;
      height: 24px;
      margin-top: 30px;
      margin-right: 18px;
      line-height: 27px;
      text-align: center;
      background: #784af6;
      border-radius: 3px;
    }
  }
}

.Main {
  display: flex;
  gap: 40px;
  // justify-content: space-between;
  margin-top: 40px;

  .title {
    margin-left: 24px;
    font-family: ArialMT, Arial;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 60px;
    color: #2d3440;
  }

  .text {
    margin-left: 40px;
    font-family: ArialMT, Arial;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    color: #90a0ba;
  }

  .Main-left {
    flex: 2.13;
    // width: 37%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
  }

  .Main-content {
    flex: 1;
    // width: 27%;
    padding: 20px 10px;
    background: #fff;
    border-radius: 10px;

    .list {
      display: flex;
      flex-wrap: wrap;

      .list-box:nth-child(1) {
        border-right: 2px solid #eceef3;
        border-bottom: 2px solid #eceef3;
        // border-image: linear-gradient(to bottom, #fff, #eceef3) 4;
        // border-image: linear-gradient(to right, #fff, #eceef3) 2 ;
      }

      .list-box:nth-child(2) {
        border-bottom: 2px solid #eceef3;
        // border-image: linear-gradient(to left, #fff, #eceef3) 4;
      }

      .list-box:nth-child(3) {
        // border-top: 2px solid #eceef3;
        // border-image: linear-gradient(to right, #fff, #eceef3) 4;
      }

      .list-box:nth-child(4) {
        border-left: 2px solid #eceef3;
        // border-image: linear-gradient(to top, #fff, #eceef3) 4;
      }

      .list-box {
        padding: 20px 0;
        text-align: center;

        ::v-deep .el-button {
          height: 30px;
          padding: 4px 10px;
        }

        .list-box-title {
          font-size: 16px;
          color: #90a0ba;
        }

        .list-box-num {
          margin: 10px 0;
          font-size: 32px;
          color: #ff3054;
        }
      }
    }
  }

  .Main-right {
    flex: 1;
    // width: 27%;
    padding: 20px 10px 0;
    background: #fff;
    border-radius: 10px;

    .bt {
      line-height: 60px;
      color: #90a0ba;
      text-align: center;
    }

    .box {
      position: relative;
      margin: auto;

      .box-1 {
        position: absolute;
        top: -10px;
        left: 128px;
        width: 112px;
        height: 112px;
        font-size: 28px;
        line-height: 112px;
        color: #ff3054;
        text-align: center;
        background: #fef5f9;
        border-radius: 50%;
      }

      .box-2 {
        position: absolute;
        top: 80px;
        left: 70px;
        width: 64px;
        height: 64px;
        line-height: 64px;
        color: #ff3054;
        text-align: center;
        background: #fef5f9;
        border-radius: 50%;
      }

      .box-3 {
        position: absolute;
        top: 80px;
        left: 235px;
        width: 64px;
        height: 64px;
        line-height: 64px;
        color: #ff3054;
        text-align: center;
        background: #fef5f9;
        border-radius: 50%;
      }
    }
  }

  .list-title {
    position: relative;
    z-index: 999999999999999999999999;
    display: flex;
    width: 264px;
    margin: 150px 40px 0;
    font-size: 14px;
    color: #90a0ba;
    // justify-content: space-around;
    gap: 10px;

    .font {
      margin-left: 20px;
      flex: 1;
      text-align: right;
    }
  }

  .img-box {
    width: 294px;
    height: 71px;
    margin: -22px 36px 0;

    img {
      width: 294px;
      height: 71px;
    }
  }

  .btn {
    padding-bottom: 15px;
    margin: 10px;
    margin-left: -4px;
    text-align: center;
    // border-bottom:3px dashed #f3f3f3;

    ::v-deep .el-button {
      height: 32px;
      padding: 4px 16px;
    }
  }

  .list-box {
    // margin: 10px ;
    padding: 0 20px;

    .list-box-center {
      display: flex;
      line-height: 90px;
      border-top: 3px dashed #f3f3f3;
      align-items: center;
      justify-content: space-between;

      .img {
        display: flex;
        width: 46px;
        height: 46px;
        background: #c55eff;
        border-radius: 50%;
        justify-content: center;
        align-items: center;

        img {
          width: 24px;
          height: 25px;
        }
      }

      .bd-title {
        width: 65px;
        margin: 0 20px;
        color: #2d3440;
      }

      .img-image {
        display: flex;
        min-width: 150px;
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
}

::v-deep .el-input--large .el-input__wrapper {
  border-radius: 20px;
}

.font {
  font-family: ArialMT, Arial;
  font-weight: 400;
}

.font-family {
  font-family: Arial-BoldMT, 'Arial Bold', Arial;
  font-weight: 700;
}

.bj {
  background: #f5f8fb !important;
}

.color1 {
  color: #90a0ba;
}

.color2 {
  color: #2d3440;
}

.color3 {
  color: #ff4c6d !important;
}

.color4 {
  color: #784af6;
}

.acitive {
  color: #94a4bc !important;
}

.img-bj1 {
  background: #ff926d !important;
}

.img-bj2 {
  background: #784af6 !important;
}
</style>

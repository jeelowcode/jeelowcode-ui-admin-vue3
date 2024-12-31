<template>
  <div class="summary-top-content">
    <el-row :gutter="10" class="gap-y-10px">
      <el-col v-for="item in summaryList" :key="item.label" :span="item.span">
        <!-- 文本 -->
        <template v-if="item.control == 'text'">
          <div class="content-item">
            <div class="item-title">{{ item.label }}：</div>
            <div class="item-child">
              <div class="child-text" v-for="(child, i) in item.children" :key="i">{{ child }}</div>
            </div>
          </div>
        </template>
        <template v-if="item.control == 'card'">
          <div class="data-box">
            <el-row :span="24">
              <el-col
                :md="item.cardOption.span"
                :xs="24"
                :sm="12"
                v-for="(child, index) in item.cardOption.data"
                :key="index"
              >
                <div class="item">
                  <a
                    :href="child.href"
                    @click="child.click && child.click(child)"
                    :target="child.target"
                  >
                    <div class="item-icon" :style="{ backgroundColor: child.color }">
                      <Icon :size="48" :icon="child.icon" />
                    </div>
                    <div class="item-info">
                      <avue-count-up
                        :animation="child.animation"
                        :decimals="child.decimals"
                        :style="{ color: child.color }"
                        class="title"
                        :end="child.count"
                      ></avue-count-up>
                      <div class="info">{{ child.title }}</div>
                    </div>
                  </a>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
        <!-- echarts图表 -->
        <template v-if="echartsType.includes(item.control)">
          <div class="w-100% h-100% pl-10px pr-10px">
            <div
              :class="`summary_top_${item.prop}`"
              :style="item.chartStyle"
              class="w-100% h-200px"
              :id="item.prop"
            >
            </div>
          </div>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

interface Props {
  summaryList: Array<any>
}
const props = defineProps<Props>()
const echartsType = ['line', 'bar', 'pie']
const echartObj = markRaw({})

const initEcharts = () => {
  props.summaryList.forEach((item) => {
    if (echartsType.includes(item.control)) {
      const dom = document.getElementById(item.prop)
      echartObj[item.prop] = echarts.init(dom)
      echartObj[item.prop].setOption(item.chartOption)
    }
  })
}

watch(
  () => props.summaryList,
  (list) => {
    if (list.length) {
      setTimeout(() => {
        initEcharts()
      }, 300)
    }
  },
  { deep: true, immediate: true }
)

defineExpose({ echartObj })
</script>

<style lang="scss" scoped>
.summary-top-content {
  .content-item {
    display: flex;

    .item-title {
      flex-shrink: 0;
      flex-grow: 0;
      font-size: 16px;
    }

    .item-child {
      display: flex;
      padding-top: 2px;
      flex-wrap: wrap;
      gap: 10px;
      flex-grow: 1;
      font-size: 14px;
      white-space: pre-wrap;
    }
  }
}
</style>

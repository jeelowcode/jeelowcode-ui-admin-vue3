<template>
  <!-- tabs标签页风格表单开发示例 -->
   <div class="w-100%">
      <div class="box">
        <div class="box-header">
          <el-radio-group v-model="radio" >
            <template v-for="item in tabsPaneList" :key="item.name">
              <el-radio-button :label="item.label" :value="item.name" />
            </template>
          </el-radio-group>
        </div>
        <div style="padding: 20px 40px;">
          <template v-for="item in tabsPaneList" :key="item.name">
            <LowTable
              v-if="item.name == radio"
              :ref="(el) => (tableRef[item.name] = el)"
              :tableId="item.tableId"
              :calcHeight="item.calcHeight || undefined"
              :enhanceData="item.enhanceData"
            ></LowTable>
          </template>
        </div>
      </div>
   </div>
  <!-- <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
    <template v-for="item in tabsPaneList" :key="item.name">
      <el-tab-pane :label="item.label" :name="item.name">
        <LowTable
          :ref="(el) => (tableRef[item.name] = el)"
          :tableId="item.tableId"
          :calcHeight="item.calcHeight || undefined"
          :enhanceData="item.enhanceData"
        ></LowTable>
      </el-tab-pane>
    </template>
  </el-tabs> -->
</template>

<script setup lang="ts">
import { LowTable } from '@/components/LowDesign/index'

defineOptions({ name: 'TabsCardForm' })

const radio = ref('qbgd')
const activeName = ref('qbgd')
const tableRef = ref({})

const tabsPaneList = ref([
  {
    label: '全部工单',
    name: 'qbgd',
    tableId: '1844620967619866625',
    enhanceData: { hideHeader: 'disabled' }
  },
  { label: '我发起的', name: 'wfqd', tableId: '1844620967619866625	', calcHeight: 200 },
  { label: '提交给我的', name: 'tjgwd', tableId: '1844620967619866625	', calcHeight: 200 },
  { label: '抄送给我的', name: 'csgwd', tableId: '1844620967619866625	', calcHeight: 200 },
])

const handleClick = (tab) => {
  const key = tab.props.name
  if (key == 'wfqd' && tableRef.value[key]){
    tableRef.value[key].initTableLayout()
  } else if (key == 'tjgwd' && tableRef.value[key]){
    tableRef.value[key].initTableLayout()
  } else if (key == 'csgwd' && tableRef.value[key]){
    tableRef.value[key].initTableLayout()
  }
}
</script>

<style lang="scss" scoped>
.box{
  overflow: hidden;
  background: #fff;
  border: 1px solid rgb(233 233 233 / 100%) ;
  border-radius: 10px;

  .box-header{
    display: flex;
    height: 60px;
    padding: 0 30px;
    background: #f9f9f9;
    align-items: center;
    
    ::v-deep .el-radio-button{
      // height: 35px;

      .el-radio-button__inner{
        padding: 10px 15px;
        font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-style: normal;
        font-weight: 400;
        color: #999;
      }

      .el-radio-button__original-radio:checked+.el-radio-button__inner{
        color: #fff;
      }
    }
  }
}
// .demo-tabs > .el-tabs__content {
//   padding: 32px;
//   font-size: 32px;
//   font-weight: 600;
//   color: #6b778c;
// }

// .demo-tabs {
//   ::v-deep(.el-tabs__nav-wrap) {
//     .el-tabs__item {
//       height: 50px;
//       font-size: 16px;
//     }
//   }
// }

// ::v-deep .el-tabs__item.is-active {
//   color:#fff !important;
//   background-color: #409eff !important; /* 你想要的高亮颜色 */
// }
</style>

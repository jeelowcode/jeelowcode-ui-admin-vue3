<template>
  <!-- tabs标签页风格表单开发示例 -->
  <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
    <template v-for="item in tabsPaneList" :key="item.name">
      <el-tab-pane :label="item.label" :name="item.name">
        <LowTable
          :ref="(el) => (tableRef[item.name] = el)"
          :tableId="item.formId"
          :calcHeight="item.calcHeight || undefined"
          :enhanceData="item.enhanceData"
        ></LowTable>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script setup lang="ts">
import { LowTable } from '@/components/LowDesign/index'

defineOptions({ name: 'TabsCardForm' })

const activeName = ref('cjje')
const tableRef = ref({})

const tabsPaneList = ref([
  {
    label: '成交金额',
    name: 'cjje',
    formId: '1834136609367400450',
    enhanceData: { hideHeader: 'disabled' }
  },
  { label: '回款金额', name: 'hkje', formId: '1851509263837597697', calcHeight: 200 }
])

const handleClick = (tab) => {
  const key = tab.props.name
  if (key == 'hkje' && tableRef.value[key]) tableRef.value[key].initTableLayout()
}
</script>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.demo-tabs {
  ::v-deep(.el-tabs__nav-wrap) {
    .el-tabs__item {
      height: 50px;
      font-size: 16px;
    }
  }
}
</style>

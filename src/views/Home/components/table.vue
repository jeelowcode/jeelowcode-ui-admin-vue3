<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :header-cell-style="{
        height: '50px',
        fontFamily: `'微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important`,
        fontWeight: ' 700 !important',
        color: '#666666 !important'
      }"
      :cell-style="{
        height: '50px',
        fontFamily: `'微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important`,
        fontWeight: ' 400 !important',
        color: '#666666 !important'
      }"
    >
      <el-table-column prop="ranking" label="排名" width="180" />
      <el-table-column prop="name" label="商户名称" />
      <el-table-column prop="visit" label="访问量" />
      <el-table-column prop="quantity" label="订单量" />
      <el-table-column prop="cancel" label="取消量" />
      <el-table-column label="综合评分">
        <template #default="scope">
          <el-rate
            v-model="scope.row.pj"
            disabled
            allow-half
            show-score
            size="large"
            :score-template="scope.row.score"
          />
        </template>
      </el-table-column>
      <el-table-column label="成交金额（元）">
        <template #default="scope">
          <div v-if="scope.row.zeng" style="display: flex; align-items: center; height: 12px">
            <span>{{ scope.row.money }}</span>
            <span class="icon"
              ><Icon icon="ep:top" width="12" height="12" style="color: #f56c6c"
            /></span>
            <span style="color: #f7716f !important">{{ scope.row.zeng }}%</span>
          </div>
          <div v-else-if="scope.row.jian" style="display: flex; align-items: center; height: 12px">
            <span>{{ scope.row.money }}</span>
            <span class="icon"
              ><Icon icon="ep:bottom" width="12" height="12" style="color: #19be6b"
            /></span>
            <span style="color: #73c883 !important">{{ scope.row.jian }}%</span>
          </div>
          <div v-else>
            <span>{{ scope.row.money }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination background layout="prev, pager, next" :total="tableDataTotal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as TableApi from '@/api/design/table'

interface TableData {
  cancel: string
  ranking: string
  name: string
  visit: string
  quantity: string
  pj: string
  score: string
  money: string
  zeng: string
  jian: string
}

const tableData = ref<TableData[]>()
const tableDataTotal = ref(0)

onMounted(async () => {
  let { records } = await TableApi.getTableList(
    '1847537155101040642',
    { pageNo: 1, pageSize: 10 },
    false
  )
  tableData.value = records.map((item) => {
    item.pj = Number(item.pj || 0)
    return item
  })
  tableDataTotal.value = records.length
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: center;
}

.icon {
  margin-top: 4px;
}

/* 将默认的星星颜色改为蓝色 */
::v-deep .el-rate .el-rate__icon.is-active {
  color: #f56c6c !important;
}

::v-deep .custom-rate .el-rate__item.active {
  color: #f56c6c; /* 选中的颜色 */
}

::v-deep .el-rate .el-rate__item {
  color: #ccc;
}
</style>

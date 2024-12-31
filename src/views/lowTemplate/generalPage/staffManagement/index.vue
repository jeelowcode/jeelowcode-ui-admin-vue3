<template>
  <div>
    <el-card class="card-box">
      <template #header>
        <div class="card-header">
          <span>员工管理</span>
        </div>
      </template>
      <div class="flex" style="min-height: 450px">
        <div class="flex-basis-200px flex-shrink-0">
          <avue-tree
            ref="tree"
            :option="option"
            :data="data"
            v-model="form"
            @node-expand="nodeExpand"
            @node-contextmenu="nodeContextmenu"
            @node-click="nodeClick"
          >
          </avue-tree>
        </div>

        <div class="flex-1" style="max-width: calc(100% - 220px)">
          <LowTable tableId="1846121741006647298" :enhanceData="{ type: 'view' }"> </LowTable>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { LowTable } from '@/components/LowDesign/index'
defineOptions({ name: 'StaffManagement' })

import { ElMessage } from 'element-plus'

const form = ref({})
const data = ref([
  {
    value: 0,
    label: '一级部门',
    children: [
      { value: 1, label: '一级部门1' },
      { value: 2, label: '一级部门2' },
      { value: 3, label: '一级部门3' },
      { value: 4, label: '一级部门4' }
    ]
  },
  {
    value: 3,
    label: '二级部门',
    children: [
      { value: 4, label: '二级部门1' },
      { value: 5, label: '二级部门2' }
    ]
  }
])

const option = ref({
  defaultExpandAll: true,
  filter: false,
  formOption: {
    labelWidth: 100,
    column: [
      { label: '自定义项', prop: 'label' },
      { label: '测试', prop: 'test' }
    ]
  }
})

const tree = ref()

onMounted(() => {
  tree.value.setCurrentKey(0)
})

const nodeContextmenu = (data) => {
  ElMessage.success(JSON.stringify(data))
}
const nodeExpand = (data) => {
  ElMessage.success(JSON.stringify(data))
}

const nodeClick = (data) => {
  ElMessage.success(JSON.stringify(data))
}
</script>

<style lang="scss" scoped>
::v-deep(.el-card) {
  &.card-box {
    border-radius: 10px;
  }

  .el-card__header {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #666;
    background-color: #f9f9f9;

    // .el-card__body { }
  }
}

::v-deep(.el-tree) {
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: white;
  }

  .el-tree-node__content {
    height: 40px;

    .el-tree-node__expand-icon {
      font-size: 16px;
    }

    .el-tree-node__label {
      font-family: '微软雅黑', sans-serif;
    }
  }
}
</style>

<template>
  <vxe-table
    ref="vxeTableRef"
    :class="tabItem.key + '-vxe-table'"
    :border="true"
    size="small"
    show-overflow="tooltip"
    height="356"
    :row-config="{ isHover: true }"
    :edit-config="{ trigger: 'dblclick', mode: 'row', showIcon: false }"
    :data="tableData"
    :scroll-y="{ enabled: true }"
    :checkbox-config="checkboxConfig || {}"
    :row-class-name="rowClassName"
    @checkbox-all="(obj) => emit('selection-change', obj)"
    @checkbox-change="(obj) => emit('selection-change', obj)"
    @cell-click="(obj) => emit('cell-click', obj)"
  >
    <vxe-column v-if="tabItem.edit" type="checkbox" width="50" align="center"></vxe-column>
    <vxe-column type="seq" width="50" align="center"></vxe-column>
    <vxe-column v-if="tabItem.edit" key="customDrag" field="customDrag" width="50" align="center">
      <template #default="{ rowIndex }">
        <el-dropdown
          trigger="hover"
          placement="bottom"
          @command="(obj) => emit('dropdown-command', obj)"
        >
          <div>
            <Icon :size="20" icon="gg:menu-grid-r" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{ index: rowIndex, type: 'up' }" :disabled="rowIndex == 0"
                >向上移</el-dropdown-item
              >
              <el-dropdown-item
                :command="{ index: rowIndex, type: 'down' }"
                :disabled="rowIndex == tableData.length - 1"
                >向下移</el-dropdown-item
              >
              <el-dropdown-item :command="{ index: rowIndex, type: 'add' }"
                >插入一行</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </vxe-column>
    <vxe-column v-for="(item, key) in column" :key="key" :field="key" v-bind="item"></vxe-column>
  </vxe-table>
</template>

<script setup lang="ts">
defineOptions({ name: 'InfoVxeTable' })

interface Props {
  tabItem: any
  column: object
  rowClassName?: string | Function
  checkboxConfig?: object
}
const props = defineProps<Props>()
const tableData = defineModel<Array<any>>({ default: [] })
const emit = defineEmits(['selection-change', 'cell-click', 'dropdown-command'])

const vxeTableRef = ref()

defineExpose({ vxeTableRef })
</script>

<style lang="scss" scoped>
.view-vxe-table {
  ::v-deep(.vxe-table--header) {
    .vxe-header--column {
      position: relative;

      .vxe-cell {
        .vxe-cell-title-suffix-icon {
          position: absolute;
          top: 5px;
          right: -2px;
        }
      }
    }
  }
}
</style>

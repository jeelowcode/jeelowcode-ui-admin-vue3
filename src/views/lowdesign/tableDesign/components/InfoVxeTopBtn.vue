<template>
  <div class="mb-10px">
    <el-button :size="size" type="primary" icon="el-icon-plus" @click.stop="emit('cell-add')">
      新增
    </el-button>
    <el-button :size="size" type="danger" @click.stop="emit('del-data')" :disabled="!selectNum">
      <Icon :size="16" icon="mi:delete" class="mr-3px" />批量删除
    </el-button>
    <el-button @click.stop="emit('order-data')">调整排序</el-button>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'InfoVxeTopBtn' })

interface Props {
  selectNum: number
  tabItem: any
  size: string
}
const props = defineProps<Props>()
const emit = defineEmits(['cell-add', 'del-data', 'order-data'])
</script>

<style lang="scss" scoped></style>

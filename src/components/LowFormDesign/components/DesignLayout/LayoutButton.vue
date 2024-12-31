<template>
  <div class="layout-button">
    <el-button
      title="复制"
      plain
      circle
      type="primary"
      @click.stop="emit('copy-column')"
      class="copy"
    >
      <Icon :size="14" icon="solar:copy-outline"></Icon>
    </el-button>
    <el-popconfirm v-if="isDelTip" title="是否确认删除" width="120px" @confirm="emit('del-column')">
      <template #reference>
        <el-button title="删除" plain circle type="danger" class="delete">
          <Icon :size="14" icon="mingcute:delete-line"></Icon>
        </el-button>
      </template>
    </el-popconfirm>
    <el-button
      v-else
      title="删除"
      plain
      circle
      type="danger"
      @click.stop="emit('del-column')"
      class="delete"
    >
      <Icon :size="14" icon="mingcute:delete-line"></Icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LayoutButton' })

const props = defineProps({
  type: {
    type: String,
    default: 'item'
  },
  isDelTip: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['copy-column', 'del-column'])

const style = computed(() => {
  let right = 0
  let bottom = 0
  switch (props.type) {
    case 'groupItem':
      right = 0
      bottom = -22
      break
    case 'tableItem':
      right = 0
      bottom = 0
      break
    case 'group':
      right = 15
      bottom = -10
      break
    case 'groupFold':
      right = 15
      bottom = -16
      break
    case 'tabs':
      right = 15
      bottom = -10
      break
    case 'tabsFold':
      right = 15
      bottom = -16
      break
    case 'combo':
      right = 0
      bottom = -13
      break
    default:
      right = 0
      bottom = -30
      break
  }

  return {
    right: `${right}px`,
    bottom: `${bottom}px`
  }
})
</script>

<style lang="scss" scoped>
.layout-button {
  .el-button {
    position: absolute;
    z-index: 1002;
    width: 24px;
    height: 24px;
  }

  .delete {
    right: v-bind('style.right');
    bottom: v-bind('style.bottom');
  }

  .copy {
    right: calc(v-bind('style.right') + 28px);
    bottom: v-bind('style.bottom');
  }
}
</style>

<template>
  <div >
    <div class="box">
      <el-progress :percentage="jdt" :stroke-width="11"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  jdt?: number //控件名称
}
const props =defineProps<Props>()

</script>

<style lang="scss" scoped>
.box{
  margin-top: 8px;
}
</style>
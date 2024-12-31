<template>
  <div>
    <el-steps direction="vertical" align-center>
      <el-step v-for="item in props.data" :key="item.id" title="Step 1">
        <template #icon>
          <div
            class="w-30px h-30px b-1px b-solid rounded-1/2 flex items-center justify-center"
            :style="{ borderColor: item.iconColor }"
          >
            <Icon :icon="item.icon" :style="{ color: item.iconColor }"></Icon>
          </div>
        </template>
        <template #title>
          {{ item.time }}
        </template>
        <template #description>
          <span> {{ item.type }} </span>
          <span class="mr-5px"> : </span>
          <span class="mr-5px"> {{ item.do }} </span>
          <span class="c-#409EFF"> {{ item.content }} </span>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: Object
})
</script>

<style lang="scss" scoped>
::v-deep(.el-steps) {
  height: 280px;

  .el-step {
    .el-step__head {
      width: 30px;

      .el-step__line {
        top: 29px;
        height: calc(100% - 30px);
        background-color: #e4e4e4;
      }

      .el-step__icon {
        width: 30px;
      }
    }

    .el-step__main {
      margin-top: -6px;

      .el-step__title {
        height: 22px;
        padding-bottom: 0;
        font-family: '微软雅黑', sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        color: #999;
      }

      .el-step__description {
        height: 22px;
        margin-top: 0;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 12px;
        font-weight: 700;
        line-height: 22px;
        color: #666;
      }
    }
  }
}
</style>

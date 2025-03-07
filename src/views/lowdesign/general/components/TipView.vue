<template>
  <div class="control-word-content">
    <table cellspacing="0" cellpadding="0" style="width: 100%">
      <tbody v-for="(control, index) in tbodyList" :key="index">
        <tr>
          <td colspan="2" class="title">
            <span>{{ control.title }}</span>
          </td>
        </tr>
        <tr v-for="(tr, trIndex) in control.list" :key="trIndex">
          <template v-if="props.type == 'simple'">
            <td>
              <div class="flex flex-wrap">
                <div class="value" v-if="tr.value">
                  <el-tooltip v-if="tr.tip" :content="tr.tip">
                    {{ valueStyle == 'simple' ? tr.value : `【 ${tr.value} 】` }}
                  </el-tooltip>
                  <template v-else>
                    {{ valueStyle == 'simple' ? tr.value : `【 ${tr.value} 】` }}
                  </template>
                </div>
                <div class="text-12px" :class="{ 'pl-5px': valueStyle == 'simple' }" v-if="tr.label">
                  {{ tr.label }}
                </div>
              </div>
            </td>
          </template>
          <template v-else>
            <td v-for="(td, tdIndex) in tr" :key="tdIndex" :colspan="td.colspan">
              <div class="flex flex-wrap">
                <span class="value" v-if="td.value">
                  <el-tooltip v-if="td.tip" :content="td.tip">
                    {{ valueStyle == 'simple' ? td.value : `【 ${td.value} 】` }}
                  </el-tooltip>
                  <template v-else>
                    {{ valueStyle == 'simple' ? td.value : `【 ${td.value} 】` }}
                  </template>
                </span>
                <span :class="{ 'pl-5px': valueStyle == 'simple' }" v-if="td.label">
                  {{ td.label }}
                </span>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import controlParams from '@/components/LowDesign/src/utils/tipView'

defineOptions({ name: 'TipView' })
interface Props {
  type?: 'default' | 'simple'
  valueStyle?: 'default' | 'simple'
  tipKeyList?: Array<string>
  width?: string
}
const props = defineProps<Props>()
const tbodyList = computed(() => {
  const list = [] as any
  if (props.tipKeyList) {
    props.tipKeyList.forEach((key) => {
      list.push(controlParams[key])
    })
  }
  return list
})
</script>

<style lang="scss" scoped>
.control-word-content {
  padding: 5px 10px;
  overflow-y: auto;
  box-sizing: border-box;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 6px 8px;
    text-align: left;
    border: 1px solid black;

    .value {
      font-size: 16px;
      color: #409eff;
    }

    &.title {
      font-size: 16px;
      color: #fff;
      text-align: center;
      background-color: #409eff;
    }
  }
}

.dark .control-word-content {
  td {
    border-color: var(--el-border-color-dark) !important;
  }
}
</style>

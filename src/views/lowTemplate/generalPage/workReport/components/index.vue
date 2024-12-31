<template>
  <div class="flex items-start">
    <div class="w-30% mr-20px border-style">
      <FormView
        formType="edit"
        handleType="returnData"
        showType="view"
        :defaultData="form1Data"
        :showButton="false"
        formId="1853701496069386242"
      ></FormView>
    </div>
    <div class="w-[calc(70%-20px)] border-style">
      <FormView
        formType="edit"
        handleType="returnData"
        showType="view"
        :enhanceData="form2EData"
        :defaultData="form2Data"
        :showButton="false"
        formId="1853994635845922818"
      ></FormView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormView } from '@/components/LowDesign/index'

defineOptions({ name: 'WorkReportView' })

const prop = defineProps({
  data: Object,
  stepList: Object,
  form2Data: Object
})

const form1Data = computed(() => {
  return {
    ...prop.data,
    stepList: prop.stepList
  }
})
const form2EData = ref({})
</script>

<style scoped>
.border-style {
  border: 1px solid rgb(233 233 233 / 100%);
  border-radius: 10px;
  box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);
}
</style>

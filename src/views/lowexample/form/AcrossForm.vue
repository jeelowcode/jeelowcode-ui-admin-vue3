<template>
  <!-- 基础类型表单与表单设计 -->
  <ContentWrap>
    <div v-for="item in stepList" :key="item.refKey">
      <div class="pl-8px b-l-6px b-solid b-#409EFF title">{{ item.title }}</div>
      <div class="mb-20px" v-if="item.type == 'exploit'">
        <FormView
          formType="view"
          handleType="returnData"
          showType="view"
          :defaultData="item.defaultData"
          :showButton="false"
          :formId="item.formId"
        ></FormView>
      </div>
      <div class="mt-20px mb-40px" v-if="item.type == 'design'">
        <LowTable :tableId="item.formId" :enhanceData="item.enhanceData"></LowTable>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { FormView, LowTable } from '@/components/LowDesign/index'

defineOptions({ name: 'AcrossForm' })
const basicDefaultData = reactive({
  customer_name: '广州某科技有限公司',
  customer_rating: 3,
  customer_source: '3',
  customer_status: '4',
  now_city: '120000,120100,120102',
  system_number: '202010033',
  type_of_industry: '4',
  update_date: '2024-01-23 23:23:23',
  vesting_officer: '1836227753657548801'
})

const detailDefaultData = reactive({
  company_tax: '91645530MA5FQY4QGB',
  company_tel: '15238680350',
  company_web: 'http://www.xx.cn',
  current_title: '2',
  deposit_bank: '建设银行广州白云支行',
  detailed_address: '440000,440100,440111',
  head_contact: '1836227753657548801',
  invoice_title: '发票抬头',
  phone_number: '15239683355'
})

const financialEnhanceData = reactive({
  hideHeader: 'disabled'
})

const stepList = ref([
  {
    refKey: 'basic',
    title: '基本信息',
    type: 'exploit',
    formId: '1833063456320286721',
    defaultData: basicDefaultData
  },
  {
    refKey: 'detail',
    title: '详细信息',
    type: 'exploit',
    formId: '1833076541672169474',
    defaultData: detailDefaultData
  },
  {
    refKey: 'financial',
    title: '下级客户',
    type: 'design',
    formId: '1833323260582391810',
    enhanceData: financialEnhanceData
  }
])
</script>

<style lang="scss" scoped>
.title {
  height: 18px;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  color: #666670;
  border-top: none;
  border-right: none;
  border-bottom: none;
}
</style>

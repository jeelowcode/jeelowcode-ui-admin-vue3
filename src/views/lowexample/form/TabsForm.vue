<template>
  <!-- 标签页类型表单与表单设计 -->
    <FormView
      :ref="(el) => (formViewRef[tabsFormData.refKey] = el)"
      formType="view"
      handleType="returnData"
      showType="view"
      :defaultData="tabsFormData.defaultData"
      :showButton="false"
      :formId="tabsFormData.formId"
    ></FormView>
</template>

<script setup lang="ts">
import { FormView } from '@/components/LowDesign/index'

defineOptions({ name: 'TabsForm' })

const tabsDataDefaultData = reactive({
  create_date: '2024-09-11 09:04:00',
  customer_rating: 4,
  customer_source: '7',
  customer_status: '3',
  fields_4858197: '',
  fields_5452530: '',
  head_contact: '1833323260582391810',
  system_number: '202010001',
  tab_1: {
    tabs_customer_name: '张三',
    tabs_customer_rating: 4,
    tabs_customer_source: '7',
    tabs_customer_status: '3',
    tabs_now_city: '130000',
    tabs_system_number: '202010001',
    tabs_type_of_industry: '3',
    tabs_update_date: '2024-09-25 00:00:00',
    tabs_vesting_officer: '1833323260582391810'
  },
  tab_2: {
    tabs_company_tax: 'xxxxxxxxxxxxxx',
    tabs_company_tel: '3666-756614',
    tabs_company_web: 'http://www.xx.com',
    tabs_current_title: '5',
    tabs_deposit_bank: '中国建设银行',
    tabs_detailed_address: '130000,130400,130406',
    tabs_head_contact: '1833323260582391810',
    tabs_invoice_title: '科技有限公司',
    tabs_phone_number: '15238683333'
  },
  tabs_title: '广州某科技有限公司',
  type_of_industry: '3',
  vesting_officer: '1833323260582391810'
})

const tabsFormData = ref({
  refKey: 'tabs',
  title: '基本信息',
  type: 'exploit',
  formId: '1833427992183988225',
  defaultData: tabsDataDefaultData
})

const formViewRef = ref({})
</script>

<style lang="scss" scoped></style>

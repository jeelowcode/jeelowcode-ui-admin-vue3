<template>
  <!-- 步骤类型表单(垂直方向)与表单设计 -->
  <ContentWrap>
    <el-steps direction="vertical" :active="active">
      <el-step v-for="(item, index) in stepList" :key="item.refKey">
        <template #icon>
          <div class="step-icon-box" :class="{ avtive: active == index }">
            <div v-if="active == index" class="mt--1px">{{ index + 1 }}</div>
            <div v-else class="mt-1px">
              <Icon :size="14" icon="ep:select" color="var(--el-color-primary)"></Icon>
            </div>
          </div>
        </template>
        <template #title>
          <div class="c-[var(--el-text-color-primary)]">{{ item.title }}</div>
        </template>
        <template #description>
          <div
            class="c-[var(--el-color-info-light-3)] text-12px"
            :class="{ 'des-hide': active != index }"
            >{{ item.des }}</div
          >
          <div v-if="item.formId" v-show="active == index">
            <FormView
              :ref="(el) => (formViewRef[item.refKey] = el)"
              formType="add"
              handleType="returnData"
              showType="view"
              :showButton="false"
              :formId="item.formId"
            ></FormView>
          </div>
          <div v-if="active == index && active < 3" class="ml-65px mb-20px">
            <el-button v-if="active != 0" @click="active = active - 1">上一步</el-button>
            <el-button type="primary" v-if="active <= 2" @click="setNextForm">{{
              active == 2 ? '提交' : '下一步'
            }}</el-button>
          </div>
        </template>
      </el-step>
    </el-steps>
  </ContentWrap>
</template>

<script setup lang="ts">
import { FormView } from '@/components/LowDesign/index'
import { getUserProfile, ProfileVO } from '@/api/system/user/profile'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'StepEndlongForm' })

interface HandleClickProps {
  (formData: object): string
}

const props = defineProps<{
  addFun: HandleClickProps
}>()

const active = ref(0)
const stepList = ref([
  {
    refKey: 'basic',
    title: '基本信息',
    des: '请填写公司基本信息',
    formId: '1829756210681274369'
  },
  {
    refKey: 'detail',
    title: '详细信息',
    des: '请填写公司详细信息',
    formId: '1829756992465985538'
  },
  {
    refKey: 'financial',
    title: '财务信息',
    des: '请填写公司财务信息',
    formId: '1829757052494864386'
  },
  {
    refKey: 'submit',
    title: '提交成功',
    des: '公司信息提交成功'
  }
])

const formViewRef = ref({})
const formData = ref({})

const debounce = (func, wait) => {
  let timeout
  return function () {
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(args), wait)
  }
}

const setNextForm = debounce(async () => {
  const currStep = stepList.value[active.value]
  if (currStep.formId) {
    const formRef = formViewRef.value[currStep.refKey].controlRef
    const data = await formRef.handleSubmit(true)
    formData.value[currStep.refKey] = data

    if (active.value == 2 && data) {
      interface primordialTableDataType {
        basic: {
          company_name: string
          client_state: string
          industry_type: string
          client_source: string
          client_level: string
        }
      }
      const userInfo = ref({} as ProfileVO)
      const users = await getUserProfile()
      userInfo.value = users
      let primordialTableData = {
        company_name: (formData.value as primordialTableDataType).basic.company_name,
        customer_status: (formData.value as primordialTableDataType).basic.client_state,
        industry_type: (formData.value as primordialTableDataType).basic.industry_type,
        customer_source: (formData.value as primordialTableDataType).basic.client_source,
        customer_star: (formData.value as primordialTableDataType).basic.client_level,
        add_people: userInfo.value.id,
        update_date: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        bh: '20241001'
      }
      props.addFun(primordialTableData)
    }

    active.value++
  }
}, 500)
</script>

<style lang="scss" scoped>
::v-deep(.low-form) {
  padding-bottom: 0;
}

.step-icon-box {
  display: flex;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 2px solid var(--el-color-primary);
  border-radius: 50%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;

  & > div {
    display: flex;
    font-weight: bold;
  }

  &.avtive {
    color: #fff;
    background-color: var(--el-color-primary);
  }
}

::v-deep(.el-steps) {
  .el-step__head {
    width: 30px;

    .el-step__line {
      left: 14px;
      background-color: var(--el-color-info-light-7);
    }

    .el-step__icon {
      width: 30px !important;
    }

    &.is-finish {
      .el-step__line {
        background-color: var(--el-color-primary);
      }
    }

    &.is-process::before {
      position: absolute;
      top: 0;
      left: 14px;
      z-index: 1;
      display: block;
      width: 2px;
      height: 50%;
      background-color: var(--el-color-primary);
      content: '';
    }
  }

  .des-hide {
    margin-bottom: 50px;
  }
}
</style>

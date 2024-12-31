<template>
  <!-- <div> 发布表单页(横向分步) </div> -->
  <ContentWrap>
    <el-steps :active="active" align-center>
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
        </template>
      </el-step>
    </el-steps>
    <template v-for="(item, index) in stepList" :key="item.refKey">
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
      <div v-if="active == index && active < 3" class="mt-40px flex justify-center">
        <el-button v-if="active != 0" @click="active = active - 1">上一步</el-button>
        <el-button type="primary" v-if="active <= 2" @click="setNextForm">{{
          active == 2 ? '提交' : '下一步'
        }}</el-button>
      </div>
    </template>
  </ContentWrap>
</template>

<script setup lang="ts">
import { FormView } from '@/components/LowDesign/index'
defineOptions({ name: 'FormHxfb' })
const active = ref(0)
const stepList = ref([
  {
    refKey: 'basic_sp',
    title: '基本信息',
    des: '请填写公司基本信息',
    formId: '1829756210681274369'
  },
  {
    refKey: 'detail_sp',
    title: '详细信息',
    des: '请填写公司详细信息',
    formId: '1829756992465985538'
  },
  {
    refKey: 'financial_sp',
    title: '财务信息',
    des: '请填写公司财务信息',
    formId: '1829757052494864386'
  },
  {
    refKey: 'submit_sp',
    title: '提交成功',
    des: '公司信息提交成功'
  }
])

const formViewRef = ref({})
const formData = ref({})

const setNextForm = async () => {
  const currStep = stepList.value[active.value]
  if (currStep.formId) {
    const formRef = formViewRef.value[currStep.refKey].controlRef
    const data = await formRef.handleSubmit(true)
    formData.value[currStep.refKey] = data
  }
  active.value++
}
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
    .el-step__line {
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
  }

  .el-step:not(:last-child) {
    .el-step__head {
      &.is-process::before {
        position: absolute;
        top: calc(50% - 1px);
        right: 0;
        z-index: 1;
        display: block;
        width: 50%;
        height: 2px;
        background-color: var(--el-color-primary);
        content: '';
      }
    }
  }
}
</style>


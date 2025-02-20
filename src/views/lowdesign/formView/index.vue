<template>
  <div v-loading="loading">
    <div
      v-if="isOpen"
      class="form-external-box w-100% h-100vh py-20px box-border flex flex-col items-center"
    >
      <div
        v-if="isInit && isAuth"
        class="pos-relative w-80% b-1px b-[var(--el-border-color-light)] b-solid rd-4px bg-#fff"
      >
        <div
          class="external-title text-20px py-10px text-center b-b-1px b-b-[var(--el-border-color-light)] b-b-solid"
        >
          {{ externalTitle }}
        </div>
        <div class="max-h-[calc(100vh-90px)] overflow-y-auto">
          <div v-if="isInit" :class="formType !== 'view' ? 'pb-53px' : ''">
            <LowForm
              ref="formRef"
              :form-id="formId"
              :form-type="formType"
              :table-id="tableId"
              handle-type="default"
              :form-option="formOption"
              :default-is-open="isOpen"
            ></LowForm>
          </div>
          <div v-else style="height: 200px"> </div>
        </div>
        <div
          v-if="formType !== 'view' && (btnObj.submit || btnObj.empty)"
          class="w-100% pos-absolute left-0% bottom-0 py-10px bg-#fff text-center b-t-1px b-t-[var(--el-border-color-light)] b-t-solid rd-b-4px"
        >
          <el-button type="primary" v-if="btnObj.submit" @click="handleBtnClick('submit')">
            <Icon icon="ep:check"></Icon>
            <span>提交</span>
          </el-button>
          <el-button v-if="btnObj.empty" @click="handleBtnClick('close')">
            <Icon icon="ep:close"></Icon>
            <span>清空</span>
          </el-button>
        </div>
      </div>
      <div v-else class="text-20px mt-50px">无权限访问</div>
    </div>
    <div v-else>
      <ContentWrap>
        <LowForm
          v-if="isInit"
          ref="formRef"
          class="py-10px!"
          :form-id="formId"
          :form-type="formType"
          :table-id="tableId"
          :form-option="formOption"
          :before-close="beforeClose"
        ></LowForm>
      </ContentWrap>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as FormApi from '@/api/design/form'

const route = useRoute()
const message = useMessage()
const loading = ref(false)
const isInit = ref(false)
const isOpen = ref(false)
const isAuth = ref(true)
const formId = ref('')
const formType = ref<any>('')
const tableId = ref('')
const formOption = ref({})
const btnObj = { submit: false, empty: false }
const externalTitle = ref('')

const formRef = ref()

const resetForm = () => {
  loading.value = true
  isInit.value = false
  setTimeout(() => {
    loading.value = false
    isInit.value = true
  }, 300)
}
const handleBtnClick = async (type) => {
  if (type == 'submit') {
    loading.value = true
    const data = await formRef.value.handleSubmit(true, () => {
      loading.value = false
    })
    if (data && tableId.value) beforeClose(type)
  } else formRef.value.handleClear()
}

const beforeClose = (type, form?, loading?) => {
  if (loading) loading()
  if (type == 'submit') resetForm()
}

onMounted(async () => {
  loading.value = true
  isOpen.value = route.path.indexOf('external') !== -1
  const pathList = route.path.split('/')
  const length = pathList.length - 1
  if (/\d$/.test(pathList[length])) {
    formId.value = pathList[length]
    switch (pathList[length - 1]) {
      case 'fillout':
        formType.value = 'add'
        break
      case 'filloutNo':
        formType.value = 'edit'
        break
      case 'detail':
        formType.value = 'view'
        break
    }
    const data = await FormApi[`${isOpen.value ? 'getOpenFormDetail' : 'getFormDetail'}`]({
      desFormId: formId.value
    }).catch(() => false)
    if (!data || (isOpen.value && data.isOpen != 'Y')) return (loading.value = false)
    const option = JSON.parse(data.desformJson || `{}`)
    tableId.value = option.tableDesignId || ''
    if (isOpen.value) {
      externalTitle.value = option.externalTitle || data.desformName
      btnObj.submit = option.submitBtn
      btnObj.empty = option.emptyBtn
      option.submitBtn = false
      option.emptyBtn = false
    }
    formOption.value = option
    loading.value = false
    isInit.value = true
  }
})
</script>

<style lang="scss" scoped>
.form-external-box {
  background-attachment: scroll;
  background-color: rgb(236 239 244 / 100%);
  background-image: url('@/assets/svgs/external/external_bg.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 103%;
  background-origin: border-box;

  .external-title {
    font-family: '微软雅黑', sans-serif;
  }
}
</style>

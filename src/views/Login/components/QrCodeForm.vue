<template>
  <el-row
    class="login-form login-form-qrcode"
    v-show="getShow"
    style="margin-right: -10px; margin-left: -10px"
  >
    <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
      <LoginFormTitle style="width: 100%" />
    </el-col>
    <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
      <el-card class="mb-10px text-center" shadow="hover">
        <Qrcode :logo="logoImg" />
        <div class="">{{ t('login.qrcode') }}</div>
      </el-card>
      <div class="w-100% flex justify-end mt-5px mr-2px">
        <el-button link type="primary" @click="handleBackLogin()">{{
          t('login.backLogin')
        }}</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import logoImg from '@/assets/imgs/logo_min.png'

import LoginFormTitle from './LoginFormTitle.vue'
import { LoginStateEnum, useLoginState } from './useLogin'

defineOptions({ name: 'QrCodeForm' })

const { t } = useI18n()
const { handleBackLogin, getLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE)
</script>

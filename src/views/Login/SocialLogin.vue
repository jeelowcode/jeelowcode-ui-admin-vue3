<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-xl:bg-[var(--login-bg-color)] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px"
  >
    <div class="relative mx-auto h-full flex">
      <div
        :class="`${prefixCls}__left flex-1 bg-#409eff dark:bg-[var(--login-bg-color)] relative p-30px lt-xl:hidden overflow-x-hidden overflow-y-auto`"
      >
        <!-- 左上角的 logo + 系统标题 -->
        <div
          class="relative flex items-center text-white mt-30px"
          :style="{ marginTop: leftStyle.logo.mt }"
        >
          <img
            alt=""
            class="mr-10px"
            :style="{ height: leftStyle.logo.height }"
            src="@/assets/imgs/logo_white.png"
          />
        </div>
        <!-- 左边的背景图 + 欢迎语 -->
        <Transition appear enter-active-class="animate__animated animate__bounceInLeft" tag="div">
          <div :style="{ marginTop: leftStyle.bottomText.textMt }">
            <div
              class="pos-relative w-100% overflow-hidden"
              :style="{ height: leftStyle.lottie.boxHeight }"
            >
              <vue3-lottie
                class="pos-absolute"
                :style="{ left: leftStyle.lottie.left, top: leftStyle.lottie.top }"
                :animation-data="loginAnimationData"
                :height="leftStyle.lottie.height"
                :width="leftStyle.lottie.width"
                :auto-play="true"
                :loop="true"
              />
            </div>
            <div
              class="w-100% flex items-center justify-center ml--20px gap-x-5px"
              :style="{ marginTop: leftStyle.bottomText.linkMT }"
            >
              <a href="https://gitee.com/jeelowecode/JeeLowCode" Target="_blank">
                <img src="@/assets/svgs/gitee/JeeLowCode-1.0.0-red.svg" alt="star" />
              </a>
              <a href="https://gitee.com/jeelowecode/JeeLowCode" Target="_blank">
                <img src="@/assets/svgs/gitee/Spring Boot-2.7.18-yellow.svg" alt="star" />
              </a>
              <a href="https://gitee.com/jeelowecode/JeeLowCode" Target="_blank">
                <img src="@/assets/svgs/gitee/Vue-3.2-blue.svg" alt="star" />
              </a>
              <a href="https://gitee.com/jeelowecode/JeeLowCode" Target="_blank">
                <img src="@/assets/svgs/gitee/license-Apache 2.0-green.svg" alt="star" />
              </a>
              <a href="https://gitee.com/jeelowecode/JeeLowCode" Target="_blank">
                <img src="@/assets/svgs/gitee/commercial_free.svg" alt="star" />
              </a>
            </div>
            <div
              class="flex justify-center w-100%"
              :style="{ marginTop: leftStyle.bottomText.textMt }"
            >
              <div
                class="pos-relative overflow-hidden"
                :style="{ width: leftStyle.bottomText.width, height: leftStyle.bottomText.height }"
              >
                <img
                  alt=""
                  class="pos-absolute top-0"
                  :style="{ width: leftStyle.bottomText.width, left: leftStyle.bottomText.left }"
                  src="@/assets/imgs/login/login_text.png"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div class="relative flex-1 p-30px bg-#e3f0ff lt-sm:p-10px overflow-x-hidden overflow-y-auto">
        <!-- 右上角的主题、语言选择 -->
        <div
          class="relative z-2 flex items-center justify-between text-white at-2xl:justify-end at-xl:justify-end"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <img alt="" class="mr-10px h-32px" src="@/assets/imgs/logo.png" />
          </div>
          <div class="flex items-center justify-end space-x-10px">
            <ThemeSwitch />
            <LocaleDropdown class="dark:text-white lt-xl:text-white" />
          </div>
        </div>
        <!-- 右边的登录界面 -->
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="pos-relative z-2 m-auto h-[calc(100%-60px)] w-[100%] flex items-center at-2xl:max-w-500px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px"
          >
            <!-- 账号登录 -->
            <div class="bg-#fff dark:bg-[var(--login-bg-color)] b-rounded-20px px-40px py-40px">
              <el-form
                v-show="getShow"
                ref="formLogin"
                :model="loginData.loginForm"
                :rules="LoginRules"
                class="login-form"
                label-position="top"
                label-width="120px"
                size="large"
              >
                <el-row style="margin-right: -10px; margin-left: -10px">
                  <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                    <el-form-item>
                      <LoginFormTitle style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                    <el-form-item v-if="loginData.tenantEnable" prop="tenantName">
                      <el-input
                        v-model="loginData.loginForm.tenantName"
                        :placeholder="t('login.tenantNamePlaceholder')"
                        :prefix-icon="iconHouse"
                        link
                        type="primary"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                    <el-form-item prop="username">
                      <el-input
                        v-model="loginData.loginForm.username"
                        :placeholder="t('login.usernamePlaceholder')"
                        :prefix-icon="iconAvatar"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                    <el-form-item prop="password">
                      <el-input
                        v-model="loginData.loginForm.password"
                        :placeholder="t('login.passwordPlaceholder')"
                        :prefix-icon="iconLock"
                        show-password
                        type="password"
                        @keyup.enter="getCode()"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="24"
                    style="
                      padding-right: 10px;
                      padding-left: 10px;
                      margin-top: -20px;
                      margin-bottom: -20px;
                    "
                  >
                    <el-form-item>
                      <el-row justify="space-between" style="width: 100%">
                        <el-col :span="6">
                          <el-checkbox v-model="loginData.loginForm.rememberMe">
                            {{ t('login.remember') }}
                          </el-checkbox>
                        </el-col>
                        <el-col :offset="6" :span="12">
                          <el-link style="float: right" type="primary">{{
                            t('login.forgetPassword')
                          }}</el-link>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                    <el-form-item>
                      <XButton
                        :loading="loginLoading"
                        :title="t('login.login')"
                        class="w-[100%]"
                        type="primary"
                        @click="getCode()"
                      />
                    </el-form-item>
                  </el-col>
                  <Verify
                    ref="verify"
                    :captchaType="captchaType"
                    :imgSize="{ width: '400px', height: '200px' }"
                    mode="pop"
                    @success="handleLogin"
                  />
                </el-row>
              </el-form>
            </div>
          </div>
        </Transition>
      </div>
      <div
        class="pos-fixed bottom-0px left-50% lt-md:left-0px lt-sm:left-0px lt-xl:left-0px lt-xl:left-0px z-1"
      >
        <img class="w-138px block" src="@/assets/imgs/login/login_right_bg_1.png" alt="" />
      </div>
      <div class="pos-fixed right--38px top--23px">
        <img class="w-160px block" src="@/assets/imgs/login/login_right_bg_2.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElLoading } from 'element-plus'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'
import { usePermissionStore } from '@/store/modules/permission'

import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import { LoginStateEnum, useFormValid, useLoginState } from './components/useLogin'
import LoginFormTitle from './components/LoginFormTitle.vue'
import router from '@/router'
import { useWindowSize } from '@vueuse/core'
import * as loginAnimation from '@/assets/json/login_left.json'

defineOptions({ name: 'SocialLogin' })

const { t } = useI18n()
const route = useRoute()

const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref<any>()
const { validForm } = useFormValid(formLogin)
const { getLoginState } = useLoginState()
const { push } = useRouter()
const permissionStore = usePermissionStore()
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字
const windowSize = useWindowSize()
const loginAnimationData = ref(loginAnimation['default'])

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE !== 'false',
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE !== 'false',
  loginForm: {
    tenantName: '000000',
    username: 'admin',
    password: 'admin123',
    captchaVerification: '',
    rememberMe: false
  }
})

const leftStyle = computed(() => {
  const winW = windowSize.width.value
  const leftW = winW / 2

  const logo = {
    height: leftW / 16.5 + 'px',
    mt: leftW / 31.9 + 'px'
  }

  const lottieMagn = leftW / 435
  const lottie = {
    boxHeight: leftW / 2.39 + 'px',
    height: 335 * lottieMagn,
    width: 434 * lottieMagn,
    left: -(leftW / 38) + 'px',
    top: -(leftW / 5.3) + 'px'
  }

  const bottomText = {
    width: leftW / 1.54 + 'px',
    height: leftW / 8.68 + 'px',
    left: -(leftW / 31.54) + 'px',
    linkMT: leftW / 23.87 + 'px',
    textMt: leftW / 16.2 + 'px'
  }

  return { lottie, bottomText, logo }
})

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (!loginData.captchaEnable) {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
//获取租户ID
const getTenantId = async () => {
  if (loginData.tenantEnable) {
    const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}
// 记住我
const getCookie = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe ? true : false,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
const loading = ref() // ElLoading.service 返回的实例

// tricky: 配合LoginForm.vue中redirectUri需要对参数进行encode，需要在回调后进行decode
function getUrlValue(key: string): string {
  const url = new URL(decodeURIComponent(location.href))
  return url.searchParams.get(key) ?? ''
}

// 尝试登录: 当账号已经绑定，socialLogin会直接获得token
const tryLogin = async () => {
  try {
    const type = getUrlValue('type')
    const redirect = getUrlValue('redirect')
    const code = route?.query?.code as string
    const state = route?.query?.state as string

    const res = await LoginApi.socialLogin(type, code, state)
    authUtil.setToken(res)

    router.push({ path: redirect || '/' })
  } catch (err) {}
}

// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }

    let redirect = getUrlValue('redirect')

    const type = getUrlValue('type')
    const code = route?.query?.code as string
    const state = route?.query?.state as string

    const res = await LoginApi.login({
      // 账号密码登录
      username: loginData.loginForm.username,
      password: loginData.loginForm.password,
      captchaVerification: params.captchaVerification,
      // 社交登录
      socialCode: code,
      socialState: state,
      socialType: type
    })
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect) {
      redirect = '/'
    }
    // 判断是否为SSO登录
    if (redirect.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({ path: redirect || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

onMounted(() => {
  getCookie()
  tryLogin()
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;
}
</style>

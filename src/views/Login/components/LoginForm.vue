<template>
  <el-form
    v-show="getShow"
    ref="formLogin"
    :model="loginData.loginForm"
    :rules="LoginRules"
    class="login-form login-form-default"
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
        <el-form-item v-if="loginData.tenantEnable === 'true'" prop="tenantName">
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
        style="padding-right: 10px; padding-left: 10px; margin-top: -20px; margin-bottom: -20px"
      >
        <el-form-item>
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="loginData.loginForm.rememberMe">
                {{ t('login.remember') }}
              </el-checkbox>
            </el-col>
            <el-col :offset="6" :span="12">
              <el-link style="float: right" type="primary">{{ t('login.forgetPassword') }}</el-link>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px" class="login-btn-col">
        <el-form-item>
          <XButton
            :loading="loginLoading"
            :title="t('login.login')"
            class="w-[100%]"
            type="primary"
            @click="getCode()"
          />
          <div v-if="loginType == 'easy'" class="w-100% mt-6px flex justify-end">
            <el-dropdown @command="easyCommand">
              <div class="mt--2px cursor-pointer">
                <el-text type="primary">
                  <span class="text-14px">{{ t('login.otherLogin') }}</span>
                  <Icon :size="16" icon="iconamoon:arrow-down-2-light" />
                </el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <template v-for="item in easyDropdownList" :key="item.label">
                    <el-dropdown-item :command="item">
                      <Icon :size="16" :icon="item.icon" />
                      <span>{{ item.label }}</span>
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-form-item>
      </el-col>
      <Verify
        ref="verify"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="handleLogin"
      />
      <template v-if="!loginType">
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
          <el-form-item>
            <el-row :gutter="5" justify="space-between" style="width: 100%">
              <el-col :span="12">
                <XButton
                  :title="t('login.btnMobile')"
                  class="w-[100%]"
                  @click="setLoginState(LoginStateEnum.MOBILE)"
                />
              </el-col>
              <el-col :span="12">
                <XButton
                  :title="t('login.btnQRCode')"
                  class="w-[100%]"
                  @click="setLoginState(LoginStateEnum.QR_CODE)"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-divider content-position="center">{{ t('login.otherLogin') }}</el-divider>
        <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
          <el-form-item>
            <div class="w-[100%] flex justify-between">
              <Icon
                v-for="(item, key) in socialList"
                :key="key"
                :icon="item.icon"
                :size="30"
                class="anticon cursor-pointer"
                color="#999"
                @click="doSocialLogin(item.type)"
              />
            </div>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

defineOptions({ name: 'LoginForm' })

interface Props {
  loginType?: 'easy'
}
const props = defineProps<Props>()

const { t } = useI18n()
const message = useMessage()
const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '000000',
    username: import.meta.env.VITE_LOGIN_USERNAME || 'admin',
    password: import.meta.env.VITE_LOGIN_PASSWORD || 'admin123',
    captchaVerification: '',
    rememberMe: false
  }
})

const socialList = [
  { icon: 'ant-design:wechat-filled', type: 30 },
  { icon: 'ant-design:dingtalk-circle-filled', type: 20 },
  { icon: 'ant-design:github-filled', type: 0 },
  { icon: 'ant-design:alipay-circle-filled', type: 0 }
]

const easyDropdownList = [
  {
    label: t('login.btnMobile'),
    icon: 'ant-design:phone-twotone',
    type: LoginStateEnum.MOBILE,
    code: 'page'
  },
  {
    label: t('login.btnQRCode'),
    icon: 'ant-design:qrcode-outlined',
    type: LoginStateEnum.QR_CODE,
    code: 'page'
  },
  { label: t('login.btnWechat'), icon: 'ant-design:wechat-filled', type: 30, code: 'url' },
  {
    label: t('login.btnDingtalk'),
    icon: 'ant-design:dingtalk-circle-filled',
    type: 20,
    code: 'url'
  },
  { label: t('login.btnGitHub'), icon: 'ant-design:github-filled', type: 0, code: 'url' },
  { label: t('login.btnAlipay'), icon: 'ant-design:alipay-circle-filled', type: 0, code: 'url' }
]

const easyCommand = (row) => {
  if (row.code == 'page') setLoginState(row.type)
  else if (row.code == 'url') doSocialLogin(row.type)
}

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// 获取租户 ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
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
// 根据域名，获得租户信息
const getTenantByWebsite = async () => {
  const website = location.host
  const res = await LoginApi.getTenantByWebsite(website)
  if (res) {
    loginData.loginForm.tenantName = res.name
    authUtil.setTenantId(res.id)
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    
    const data = await validForm()
    if (!data) return

    loading.value = ElLoading.service({
      lock: true,
      text: '登录中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    await getTenantId()
    loginData.loginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginData.loginForm)
    if (!res) return

    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value?.close()
  }
}

// 社交登录
const doSocialLogin = async (type: number) => {
  if (type === 0) {
    message.error('此方式未配置')
  } else {
    loginLoading.value = true
    if (loginData.tenantEnable === 'true') {
      // 尝试先通过 tenantName 获取租户
      await getTenantId()
      // 如果获取不到，则需要弹出提示，进行处理
      if (!authUtil.getTenantId()) {
        await message.prompt('请输入租户名称', t('common.reminder')).then(async ({ value }) => {
          const res = await LoginApi.getTenantIdByName(value)
          authUtil.setTenantId(res)
        })
      }
    }
    // 计算 redirectUri
    // tricky: type、redirect需要先encode一次，否则钉钉回调会丢失。
    // 配合 Login/SocialLogin.vue#getUrlValue() 使用
    const redirectUri =
      location.origin +
      '/social-login?' +
      encodeURIComponent(`type=${type}&redirect=${redirect.value || '/'}`)

    // 进行跳转
    const res = await LoginApi.socialAuthRedirect(type, encodeURIComponent(redirectUri))
    window.location.href = res
  }
}
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getCookie()
  getTenantByWebsite()
})
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>

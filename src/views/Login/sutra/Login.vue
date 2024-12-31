<template>
  <div :class="prefixCls" class="relative w-100% h-100vh">
    <div
      class="content flex pos-relative left-0 top-50% z-2 w-100% h-31.25vw transform-translate-y--50%"
    >
      <div
        class="pos-absolute top-50% right-10% transform-translate-y--50% content-form bg-#fff inline-block border-rd-10px"
      >
        <div class="pos-relative w-300px p-34px">
          <div
            class="pos-absolute top-8px right-8px flex items-center justify-between text-white at-2xl:justify-end at-xl:justify-end"
          >
            <div class="flex items-center justify-end space-x-10px">
              <LocaleDropdown class="dark:text-white lt-xl:text-white" />
            </div>
          </div>
          <!-- 账号登录 -->
          <LoginForm loginType="easy" />
          <!-- 手机登录 -->
          <MobileForm />
          <!-- 二维码登录 -->
          <QrCodeForm />
          <!-- 三方登录 -->
          <SSOLoginVue />
        </div>
      </div>
    </div>
    <!-- transform-translate-y--330px -->
    <div
      class="w-100% pos-absolute left-0 w-100% h-auto z-10 transform-translate-y--50%"
      :style="{ top: bgTop }"
    >
      <el-divider>
        <div class="flex items-center">
          <el-image fit="cover" alt="" class="h-48px w-auto" :src="logoImage" />
          <span class="ml-10px text-20px">JeeLowCode 低代码开发平台</span>
        </div>
      </el-divider>
    </div>
    <div class="pos-absolute left-0 bottom-0 w-100% h-auto z-1">
      <el-image class="w-100% h-auto" :src="footerImage" fit="cover" />
      <div class="pos-absolute left-0 bottom-5px w-100% text-center">
        <a href="http://beian.miit.gov.cn" class="c-#0008 text-12px">粤ICP备xxx号</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDesign } from '@/hooks/web/useDesign'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import { useWindowSize } from '@vueuse/core'
import { LoginForm, MobileForm, QrCodeForm, RegisterForm, SSOLoginVue } from '../components'

import footerImage from '@/assets/imgs/login/login_sutra_2.png'
import logoImage from '@/assets/imgs/logo_min.png'

defineOptions({ name: 'SutraLogin' })

const { t } = useI18n()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('sutra-login')
const windowSize = useWindowSize()
const bgTop = computed(() => {
  const bgHeight = windowSize.width.value / 3.2
  const topHeight = (windowSize.height.value - bgHeight) / 4 + 20
  if (topHeight < 30) return '30px'
  return topHeight + 'px'
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-sutra-login;

.#{$prefix-cls} {
  overflow: hidden;

  .content {
    overflow: hidden;
    background-image: url('@/assets/imgs/login/login_sutra_1.png');
    background-size: cover;

    .content-form {
      ::v-deep(.login-form-default) {
        .el-divider {
          margin: 5px 0 20px;
        }
      }

      ::v-deep(.login-form) {
        .form-title {
          margin: 0 !important;
          font-family: '微软雅黑', sans-serif;
          font-size: 30px;
          font-weight: 500;
          color: var(--el-color-primary);
        }

        .login-btn-col {
          .el-form-item {
            margin-bottom: 5px;
          }
        }
      }

      ::v-deep(.login-form-qrcode) {
        .form-title {
          margin-bottom: 15px !important;
        }
      }
    }
  }
}
</style>

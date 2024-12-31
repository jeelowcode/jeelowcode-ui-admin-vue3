<template>
  <div :class="prefixCls" class="relative h-[100%]">
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
        <Transition
          appear
          enter-active-class="animate__animated animate__bounceInLeft"
          tag="div"
        >
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
      <div
        class="relative flex-1 p-30px bg-#e3f0ff lt-sm:p-10px overflow-x-hidden overflow-y-auto"
        :class="`${prefixCls}__right`"
      >
        <!-- 右上角的主题、语言选择 -->
        <div
          class="relative z-2 flex items-center justify-between text-white at-2xl:justify-end at-xl:justify-end"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <img alt="" class="mr-10px h-32px" src="@/assets/imgs/logo.png" />
          </div>
          <div class="flex items-center justify-end space-x-10px h-48px">
            <ThemeSwitch />
            <LocaleDropdown class="dark:text-white lt-xl:text-white" />
          </div>
        </div>
        <!-- 右边的登录界面 -->
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="pos-relative z-2 m-auto h-[calc(100%-60px)] w-[100%] flex items-center at-2xl:max-w-500px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px"
          >
            <div class="bg-#fff dark:bg-[var(--login-bg-color)] b-rounded-20px px-20px">
              <!-- 账号登录 -->
              <LoginForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
              <!-- 手机登录 -->
              <MobileForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
              <!-- 二维码登录 -->
              <QrCodeForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
              <!-- 三方登录 -->
              <SSOLoginVue class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
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
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import { useWindowSize } from '@vueuse/core'

import { LoginForm, MobileForm, QrCodeForm, SSOLoginVue } from './components'
import * as loginAnimation from '@/assets/json/login_left.json'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const windowSize = useWindowSize()
const loginAnimationData = ref(loginAnimation['default'])

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
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;
}
</style>

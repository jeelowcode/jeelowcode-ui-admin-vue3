<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

import avatarImg from '@/assets/imgs/avatar.jpg'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useUserStore } from '@/store/modules/user'
import { resetRouter } from '@/router'

defineOptions({ name: 'UserInfo' })

const { t } = useI18n()

const { push, replace } = useRouter()

const userStore = useUserStore()

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const avatar = computed(() => userStore.user.avatar || avatarImg)
const userName = computed(() => userStore.user.nickname ?? 'Admin')

const loginOut = async () => {
  try {
    await ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    await userStore.loginOut()
    tagsViewStore.delAllViews()
    resetRouter()
    window.location.href = window.location.origin + '/login?redirect=/index'
    // replace('/login?redirect=/index')
  } catch {}
}
const toProfile = async () => {
  push('/user/profile')
}
const toDocument = () => {
  window.open('http://doc.jeelowcode.com/')
}
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <ElAvatar
        :src="avatar"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%] b-solid b-1px b-#f1f1f1"
      />
      <span class="pl-[5px] text-14px text-[var(--top-header-text-color)] <lg:hidden">
        {{ userName }}
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <Icon icon="ep:tools" />
          <div @click="toProfile">{{ t('common.profile') }}</div>
        </ElDropdownItem>
        <ElDropdownItem>
          <Icon icon="ep:menu" />
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided @click="loginOut">
          <Icon icon="ep:switch-button" />
          <div>{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

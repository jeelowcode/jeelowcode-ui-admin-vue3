<template>
  <div class="py-10px">
    <avue-form
      v-model="formData"
      :option="formOption"
      @submit="submit"
      @reset-change="init"
      v-loading="loading"
    >
    </avue-form>
  </div>
</template>
<script lang="ts" setup>
import { getUserProfile, updateUserProfile } from '@/api/system/user/profile'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'BasicInfo' })

const { t } = useI18n()
const message = useMessage() // 消息弹窗
const userStore = useUserStore()

const formData = ref<any>({})
const formOption = ref({
  labelWidth: 120,
  span: 24,
  submitText: t('common.save'),
  emptyText: t('common.reset'),
  column: {
    nickname: {
      label: t('profile.user.nickname'),
      rules: [{ required: true, message: t('profile.rules.nickname'), trigger: 'blur' }]
    },
    mobile: {
      label: t('profile.user.mobile'),
      rules: [
        { required: true, message: t('profile.rules.phone'), trigger: 'blur' },
        {
          pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          message: t('profile.rules.truephone'),
          trigger: 'blur'
        }
      ]
    },
    email: {
      label: t('profile.user.email'),
      rules: [
        { required: true, message: t('profile.rules.mail'), trigger: 'blur' },
        {
          type: 'email',
          message: t('profile.rules.truemail'),
          trigger: ['blur', 'change']
        }
      ]
    },
    sex: {
      label: t('profile.user.sex'),
      type: 'radio',
      dicData: [
        { label: t('profile.user.man'), value: 1 },
        { label: t('profile.user.woman'), value: 2 }
      ],
      value: 0
    }
  }
})
const loading = ref(false)

const submit = async (form, done) => {
  loading.value = true
  done()
  await updateUserProfile(form)
  message.success(t('common.updateSuccess'))
  const profile = await init()
  userStore.setUserNicknameAction(profile.nickname)
}
const init = async () => {
  loading.value = true
  const res = await getUserProfile()
  formData.value = res
  loading.value = false
  return res
}
onMounted(async () => {
  await init()
})
</script>

<template>
  <div class="py-10px">
    <avue-form v-model="formData" :option="formOption" @submit="submit" v-loading="loading">
      <template #oldPassword>
        <InputPassword v-model="formData.oldPassword" />
      </template>
      <template #newPassword>
        <InputPassword v-model="formData.newPassword" strength />
      </template>
      <template #confirmPassword>
        <InputPassword v-model="formData.confirmPassword" strength />
      </template>
    </avue-form>
  </div>
</template>
<script lang="ts" setup>
import { InputPassword } from '@/components/InputPassword'
import { updateUserPassword } from '@/api/system/user/profile'

defineOptions({ name: 'ResetPwd' })

const { t } = useI18n()
const message = useMessage()

const equalToPassword = (_rule, value, callback) => {
  if (formData.value.newPassword !== value) {
    callback(new Error(t('profile.password.diffPwd')))
  } else {
    callback()
  }
}
const loading = ref(false)
const formData = ref<any>({})
const formOption = ref({
  labelWidth: 120,
  span: 24,
  submitText: t('common.save'),
  emptyText: t('common.reset'),
  column: {
    oldPassword: {
      label: t('profile.password.oldPassword'),
      rules: [
        { required: true, message: t('profile.password.oldPwdMsg'), trigger: 'blur' },
        { min: 6, max: 20, message: t('profile.password.pwdRules'), trigger: 'blur' }
      ]
    },
    newPassword: {
      label: t('profile.password.newPassword'),
      rules: [
        { required: true, message: t('profile.password.newPwdMsg'), trigger: 'blur' },
        { min: 6, max: 20, message: t('profile.password.pwdRules'), trigger: 'blur' }
      ]
    },
    confirmPassword: {
      label: t('profile.password.confirmPassword'),
      rules: [
        { required: true, message: t('profile.password.cfPwdMsg'), trigger: 'blur' },
        { required: true, validator: equalToPassword, trigger: 'blur' }
      ]
    }
  }
})

const submit = async (form, done) => {
  done()
  loading.value = true
  await updateUserPassword(form.oldPassword, form.newPassword).finally(
    () => (loading.value = false)
  )
  message.success(t('common.updateSuccess'))
}
</script>

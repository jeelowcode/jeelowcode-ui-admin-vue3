<template>
  <DesignPopup v-model="dialogVisible" title="分配角色" width="40%" :is-footer="true">
    <div class="p-20px">
      <avue-form
        ref="formRef"
        v-loading="formLoading"
        :option="formOption"
        v-model="formData"
      ></avue-form>
    </div>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">提 交</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </DesignPopup>
</template>
<script lang="ts" setup>
import * as PermissionApi from '@/api/system/permission'
import * as UserApi from '@/api/system/user'

defineOptions({ name: 'SystemUserAssignRoleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formOption = ref({
  submitBtn: false,
  emptyBtn: false,
  span: 24,
  labelWidth: 80,
  column: {
    username: { label: '用户名称', disabled: true },
    nickname: { label: '用户昵称', disabled: true },
    roleIds: {
      label: '角色',
      type: 'select',
      multiple: true,
      dicUrl: '/system/role/simple-list',
      dataType: 'array',
      props: { label: 'name', value: 'id' }
    }
  }
})
const formData = ref<any>({})

const formRef = ref()

const submitForm = async () => {
  try {
    formLoading.value = true
    await PermissionApi.assignUserRole({
      userId: formData.value.id,
      roleIds: formData.value.roleIds
    })
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', true)
  } finally {
    formLoading.value = false
  }
}

/** 打开弹窗 */
const open = async (row: UserApi.UserVO) => {
  if (formRef.value) formRef.value.dicInit()
  formData.value = { ...row, roleIds: [] }
  dialogVisible.value = true
  // 获得角色拥有的菜单集合
  formLoading.value = true
  try {
    const roleIds = await PermissionApi.getUserRoleList(row.id)
    formData.value = { ...formData.value, roleIds }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

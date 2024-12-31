import { Message } from '../../Message';
<script lang="ts" setup>
import * as sysApi from '@/api/design/sys'
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'ClearCache' })

defineProps({
  color: propTypes.string.def('')
})
const message = useMessage()

const openClearCache = async () => {
  await message.confirm('是否确定清除缓存？')
  await sysApi.clearCache()
  message.success('清除成功')
}
</script>

<template>
  <div @click="openClearCache">
    <Icon
      :class="$attrs.class"
      :color="color"
      :size="18"
      class="cursor-pointer !p-0"
      icon="carbon:clean"
    />
  </div>
</template>

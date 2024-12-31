<template>
  <avue-upload v-model="urls" list-type="picture-img"></avue-upload>
</template>

<script setup>
import { ref } from 'vue'
const action = 'https://api.avuejs.com/imgupload'
const propsHttp = {
  url: 'url',
  name: 'name',
  res: 'data'
}
const urls = ref([])
 //设置为空字符串控件都不显示
// const urls = ref('')
</script>

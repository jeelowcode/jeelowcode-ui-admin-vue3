// 引入unocss css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

//引入Lottie动画
import Vue3Lottie from 'vue3-lottie';

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'


import axios from 'axios'
import { config } from '@/config/axios/config'
axios.defaults.baseURL = config.base_url
// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

//lowDesagn全局组件
import { setupLowDesagn } from '@/plugins/lowDesagn'

// 引入 element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入 avue
import { setupAvue } from '@/plugins/avue'

//引入Md
import { setupMdEditor } from '@/plugins/md/editor'
import { setupMdPreview } from '@/plugins/md/preview'

// 引入全局样式
import '@/styles/index.scss'

// 引入动画
import '@/plugins/animate.css'

//引入vxe-table vxe-pc-ui
import VxeTable from 'vxe-table'
import VxeUI from 'vxe-pc-ui'
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/lib/style.css'

// 路由
import router, { setupRouter } from '@/router'

// 权限
import { setupAuth } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import '@/plugins/tongji' // 百度统计
import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupLowDesagn(app)

  setupRouter(app)

  setupAuth(app)

  setupMdEditor(app)
  setupMdPreview(app)

  app.use(ElementPlus)

  setupAvue(app)

  app.use(VxeUI)
  app.use(VxeTable, { tooltip: { zIndex: 99999 } })
  
  app.use(Vue3Lottie);

  await router.isReady()

  app.use(VueDOMPurifyHTML)

  app.mount('#app')
}

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)

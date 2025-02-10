const modules = import.meta.glob([
  //组件
  '@/components/**/*.vue',
  '!@/components/Backtop/**',
  '!@/components/bpmnProcessDesigner/**',
  '!@/components/ConfigGlobal/**',
  '!@/components/ContentWrap/**',
  '!@/components/CountTo/**',
  '!@/components/Crontab/**',
  '!@/components/Cropper/**',
  '!@/components/Dialog/**',
  '!@/components/DictTag/**',
  '!@/components/Echart/**',
  '!@/components/Error/**',
  '!@/components/Highlight/**',
  '!@/components/Icon/**',
  '!@/components/IFrame/**',
  '!@/components/ImageViewer/**',
  '!@/components/Infotip/**',
  '!@/components/InputPassword/**',
  '!@/components/LowDesign/src/LowForm/**',
  '!@/components/LowDesign/src/LowReport/**',
  '!@/components/LowDesign/src/LowTable/**',
  '!@/components/LowDesign/src/shareControl/**',
  '!@/components/LowDesign/src/DesignPopup.vue',
  '!@/components/LowDesign/src/TabsControl.vue',
  '!@/components/LowFormDesign/**',
  '!@/components/MonacoEditor/**',
  '!@/components/Qrcode/**',
  '!@/components/RouterSearch/**',
  '!@/components/Sticky/**',
  '!@/components/UploadFile/**',
  '!@/components/Verifition/**',
  '!@/components/XButton/**',
  //工具类
  '@/**/*.ts',
  '!@/views/**/*.ts',
  '!@/api/**/*.ts',
  '!@/assets/**/*.ts',
  '!@/components/**/*.ts',
  '!@/config/**/*.ts',
  '!@/directives/**/*.ts',
  '!@/layout/**/*.ts',
  '!@/locales/**/*.ts',
  '!@/plugins/**/*.ts',
  '!@/router/**/*.ts',
  '!@/styles/**/*.ts',
  '!@/types/**/*.ts',
  '!@/main.ts',
  '!@/permission.ts',
  '!@/types/**/*.ts',
  '!@/uno.config.ts',
  '!@/vite.config.ts',
])

export const registerComp = (path) => {
  if (path.indexOf('.') === -1) path = path + '.vue'
  const currModule = modules[`/src/${path}`] as any
  if (currModule) return defineAsyncComponent(currModule)
  console.warn('动态注册组件失败，请确定组件路径是否正确，或者查看registerComponent.ts文件是否引入。')
  return undefined
}

export const importFile: (string) => Function | undefined = (path) => {
  if (path.indexOf('.') === -1) path = path + '.ts'
  const file = modules[`/src/${path}`]
  if (file) return file
  console.warn('动态导入模块失败，请确定模块路径是否正确，或者查看registerComponent.ts文件是否引入。')
  return undefined
}

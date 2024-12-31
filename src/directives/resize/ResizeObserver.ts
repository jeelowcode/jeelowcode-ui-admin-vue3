import type { App } from 'vue'
const map = new WeakMap()
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // 获取dom元素的回调
    const handler = map.get(entry.target)
    //存在回调函数
    if (handler) {
      // 将监听的值给回调函数
      handler({
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      })
    }
  }
})

export function hasResize(app: App<Element>) {
  app.directive('hasResize', {
    mounted(el, binding) {
      map.set(el, binding.value)
      ob.observe(el)
    },
    unmounted(el) {
      ob.unobserve(el)
    }
  })

}

export default hasResize
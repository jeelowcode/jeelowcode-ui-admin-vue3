import { useWindowSize } from '@vueuse/core'

export const useCrudHeight = (crudRef) => {
  const windowSize = useWindowSize()
  const crudHeightTimer = ref<any>(null)

  const initTableLayout = () => {
    if (crudHeightTimer.value) clearTimeout(crudHeightTimer.value)
    crudHeightTimer.value = setTimeout(() => {
      if (crudRef instanceof Array) {
        crudRef.forEach(itemRef => {
          if (itemRef.value) itemRef.value.getTableHeight()
        })
      } else if (crudRef.value) crudRef.value.getTableHeight()
    }, 100)
  }

  watch(
    () => windowSize.height.value,
    () => {
      initTableLayout()
    }
  )

  return { initTableLayout, windowSize }
}

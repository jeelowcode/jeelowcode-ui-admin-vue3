import type { App } from 'vue'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const { t } = useI18n() // 国际化

export function hasPermi(app: App<Element>) {
  app.directive('hasPermi', (el, binding) => {
    const { wsCache } = useCache()
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = wsCache.get(CACHE_KEY.USER).permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      let hasPermissions = false
      permissionFlag.forEach(permiKey => {
        if (all_permission === permiKey || permissions[permiKey]) hasPermissions = true
      })
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(t('permission.hasPermission'))
    }
  })
}

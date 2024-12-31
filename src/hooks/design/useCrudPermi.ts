import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

export const useCrudPermi = () => {
  const { wsCache } = useCache()
  const all_permission = '*:*'
  const permissions = wsCache.get(CACHE_KEY.USER).permissions
  const crudBtnObj = {
    query: 'viewBtn',
    create: 'addBtn',
    update: 'editBtn',
    delete: 'delBtn',
  }

  const getCurrPermi = (permiArr: string[]) => {
    const crudPermission = {}
    permiArr.forEach(permiKey => {
      for (const key in crudBtnObj) {
        crudPermission[crudBtnObj[key]] = permiKey === all_permission || permissions[`${permiKey}:${key}`]
      }
    })
    return crudPermission
  }
  return { getCurrPermi }
}

import { useLowStoreWithOut } from '@/store/modules/low'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'
import { getDicTableText } from '@/api/design/dic'


//设置用户、部门控件数据名称
export const setUserAndDeptName = (params) => {
  let { userIdList, deptIdList } = params
  return new Promise(resolve => {
    const lowStore = useLowStoreWithOut()
    const dictLabel: object[] = []
    userIdList = (userIdList || []).filter(id => !lowStore.dicObj?.userSelect?.[id])
    if (userIdList?.length) {
      userIdList = [...new Set(userIdList)]
      dictLabel.push({ userIdList })
    }
    deptIdList = (deptIdList || []).filter(id => !lowStore.dicObj?.deptSelect?.[id])
    if (deptIdList?.length) {
      deptIdList = [...new Set(deptIdList)]
      dictLabel.push({ deptIdList })
    }
    if (dictLabel.length) {
      const dictKeyData = {
        userList: { dicKey: 'userSelect', label: 'nickname' },
        deptList: { dicKey: 'deptSelect', label: 'name' }
      }
      getDicTableText({ jeeLowCode_dictLabel: encryptAES(JSON.stringify(dictLabel)) }).then(
        (dicData) => {
          for (const key in dicData) {
            const dicObj = {}
            const label = dictKeyData[key].label
            const dicKey = dictKeyData[key].dicKey

            dicData[key].forEach((item) => (dicObj[item.id] = item[label]))
            lowStore.setDicObj(dicKey, dicObj)
          }
          resolve(true)
        }
      ).catch(() => resolve(false))
    }
  })
}
import { listToTree, findNode, treeMap } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
export const useGroup = (treeRef, DataApi, resetChange, isView?) => {
  const message = useMessage() // 消息弹窗
  const treeForm = ref<any>({})
  const treeOption = ref({
    nodeKey: 'id',
    defaultExpandAll: true,
    filterText: '输入名称进行过滤',
    props: { label: 'name', value: 'id' },
    formOption: {
      labelWidth: 100,
      column: {
        pid: { label: '上级分组', type: 'tree', value: 0, dicData: [], filterable: true, defaultExpandAll: true, props: { label: 'name', value: 'id' } },
        name: { label: '分组名称', rules: [{ required: true, message: '请输入 分组名称', trigger: "blur" }] }
      }
    }
  })
  const treeData = ref<any>([])
  const groupValue = ref<string | number>(0)

  if (isView) {
    treeOption.value['addBtn'] = false
    treeOption.value['editBtn'] = false
    treeOption.value['delBtn'] = false
    treeOption.value['menu'] = false
  }

  const treePermission = (key, data) => {
    if (key != 'addBtn' && data.id === 0) return false
    return true
  }

  const treeBeforeOpen = (done, type) => {
    setTimeout(() => {
      const treeList = cloneDeep(treeData.value)
      if (type == 'edit') {
        const disabledArr = [treeForm.value.id]
        treeMap(treeList, {
          children: 'children',
          conversion: (item) => {
            if (item.id == disabledArr[0]) item.disabled = true
            if (disabledArr.includes(item.pid)) {
              item.disabled = true
              disabledArr.push(item.id)
            }
            return item
          }
        })
        treeForm.value.oldPid = treeForm.value.pid
      }
      treeOption.value.formOption.column.pid.dicData = treeList
    }, 30)
    done()
  }

  const treeNodeClick = (data) => {
    if (data.id == groupValue.value) {
      treeRef.value.setCurrentKey(null)
      groupValue.value = ''
    } else groupValue.value = data.id
    resetChange()
  }

  const getTreeData = async () => {
    const data = await DataApi.getGroupData({})
    treeData.value = [{ name: '全部', id: 0, children: listToTree(data) }]
  }

  const treeUpdate = (node, data, done, loading) => {
    DataApi.updateGroupData(data)
      .then(() => {
        if (data.oldPid != data.pid) {
          const oldPNode = findNode(treeData.value, (node) => node.id == data.oldPid)
          oldPNode.children = oldPNode.children.filter((item) => item.id != data.id)
          const pNode = findNode(treeData.value, (node) => node.id == data.pid)
          delete data.oldPid
          if (pNode.children) pNode.children.push(data)
          else pNode.children = [data]
        }
        done()
      })
      .catch(() => loading())
  }
  const treeSave = async (node, data, done, loading) => {
    treeForm.value['children'] = []
    await DataApi.saveGroupData(data)
      .then((res) => {
        treeForm.value.id = res
        done()
        setTimeout(() => {
          if (treeData.value.length > 1) {
            const currData = treeData.value.splice(1, 1)
            const pNode = findNode(treeData.value, (node) => node.id == currData[0].pid)
            if (pNode) pNode.children.push(currData[0])
          }
        }, 0)
      })
      .catch(() => loading())
  }
  const treeDel = async (node, done) => {
    await message.delConfirm()
    await DataApi.deleteGroupData([node.data.id])
    done()
  }

  return { treeForm, treeOption, treeData, groupValue, treePermission, treeBeforeOpen, treeNodeClick, getTreeData, treeUpdate, treeSave, treeDel }
}

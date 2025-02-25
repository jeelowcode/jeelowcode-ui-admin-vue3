<template>
  <!-- <div> 高级筛选页 </div>
  顶部搜索：表单设计
  底部表格：表单开发 -->
  <div class="box">
    <div class="order-top">
      <FormView
        formType="edit"
        handleType="returnData"
        showType="view"
        :defaultData="orderTopData.defaultData"
        :showButton="false"
        :enhanceData="{ setSearch}"
        :formId="orderTopData.formId"
        :ref="(el) => (tableRef[tableData.name] = el)"
      ></FormView>
    </div>
    <div class="flex gap-2">
        <span>已选条件：</span>
        <template v-for="tag in dynamicTags" :key="tag.label">
          <el-tag
            v-if="tag.show"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag.label }}
          </el-tag>
      </template>
      <span class="qcsx" @click="delFun">清除筛选</span>
    </div>
    <div class="table">
      <LowTable :tableId="tableData.tableId" :enhanceData="tableData.enhanceData"> </LowTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormView, LowTable } from '@/components/LowDesign/index'
import type { TagProps } from 'element-plus'

  interface TagsItem {
    name: string
    type: TagProps['type']
  }


  // const dynamicTags = ref(['选择项一', '选择项一', '选择项一'])
  const dynamicTags = ref<any>([
  // { label: '选项一', type: 'primary',lx:'kh',show:true },
  // { label: '选项二', type: 'primary',lx:'kh',show:false },
  ])

  const orderTopData = ref({
    type: 'exploit',
    refKey: 'orderTop',
    formId: '1838814762506964994',
    defaultData: {
      type1:'1',
      type2:'1',
      type3:'1'
    }
  })

  const tableRef = ref({})
  const formData = ref({})
  const tableData = ref(
    {
      label: '高级筛选',
      name: 'gjsx',
      tableId: '1838824808796180481',
      enhanceData: { hideHeader: 'disabled' }
    },
  )

const tableCrud = ref()
const tableSearch = ref({})
const label = ref<any>()

// 多选处理
const khArr = ref<any>([])
const hyArr = ref<any>([])
const setSearch = (searchObj) => {
  
  if(searchObj.type == 'kh'){
    searchObj.dic.map(item=>{
      item.type = 'primary'
      item.show = searchObj.value.includes(item.value) ? true : false
      item.lx = searchObj.type
      return item
    })
    khArr.value = searchObj.dic
  }
  if(searchObj.type == 'hy'){
    searchObj.dic.map(item=>{
      item.type = 'primary'
      item.show = searchObj.value.includes(item.value) ? true : false
      item.lx = searchObj.type
      return item
    })
    hyArr.value = searchObj.dic
  }
  strFnu(searchObj)
}

const strFnu = (data) =>{
  let array = khArr.value.concat(hyArr.value)
  dynamicTags.value = array
}

  const delFun = () =>{
    dynamicTags.value = []
  }

  //已选条件处理
  const str = ref<any>([])
  const handleClose = (tag) => {
    dynamicTags.value.map(item =>{
      if(item.label == tag.label){
        item.show = false
      }
      
      if(item.lx == tag.lx && item.show){
        str.value.push(item.value)
      }
      
      return item
    })

    if(tag.lx == 'kh'){
      orderTopData.value.defaultData.type1 = str.value.join()
      str.value = []
    } else if(tag.lx == 'hy'){
      orderTopData.value.defaultData.type2 = str.value.join()
      str.value = []
    }
    
  }

  // watch()
</script>

<style lang="scss" scoped>
.box{
  background: #fff;
}

.flex{
  margin-left: 68px;
  font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: #999;
  text-align: left;

  .qcsx{
    margin-top: -3px;
    margin-left:40px;
    font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    color: #409EFF;
  }
}

.table{
  width: calc(90% + 40px);
  padding: 20px;
  margin: auto;
}

::v-deep .el-form-item__label{
  color: #999;
}

::v-deep .el-checkbox-group {
  display: contents;
}

::v-deep .low-form {
  padding-bottom: 0;
}
</style>

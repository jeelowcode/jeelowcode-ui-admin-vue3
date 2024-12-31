<template>
  <div class="w-100%">
    <div class="box w-100%">
      <div class="w-[calc(100%-60px)] header">
        <el-radio-group v-model="radio" >
          <template v-for="(item,index) in tabbleDate" :key="index">
            <el-radio-button :label="item.label" :value="index"/>
          </template>
        </el-radio-group>
      </div>
      <div class="tabel">
        <LowTable :ref="(el)=>(customRef = el)" :tableId="tabbleDate[radio].tableId" :enhanceData="tabbleDate[radio].enhanceData" > </LowTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const radio = ref(0)
const customRef = ref()
const tabbleDate = ref([
  {
    label:'操作日志',
    type:'table',
    defaultData:{},
    tableId:'1854067250698612737',
    enhanceData: { hideHeader: 'disabled'}
  },
  {
    label:'审批日志',
    type:'table',
    defaultData:{},
    tableId:'1854331399533998082',
    enhanceData: { hideHeader: 'disabled'}
  },
  {
    label:'登录日志',
    type:'table',
    defaultData:{},
    tableId:'1854341001851940865',
    enhanceData: { hideHeader: 'disabled'}
  }
])


</script>

<style lang="scss" scoped>
.box{
  background-color: rgb(255 255 255 / 100%);
  border: 1px solid rgb(233 233 233 / 100%);
  border-radius: 10px;
  box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);
  box-sizing: border-box;

  .header{
    display: flex;
    height: 60px;
    padding: 0 30px;
    background-color: rgb(249 249 249 / 100%);
    border-bottom: 1px solid rgb(233 233 233 / 100%);
    border-radius: 10px 10px 0 0;
    align-content: center;;

    ::v-deep(.el-radio-group){
      .el-radio-button{
        .el-radio-button__inner{
          display: flex;
          width: 101px;
          height: 35px;
          font-family: '微软雅黑', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          color: #999;
          align-items: center;
          justify-content: center;
        }
      }

      .is-active {
        .el-radio-button__inner{
          color: #FFF ;
        }
      }
    }
  }

  .tabel{
    padding:  30px;
  }
}
</style>
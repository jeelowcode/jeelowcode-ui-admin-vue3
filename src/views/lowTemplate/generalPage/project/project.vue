<template>
  <div class="w-100%">
    <header class="header ">
      <div class="list" v-for="(item,index) in listData" :key="index">
        <p class="title">{{item.title}}</p>
        <p class="text">{{item.num}}</p>
      </div>
    </header>
    <footer class="content">
      <div class="content-top" >
        <el-radio-group v-model="radio1" size="large">
          <el-radio-button label="全部项目" value="qbxm" />
          <el-radio-button label="进行中" value="jxz" />
          <el-radio-button label="已完成" value="ywc" />
          <el-radio-button label="已延期" value="yyq" />
          <el-radio-button label="已取消" value="yqx" />
        </el-radio-group>
        <el-input
          v-model="input"
          style="width: 200px;height: 35px;margin-left:20px;"
          size="large"
          placeholder="输入搜索关键词"
          :suffix-icon="Search"
          clearable
        />
      </div>
      <div class="table">
      </div>
      <LowTable :tableId="data.tableId" :enhanceData="data.enhanceData" > </LowTable>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const listData = reactive([
  {title:'项目总数',num:'200'},
  {title:'进行中',num:'50'},
  {title:'已完成',num:'50'},
  {title:'已延期',num:'50'},
  {title:'已取消',num:'50'},
])

const data  =  reactive({
  label:'全部项目',
  name:'qbxm',
  defaultData:{},
  tableId:'1847094468974710786',
  type:'table',
  enhanceData: { hideHeader: 'disabled'}
})

const radio1 = ref('qbxm')
const input = ref('')

</script>

<style lang="scss" scoped>
.header{
  display: flex;
  height: 150px;
  padding: 0 20px;
  margin-bottom:20px;
  background: #fff;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;

  .list{
    width: 292px;
    width: 100%;

    p{
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .title{
      font-family: '微软雅黑', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 42px;
      color: #999;
    }

    .text{
      font-family: '微软雅黑 Bold', '微软雅黑', sans-serif;
      font-size: 36px;
      font-weight: 700;
      line-height: 42px;
      color: #666;
    }
  }
}

.content{
  position: relative;
  // height: 600px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;

  .content-top{
    position: absolute;
    top: 30px;
    z-index: 99;
    display: flex;
    align-items: center;

    ::v-deep(.el-radio-group) {
      .el-radio-button {
        .el-radio-button__inner {
          display: flex;
          width: 101px;
          height: 35px;
          padding: 0;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        &.is-active{
          .el-radio-button__inner {
          color: white;
        }
        }
      }
    }
  }

  .table{
    // position: absolute;
    margin-top:10px;
  }
}
</style>

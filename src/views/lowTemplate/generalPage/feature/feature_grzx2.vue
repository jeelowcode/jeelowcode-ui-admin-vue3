<template>
  <!-- <div> 个人中心</div> -->
   <div>
    <div class="box">
      <div class="box-left .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent ">
        <div class="box-left-top">
          <div class="head ">
            <div style="margin: 20px 0;">
              <el-avatar :size="60" :src="circleUrl" />
            </div>
            <p class="font color6 .dark:c-#fff!" style="margin-bottom:5px;font-size: 18px;">a123</p>
            <p class="fontFamily color9 .dark:c-#ccc!" style="font-size: 14px;">专注交互原型设计</p>
          </div>
          <div class="title-box">
            <el-row class="demo-avatar demo-basic">
              <el-col :span="8">
                <div class="content">
                  <p class="font color3 .dark:c-#fff!" style="font-size: 16px;">1000</p>
                  <p class="font-family color9 .dark:c-#ccc!" style="font-size: 12px;">文章</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content" style="border-right: 1px solid #f4f4f4;border-left: 1px solid #f4f4f4;">
                  <p class="font color3 .dark:c-#fff!" style="font-size: 16px;">1000</p>
                  <p class="font-family color9 .dark:c-#ccc!" style="font-size: 12px;">应用</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content">
                  <p class="font color3 .dark:c-#fff!" style="font-size: 16px;">1000</p>
                  <p class="font-family color9 .dark:c-#ccc!" style="font-size: 12px;">项目</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="list">
          <p class="font color6 .dark:c-#fff!" style="margin:20px 0 10px 20px;font-size: 14px;">个人名片</p>
          <el-row>
           <div class="list-box">
            <el-col :span="2">
              <Icon icon="fa6-solid:user" width="18" height="18"  style="color: #999" />
            </el-col>
            <el-col :span="20">
              <p class="fontFamily color6 .dark:c-#ccc!" style="font-size: 14px;">10年</p>
            </el-col>
           </div>
          </el-row>
          <el-row>
           <div class="list-box">
            <el-col :span="2">
              <Icon icon="fa6-brands:qq" width="18" height="18"  style="color: #999" />
            </el-col>
            <el-col :span="20">
              <p class="fontFamily color6 .dark:c-#ccc!" style="font-size: 14px;">20841030</p>
            </el-col>
           </div>
          </el-row>
          <el-row>
           <div class="list-box">
            <el-col :span="2">
              <Icon icon="fa:weixin" width="18" height="18"  style="color: #999" />
            </el-col>
            <el-col :span="20">
              <p class="fontFamily color6 .dark:c-#ccc!" style="font-size: 14px;">a123</p>
            </el-col>
           </div>
          </el-row>
          <el-row>
           <div class="list-box">
            <el-col :span="2">
              <Icon icon="fa-brands:weibo" width="18" height="18"  style="color: #999" />
            </el-col>
            <el-col :span="20">
              <p class="fontFamily color6 .dark:c-#ccc!" style="font-size: 14px;">淘宝创意部</p>
            </el-col>
           </div>
          </el-row>
        </div>
        <div class="list" style="padding-bottom: 30px;">
          <p class="font color6 .dark:c-#fff!" style="margin:20px 0 10px 20px;font-size: 14px;">所属团队</p>
          <el-row v-for="(item,index) in sstdData" :key="index">
            <div class="list-sstd">
              <el-avatar :size="46" :src="item.src" />
              <div class="list-sstd-text">
                <p class="font color6 .dark:c-#fff!" style="font-size: 14px;">{{item.title}}</p>
                <p class="fontFamily color9 .dark:c-#ccc!" style="font-size: 12px;">{{item.content}}</p>
              </div>
            </div>
          </el-row>
        </div>
        <div class="list">
          <p class="font color6 .dark:c-#fff!" style="margin:20px 0 10px 20px;font-size: 14px;">标签</p>
          <div style="margin-left: 20px;">
            <el-badge class="item" v-for="(item, index) in data" :key="index">
              <el-button>{{ item.name }}</el-button>
            </el-badge>
          </div>
        </div>
      </div>
      <div class="box-right .dark:b-#2A2B2C b-solid .dark:bg-#1D1E1F! b-1px b-transparent">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <template v-for="(item,index) in tableData" :key="index">
            <el-tab-pane :label="item.label" :name="item.name">
              <div class="tabs-box">
                <!-- <FormView
                  
                  formType="add"
                  handleType="returnData"
                  showType="view"
                  :defaultData="item.defaultData"
                  :showButton="true"
                  :formId="item.formId"
                ></FormView> -->
                <upDate v-if="item.type == 'jurisdiction'"></upDate>
                <template v-if="item.type == 'table'">
                  <LowTable :tableId="item.tableId" :enhanceData="item.enhanceData" > </LowTable>
                </template>
                
              </div>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>
   </div>
</template>

<script setup lang="ts">
import { reactive, toRefs,ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})
const data = ref([
  {name:'很有想法'},
  {name:'海纳百川'},
  {name:'川妹子'},
  {name:'专注设计'},
  {name:'喜欢吃辣'},
  {name:'好看'},
  {name:'能力强'},
  {name:'爱臭美'},
])
const sstdData = ref([
  {src:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',title:'淘宝创意部',content:'设计呢，最重要的是开心'},
  {src:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',title:'淘宝创意部',content:'设计呢，最重要的是开心'},
  {src:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',title:'淘宝创意部',content:'设计呢，最重要的是开心'},
])
const tableData  =  reactive([
  {label:'应用',name:'first',defaultData:{},tableId:'1848631600935510017',type:'table',enhanceData: { hideHeader: 'disabled'}},
  {label:'项目',name:'second',defaultData:{},tableId:'1848637143087489025',type:'table',enhanceData: { hideHeader: 'disabled'}},
  {label:'文章',name:'fourth',defaultData:{},tableId:'1848649270435160066',type:'table',enhanceData: { hideHeader: 'disabled'}},
])

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const { circleUrl } = toRefs(state)
</script>

<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}

.box{
  display: flex;
  width: 100%;

  .box-left{
    width: 22.6%;
    max-height: 950px;
    // padding: 0 20px;
    margin-right:21px;
    background: #fff;
    border-radius: 10px;

    .box-left-top{
      width: 100%;
      // padding: 0 20px;

      .head{
        // margin: 20px 0;
        text-align: center;
      }

      .title-box{
        margin:30px 0;

        .content{
          text-align: center;
        }
      }
      
    }

    .list{
      padding-bottom: 20px;
      border-top: 1px solid #ececec;

      .list-box{
        display: flex;
        width: 100%;
        margin-left:20px;
        line-height: 28px;
        align-content: center;
      }

      .list-sstd{
        display: flex;
        margin-top: 20px;
        margin-left:20px;

        .list-sstd-text{
          margin-left: 10px;

          p{
            line-height: 24px;
          }
        }
      }
    }
  }

  .box-right{
    width: 77%;
    padding: 0 20px;
    background: #fff;
    border-radius: 10px;
  }
}

.item {
  margin-top: 10px;
  margin-right: 10px;
}

.el-dropdown {
  margin-top: 1.1rem;
}

::v-deep .el-button{
  padding: 8px 15px !important;
  font-family: '微软雅黑', sans-serif !important;
  font-size: 12px !important;
    font-weight: 400 !important;
  color: #999 !important;
}

::v-deep .el-tabs__item{
  height: 60px !important;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 30px !important;
  color: #666 !important;
}

.font{
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  font-weight: 700;
}

.fontFamily{
  font-family: '微软雅黑', sans-serif;
  font-weight: 400;
}

.font-family{
  font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
  font-weight: 400;
}

.color3{
  color: #333;
}

.color6{
  color: #666;
}

.color9{
  color: #999;
}
</style>

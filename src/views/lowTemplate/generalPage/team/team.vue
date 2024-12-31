<template>
  <div>
    <div class="w-100%" v-if="isShow">
      <div class="search-box" :class="{'bj':!isTable}">
        <div class="mt-4 ">
          <el-input
            v-model="input"
            style="width: 900px"
            clearable
            placeholder="输入搜索关键字"
          >
            <template #append>
              <div class="search-btn" @click="searchFun(true)">
                <el-icon><Search /></el-icon>
                <span style="margin-left: 3px;">搜索</span>
              </div>
            </template>
          </el-input>
        </div>
        <div class="fhsyy"  v-if="!isTable" @click="isTable=true,is_px=false,input=''">
          <el-icon><Back /></el-icon>
          <span style="margin-left: 5px">返回</span>
        </div>
      </div>
      <div class="table" v-if="isTable">
        <div class="table-header">
          <span></span>
          <span class="c-#666666">知识分类</span>
        </div>
        <LowTable :ref="(el)=>(customRef = el)" :tableId="tabbleDate.tableId" :enhanceData="tabbleDate.enhanceData" > </LowTable>
      </div>
      <div class="ssjg" v-else>
        <template v-if="listData.length">
          <div class="ssjg-top" >
            <div class="ssjg-top-left">
              <p>为您找到相关结果约{{total}}个， 搜索用时 (0.23秒)</p>
            </div>
            <div class="ssjg-top-right">
              <span :class="{'color':is_px}" @click="searchFun(true)">默认排序</span>
              <span :class="{'color':!is_px}" @click="searchFun(false)">按时间排序</span>
            </div>
          </div>
          <template v-if="is_show">
            <div v-loading="loading">
              <div class="box" v-for="item in listData" :key="item.id">
                <p class="box-title acitive" @click="viewFun(item)">{{item.title}}</p>
                <p class="box-text">{{item.text}}</p>
                <div class="box-lls">
                  <el-icon size="18"><View /></el-icon>
                  <span style="margin: 0 8px;">浏览</span>
                  <span>{{item.llcs}}</span>
                </div>
              </div>
            </div>
            <div class="page">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10,20,30,40,50,100]"
                :size="size"
                :disabled="disabled"
                background
                layout="prev, pager, next,sizes "
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </template>
        </template>
        <template v-else>
          <div class="null" v-loading="loading">
            <div>
              <img src="/img/null.svg" alt=""/>
              <p class="ts">未查询到相关知识内容</p>
              <p>建议您修改搜索关键词重新再试</p>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="list" v-else>
      <div class="list-left">
          <div class="title">
            <span></span>
            <span @click="isShow=true,isTable=true,is_show=true" class="tabs">知识分类</span>
            <span @click="is_show=true" class="tabs"> > 产品知识</span>
            <span @click="is_show=false" v-if="!is_show" class="tabs"> > 内容详情 </span>
          </div>
        <template v-if="is_show">
          <div v-loading="loading">
            <div class="box" v-for="item in listData" :key="item.id">
              <p class="box-title acitive" @click="viewFun(item)">{{item.title}}</p>
              <p class="box-text">{{item.text}}</p>
              <div class="box-lls">
                <el-icon size="18"><View /></el-icon>
                <span style="margin: 0 8px;">浏览</span>
                <span>{{item.llcs}}</span>
              </div>
            </div>
          </div>
          <div class="page">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10,50, 100, 200, 400]"
              :size="size"
              :disabled="disabled"
              background
              layout="prev, pager, next,sizes "
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </template>
        <template v-else>
          <div class="view" v-loading="loading">
            <div class="top-box">
              <p>{{objData.title}}</p>
              <div class="top-box-text">
                <el-icon size="16"><Clock /></el-icon>
                <span style="margin: 0 12px 0 5px;">{{objData.time}}</span>
                <el-icon size="16"><View /></el-icon>
                <span style="margin: 0 5px;">浏览</span>
                <span> {{objData.llcs}}</span>
              </div>
            </div>
            <div class="html-text" v-html="objData.content"></div>
            <div class="tips" v-if="is_fk">
              <p>以上信息是否对您有帮助？</p>
              <div>
                <el-button type="primary" style="padding: 19px 28px;" @click="is_fk=false">有帮助</el-button>
                <el-button type="primary" style="padding: 19px 28px;" @click="is_fk=false" plain>没帮助</el-button>
              </div>
            </div>
            <div class="tips" v-else>
              <div class="fk">
                <el-icon size="28px" color="#7ed96d" style="margin-right:10px"><CircleCheck /></el-icon>
                <span>感谢您的反馈</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="list-right">
        <header class="header">
          <p class="header-title">热门知识</p>
        </header>
        <template v-for="(item,index) in listData" :key="item.id">
          <div class="rm"  v-if="index < 6">
            <p class="rm-title acitive" @click="viewFun(item)">{{item.title}}</p>
            <p class="rm-text">{{item.text}}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search,View,Clock,CircleCheck,Back } from '@element-plus/icons-vue'
import {getTableList,updateTableData} from '@/api/design/table/index'
import type { ComponentSize } from 'element-plus'
import { formatDate } from '@/utils/formatTime'

const isShow = ref<any>(true)
const input = ref('')
const customRef = ref()
const size = ref<ComponentSize>('default')
const loading = ref(false)
const is_show = ref(true)
const is_fk = ref(true)
const isTable = ref(true)
const is_px = ref(true)
//知识分类点击
const clickFun = () =>{
  isShow.value = false
  initDate({ pageNo: 1 , pageSize: 10 })

}

const tabbleDate = ref({
  label:'知识分类',
  type:'table',
  defaultData:{},
  tableId:'1854438272522235905',
  enhanceData: { hideHeader: 'disabled',clickFun}
})

//搜索
const searchFun = (type) =>{
  isTable.value = false
  is_px.value = type
  initDate(type ? { pageNo: 1 , pageSize: 10,title:input.value } : { pageNo: 1 , pageSize: 10,column: "create_time",order: "asc"})
}
const listData = ref<any>([])
const pageSize = ref(10)
const total = ref()
//初始化数据
const initDate = (data) =>{
  new Promise(async (resolve) => {
    loading.value = true
    await getTableList('1854438272522235905',data,false).then((res)=>{
      listData.value = res.records || []
      total.value = res.total
      loading.value = false
      resolve(res.records)
    })
  })
}

//分页
const currentPage = ref(1)
const disabled = ref(false)
const handleSizeChange = (val: number) => {
  pageSize.value = val
  initDate({ pageNo: 1 , pageSize: val })
  
}
const handleCurrentChange = (val: number) => {
  initDate({ pageNo: val , pageSize: 10 })
}

//详情
const objData = ref()
const viewFun = (data) =>{
  loading.value = true
  isShow.value = false
  is_show.value = false
  data.time = formatDate(data.create_time,'YYYY-MM-DD HH:mm:ss')
  data.llcs = ++data.llcs
  objData.value = data
  updateTableData('1854438272522235905',data)
  loading.value = false
}

onMounted(()=>{
  
})

</script>

<style lang="scss" scoped>
.search-box{
  position: relative;
  display: flex;
  height: 180px;
  background: #FFF;
  align-items: center;
  justify-content: center;

  ::v-deep .el-input-group__append {
    padding: 0;

    .search-btn{
      display: flex;
      padding: 4px 19px;
      font-family: "微软雅黑", sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      background: #409eff;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      align-items: center;
      justify-content: center;
    }
  }

  .fhsyy{
    position: absolute;
    top: 10px;
    left: 20px;
    display: flex;
    font-size: 12px;
    color: #666;
    align-items: center;
    cursor: pointer;
  }

  .fhsyy:hover{
    color: #409eff;
  }
}

.table{
  width:100%;
  margin-top: 20px;

  .table-header span:nth-child(1){
    display: inline-block;
    width: 5.5px;
    height: 17px;
    margin-right: 7px;
    background: #409eff;
  }

  .table-header{
    display: flex;
    align-items: center;
    margin: 20px 0;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    text-align: left;
  }
}

.ssjg{
  padding: 32px;
  background: #fff;
  border: 1px solid rgb(233 233 233 / 100%);
  border-top: 0;

  .ssjg-top{
    display: flex;
    padding: 6px 0;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 33px;

    .ssjg-top-left{

      p{
        padding: 0;
        margin: 0;
        font-family: '微软雅黑', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
        color: #999;
        text-align: left;
      }
    }

    .ssjg-top-right{

      span{
        display: inline-block;
        padding: 5.5px 22px;
        font-family: '微软雅黑', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        letter-spacing: normal;
        color: #666;
        border-radius: 20px;
      }
    }
  }

  .null{
    display: flex;
    min-height: 410px;
    background: #fff;
    align-items: center;
    justify-content: center;
    
    p{
      padding: 0;
      margin: 0;
      font-family: '微软雅黑', sans-serif;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 28px;
      color: #999;
      text-align: center;
    }

    .ts{
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      color: #666 !important;
    }

   
  }
}

.list{
  display: flex;
  gap: 25px;

  .list-left{
    padding: 40px;
    flex: 8;
    background: #fff;

    .title span:nth-child(1){
      display: inline-block;
      width: 5.2px;
      height: 16px;
      margin-right: 5px;
      background: #409eff;
    }

    .title{
      display: flex;
      margin-bottom: 30px;
      font-family: '微软雅黑', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #666;
      align-items: center;
    }

    // .box{
    //   position: relative;
    //   width: 100%;
    //   padding-bottom: 20px ;
    //   border-bottom: 1px solid rgb(242 242 242 / 100%);

    //   p{
    //     padding: 0;
    //     margin: 0;
    //   }

    //   .box-title{
    //     font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
    //     font-size: 18px;
    //     font-style: normal;
    //     font-weight: 700;
    //     line-height: 30px;
    //     color:#666;
    //     cursor: pointer;
    //   }

    //   .box-text{
    //     font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
    //     font-size: 14px;
    //     font-style: normal;
    //     font-weight: 400;
    //     line-height: 30px;
    //     color: #999;
    //     text-align: left;
    //   }

    //   .box-lls{
    //     position: absolute;
    //     right: 50px;
    //     bottom: 50px;
    //     display: flex;
    //     font-family: '微软雅黑', sans-serif;
    //     font-size: 12px;
    //     font-weight: 400;
    //     color: #999;
    //     align-items: center;
    //   }
    // }

    // .page{
    //   display: flex;
    //   padding: 20px;
    //   justify-content: center;
    // }

    .view{
      .top-box{
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(242 242 242 / 100%);

        p{
          padding: 0;
          margin: 0;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 36px;
          color: #666;
          text-transform: none;
          word-wrap: break-word;
        }

        .top-box-text{
          display: flex;
          font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 36px;
          color: #999;
          align-items: center;
        }
      }

      .html-text{
        font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
        color: #666;
        text-align: left;
      }

      .tips{
        display: flex;
        padding: 19px;
        background:#f9f9f9;
        border: 1px solid rgb(233 233 233 / 100%);
        justify-content: space-between;
        align-items: center;

        p{
          padding: 0;
          margin: 0;
          font-family: '微软雅黑', sans-serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          line-height: 36px;
          color: #666;
          text-align: left;
        }

        .fk{
          display: flex;
          align-items: center;

          span{
            font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 36px;
            color: #666;
            text-align: left;
          }
        }
      }
    }
  }

  .list-right{
    flex: 2;
    background: #fff;

    .header{
      display: flex;
      height: 50px;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid rgb(233 233 233 / 100%);

      .header-title{
        padding: 0;
        margin: 0;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px;
        color: #666;
        text-align: left;
      }
    }

    .rm{
      padding: 15px 0;
      margin: 0 20px;
      border-bottom: 1px solid rgb(233 233 233 / 100%);

      p{
        padding: 0;
        margin: 0;
      }

      .rm-title{
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px;
        color: #666;
        text-align: left;
        text-transform: none;
        word-wrap: break-word;
        cursor: pointer;
        visibility: inherit;

      }

      .rm-text{
        font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        color: #999;
        text-align: left;
        text-transform: none;
        word-wrap: break-word;
        visibility: inherit;

      }
    }
  }
}


.box{
  position: relative;
  width: 100%;
  padding: 10px ;
  border-bottom: 1px solid rgb(242 242 242 / 100%);

  p{
    padding: 0;
    margin: 0;
  }

  .box-title{
    display: inline-block;
    font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 30px;
    color:#666;
    cursor: pointer;
  }

  .box-text{
    font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;
    color: #999;
    text-align: left;
  }

  .box-lls{
    position: absolute;
    right: 50px;
    bottom: 50px;
    display: flex;
    font-family: '微软雅黑', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #999;
    align-items: center;
  }
}

.page{
  display: flex;
  padding: 20px;
  justify-content: center;
}

.acitive:hover{
  color: #409eff !important;
}

.tabs:hover{
  color: #409eff !important;
  cursor: pointer;
}

.bj{
  background: #f9f9f9 !important;
  border: 1px solid rgb(233 233 233 / 100%);
}

.color{
  color: #fff !important;
  background: #409eff;
}

::v-deep .el-card {
  background-color: rgba($color: #000, $alpha: 0%) !important;
}

::v-deep .el-input__wrapper{
  border-right:0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 0 0 1px #409eff inset;
}
</style>
<template>
  <div class="w-100%">
    <div class="xc_box">
      <FormView
        :ref="(el) => (formViewRef[formTopData.refKey] = el)"
        formType="add"
        handleType="returnData"
        showType="view"
        :defaultData="formTopData.defaultData"
        :showButton="false"
        :enhanceData="{isShowFun}"
        :formId="formTopData.formId"
      ></FormView>
      <div class="Tips">
        <div style="display: flex;align-items: center;" v-if="is_show">
          <span class="span"></span>
          <span>图片列表</span>
        </div>
        <div v-else>
          <el-checkbox v-model="checked" label="全选" size="large" style="margin-right:10px;font-size: 16px;" @click="toggleAllSelection()"/>
          <el-button @click="uploadFun(true)">移动图片</el-button>
          <el-button @click="delFun()">删除图片</el-button>
          <el-button @click="isShowFun()">退出操作</el-button>
        </div>
        <div>
          <el-select v-model="value" placeholder="Select" style="width: 120px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <LowTable :ref="(el)=>(ref1 = el)" :tableId="tableDate.tableId" :enhanceData="tableDate.enhanceData" > </LowTable>
    </div>
    <el-dialog v-model="upload" title="选择相册" width="728px" :close-on-click-modal="false">
        <el-checkbox-group v-model="checkList">
          <div class="checkbox-box">
              <div class="list" v-for="(item,index) in listData" :key="index">
                <img class="img" :src="item.url" alt=""/>
                <div class="radio">
                  <el-checkbox label="" :value="index" />
                  <p>{{item.title}}</p>
                </div>
              </div>
          </div>
      </el-checkbox-group>
      <div class="btn">
        <el-button class="qx" @click="uploadFun(false)">取消</el-button>
        <el-button class="bc" type="primary" @click="uploadFun(false)">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { messageConfig ,ElMessage, ElMessageBox} from 'element-plus';

const ref1 = ref()
const formViewRef = ref({})
const value = ref('1')
const upload = ref(false)
const radio = ref('selected and disabled')

const formTopData = ref({
  type:'table',
  refKey: 'xcgl',
  formId: '1852223511034294274',
  defaultData: {},
  enhanceData: { hideHeader: 'disabled'}
})


const tableDate = ref({
  label:'图片列表',
  name:'fourth',
  defaultData:{},
  tableId:'1852241979997646849',
  type:'table',
  enhanceData: { hideHeader: 'disabled',}
})

const options = [
  {
    value: '1',
    label: '文件名称',
  },
  {
    value: '2',
    label: '文件大小',
  },
  {
    value: '3',
    label: '更新时间',
  },
]

const checked = ref()
const is_show = ref(true)
const isShowFun = () =>{
  ref1.value.crudRef.tableOption.selection=is_show.value
  is_show.value = !is_show.value
  checked.value = !is_show.value ? '' : true
  ref1.value.crudRef.refreshTable()
    
}

//全选
const toggleAllSelection  = ()=> {
  ref1.value.crudRef.toggleAllSelection()
}
//删除图片
const delFun = () =>{
  ElMessageBox.confirm(
    '是否确定删除数据？',
    '操作确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '数据删除成功',
      })
    }).catch(() => {})
}

//上传图片
const checkList = ref([])
const listData = ref([
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
  {title:'相册名称',url:'../../../../../public/img/xc.png'},
])
const uploadFun = (type) =>{
  upload.value = type
}


const xzFun = ()=>{

}


</script>

<style lang="scss" scoped>
.xc_box{
  padding-bottom: 20px;

  .Tips{
    display: flex;
    height: 40px;
    padding-right:18px;
    margin-bottom: 15px;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    color: #666;
    text-align: left;
    align-items: center;
    justify-content: space-between;

    .span{
      display: inline-block;
      width: 8.41px;
      height: 19px;
      margin-right:10px;
      background: #409eff;
    }
    
  }
}

.checkbox-box{
  display: flex;
  padding: 0 0 30px 30px;
  flex-wrap: wrap;

  .list{
    width: 150px;
    height: 180px;
    margin: 20px 20px 0 0;
    border: 1px solid #e4e4e4;

    .img{
      width: 150px;
      height: 150px;
    }

    .radio{
      display: flex;
      height: 30px;
      padding-left: 10px;
      // margin-left:5px;
      line-height: 30px;

      // .el-checkbox{
        .el-checkbox__input{
          top: -5px;
          left: 6px;
          height: 30px;
          margin: 0;
        }
      // }
      

      p{
        padding: 0;
        margin: 0;
        margin-left: 5px;
        font-family: '微软雅黑', sans-serif;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 30px;
        color: #999;
        text-align: left;
      }
    }
  }
}

.btn{
  display: flex;
  justify-content: end;
  padding: 20px 30px;
  border-top:1px solid #e9e9e9;

  .el-button{
    width: 80px;
    height: 30px;
    font-family: '微软雅黑', sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
  }

  .qx{
    color: #999;
    background: #f9f9f9;
  }

  .qx:hover{
    color: #409eff;
    border-color: #409eff;
  }

  .qr{
    color: #FFF;
  }
}

::v-deep .el-select__placeholder{
  font-family: '微软雅黑', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: #666;
  text-align: left;
}
</style>
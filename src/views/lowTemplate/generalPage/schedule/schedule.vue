<template>
  <div>
    <div class="w-100% box">
      <div class="box-left">
        <p class="title">日程管理</p>
        <el-calendar v-model="value" class="custom-calendar" ref="calendar">
          <template #header="{ date }">
            <span style="margin-top: 3px;" @click="selectDate('prev-month',date)"><Icon icon="bitcoin-icons:arrow-left-outline" width="1024" height="1024"  style="color: #999" /></span>
            <span>{{ date }}</span>
            <span style="margin-top: 3px;" @click="selectDate('next-month',date)"><Icon icon="bitcoin-icons:arrow-right-outline" width="1024" height="1024"  style="color: #999" /></span>
          </template>
          <template #date-cell="{data }">
            <span @click="selectDateFun({str:'ri',is_Show:3,time:data.day})">{{ data.day.split('-').slice(2).join('-') }}</span>
          </template>
        </el-calendar>
        <div class="tabs">
          <div class="tabs-box" :class="{'acitive':isShow == 1}" @click="isShow =1">
            <span><Icon icon="uiw:date" width="1024" height="1024"  style="color: #999" /></span>
            <p>我的日历</p>
          </div>
          <div class="tabs-box" :class="{'acitive':!isShow}" @click="isShow =0">
            <span><Icon icon="uiw:date" width="1024" height="1024"  style="color: #999" /></span>
            <p>成员日历</p>
          </div>
        </div>
        <div class="checkbox">
          <el-checkbox-group v-model="checkList" class="checkbox-box">
            <el-checkbox v-for="item in cities" :key="item" :label="item" style="margin-bottom: 20px;">
              <div style="display: flex;align-items: center;">
                <div class="img">
                  <el-icon><UserFilled /></el-icon>
                </div>
                <div style="font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;font-weight: 400;">{{item}}</div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="box-right">
        <el-calendar v-model="value" class="calendar" ref="calendar" v-if="display=='yue'">
          <template #header="{ date }">
            <el-input
              v-model="input1"
              style="width: 200px;height: 35px;"
              size="large"
              placeholder="输入日程关键词"
              :suffix-icon="Search"
              clearable
            />
            <span class="time">{{ date }}</span>
            
            <el-button-group>
              <el-button @click="dialogFun()" style="margin-right:10px !important;border-top-right-radius: 4px;border-bottom-right-radius: 4px;"  :icon="Plus"  type="primary">
                新建日程
              </el-button>
              <el-button class="btn" :class="{'border':is_Show == 1}" @click="selectDate('today',{'date':date,'is_Show':1})">
                月
              </el-button>
              <el-button class="btn" :class="{'border':is_Show == 2}" @click="selectDate('today',{'date':date,'is_Show':2})">
                周
              </el-button>
              <el-button class="btn" :class="{'border':is_Show == 3}" @click="selectDate('today',{'date':date,'is_Show':3,time:date.daya})">
                日
              </el-button>
              <el-button  class="btn" :class="{'border':is_Show == 4}" @click="selectDate('today',{'date':date,'is_Show':4})" style="margin-left: 10px;border-bottom-left-radius: 4px;border-top-left-radius: 4px;">
               今天
              </el-button>
            </el-button-group>
          </template>
          <template #date-cell="{data }">
            <div class="cell" v-loading="loading" >
              <div class="date">
                <span>{{ data.day.split('-').slice(2).join('-') }}</span>
                <template v-for="(item,index) in festival" :key="index"> 
                  <span class="text" v-if="data.day == item.date">{{ item.localName }}</span>
                </template>
                <template v-for="(item,index) in fjData" :key="index"> 
                  <span class="text-fj" v-if="data.day == item.date && !item.target">放假</span>
                </template>
              </div>
              <div class="content">
                <template v-for="item in tableData" :key="item.id" >
                  <div v-if="data.day == item.time" >
                    <template v-for="(key,index) in item.arr" :key="key.id">
                      <div class="solar-date" v-if="index <= 2"  :class="[item.newDate == item.jssj  ? `border-bj${index+1}` : item.newTime < item.jssj ? `border-bj${index+1}`:'']" >
                        <p>{{key.title}}</p>
                      </div>
                    </template>
                    <div class="cell-bottom" v-if="item.arr.length > 3">
                      <p @click="getRiData(data.day)">更多{{item.arr.length}}个日程</p>
                      <el-icon><ArrowRight /></el-icon>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-calendar>
        <div class="zhou" v-else-if="display=='zhou'">
            <div class="zhou-box">
              <el-input
                v-model="input1"
                style="width: 200px;height: 35px;"
                size="large"
                placeholder="输入日程关键词"
                :suffix-icon="Search"
                clearable
              />
              <div class="text">
                <span>{{riYeas+daysOfWeek[0].week.split('/')[1]+'日'}}-{{ daysOfWeek[6].week.split('/')[1]+'日' }}</span>
              </div>
              <el-button-group>
                <el-button @click="dialogFun()" style="margin-right:10px !important;border-top-right-radius: 4px;border-bottom-right-radius: 4px;"  :icon="Plus"  type="primary">
                  新建日程
                </el-button>
                <el-button class="btn" :class="{'border':is_Show == 1}" @click="selectDateFun({str:'yue',is_Show:1,})">
                  月
                </el-button>
                <el-button class="btn" :class="{'border':is_Show == 2}" @click="selectDateFun({str:'zhou',is_Show:2})">
                  周
                </el-button>
                <el-button class="btn" :class="{'border':is_Show == 3}" @click="selectDateFun({str:'ri',is_Show:3})">
                  日
                </el-button>
                <el-button  class="btn" :class="{'border':is_Show == 4}" @click="selectDateFun({str:'yue',is_Show:4})" style="margin-left: 10px;border-bottom-left-radius: 4px;border-top-left-radius: 4px;">
                今天
                </el-button>
              </el-button-group>
            </div>
            <div style="display: flex;width: 100%;justify-content: center">
              <el-table
                :data="table" 
                style="width: 100%" 
                v-loading="loading" 
                :border="true"
                :header-cell-style="{'text-align':'center','background':'#f5f5f5'}" 
                :cell-style="{'text-align':'center','padding':'0 10px'}" >
                <el-table-column label="时间" width="80">
                  <template #default="scope">
                    <div style="display: flex;padding: 0 !important; align-items: center;">
                      <span style="width: 80px;margin-left: 0;text-align: center;">{{ scope.row.day }}</span>
                    </div>
                  </template>
                </el-table-column>
                <template v-for="(key,code) in daysOfWeek" :key="code">
                  <el-table-column :label="daysOfWeek[code].week" width="155">
                    <template #default="scope">
                      <div class="week-box">
                        <template v-for="(item,index) in scope.row['week'+(code+1)]" :key="item.id">
                          <div class="lists" v-if="index <= 1" :class="[scope.row.newDate == scope.row.jssj  ? `border-bj${index+1}` : scope.row.newTime < scope.row.jstime ? `border-bj${index+1}`:'']">
                            <p>{{item.title}}</p>
                          </div>
                          <div class="cell-bottom" v-if="index == 1">
                            <p @click="getRiData(scope.row.time)">更多{{(scope.row['week'+(code+1)]).length}}个日程</p>
                            <el-icon><ArrowRight /></el-icon>
                          </div>
                        </template>
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </div>
        </div>
        <div v-else-if="display=='ri'">
            <div class="ri-box">
              <el-input
                v-model="input1"
                style="width: 200px;height: 35px;"
                size="large"
                placeholder="输入日程关键词"
                :suffix-icon="Search"
                clearable
              />
              <div class="text">
                <span>{{riYeas}}</span>
              </div>
              <el-button-group>
                <el-button @click="dialogFun()" style="margin-right:10px !important;border-top-right-radius: 4px;border-bottom-right-radius: 4px;"  :icon="Plus"  type="primary">
                  新建日程
                </el-button>
                <el-button class="btn" :class="{'border':is_Show == 1}" @click="selectDateFun({str:'yue',is_Show:1,})">
                  月
                </el-button>
                <el-button class="btn" :class="{'border':is_Show == 2}" @click="selectDateFun({str:'zhou',is_Show:2})">
                  周
                </el-button>
                <el-button class="btn" :class="{'border':is_Show == 3}" @click="selectDateFun({str:'ri',is_Show:3})">
                  日
                </el-button>
                <el-button  class="btn" :class="{'border':is_Show == 4}" @click="selectDateFun({str:'yue',is_Show:4})" style="margin-left: 10px;border-bottom-left-radius: 4px;border-top-left-radius: 4px;">
                今天
                </el-button>
              </el-button-group>
            </div>
            <div  v-loading="loading">
              <template v-if="riData.length >0">
                <div class="list" v-for="item in riData" :key="item.id" :class="`color${item.code}`">
                  <div class="list-left">
                    <p class="title">{{item.title}}</p>
                    <div class="time-box items-center">
                      <div class="mr-3px"><el-icon><Clock /></el-icon></div>
                      <div class="span">{{item.time}}</div>
                    </div>
                  </div>
                  <div class="list-rigth">
                    <div class="list-rigth-box">
                      <div class="flex items-center"><el-icon class="mr-3px" style="font-size: 16px;color: #CCC;"><EditPen /></el-icon><span>{{item.ms}}</span></div>
                      <div  class="flex items-center"><el-icon class="mr-3px" style="font-size: 16px;color: #CCC;"><Bell /></el-icon><span>准时提醒</span></div>
                      <div style="display: flex;color: #999;">
                        <div  class="flex items-center" style="margin-right: 6px"><el-icon class="mr-3px" style="font-size: 16px;color: #CCC;"><ChatSquare /></el-icon><span>10</span></div>
                        <div class="flex items-center"><el-icon class="mr-3px" style="font-size: 16px;color: #CCC;"><Paperclip /></el-icon><span>10</span></div>
                      </div>
                      
                    </div>
                    <div class="user-box">
                      <div class="img"><el-icon><UserFilled /></el-icon></div>
                      <div class="text-name">张小刚</div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="ri-null">
                  <div class="ri-null-box">
                    <img src="../../../../../public/img/null.svg" alt=""/>
                    <p>没有日程安排</p>
                  </div>
                </div>
              </template>
            </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogTableVisible" title="新建日程" width="60%" :close-on-click-modal="false">
      <FormView
        formType="edit"
        handleType="returnData"
        showType="view"
        :enhanceData="{addFun}"
        :defaultData="formData.defaultData"
        :showButton="false"
        :formId="formData.formId"
      ></FormView>
    </el-dialog>
    
  </div>
</template>

<script setup lang="ts">
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import { Search,Plus,ArrowRight,Clock,EditPen,Bell,ChatSquare,Paperclip,UserFilled } from '@element-plus/icons-vue'
import {getTableList} from '@/api/design/table/index'
import { string } from 'vue-types';
import { formatDate } from '@/utils/formatTime';

const loading = ref(false)
const dialogTableVisible = ref(false)
const value = ref(new Date())
const isShow = ref(1)
const is_Show = ref(1)
const calendar = ref<CalendarInstance>()
const cities = reactive(['张小刚', '李小红', '王小明', '周小伟'])
const checkList = ref()
const input1 = ref('')
const riYeas = ref(formatDate(new Date() , `YYYY 年 MM 月 DD 日`))
const display = ref('yue')

const formData = ref({
  type: 'exploit',
  refKey: 'orderTop',
  formId: '1856521825921736705',
  // formId: '1850839403742760962',
  defaultData: {}
})

//日历月份切换
const selectDate = (val: CalendarDateType,data) => {
  if(data.date){
    is_Show.value = data.is_Show
    display.value = data.is_Show == 1 || data.is_Show ==  4 ? 'yue' : data.is_Show == 2 ? 'zhou' : 'ri'
  }
  if(data.is_Show == 2){
    getDaysOfWeek()
  }
  if(data.is_Show == 3){
    getRiData('')
  }
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

const selectDateFun = (data) =>{
  display.value = data.str
  is_Show.value = data.is_Show
  if(data.is_Show == 2){
    getDaysOfWeek()
  }
  if(data.is_Show == 3){
    getRiData(data.time)
  }
}

watch(
  () => isShow.value,
  (val) => {
    if(!val){
      checkList.value = ['张小刚', '李小红', '王小明', '周小伟']
    } else {
      checkList.value = []
    }
  }
)


const tableData = ref<any>()
const festival = ref<any>([
  {date:"2024-01-01",localName:"元旦"},
  {date:"2024-02-10",localName:"春节"},
  {date:"2024-04-05",localName:"劳动节"},
  {date:"2024-06-10",localName:"端午节"},
  {date:"2024-09-17",localName:"中秋节"},
  {date:"2024-10-01",localName:"国庆节"},
])
const fjData = ref<any>([
  {date: '2024-09-15',name: '中秋节'},
  {date: '2024-09-16',name: '中秋节'},
  {date: '2024-09-17',name: '中秋节'},
  {date: '2024-10-01',name: '国庆节'},
  {date: '2024-10-02',name: '国庆节'},
  {date: '2024-10-03',name: '国庆节'},
  {date: '2024-10-04',name: '国庆节'},
  {date: '2024-10-05',name: '国庆节'},
  {date: '2024-10-06',name: '国庆节'},
  {date: '2024-10-07',name: '国庆节'},
]) 

//初始化数据
const init =   () =>{
  new Promise(async (resolve) => {
    loading.value = true
    const arrays = ref<any>([])
    const obj = ref<any>({})
    //获取日历数据
    const data = await getTableList('1850723645460291586',{  },false)
    if(data.records.length > 0){
      data.records.map((item,index) =>{
        item.time = formatDate(item.kssj , `YYYY-MM-DD`)
        item.kstime = formatDate(item.kssj , `YYYY-MM-DD HH:mm:ss`)
        item.jstime = formatDate(item.jssj , `YYYY-MM-DD`)
        item.newDate = formatDate(new Date() , `YYYY-MM-DD`)
        item.newTime = new Date().getTime()
        item.arr = item.sub_more_date ? JSON.parse(item.sub_more_date) : []
        if(obj[data.records[index].time] == undefined){
          obj[data.records[index].time] = true
          arrays.value.push(item)
        } else {
          arrays.value.forEach(key =>{
            if(key.time == item.time) key.arr = key.arr.concat(item.arr)
            return key
          })
        }
        
        return item
      }) 
    }
    tableData.value = arrays.value
    loading.value = false
    resolve(data)
  })
}

//新增日程
const addFun = () =>{
  dialogTableVisible.value = false
  init()
}


//日显示
const riData = ref<any>([])
const getRiData = (timeData) =>{
  riData.value = []
  loading.value = true
  riYeas.value = formatDate(timeData , `YYYY 年 MM 月 DD 日`) || formatDate(new Date() , `YYYY 年 MM 月 DD 日`)
  let code = 0
  if(timeData){
    display.value = 'ri'
    is_Show.value = 3
  }
  new Promise(async (resolve) => {
    let data = await getTableList('1850723645460291586',{ pageNo: 1, pageSize: 10,kssj:timeData, },false)
    loading.value = false

    if(data.records){
      data.records.map(item =>{
        JSON.parse(item.sub_more_date).map(key=>{
          key.code = code
          code = ++code > 2 ? 0 : code
          key.time = formatDate(item.kssj, `YYYY-MM-DD HH:mm`)
          riData.value.push(key)
        })
      })
      
    }
    resolve(data)
  })
}

const dialogFun = () =>{
  dialogTableVisible.value = true
}

//周显示
const table = ref<any>([])
const daysOfWeek = ref<any>([])
const getDaysOfWeek = () => {
  loading.value = true

  let arr:any = []
  const now:any = new Date();
  const startDayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // 如果今天是周日，则设置为7
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayOfMonth:any = new Date(currentYear, currentMonth, 1);
  const currentWeek = Math.ceil((now - firstDayOfMonth) / (1000 * 60 * 60 * 24 * 7));
  daysOfWeek.value = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() - startDayOfWeek + i + 1); // 计算一周中的每一天
    let rq = day.toISOString().split('T')[0].split('-')[2]
    if(i == 0 || i == 6) arr.push(formatDate(day, `YYYY-MM-DD HH:mm:ss`))
    daysOfWeek.value.push({
      day:day.toISOString().split('T')[0],
      week:i==0 ? '周一 '+currentWeek+'/'+rq:i==1 ? '周二 '+currentWeek+'/'+rq:i==2 ? '周三 '+currentWeek+'/'+rq:i==3 ? '周四 '+currentWeek+'/'+rq:i==4 ? '周五 '+currentWeek+'/'+rq:i==5 ? '周六 '+currentWeek+'/'+rq:'周日 '+currentWeek+'/'+rq
    });
  }

  getTableDate(arr)
};

const getTableDate = (timeData) =>{
  new Promise(async (resolve) => {
    riYeas.value = formatDate(new Date() , `YYYY 年 MM 月`)
    table.value = []
    const arrays = ref<any>([])
    const object = ref<any>({})
    let obj = {}
    let data = await getTableList('1850723645460291586',{ pageNo: 1, pageSize: 10,kssj:timeData.join(',') },false)
    
    data.records.map((item,index)=>{
      item.time = formatDate(item.kssj, `YYYY-MM-DD`)
      item.jstime = formatDate(item.jssj , `YYYY-MM-DD`)
      item.newDate = formatDate(new Date() , `YYYY-MM-DD`)
      item.arr = item.sub_more_date ? JSON.parse(item.sub_more_date) : []
      if(object[data.records[index].time] == undefined){
          object[data.records[index].time] = true
          arrays.value.push(item)
        } else {
          arrays.value.forEach(key =>{
            if(key.time == item.time) key.arr = key.arr.concat(item.arr)
            return key
          })
        }
      return item
    })
    for (let i = 0; i <= 24; i++) {
      if(i == 0){//全天
        obj = {}
        obj['day'] = '全天'
        arrays.value.map(item=>{
          item.time = formatDate(item.kssj, `YYYY-MM-DD`)
          daysOfWeek.value.forEach((key,index) => {
            if(key.week.split('/')[1] == item.time.split('-')[2]){
              obj['time'] = item.time
              obj['jssj'] = item.jstime
              obj['jstime'] = item.jssj
              obj['newDate'] = item.newDate
              obj['newTime'] = new Date().getTime()
              obj['week'+(index+1)] = item.arr
            }
          });
          return item
        })
        table.value.push(obj)
      } else if(i != 0){//每小时
        obj = {}
        let day = i <= 10 ? '0'+ (i-1) : (i-1)
        obj['day'] = day
        data.records.map(item=>{
          item.time = formatDate(item.kssj, `YYYY-MM-DD HH`)
          daysOfWeek.value.forEach((key,index) => {
            if(key.week.split('/')[1] == item.time.split('-')[2].split(' ')[0] && item.time.split(' ')[1].includes(day)){
              obj['time'] = item.time
              obj['jstime'] = item.jssj
              obj['newDate'] = item.newDate
              obj['newTime'] = new Date().getTime()
              obj['week'+(index+1)] = item.time.split(' ')[1].includes(day) ? item.arr : [] 
            }
          });
          return item
        })
        table.value.push(obj)
      }
    }

    loading.value = false
    resolve(data)
  })
}

onMounted(()=>{
  init();
  
})
</script>

<style lang="scss" scoped>
.box{
  display: flex;
  margin: auto;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);
  
  .box-left{
    width: 19%;
    padding-bottom: 20px;
    background: #fcfcfc;
    border: 1px solid #eaeaea;

    p{
      padding: 0;
      margin: 0;
    }

    .title{
      height: 60px;
      padding-left: 20px;
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 60px;
      color: #666;
      text-align: left;
    }

    ::v-deep .custom-calendar .el-calendar-day{
      // width: 28px !important;
      height: 26px;
      // color: #409EFF;
      padding: 0 ;
      margin: auto ;
      font-family: '微软雅黑', sans-serif;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px;
      text-align: center;
    }

    ::v-deep .el-calendar__header{
      border-bottom: none;
    }

    ::v-deep .el-calendar__body{
      padding: 0 20px 25px;

      .el-calendar-table {

        thead th{
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          color: #666;
        }

        td{
          width: 28px;
          border-color: #fff;

          &.is-selected{
            margin: 0;
            background: none;
            border: 1px solid #59aafd !important;
            border-radius: 5px;
          }
        }
      }
    }

      .tabs{
        text-align: center;

        .tabs-box{
          display: flex;
          height: 50px;
          padding-left:55px;
          align-items: center;
          
          p{
            padding: 0;
            margin: 0;
            margin-left: 10px;
            font-family: '微软雅黑', sans-serif;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            color:#666;
            text-align: left;
          }
        }
      }

      .checkbox{

        .checkbox-box{
          display: flex;
          margin-top: 10px;
          flex-direction: column;

          .el-checkbox{
            justify-content: center;
            margin-bottom: 15px;
          }

          .el-checkbox:last-child{
            margin-left: -25px;
          }

          .img{
            display: flex;
            width: 28px;
            height: 28px;
            margin-right:6px;
            font-size: 20px;
            color: #fff;
            background: #ccc;
            border-radius: 50%;
            justify-content: center;
            align-items: center;
          }
        }
      }
  }
     

  .box-right{
    width: 77%;
    padding:20px;
    background: #fff;

    ::v-deep .el-calendar__header{
      border-bottom: none;
    }

    ::v-deep .calendar{
      th::before{
        content: '周 ';
      }

      .el-button{
        padding: 10px 15px;
      }

      .time{
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 40px;
        color: #666;
      }
      
      .btn{
        // z-index: 1111;
        font-family: '微软雅黑', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        color: #999;
      }
    }

    ::v-deep .el-calendar__body{
      padding: 0 20px 25px;

      .el-calendar-table {

        thead th{
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          color: #666;
          text-align: left;
        }

        td{
          border-color: #fff;

          &.is-selected{
            margin: 0;
            background: none;
            border-top: 1px solid #59aafd !important;
          }
        }

        .is-today{
          background: #ecf5ff !important;
          border: #fff;
          border-top-color: #59aafd;
        }

        .el-calendar-day{
          position: relative;
          // width: 158px;
          height: 166px;
          border-top:1px solid  rgb(233 233 233 / 100%);
          
          .cell{

            .date {
              position: relative;
              font-family: '微软雅黑', sans-serif;
              font-weight: 400;
              color: #666;

              .text{
                margin-left: 10px;
                font-size: 14px;
              }

              .text-fj{
                position: absolute;
                right: 0;
                padding: 1px 12px;
                font-family: '微软雅黑', sans-serif;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                color: #F56C6C;
                text-align: center;
                border: 1px solid #F56C6C;
              }
            }

            .content{
              padding-top: 5px;
              

              .solar-date{
                padding: 4.5px 10px;
                margin-bottom:5px ;
                background: #f5f5f5;
                border-left: 2px solid rgb(204 204 204 / 100%);

                p{
                  padding: 0;
                  margin: 0;
                  font-family: '微软雅黑', sans-serif;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  color: #CCC;
                  text-align: left;
                }
              }

              .cell-bottom{
                position: absolute;
                bottom: 20px;
                display: flex;
                align-items: center;
                font-family: '微软雅黑', sans-serif;
                font-size: 12px;
                font-weight: 400;
                color: #409EFF;
                text-align: left;

                p{
                  padding: 0;
                  margin: 0;
                  margin-right:5px;
                }
              }
            }
          }
        }
      }
    }

    .zhou{
      // display: flex;
      // width: 100%;
      // padding: 0 20px;
      // margin-top: 3px;
      // justify-content: space-between;
      // align-items: center;

      // .text{
      //   margin-top: 10px;
      //   font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
      //   font-size: 18px;
      //   font-style: normal;
      //   font-weight: 700;
      //   line-height: 40px;
      //   color: #666;
      // }

      .zhou-box{
        display: flex;
        padding: 0 20px;
        margin-top: 4px;
        margin-bottom: 20px;
        justify-content: space-between;
        align-items: center;

        .text{
          margin-top: 10px;
          font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 40px;
          color: #666;
        }
      }

      ::v-deep .cell{
        position: relative;

        .week-box{
          padding: 0;
          margin: 0;
          
          // background: red;

          .lists{
            padding: 1px 10px;
            margin-bottom:5px ;
            background: #f5f5f5;
            border-left: 2px solid rgb(204 204 204 / 100%);

            p{
              padding: 0;
              margin: 0;
              font-family: '微软雅黑', sans-serif;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              color: #CCC;
              text-align: left;
            }
          }

          .cell-bottom{
            display: flex;
            font-family: '微软雅黑', sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: #409EFF;
            text-align: left;
            cursor: pointer;
            align-items: center;

            p{
              padding: 0;
              margin: 0;
              margin-right:5px;
            }
          }
        }
      }
       

    }

    .ri-box{
      display: flex;
      padding: 0 20px;
      margin-top: 4px;
      justify-content: space-between;
      align-items: center;

      .text{
        margin-top: 10px;
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 40px;
        color: #666;
      }
    }

    .list{
      display: flex;
      padding: 20px 13px;
      margin-top: 20px;
      border-left: 5px solid;
      box-shadow: 0 0 5px rgb(0 0 0 / 9.8%);
      justify-content: space-between;

      .list-left{

        p{
          padding: 0;
          margin: 0;
        }

        .title{
          font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #666;
        }

        .time-box{
          display: flex;
          margin-top: 15px;
          font-family: MicrosoftYaHei, "微软雅黑", sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #999;

          .span{
            margin-top:-3px;
          }
        }
      }

      .list-rigth{
        display: flex;
        align-items: center;
        width: 40%;

        .list-rigth-box{
          display: flex;
          width:70%;
          margin-right: 15%;
          font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #666;
          justify-content: space-between;
        }

        .user-box{
          width: 10%;

          .img{
            display: flex;
            width: 34px;
            height: 37px;
            margin-bottom: 10px;
            font-size: 22px;
            color: #f9f9f9;
            background: #ccc;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
          }

          .text-name{
            font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: #999;
          }
        }
      }
    }
  }
}

.dialog-btn{
  display: flex;
  width: 94%;
  padding: 20px;
  font-family: '微软雅黑', sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  color: #999;
  border-top: 1px solid #ebebeb;
  justify-content: end;
  
  .qx{
    background: #f9f9f9;
  }

  .bc{
    color: #FFF;
  }
}

.acitive{
  background: #f5f5f5;
  border-right:3px solid rgb(64 158 255 / 100%);

  p{
    font-weight: 700 !important;
  }
}

.ri-null{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 500px;

  .ri-null-box{
    text-align: center;

    img{
      width: 120px;
      height: 120px;
    }
    
    p{
      padding: 0;
      margin: 0;
      font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      color: #CCC;
    }
  }
}

::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #666 !important;
}

.border-bj1 {
  background-color: rgb(255 240 239 / 100%) !important;
  border-color: rgb(251 98 96 / 100%) !important;

  p{
    color: #666 !important;
  }
}

.border-bj2 {
  background-color: rgb(230 245 255 / 100%) !important;
  border-color: rgb(0 153 255 / 100%) !important;

  p{
    color: #666 !important;
  }
}

.border-bj3 {
  background-color: rgb(243 240 254 / 100%) !important;
  border-color: rgb(129 103 245 / 100%) !important;

  p{
    color: #666 !important;
  }
}

::v-deep .el-dialog__header.show-close{
  padding: 15px 20px;
}

.border{
  z-index: 1;
  border: 1px solid #409eff;
}

.color0{
  border-color: #24d2d3 !important;
}

.color1{
  border-color: #fec03d !important;
}

.color2{
  border-color: #52c1f5 !important;
}

::v-deep .el-table{
  .el-table__header-wrapper{
    .el-table__cell{
      height: 45px;
    }
  }

  .el-table__body-wrapper{
    .el-table__row{
      .el-table_1_column_1{
        background: #f5f5f5 !important;
      }

      .el-table__cell{
        height: 95px;
      }
    }

    .el-table__row{
      .el-table__cell:nth-child(1){
        background: #f5f5f5 !important;
      }
    }
  }
}

::v-deep .el-input__inner{
  height: 35px;
}
</style>
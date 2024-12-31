<template>
  <div class="WorkReport-box rounded-xl">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabsList" :key="item.name" :label="item.label" :name="item.name">
        <LowTable tableId="1853269839533273090" :enhanceData="tabEnhanceData"> </LowTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { LowTable } from '@/components/LowDesign/index'
import type { TabsPaneContext } from 'element-plus'

defineOptions({ name: 'WorkReport' })

const tabsList = ref([
  { label: '全部报告', name: 1 },
  { label: '我提交的', name: 2 },
  { label: '抄送给我的', name: 3 },
  { label: '提交给我的', name: 4 }
])
const activeName = ref(1)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const tabEnhanceData = ref({
  stepList: [
    {
      id: 1,
      icon: 'mynaui:flag-solid',
      iconColor: '#0099FF',
      time: '19:54:03',
      type: '任务',
      do: '创建了',
      content: '项目日常任务'
    },
    {
      id: 2,
      icon: 'mingcute:upload-fill',
      iconColor: '#FF7A8C',
      time: '19:54:03',
      type: '文件',
      do: '上传了',
      content: '交互设计文档'
    },
    {
      id: 3,
      icon: 'mynaui:box-solid',
      iconColor: '#FF7A8C',
      time: '19:54:03',
      type: '项目',
      do: '创建了',
      content: '示例项目名称'
    },
    {
      id: 4,
      icon: 'mdi:address-marker',
      iconColor: '#FF7A8C',
      time: '19:54:03',
      type: '日程',
      do: '创建了',
      content: '项目日常会议'
    },
    {
      id: 5,
      icon: 'si:user-fill',
      iconColor: '#52C1F5',
      time: '19:54:03',
      type: '联系人',
      do: '新增了',
      content: '项目联系人'
    }
  ],
  form2Data: {
    areaOne:
      '对于一个客服代表来说，做客服工作的感受就象是一个学会了吃辣椒的人，整个过程感受最多的只有一个字：辣。如果到有一天你已经习惯了这种味道，不再被这种味道呛得咳嗽或是摸鼻涕流眼泪的时候就说明你已经是一个非常有经验的老员工了。我是从一线员工上来的，所以深谙这种味道。作为一个班长，在接近两年的班长工作中，我就一直在不断地探索，企图能够找到另外一种味道，能够化解和消融前台因用户所产生的这种辣味，这就是话务员情绪管理。毕竟大多数的人需要对自己的情绪进行管理、控制和调节。',
    areaTwo:
      '细细回忆这段时间以来的工作过程及目前公话组的整个状态，虽然在我们大家的共同努力下有了较大的变化，但是仍有许多的缺点和不足等着我们去规划和改观。首先在服务质量和服务意识方面离省局的要求还存在较大差距，不管成功与否，我们都将不断地摸索和尝试，如作大型的关于服务意识及情绪管理方面的培训来激发前台的工作积极性。或为了提高语音亲和力，作语音艺术培训及在公司工会的倡导和鼓励下号召全话务中心参与诗歌朗诵大赛等尝试，在培养声音魅力过程中，让电话交流的载体更加生动，由此而产生一批更加出色的客服代表。然后是在座席间工作纪律及员工思想动态上将进一步加大管理力度，由于公话组是呼叫中心人数最多的一个组，对于今后的工作可谓任重而道远。',
    table: [
      {
        id: 1,
        table_file: 'http://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/111.txt',
        tale_size: '2MB',
        table_time: '2024-11-15 15:43:23',
        table_user: '1'
      },
      {
        id: 2,
        table_file: 'http://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/111.txt',
        tale_size: '2MB',
        table_time: '2024-11-15 16:43:23',
        table_user: '1'
      },
      {
        id: 3,
        table_file: 'http://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/111.txt',
        tale_size: '2MB',
        table_time: '2024-11-15 16:43:23',
        table_user: '1'
      },
      {
        id: 4,
        table_file: 'http://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/111.txt',
        tale_size: '2MB',
        table_time: '2024-11-15 16:43:23',
        table_user: '1'
      },
      {
        id: 5,
        table_file: 'http://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/111.txt',
        tale_size: '2MB',
        table_time: '2024-11-15 16:43:23',
        table_user: '1'
      },
      {
        id: 6,
        table_file: 'http://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/111.txt',
        tale_size: '2MB',
        table_time: '2024-11-15 16:43:23',
        table_user: '1'
      }
    ],
    alertList: [
      {
        id: 1,
        imgUrl:
          'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
        name: '赵小刚',
        time: '2019-03-23 22:31',
        content: '非常不错的分享，对我们的工作很有参考价值。'
      },
      {
        id: 2,
        imgUrl:
          'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
        name: '赵小刚',
        time: '2019-03-23 22:31',
        content: '非常不错的分享，对我们的工作很有参考价值。'
      },
      {
        id: 3,
        imgUrl:
          'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
        name: '赵小刚',
        time: '2019-03-23 22:31',
        content: '非常不错的分享，对我们的工作很有参考价值。'
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.WorkReport-box {
  min-height: 500px;
  border: 1px solid rgb(233 233 233 / 100%);
  box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);

  .font-wryh {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  }

  ::v-deep(.el-tabs) {
    .el-tabs__header {
      display: flex;
      height: 60px;
      padding-left: 25px;
      // border-bottom: none;
      margin-bottom: 0;
      align-items: center;

      .el-tabs__nav {
        border-bottom: 1px solid #e4e7ed;
        border-radius: 5px;

        .el-tabs__item {
          width: 101px;
          height: 35px;
          font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
          color: #999;
          background-color: white;

          &.is-active {
            color: white;
            background-color: rgb(64 158 255 / 100%);
          }

          &:first-child {
            border-radius: 5px 0 0 5px;
          }

          &:last-child {
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }

    .el-tabs__content {
      padding: 25px 20px;
      background-color: white;
    }
  }
}
</style>

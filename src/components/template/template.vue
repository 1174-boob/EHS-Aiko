<template>
  <!-- 角色 -->
  <div class="role-box">
    <h2 class="role-title">合同管理</h2>
    <!-- 查询 -->
    <div class="role-search">
      <!-- 左侧搜索 -->
      <div class="role-search-left">
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="合同编号">
            <a-input class="role-search-left-item" allowClear v-model="formInline.roleId" placeholder="请输入合同编号"></a-input>
          </a-form-model-item>
        </a-form-model>
      </div>
      <!-- 右侧按钮 -->
      <div class="role-search-right">
        <a-button type="primary" style="margin-right:15px" @click="getTableList">查询</a-button>
        <a-button @click="iRest">重置</a-button>
      </div>
    </div>
    <!-- 创建角色 -->
    <div class="role-apply">
      <a-button type="primary" @click="goContractApplication">创建角色</a-button>
    </div>
    <!-- 表格 -->
    <div class="role-table">
      <a-table :columns="columns" :locale="{emptyText: '暂无数据'}" :data-source="dataList" rowKey="name" :pagination="false">
        <div class="table-btn" slot="action" slot-scope="text,record">
          <span>查看</span>
          <span>修改</span>
          <span class="table-btn-rm">删除</span>
        </div>
      </a-table>
      <div class="table-pagination">
        <a-pagination simple :current="page.pageNo" :pageSize="page.pageSize" :total="page.total" show-less-items showQuickJumper @change="pageNoChange" />
        <span class="table-pagination-totel">
          共
          <span>{{page.total}}</span>
          条
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import dictionary from '@/utils/dictionary'
import { getContractTableList, changeContractItemStatus } from '@/services/api'
import dayJs from 'dayjs';
export default {
  data() {
    return {
      formInline: {
        roleId: '',
        timeArr: [],
        status: [],
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '角色描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          dataIndex: 'action',
          title: '操作',
          width: 180,
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataList: [
        {
          key: 1,
          name: '1446408891691831296',
          description: '合同类型',
        },
      ],
      // 本页字典数据
      dictionary: [],
    }
  },
  created() {
    this.columns.forEach(item => {
      item.align = item.align ? item.align : 'center'
      item.ellipsis = item.ellipsis ? item.ellipsis : true
    })
    this.dictionary = dictionary('roleStatus')
    console.log('本页字典-', this.dictionary);
  },
  mounted() {
    // this.getTableList()
  },
  methods: {
    // 跳转创建角色
    goContractApplication() {
      this.$router.push({ path: 'roleApply' })
    },
    // 获取列表
    getTableList() {
      // console.log(this.formInline.timeArr);
      // return
      let startTime = this.formInline.timeArr[0] ? dayJs(this.formInline.timeArr[0]).format('YYYY-MM-DD') : ''
      let endTime = this.formInline.timeArr[1] ? dayJs(this.formInline.timeArr[1]).format('YYYY-MM-DD') : ''
      let { roleId, status } = this.formInline
      let { pageNo, pageSize } = this.page
      let postData = { startTime, endTime, roleId, status, pageNo, pageSize }
      getContractTableList(postData)
        .then(res => {
          console.log('getTableList-', res);
          let { list: dataList, total } = res.data ? res.data : { list: [], total: 0 }
          dataList.forEach(item => {
            let dictionary = this.dictionary.filter(item2 => {
              return item.roleStatus == item2.key
            })
            item.dictionary = dictionary.length > 0 ? dictionary[0] : { color: 'red', value: '字典系统异常' }
          })
          this.dataList = dataList
          this.page.total = total
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getTableList()
    },
    // 重置
    iRest() {
      this.formInline = {
        roleId: '',
        timeArr: [],
        status: [],
      }
      this.getTableList()
    },
    // 详情
    goDetail(row) {
      this.$router.push({ path: `roleDetail/${row.roleId}` })
    },
    // 撤销
    revoke(row) {
      // console.log(row);
      let postData = {
        roleId: row.roleId,
        roleStatus: 3
      }
      this.$antConfirm({
        title: '撤销',
        content: '对本合同撤销后，将在1~3个工作日内完成处理，处理成功后可以对合同内关联订单重新申请合同。',
        cancelText: '取消',
        onOk: () => {
          changeContractItemStatus(postData)
            .then(res => {
              // console.log(res);
              this.$antMessage.success('撤销成功');
              this.getTableList()
            })
            .catch(err => {
              console.log(err);
            })
        },
      });
    }
  },

}
</script>

<style lang="less" scoped>
.role-box {
  // title
  .role-title {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 0 30px;
  }
  // 查询
  .role-search {
    padding: 27px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    background: rgba(250, 250, 250, 0.5);
    border: 1px solid #f4f4f4;
    border-radius: 2px;
    .role-search-left-item {
      width: 220px;
    }
  }
  // 创建角色
  .role-apply {
    margin: 20px 0;
  }
  .role-table {
    .table-status {
      i {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .table-btn {
      display: flex;
      align-items: center;
      justify-content: space-around;
      & > span {
        cursor: pointer;
        color: #0067cc;
      }
      .table-btn-rm {
        color: #dd000d;
        cursor: auto;
      }
    }
    .table-pagination {
      display: flex;
      margin: 15px 15px;
      justify-content: flex-end;
      align-items: center;
      .table-pagination-totel {
        margin-left: 15px;
        & > span {
          color: #0065c8;
        }
      }
    }
  }
}
</style>

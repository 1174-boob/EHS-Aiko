<template>
  <!-- 三级安全教育管理 -->
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="false"></CommonSearchItem>
        <a-form-model-item label="发起人">
          <a-input v-model="formInline.createNameOrJobNumber" placeholder="请输入发起人姓名或工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="类型">
          <a-select allowClear show-search v-model="formInline.type" placeholder="请选择类型">
            <a-select-option v-for="item in getDictTarget('s','employeeType')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="当前级别">
          <a-select allowClear show-search v-model="formInline.currentLevel" placeholder="请选择当前级别">
            <a-select-option v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select allowClear show-search v-model="formInline.status" placeholder="请选择状态">
            <a-select-option v-for="item in getDictTarget('s','securityEducationStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="日期">
          <a-range-picker format="YYYY-MM-DD" class="search-range-picker" style="width: 200px" valueFormat="YYYY-MM-DD" v-model="formInline.entryDate" :placeholder="['发起日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <DashBtn>
      <div>
        <a-button type="dashed" @click="goSafetyEduInitiate">发起</a-button>
      </div>
    </DashBtn>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return record.id}" :pagination="false">
        <div slot="createUserJobNumber" slot-scope="record">{{ record.createUserName }}/{{ record.createUserJobNumber }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'add')">成绩纠错</span>
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'show')">查看</span>
          <span class="color-0067cc cursor-pointer" @click="viewFile(record)">重新分配</span>
          <span class="color-ff4d4f cursor-pointer" @click="rmSafetyEduItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import dayJs from "dayjs"
import {getDictTarget} from '@/utils/dictionary'
import { debounce, cloneDeep } from 'lodash'
import {getEducationListPage, educationDelete} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  components: {  },
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  data() {
    return {
      getDictTarget,
      labelColSpec: { span: 6 },
      wrapperColSpec: { span: 18 },
      formInline: {},
      choosedArr: [],
      selectedRowKeys: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableSpinning: false,
      columns:  [
        {
          title: '编号',
          dataIndex: 'num',
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 200
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 150,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 150,
          customRender: (text) => {
            text = text ? this.getType(text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '当前级别',
          dataIndex: 'currentLevel',
          width: 150,
          customRender: (text) => {
            text = text ? this.getCurrentLevel(text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '发起人',
          scopedSlots: { customRender: 'createUserJobNumber' },
          width: 150
        },
        {
          title: '发起时间',
          dataIndex: 'createTime',
          width: 150,
          customRender: (text) => {
            text = text ? text: '--'
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '签署截止时间',
          dataIndex: 'signDeadline',
          width: 160,
          customRender: (text) => {
            text = text ? text: '--'
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 150,
          customRender: (text) => {
            text = text ? this.getStatus(text) : '--'
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 240 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      userId: undefined
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.init()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  methods: {
    async init() {
      this.getDataList()
    },
    getType(text){
      if(text==1){
        return '新员工'
      } else if (text==2){
        return '转(复)岗'
      } else {
        return '--'
      }
    },
    getCurrentLevel(text){
      if(text==1){
        return '公司级'
      } else if (text==2){
        return '车间(部门)级'
      } else if (text==3){
        return '班组级'
      } else {
        return '--'
      }
    },
    getStatus(text){
      if(text==1){
        return '待开始'
      } else if (text==2){
        return '进行中'
      } else if (text==3){
        return '已完成'
      } else {
        return '--'
      }
    },
    
    getSearchData(){
      const { entryDate } = this.formInline
      const createDateStart = entryDate?.length ? entryDate[0] : undefined
      const createDateEnd = entryDate?.length ? entryDate[1] : undefined
      let apiData = {
        // 查询项
        ...this.formInline,
        entryDate:undefined,
        signatureFinalDate:undefined,
        createDateStart,
        createDateEnd,
        // 页码
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        // 级别
      }
      return apiData
    },  
    getDataList() {
      let params = this.getSearchData()
      this.tableSpinning = true
      return getEducationListPage(params)
        .then((res) => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableDataList = tableDataList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err=>{})
        .finally(() => {
          this.tableSpinning = false
        })
    },

    // 跳转发起页面
    goSafetyEduInitiate(targetItem){
      let query = {
        id:targetItem.id,
        type:'add',
      }
      this.$router.push({
        path:'/ehsGerneralManage/securityArchiveManagement/safetyEduInitiate',
        query,
      })
    },  

    // 上岗意见（班组级、有成绩的结果，未填写意见）
    goCorrectionGrades(targetItem,type){
      let query = {
        id:targetItem.id,
        type,
      }
      this.$router.push({
        path:'/ehsGerneralManage/securityArchiveManagement/safetyEduCorrectionGrades',
        query,
      })
    },  

    // 重新发起
    onceAgainInitiate:debounce(function () {
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择重新发起人员！')
        return
      }
      const condition = (item) => {
        return item.signatureStatus != 0;
      };
      const canNotSign = this.choosedArr.some(condition);
      if (canNotSign) {
        this.$antMessage.warning('请正确选择重新发起人员！')
        return;
      } else {
        const personIds = this.choosedArr.map(item => {
          return item.id
        })
        this.$router.push({
          path:'',
          query:{personIds}
        })
      }
    }, 250, { leading: true, trailing: false }),
    
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.choosedArr = selectedRows
      console.log('selectedRowKeys111',selectedRowKeys,'selectedRows222',selectedRows);
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      this.choosedArr = []
      this.selectedRowKeys = []
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    // 查询
    iSearch() {
      // 获取列表
      this.page.pageNo = 1
      this.getDataList()
        .finally(() => {
          this.cancelLoading()
        })
      this.selectedRowKeys = []
      this.choosedArr = []
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 预览
    viewFile(row){
      if (!this.canClickBtnMixin("safetyResponsibilityView")) {
        return;
      }
      let query = {
        id: row.id,
        filePreview: true
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityPreview',
        query,
      })
    },
    // 删除
    rmSafetyEduItem(row){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           id:row.id
          }
          await educationDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.ttips {
  height: 100%;
  display: flex;
  align-items: center;
  .circle-item {
    margin-right: 15px;
  }
}
::v-deep .dashed-btn{
  .ant-btn-primary {
    background: #f1f4ff;
    color: #0067cc;
    border: 1px dashed #9fcaf5 !important;
  }
  .ant-btn-primary:hover {
    border: 1px dashed #0067cc !important;
  }
}
.testInfo {
  border: 2px dashed grey;
  overflow: hidden;
}
.pe-data-item{
  display: inline-block;
  width:224px;
  height: 64px;
  cursor: pointer;
  position: relative;
  background: rgba(250,250,250,0.50);
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px;
  padding-left:30px;
  margin-right: 20px;
  margin-bottom: 20px;
  &:last-child{
    margin-right: 0px;
  }
  // & +.pe-data-item{
  //   margin-right: 20px;
  // }
  &.active{
    background:#fff;
  }
  i {
    position: absolute;
    display: inline-block;
    background-color: #333;
    -webkit-mask-image: url(~@/assets/images/data-icon.svg);
    mask-image: url(~@/assets/images/data-icon.svg);
    width:14px;
    top: 37px;
    right: 20px;
    height: 14px;
  }
}
.link-span{
  cursor: pointer;
  color:#02A7F0;
}
.total-pe-num{
  &.active{
    border: 1px solid rgba(0,103,204,1);
    box-shadow: 0px 0px 10px 0px rgba(0,103,204,0.1);
    .pe-data-body{
      color: #0067CC;
    }
    .en-illus{
      color: #0067CC;
    }
    i {
      background-color: rgba(0,103,204,1);
    }
  }
}
.cyan-pe-num{
  &.active{
    border: 1px solid #56E9C8;
    box-shadow: 0px 0px 10px 0px rgba(255,157,1,0.1);
    .pe-data-body,.en-illus{
      color: #56E9C8;
    }
    i {
      background-color:#56E9C8;
    }
  }
}
.purple-pe-num{
  &.active{
    border: 1px solid #CC66B0;
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #CC66B0;
    }
    i {
      background-color:#CC66B0;
    }
  }
}
.yellow-pe-num{
  &.active{
    border: 1px solid #FFAF30;
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #FFAF30;
    }
    i {
      background-color:#FFAF30;
    }
  }
}
.red-pe-num{
  &.active{
    border: 1px solid #FF8A8A;
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #FF8A8A;
    }
    i {
      background-color:#FF8A8A;
    }
  }
}
.pe-data-container{
  margin-bottom:0px;
  .pe-data-body{
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .en-illus{
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    font-weight: 400;
    margin-top:10px;
  }
}
.pe-green{
  color: #02DFAD;
}
.pe-red{
  color:#FF1212;
}
.pe-data-title{
  margin-bottom: 30px;
  padding-bottom:20px;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}
.pe-data-body{
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>
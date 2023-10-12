<template>
  <!-- 三级安全教育管理 -->
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="false"></CommonSearchItem>
        <a-form-model-item label="发起人">
          <a-input v-model="formInline.faqiren" placeholder="请输入发起人姓名或工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="类型">
          <a-select allowClear show-search v-model="formInline.leixing" placeholder="请选择类型">
            <a-select-option v-for="item in getDictTarget('s','employeeType')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="当前级别">
          <a-select allowClear show-search v-model="formInline.dangqianjibie" placeholder="请选择当前级别">
            <a-select-option v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select allowClear show-search v-model="formInline.zhaungtai" placeholder="请选择状态">
            <a-select-option v-for="item in []" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
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
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'add')">成绩纠错</span>
          <span class="color-0067cc cursor-pointer" @click="goCorrectionGrades(record,'show')">查看</span>
          <span class="color-0067cc cursor-pointer" @click="viewFile(record)">重新分配</span>
          <span class="color-ff4d4f cursor-pointer" @click="rmSafetyEduItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 签署弹窗 -->
    <SignModal v-model="signModalShow" :signTargetData="signTargetData" @signOnOk="signOnOk"/>

    <!-- 更新上岗意见 -->
    <UpdateCommentsModel v-model="updateCommentsModelShow" :updateCommentsModelData="updateCommentsModelData" @updateOnOk="updateOnOk"/>

  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import dayJs from "dayjs"
import {getDictTarget} from '@/utils/dictionary'
import { debounce, cloneDeep } from 'lodash'
import {getSafetyEduPeopleNum, getSafetyEduTableList, pushBatchSafetyEdu, rmSafetyEduItemApi,exportSafetyEduListApi} from "@/services/safetyEduManagement"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'
import UpdateCommentsModel from './components/updateCommentsModel.vue'
import SignModal from './components/signModal.vue'

export default {
  components: { UpdateCommentsModel,SignModal },
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  data() {
    return {
      getDictTarget,
      currentLevel:'all',
      updateCommentsModelShow:false,
      updateCommentsModelData:[],

      signModalShow: false,
      signTargetData:undefined,

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
      curIndex: undefined,
      countInfo: {
        total: '', //总数
        signingComplete: '', //签署成功
        toBeSigned: '', //待签署
      },
      tableSpinning: false,
      columns:  [
        {
          title: '编号',
          dataIndex: 'num',
          customRender: (text,record) => {
            text = text ? text : '--'
            return (
              <div >
                <span>{{ text }}</span>
              </div>
            );
          },
          width: 200
        },
        {
          title: '标题',
          dataIndex: 'biaoti',
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
          dataIndex: 'leixing',
          width: 150,
          customRender: (text) => {
            text = text ? getDictTarget('s','employeeType','leixing') : ''
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
          dataIndex: 'dangqianjibie',
          width: 150,
          customRender: (text) => {
            text = text ? getDictTarget('s','educationLevel','dangqianjibie') : ''
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
          dataIndex: 'launchUserName',
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
          title: '发起时间',
          dataIndex: 'faqishijian',
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
          dataIndex: 'qianshujiezhishijian',
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
          dataIndex: 'zhuangtai',
          width: 150,
          customRender: (text) => {
            text = text ? getDictTarget('s','educationStatus','zhuangtai') : '--'
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
  activated(){
    if(this.$route.query.activeKey == 3){
      this.init()
    }
  },
  methods: {
    async init() {
      this.getDataList()
      this.getCertCount()
    },
    // 获取到那三个格子的详情数据
    async getCertCount(){
      let params1 = {
        ...this.getSearchData(),
        curIndex:undefined
      }
      const {code, data } = await getSafetyEduPeopleNum(params1)
      if (+code === 20000) {
        this.countInfo = data
      }
    },
    getSearchData(){
      const {entryDate,signatureFinalDate} = this.formInline
      const entryDateStart = entryDate?.length ? entryDate[0] : undefined
      const entryDateEnd = entryDate?.length ? entryDate[1] : undefined
      const signatureFinalDateStart = signatureFinalDate?.length ? signatureFinalDate[0] : undefined
      const signatureFinalDateEnd = signatureFinalDate?.length ? signatureFinalDate[1] : undefined
      // 级别
      const currentLevel = this.currentLevel == 'all' ? undefined : this.currentLevel
      let apiData = {
        // 查询项
        ...this.formInline,
        entryDate:undefined,
        signatureFinalDate:undefined,
        entryDateStart,
        entryDateEnd,
        signatureFinalDateStart,
        signatureFinalDateEnd,
        // 页码
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        // 级别
        currentLevel,
        // 各个人数按钮过滤
        curIndex:this.curIndex,
      }
      return apiData
    },  
    getDataList() {
      let params = this.getSearchData()
      this.tableSpinning = true
      return getSafetyEduTableList(params)
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
    changeTab(tabIndex) {
      this.curIndex = this.curIndex === tabIndex ? undefined : tabIndex
      this.page.pageNo = 1
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    },

    // 批量推送（状态为进行中的可以推送）
    async batchPush() {
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择推送人员！')
        return
      }
      const condition = (item) => {
        return item.signatureStatus != 0;
      };
      const canNotSign = this.choosedArr.some(condition);
      if (canNotSign) {
        this.$antMessage.warning('请正确选择推送人员！')
        return;
      } else {
        const personIds = this.choosedArr.map(item => {
          return item.id
        })
        let para = {
          idList: personIds
        }
        const { code } = await pushBatchSafetyEdu(para)
        if (+code === 20000) {
          this.$antMessage.success('批量推送成功')
          this.selectedRowKeys = []
          this.choosedArr = []
          this.getDataList()
          this.getCertCount()
        }
      }
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
    // 上岗意见-弹窗提交成功
    updateOnOk(){
      this.$antMessage.success(`更新成功`);
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
    },

    // 批量签署-打开弹窗
    async batchSign(targetItem) {
      if(targetItem){
        this.signTargetData = targetItem
      }else{
        if (!this.choosedArr.length) {
          this.$antMessage.warning('至少选择一条数据！')
          return
        }
        const condition = (item) => {
          return item.signatoriesHandlerUserId != this.userId || item.signatureStatus != 2;
        };
        const canNotSign = this.choosedArr.some(condition);
        if (canNotSign && false) {
          this.$antMessage.warning('请正确选择签署数据！')
          return;
        } 
        this.signTargetData = this.choosedArr
      }
      console.log('this.signTargetData',this.signTargetData);
      this.signModalShow = true
    },
    // 批量签署-弹窗提交成功
    signOnOk(){
      this.$antMessage.success("签署成功！");
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
    },  

    // 批量导出(查询项)
    exportExcel: debounce(function () {
      // if (!this.canClickBtnMixin("earlyWarnInfoGasExport")) {
      //   return;
      // }
      this.handleLoadingThree()
      let apiData = {
        ...this.getSearchData(),
      }
      exportSafetyEduListApi(apiData)
        .then(res => {
          this.spreadSheetExcel(res, '三级安全教育')
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoadingThree()
        })
    }, 250, { leading: true, trailing: false }),

    // 批量下载
    batchExport: debounce(function () {
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      this.choosedArr.forEach(item => {
        window.open(item.file.filePath);
      })
      this.selectedRowKeys = []
      this.choosedArr = []
    }, 250, { leading: true, trailing: false }),

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
      this.getCertCount()
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
      this.curIndex = undefined
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
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
          await rmSafetyEduItemApi(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
          this.getCertCount()
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
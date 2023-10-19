<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="部门"></CommonSearchItem>
        <a-form-model-item label="姓名">
          <a-input v-model="formInline.userName" placeholder="请输入姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="类型">
          <a-select allowClear show-search v-model="formInline.type" placeholder="请选择类型">
            <a-select-option v-for="item in getDictTarget('s','employeeType')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据筛选">
          <a-select allowClear show-search v-model="formInline.dealWithStatus" placeholder="请选择数据筛选">
            <a-select-option v-for="item in getDictTarget('s','bossOperateStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select allowClear show-search v-model="formInline.status" placeholder="请选择状态">
            <a-select-option v-for="item in getDictTarget('s','educationStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="入职日期">
          <a-range-picker format="YYYY-MM-DD" class="search-range-picker" style="width: 200px" valueFormat="YYYY-MM-DD" v-model="formInline.employedDate" :placeholder="['开始日期','结束日期']" />
        </a-form-model-item>
        <a-form-model-item label="签署日期">
          <a-range-picker format="YYYY-MM-DD" class="search-range-picker" style="width: 200px" valueFormat="YYYY-MM-DD" v-model="formInline.signDate" :placeholder="['开始日期','结束日期']" />
        </a-form-model-item>
        <a-form-model-item label="成绩">
          <a-select allowClear show-search v-model="formInline.currentScoreStatus" placeholder="请选择成绩">
            <a-select-option v-for="item in getDictTarget('s','educationScore')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上岗意见">
          <a-select allowClear show-search v-model="formInline.bossOpinions" placeholder="请选择上岗意见">
            <a-select-option v-for="item in getDictTarget('s','bossOpinion')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <div class="pe-data-container">
      <a-radio-group v-model="currentLevel" style="margin-bottom: 15px;" button-style="solid" @change="currentLevelChange">
        <a-radio-button value="all">全部</a-radio-button>

        <a-radio-button v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-radio-button>
      </a-radio-group>
      <div>
        <div @click="changeTab(1)" class="pe-data-item total-pe-num" :class="[labelType === 1 ? 'active' : '']">
          <span class="pe-data-body">培训总人数 {{countInfo?.total || '0'}} 人</span>
          <p class="en-illus">total quantity</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item purple-pe-num" :class="[labelType === 2 ? 'active' : '']">
          <span class="pe-data-body">签署完成 {{countInfo?.signingComplete || '0'}} 人</span>
          <p class="en-illus">signed complete</p>
          <i></i>
        </div>
        <div @click="changeTab(3)" class="pe-data-item cyan-pe-num" :class="[labelType === 3 ? 'active' : '']">
          <span class="pe-data-body">通过 {{countInfo?.pass || '0'}} 人</span>
          <p class="en-illus">pass</p>
          <i></i>
        </div>
        <div @click="changeTab(4)" class="pe-data-item yellow-pe-num" :class="[labelType === 4 ? 'active' : '']">
          <span class="pe-data-body">未通过 {{countInfo?.unPass || '0'}} 人</span>
          <p class="en-illus">failed</p>
          <i></i>
        </div>
        <div @click="changeTab(5)" class="pe-data-item red-pe-num" :class="[labelType === 5 ? 'active' : '']">
          <span class="pe-data-body">未签署 {{countInfo?.toBeSigned || '0'}} 人</span>
          <p class="en-illus">to be signed</p>
          <i></i>
        </div>
      </div>
    </div>

    <DashBtn>
      <div>
        <a-button type="dashed" @click="batchPush">批量推送</a-button>
        <a-button type="dashed" @click="openUpdateOpinionModel()">批量更新意见</a-button>
        <!-- 班组级、成绩、上岗意见都存在 -->
        <!-- <a-button type="dashed" @click="batchSign()">批量签署</a-button> -->
        <!-- 无限制 -->
        <a-button type="dashed" @click="exportExcel">批量导出</a-button>
        <!-- 无限制 -->
        <a-button type="dashed" @click="batchExport">批量下载</a-button>
        <!-- 中止、相同级别、相同类型-->
        <a-button type="dashed" @click="onceAgainInitiate">重新发起</a-button>
      </div>
      <div class="ttips">
        <div class="circle-item">
          <span class="red-circle"></span>
          <span>超期未签署</span>
        </div>
      </div>
    </DashBtn>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :rowKey="(record, index)=>{return record.id}"
        :pagination="false"
      >
        <template slot="numSlots" slot-scope="text,record,index">
          <a-popover autoAdjustOverflow>
            <!-- 1未超期 2已超期 -->
            <div slot="content">
              <span v-if="record.signExpired == '2'" class="red-circle"></span>
              <span>{{ text }}</span>
            </div>
            <span v-if="record.signExpired == '2'" class="red-circle"></span>
            <span>{{ text }}</span>
          </a-popover>
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" v-if="record.canUpdateOpinion" @click="openUpdateOpinionModel(record)">上岗意见</span>
          <!-- 签署：非完成状态、存在上岗意见、本人 -->
          <span class="color-0067cc cursor-pointer" v-if="record.status != 2 && record.deptBossOpinion && record.userId == userId" @click="batchSign(record)">签署</span>
          <span class="color-0067cc cursor-pointer" @click="viewFile(record)">预览</span>
          <span class="color-ff4d4f cursor-pointer" @click="rmSafetyEduItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 签署弹窗 -->
    <SignModal v-model="signModalShow" :signTargetData="signTargetData" @signOnOk="signOnOk" />

    <!-- 更新上岗意见 -->
    <UpdateOpinionModel v-model="updateOpinionModelShow" :updateOpinionModelData="updateOpinionModelData" @updateOnOk="updateOnOk" />
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import dayJs from "dayjs"
import { getDictTarget } from '@/utils/dictionary'
import { rmDuplicatesByKey } from '@/utils/util'
import { debounce, cloneDeep, setWith } from 'lodash'
import { getSafetyEduPeopleNum, getSafetyEduTableList, pushBatchSafetyEdu, rmSafetyEduItemApi, exportSafetyEduListApi } from "@/services/safetyEduArchives"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'
import UpdateOpinionModel from './components/updateOpinionModel.vue'
import SignModal from './components/signModal.vue'

export default {
  components: { UpdateOpinionModel, SignModal },
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  data() {
    return {
      getDictTarget,
      currentLevel: 'all',
      updateOpinionModelShow: false,
      updateOpinionModelData: [],

      signModalShow: false,
      signTargetData: undefined,

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
      labelType: undefined,
      countInfo: {
        total: '', //总数
        signingComplete: '', //签署成功
        toBeSigned: '', //待签署
      },
      tableSpinning: false,
      columns: [
        {
          title: '编号',
          dataIndex: 'num',
          scopedSlots: { customRender: 'numSlots' },
          width: 250
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 150,
          customRender: (text) => {
            text = text ? getDictTarget('s', 'employeeType', text) : '--'
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
            text = text ? getDictTarget('s', 'educationLevel', text) : '--'
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
          title: '姓名',
          dataIndex: 'userName',
          width: 150,
          customRender: (text, scoped) => {
            const { userName, userJobNumber } = scoped
            text = userName ? (userJobNumber ? `${userName}/${userJobNumber}` : userName) : userJobNumber
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
          title: '部门',
          dataIndex: 'deptName',
          width: 150,
          customRender: (text) => {
            text = text ? text : '--'
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
          title: '岗位',
          dataIndex: 'jobName',
          width: 150,
          customRender: (text) => {
            text = text ? text : '--'
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
          dataIndex: 'createUserJobNumber',
          width: 150,
          customRender: (text, scoped) => {
            const { createUserName, createUserJobNumber } = scoped
            text = createUserName ? (createUserJobNumber ? `${createUserName}/${createUserJobNumber}` : usercreateUserNameName) : createUserJobNumber
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
          dataIndex: 'createTime',
          width: 170,
          customRender: (text) => {
            text = text ? text : '--'
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
          title: '入职日期',
          dataIndex: 'employedDate',
          width: 150,
          customRender: (text) => {
            text = text ? text : '--'
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
            text = text ? getDictTarget('s', 'educationStatus', text) : '--'
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
          title: '成绩',
          dataIndex: 'currentScoreStatus',
          width: 150,
          customRender: (text) => {
            text = text ? getDictTarget('s', 'educationScore', text) : '--'
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
          title: '上岗意见',
          dataIndex: 'deptBossOpinion',
          width: 150,
          customRender: (text) => {
            text = text ? getDictTarget('s', 'bossOpinion', text) : '--'
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
          title: '签署记录',
          dataIndex: 'securitySignRecordList',
          customRender: (text) => {
            if (!text) {
              return '--';
            }
            text[0] = text ? text[0] : '--';
            const signatoriesJobNumberFirst = text[0] && text[0].signatoriesJobNumber ? text[0].signatoriesJobNumber : '--';
            const signatoriesNameFirst = text[0] && text[0].signatoriesName ? text[0].signatoriesName : '--';
            const signatoriesTimeFirst = text[0] && text[0].signatoriesTime ? text[0].signatoriesTime.split(' ')[0] : '--';
            text[1] = text ? text[1] : '--';
            const signatoriesJobNumberSecond = text[1] && text[1].signatoriesJobNumber ? text[1].signatoriesJobNumber : '--';
            const signatoriesNameSecond = text[1] && text[1].signatoriesName ? text[1].signatoriesName : '--';
            const signatoriesTimeSecond = text[1] && text[1].signatoriesTime ? text[1].signatoriesTime.split(' ')[0] : '--';
            return (
              <a-popover autoAdjustOverflow title="签署人">
                <div slot="content">
                  目标责任人：<p>{signatoriesNameFirst}/{signatoriesJobNumberFirst}&nbsp;&nbsp;&nbsp;{signatoriesTimeFirst}</p>
                  部门负责人：<p>{signatoriesNameSecond}/{signatoriesJobNumberSecond}&nbsp;&nbsp;&nbsp;{signatoriesTimeSecond}</p>
                </div>
                <span>查看记录</span>
              </a-popover>
            );
          },
          width: 150,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
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
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    async init() {
      this.getDataList()
      this.getCertCount()
    },
    // 获取五个格子的详情数据
    async getCertCount() {
      let apiData = {
        ...this.getSearchData(),
        labelType: undefined
      }
      const { code, data } = await getSafetyEduPeopleNum(apiData)
      if (+code === 20000) {
        this.countInfo = data
      }
    },
    getSearchData() {
      const { employedDate, signDate } = this.formInline
      const employedStartDate = employedDate?.length ? employedDate[0] : undefined
      const employedEndDate = employedDate?.length ? employedDate[1] : undefined
      const signStartDate = signDate?.length ? signDate[0] : undefined
      const signEndDate = signDate?.length ? signDate[1] : undefined
      // 级别
      const currentLevel = this.currentLevel == 'all' ? undefined : this.currentLevel
      let apiData = {
        // 查询项
        ...this.formInline,
        employedDate: undefined,
        signDate: undefined,
        employedStartDate,
        employedEndDate,
        signStartDate,
        signEndDate,
        // 页码
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        // 级别
        currentLevel,
        // 各个人数按钮过滤
        labelType: this.labelType,
      }
      return apiData
    },
    getDataList() {
      let params = this.getSearchData()
      this.tableSpinning = true
      return getSafetyEduTableList(params)
        .then((res) => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableDataList = (tableDataList || []).map(item => {
            return {
              ...item,
              canUpdateOpinion: this.getCanUpdateOpinion(item)
            }
          })
          this.page.total = total;
          // 处理页码 问题
          if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err => { })
        .finally(() => {
          this.tableSpinning = false
        })
    },
    changeTab(tabIndex) {
      this.labelType = this.labelType === tabIndex ? undefined : tabIndex
      this.page.pageNo = 1
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    },

    // 级别查询变更
    currentLevelChange() {
      this.getDataList()
      this.getCertCount()
    },

    // 批量推送（状态为进行中的可以推送）
    async batchPush() {
      if (!this.canClickBtnMixin("safetyEduArchivesBatchPush")) {
        return;
      }

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

    // 获取是否能更新上岗意见（班组级、有成绩的结果，未填写意见）
    getCanUpdateOpinion(targetItem) {
      // 班组级 currentLevel 1公司级别  2车间部门级 3班组级
      return targetItem.currentLevel == 3 && targetItem.currentScoreStatus && !targetItem.deptBossOpinion
    },
    // 上岗意见（班组级、有成绩的结果，未填写意见）
    openUpdateOpinionModel(targetItem) {
      if (targetItem) {
        if (!this.canClickBtnMixin("safetyEduArchivesSingleUpdateOpinion")) {
          return;
        }
        this.updateOpinionModelData = targetItem
      } else {
        if (!this.canClickBtnMixin("safetyEduArchivesMoreUpdateOpinion")) {
          return;
        }

        if (!this.choosedArr.length) {
          this.$antMessage.warning('请选择要更新意见的人员！')
          return
        }

        // 是否能更新上岗意见
        let canUpdate = this.choosedArr.every(item => this.getCanUpdateOpinion(item));

        if (!canUpdate) {
          this.$antMessage.warning('请正确选择要更新意见的人员！')
          return;
        }
        this.updateOpinionModelData = this.choosedArr
      }
      this.updateOpinionModelShow = true
    },
    // 上岗意见-弹窗提交成功
    updateOnOk() {
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
    },

    // 批量签署-打开弹窗
    async batchSign(targetItem) {
      if (targetItem) {
        if (!this.canClickBtnMixin("safetyEduArchivesSingleBatchSign")) {
          return;
        }
        this.signTargetData = targetItem
      } else {
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
      this.signModalShow = true
    },
    // 批量签署-弹窗提交成功
    signOnOk() {
      this.$antMessage.success("签署成功！");
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
    },

    // 批量导出(查询项)
    exportExcel: debounce(function () {
      if (!this.canClickBtnMixin("safetyEduArchivesExportExcel")) {
        return;
      }
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
      if (!this.canClickBtnMixin("safetyEduArchivesBatchExport")) {
        return;
      }
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

    // 重新发起 (成绩不通过、相同级别、相同类型)
    onceAgainInitiate: debounce(function () {
      if (!this.canClickBtnMixin("safetyEduArchivesOnceAgainInitiate")) {
        return;
      }
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择重新发起人员！')
        return
      }
      // 判断是否都是成绩不通过 currentScoreStatus 1通过  2不通过
      let canAgain = this.choosedArr.every(item => item.currentScoreStatus == 2);
      // 相同级别
      canAgain = canAgain && rmDuplicatesByKey(this.choosedArr, 'currentLevel').length == 1
      // 相同类型
      canAgain = canAgain && rmDuplicatesByKey(this.choosedArr, 'type').length == 1
      if (!canAgain) {
        this.$antMessage.warning('请正确选择重新发起人员！')
        return;
      } else {
        sessionStorage.setItem('ehs_safetyEduArchives', JSON.stringify(this.choosedArr))
        this.$router.push({
          path: '/ehsGerneralManage/securityArchiveManagement/safetyEduInitiate',
          query: { type: 'again' }
        })
      }
    }, 250, { leading: true, trailing: false }),

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.choosedArr = selectedRows
      console.log('selectedRowKeys111', selectedRowKeys, 'selectedRows222', selectedRows);
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
      this.labelType = undefined
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
    }, 250, { leading: true, trailing: false }),
    // 预览
    viewFile(row) {
      if (!this.canClickBtnMixin("safetyEduArchivesViewFile")) {
        return;
      }
      let query = {
        filePath: row.file.filePath,
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/safetyEduArchivesPreview',
        query,
      })
    },
    // 删除
    rmSafetyEduItem(row) {
      if (!this.canClickBtnMixin("safetyEduArchivesRmSafetyEduItem")) {
        return;
      }
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            id: row.id
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
::v-deep .dashed-btn {
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
.pe-data-item {
  display: inline-block;
  width: 224px;
  height: 64px;
  cursor: pointer;
  position: relative;
  background: rgba(250, 250, 250, 0.5);
  border: 1px solid rgba(244, 244, 244, 1);
  border-radius: 4px;
  padding-left: 30px;
  margin-right: 20px;
  margin-bottom: 20px;
  &:last-child {
    margin-right: 0px;
  }
  // & +.pe-data-item{
  //   margin-right: 20px;
  // }
  &.active {
    background: #fff;
  }
  i {
    position: absolute;
    display: inline-block;
    background-color: #333;
    -webkit-mask-image: url(~@/assets/images/data-icon.svg);
    mask-image: url(~@/assets/images/data-icon.svg);
    width: 14px;
    top: 37px;
    right: 20px;
    height: 14px;
  }
}
.link-span {
  cursor: pointer;
  color: #02a7f0;
}
.total-pe-num {
  &.active {
    border: 1px solid rgba(0, 103, 204, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 103, 204, 0.1);
    .pe-data-body {
      color: #0067cc;
    }
    .en-illus {
      color: #0067cc;
    }
    i {
      background-color: rgba(0, 103, 204, 1);
    }
  }
}
.cyan-pe-num {
  &.active {
    border: 1px solid #56e9c8;
    box-shadow: 0px 0px 10px 0px rgba(255, 157, 1, 0.1);
    .pe-data-body,
    .en-illus {
      color: #56e9c8;
    }
    i {
      background-color: #56e9c8;
    }
  }
}
.purple-pe-num {
  &.active {
    border: 1px solid #cc66b0;
    box-shadow: 0px 0px 10px 0px rgba(87, 234, 201, 0.1);
    .pe-data-body,
    .en-illus {
      color: #cc66b0;
    }
    i {
      background-color: #cc66b0;
    }
  }
}
.yellow-pe-num {
  &.active {
    border: 1px solid #ffaf30;
    box-shadow: 0px 0px 10px 0px rgba(87, 234, 201, 0.1);
    .pe-data-body,
    .en-illus {
      color: #ffaf30;
    }
    i {
      background-color: #ffaf30;
    }
  }
}
.red-pe-num {
  &.active {
    border: 1px solid #ff8a8a;
    box-shadow: 0px 0px 10px 0px rgba(87, 234, 201, 0.1);
    .pe-data-body,
    .en-illus {
      color: #ff8a8a;
    }
    i {
      background-color: #ff8a8a;
    }
  }
}
.pe-data-container {
  margin-bottom: 0px;
  .pe-data-body {
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .en-illus {
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    font-weight: 400;
    margin-top: 10px;
  }
}
.pe-green {
  color: #02dfad;
}
.pe-red {
  color: #ff1212;
}
.pe-data-title {
  margin-bottom: 30px;
  padding-bottom: 20px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}
.pe-data-body {
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>
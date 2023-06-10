<template>
  <div class="searchtable-wrapper mod-config clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>危险作业台账</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="起草人部门">
          <DeptTree :placeholder="formInline.corporationId ? '请选择':'请先选择所属组织'" v-model="formInline.applyDepartCode" :deptData="deptData"></DeptTree>
        </a-form-model-item>
        <a-form-model-item label="作业区域部门">
          <DeptTree :placeholder="formInline.corporationId ? '请选择':'请先选择所属组织'" v-model="formInline.areaDepartCode" :deptData="deptData"></DeptTree>
        </a-form-model-item>
        <a-form-model-item label="作业类别">
          <a-select v-model="formInline.operateType" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOptionMixin" @change="operateTypeChange">
            <a-select-option v-for="item in getChemicalDictList('hazard_category')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="作业级别">
          <a-select v-model="formInline.operateLevel" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOptionMixin">
            <a-select-option v-for="item in hazardLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="作业区域">
          <a-input v-model="formInline.areaLocation" :maxLength="30" placeholder="请输入作业区域" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.infoStatus" placeholder="请选择" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in dictionary('dangerstatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="责任担当">
          <a-input v-model="formInline.applyUserCode" :maxLength="30" placeholder="请输入责任担当" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="数据筛选">
          <a-select v-model="formInline.screen" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOptionMixin">
            <a-select-option v-for="item in dictionary('hazardScreen')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="作业日期">
          <a-range-picker v-model="formInline.dateTime" valueFormat="YYYY-MM-DD" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始日期','结束日期']" />
        </a-form-model-item>
        <a-form-model-item label="作业编号">
          <a-input v-model="formInline.operateNumber" :maxLength="30" placeholder="请输入作业编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <!-- <a-button type="dashed" @click="goDraft">草稿箱</a-button> -->
        <a-button type="dashed" @click="jumpAddOrDetail('add')">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" @click="openSelTable">自定义列</a-button>
        <template v-if="allButtonCodeList.includes('dangerWorkStaticAddAndChange')">
          <UploadBtnStyle
            :action="action"
            :showAcceptText="false"
            :accept="['.xlsx', '.xls',]"
            :showUploadList="false"
            :btnText="'批量导入'"
            :btnType="'dashed'"
            :btnIcon="false"
            @handleSuccess="handleSuccess"
            class="upload-btn-style"
          ></UploadBtnStyle>
          <a-button type="dashed" @click="downloadTem">下载导入模板</a-button>
        </template>
        <template v-else>
          <a-button type="dashed" @click="noAuth">批量导入</a-button>
          <a-button type="dashed" @click="noAuth">下载导入模板</a-button>
        </template>
        <a-button type="dashed" :loading="loadingThree" @click="exportAll">批量导出</a-button>
      </div>
      <div class="ttips">
        <div class="circle-item">
          <span class="blue-circle"></span>
          <span>作业前直接关闭</span>
        </div>
        <div class="circle-item">
          <span class="yellow-circle"></span>
          <span>作业前过期自动关闭</span>
        </div>
        <div class="circle-item">
          <span class="red-circle"></span>
          <span>作业后非正常关闭</span>
        </div>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <template v-for="(item,index) in columnsIng">
          <vxe-column :key="item.id" :field="item.props" :min-width="item.minWidth?item.minWidth:120" :title="item.title">
            <template #default="{ row }">
              <span :class="circleFn(row)" v-if="index == 0"></span>
              <span>{{ row[item.props] }}</span>
            </template>
          </vxe-column>
        </template>
        <vxe-column field="action" fixed="right" title="操作" width="150">
          <template #default="{ row }">
            <div class="table-btn-box">
              <span class="color-0067cc cursor-pointer" @click="goShowAndHandlePage('show',row)">查看</span>
              <span class="color-0067cc cursor-pointer" v-if="isResolveVisible(row)" @click="goShowAndHandlePage('handle',row)">处理</span>
              <span class="color-ff4d4f cursor-pointer" @click="delDataList(row)">删除</span>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>

    <!-- 自定义列 -->
    <SelTable
      v-model="selectModel"
      :tableColumnAll="columnsAll"
      :tableColumnIng="columnsIng"
      :setColumLocalStorageName="setColumLocalStorageName"
      :columnsDefault="columnsDefault"
      @setTableColumn="setTableColumn"
    />
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import { getDangerWorkStaticListApi, rmDangerWorkStaticItemApi, exportDangerWorkStaticApi } from "@/services/dangerWorkStatic.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import serviceNameList from '@/config/default/service.config.js'
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import SelTable from "./components/selTable.vue";
import deptAndUser from './mixin/deptAndUser.js'
export default {
  components: { UploadBtnStyle, QRcodeModel, SelTable },
  mixins: [cancelLoading, chemicalDict, deptAndUser],
  data() {
    return {
      // 自定义列
      selectModel: false,
      selectShowList: [],
      dictionary,
      // 导入文件地址
      action: window.location.host.indexOf('localhost') < 0 ?`${process.env.VUE_APP_API_PROXY_TARGET}${serviceNameList.safe}/api/ehs/safe/danger/importFile`:`${serviceNameList.safe}/api/ehs/safe/danger/importFile`,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      columnsAll: [
        {
          id: 1,
          title: "作业编号",
          disabled: true,
          isDefault: true,
          props: 'operateNumber',
        },
        {
          id: 2,
          title: "组织",
          disabled: true,
          isDefault: true,
          props: 'corporationName',
        },
        {
          id: 3,
          title: "作业区域",
          disabled: true,
          isDefault: true,
          props: 'areaLocation',
        },
        {
          id: 4,
          title: "作业内容简述",
          isDefault: true,
          props: 'operateBrief',
        },
        {
          id: 5,
          title: "作业类别",
          disabled: true,
          isDefault: true,
          props: 'operateTypeText',
        },
        {
          id: 6,
          title: "作业级别",
          disabled: true,
          isDefault: true,
          props: 'operateLevelText',
        },
        {
          id: 7,
          title: "申请部门",
          isDefault: true,
          props: 'applyDepartName',
        },
        {
          id: 8,
          title: "责任担当",
          isDefault: true,
          props: 'applyUserName',
        },
        {
          id: 9,
          title: "状态",
          isDefault: true,
          props: 'infoStatusText',
        },
        {
          id: 10,
          title: "类型",
          isDefault: true,
          props: 'isCommonText',
        },
        {
          id: 11,
          title: "创建时间",
          isDefault: true,
          props: 'createTime',
          minWidth: 160,
        },
        {
          id: 12,
          title: "作业区域部门",
          props: 'areaDepartName',
        },
        {
          id: 13,
          title: "作业日期",
          props: 'beginDate',
        },
        {
          id: 14,
          title: "作业时间",
          props: 'dayTime',
        },
        // {
        //   id: 15,
        //   title: "作业形式",
        //   props: 'isMustText',
        // },
        {
          id: 16,
          title: "外协厂商名称",
          props: 'outCompany',
        },
      ],
      tableList: [],
      tableSpinning:false,
      // 表头本地的名称
      setColumLocalStorageName: 'ehs_dangerWorkStatic_tableColumn',
      columnsIng: [],
      tableList: [],
      outOrganizeTreeList: [],
      // 作业级别下拉
      hazardLevelList: [],
      userId: undefined,
    };
  },
  created() {
    this.setRouterCode('dangerWorkStaticAccount')
    this.initConfigPage()
    this.getTableList()
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  computed: {
    columnsDefault() {
      return this.columnsAll.filter(item => item.isDefault)
    },
  },
  methods: {
    initConfigPage(){
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
      // 从本地获取表头显示信息
      this.setColumnsDataFormLoc()
    },
    // 从本地获取表头显示信息
    setColumnsDataFormLoc() {
      let seltableColumnListArr = JSON.parse(localStorage.getItem(this.setColumLocalStorageName)) || []
      if (seltableColumnListArr.length) {
        const userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
        const selectedRowKeysObj = seltableColumnListArr.find(item => item.userId == userId)
        if (selectedRowKeysObj && selectedRowKeysObj.diffKeys) {
          // 根据筛选的显示对应表头
          this.setTableColumn(selectedRowKeysObj.diffKeys)
          return
        }
      }
      this.columnsIng = cloneDeep(this.columnsDefault)
    },
    // 根据筛选的显示对应表头
    setTableColumn(diffKeys) {
      this.columnsIng = cloneDeep(this.columnsAll.filter(item => !diffKeys.includes(item.id)))
    },

    circleFn(row) {
      let className = ''
      // 1正常关闭 2作业前直接关闭 3作业后自动关闭 4/作业前过期自动关闭
      if (row.closeType == '2') {
        className = 'blue-circle'
      } else if (row.closeType == '3') {
        className = 'red-circle'
      } else if (row.closeType == '4') {
        className = 'yellow-circle'
      }
      return className
    },
    // 打开自定义列弹窗
    openSelTable() {
      if (!this.canClickBtnMixin("dangerWorkStaticAccount-autoColumns")) {
        return;
      }
      this.selectModel = true
    },
    // 作业类别改变
    operateTypeChange(val) {
      if (val == 'fire_work') {
        this.hazardLevelList = dictionary('dangerhazardHLevel')
      } else if (val == 'high_work') {
        this.hazardLevelList = dictionary('dangerhazardGLevel')
      } else {
        this.hazardLevelList = []
      }
      console.log(this.hazardLevelList);
      this.$set(this.formInline, 'operateLevel', undefined)
    },
    //列表资料附件下载
    downUrl(item) {
      console.log(item, '...teim');
      if (item.filePath) {
        window.open(item.filePath)
      } else {
        this.$antMessage.error('filePath为空下载失败')
      }
    },
    // 获取列表
    getTableList() {
      const params = {
        // 草稿列表1是2否
        isDraft: 2,
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      getDangerWorkStaticListApi(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          tableList = tableList || [];
          // 处理数据
          tableList.forEach(item => {
            // 作业类别
            item.operateTypeText = this.getChemicalDictText('hazard_category', item.operateType)
            // 作业级别
            if (item.operateType == 'fire_work') {
              item.operateLevelText = dictionary('dangerhazardHLevel', item.operateLevel)
            } else if (item.operateType == 'high_work') {
              item.operateLevelText = dictionary('dangerhazardGLevel', item.operateLevel)
            } else {
              item.operateLevelText = ''
            }
            // 状态
            item.infoStatusText = this.dictionary('dangerstatus', item.infoStatus)
            // 作业形式
            item.isMustText = dictionary('hazardForm', item.isMust)
            // 类型
            item.isCommonText = item.isCommon ? (item.isCommon == '1' ? '常规' : '非常规') : ''
          })
          this.tableList = tableList
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    //跳转新增、编辑页面
    jumpAddOrDetail(type, row) {
      let query = row ? { operateId: row.operateId } : {};
      let path = type == 'add' ? "/safeManage/dangerWorkStatic/dangerWorkStaticAddAndChange" : "/safeManage/dangerWorkStatic/dangerWorkStaticAddAndChange"
      this.$router.push({
        path,
        query,
      });
    },
    // 跳转查看页面
    goShowAndHandlePage(type, row) {
      let query = { operateId: row.operateId };
      let path = type == 'show' ? '/safeManage/dangerWorkStatic/dangerWorkStaticShow' : '/safeManage/dangerWorkStatic/dangerWorkStaticHandle'
      this.$router.push({
        path,
        query,
      });
    },
    // 控制处理按钮是否显示
    isResolveVisible(row) {
      let showBtn = false
      if (row.infoStatus !== '' && row.infoStatus != 'Closed') {
        showBtn = row.handlerId && row.handlerId.indexOf(this.userId) != -1
      } else {
        showBtn = false
      }
      return showBtn
    },
    // 无权限
    noAuth() {
      this.$antMessage.warn('暂无权限，请联系管理员开通权限后再操作！')
    },
    // 删除
    delDataList(row) {
      if (!this.canClickBtnMixin("dangerWorkStaticAccount-rm")) {
        return;
      }
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmDangerWorkStaticItemApi({ operateId: row.operateId })
            .then((res) => {
              this.$antMessage.success('删除成功');
              this.getTableList();
            })
            .catch(err => { });
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
    // 查询
    iSearch() {
      if (this.formInline.applyUserCode && this.formInline.applyUserCode.length < 2) {
        this.$antMessage.warn('责任担当最少输入2位');
        return
      }
      this.handleLoading();
      this.getTableList();
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.getTableList()
    },
    // 下载模板
    downloadTem() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/danger.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/danger.xlsx`)
    },
    // 批量导出
    exportAll() {
      this.handleLoadingThree()
      let apiData = {
        // 草稿列表1是2否
        isDraft: 2,
        ...this.formInline
      }
      exportDangerWorkStaticApi(apiData)
        .then(res => {
          this.spreadSheetExcel(res, '危险作业台账导出')
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoadingThree()
        })
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {};
        this.$refs.commonSearchItem.reset();
        this.outOrganizeTreeList = []
        this.hazardLevelList = []
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style scoped lang='less'>
.table-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 20px !important;
  }
  ::v-deep .ant-modal-body {
    .clx-model-body {
      padding: 0 30px !important;
      .model-content {
        padding: 0;
      }
    }
  }
}
::v-deep .dashed-btn {
  align-items: center;
}
.ttips {
  height: 100%;
  display: flex;
  align-items: center;
  .circle-item {
    margin-right: 15px;
  }
}
.top_div_marginDiv {
  margin-bottom: 15px;
}
.down_p {
  &:hover {
    color: #0067cc;
    cursor: pointer;
  }
}
.picture-avatar {
  img {
    width: 40px;
    height: 40px;
    margin: 0 2px;
  }
}
.picture-list {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 240px;
}
.ant-popover {
  .ant-popover-inner-content {
    img {
      cursor: pointer;
      width: 40px;
      height: 40px;
      margin: 2px;
    }
  }
}

::v-deep .dashed-btn .upload-btn-style .ant-btn {
  background: #f1f4ff !important;
  color: #0067cc !important;
  border: 1px dashed #9fcaf5 !important;
  margin-right: 10px !important;
  &:hover {
    border: 1px dashed #0067cc !important;
  }
}
.table-btn-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.mod-config {
  /deep/ .el-table {
    th.el-table__cell {
      background: rgba(250, 250, 250, 0.5);
      padding: 16px 0;
    }
  }
}
</style>

<template>
  <!-- 邀请列表 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <a-form-model-item label="生成时间">
          <el-date-picker v-model="searchFormData.timeArr" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="primary" @click="handleToFill">数据填报</a-button>
      </div>
      <div>
        <a-button type="primary" @click="handleToImport" class="m-l-20">批量导入</a-button>
        <a-button type="primary" @click="handleTodownload" class="m-l-20">下载模板</a-button>
        <a-button type="primary" @click="handleToexport" class="m-l-20">批量导出</a-button>
      </div>
    </DashBtn>
    <!-- 列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :data-source="tableDataList" :pagination="false" rowKey="monthlyId" bordered>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="handleCheckInfo(record)">查看</span>
          <span class="color-0067cc cursor-pointer" v-if="(record.status=='01'||record.status=='04')&&record.createUserId==userId" @click="handleEditInfo(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" v-if="(record.status=='01'||record.status=='04')&&record.createUserId==userId" @click="handleSubmit(record)">提交审批</span>
          <span class="color-0067cc cursor-pointer" @click="handleDispose(record)" v-if="record.status=='02'&&record.handleUser==userId">处理</span>
        </div>
      </a-table>
    </CommonTable>

    <CommonModal title="导入" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem ref="commonSearchItem" labelAlign="left" :notTablePage="true" :CommonFormInline="addForm"></CommonSearchItem>
          <a-form-model-item class="flex" label="填报月份" prop="monthlyDate">
            <el-date-picker v-model="addForm.monthlyDate" value-format="yyyy-MM" type="month" placeholder="填报月份" :clearable="false"></el-date-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="选择文件" prop="file">
            <UploadBtnStyle
              :action="actions"
              :showAcceptText="true"
              :accept="['.xlsx']"
              :showUploadList="true"
              :btnText="'上传文件'"
              :btnType="'primary'"
              :limit="1"
              :btnIcon="false"
              :disabled="!(addForm.monthlyDate&&addForm.corporationId)"
              @handleSuccess="handleSuccess"
              :data="addForm"
            ></UploadBtnStyle>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>

    <CommonModal title="导出" :visible="exportVisible" :cancelFn="exportCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="exportForm"
          :rules="exportRules"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem ref="commonSearchItem" labelAlign="left" :notTablePage="true" :CommonFormInline="exportForm"></CommonSearchItem>
          <a-form-model-item class="flex" label="导出月份" prop="month">
            <el-date-picker v-model="exportForm.monthArr" type="monthrange" range-separator="-" start-placeholder="开始月份" end-placeholder="结束月份"></el-date-picker>
            <!-- <el-date-picker v-model="exportForm.month"
                                        value-format="yyyy-MM"
                                        type="month"
                                        placeholder="填报月份"
                                        :disabled='type>1'
                                        :clearable='false'>
            </el-date-picker>-->
          </a-form-model-item>
          <a-form-model-item class="flex" label=" ">
            <a-button type="primary" @click="handleExportData" :disabled="!(exportForm.corporationId)">导出</a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { debounce } from "lodash";
import { getEnvMonthList, envMonthExport, envMonthSubmit } from "@/services/envMonth.js";
import serviceNameList from "@/config/default/service.config.js";
import dayJs from "dayjs";
export default {
  components: { UploadBtnStyle },
  mixins: [cancelLoading],
  data() {
    return {
      tableSpinning:false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      searchFormData: {},
      columns: [
        {
          title: "填报月份",
          dataIndex: "monthlyDate",
          key: "monthlyDate",
          align: "center",
        },
        {
          title: "填报人",
          dataIndex: "userName",
          key: "userName",
          align: "center",
        },
        {
          title: "填报时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
        },
        {
          title: "审批状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          customRender: (text) => {
            switch (text) {
              case '01':
                return '待提交'
                break;
              case '02':
                return '审批中'
                break;
              case '03':
                return '审批通过'
                break;
              case '04':
                return '驳回'
                break;
              default:
                return '--'
            }

          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],
      checkItemList: null,
      addVisible: false,
      addForm: {},//serviceNameList['envMonth']
      actions: window.location.host.indexOf('localhost') < 0 ?`${process.env.VUE_APP_API_BASE_URL}${serviceNameList.safe}/api/ehs/safe/danger/importFile`:`${serviceNameList.safe}/api/ehs/safe/danger/importFile`,
      addFormRules: {
        monthlyDate: [
          { required: true, message: "月份不能为空", trigger: "change" },
        ],
        centerId: [
          { required: true, message: "中心不能为空", trigger: "change" },
        ],
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" },
        ],
        file: [{ required: true, message: "文件不能为空", trigger: "change" }],
      },
      exportVisible: false,
      exportForm: {},
      exportRules: {
        centerId: [
          { required: true, message: "中心不能为空", trigger: "change" },
        ],
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" },
        ]
      },
      userId: null
    };
  },
  created() {
    this.setRouterCode("terrain");
    this.initConfigPage()
    this.initData();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      let user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user || {}
      this.userId = user.userId
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.initData();
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.searchFormData = {};
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.handleLoading();
      this.initData();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.initData();
    },
    initData() {
      this.cancelLoading();
      if (this.searchFormData.timeArr) {
        this.searchFormData.monthlyDateStart = this
          .searchFormData.timeArr[0]
          ? dayJs(this.searchFormData.timeArr[0]).format(
            "YYYY-MM"
          )
          : "";
        this.searchFormData.monthlyDateEnd = this.searchFormData
          .timeArr[1]
          ? dayJs(this.searchFormData.timeArr[1]).format(
            "YYYY-MM"
          )
          : "";
      }
      this.tableSpinning = true
      getEnvMonthList({
        ...this.page,
        ...this.searchFormData,
      })
      .then((res) => {
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    //批量导入
    handleToImport(e) {
      this.addVisible = true;
    },
    //下载模板
    handleTodownload(e) {
      window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/enviromentImport.xlsx`);
    },
    //批量导出
    handleToexport() {
      console.log('批量导出')
      this.exportVisible = true
    },
    //填报信息
    handleToFill() {
      this.$router.push({
        path: "/environmentManage/envMonthReport/envDetails",
        query: {
          type: 1
        },
      });
    },
    //查看信息
    handleCheckInfo(e) {
      this.$router.push({
        path: "/environmentManage/envMonthReport/envDetails",
        query: {
          type: 2,
          monthlyId: e.monthlyId
        },
      });
    },
    //修改信息
    handleEditInfo(e) {
      this.$router.push({
        path: "/environmentManage/envMonthReport/envDetails",
        query: {
          type: 3,
          monthlyId: e.monthlyId,
        },
      });
    },
    //提交信息
    handleSubmit: debounce(
      function (e) {
        envMonthSubmit({ monthlyId: e.monthlyId }).then(res => {
          this.$antMessage.success("提交成功！");
          this.iRest();
        })
      },
      2000,
      { leading: true, trailing: false }
    ),
    //处理信息
    handleDispose(e) {
      this.$router.push({
        path: "/environmentManage/envMonthReport/envDetails",
        query: {
          type: 2,
          monthlyId: e.monthlyId,
          manage: true
        },
      });
    },
    //关闭导入弹窗
    addCancle() {
      this.addVisible = false;
      this.addForm = {};
    },
    // 批量导入成功
    handleSuccess() {
      this.$antMessage.success("上传成功");
      this.addCancle();
      this.iRest();
    },
    exportCancle() {
      this.exportVisible = false
      this.exportForm = {}
    },
    handleExportData() {
      if (this.exportForm.monthArr && this.exportForm.monthArr.length) {
        this.exportForm.monthlyDateStart = dayJs(this.exportForm.monthArr[0]).format('YYYY-MM')
        this.exportForm.monthlyDateEnd = dayJs(this.exportForm.monthArr[1]).format('YYYY-MM')
      }
      envMonthExport(this.exportForm).then(res => {
        this.spreadSheetExcel(res, "环境月报导出");
        this.$antMessage.success("导出成功");
        this.exportCancle();
      })
    }
  },
};
</script>

<style lang="less" scoped>
.shenglvhao {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

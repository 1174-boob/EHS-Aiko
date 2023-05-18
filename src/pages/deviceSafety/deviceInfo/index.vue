<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :hasDepartment="true" :CommonFormInline="searchFormData"></CommonSearchItem>
        <a-form-model-item label="设备状态">
          <a-select v-model="searchFormData.equipmentStatus" placeholder="请选择" allowClear>
            <a-select-option v-for="item in deviceList" :key="item.value" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="设备ID">
          <a-input v-model="searchFormData.equipmentCode" :maxLength="30" placeholder="请输入设备ID" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="安全认证时间">
          <el-date-picker v-model="searchFormData.timeArr" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="pe-data-container">
      <h4 class="pe-data-title">{{ deviceDateR }}设备数据</h4>
      <div>
        <div @click="changeTab(1)" class="pe-data-item total-pe-num" :class="[curIndex === 1 ? 'active' : '']">
          <span class="pe-data-body">
            设备总数
            {{ deviceTypeData.equipmentNum || 0 }}
            台
          </span>
          <p class="en-illus">total equipment</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item expire-num" :class="[curIndex === 2 ? 'active' : '']">
          <span class="pe-data-body">
            认证到期
            {{ deviceTypeData.expireNum || 0 }} 台
          </span>
          <p class="en-illus">certification expires</p>
          <i></i>
        </div>
        <div @click="changeTab(3)" class="pe-data-item passed-pe-num" :class="[curIndex === 3 ? 'active' : '']">
          <span class="pe-data-body">
            认证完成
            {{ deviceTypeData.completeNum || 0 }}
            台
          </span>
          <p class="en-illus">certification complete</p>
          <i></i>
        </div>
        <div @click="changeTab(4)" class="pe-data-item exception-pe-num" :class="[curIndex === 4 ? 'active' : '']">
          <span class="pe-data-body">
            认证合格
            {{ deviceTypeData.qualifiedNum || 0 }}
            台
          </span>
          <p class="en-illus">certification Qualified</p>
          <i></i>
        </div>
        <div @click="changeTab(5)" class="pe-data-item forbid-pe-num" :class="[curIndex === 5 ? 'active' : '']">
          <span class="pe-data-body">
            认证超期
            {{ deviceTypeData.overdueNum || 0 }}
            台
          </span>
          <p class="en-illus">certification overdue</p>
          <i></i>
        </div>
      </div>
    </div>
    <DashBtn>
      <div>
        <!-- <a-button type="dashed" @click="goDraft">草稿箱</a-button> -->
        <a-button type="dashed" @click="addDevice">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" @click="handleDownloadTemplate">下载模板</a-button>
        <UploadBtnStyle :action="action" :showAcceptText="false" :accept="['.xlsx', '.xls']" :showUploadList="false" :btnText="'批量导入'" :btnType="'dashed'" :btnIcon="false" class="upload-btn-style"></UploadBtnStyle>
        <!-- <a-button type="dashed">批量导入</a-button> -->
        <a-button type="dashed" @click="handelDownload">导出Excel</a-button>
      </div>
      <div class="ttips">
        <div class="circle-item">
          <span class="red-circle"></span>
          <span>认证超期</span>
        </div>
        <div class="circle-item">
          <span class="yellow-circle"></span>
          <span>认证临期（不足3个月）</span>
        </div>
        <!-- <div class="circle-item">
                    <span class="blue-circle"></span>
                    <span>作业前直接关闭</span>
        </div>-->
      </div>
    </DashBtn>
    <!-- 表格 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{ isHover: true }" :data="tableList">
        <template v-for="(item, index) in columnsAll">
          <vxe-column
            :key="item.id"
            :field="item.props"
            :min-width="
                                          item.minWidth ? item.minWidth : 120
                                    "
            :title="item.title"
          >
            <template #default="{ row }">
              <template v-if="index != 6">
                <span :class="circleFn(row)" v-if="index == 0"></span>
                <span>
                  {{
                  row[item.props]
                  }}
                </span>
              </template>
              <template v-else>
                <span>
                  {{
                  row[item.props]
                  | deviceStatus
                  }}
                </span>
              </template>
            </template>
          </vxe-column>
        </template>
        <vxe-column field="action" fixed="right" title="操作" width="250">
          <template #default="{ row }">
            <div class="table-btn-box">
              <!-- {{row}} 认证履历   变更记录   编辑   删除-->
              <span class="color-0067cc cursor-pointer" @click="handleToRecord(row)">认证履历</span>
              <span class="color-0067cc cursor-pointer" @click="handleToLog(row)">变更记录</span>
              <span class="color-0067cc cursor-pointer" @click="editDevice(row)">编辑</span>
              <span class="color-ff4d4f cursor-pointer" @click="handleDeleteDevice(row)">删除</span>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding: 16px 0">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
    <!-- 弹框 -->
    <CommonModal :title="modalTitle" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '125px' } }"
          :wrapper-col="{
                                    style: { width: 'calc(100% - 125px)' },
                              }"
          :colon="false"
          labelAlign="right"
        >
          <CommonSearchItem ref="commonSearchItemAdd" :CommonFormInline="addForm" :notTablePage="true" :hasDepartment="true" :deptLabel="'部门'"></CommonSearchItem>
          <!-- @corporationDeptChange="corporationDeptChange" -->
          <a-form-model-item class="flex" label="设备ID" prop="equipmentCode">
            <a-input v-model="addForm.equipmentCode" placeholder="请输入设备ID" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="设备名称" prop="equipmentName">
            <a-input v-model="addForm.equipmentName" placeholder="请输入设备名称" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="设备类型" prop="equipmentType">
            <a-input v-model="addForm.equipmentType" placeholder="请输入设备类型" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="区域" prop="equipmentRegion">
            <a-input v-model="addForm.equipmentRegion" placeholder="请输入区域" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="设备状态" prop="equipmentStatus">
            <a-select v-model="addForm.equipmentStatus" placeholder="请选择" allowClear>
              <a-select-option v-for="item in deviceList" :key="item.value" :value="item.key">
                {{
                item.value
                }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'responsibility'"
            :treeRoles="addFormRules"
            :labelTitle="'责任担当'"
            :label-col="{ span: 6 }"
            :checkedTreeNode="checkedTreeNode"
            @getTreeData="getDutyUserList"
            :wrapper-col="{ span: 18 }"
            :checkAbel="false"
            :deptTreeId="addForm.deptId"
          />
          <a-form-model-item class="flex" label="设备量产时间" prop="equipmentProductionDate">
            <el-date-picker
              v-model="
                                                addForm.equipmentProductionDate
                                          "
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="初次认证时间" prop="initialCertificationDate">
            <el-date-picker
              v-model="
                                                addForm.initialCertificationDate
                                          "
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="安全认证时间" prop="securityCertificationDate">
            <el-date-picker
              v-model="
                                                addForm.securityCertificationDate
                                          "
              type="date"
              @change="handleNextTimeCounntD"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="安全认证周期" prop="securityCertificationCycle">
            <!-- <a-input v-model="addForm.securityCertificationCycle"
                                 placeholder="请输入认证周期"
            addon-after="年" />-->
            <a-input-number
              v-model="
                                                addForm.securityCertificationCycle
                                          "
              @change="handleNextTimeCounnt"
              :formatter="(v) => `${v}年`"
              :precision="0"
              :min="1"
              placeholder="请输入认证周期"
              addon-after="年"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="下次安全认证时间" prop="nextCertificationDate">
            <el-date-picker
              v-model="
                                                addForm.nextCertificationDate
                                          "
              type="date"
              :disabled="true"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button class="m-r-15" @click="addCancle">取消</a-button>
        <a-button type="primary" :loading="addLoading" @click="addConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import {
  getDeviceInfoList,
  getDeviceInfoData,
  deviceSave,
  getDeviceDetails,
  deviceDelete,
  deviceUpdate,
  deviceExport,
  deviceImport,
} from "@/services/deviceSafety.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import StaffOrDept from "@/components/staffOrDept";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import serviceNameList from "@/config/default/service.config";
import { findCorporationId } from "@/utils/common.js";
import dayJs from "dayjs";
export default {
  data() {
    return {
      tableSpinning:false,
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.ehsEquip}/api/ehs/equip/equipment/account/importEquipment`,
      searchFormData: {},
      deviceList: [
        {
          key: "0",
          value: "在用",
        },
        {
          key: "1",
          value: "停用",
        },
        {
          key: "2",
          value: "拆除",
        },
      ],
      showView: "1",
      downloadYear: null,
      countInfo: {},
      curIndex: null,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columnsAll: [
        {
          id: 1,
          title: "设备ID",
          disabled: true,
          isDefault: true,
          props: "equipmentCode",
        },
        {
          id: 2,
          title: "设备名称",
          disabled: true,
          isDefault: true,
          props: "equipmentName",
        },
        {
          id: 3,
          title: "设备类型",
          disabled: true,
          isDefault: true,
          props: "equipmentType",
        },
        {
          id: 4,
          title: "所属组织",
          disabled: true,
          isDefault: true,
          props: "corporationName",
        },
        {
          id: 5,
          title: "部门",
          isDefault: true,
          props: "deptName",
        },
        {
          id: 6,
          title: "区域",
          disabled: true,
          isDefault: true,
          props: "equipmentRegion",
        },
        {
          id: 7,
          title: "设备状态",
          disabled: true,
          isDefault: true,
          props: "equipmentStatus",
        },
        {
          id: 8,
          title: "责任担当",
          isDefault: true,
          props: "responsibilityName",
        },
        {
          id: 9,
          title: "设备量产时间",
          isDefault: true,
          props: "equipmentProductionDate",
        },
        {
          id: 10,
          title: "初次认证时间",
          isDefault: true,
          props: "initialCertificationDate",
        },
        {
          id: 11,
          title: "本次认证时间",
          isDefault: true,
          props: "securityCertificationDate",
        },
        {
          id: 12,
          title: "安全认证周期",
          isDefault: true,
          props: "securityCertificationCycle",
          minWidth: 160,
        },
        {
          id: 13,
          title: "下次认证时间",
          props: "nextCertificationDate",
        },
      ],
      tableList: null,
      //弹框
      addVisible: false,
      addLoading: false,
      addForm: {},
      addFormRules: {
        corporationId: [
          {
            required: true,
            message: "所属组织不能为空",
            trigger: "change",
          },
        ],
        deptId: [
          {
            required: true,
            message: "部门不能为空",
            trigger: "change",
          },
        ],
        equipmentCode: [
          {
            required: true,
            message: "设备Id不能为空",
            trigger: "change",
          },
        ],
        equipmentName: [
          {
            required: true,
            message: "设备名称不能为空",
            trigger: "change",
          },
        ],
        equipmentType: [
          {
            required: true,
            message: "设备类型为空",
            trigger: "change",
          },
        ],
        equipmentStatus: [
          {
            required: true,
            message: "设备状态不能为空",
            trigger: "change",
          },
        ],
        equipmentRegion: [
          {
            required: true,
            message: "区域不能为空",
            trigger: "change",
          },
        ],
        responsibility: [
          {
            required: true,
            message: "责任担当不能为空",
            trigger: "change",
          },
        ],
        equipmentProductionDate: [
          {
            required: true,
            message: "设备量产时间不能为空",
            trigger: "change",
          },
        ],
        initialCertificationDate: [
          {
            required: true,
            message: "设备初次认证时间不能为空",
            trigger: "change",
          },
        ],
        securityCertificationDate: [
          {
            required: true,
            message: "设备安全认证时间不能为空",
            trigger: "change",
          },
        ],
        securityCertificationCycle: [
          {
            required: true,
            message: "设备安全认证周期不能为空",
            trigger: "change",
          },
          // { max: 100, min: 1, message: "设备安全认证周期不能1-100年", trigger: "change" }
        ],
        nextCertificationDate: [
          {
            required: true,
            message: "设备下次认证时间不能为空",
            trigger: "change",
          },
        ],
      },
      modalTitle: false,
      loading: false,
      deviceDateR: "",
      deviceDataTime: "",
      operationEquipmentId: null,
      deviceTypeData: {},
      checkedTreeNode: [],
    };
  },
  components: { StaffOrDept, UploadBtnStyle },
  computed: {},
  created() {
    this.setRouterCode("deviceInfo");
    this.initConfigPage();
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
  filters: {
    deviceStatus(val) {
      if (val == "0") {
        return "在用";
      } else if (val == "1") {
        return "停用";
      } else {
        return "拆除";
      }
    },
  },
  methods: {
    initConfigPage(){
      this.initTime();
    },
    initTime() {
      this.deviceDateR = dayJs(new Date()).format("YYYY年MM月");
      this.deviceDataTime = {
        securityCertificationEndDate: dayJs(new Date()).format("YYYY-MM-DD"),
        securityCertificationStartDate: dayJs(new Date()).format("YYYY-MM") + "-01",
      };
    },
    initData() {
      if (this.searchFormData.timeArr) {
        this.searchFormData.securityCertificationStartDate =
          this.searchFormData.timeArr[0]
            ? dayJs(
              this.searchFormData.timeArr[0]
            ).format("YYYY-MM-DD")
            : "";
        this.searchFormData.securityCertificationEndDate = this
          .searchFormData.timeArr[1]
          ? dayJs(this.searchFormData.timeArr[1]).format(
            "YYYY-MM-DD"
          )
          : "";
        this.deviceDataTime = {
          securityCertificationStartDate:
            this.searchFormData
              .securityCertificationStartDate,
          securityCertificationEndDate:
            this.searchFormData
              .securityCertificationEndDate,
        };
        this.deviceDateR =
          dayJs(
            this.searchFormData
              .securityCertificationStartDate
          ).format("YYYY年MM月") +
          "-" +
          dayJs(
            this.searchFormData
              .securityCertificationEndDate
          ).format("YYYY年MM月");
      }
      this.tableSpinning = true
      getDeviceInfoList({
        ...this.searchFormData,
        ...this.page,
      })
        .then((res) => {
          this.tableList = res.data.list.map((item) => {
            item.corporationName = item.corporationId
              ? findCorporationId(item.corporationId)
              : "--";
            item.securityCertificationCycle =
              item.securityCertificationCycle ||
                item.securityCertificationCycle == 0
                ? item.securityCertificationCycle +
                "年"
                : "--";
            // item.equipmentStatusName = item.equipmentStatus == 0 ? '在用' : item.equipmentStatus == 1 ? '停用' : '拆除'securityCertificationCycle
            return item;
          });
          this.page.total = res.data.total;
        })
        .catch(err => { })
        .finally(()=>{
          this.tableSpinning = false
        })
      // 获取数据信息
      let apiData = {
        ...this.searchFormData,
        ...this.deviceDataTime
      }
      getDeviceInfoData(apiData)
        .then((res) => {
          this.deviceTypeData = res.data;
        })
        .catch(err => { })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
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
        this.$refs.commonSearchItem.reset();
        this.initTime();
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    // tab切换
    changeTab(tabIndex) {
      if (this.curIndex === tabIndex) {
        this.curIndex = -1;
        this.searchFormData.authStatus = null;
        this.initData();
      } else {
        this.curIndex = tabIndex;
        this.searchFormData.authStatus = tabIndex;
        this.initData();
      }
    },
    handelDownload() {
      console.log("下载");
      deviceExport(this.searchFormData).then((res) => {
        const name = "设备导出";
        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadElement = document.createElement("a");
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + ".xlsx";
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
        this.$antMessage.success("导出成功");
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.initData();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.initData();
    },
    //表述超期到期
    circleFn(row) {
      let className = "";
      // 1正常关闭 2作业前直接关闭 3作业后自动关闭 4/作业前过期自动关闭
      /**
       * 认证状态 1超期，2临期，3正常
       * private Integer authDateStatus;   这是返回的
       */

      if (row.authDateStatus == "3") {
        // className = 'blue-circle'
        className = "null";
      } else if (row.authDateStatus == "1") {
        className = "red-circle";
      } else if (row.authDateStatus == "2") {
        className = "yellow-circle";
      }
      return className;
    },
    //新增弹框
    addDevice() {
      this.modalTitle = "新增";
      this.addVisible = true;
    },
    //取消弹框
    addCancle() {
      this.addVisible = false;
      this.addForm = {};
      this.checkedTreeNode = [];
    },
    //修改设备
    editDevice(e) {
      this.modalTitle = "编辑";
      this.addVisible = true;
      this.operationEquipmentId = e.equipmentId;
      getDeviceDetails({ equipmentId: e.equipmentId }).then(
        (res) => {
          this.addForm = res.data;
          this.$refs.commonSearchItemAdd.corporationChange(
            res.data.corporationId,
            res.data.deptId
          );
          this.checkedTreeNode = res.data.responsibility
            ? [res.data.responsibility]
            : [];
        }
      );
    },
    //删除设备
    handleDeleteDevice(e) {
      let _this = this;
      this.$antConfirm({
        title: "确定删除设备吗?",
        onOk() {
          deviceDelete({ equipmentId: e.equipmentId }).then(
            (res) => {
              _this.$antMessage.success(
                "删除成功！"
              );
              _this.initData();
            }
          );
        },
        onCancel() { },
      });
    },
    //新增修改
    addConfirm: debounce(
      function () {
        if (!formValidator.formAll(this, "addForm")) {
          console.log("验证不通过");
          return;
        }
        if (this.modalTitle == "新增") {
          deviceSave(this.addForm).then((res) => {
            this.$antMessage.success("新增成功！");
            this.addCancle();
            this.initData();
          });
        } else {
          deviceUpdate({
            ...this.addForm,
            equipmentId: this.operationEquipmentId,
          }).then((res) => {
            this.$antMessage.success("修改成功！");
            this.addCancle();
            this.initData();
          });
        }
      },
      2000,
      { leading: true, trailing: false }
    ),
    //弹框责任人数据获取
    getDutyUserList(data) {
      this.addForm.responsibility =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList[0].id
          : "";
      this.addForm.responsibilityName =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList[0].treeName
          : "";
    },
    //去认证履历
    handleToRecord(e) {
      this.$router.push({
        path: "/safeManage/deviceSafeManage/deviceSafety/authRecord",
        query: {
          Id: e.equipmentId,
        },
      });
    },
    //去设备变更
    handleToLog(e) {
      this.$router.push({
        path: "/safeManage/deviceSafeManage/deviceSafety/changeRecord",
        query: {
          Id: e.equipmentId,
        },
      });
    },
    //下载模板
    handleDownloadTemplate() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/importEquipment.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/importEquipment.xlsx`
      );
    },
    //计算下次认证时间
    handleNextTimeCounnt(e) {
      console.log(e);
      if (
        this.addForm.securityCertificationDate &&
        this.addForm.securityCertificationCycle
      ) {
        let Y = this.addForm.securityCertificationDate.slice(
          0,
          4
        );
        let t = this.addForm.securityCertificationDate.slice(4);
        let sumY =
          Number(Y) +
          Number(this.addForm.securityCertificationCycle);
        this.addForm.nextCertificationDate = sumY + t;
      }
    },
    //计算下次认证时间
    handleNextTimeCounntD(e) {
      console.log(e);
      if (this.addForm.securityCertificationCycle) {
        let Y = e.slice(0, 4);
        let t = e.slice(4);
        let sumY =
          Number(Y) +
          Number(this.addForm.securityCertificationCycle);
        this.addForm.nextCertificationDate = sumY + t;
        this.$forceUpdate();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.download {
  padding: 20px 0;
}

.top-tittle {
  padding: 20px 0 30px 0;
  font-size: 20px;
  color: #000;
  font-weight: 400;
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
  margin-bottom: 20px;
  margin-right: 20px;
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
    top: 34px;
    right: 30px;
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
.passed-pe-num {
  &.active {
    border: 1px solid rgba(2, 223, 173, 1);
    box-shadow: 0px 0px 10px 0px rgba(2, 223, 173, 0.1);
    .pe-data-body,
    .en-illus {
      color: #02dfad;
    }
    i {
      background-color: rgba(2, 223, 173, 1);
    }
  }
}
.exception-pe-num {
  &.active {
    border: 1px solid rgba(255, 157, 1, 1);
    box-shadow: 0px 0px 10px 0px rgba(255, 157, 1, 0.1);
    .pe-data-body,
    .en-illus {
      color: #ff9d01;
    }
    i {
      background-color: rgba(255, 157, 1, 1);
    }
  }
}
.expire-num {
  &.active {
    border: 1px solid rgb(164, 17, 223);
    box-shadow: 0px 0px 10px 0px rgba(255, 18, 18, 0.1);
    .pe-data-body,
    .en-illus {
      color: rgb(164, 17, 223);
    }
    i {
      background-color: rgb(164, 17, 223);
    }
  }
}
.forbid-pe-num {
  &.active {
    border: 1px solid rgba(255, 18, 18, 1);
    box-shadow: 0px 0px 10px 0px rgba(255, 18, 18, 0.1);
    .pe-data-body,
    .en-illus {
      color: #ff1212;
    }
    i {
      background-color: rgba(255, 18, 18, 1);
    }
  }
}
.pe-data-container {
  margin-bottom: 30px;
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

.dashed-btn {
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

.table-btn-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
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
</style>

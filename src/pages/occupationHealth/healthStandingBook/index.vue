<template>
  <div class="chemicals-list clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>人员台账</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" ref="healthForm" :model="formInline" :colon="false" :rules="healthRules">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="姓名" prop="name">
          <a-input
            v-model.trim="formInline.name"
            placeholder="请输入申请人"
            allowClear
          />
        </a-form-model-item>
        <a-form-model-item label="工号" prop="workNum">
          <a-input
            v-model.trim="formInline.workNum"
            placeholder="请输入工号"
            allowClear
          />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="phone">
          <a-input
            v-model.trim="formInline.phone"
            placeholder="请输入手机号"
            allowClear
          />
        </a-form-model-item>
        <a-form-model-item label="岗位">
          <a-select
            v-model="formInline.post"
            placeholder="请选择岗位"
            show-search
            :filter-option="filterOption"
            allowClear
          >
            <a-select-option
              v-for="item in stationList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="健康状态">
          <a-select
            v-model="formInline.healthStatus"
            placeholder="请选择健康状态"
            show-search
            :filter-option="filterOption"
            allowClear
          >
            <a-select-option
              v-for="item in healthStatus"
              :value="item.key"
              :key="item.key"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="员工类型">
          <a-select
            v-model="formInline.userType"
            placeholder="请选择员工类型"
            show-search
            :filter-option="filterOption"
            allowClear
          >
            <a-select-option
              v-for="item in employeeType"
              :value="item.key"
              :key="item.key"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="危害因素">
          <a-select
            v-model="formInline.hazardFactors"
            placeholder="请选择危害因素"
            show-search
            :filter-option="filterOption"
            allowClear
          >
            <a-select-option
              v-for="item in harmFactorList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch"
            >查询</a-button
          >
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="healthAdd">
          <a-icon type="plus" />新建
        </a-button>
      </div>
      <div>
        <UploadBtnStyle
          :action="action"
          :showAcceptText="false"
          :accept="['.xlsx', '.xls']"
          :showUploadList="false"
          :btnText="'批量导入'"
          :btnType="'primary'"
          :btnIcon="false"
          @handleSuccess="handleSuccess"
        ></UploadBtnStyle>
        <a-button type="primary" class="btn" @click="uploadTemplate"
          >下载模板</a-button
        >
        <a-button type="primary" class="btn" @click="downloadTemplate"
          >批量导出</a-button
        >
      </div>
    </DashBtn>
    <CommonTable
      :spinning="tableSpinning"
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="showSizeChange"
    >
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="dataSource"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <template slot="healthStatus" slot-scope="record">
          <span v-if="record.healthStatus=='normal' || record.healthStatus=='radiationWork'" style="color: #02DFAD">{{healthStatusDict[record.healthStatus]}}</span>
          <span v-else-if="!record.healthStatus">--</span>
          <span v-else style="color: #FF1212">{{healthStatusDict[record.healthStatus]}}</span>
        </template>
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer"
            @click="healthPreview(record)"
            >查看</span
          >
          <span class="color-0067cc cursor-pointer" @click="healthEdit(record)"
            >编辑</span
          >
          <span
            class="color-ff4d4f cursor-pointer"
            @click="healthDelete(record)"
            >删除</span
          >
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态chemicalForm
import { debounce } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import serviceNameList from "@/config/default/service.config.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import dictionary from "@/utils/dictionary";
import { GetListHeal, DelListHeal, DownHealMore,harmFactorAll,stationAll } from "@/services/api.js";
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    UploadBtnStyle,
  },
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.health}/api/ehs/health/user/importUser`,
      chemicalForm: {},
      completeDict: {},
      // employeeDict: {},
      // hazardousPostDict: {},
      // hazardFactorsDict: {},
      healthStatusDict: {},
      // treeData: [],
      harmFactorList: [],
      stationList:[],
      replaceFields: {
        children: "childDeptList",
        title: "deptName",
        key: "deptId",
        value: "deptId",
      },
      stationObj:{},
      healthStatus: [],
      employeeType: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
          width: 180,
          customRender: (text) => {
            text = text ? text : "--";
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
          title: "工号",
          dataIndex: "workNum",
          key: "workNum",
          width: 180,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone",
          width: 180,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        // {
        //   title: "所属部门",
        //   dataIndex: "departmentName",
        //   key: "departmentName",
        //   width: 200,
        //   customRender: (text, record, index) => {
        //     return text ? text : "--";
        //   },
        // },
        {
          title: "岗位",
          dataIndex: "post",
          key: "post",
          width: 200,
          customRender: (text, record, index) => {
            return text ? this.stationObj[text] : "--";
          },
        },
        {
          title: "危害因素",
          dataIndex: "hazardFactors",
          key: "hazardFactors",
          width: 300,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "健康状态",
          key: "healthStatus",
          width: 200,
          scopedSlots: { customRender: "healthStatus" },
        },
        {
          title: "员工类型",
          dataIndex: "userType",
          key: "userType",
          width: 150,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          width: 160,
        },
      ],
    };
  },
  computed: {
    healthRules() {
      let healthRules = {
        name: [
          { required: false, validator: this.nameValidator, trigger: ['blur', 'change'] },
        ],
        workNum: [
          { required: false, validator: this.lengthValidator, trigger: ['blur', 'change'] },
        ],
        phone: [
          { required: false, validator: this.lengthValidator, trigger: ['blur', 'change'] },
        ],
      }
      return healthRules
    }
  },
  created() {
    this.setRouterCode("healthStandingBook");
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "所属部门"
    }))
    this.initConfigPage()
    this.getChemicalList();
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
      //员工类型
      this.employeeType = dictionary("userType");//字典
      //健康状态
      this.healthStatus = dictionary("checkResult");//字典
      this.healthStatus.forEach(item=>{
        this.$set(this.healthStatusDict,item.key,item.value);
      });
      this.getHarmFactorAll();
      this.getStationAll();
    },
    // 查询危害因素
    async getHarmFactorAll() {
      const data = await harmFactorAll();
      this.harmFactorList = data.data; // 弹框全部的
    },
    async getStationAll() {
      const data = await stationAll();
      this.stationList = data.data;
      console.log("-----fff",this.stationList);
      if(this.stationList && this.stationList.length>=1) {
        for(let item of this.stationList) {
          this.$set(this.stationObj,item.value,item.label)
        }
      }
      console.log("iiistationObj",this.stationObj);
    },
    // 获取分页查询数据
    getChemicalList() {
      const params = {
        ...this.chemicalForm,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      GetListHeal(params)
        .then((res) => {
          this.dataSource = res.data.list;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.iRest();
    },
    // 查询
    iSearch() {
      if (!formValidator.formAll(this, 'healthForm')) {
        return;
      }
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.chemicalForm = JSON.parse(JSON.stringify(this.formInline));
      this.getChemicalList();
    },
    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {};
        this.chemicalForm = {};
        this.getChemicalList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 新建
    healthAdd() {
      this.$router.push("/occupationHealth/addEditStandingBook");
    },
    // 查看
    healthPreview(record) {
      sessionStorage.setItem('standingBook',1)
      this.$router.push({
        path: "/occupationHealth/standingBookDetail",
        query: { id: record.id },
      });
    },
    // 编辑
    healthEdit(record) {
      this.$router.push({
        path: "/occupationHealth/addEditStandingBook",
        query: { id: record.id },
      });
    },
    //删除
    healthDelete(record) {
      const _this = this;
      if (!this.canClickBtnMixin("standingHealthDelete")) {
        return;
      }
      this.$antConfirm({
        title: `确定删除？`,
        onOk() {
          if (record.id) {
            DelListHeal({ id: record.id })
              .then((res) => {
                _this.getChemicalList();
                _this.$antMessage.success("删除成功");
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
      });
    },
    // 下载模板
    uploadTemplate() {
      window.open(
        `${process.env.VUE_APP_API_BASE_URL}/file/resource/人员信息模板.xlsx`
      );
    },
    // 批量导出模板下载
    async downloadTemplate() {
      const name = "人员台账批量导出";
      const params = {
        ...this.formInline,
        ...this.page,
        total: undefined,
      };
      let res = await DownHealMore(params);
      if (res) {
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
      }
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getChemicalList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getChemicalList();
    },
    nameValidator(rule, value, callback) {
      if (value && value.length<2) {
        return Promise.reject("为空或2个字以上")
      } else {
        callback()
      }
    },
    lengthValidator(rule, value, callback) {
      if (value && value.length<5) {
        return Promise.reject("为空或5个字以上")
      } else {
        callback()
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chemicals-list {
  .btn {
    margin-left: 20px;
  }
}
</style>
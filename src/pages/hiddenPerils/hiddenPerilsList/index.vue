<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :needDeptName="true" :hasDepartment="true"></CommonSearchItem>
        <a-form-model-item label="隐患编号">
          <a-input v-model="formInline.dangerCode" allowClear placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="隐患简述">
          <a-input v-model="formInline.dangerSketch" allowClear placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.processStatus" placeholder="请选择" allowClear>
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="检查类型">
          <a-select v-model="formInline.checkType" placeholder="请选择" allowClear>
            <a-select-option v-for="item in checkList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="隐患类别">
          <a-select v-model="formInline.dangerCategory" placeholder="请选择" allowClear>
            <a-select-option v-for="item in troubleList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="隐患级别">
          <a-select v-model="formInline.dangerLevel" placeholder="请选择" allowClear>
            <a-select-option v-for="item in troubleClassList" :key="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据筛选">
          <a-select v-model="formInline.dataFilter" placeholder="请选择" allowClear>
            <a-select-option v-for="item in filterList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="责任部门">
          <DeptTree v-model="formInline.responsibilityDept" allowClear :deptData="deptData"></DeptTree>
          <!-- <a-input v-model="formInline.responsibilityDept" placeholder="请输入"></a-input> -->
        </a-form-model-item>
        <a-form-model-item label="起草人">
          <a-input v-model="formInline.drafter" allowClear placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="处理人">
          <a-input v-model="formInline.hander" allowClear placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="创建时间">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.timeArr" :placeholder="['开始日期', '结束日期']" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="earlyWarningTest">
          <a-icon type="plus" />新建隐患
        </a-button>
        <a-button type="dashed" @click="toDraft">草稿箱</a-button>
        <a-button type="dashed" @click="openSelTable">自定义列</a-button>
        <a-button type="primary" @click="inClick">批量导入</a-button>
        <a-button type="primary" @click="downTpl" :loading="loadingExport">批量导出</a-button>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{ isHover: true }" :data="tableList" :row-class-name="rowClassName">
        <template v-for="(item, index) in columnsIng">
          <vxe-column :key="item.id" :field="item.props" :min-width="item.minWidth ? item.minWidth : 130" :title="item.title">
            <template #default="{ row }">
              <span v-if="
                  index == 0 &&
                  getChemicalDictText('htlevel', row.dangerLevel, false).color
                ">
                <span
                  class="sacl_tSpan"
                  :style="{
                    background: row.dangerLevel
                      ? getChemicalDictText('htlevel', row.dangerLevel, false).color
                      : '',
                  }"
                ></span>
                {{ row[item.props] }}
              </span>
              <span v-else-if="item.props == 'dangerCategory'">
                {{
                getChemicalDictText('httype',row[item.props])
                }}
              </span>
              <span v-else-if="item.props == 'dangerLevel'">
                {{
                getChemicalDictText("htlevel", row[item.props])
                }}
              </span>
              <span v-else-if="item.props == 'checkType'">
                {{
                getChemicalDictText('checkType',row[item.props])
                }}
              </span>
              <span v-else-if="item.props == 'responsibilityDeptId'">
                {{
                row.responsibilityDeptName + "/" + row.responsibilityPersonName
                }}
              </span>
              <span v-else-if="item.props == 'handerId'">
                {{
                (row.handerName == null ? '--': row.handerName)+ "/" + (row.handerJobNumber == null ? '--': row.handerJobNumber)
                }}
              </span>
              <span v-else-if="item.props == 'processStatus'">
                {{
                dictionary("hdstatus", row.processStatus)
                }}
              </span>
              <span v-else>{{ row[item.props] }}</span>
            </template>
          </vxe-column>
        </template>
        <vxe-column field="action" fixed="right" title="操作" width="180">
          <template #default="{ row }">
            <div class="table-btn-box">
              <span
                class="color-0067cc cursor-pointer m-r-15"
                @click="
                  actionEdit(
                    row,
                    row.processStatus == 'close' ? 'deal' : 'detail'
                  )
                "
              >查看</span>

              <span v-if="row.processStatus == 'close' || row.handerId !== userId" class="color-ccc m-r-15">处理</span>
              <span v-else class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(row, 'deal')">处理</span>
              <!-- <span
                class="color-0067cc cursor-pointer m-r-15"
                @click="actionEdit(row, 'deal')"
                >处理</span
              >-->
              <!-- <span
                class="color-0067cc cursor-pointer m-r-15"
                @click="actionEdit(row, 'deal')"
                >6处理</span
              >-->
              <span v-if="row.processStatus != 'close'" class="color-0067cc cursor-pointer m-r-15" @click="authorization(row)">授权</span>
              <span class="color-ff4d4f cursor-pointer" @click="actionDelete(row)">删除</span>
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

    <!-- 自定义列 -->
    <SelTable
      v-model="selectModel"
      :tableColumnAll="columnsAll"
      :tableColumnIng="columnsIng"
      :setColumLocalStorageName="setColumLocalStorageName"
      :columnsDefault="columnsDefault"
      @setTableColumn="setTableColumn"
    />
    <!-- 更新授权弹框 -->
    <CommonModal :title="'更新授权'" :visible="reAuthorVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="当前处理节点" prop="nodeStatesText">
            {{editForm.nodeStatesText}}
          </a-form-model-item>
          <a-form-model-item class="flex" label="原处理人" prop="handerId">
            {{editForm.handerName+'/'+editForm.handerJobNumber}}
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'holdUserId'"
            :checkAbel="false"
            :treeRoles="editFormRules"
            :labelTitle="'更新授权人员'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="editForm.holdUserId"
          />
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>

    <!-- 上传 -->
    <Upload :addVisible="addVisible" @closeAddVisible="closeAddVisible" />
  </div>
</template>
<script>
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import serviceNameList from "@/config/default/service.config.js";
import Upload from "@/pages/hiddenPerils/components/uploadHidden/index.vue";
import {
  GethiddenPerilsList,
  DelhiddenPerilsList,
  ExportHiddenList,
  reassignHandlerUser
} from "@/services/hiddenPerils.js";
import dayJs from "dayjs";
import { formValidator } from "@/utils/clx-form-validator.js"
import StaffOrDept from "@/components/staffOrDept";
import { cloneDeep, debounce } from "lodash";
import SelTable from "@/pages/dangerWorkStatic/components/selTable.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  components: { Upload, SelTable, StaffOrDept },
  mixins: [cancelLoading, chemicalDict],
  data() {
    return {
      statusList: dictionary("hdstatus"), //状态
      checkList: [], //检查类型
      troubleList: [], //隐患类别
      // troubleClassList: dictionary("htlevel"), //隐患级别
      troubleClassList:[],
      filterList: [
        { key: "create", value: "我创建的" },
        { key: "handle", value: "我处理的" },
        { key: "more", value: "超期数据" },
        { key: "moreNoHandle", value: "超期未处理" },
      ], //数据筛选
      dictionary,
      deptData:[],
      actions: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.risk}/api/ehs/risk/detail/specific/importUser`,
      formInline: {
        timeArr: [],
      },
      reAuthorVisible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表单验证
      editFormRules: {
        holdUserId: [
          { required: true, message: "更新授权人员不能为空", trigger: "change" },
        ],
      },
      editForm: {},
      editParams:{},
      hideDangerId:'',
      selectModel: false,
      // 表头本地的名称
      setColumLocalStorageName: "ehs_hiddenPerilsList_tableColumn",
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableSpinning:false,
      columnsIng: [],
      tableList: [],
      loadingExport: false,
      addVisible: false,
      columnsAll: [
        {
          id: 1,
          title: "隐患编号",
          disabled: true,
          isDefault: true,
          props: "dangerCode",
        },
        {
          id: 2,
          title: "起草人",
          disabled: true,
          isDefault: true,
          props: "draftPersonName",
        },
        {
          id: 16,
          title: "起草人部门",
          disabled: true,
          isDefault: true,
          props: "draftDeptName",
        },
        {
          id: 3,
          title: "创建时间",
          disabled: true,
          isDefault: true,
          props: "createTime",
        },
        {
          id: 10,
          title: "发现时间",
          props: "findTime",
          isDefault: true,
        },
        {
          id: 12,
          title: "组织",
          props: "corporationName",
        },
        {
          id: 13,
          title: "隐患详述",
          props: "dangerSketch",
        },
        {
          id: 4,
          title: "隐患类别",
          props: "dangerCategory",
          isDefault: true,
        },
        {
          id: 5,
          title: "隐患级别",
          props: "dangerLevel",
          isDefault: true,
        },
        {
          id: 6,
          title: "隐患位置",
          props: "dangerLocation",
          isDefault: true,
        },
        {
          id: 7,
          title: "隐患简述",
          props: "dangerSketch",
          isDefault: true,
        },
        {
          id: 8,
          title: "责任部门/责任人",
          props: "responsibilityDeptId",
          isDefault: true,
        },
        {
          id: 14,
          title: "隐患整改责任人",
          props: "rectificationResponsibilityPersonName",
        },
        {
          id: 9,
          title: "状态",
          props: "processStatus",
          isDefault: true,
        },
        {
          id: 17,
          title: "处理人",
          props: "handerId",
          isDefault: true,
        },
        {
          id: 11,
          title: "检查类型",
          props: "checkType",
          isDefault: true,
        },
        {
          id: 15,
          title: "隐患整改期限",
          props: "rectificationTime",
        },
      ],
      loading: false,
      userId: "",
      IdObjs: {},
    };
  },

  created() {
    this.initConfigPage()
    this.setRouterCode('hiddenPerilsList')
    this.getDataList(); //获取列表
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
    setTimeout(() => {
      if(this.keepalive){
        this.initConfigPage()
        this.iSearch()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      this.checkList = this.getDictItemList('checkType')
      this.troubleList = this.getDictItemList('httype')
      this.troubleClassList = this.getDictItemList('htlevel')
      // 从本地获取表头显示信息
      this.setColumnsDataFormLoc();
    },
    //逾期展示背景色
    rowClassName({ row }) {
      if (row.ses == 1) {
        return "row-yellow";
      }
    },

    // 从本地获取表头显示信息
    setColumnsDataFormLoc() {
      let seltableColumnListArr =
        JSON.parse(localStorage.getItem(this.setColumLocalStorageName)) || [];

      const userId = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
        .user.userId;
      this.userId = userId;
      if (seltableColumnListArr.length) {
        const selectedRowKeysObj = seltableColumnListArr.find(
          (item) => item.userId == userId
        );
        if (selectedRowKeysObj && selectedRowKeysObj.diffKeys) {
          // 根据筛选的显示对应表头
          this.setTableColumn(selectedRowKeysObj.diffKeys);
          return;
        }
      }
      this.columnsIng = cloneDeep(this.columnsDefault);
    },

    // 根据筛选的显示对应表头
    setTableColumn(diffKeys) {
      this.columnsIng = cloneDeep(
        this.columnsAll.filter((item) => !diffKeys.includes(item.id))
      );
    },

    //打开自定义列弹窗
    openSelTable() {
      if (!this.canClickBtnMixin("customHidden")) {
        return;
      }
      this.selectModel = true;
    },

    //草稿箱
    toDraft() {
      this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/draftBoxList" });
    },

    //获取列表
    getDataList() {
      let startTime =
        this.formInline.timeArr.length && this.formInline.timeArr[0]
          ? dayJs(this.formInline.timeArr[0]).format("YYYY-MM-DD")
          : undefined;
      let endTime =
        this.formInline.timeArr.length && this.formInline.timeArr[1]
          ? dayJs(this.formInline.timeArr[1]).format("YYYY-MM-DD")
          : undefined;
      let params = {
        ...this.formInline,
        draftStatus: "unDraft",
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        startTime,
        endTime,
        timeArr: undefined,
        draftDeptId: this.formInline.deptId ? this.formInline.deptId : "",
        deptId: undefined,
      };
      this.loading = true;
      this.tableSpinning=true;
      return GethiddenPerilsList(params)
        .then((res) => {
          this.loading = false;
          let tableList = res.data.list;
          tableList.forEach(item => {
            // 起草人部门
            item.draftDeptName = this.deptCache[item.draftDeptId] || ''
          })
          this.tableList = tableList
          this.page.total = res.data.total;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
        .finally(()=>{
          this.tableSpinning=false
        })
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    showSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      // 获取列表
      this.getDataList().finally(() => {
        this.cancelLoading();
      });
    },

    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = { timeArr: [] };
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 导入模板
    inClick() {
      this.addVisible = true;
    },

    //关闭导入弹窗
    closeAddVisible(flag) {
      if (flag) {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = { timeArr: [] };
        this.getDataList();
      }
      this.addVisible = false;
    },

    // 导出模板下载
    downTpl() {
      if (!this.canClickBtnMixin("toExportHiddenDangerTemplate")) {
        return;
      }
      let startTime = this.formInline.timeArr.length && this.formInline.timeArr[0] ? dayJs(this.formInline.timeArr[0]).format("YYYY-MM-DD") : undefined;
      let endTime = this.formInline.timeArr.length && this.formInline.timeArr[1] ? dayJs(this.formInline.timeArr[1]).format("YYYY-MM-DD") : undefined;
      let apiData = {
        ...this.formInline,
        timeArr: undefined,
        startTime,
        endTime,
      }
      this.$antConfirm({
        content: "是否要导出图片？",
        cancelText: "无需图片",
        okText: "导出图片",
        onOk: () => {
          let params = {
            ...apiData,
            exportType: true,
          };
          params.draftDeptId = this.formInline.deptId ? this.formInline.deptId : ""
          params.deptId = undefined
          this.loadingExport = true;
          ExportHiddenList(params)
            .then((res) => {
              this.spreadSheetExcel(res, "隐患排查台账");
              this.loadingExport = false;
            })
            .catch((err) => {
              console.log(err);
              this.loadingExport = false;
            });
        },
        onCancel: () => {
          let params = {
            ...apiData,
            exportType: false,
          };
          params.draftDeptId = this.formInline.deptId ? this.formInline.deptId : ""
          params.deptId = undefined
          this.loadingExport = true;
          ExportHiddenList(params)
            .then((res) => {
              this.spreadSheetExcel(res, "隐患排查台账");
              this.loadingExport = false;
            })
            .catch((err) => {
              console.log(err);
              this.loadingExport = false;
            });
        },
      });
    },

    // 分类配置
    earlyWarningTest() {
      this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/addHiddenPerils" });
    },
    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },
    //获取工号
    getWorkNum(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeCode);
        }
      }
      return listName;
    },

    //更新授权人员
    personThingOne(data) {
      this.editForm.holdUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.holdUserName = this.getName(list);
      this.editForm.holdUserJobNumber = this.getWorkNum(list);
    },
    // 授权
    authorization(e){
      console.log('rowwww',e);
      if (!this.canClickBtnMixin("authorizationAssignment")) {
        return;
      }
      this.hideDangerId = e.hideDangerId
      let _this = this
      this.$antConfirm({
        title: '更新授权流程节点人员会影响原有流程，是否确认进行更新授权？',
        onOk () {
          _this.reAuthorVisible = true
          switch (e.processStatus) {
            case "rectification":
              _this.editForm.nodeStatesText = '待整改';
              break;
            case "confirmation":
              _this.editForm.nodeStatesText = '待确认';
              break;
            case "hdreview":
              _this.editForm.nodeStatesText = '待复核';
              break;
            case "hdclose":
              _this.editForm.nodeStatesText = '待关闭';
              break;
            case "verification":
              _this.editForm.nodeStatesText = '待核实';
              break;
          }
          _this.editForm.handerName = e.handerName;
          _this.editForm.handerJobNumber = e.handerJobNumber;
        },
        onCancel () {

        }
      });
    },
    // 更新授权确认
    editConfirm(){
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      this.editParams = {
        hideDangerId:this.hideDangerId,
        handlerUserId:this.editForm.holdUserId[0],
        handlerUserJobNumber:this.editForm.holdUserJobNumber[0],
        handlerUserName:this.editForm.holdUserName[0]
      }
      reassignHandlerUser(this.editParams).then((res)=>{
        if(res.code == 20000){
          this.$antMessage.success('授权成功')
          // 获取列表
          this.getDataList();
          this.reAuthorVisible = false
          this.editParams = {}
          this.editForm = {}
        } else {
          this.$antMessage.warn(res.message)
          return
        }
      })
    },
    // 点击取消按钮
    addCancle() {
      this.reAuthorVisible = false;
      this.editForm = {};
    },
    // 编辑
    actionEdit(record, type) {
      //type为detail跳查看  否则为处理
      // if (type == "deal") {
      if (
        //待核实或待确认
        record.processStatus == "verification" ||
        record.processStatus == "confirmation"
      ) {
        this.$router.push({
          path: "/safeManage/dualControlManage/hiddenPerils/dealHiddenPage",
          query: {
            hideDangerId: record.hideDangerId,
            type: type == "detail" ? "look" : "deal",
          },
        });
      } else {
        if (record.fourPass) {
          //为四不处理
          this.$router.push({
            path: "/safeManage/dualControlManage/hiddenPerils/dealIsFour",
            query: {
              hideDangerId: record.hideDangerId,
              type: type == "detail" ? "look" : "deal",
            },
          });
        } else {
          //非四不处理
          this.$router.push({
            path: "/safeManage/dualControlManage/hiddenPerils/dealNoFour",
            query: {
              hideDangerId: record.hideDangerId,
              type: type == "detail" ? "look" : "deal",
            },
          });
        }
      }
      // } else {
      //   this.$router.push({
      //     path: "/hiddenPerils/lookHiddenPage",
      //     query: { hideDangerId: record.hideDangerId },
      //   });
      // }
    },

    // 删除
    actionDelete(record) {
      if (!this.canClickBtnMixin("delHidden")) {
        return;
      }
      this.$antConfirm({
        content: "确认删除？",
        cancelText: "取消",
        onOk: () => {
          DelhiddenPerilsList({
            hideDangerId: record.hideDangerId,
          })
            .then((res) => {
              this.$antMessage.success("删除成功");
              this.page.pageNo = 1;
              this.getDataList();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
  },

  computed: {
    columnsDefault() {
      return this.columnsAll.filter((item) => item.isDefault);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
.head-portrait {
  width: 50px;
  height: 50px;
}
.ttips {
  height: 100%;
  display: flex;
  align-items: center;
  .circle-item {
    margin-right: 15px;
  }
}
::v-deep .vxe-body--row.row-yellow {
  background-color: #ffffc1;
  z-index: 99;
}
</style>
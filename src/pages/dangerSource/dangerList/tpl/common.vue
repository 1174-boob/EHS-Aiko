<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="编号">
          <a-input v-model="formInline.code" placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属分类">
          <a-select
            v-model="formInline.classificationCode"
            placeholder="请选择"
            @change="classChangeOne"
          >
            <a-select-option
              v-for="(val, key) in classDictObj"
              :key="key"
              :value="key"
              >{{ val }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属组织">
          <a-select v-model="formInline.corporationId" placeholder="请选择">
            <a-select-option
              v-for="item in coDictList"
              :key="item.corporationId"
              :value="item.corporationId"
              >{{ item.orgAbbrName }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="部门">
          <a-input v-model="formInline.deptName" placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工艺">
          <a-input
            v-model="formInline.workmanship"
            placeholder="请输入"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="风险分级">
          <a-select
            v-model="formInline.riskClassification"
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in riskClassList"
              :key="item.key"
              :value="item.key"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="危险源种类">
          <a-select v-model="formInline.riskClass" placeholder="请选择">
            <a-select-option
              v-for="item in hazardkindList"
              :key="item.dictValue"
              :value="item.dictValue"
              >{{ item.dictLabel }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="可能导致事件">
          <a-select v-model="formInline.possibleEvents" placeholder="请选择">
            <a-select-option
              v-for="item in wxyLeadtheevent"
              :key="item.dictValue"
              :value="item.dictValue"
              >{{ item.dictLabel }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关键词">
          <a-input v-model="formInline.keyWord" placeholder="请输入"></a-input>
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
        <a-button type="dashed" @click="earlyWarningTest">分类配置</a-button>
      </div>
      <div>
        <a-button type="primary" class="btn m-l-20" @click="inClick"
          >导入</a-button
        >
        <a-button
          type="primary"
          class="btn m-l-20"
          @click="downTpl"
          :loading="loadingExport"
          >导出</a-button
        >
      </div>
    </DashBtn>
    <CommonTable
      :spinning="tableSpinning"
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="onShowSizeChange"
    >
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :pagination="false"
        :rowKey="
          (record, index) => {
            return record.id;
          }
        "
        bordered
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionEdit(record, 'detail')"
            >查看</span
          >
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionEdit(record, 'change')"
            >编辑</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="actionDelete(record)"
            >删除</span
          >
        </div>
      </a-table>
    </CommonTable>
    <CommonModal
      title="导入-共性危险源"
      :visible="addVisible"
      :cancelFn="addCancle"
    >
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
          <a-form-model-item>
            <span class="scal" @click="downTemplate">下载导入模板</span>
          </a-form-model-item>
          <a-form-model-item
            class="flex"
            label="所属分类"
            prop="classificationCode"
          >
            <a-select
              v-model="addForm.classificationCode"
              placeholder="请选择"
              @change="classChange"
            >
              <a-select-option
                v-for="(val, key) in classDictObj"
                :key="key"
                :value="key"
                >{{ val }}</a-select-option
              >
            </a-select>
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
              :disabled="!addForm.classificationCode"
              @handleSuccess="handleSuccess"
              :data="addForm"
            ></UploadBtnStyle>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import uploadCanRemove from "@/mixin/uploadCanRemove";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import serviceNameList from "@/config/default/service.config.js";
import { debounce } from "lodash";
import {
  GetCommonList,
  DelCommonList,
  ExportCommonList,
  AllClassList,
  GetOrganizationList,
} from "@/services/dangerSource/dangerList/index.js";
import { queryDeptTree } from "@/services/api.js";

import chemicalDict from "@/mixin/chemicalDict.js";
import { mapState } from "vuex";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove, chemicalDict],
  components: { UploadBtnStyle },
  data() {
    return {
      tableSpinning:false,
      loadingExport: false,
      possibleEventsList: null,
      outOrganizeTreeList: [],
      riskClassList: dictionary("riskLevel"), //风险分级
      //导入弹窗开关
      addVisible: false,
      actions: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}${serviceNameList.risk}/api/ehs/risk/detail/public/importUser` : `${serviceNameList.risk}/api/ehs/risk/detail/public/importUser`,
      formInline: {
        classificationCode: undefined,
        corporationId: undefined,
        deptId: undefined,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      //现地字段下拉框数据
      inSituListDit: [],
      classDictObj: {}, //所属分类数据
      selectedRowKeys: [],
      editForm: {},
      columns: [
        {
          title: "编号",
          dataIndex: "code",
          width: 200,
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
          title: "所属组织",
          dataIndex: "corporationName",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "部门",
          dataIndex: "deptName",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "所属分类",
          dataIndex: "classificationName",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "工艺",
          dataIndex: "workmanship",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "设备或区域",
          dataIndex: "equipmentArea",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "作业状态",
          dataIndex: "jobStatus",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "风险描述",
          dataIndex: "riskDescription",
          width: 150,
          customRender: (text) => {
            text = text ? text : "";
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
          title: "危险源种类",
          dataIndex: "riskClass",
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "可能导致事件",
          dataIndex: "possibleEvents",
          width: 150,
          customRender: (text, record, index) => {
            let dictText = text ? JSON.parse(text) : [];
            let list = this.possibleEventsList, arr = [];
            dictText.forEach(item1=> {
              list.forEach(item2=> {
                if(item1 == item2.dictValue) {
                  arr.push(item2.dictLabel)
                }
              })
            })
            console.log(arr, 'aaa')
            return arr.length > 0 ? arr.join(',') : '--';
          },
        },
        {
          title: "风险分级",
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
          customCell: (record) => {
            let background =
              dictionary("riskLevel", record.riskClassification, false).color ||
              "";
            return {
              style: { background: background, color: "#000" },
            };
          },
          customRender: (text, record) => {
            return record.riskClassification
              ? dictionary("riskLevel", record.riskClassification)
              : "--";
          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],
      addForm: {
        classificationCode: undefined,
        classificationName: undefined,
      },
      addFormRules: {
        classificationCode: [
          { required: true, message: "所属分类不能为空", trigger: "change" },
        ],
        file: [{ required: true, message: "文件不能为空", trigger: "change" }],
      },
      chemicalsList: [], //可能导致事件
      hazardkindList: [], //危险源种类
      coDictList: [], //组织数据
    };
  },
  created() {
    this.possibleEventsList = this.getDictItemList('wxy_leadtheevent');
    this.getDataList(); //获取列表
    this.initConfigPage()
  },
  computed: {
    ...mapState("setting", ["deptCache"]),
    wxyLeadtheevent() {
      const dict = this.$store.state.setting.dictTypeData;
      const wxyLeadtheevent = dict.find((item) => {
        return item.dictType == "wxy_leadtheevent";
      });
      return wxyLeadtheevent.dictItem;
    },
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
      this.allClassList(); //获取所有所属分类
      this.chemicalsList = this.getChemicalDictList("wxy_leadtheevent"); //获取可能导致事件
      this.hazardkindList = this.getChemicalDictList("wxy_hazardkind"); //获取危害因素数据
    },
    //部门树搜索
    filterTreeNode(inputValue, treeNode) {
      return (
        treeNode.data.props.title &&
        treeNode.data.props.title.indexOf(inputValue) > -1
      );
    },

    //所属分类切换
    classChangeOne(val) {
      GetOrganizationList({ classificationCode: val })
        .then((res) => {
          this.formInline.corporationId = undefined;
          this.formInline.deptId = undefined;
          this.coDictList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取所有所属分类
    allClassList() {
      return AllClassList()
        .then((res) => {
          this.classDictObj = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //所属分类下拉
    classChange(key) {
      let classificationName = this.getMappingValueObj(
        this.classDictObj,
        this.addForm.classificationCode
      );
      this.addForm = { classificationCode: key, classificationName };
    },

    //下载模板
    downTemplate() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/riskDetaild.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/riskDetaild.xlsx`)
    },

    //导入确认
    addConfirm() {
      this.addVisible = false;
    },

    //关闭导入弹窗
    addCancle() {
      this.addVisible = false;
      this.addForm = {
        classificationCode: undefined,
        classificationName: undefined,
      };
    },

    // 批量导入成功
    handleSuccess() {
      this.$antMessage.success("上传成功");
      this.addCancle();
      this.iRest();
    },

    // 导入模板
    inClick() {
      // if (!this.canClickBtnMixin("commonImport")) {
      //   return;
      // }
      this.addVisible = true;
    },

    // 导出模板下载
    downTpl() {
      let params = {
        ...this.formInline,
        pageSize: 999,
        pageNo: this.page.pageNo,
      };
      this.loadingExport = true;
      ExportCommonList(params)
        .then((res) => {
          this.spreadSheetExcel(res, "危险源清单共性");
          this.loadingExport = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingExport = false;
        });
    },

    // 获取列表
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.tableSpinning = true
      return GetCommonList(params)
        .then((res) => {
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    onShowSizeChange(current, pageSize) {
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
        this.formInline = {};
        this.coDictList = [];
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    //表格分页
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    // 分类配置
    earlyWarningTest() {
      //弹窗需控制  页面不需要
      this.$router.push({ path: "/safeManage/dualControlManage/riskManage/classification" });
    },

    // 编辑
    actionEdit(record, type) {
      //type=detail跳详情  否则为编辑
      let path =
        type == "detail"
          ? "/safeManage/dualControlManage/riskManage/detailDanger"
          : "/safeManage/dualControlManage/riskManage/editDangerList";
      this.$router.push({ path, query: { id: record.id, type: 1 } });
    },

    // 删除
    actionDelete(record) {
      if (!this.canClickBtnMixin("commonDel")) {
        return;
      }
      this.$antConfirm({
        content: "确认删除？",
        cancelText: "取消",
        onOk: () => {
          DelCommonList({
            id: record.id,
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
.scal {
  // color: #0067cc;
  // font-size: 15px;
  cursor: pointer;
  &:hover {
    color: #0067cc;
  }
}
</style>
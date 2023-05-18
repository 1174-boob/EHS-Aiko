<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>化学品安全提示卡</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="使用部门" :departmentMultiple="true"></CommonSearchItem>
        <a-form-model-item label="化学品名称">
          <a-select v-model="formInline.chemicalsId" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption">
            <a-select-option v-for="item in chemicalsList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="CAS NO">
          <a-input v-model="formInline.casNo" :maxLength="100" placeholder="请输入CAS NO" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="jumpAddOrDetail('add')">
          <a-icon type="plus" />新建
        </a-button>
      </div>
      <div>
        <UploadBtnStyle
          :action="action"
          :showAcceptText="false"
          :accept="['.xlsx', '.xls',]"
          :showUploadList="false"
          :btnText="'批量导入'"
          :btnType="'primary'"
          :btnIcon="false"
          @handleSuccess="handleSuccess"
        ></UploadBtnStyle>
        <a-button type="primary" @click="downloadTem" class="m-l-20">下载导入模板</a-button>
      </div>
    </DashBtn>

    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <template slot="echoPictogramsList" slot-scope="record">
          <a-popover class="picture-avatar" v-if="record.echoPictogramsList && record.echoPictogramsList.length > 5">
            <template slot="content">
              <img v-for="item of record.echoPictogramsList" :src="item.filePath" :key="item.id" @click="previewImg(item.filePath)" />
            </template>
            <div class="picture-list">
              <img v-for="item of record.echoPictogramsList" :src="item.filePath" :key="item.id" @click="previewImg(item.filePath)" />
            </div>
          </a-popover>
          <div class="picture-avatar cursor-pointer" v-else-if="record.echoPictogramsList && record.echoPictogramsList.length >= 1">
            <img v-for="item of record.echoPictogramsList" :src="item.filePath" :key="item.id" @click="previewImg(item.filePath)" />
          </div>
          <div v-else>--</div>
        </template>
        <template slot="down" slot-scope="text, record">
          <template v-if="record.referencesAttachmentFile && record.referencesAttachmentFile.length">
            <a-popover autoAdjustOverflow v-if="record.referencesAttachmentFile.length > 1">
              <div slot="content">
                <p v-for="item in record.referencesAttachmentFile" :key="item.id" class="down_p" @click="downUrl(item)">{{item.sourceFileName}}</p>
              </div>
              <span class="down_p" @click="downUrl(record.referencesAttachmentFile[0])">{{ record.referencesAttachmentFile.length && record.referencesAttachmentFile[0].sourceFileName }}</span>
            </a-popover>
            <a-popover autoAdjustOverflow v-else>
              <div slot="content">
                <p v-for="item in record.referencesAttachmentFile" :key="item.id" class="down_p" @click="downUrl(item)">{{item.sourceFileName}}</p>
              </div>
              <span class="down_p" @click="downUrl(record.referencesAttachmentFile[0])">{{ record.referencesAttachmentFile.length && record.referencesAttachmentFile[0].sourceFileName }}</span>
            </a-popover>
          </template>
          <template v-else>
            <span>{{'--'}}</span>
          </template>
        </template>
        <div slot="action" slot-scope="text,record">
          <span class="color-0067cc cursor-pointer" @click="openQRcodeModel(record)">二维码</span>
          <span class="color-0067cc cursor-pointer" @click="goShowPage(record)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change', record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="delDataList(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 二维码 弹窗 -->
    <QRcodeModel v-model="QRcodeModelShow" :QRCodeData="QRCodeData" />
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import chemicalDict from "@/mixin/chemicalDict.js";
import { debounce } from "lodash";
import { getConsoleOrganizeList, getChemicalIdentSafetyTipsListApi, rmChemicalIdentSafetyTipsItemApi, } from "@/services/chemicalIdentSafetyTipsAdd.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import serviceNameList from '@/config/default/service.config.js'
import dictionary from "@/utils/dictionary";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: { QRcodeModel, UploadBtnStyle, OrganizeLazyTree },
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, chemicalDict],
  data() {
    return {
      tableSpinning:false,
      dictionary,
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/safe/remind/upload`,
      // 化学品名称字典
      chemicalsList: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {
        chemicalsId: undefined,
        casNo: undefined,
        deptIds: undefined,
      },
      columns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalsId",
          key: "chemicalsId",
          customRender: (text) => {
            text = this.getChemicalDictText("chemical", text);
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 110,
        },
        {
          title: "资料附件",
          dataIndex: "down",
          key: "down",
          scopedSlots: { customRender: "down" },
          width: 140,
        },
        {
          title: '象形图',
          scopedSlots: { customRender: 'echoPictogramsList' },
          key: "echoPictogramsList",
          customCell: this.customCell,
          width: 240
        },
        {
          title: "形态",
          dataIndex: "shape",
          key: "shape",
          width: 70,
          customRender: (text) => {
            text = this.getChemicalDictText("form", text);
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
          title: "危险特性",
          dataIndex: "hazardousProperties",
          key: "hazardousProperties",
          minWidth: 130,
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
        // {
        //   title: "使用部门",
        //   dataIndex: "deptName",
        //   key: "deptName",
        //   width: 130,
        //   customRender: (text) => {
        //     text = text ? text : "";
        //     return (
        //       <a-popover autoAdjustOverflow>
        //         <div slot="content">
        //           <p>{{ text }}</p>
        //         </div>
        //         <span>{{ text }}</span>
        //       </a-popover>
        //     );
        //   },
        // },
        {
          title: "创建人",
          dataIndex: "userName",
          key: "userName",
          width: 130,
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
          title: "状态",
          dataIndex: "completeStatus",
          key: "completeStatus",
          width: 90,
          customRender: (text) => {
            text = dictionary("complateStatus", text);
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
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 160,
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
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 216, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
      // 二维码弹窗
      QRcodeModelShow: false,
      QRCodeData: {},
      // 使用部门树
      consoleOrganizeTreeList: [],
      replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
    };
  },
  created() {
    this.setRouterCode('chemicalIdentSafetyTips')
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "使用部门"
    }))
    this.initConfigPage
    this.getTableList();
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
      // 化学品名称字典
      this.chemicalsList = this.getChemicalDictList('chemical')
    },
    // 象形图单元格样式
    customCell(record) {
      if (record) {
        return {
          style: {
            'padding': '0',
          },
        };
      }
    },
    // 图片预览
    previewImg(url) {
      this.$hevueImgPreview(url);
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
      let params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      getChemicalIdentSafetyTipsListApi(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    // 二维码弹窗
    openQRcodeModel(row) {
      this.QRCodeData = { safeRemindId: row.safeRemindId };
      this.QRcodeModelShow = true;
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.getTableList()
    },
    // 下载模板
    downloadTem() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/安全提示卡导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/安全提示卡导入模板.xlsx`)
    },
    //跳转新增、编辑页面
    jumpAddOrDetail(type, record) {
      let query = {};
      if (record) {
        query = { type, safeRemindId: record.safeRemindId };
      } else {
        query = { type };
      }
      let path = type == 'add' ? "/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetyTipsAdd" : "/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetyTipsAdd"
      this.$router.push({
        path,
        query,
      });
    },
    // 跳转查看页面
    goShowPage(record) {
      let query = { safeRemindId: record.safeRemindId };
      this.$router.push({
        path: "/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetyTipsShow",
        query,
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmChemicalIdentSafetyTipsItemApi({ safeRemindId: record.safeRemindId })
            .then((res) => {
              this.$antMessage.success('删除成功');
              this.getTableList();
            })
            .catch(err => { });
        },
        onCancel() {
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
      this.handleLoading();
      this.getTableList();
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
        this.formInline = {
          chemicalsId: undefined,
          casNo: undefined,
          deptIds: undefined,
        };
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
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
</style>

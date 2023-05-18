<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>化学品安全标签</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="使用部门" :departmentMultiple="true"></CommonSearchItem>
        <a-form-model-item label="化学品名称">
          <a-select v-model="formInline.chemicalName" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption">
            <a-select-option v-for="item in chemicalsList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
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
        <template slot="echoPictureList" slot-scope="record">
          <a-popover class="picture-avatar" v-if="record.echoPictureList && record.echoPictureList.length > 5">
            <template slot="content">
              <img v-for="item of record.echoPictureList" :src="item.filePath" :key="item.id" @click="previewImg(item.filePath)" />
            </template>
            <div class="picture-list">
              <img v-for="item of record.echoPictureList" :src="item.filePath" :key="item.id" @click="previewImg(item.filePath)" />
            </div>
          </a-popover>
          <div class="picture-avatar cursor-pointer" v-else-if="record.echoPictureList && record.echoPictureList.length >= 1">
            <img v-for="item of record.echoPictureList" :src="item.filePath" :key="item.id" @click="previewImg(item.filePath)" />
          </div>
          <div v-else>--</div>
        </template>
        <template slot="down" slot-scope="text, record">
          <template v-if="record.echoAttachmentList && record.echoAttachmentList.length">
            <a-popover autoAdjustOverflow v-if="record.echoAttachmentList.length > 1">
              <div slot="content">
                <p v-for="item in record.echoAttachmentList" :key="item.id" class="down_p" @click="downUrl(item)">{{item.sourceFileName}}</p>
              </div>
              <span class="down_p" @click="downUrl(record.echoAttachmentList[0])">{{ record.echoAttachmentList.length && record.echoAttachmentList[0].sourceFileName }}</span>
            </a-popover>
            <a-popover autoAdjustOverflow v-else>
              <div slot="content">
                <p v-for="item in record.echoAttachmentList" :key="item.id" class="down_p" @click="downUrl(item)">{{item.sourceFileName}}</p>
              </div>
              <span class="down_p" @click="downUrl(record.echoAttachmentList[0])">{{ record.echoAttachmentList.length && record.echoAttachmentList[0].sourceFileName }}</span>
            </a-popover>
          </template>
          <template v-else>
            <span>{{'--'}}</span>
          </template>
        </template>
        <div slot="action" slot-scope="text,record">
          <span class="color-0067cc cursor-pointer" @click="goShowPage(record)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change', record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="delDataList(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { debounce } from "lodash";
import { getConsoleOrganizeList, getChemicalIdentSafetySignsListApi, rmChemicalIdentSafetySignsItemApi, } from "@/services/chemicalIdentSafetyTipsAdd.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import serviceNameList from '@/config/default/service.config.js'
import dictionary from "@/utils/dictionary";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { number } from 'echarts';
export default {
  components: { UploadBtnStyle, QRcodeModel, OrganizeLazyTree },
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, chemicalDict],
  data() {
    return {
      tableSpinning:false,
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/safe/label/upload`,
      // 化学品名称list
      chemicalsList: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      columns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalName",
          key: "chemicalName",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('chemical', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 120,
        },
        {
          title: "资料附件",
          dataIndex: "down",
          key: "down",
          scopedSlots: { customRender: "down" },
          width: 150,
          ellipsis: true
        },
        {
          title: '象形图',
          scopedSlots: { customRender: 'echoPictureList' },
          key: "echoPictureList",
          customCell: this.customCell,
          width: 240
        },
        {
          title: "形态",
          dataIndex: "form",
          key: "form",
          width: 80,
          customRender: (text) => {
            text = text ? this.getChemicalDictText('form', text) : ''
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
          dataIndex: "dangerousProperties",
          key: "dangerousProperties",
          minWidth: 180,
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
        // {
        //   title: "使用部门",
        //   dataIndex: "useDept",
        //   key: "useDept",
        //   width: 140,
        //   customRender: (text) => {
        //     text = text ? text : ''
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
          dataIndex: "createUser",
          key: "createUser",
          width: 130,
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
          title: "状态",
          dataIndex: "completeStatus",
          key: "completeStatus",
          // width: 150,
          customRender: (text) => {
            text = text ? dictionary('complateStatus', text) : ''
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
          width: 120,
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
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 180, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
    };
  },
  created() {
    this.setRouterCode('chemicalIdentSafetyTips')
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "使用部门"
    }))
    this.initConfigPage()
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
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      getChemicalIdentSafetySignsListApi(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
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
    jumpAddOrDetail(type, record) {
      let query = {};
      if (record) {
        query = { type, labelId: record.labelId };
      } else {
        query = { type };
      }
      let path = type == 'add' ? "/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetySignsAdd" : "/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetySignsAdd"
      this.$router.push({
        path,
        query,
      });
    },
    // 跳转查看页面
    goShowPage(record) {
      let query = { labelId: record.labelId };
      this.$router.push({
        path: "/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetySignsShow",
        query,
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmChemicalIdentSafetySignsItemApi({ labelId: record.labelId })
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
      this.handleLoading();
      this.getTableList();
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.getTableList()
    },
    // 下载模板
    downloadTem() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/化学品安全标识导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/化学品安全标识导入模板.xlsx`)
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

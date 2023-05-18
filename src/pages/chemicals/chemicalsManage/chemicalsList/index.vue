<template>
  <div class="chemicals-list clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>化学品清单</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :departmentMultiple="true" :hasDepartment="true" deptLabel="使用部门"></CommonSearchItem>
        <a-form-model-item label="化学品名称">
          <a-select v-model="formInline.chemicalName" placeholder="请选择化学品名称" show-search :filter-option="filterOption" allowClear>
            <a-select-option v-for="item of chemical" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="形态">
          <a-select v-model="formInline.form" placeholder="请选择形态" show-search :filter-option="filterOption" allowClear>
            <a-select-option v-for="item in form" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="chemicalAdd">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" @click="toChemicalImport">
          新导入化学品
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
        <a-button type="primary" class="btn" @click="downloadTemplate">导入模板</a-button>
        <a-button type="primary" class="btn" @click="exportAll">批量导出</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="pictureList" slot-scope="record">
          <a-popover class="picture-avatar" v-if="record.pictureList && record.pictureList.length > 5">
            <template slot="content">
              <img v-for="item of record.pictureList" :src='item.filePath' :key="item.id" @click="previewImg(item.filePath)"/>
            </template>
            <div class="picture-list">
              <img v-for="item of record.pictureList" :src='item.filePath' :key="item.id"/>
            </div>
          </a-popover>
          <div class="picture-avatar cursor-pointer" v-else-if="record.pictureList && record.pictureList.length >= 1">
            <img v-for="item of record.pictureList" :src='item.filePath' :key="item.id" @click="previewImg(item.filePath)"/>
          </div>
          <div v-else>--</div>
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="chemicalPreview(record)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="chemicalEdit(record)">编辑</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
import serviceNameList from '@/config/default/service.config.js'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import dictionary from '@/utils/dictionary';
import { getOrganizeList, chemicalPageList, chemicalDownload } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    UploadBtnStyle,
  },
  data() {
    return {
      tableSpinning:false,
      formInline: {
        deptList: undefined,
        form: undefined,
        chemicalName: undefined,
      },
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/list/upload`,
      chemicalForm: {},
      completeDict: {},
      chemicalDict: {},
      formDict: {},
      // riskDict: {},
      // treeData: [],
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: "编号",
          dataIndex: "code",
          key: "code",
          width: 200,
        },
        {
          title: "化学品名称",
          dataIndex: "chemicalName",
          key: "chemicalName",
          width: 160,
          customRender: (text, record, index) => {
            return this.chemicalDict[text] ? this.chemicalDict[text] : "--";
          },
        },
        {
          title: "形态",
          dataIndex: "form",
          key: "form",
          width: 100,
          customRender: (text, record, index) => {
            return this.formDict[text] ? this.formDict[text] : "--";
          },
        },
        {
          title: "主要成分",
          dataIndex: "mainIngredient",
          key: "mainIngredient",
          width: 200,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "危险性说明",
          dataIndex: "dangerousStatement",
          key: "dangerousStatement",
          width: 200,
          customRender: (text, record, index) => {
            return text ? text : "--";
            // return this.riskDict[text] ? this.riskDict[text] : "--";
          }
        },
        // {
        //   title: "使用部门",
        //   dataIndex: "useDept",
        //   key: "useDept",
        //   width: 160,
        //   customRender: (text, record, index) => {
        //     return text ? text : "--";
        //   },
        // },
        {
          title: '象形图',
          scopedSlots: { customRender: 'pictureList' },
          key: "pictureList",
          customCell: this.customCell,
          width: 240
        },
        {
          title: "创建人",
          dataIndex: "createUser",
          key: "createUser",
          width: 160,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 160,
        },
        {
          title: "完善状态",
          dataIndex: "completeStatus",
          key: "completeStatus",
          width: 160,
          customRender: (text, record, index) => {
            return this.completeDict[text] ? this.completeDict[text] : "--";
          }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 200
        },
      ]
    }
  },
  computed: {
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      chemical.dictItem.forEach(ele => {
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel)
      });
      return chemical.dictItem;
    },
    form() { //从字典组里获取化学品形态数据
      const dict = this.$store.state.setting.dictTypeData;
      const form = dict.find(item => {
        return item.dictType == 'form';
      });
      form.dictItem.forEach(ele => {
        this.$set(this.formDict, ele.dictValue, ele.dictLabel)
      });
      return form.dictItem;
    },
    // risk_categories() { //从字典组里获取危险性分类数据
    //   const dict = this.$store.state.setting.dictTypeData;
    //   const risk_categories = dict.find(item => {
    //     return item.dictType == 'risk_categories';
    //   });
    //   return risk_categories.dictItem; //字典项
    // },
  },
  created() {
    this.setRouterCode("chemicalsList");
    this.columns.splice(1, 0, this.addCommonColumnItem(150))
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "使用部门",
      
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
      const complateStatus = dictionary('complateStatus');
      if (complateStatus) {
        for (let index = 0; index < complateStatus.length; index++) {
          const element = complateStatus[index];
          this.$set(this.completeDict, element.key, element.value)
        }
      }
    },
    // 象形图单元格样式
    customCell(record) {
      if(record) {
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
    // 获取分页查询数据
    getChemicalList() {
      const params = {
        ...this.chemicalForm,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      chemicalPageList(params)
      .then(res => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.iRest();
    },
    // 批量导出
    async exportAll() {
      const name = '化学品清单批量导出'
      const params = {
        ...this.chemicalForm
      }
      let res = await chemicalDownload(params);
      if (res) {
        const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + '.xlsx';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.chemicalForm = JSON.parse(JSON.stringify(this.formInline));
      this.getChemicalList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        deptList: undefined,
        form: undefined,
        chemicalName: undefined,
      }
      this.chemicalForm = {};
      this.getChemicalList();
    }, 250, { leading: true, trailing: false }),
    // 新建
    chemicalAdd() {
      this.$router.push("/safeManage/chemicalSafeManage/chemicalListManage/addChemical");
    },
    toChemicalImport() {
      this.$router.push("/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicals");
    },
    // 化学品查看
    chemicalPreview(record) {
      this.$router.push({ path: "/safeManage/chemicalSafeManage/chemicalListManage/chemicalsListPreview", query: { id: record.chemicalId } });
    },
    // 化学品编辑
    chemicalEdit(record) {
      sessionStorage.setItem('chemicalAdd', 1);
      this.$router.push({ path: "/safeManage/chemicalSafeManage/chemicalListManage/addChemical", query: { id: record.chemicalId } });
    },
    // 导入模板下载
    downloadTemplate() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/化学品清单导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/化学品清单导入模板.xlsx`)
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
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
  }
}
</script>

<style lang="less" scoped>
.chemicals-list {
  .btn {
    margin-left: 20px;
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
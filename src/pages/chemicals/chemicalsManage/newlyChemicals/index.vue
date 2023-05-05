<template>
  <div class="newly-chemicals clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>新导入化学品入厂</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="使用部门"></CommonSearchItem>
        <a-form-model-item label="化学品名称">
          <a-input v-model.trim="formInline.chemicalsId" placeholder="请输入化学品名称" allowClear/>
        </a-form-model-item>
        <a-form-model-item label="形态">
          <a-select v-model="formInline.shape" placeholder="请选择形态" allowClear>
            <a-select-option v-for="item in form" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="jumpDraft">
          草稿箱
        </a-button>
        <a-button type="dashed" @click="chemicalAdd">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="newlyPreview(record)">查看</span>
          <span class="color-0067cc cursor-pointer" v-if="record.handler && record.handler.indexOf(userId)>=0 && record.status != 'end'" @click="newlyHandle(record)">处理</span>
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
import dictionary from '@/utils/dictionary'
import { getOrganizeList, deptDict,managePageList } from "@/services/api.js";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {OrganizeLazyTree},
  data() {
    return {
      tableSpinning:false,
      userId: null,
      formInline: {
        chemicalsId: undefined,
        shape: undefined,
        deptId: undefined,
      },
      searchData: {},
      draftStatus: '2',
      statusDict: {},
      // treeData: [],
      // chemicalDict: {},
      formDict: {},
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
          width: 200
        },
        {
          title: "化学品名称",
          dataIndex: "chemicalsId",
          key: "chemicalsId",
          width: 160,
          // customRender: (text, record, index) => {
          //   return this.chemicalDict[text] ? this.chemicalDict[text] : "--";
          // },
        },
        {
          title: "形态",
          dataIndex: "shape",
          key: "shape",
          width: 100,
          customRender: (text, record, index) => {
            return this.formDict[text] ? this.formDict[text] : "--";
          },
        },
        {
          title: "主要成分",
          dataIndex: "mainIngredient",
          key: "mainIngredient",
          width: 200
        },
        {
          title: "危险性",
          dataIndex: "chemicalHazard",
          key: "chemicalHazard",
          width: 200
        },
        {
          title: "申请人部门",
          customRender: (text, record, index) => {
            if (record.applicantDept && this.deptCache[record.applicantDept]) {
              return this.deptCache[record.applicantDept]
            }
            return "--"
          },
          key: "applicantDept",
          width: 160
        },
        {
          title: "申请人",
          dataIndex: "applicant",
          key: "applicant",
          width: 160
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 160
        },
        {
          title: "完成导入时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 160
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          width: 100,
          customRender: (text, record, index) => {
            return this.statusDict[text] ? this.statusDict[text] : "--";
          },
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
    form() { //从字典组里获取化学品形态数据
      const dict = this.$store.state.setting.dictTypeData;
      const form = dict.find(item => {
        return item.dictType == 'form';
      });
      form.dictItem.forEach(ele => {
        this.$set(this.formDict, ele.dictValue, ele.dictLabel);
      });
      return form.dictItem; //字典项
    },
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      // chemical.dictItem.forEach(ele => {
      //   this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel);
      // });
      return chemical.dictItem;
    },
  },
  created() {
    this.setRouterCode("chemicalsList");
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "使用部门",
      key: "deptIds"
    }))
    this.initConfigPage()
    this.iSearch();
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
      const userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
      this.userId = userInfo.user.userId;
      this.getStatus();
    },
    // 获取组织字典
    getDeptDict() {
      deptDict().then(res => {
        this.deptDict = res.data.idList;
      }).catch(err => {
        console.log(err);
      })
    },
    getStatus() {
      const chemicalApproveStatus = dictionary("chemicalApproveStatus");
      const statusDict = {};
      chemicalApproveStatus.forEach(ele=>{
        statusDict[ele.key] = ele.value;
      })
      this.statusDict = statusDict;
    },
    getPageList() {
      const params = {
        ...this.searchData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      this.tableSpinning = true
      managePageList(params)
      .then(res=>{
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 跳转到草稿箱
    jumpDraft() {
      this.$router.push("/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicalsDraft");
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 查询
    iSearch() {
      // this.handleLoading();
      const params = {
        ...this.formInline,
        draftStatus: this.draftStatus,
      }
      this.searchData = JSON.parse(JSON.stringify(params));
      this.getPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        chemicalsId: undefined,
        shape: undefined,
        deptId: undefined,
      }
      this.searchData = {
        draftStatus: this.draftStatus,
      };
      this.getPageList();
    }, 250, { leading: true, trailing: false }),
    // 新建
    chemicalAdd() {
      this.$router.push("/safeManage/chemicalSafeManage/chemicalListManage/addNewlyChemicals");
    },
    // 化学品查看
    newlyPreview(record) {
      console.log(record);
      sessionStorage.setItem("handleNewly", 0)
      this.$router.push({ path: "/safeManage/chemicalSafeManage/chemicalListManage/handleNewly", query: { id: record.importId} });
    },
    // 处理
    newlyHandle(record) {
      sessionStorage.setItem("handleNewly", 1)
      this.$router.push({ path: "/safeManage/chemicalSafeManage/chemicalListManage/handleNewly", query: { id: record.importId} });
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getPageList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getPageList();
    },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
  }
}
</script>

<style lang="less" scoped>
.newly-chemicals {
  .export-btn {
    margin-left: 20px;
  }
}
</style>
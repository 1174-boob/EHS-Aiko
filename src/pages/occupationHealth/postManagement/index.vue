<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>岗位管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="姓名">
          <a-input v-model="formInline.name" placeholder="请输入姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号">
          <a-input type="number" v-model="formInline.workNum" placeholder="请输入工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input type="number" v-model="formInline.phone" placeholder="请输入手机号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属部门">
          <a-tree-select
            show-search
            allow-clear
            v-model="formInline.deptId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
            :tree-data="treeData"
            placeholder="请选择所属部门"
            :filter-option="filterOptionMixin"
            :treeDefaultExpandAll="false"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="危害岗位">
          <a-select showSearch v-model="formInline.afterAdjustment" placeholder="请选择危害岗位" :filter-option="filterOptionMixin">
            <a-select-option v-for="item in dangerousPostAll" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="变动形式">
          <a-select v-model="formInline.variation" placeholder="请选择变动形式">
            <a-select-option v-for="item in changeTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="审核状态">
          <a-select v-model="formInline.approvalType" placeholder="请选择审核状态">
            <a-select-option v-for="item in nodeStatusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="申请时间">
          <a-range-picker v-model="formInline.applicationTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="toDraft">草稿箱</a-button>
        <a-button type="dashed" @click="toPostChange">变岗申请</a-button>
      </div>
      <div>
        <a-button type="primary"  @click="exportExcel">导出Excel</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span v-if="record.handler.indexOf(userId) > -1" class="color-0067cc cursor-pointer m-r-15" @click="toPostChange(record)">处理</span>
        </div>
        <div slot="variation" slot-scope="record">
          {{getMappingValue(changeTypeList, "key", record.variation).value}}
        </div>
        <div slot="newPositionName" slot-scope="record">
          {{record.newPositionName ? record.newPositionName : getMappingValue(dangerousPostAll, "value", record.afterAdjustment).label}}
        </div>
        <div slot="approvalType" slot-scope="record">
          {{getMappingValue(nodeStatusList, "key", record.approvalType).value}}
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import { postPageList, getDangerousPostAll, postExport } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import dictionary from '@/utils/dictionary'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { formValidator } from "@/utils/clx-form-validator.js";

export default {
  components: { OrganizeLazyTree },
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          width: 200
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: 200
        },
        {
          title: '工号',
          dataIndex: 'workNum',
          width: 200
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          width: 200
        },
        {
          title: '所属部门',
          dataIndex: 'deptName',
          width: 200
        },
        {
          title: '原岗位名称',
          dataIndex: 'originalPositionName',
          width: 200
        },
        {
          title: '变动形式',
          scopedSlots: { customRender: 'variation' },
          width: 200
        },
        {
          title: '变动后岗位名称',
          dataIndex: 'afterAdjustment',
          width: 200
        },
        {
          title: '申请时间',
          dataIndex: 'applicationTime',
          width: 200
        },
        {
          title: '审核通过时间',
          dataIndex: 'approvalTime',
          minWidth: 200
        },
        {
          title: '审核状态',
          scopedSlots: { customRender: 'approvalType' },
          fixed: 'right',
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      changeTypeList: [],
      dangerousPostAll: [],
      nodeStatusList: [],
      userId: "",
      treeData: [],
    }
  },
  created() {
    this.setRouterCode("postChange");
    this.columns.splice(1, 0, this.addCommonColumnItem(200, true));
    this.initConfigPage()
    this.getDataList();
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
      this.changeTypeList = dictionary("post_apply"); // 变岗形式
      this.nodeStatusList = dictionary("post_approval"); // 审核状态
      this.getDangerousPostAll();
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    corporationChange() {
      this.$set(this.formInline, "deptId", undefined);
      this.treeData = [];
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
    },
    // 草稿箱
    toDraft() {
      this.$router.push("/occupationHealth/postChangeDraftList");
    },
    // 变岗申请
    toPostChange(record) {
      console.log(record.id)
      if (record.id) {
        this.$router.push({path: "/occupationHealth/postChangeResolve", query: {id: record.id}});
      } else {
        this.$router.push("/occupationHealth/postChangeCreate");
      }
    },
    // 导出Excel
    async exportExcel() {
      let para = {
        ...this.preFormInline,
        isDraft: 0,//非草稿列表
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      const res = await postExport(para)
      if(res){
        const name = '岗位管理审批导出'
        const blob = new Blob([res],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        const downloadElement = document.createElement('a')
        const href = URL.createObjectURL(blob) //创建下载链接
        downloadElement.href = href
        downloadElement.download = name + '.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
    },
    // 变岗审批列表
    getDataList() {
      this.tableSpinning = true
      return postPageList({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        isDraft: 0,
        ...this.preFormInline
      })
      .then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      if (this.formInline.name && (this.formInline.name.length < 2 || !this.isCHinese(this.formInline.name))) {
        this.$antMessage.warn("姓名模糊查询不可少于2个字,只能是汉字");
        return;
      }
      if (this.formInline.workNum && (this.formInline.workNum.length < 5 || !this.checkNum(0, this.formInline.workNum))) {
        this.$antMessage.warn("工号模糊查询不可少于5个数字，只能是数字");
        return;
      }
      if (this.formInline.phone && (this.formInline.phone.length < 5 || !this.checkNum(0, this.formInline.phone))) {
        this.$antMessage.warn("手机号模糊查询不可少于2个字，只能是数字");
        return;
      }
      this.preFormInline = { ...this.formInline };
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      console.log(this.formInline);
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonDept.reset();
      this.treeData = [];
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 获取所有危害岗位
    getDangerousPostAll() {
      getDangerousPostAll().then(res => {
        this.dangerousPostAll = res.data || [];
        console.log(res);
      })
    },
    
    // 按钮-详情
    actionLook(record) {
      console.log("详情", record);
      this.$router.push({ path: "/occupationHealth/postChangeView", query: { id: record.id, disabled: true } });
    },
    
    
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    }
  }
}
</script>
<style lang="less" scoped>
</style>
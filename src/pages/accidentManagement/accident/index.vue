<template>
    <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <PageTitle>事故事件台账</PageTitle>
      <SearchTerm>
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
          <a-form-model-item label="责任部门">
            <a-tree-select
              show-search
              allow-clear
              v-model="formInline.deptId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
              :tree-data="treeData"
              placeholder="请选择责任部门"
              :filter-option="filterOptionMixin"
              :treeDefaultExpandAll="false"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="事故地点">
            <a-input v-model="formInline.accidentLocation" placeholder="请输入事故地点"></a-input>
          </a-form-model-item>
          <a-form-model-item label="事故类型">
            <a-select v-model="formInline.accidentType" placeholder="请选择事故类型">
              <a-select-option v-for="item in accidentType" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="人员伤害">
            <a-select v-model="formInline.accidentLevelHurt" placeholder="请选择事故类型">
              <a-select-option v-for="item in personalInjury" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="财产损失">
            <a-select v-model="formInline.accidentLevelLoss" placeholder="请选择事故类型">
              <a-select-option v-for="item in propertyLoss" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="审核状态">
            <a-select v-model="formInline.approvalStatus" placeholder="请选择审核状态">
              <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="事故日期">
            <a-range-picker v-model="formInline.accidentDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
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
          <a-button type="dashed" @click="toCreate">新建</a-button>
        </div>
        <div>
          <a-button type="primary" @click="exportExcel">批量导出</a-button>
        </div>
      </DashBtn>
      <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
        <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="action" slot-scope="record">
            <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
            <span v-if="record.handleId && record.handleId.indexOf(userId) != -1" class="color-0067cc cursor-pointer m-r-15" @click="toCreate(record)">处理</span>
            <span class="color-0067cc cursor-pointer" @click="actionDel(record)">删除</span>
          </div>
          <div slot="accidentType" slot-scope="record">
            {{getMappingValue(accidentType, "dictValue", record.accidentType).dictLabel}}
          </div>
          <div slot="accidentLevel" slot-scope="record">
            {{record.accidentLevelHurt != 'person_none' ? getMappingValue(personalInjury, "dictValue", record.accidentLevelHurt).dictLabel : getMappingValue(propertyLoss, "dictValue", record.accidentLevelLoss).dictLabel}}
          </div>
          <div slot="createUser" slot-scope="record">
            {{record.draftPersonName ? (record.draftPersonName + "/" + record.draftPersonJobNumber) : record.draftPersonJobNumber}}
          </div>
          <div slot="approvalStatus" slot-scope="record">
            {{getMappingValue(statusList, "key", record.approvalStatus).value}}
          </div>
        </a-table>
      </CommonTable>
    </div>
</template>

<script>
import { postExport } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import dictionary from '@/utils/dictionary'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import {  accidentEventPageList, accidentEventDownload, accidentEventDelete } from '@/services/accident';

export default {
    components: { OrganizeLazyTree },
    mixins: [teableCenterEllipsis, cancelLoading],
    data() {
      return {
        tableSpinning:false,
        accidentType: [],
        personalInjury: [],
        propertyLoss: [],
        statusList: [],

        formInline: {},
        preFormInline: {},
        page: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        columns: [
          {
            title: '事故编号',
            dataIndex: 'accidentCode',
            width: 200
          },
          {
            title: '事故地点',
            dataIndex: 'accidentLocation',
            width: 200
          },
          {
            title: '事故级别',
            scopedSlots: { customRender: 'accidentLevel' },
            width: 200
          },
          {
            title: '事故类型',
            scopedSlots: { customRender: 'accidentType' },
            width: 200
          },
          {
            title: '责任部门',
            dataIndex: 'dutyDeptNameList',
            width: 200
          },
          {
            title: '事故日期',
            dataIndex: 'accidentDate',
            width: 200
          },
          {
            title: '事故具体时间',
            dataIndex: 'accidentTime',
            width: 200
          },
          {
            title: '起草人',
            scopedSlots: { customRender: 'createUser' },
            width: 200
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 200
          },
          {
            title: '状态',
            scopedSlots: { customRender: 'approvalStatus' },
            fixed: 'right', // 固定操作列
            width: 140
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'action' },
            fixed: 'right', // 固定操作列
            width: 160 // 宽度根据操作自定义设置
          }
        ],
        tableDataList: [],
        changeTypeList: [],
        dangerousPostAll: [],
        userId: "",
        treeData: [],
      }
    },
    created() {
      this.setRouterCode("accidentList");
      this.columns.splice(1, 0, this.addCommonColumnItem(200, true));
      this.columns.splice(2, 0, this.addCommonColumnDepartment({
        width: 150,
        title: "申请人部门",
      }, true))
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
        this.accidentType = this.getDictItemList("accident_type");
        this.personalInjury = this.getDictItemList("accident_level_person");
        this.propertyLoss = this.getDictItemList("accident_level_money");
        this.statusList = dictionary("approvalStatus");
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
        this.$router.push("/safeManage/emergencyManagement/accidentManagement/accidentDraft");
      },
      // 变岗申请+处理按钮
      toCreate(record) {
        if (record.formId) {
          this.$router.push({path: "/safeManage/emergencyManagement/accidentManagement/accidentResolve", query: {formId: record.formId, isResolve: true}});
        } else {
          this.$router.push({path: "/safeManage/emergencyManagement/accidentManagement/accidentCreate", query: {formId: record.formId, isCreate: true}});
        }
      },
      // 导出Excel
      async exportExcel() {
        let para = {
          ...this.preFormInline,
          draftStatus: 2,//非草稿列表
          pageSize: this.page.pageSize,
          pageNo: this.page.pageNo
        }
        try {
          const res = await accidentEventDownload(para)
          if(res){
            const name = '事故事件导出'
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
        } catch (err) {
          console.log(err);
        }
          
      },
      // 变岗审批列表
      getDataList() {
        this.tableSpinning=  true
        return accidentEventPageList({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          draftStatus: 2,
          dutyDeptId: this.preFormInline.deptId,
          ...this.preFormInline
        })
        .then(res => {
          this.cancelLoading(100);
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
        })
        .catch(err => { })
        .finally(()=>{
          this.tableSpinning=  false
        })
      },
      // 查询
      iSearch() {
        this.preFormInline = { ...this.formInline };
        this.preFormInline.startTime = this.formInline.accidentDate ? this.formInline.accidentDate[0] : "";
        this.preFormInline.endTime = this.formInline.accidentDate ? this.formInline.accidentDate[1] : "";
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        }
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
      
      // 按钮-详情
      actionLook(record) {
        this.$router.push({ path: "/safeManage/emergencyManagement/accidentManagement/accidentDetail", query: { formId: record.formId, isView: true } });
      },
      // 按钮-删除
      actionDel(record) {
        accidentEventDelete({
          formId: record.formId
        }).then(res => {
          this.$antMessage.success("删除成功！");
          this.getDataList();
        })
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
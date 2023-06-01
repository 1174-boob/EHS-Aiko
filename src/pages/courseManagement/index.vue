<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>课程管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" @corporationChange="corporationChange"></CommonSearchItem>
        <a-form-model-item label="课程名/创建人">
          <a-input v-model="formInline.name" placeholder="请输入课程名称和创建人"></a-input>
        </a-form-model-item>
        <a-form-model-item label="科目">
          <a-select v-model="formInline.subjectId" placeholder="请选择科目">
            <a-select-option v-for="item in subjectList" :key="item.subjectId" :value="item.subjectId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.status" placeholder="请选择状态">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
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
      <div>
        <a-button type="dashed" @click="addCourse">新建课程</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" :class="{'color-999': record.status != 1, 'cursor-disabled': record.status != 1}" @click="actionPushStaff(record)">推送</span>
          <!-- <span class="color-0067cc cursor-pointer m-r-15" @click="actionRecall(record)">撤回</span> -->
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span class="color-0067cc cursor-pointer m-r-15" :class="{'color-999': record.pushStatus == 2, 'cursor-disabled': record.pushStatus == 2}" @click="actionEdit(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" :class="{'color-999': record.pushStatus == 2, 'cursor-disabled': record.pushStatus == 2}" @click="actionDelete(record)">删除</span>
          <span class="color-0067cc cursor-pointer" @click="changeStatus(record)">{{record.status == 0 ? "上架" : "下架"}}</span>
        </div>
        <div slot="subjectId" slot-scope="record">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{findText(subjectListAll, "subjectId", record.subjectId).name}}</p>
            </div>
            <span>{{findText(subjectListAll, "subjectId", record.subjectId).name}}</span>
          </a-popover>
        </div>
        <div slot="status" slot-scope="record">
          <span>{{findText(statusList, "key", record.status).value}}</span>
        </div>
        <div slot="format" slot-scope="record">
          <span>{{findText(formatList, "key", record.format).value}}</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal class="table-modal" title="推送" :visible="pushVisible" :cancelFn="pushCancle">
      <PushComponent ref="pushModal" :dataMsg="currentPushMsg"></PushComponent>
      <template slot="btn1">
        <a-button @click="pushCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="loadingTwo" @click="pushConfirm">确认推送</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dictionary from '@/utils/dictionary';
import PushComponent from "@/pages/courseManagement/pushStaff.vue";
import { debounce, cloneDeep } from 'lodash';
import { GetCourseList, DeleteCourse, GetSubjectlist, UpdateCourseStatus, PushCourse, getInsidePeopleInfoApi } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: { PushComponent },
  data() {
    return {
      tableSpinning:false,
      // permission: false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },

      columns: [
        {
          title: '序号',
          dataIndex: 'rowOrder',
          key: "rowOrder",
          width: 80,
        },
        {
          title: '课程名称',
          dataIndex: 'name',
          key: "name",
          width: 150,
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
          title: '课程形式',
          scopedSlots: { customRender: 'format' },
          key: "format",
          width: 150,
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' },
          key: "status",
          width: 130,
        },
        {
          title: '科目',
          scopedSlots: { customRender: 'subjectId' },
          key: "subjectId",
          width: 150,
        },
        {
          title: '创建人',
          dataIndex: 'createUserName',
          key: "createUserName",
          width: 150,
        },
        {
          title: '排序',
          dataIndex: 'sortNo',
          key: "sortNo",
          width: 100,
        },
        {
          title: '新增时间',
          dataIndex: 'createTime',
          key: "createTime",
          width: 160,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 260 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],


      fileTypeList: [],
      subjectList: [],
      subjectListAll: [],
      statusList: [
        {
          key: 1,
          value: "已上架"
        },
        {
          key: 0,
          value: "未上架"
        }
      ],
      formatList: [
        {
          key: "1",
          value: "内部课程"
        },
        {
          key: "2",
          value: "外部课程"
        }
      ],

      pushVisible: false,
      currentPushMsg: undefined,
      checkedUserTitle: undefined,
      chooseStaffDetail: undefined,

      userTreeData: [],
      pushCompanyList: [],
      companyId: "",
      companyName: "",
    }
  },
  created() {
    this.setRouterCode("coursemanagement");
    this.columns.splice(0, 0, this.addCommonColumnItem(150));
    this.initConfigPage()
    this.getDataList();
    // this.permission = this.canClickBtnMixin("coursemanagement-del") ? true : false;
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
      this.fileTypeList = dictionary('fileType');
      this.getSubjectlist();
      this.companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
      this.companyName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyName;
    },
    corporationChange() {
      this.sujectList = [];
      this.getSubjectlist();
    },
    getSubjectlist() {
      GetSubjectlist({
        pageNo: "",
        pageSize: "",
        corporationId: this.formInline.corporationId
      }).then((res) => {
        if (this.formInline.corporationId) {
          this.subjectList = res.data;
        } else {
          this.subjectListAll = res.data;
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      this.tableSpinning = true
      return GetCourseList(params).then((res) => {
        this.tableDataList = res.data.list;
        for (let i = 0; i < this.tableDataList.length; i++) {
          this.tableDataList[i].rowOrder = ((this.page.pageNo - 1) * this.page.pageSize) + i + 1;
        }
        this.page.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset();
      this.subjectList = [];
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 推送
    actionPushStaff(record) {
      if (record.status != 1) {
        return;
      }
      this.setRouterCode("partnerList");
      this.pushVisible = true;
      this.currentPushMsg = record;
      // this.$router.push({ name: "推送课程", params: { dataMsg: record } });
      this.changeLoadingTwo(false)
    },
    // 撤回
    actionRecall(record) {
    },
    // 改变上架状态
    changeStatus(record) {
      UpdateCourseStatus({
        companyCourseId: record.companyCourseId,
        status: record.status == 0 ? 1 : 0
      }).then((res) => {
        this.$antMessage.success("操作成功");
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        }
        this.formInline = {};
        this.preFormInline = {};
        this.getDataList()
      }).catch((err) => {
        console.log(err);
      })
    },
    // 查看
    actionLook(record) {
      this.$router.push({ name: "查看课程", params: { dataMsg: record } });
    },
    // 编辑
    actionEdit(record) {
      if (record.pushStatus == 2) {
        return;
      }
      this.$router.push({ name: "编辑课程", params: { dataMsg: record } });
    },
    // 删除
    actionDelete(record) {
      if (record.pushStatus == 2) {
        return;
      }
      if (!this.canClickBtnMixin("coursemanagement-del")) {
        return;
      }
      this.$antConfirm({
        title: '删除提示',
        content: '本操作不可恢复，确定继续？',
        cancelText: '取消',
        onOk: () => {
          DeleteCourse({
            courseId: record.courseId
          }).then(() => {
            this.$antMessage.success('删除成功');
            this.getDataList()
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },

    // 新增弹框按钮事件
    addCourse() {
      this.$router.push("/ehsGerneralManage/educationmanagement/addcourse");
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
    },
    pushCancle() {
      this.setRouterCode("coursemanagement");
      this.pushVisible = false;
    },
    pushConfirm() {
      this.checkedUserTitle = this.$refs.pushModal.checkedUserTitle;
      console.log('checkedUserTitle', this.checkedUserTitle);
      this.chooseStaffDetail = this.$refs.pushModal.chooseStaffDetail;
      this.chooseStaff = this.$refs.pushModal.chooseStaff;
      // console.log('chooseStaff', this.chooseStaff);
      this.userTreeData = cloneDeep(this.$refs.pushModal.userTreeData);
      for (let i = 0; i < this.checkedUserTitle.length; i++) {
        this.checkedUserTitle[i].deptName = this.findDeptName(this.userTreeData, this.checkedUserTitle[i].deptId);
      }
      // 内部
      let userList1 = cloneDeep(this.$refs.pushModal.checkedUserTitle);
      userList1.forEach(item => {
        item.userId = item.key
        item.userName = item.name
        item.userCode = item.workNum
      })
      let companyList1 = [];
      if (this.userTreeData[0]) {
        companyList1 = [{
          companyId: this.companyId,
          companyName: this.companyName,
          userList: [...userList1]
        }];
      }
      // 厂商
      let companyList2 = []
      let chooseStaffDetail = cloneDeep(this.$refs.pushModal.chooseStaffDetail);
      chooseStaffDetail.forEach(item => {
        item.userId = item.id
        item.userName = item.name
        item.deptName = ''
      })
      // console.log('chooseStaffDetail', this.chooseStaffDetail);
      for (let key in this.chooseStaff) {
        if (this.chooseStaff[key].selectedRowKeys.length > 0) {
          // let userList = [];
          // for (let i = 0; i < this.chooseStaff[key].selectedRowKeys.length; i++) {
          //   console.log(this.chooseStaff[key]);
          //   userList.push({
          //     userId: this.chooseStaff[key].selectedRowKeys[i].split("/")[1],
          //     userName: this.chooseStaff[key].selectedRowKeys[i].split("/")[2],
          //     deptName: ""
          //   })
          // }
          companyList2.push({
            companyId: key,
            companyName: this.chooseStaff[key].selectedRowKeys[0].split("/")[0],
            userList: chooseStaffDetail
          })
        }

      }
      if (this.checkedUserTitle.length == 0 && this.chooseStaffDetail.length == 0) {
        this.$antMessage.error("您还未选择推送人员");
        return;
      }

      if (companyList1.length && companyList1[0].userList && companyList1[0].userList.length) {
        let apiData = {
          companyId: companyList1[0].companyId,
          userIdList: companyList1[0].userList.map(item => item.userId).filter(item => item)
        }
        getInsidePeopleInfoApi(apiData)
          .then(res => {
            let deptIdRes = res.data || {}
            companyList1[0].userList.forEach(item => {
              item.deptId = deptIdRes[item.userId]?.deptId
            })
            PushCourseFn()
          })
          .catch(err => {
            PushCourseFn()
          })
      } else {
        // 变异步
        setTimeout(() => {
          PushCourseFn()
        });
      }
      this.handleLoadingTwo()
      // 推送接口
      const PushCourseFn = () => {
        console.log(companyList1, companyList2);
        PushCourse({
          centerId: this.currentPushMsg.centerId,
          corporationId: this.currentPushMsg.corporationId,
          corporationName: this.matchOrganizeName(this.currentPushMsg.corporationId),
          courseId: this.currentPushMsg.courseId,
          companyList: [
            ...companyList1,
            ...companyList2
          ]
        }).then((res) => {
          this.$antMessage.success("推送成功");
          this.pushCancle();
          this.getDataList();
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.cancelLoadingTwo()
        })
      }
    },
    findDeptName(userTreeData, deptId) {
      for (let i = 0; i < userTreeData.length; i++) {
        if (userTreeData[i].key == deptId) {
          return userTreeData[i].value;
        } else {
          if (userTreeData[i].children) {
            return this.findDeptName(userTreeData[i].children, deptId);
          }
        }
      }
    },
    findText(arr, key, val) { // key：字段值， val：过滤值
      if (val == 0) val = 0 + "";
      if (!(arr && key && val)) {
        return {};
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return arr[i];
        }
      }
      return {}
    },
  },
  destroyed() {
    this.setRouterCode("coursemanagement");
  }
}
</script>
<style lang="less" scoped>
.table-modal {
  /deep/ .ant-modal {
    width: 1200px !important;
    .clx-model-body {
      max-height: 700px;
      padding-bottom: 30px;
    }
    .pos-btn {
      bottom: 20px;
      width: 100%;
      background: #fff;
      padding-top: 20px;
    }
  }
}
</style>
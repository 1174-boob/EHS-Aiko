<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>考试管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="考试名称">
          <a-input v-model="formInline.name" placeholder="请输入考试名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.status" placeholder="请选择状态" allowClear>
            <a-select-option v-for="item in sujectList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
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
        <a-button type="dashed" @click="jumpAdd">
          <a-icon type="plus" />新建考试
        </a-button>
      </div>
    </DashBtn>
    <!-- 字典组列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="dictList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="customTitle">操作</div>
        <div slot="action" slot-scope="record" class="action">
          <a-button type="link" v-if="record.status =='2'" class="color-0067cc cursor-pointer" @click="publishAction(record)">发布</a-button>
          <a-button type="link" v-if="record.status !='2'" class="color-0067cc cursor-pointer" @click="pushStaff(record)">推送</a-button>
          <a-button type="link" class="color-0067cc cursor-pointer" @click="actionLook(record)">查看</a-button>
          <a-button type="link" class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change', record)" :disabled="record.status !='2'">编辑</a-button>
          <a-button type="link" class="color-0067cc cursor-pointer" @click="jumpLook(record)">预览</a-button>
          <!-- <a-button type="link" class="color-0067cc cursor-pointer" @click="downloadCode(record)">二维码</a-button> -->
          <a-button type="link" class="color-ff4d4f cursor-pointer" @click="deleteDict(record)">删除</a-button>
        </div>
      </a-table>
    </CommonTable>
    <!-- <CommonModal :title="'二维码'" :visible="QRcodeModelShow" :cancelFn="closeModel" class="principal-dialog">
      <div class="model-main" >
        <div class="qrcode" ref="imageWrapper">
          <img :src="coverImg" alt />
        </div>
      </div>
      <template slot="btn">
        <a-button class="m-l-15" type="primary" :loading="loading" @click="downloadBtn">下载</a-button>
      </template>
    </CommonModal> -->
    <CommonModal class="table-modal" title="推送" :visible="pushVisible" :cancelFn="pushCancle">
      <PushComponent ref="pushModal" :dataMsg="currentPushMsg"></PushComponent>
      <template slot="btn1">
        <a-button @click="pushCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="pushConfirm">确认推送</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dragTable from "@/mixin/dragTable.js";
import cancelLoading from "@/mixin/cancelLoading";
// import { formValidator } from "@/utils/clx-form-validator.js";
// import html2canvas from 'html2canvas'
import { debounce, cloneDeep } from "lodash";
import { getInsidePeopleInfoApi } from "@/services/api.js";
import {
  TestListPage,
  TestDelete,
  ExamPush,
  TestPublish,
} from "@/services/questionmodel.js";
import PushComponent from "@/pages/courseManagement/pushStaff.vue";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable,],
  components: { PushComponent },
  data() {
    return {
      // coverImg: '',
      // QRcodeModelShow: false,
      tableSpinning:false,
      // permission: false,
      dictTitle: "批量导入题目",
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      currentPushMsg: undefined,
      pushVisible: false,
      checkedUserTitle: undefined,
      chooseStaffDetail: undefined,
      itemForm: {
        dictValue: "", //字典标签
        dictLabel: "", //字典项名称
        dictSort: "", //排序号
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {
        name: "",
        status: undefined,
      },
      columns: [
        {
          title: "序号",
          dataIndex: "number",
          key: "number",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "考试名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          customRender: (text, record, index) => { return (record.status == '1' ? "已发布" : "未发布") },
        },
        {
          title: "创建人",
          dataIndex: "createUserName",
          key: "createUserName",
        },

        {
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 330, // 宽度根据操作自定义设置
        },
      ],
      dictList: [],
      sujectList: [
        //试卷分类
        { id: "1", name: "已发布" },
        { id: "2", name: "未发布" },
        // { id: "3", name: "已停用" },
      ],
      companyId: ""
    };
  },

  created() {
    this.setRouterCode("testManagement");
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.initConfigPage()
    // this.subjectsDataList(); //试卷分类列表
    this.getTabList(); // 获取列表
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
      sessionStorage.removeItem("savEexamData");
      sessionStorage.removeItem("examPathFrom");
      sessionStorage.removeItem("pathFrom");
      // this.permission = this.canClickBtnMixin("testManagement-del") ? true : false;
      this.companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
      this.companyName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyName;
    },
    //跳转新增、编辑页面
    jumpAddOrDetail(type, record) {
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/testManagementOne",
        query: { testId: record.testId },
      });
    },
    // 新建
    jumpAdd() {
      this.$router.push("/ehsGerneralManage/educationmanagement/testManagementOne");
    },
    // 预览
    jumpLook(record) {
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/resource/examinationLook",
        query: { paperId: record.paperId },
      });
    },
    pushConfirm() {
      this.checkedUserTitle = this.$refs.pushModal.checkedUserTitle;
      this.chooseStaffDetail = this.$refs.pushModal.chooseStaffDetail;
      this.chooseStaff = this.$refs.pushModal.chooseStaff;
      console.log(this.checkedUserTitle, this.chooseStaffDetail, this.$refs.pushModal.chooseStaff);
      this.userTreeData = cloneDeep(this.$refs.pushModal.userTreeData);
      for (let i = 0; i < this.checkedUserTitle.length; i++) {
        this.checkedUserTitle[i].deptName = this.findDeptName(this.userTreeData, this.checkedUserTitle[i].deptId);
      }
      // 内部
      let userList1 = cloneDeep(this.$refs.pushModal.checkedUserTitle);
      console.log('userListScc',userList1);
      userList1.forEach(item => {
        item.userId = item.key
        item.userName = item.name
        item.userCode = item.workNum
      })
      // let userList1 = [];
      // for (let i = 0; i < this.checkedUserTitle.length; i++) {
      //   userList1.push({
      //     userId: this.checkedUserTitle[i].key,
      //     userName: this.checkedUserTitle[i].name,
      //     deptName: this.checkedUserTitle[i].deptName,
      //     deptId: this.checkedUserTitle[i].deptId,
      //     workNum: this.checkedUserTitle[i].workNum,
      //   });
      // }
      let companyList1 = [{
        companyId: this.companyId,
        companyName: this.companyName,
        userList: [...userList1]
      }];
      let companyList2 = []
      for (let key in this.chooseStaff) {
        if (this.chooseStaff[key].selectedRowKeys.length > 0) {
          let userList = [];
          for (let i = 0; i < this.chooseStaff[key].selectedRowKeys.length; i++) {
            userList.push({
              userId: this.chooseStaff[key].selectedRowKeys[i].split("/")[1],
              userName: this.chooseStaff[key].selectedRowKeys[i].split("/")[2],
              deptName: ""
            })
          }
          companyList2.push({
            companyId: key,
            companyName: this.chooseStaff[key].selectedRowKeys[0].split("/")[0],
            userList: [...userList]
          })
        }

      }
      console.log(companyList1, companyList2);
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
            console.log('companyList1[0].userList',companyList1[0].userList);
            companyList1[0].userList.forEach(item => {
              item.deptId = deptIdRes[item.userId]?.deptId
            })
            ExamPush({
              examId: this.currentPushMsg.testId,
              companyList: [
                ...companyList1,
                ...companyList2
              ]
            }).then((res) => {
              this.$antMessage.success("推送成功");
              this.pushCancle();
            }).catch((err) => {
              console.log(err);
            })
          })
          .catch(err => {
            console.log(err);
            ExamPush({
              examId: this.currentPushMsg.testId,
              companyList: [
                ...companyList1,
                ...companyList2
              ]
            }).then((res) => {
              this.$antMessage.success("推送成功");
              this.pushCancle();
            }).catch((err) => {
              console.log(err);
            })
          })
      }
    },
    findDeptName(userTreeData, deptId) {
      console.log(userTreeData, deptId)
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
    // 推送
    pushStaff(record) {
      // console.log("推送。。。",record);
      this.pushVisible = true;
      this.currentPushMsg = record;
    },
    actionLook(record) {
      this.$router.push({ name: "查看考试", params: { dataMsg: record } });
    },
    pushCancle() {
      this.pushVisible = false;
    },
    // 发布
    publishAction(record) {
      const _this = this;
      this.$antConfirm({
        title: '确定发布吗？',
        onOk() {
          TestPublish({ testId: record.testId }).then(res => {
            if (res.code == 20000) {
              _this.$antMessage.success("发布成功");
              _this.getTabList()
            }
          }).catch(err => {
            console.log(err);
          })
        },
        onCancel() {
          _this.$antMessage.info('取消发布');
        },
      });
    },
    // 获取列表
    getTabList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      TestListPage(params)
      .then((res) => {
        // console.log("nnnnnnn",res);
        this.cancelLoading(100);
        this.dictList = res.data.list;
        this.page.total = res.data.total;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // downloadCode(record) {
    //   GetQrCode({ examId: record.testId }).then((res) => {
    //     this.QRcodeModelShow = true;
    //     this.coverImg = res.data;
    //   }).catch((err) => {
    //     console.log(err);
    //   }).finally(()=>{
        
    //   })
    // },
    // closeModel() {
    //   this.QRcodeModelShow = false;
    // },
    // downloadBtn() {
    //   // return
    //   html2canvas(this.$refs.imageWrapper).then((canvas) => {
		// 		let dataURL = canvas.toDataURL('image/png')
		// 		this.imgUrl = dataURL
		// 		var a = document.createElement('a') // 生成一个a元素
		// 		var event = new MouseEvent('click') // 创建一个单击事件
		// 		a.download = name || 'qrcode' // 设置图片名称
		// 		a.href = dataURL // 将生成的URL设置为a.href属性
		// 		a.dispatchEvent(event) // 触发a的单击事件
		// 	})
    // },
    // 删除
    deleteDict(record) {
      console.log("rr", record);
      if (!this.canClickBtnMixin("testManagement-del")) {
        return;
      }
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          TestDelete({
            testId: record.testId,
          })
            .then((res) => {
              _this.$antMessage.success(res.message);
              _this.getTabList();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {
          _this.$antMessage.info('取消删除');
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTabList();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTabList();
    },
    // 查询
    iSearch() {
      this.handleLoading();
      this.getTabList();
    },
    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.page = {
          pageNo: 1,
          pageSize: 10,
        };
        this.formInline = {
          name: "",
          status: undefined,
        };
        this.getTabList();
      },
      250,
      { leading: true, trailing: false }
    ),
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
.principal-dialog {
  ::v-deep .ant-modal {
    width: 600px !important;
    padding-bottom: 0px !important;
  }
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-main {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  .qrcode {
    width: 240px;
    padding: 20px;
    background: #fff;
    #qrcode {
      margin:0 auto;
      width:200px;
      height: 200px;
    }
  }
  
}
@media screen and (max-width: 1367px) {
  .model-main {
    min-height: 320px;
    .model-main-qr-img {
      width: 70%;
    }
  }
}
</style>
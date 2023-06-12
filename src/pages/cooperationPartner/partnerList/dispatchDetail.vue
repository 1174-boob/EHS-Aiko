<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="姓名">
          <a-input v-model="formInline.userName" placeholder="支持姓名模糊搜索"></a-input>
        </a-form-model-item>
        <a-form-model-item label="联系方式">
          <a-input v-model="formInline.phone" placeholder="支持联系方式模糊搜索"></a-input>
        </a-form-model-item>
        <a-form-model-item label="证件号码">
          <a-input v-model="formInline.idNumber" placeholder="支持证件号码模糊搜索"></a-input>
        </a-form-model-item>
        <a-form-model-item label="性别" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select v-model="formInline.sex" placeholder="全部" allowClear>
            <a-select-option v-for="item in gender" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
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
        <a-button type="dashed" class="m-r-15" @click="addCourseware">新建</a-button>
        <a-button type="dashed" class="m-r-15" @click="uploadTemplate">下载模板</a-button>
        <a-button type="dashed" class="m-r-15" @click="batchImport">批量导入</a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="userStatus" slot-scope="record">{{record.userStatus == 1 ? "禁用" : "启用"}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionPreview(record)">查看</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">学习记录</span>
          <span
            class="color-0067cc cursor-pointer"
            :class="{'color-red': record.userStatus == 1, 'color-green': record.userStatus != 1}"
            @click="actionChangeStatus(record)"
          >{{record.userStatus == 1 ? "启用" : "禁用"}}</span>
          <span class="color-ff4d4f cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    
    <CommonModal title="新增派工" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :rules="addFormRules"
          :model="addForm"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="姓名" prop="userName">
            <a-input v-model="addForm.userName" placeholder="请输入姓名" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="性别" prop="sex">
            <a-select v-model="addForm.sex" placeholder="全部" allowClear>
              <a-select-option v-for="item in gender" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="联系方式" prop="phone">
            <a-input v-model="addForm.phone" placeholder="请输入联系方式" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="证件号码" prop="idNumber">
            <a-input v-model="addForm.idNumber" placeholder="请输入证件号码" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="人员类型" prop="userType">
            <a-select v-model="addForm.userType" placeholder="请选择人员类型">
              <a-select-option v-for="item in userTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="附件">
            <div class="box">
              <UploadBtnStyle
                :action="actions"
                :showAcceptText="true"
                :accept="['.pptx','.pdf','.xls','.xlsx','doc','.docx']"
                :showUploadList="true"
                :btnText="'上传文件'"
                :btnType="'primary'"
                :btnIcon="false"
                @handleSuccess="globalUploadFileSuccess"
              ></UploadBtnStyle>
            </div>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="addConfirm">确认</a-button>
      </template>
    </CommonModal>
    <CommonModal title="编辑派工" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :rules="addFormRules"
          :model="editForm"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="姓名" prop="userName">
            <a-input v-model="editForm.userName" placeholder="请输入姓名" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="性别" prop="sex">
            <a-select v-model="editForm.sex" placeholder="全部" allowClear>
              <a-select-option v-for="item in gender" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="联系方式" prop="phone">
            <a-input v-model="editForm.phone" placeholder="请输入联系方式" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="证件号码" prop="idNumber">
            <a-input v-model="editForm.idNumber" placeholder="请输入证件号码" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="人员类型" prop="userType">
            <a-select v-model="editForm.userType" placeholder="请选择人员类型">
              <a-select-option v-for="item in userTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="附件">
            <div class="box">
              <UploadBtnStyle
                :action="actions"
                :showAcceptText="true"
                :accept="['.pptx','.pdf','.xls','.xlsx','doc','.docx']"
                :showUploadList="true"
                :btnText="'上传文件'"
                :btnType="'primary'"
                :btnIcon="false"
                :fileLists="editForm.fileIdList"
                @handleSuccess="globalUploadFileEditSuccess"
              ></UploadBtnStyle>
            </div>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm">确认</a-button>
      </template>
    </CommonModal>
    <CommonModal title="查看派工" :visible="detailVisible" :cancelFn="detailCancle">
      <template slot="form">
        <a-form-model
          :model="editForm"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="姓名" prop="userName">
            <a-input disabled v-model="currentMsg.userName" placeholder="请输入姓名" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="性别" prop="sex">
            <a-select disabled v-model="currentMsg.sex" placeholder="全部" allowClear>
              <a-select-option disabled v-for="item in gender" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="联系方式" prop="phone">
            <a-input disabled v-model="currentMsg.phone" placeholder="请输入联系方式" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="证件号码" prop="idNumber">
            <a-input disabled v-model="currentMsg.idNumber" placeholder="请输入证件号码" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="人员类型" prop="userType">
            <a-select disabled v-model="currentMsg.userType" placeholder="请选择人员类型">
              <a-select-option v-for="item in userTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="附件">
            <div class="box">
              <UploadBtnStyle
                :action="actions"
                :showAcceptText="true"
                :accept="['.pptx','.pdf','.xls','.xlsx','doc','.docx']"
                :showUploadList="true"
                :btnText="'上传文件'"
                :btnType="'primary'"
                :btnIcon="false"
                :fileLists="currentMsg.fileIdList"
                :onlyShow="true"
                @handleSuccess="globalUploadFileSuccess"
              ></UploadBtnStyle>
            </div>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
    <DownLoadAndUpload :data="loadData" :visible="loadVisible" @visible="closeVisible"></DownLoadAndUpload>
  </div>
</template>
<script>
import { GetDispatchList, updateDispatchByStatus ,GetUserMsg,GetDispatchPage, SelectDispatch, SaveDispatch, DeleteDispatch, UpdateDispatch, getDispatchRowDisabledDataApi } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import DownLoadAndUpload from "./component/downloadAndUpload.vue";
import dictionary from '@/utils/dictionary';
// 大文件分片上传
import Bus from '@/utils/bus.js';
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: { UploadBtnStyle ,DownLoadAndUpload},
  data() {
    return {
      actions: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/ehs-customer/api/file/uploadFile` : `ehs-customer/api/file/uploadFile`,
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      addVisible: false,
      addForm: {},
      editForm: {
        fileIdList:[]
      },
      editVisible: false,
      newFile: {
        id: undefined,
      },
      oldFile: {
        id: undefined,
      },
      loadData: {
        companyId: '',
        corporationId: '',
        corporationName: '',
      },
      currentMsg: {
        fileIdList:[]
      },
      userTypeList:[],
      addFileList: [],
      editFileList: [],
      dataMsg: undefined,
      loadVisible: false,
      detailVisible: false,
      companyId: "",
      formInline: {},
      preFormInline: {},
      formDict: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 表单验证
      addFormRules: {
        userName: [
          { required: true, message: "姓名不能为空", trigger: "change" },
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'change' },
        ],
        phone: [
          { required: true, message: '联系方式不能为空', trigger: 'change' },
        ],
        idNumber: [
          { required: true, message: '证件号码不能为空', trigger: 'change' },
        ],
        userType: [
          { required: true, message: '人员类型不能为空', trigger: 'change' },
        ]
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
        },
        {
          title: '证件号码',
          dataIndex: 'idNumber',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          customRender: (text) => {
            if(text== 1){
              return text ='男'
            }else {
              return text ='女'
            }
          },
        },
        {
          title: '人员类型',
          dataIndex: 'userType',
          customRender: (text, record, index) => {
            return this.formDict[text] ? this.formDict[text] : "--";
          },
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'userStatus' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 400 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
    }
  },
  computed:{
    gender() {
      const gender = dictionary('sex');
      return gender
    },
  },
  created() {
    this.form()
    this.companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
    this.dataMsg = this.$route.query.dataMsg;
    if (!this.dataMsg) {
      this.$router.push("/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerList");
      return;
    }
    this.userTypeList = this.getDictItemList("user_type");
    this.getDataList();
  },
  mounted() {
    // 文件选择后的回调
    Bus.$on('globalUploadFileAdd', this.globalUploadFileAdd);
    // 文件上传成功的回调
    Bus.$on('globalUploadFileSuccess', this.globalUploadFileSuccess);
    Bus.$on('globalUploadFileSuccess', this.globalUploadFileEditSuccess);
    
    // 文件上传失败的回调
    Bus.$on('globalUploadFileError', this.globalUploadFileError);
    // 文件删除的回调
    Bus.$on('globalUploadFileRemove', this.globalUploadFileRemove);
  },
  methods: {
    form() { //从字典组里获取人员类型
      const dict = this.$store.state.setting.dictTypeData;
      const form = dict.find(item => {
        return item.dictType == 'user_type';
      });
      form.dictItem.forEach(ele => {
        this.$set(this.formDict, ele.dictValue, ele.dictLabel);
      });
      return form.dictItem; //字典项
    },
    // 批量导入
    batchImport(){
      this.loadVisible = true;
      this.loadData.companyId = this.dataMsg.companyCode;
      this.loadData.corporationId = this.dataMsg.corporationId;
      this.loadData.corporationName = this.dataMsg.corporationName;
    },
    closeVisible(value) {
      this.loadVisible = value
      this.getDataList()
    },
    // 文件上传成功的回调
    globalUploadFileSuccess(res) {
      console.log(res)
      this.newFile = res.length ? { ...res[0] } : {}
      this.addFileList.push({ ...this.newFile });
    },
    // 文件上传成功的回调
    globalUploadFileEditSuccess(res) {
      console.log(res)
      this.oldFile = res.length ? { ...res[0] } : {}
      this.editFileList.push({ ...this.oldFile });
    },
    // 下载模板
    uploadTemplate() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/相关方派工导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/相关方派工导入模板.xlsx`)
    },
    // 已被派工列表
    getDataList() {
      return GetDispatchList({
        companyId: this.dataMsg.companyCode,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.formInline
      }).then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
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
    findText(arr, key, val) { // key：字段值， val：过滤值
      if (val == 0) val = 0 + "";
      if (!(arr && key && val)) {
        return {};
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return arr[i]
        }
      }
      return {}
    },
    addConfirm(){
      const fileIds= this.addFileList.map(file => file.id)
      let param = {
        fileIds: fileIds,
        ...this.addForm
      };
      console.log('this.dataMsg',this.dataMsg);
      let apiData = {
        enterpriseDispatchVo: param,
        companyId: this.dataMsg.companyCode,
        companyName: this.dataMsg.companyName,
        corporationId: this.dataMsg.corporationId,
        corporationName: this.dataMsg.corporationName,
      }
      console.log('apiData',apiData);
      SaveDispatch(apiData)
      .then(res => {
          this.$antMessage.success("新增成功");
          this.addVisible = false;
          this.getDataList();
        })
        .catch(err => {
          console.log(err);
        })
    },
    editConfirm(){
      const fileIds= this.editFileList.map(file => file.id)
      let param = {
        userName:this.editForm.userName,
        sex:this.editForm.sex,
        phone:this.editForm.phone,
        idNumber:this.editForm.idNumber,
        userType:this.editForm.userType,
        fileIds: fileIds,
        dispatchId: this.dispatchId,
      };
      let apiData = {
        enterpriseDispatchVo: param,
        companyId: this.dataMsg.companyCode,
        companyName: this.dataMsg.companyName,
        corporationId: this.dataMsg.corporationId,
        corporationName: this.dataMsg.corporationName,
      }
      UpdateDispatch(apiData)
      .then(res => {
        this.$antMessage.success("编辑成功");
        this.editVisible = false;
        this.getDataList();
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 新增弹框按钮事件
    addCourseware() {
      this.addFileList = [];
      this.editForm = {};
      this.addVisible = true;
    },
    // 查看
    actionPreview(record) {
      GetUserMsg({
        dispatchId: record.dispatchId,
      }).then(res => {
        this.currentMsg = res.data;
        let iFrom = res.data
        // 资料附件-回显
        this.currentMsg.fileIds = this.handleFileIdS(iFrom.fileList)
        this.currentMsg.fileIdList = this.handleFileRedisplay(iFrom.fileList)
      }).catch((err) => {
        console.log(err);
      })
      this.detailVisible = true;
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? list : []
      let ids = list.map(item => {
        return item.id
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplay(list) {
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.uid = item.id
        item.name = item.sourceFileName
        item.status = 'done'
        item.url = item.filePath
      })
      return fileList
    },
    // 编辑
    actionEdit(record) {
      this.dispatchId = record.dispatchId
      GetUserMsg({
        dispatchId: record.dispatchId,
      }).then(res => {
        this.editForm = res.data;
        let iFrom = res.data
        // 资料附件-回显
        this.editForm.fileIds = this.handleFileIdS(iFrom.fileList)
        this.editForm.fileIdList = this.handleFileRedisplay(iFrom.fileList)
      }).catch((err) => {
        console.log(err);
      })
      this.editVisible = true;
    },
    // 删除
    actionDelete(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return DeleteDispatch({ dispatchId: record.dispatchId })
            .then(res => {
              this.$antMessage.success("操作成功");
              this.getDataList();
            })
            .catch(err => { })
        },
      });
    },
    // 新增弹框取消
    addCancle() {
      this.addForm = {};
      this.addVisible = false;
      this.addFileList = [];
    },
    editCancle() {
      this.editForm = {};
      this.editVisible = false;
    },
    // 查看弹框按钮事件
    detailCancle() {
      this.detailVisible = false;
    },
    // 学习记录
    actionLook(record) {
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/learn", query: { beUserId: record.dispatchId, companyId: record.companyId, centerId: record.centerId, corporationId: record.corporationId, pushCompanyId: record.beCompanyId }});
    },
    // 改变禁用启用状态
    actionChangeStatus(record) {
      // 调接口，修改状态
      updateDispatchByStatus({
        dispatchId: record.dispatchId,
        userStatus: record.userStatus == 1 ? "0" : "1"
      }).then(res => {
        this.getDataList();
      }).catch(err => {
        console.log(err);
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
    },
  }
}
</script>
<style lang="less" scoped>
.course-info {
  img {
    width: 160px;
    height: 120px;
  }
  p {
    line-height: 1;
    margin: 0;
    &:last-child {
      margin-top: 10px;
    }
  }
}
.course-msg {
  .lecturer-list {
    img {
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
}
.color-red {
  color: red;
}
.color-green {
  color: green;
}
</style>
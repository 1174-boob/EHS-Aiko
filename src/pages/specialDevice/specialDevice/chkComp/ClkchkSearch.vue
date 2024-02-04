<template>
  <div>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="检查日期">
          <a-range-picker
            format="YYYY-MM-DD"
            v-model="formInline.checkDate"
            :placeholder="['开始日期', '结束日期']"
          />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="getDataList"
            >查询</a-button
          >
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" v-if="(chkType == '1'|| chkType == '2') && (equipmentCategory == '1' || equipmentType == '1'|| equipmentType == '3'|| equipmentType == '4')" @click="dayAndMonthAdd">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" v-if="chkType == '3' && equipmentCategory == '1'" @click="yearAdd">
          分配人员
        </a-button>
        <a-button type="dashed" v-if="chkType == '4' && (equipmentCategory == '1' || equipmentType == '1'|| equipmentType == '3'|| equipmentType == '4')" @click="selfAdd">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" v-if="chkType != '4' && (equipmentCategory == '1' || equipmentType == '1'|| equipmentType == '3'|| equipmentType == '4')" @click="configurationChecklist">
          配置点检表
        </a-button>
        <a-button type="dashed" v-if="(chkType == '1'|| chkType == '2' || chkType == '3') && equipmentCategory == '2'" @click="outAdd">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" v-if="chkType == '4' && equipmentCategory == '2'" @click="outAddSelf">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :data-source="tableDataList" :rowKey="(record, index)=>{return record.checkId}" :pagination="false">
        <div slot="checkNum" slot-scope="record">{{ record.checkNum }}</div>
        <div slot="checkDate" slot-scope="record">{{ record.checkDate }}</div>
        <div slot="checkUserId" slot-scope="record"> {{ equipmentType != '4' ? record.checkUserName == null ? '' : ((record.checkUserName == null ? '' :record.checkUserName) + '/'+ (record.checkUserJobNumber == null ? '' : record.checkUserJobNumber)) : (record.checkUser == null ? '/' : record.checkUser) }}</div>
        <div slot="status" slot-scope="record">{{ getStatus(record.status) }}</div>
        <div slot="createTime" slot-scope="record">{{ record.createTime }}</div>
        <div class="specDiv" slot="action" slot-scope="record">
          <div v-if="equipmentCategory == '1' || equipmentType == '1'|| equipmentType == '3'|| equipmentType == '4'">
            <span class="color-0067cc cursor-pointer" v-show="chkType=='1' || chkType=='2' " v-if="record.status == '1' || record.status == '2'" @click="dayAndMonthAdd(record)">点检</span>
            <span class="color-0067cc cursor-pointer" v-show="chkType=='3'" v-if="record.status == '1' || record.status == '2'" @click="yearNew(record)">点检</span>
            <span class="color-0067cc cursor-pointer changeBtn changeSpec1" v-if="chkType!='4' && record && record.gatherFile==null" @click="uploadSend(record)">
              <UploadBtnStyle
                :accept="['.doc','.docx','.xls','.xlsx','.ppt','.pdf']"
                :showAcceptText="false"
                :showUploadList="false"
                :maxSize="20"
                :limit="20"
                @handleSuccess="handleSuccessList"
              ></UploadBtnStyle>
            </span>
            <span class="color-0067cc cursor-pointer changeBtn changeSpec2" v-if="chkType!='4' && record && record.gatherFile!=null" @click="uploadSend(record)">
              <UploadBtnStyle
                :accept="['.doc','.docx','.xls','.xlsx','.ppt','.pdf']"
                :showAcceptText="false"
                :showUploadList="false"
                :maxSize="20"
                :limit="20"
                @handleSuccess="handleSuccessList"
              ></UploadBtnStyle>
            </span>
            <span class="color-0067cc cursor-pointer" v-show="chkType!='4'" @click="goDetail(record)">查看</span>
            <span class="color-0067cc cursor-pointer" v-show="chkType=='4'" @click="selfEdit(record)">编辑</span>
            <span class="color-ff4d4f cursor-pointer" @click="reSend(record)">删除</span>
          </div>
          <div v-if="equipmentCategory == '2'">
            <span class="color-0067cc cursor-pointer" v-if="chkType != '4'" @click="outEdit(record)">编辑</span>
            <span class="color-0067cc cursor-pointer" v-if="chkType == '4'" @click="outSelfEdit(record)">编辑</span>
            <span class="color-ff4d4f cursor-pointer" @click="reSend(record)">删除</span>
          </div>
        </div>
      </a-table>
    </CommonTable>

    <!-- 新增年度分配人员弹框 -->
    <CommonModal :title="titleYearText" :visible="addYearVisible" :cancelFn="addYearCancle">
      <template slot="form">
        <a-form-model
          ref="addYearForm"
          :model="addYearForm"
          :rules="addYearFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="检查年度" prop="year">
            <a-date-picker v-model="addYearForm.year" mode="year" format="YYYY" valueFormat="YYYY" @panelChange="yearChange" />
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'checkUserId'"
            :treeRoles="addYearFormRules"
            :labelTitle="'分配安全管理员'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="addYearForm.checkUserId"
          />
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addYearCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="addYearConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>

    <!-- 新增编辑年度自检弹框 (内部)-->
    <CommonModal :title="titleText" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="检查日期" prop="checkDate">
            <a-date-picker v-model="editForm.checkDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'checkUserId'"
            :treeRoles="editFormRules"
            :labelTitle="'安全管理员'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingTwo"
            :checkedTreeNode="editForm.checkUserId"
          />
          <a-form-model-item class="flex" label="自评报告" prop="certFileIdList">
            <UploadBtnStyle
              :accept="['.doc','.docx','.xls','.xlsx','.ppt','.pdf']"
              :fileLists="editForm.echoAttachmentList"
              :maxSize="20"
              :limit="1"
              @handleSuccess="handleSuccessReferencesAttachmentInside"
            ></UploadBtnStyle>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>

    <!-- 新增编辑非自检弹框 (外部)-->
    <CommonModal :title="outTitleText" :visible="outVisible" :cancelFn="outCancle">
      <template slot="form">
        <a-form-model
          ref="outForm"
          :model="outForm"
          :rules="outFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="检查日期" prop="checkDate">
            <a-date-picker v-model="outForm.checkDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
          </a-form-model-item>
          <a-form-model-item class="flex" :label="outUploadTitle" prop="certFileIdList">
            <UploadBtnStyle
              :accept="['.doc','.docx','.xls','.xlsx','.ppt','.pdf']"
              :fileLists="outForm.echoAttachmentList"
              :maxSize="20"
              :limit="1"
              @handleSuccess="handleSuccessReferencesAttachment"
            ></UploadBtnStyle>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="outCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="outConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>

    
  </div>
</template>

<script>
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js"
import moment from 'moment'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import StaffOrDept from "@/components/staffOrDept";
import { checkPageList, checkInsertTask, checkUpdate ,checkDelete} from "@/services/deviceSafety.js"

export default {
  name: "ClkchkSearch",
  props: {
    chkType: {
      type: String,
      default: "1",
    },
    equipmentType: {
      type: String,
      default: "",
    },
    equipmentCategory: {
      type: String,
      default: "",
    },
    equipmentId: {
      type: String,
      default: "",
    },
    equipmentName: {
      type: String,
      default: "",
    },
    equipmentCode: {
      type: String,
      default: "",
    },
    equipmentLocation: {
      type: String,
      default: "",
    },
    forkliftPlateNum: {
      type: String,
      default: "",
    },
  },
  components: { StaffOrDept,UploadBtnStyle},
  data() {
    return {
      formInline: {
        checkDate: [],
      },
      titleYearText: "新增",
      titleText: "新增",
      outTitleText: "新增",
      outUploadTitle:'点检表',
      editForm: {
        checkDate:'',
        certFileIdList: undefined,
        echoAttachmentList: [],
      },
      outForm: {
        checkDate:'',
        certFileIdList: undefined,
        echoAttachmentList: [],
      },
      ListForm: {
        certFileIdList: undefined,
      },
      // 表单验证
      editFormRules: {
        checkDate: [
          { required: true, message: "检查日期不能为空", trigger: "change" },
        ],
        checkUserId: [
          { required: true, message: "安全管理员不能为空", trigger: "change" },
        ]
      },
      outFormRules: {
        checkDate: [
          { required: true, message: "检查日期不能为空", trigger: "change" },
        ],
      },
      addYearVisible: false,
      addVisible: false,
      outVisible: false,
      tableSpinning: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表单验证
      addYearFormRules: {
        checkUserId: [
          { required: true, message: "安全管理员不能为空", trigger: "change" },
        ],
        year: [
          { required: true, message: "检查年度不能为空", trigger: "change" },
        ],
      },
      addYearForm: {
        year: moment(new Date()).format('YYYY')
      },
      tableDataList: [],
      columns: [
        {
          title: "序号",
          scopedSlots: { customRender: 'checkNum' },
          align: "center",
        },
        {
          title: "检查日期",
          scopedSlots: { customRender: 'checkDate' },
          align: "center",
        },
        {
          title: "创建人",
          scopedSlots: { customRender: 'checkUserId' },
          align: "center",
        },
        {
          title: "检查者",
          scopedSlots: { customRender: 'checkUserId' },
          align: "center",
        },
        {
          title: "安全管理人员",
          scopedSlots: { customRender: 'checkUserId' },
          align: "center",
        },
        {
          title: "状态",
          scopedSlots: { customRender: 'status' },
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
        },
        {
          title: '点检表',
          dataIndex:'gatherFile',
          align: "center",
          customRender: (fileList, record) => {
            return fileList ? (
              <a-popover autoAdjustOverflow title="查看点检表">
                <div slot="content" style={{ display: 'flex', flexDirection: 'column' }}>
                  {(
                    <a key={fileList.id} href={fileList.filePath} onClick={(e) => {
                      e.preventDefault(); // 阻止默认的链接跳转行为
                      window.open(fileList.filePath, '_blank'); // 在新窗口中打开链接
                    }}>{fileList.sourceFileName}</a>
                  )}
                </div>
                <div style={{ color: "#0067cc"}}>
                  查看点检表
                </div>
              </a-popover>
            ) : (
              <div>/</div>
            );
          },
          width: 150,
        },
        {
          title: '自检报告',
          dataIndex:'gatherFile',
          align: "center",
          customRender: (fileList, record) => {
            return fileList ? (
              <a-popover autoAdjustOverflow title="查看自检报告">
                <div slot="content" style={{ display: 'flex', flexDirection: 'column' }}>
                  {(
                    <a key={fileList.id} href={fileList.filePath} onClick={(e) => {
                      e.preventDefault(); // 阻止默认的链接跳转行为
                      window.open(fileList.filePath, '_blank'); // 在新窗口中打开链接
                    }}>{fileList.sourceFileName}</a>
                  )}
                </div>
                <div style={{ color: "#0067cc"}}>
                  查看自检报告
                </div>
              </a-popover>
            ) : (
              <div>/</div>
            );
          },
          width: 150,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 230, // 宽度根据操作自定义设置
        },
      ],
      dayTableDataList: [],
      loading: false,
      uploadFileObj:{}
    };
  },
  created(){
    this.getDataList()
    console.log(this.equipmentType,'设备类型');
    console.log('this.equipmentCategory',this.equipmentCategory);
    if(this.equipmentCategory == '1' || this.equipmentType == '1' || this.equipmentType == '3' || this.equipmentType == '4' ){
      if((this.chkType=='1' ||this.chkType== '2')){
        this.columns.splice(2, 1);
        this.columns.splice(3, 1);
        this.columns.splice(6, 1);
      }else if(this.chkType=='3'){
        this.columns.splice(2, 1);
        this.columns.splice(2, 1);
        this.columns.splice(6, 1);
      } else if (this.chkType=='4') {
        this.columns.splice(2, 1);
        this.columns.splice(2, 1);
        this.columns.splice(3, 1);
        this.columns.splice(4, 1);
      }
    }
    if(this.equipmentCategory == '2'){
      if (((this.chkType=='1' ||this.chkType== '2'|| this.chkType== '3'))){
        this.columns.splice(3, 1);
        this.columns.splice(3, 1);
        this.columns.splice(6, 1);
      } else if (this.chkType=='4'){
        this.columns.splice(3, 1);
        this.columns.splice(3, 1);
        this.columns.splice(3, 1);
        this.columns.splice(4, 1);
      }
    }
  },
  methods: {
    yearChange(val) {
      this.$set(this.addYearForm, "year", val.format('YYYY'));
    },
    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },
    //获取工号
    getWorkNum(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeCode);
        }
      }
      return listName;
    },

    //安全管理员-年度
    personThingOne(data) {
      this.addYearForm.checkUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.addYearForm.checkUserName = this.getName(list);
      this.addYearForm.checkUserJobNumber = this.getWorkNum(list);
    },
    //安全管理员-年度自检
    personThingTwo(data) {
      this.editForm.checkUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.checkUserName = this.getName(list);
      this.editForm.checkUserJobNumber = this.getWorkNum(list);
    },
    // 状态 （1-待点检，2-点检中，3-点检完成）
    getStatus(num) {
      if(num == 1){
        return '待点检'
      } else if (num == 2){
        return '点检中'
      } else if (num == 3){
        return '点检完成'
      }
    },
    // 查询
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        equipId: this.equipmentId,
        checkType: this.chkType,
      }
      if (this.formInline.checkDate && this.formInline.checkDate.length > 1) {
        params.startDate = moment(this.formInline.checkDate[0]).format('YYYY-MM-DD')
        params.endDate = moment(this.formInline.checkDate[1]).format('YYYY-MM-DD')
      }
      this.tableSpinning = true
      return checkPageList(params)
        .then(res => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableDataList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getDataList();
          }
        })
        .finally(() => {
          this.tableSpinning = false
        })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        checkDate: [],
      }
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    // 新增和点检（日常和月份）
    dayAndMonthAdd(row) {
      if(this.chkType && this.chkType != '4') {
        let path = ''
        switch (this.chkType) {
          case '1':
            path = '/safeManage/deviceSafeManage/specialDevice/clkchkDayNew'
            break
          case '2':
            path = '/safeManage/deviceSafeManage/specialDevice/clkchkMonthNew'
            break
        }
        this.setKeepalive(true)
        this.$router.push({
          path: path,
          query: { 
            row: row ? row : null,
            checkType: this.chkType,
            equipId: this.equipmentId,
            equipType:this.equipmentType,
            equipmentName: this.equipmentName,
            equipmentCode: this.equipmentCode,
            equipmentLocation: this.equipmentLocation,
            forkliftPlateNum: this.forkliftPlateNum? this.forkliftPlateNum:null
          }
        })
      }
    },
    // 查看页面
    goDetail(row) {
      console.log('0-内部-厂内专用，2-外部-厂内专用，3-起重机械，4-压力管道，5-压力容器） =>',this.equipmentType)
      if(this.chkType && this.chkType != '4') {
        let path = ''
        switch (this.chkType) {
          case '1':
            path = '/safeManage/deviceSafeManage/specialDevice/clkchkDayDetail'
            break
          case '2':
            path = '/safeManage/deviceSafeManage/specialDevice/clkchkMonthDetail'
            break
          case '3':
            path = '/safeManage/deviceSafeManage/specialDevice/clkchkYearDetail'
            break
        }
        this.setKeepalive(true)
        this.$router.push({
          path: path,
          query: { 
            row: row ? row : null,
          }
        })
      }
    },
    // 年度分配人员
    yearAdd(){
      console.log('年度分配人员');
      this.titleYearText = '新增'
      this.addYearVisible = true;
    },
    // 年度点检
    yearNew(row){
      console.log('年度点检');
      this.setKeepalive(true)
      this.$router.push({
        path: '/safeManage/deviceSafeManage/specialDevice/clkchkYearNew',
        query: { 
          row: row ? row : null,
          checkType: this.chkType,
          equipId: this.equipmentId,
          equipType:this.equipmentType,
          equipmentName: this.equipmentName,
          equipmentCode: this.equipmentCode,
          equipmentLocation: this.equipmentLocation,
          forkliftPlateNum: this.forkliftPlateNum? this.forkliftPlateNum:null
        }
      })
    },
    // 点击取消按钮
    addYearCancle() {
      this.addYearVisible = false;
      this.addYearForm = {};
    },
    // 年度新增弹框-确定
    addYearConfirm() {
      if (!formValidator.formAll(this, "addYearForm")) {
        return;
      }
      if(this.addYearForm.checkUserId.length > 1){
        this.$antMessage.warn('只能选择一名安全管理员！');
        return
      }
      console.log('想要提交的数据addYearForm',this.addYearForm);
      let params = {
        checkType: this.chkType,
        equipId: this.equipmentId,
        ...this.addYearForm
      };
      params.checkUserId = this.addYearForm.checkUserId.toString();
      params.checkUserJobNumber = this.addYearForm.checkUserJobNumber.toString();
      params.checkUserName = this.addYearForm.checkUserName.toString();
      checkInsertTask(params)
        .then(() => {
          this.$antMessage.success(this.titleYearText + "成功");
          this.addYearVisible = false;
          this.addYearForm = {};
        })
        .catch((err) => console.log(err))
        .finally(()=>{
          this.getDataList()
        })
    },
    // 年度自评
    selfAdd() {
      console.log('年度自评');
      this.titleText = '新增'
      this.addVisible = true;
    },
    outAdd(){
      console.log('outAdd');
      this.outTitleText = '新增'
      this.outUploadTitle = "点检表"
      this.outVisible = true;
    },
    outAddSelf(){
      console.log('outAddSelf');
      this.outTitleText = '新增'
      this.outUploadTitle = "自评报告"
      this.outVisible = true;
    },
    // 内部年度自检新增弹框-确定
    editConfirm() {
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      if(this.editForm.checkUserId.length > 1){
        this.$antMessage.warn('只能选择一名安全管理员！');
        return
      }
      if(this.editForm.certFileIdList && this.editForm.certFileIdList.length > 1){
        this.$antMessage.warn('只能上传一份自检报告！');
        return
      }
      let params = {
        checkType: this.chkType,
        equipId: this.equipmentId,
        checkId :this.uploadFileObj.checkId,
        ...this.editForm
      };
      params.checkUserId = this.editForm.checkUserId.toString();
      params.checkUserJobNumber = this.editForm.checkUserJobNumber.toString();
      params.checkUserName = this.editForm.checkUserName.toString();
      params.fileId = this.editForm.certFileIdList ? this.editForm.certFileIdList[0]: null
      
      let promiseFn = this.uploadFileObj.checkId != null? checkUpdate:checkInsertTask
      promiseFn(params)
        .then(() => {
          this.$antMessage.success(this.titleText + "成功");
          this.addVisible = false;
          this.editForm = {};
        })
        .catch((err) => console.log(err))
        .finally(()=>{
          this.getDataList()
        })
    },

    // 外部非自检新增弹框-确定
    outConfirm() {
      if (!formValidator.formAll(this, "outForm")) {
        return;
      }
      console.log(this.outForm.certFileIdList);
      if(this.outForm.certFileIdList == undefined){
        this.$antMessage.warn('请上传一份文件！');
        return
      }
      let params = {
        checkType: this.chkType,
        equipId: this.equipmentId,
        checkId :this.uploadFileObj.checkId,
        ...this.outForm
      };
      params.fileId = this.outForm.certFileIdList[0] ? this.outForm.certFileIdList[0]: null
      let promiseFn = this.uploadFileObj.checkId != null? checkUpdate:checkInsertTask
      promiseFn(params)
        .then(() => {
          this.$antMessage.success(this.outTitleText + "成功");
          this.outVisible = false;
          this.outForm = {};
        })
        .catch((err) => console.log(err))
        .finally(()=>{
          this.getDataList()
        })
    },

    // 年度自评-编辑
    selfEdit(row) {
      this.titleText = '编辑'
      this.uploadFileObj = row
      this.addVisible = true;
      this.editForm.checkDate = row.checkDate
      console.log(row.checkDate);
      this.editForm.checkUserId = [row.checkUserId]
      this.editForm.checkUserName = [row.checkUserName]
      this.editForm.checkUserJobNumber = [row.checkUserJobNumber]
      this.editForm.certFileIdList = this.handleFileIdS(row.gatherFile)
      this.editForm.echoAttachmentList = this.handleFileRedisplay(row.gatherFile)
    },
    // 外部非自检-编辑
    outEdit(row) {
      this.outTitleText = '编辑'
      this.outUploadTitle = "点检表"
      this.uploadFileObj = row
      this.outVisible = true;
      this.outForm.checkDate = row.checkDate
      this.outForm.certFileIdList = this.handleFileIdS(row.gatherFile)
      this.outForm.echoAttachmentList = this.handleFileRedisplay(row.gatherFile)
    },
    outSelfEdit(row){
      this.outTitleText = '编辑'
      this.outUploadTitle = "自评报告"
      this.uploadFileObj = row
      this.outVisible = true;
      this.outForm.checkDate = row.checkDate
      this.outForm.certFileIdList = this.handleFileIdS(row.gatherFile)
      this.outForm.echoAttachmentList = this.handleFileRedisplay(row.gatherFile)
    },
    // 自评-文件上传
    handleSuccessReferencesAttachmentInside(fileList) {
      console.log('打印一下',fileList);
      this.editForm.certFileIdList = fileList.map(item => {
        return item.id
      })
      this.editForm.certFileNameList = fileList.map(item => {
        return item.name
      })
      this.editForm.certFileUrlList = fileList.map(item => {
        return item.url
      })
    },
    // 外部非自检
    handleSuccessReferencesAttachment(fileList) {
      console.log('打印一下',fileList);
      this.outForm.certFileIdList = fileList.map(item => {
        return item.id
      })
      this.outForm.certFileNameList = fileList.map(item => {
        return item.name
      })
      this.outForm.certFileUrlList = fileList.map(item => {
        return item.url
      })
    },

    // 列表文件上传
    handleSuccessList(fileList) {
      console.log('打印一下',fileList);
      this.ListForm.certFileIdList = fileList.map(item => {
        return item.id
      })
      let params = {
        checkType: this.chkType,
        equipId: this.equipmentId,
        checkId :this.uploadFileObj.checkId,
        checkUserId:this.uploadFileObj.checkUserId,
        checkUserName:this.uploadFileObj.checkUserName,
        checkUserJobNumber:this.uploadFileObj.checkUserJobNumber,
        checkDate:this.uploadFileObj.checkDate,
      }
      if(this.ListForm.certFileIdList.length > 1){
        params.fileId = this.ListForm.certFileIdList[this.ListForm.certFileIdList.length-1]
      } else {
        params.fileId = this.ListForm.certFileIdList[0]
      } 
      console.log('params',params);
      checkUpdate(params).then((res) => {
        console.log(res,8999);
        this.uploadFileObj = {};
        // this.ListForm.certFileIdList = []
      })
      .catch((err) => console.log(err))
      .finally(()=>{
        this.getDataList()
      })
    },
    // 列表上传
    uploadSend(row) {
      console.log(row,'----');
      this.uploadFileObj = row
      console.log('点检666');
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? [list] : []
      let ids = list.map(item => {
        return item.id
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplay(list) {
      list = list ? [list]: []
      let fileList = []
      list.forEach(item => {
        let itemObj = {
          id: item.id,
          uid: item.id,
          name: item.sourceFileName,
          status: 'done',
          url: item.filePath,
        }
        fileList.push(itemObj)
      })
      return fileList
    },
    // 年度自评点击取消按钮
    addCancle() {
      this.addVisible = false;
      this.editForm = {};
      this.uploadFileObj = {}
    },
    outCancle() {
      this.outVisible = false;
      this.outForm = {};
      this.uploadFileObj = {}
    },
    configurationChecklist() {
      this.setKeepalive(true)
      console.log('配置点检表');
      this.$router.push({
        path: "/safeManage/deviceSafeManage/specialDevice/configurationChecklist",
        query: { checkType: this.chkType, equipType:this.equipmentType }, // 点检类型 设备类型
      });
    },
    // 删除
    reSend(row){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           checkId:row.checkId
          }
          await checkDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.specDiv {
  height: 45px;
  padding-top: 5px;
}

::v-deep .ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px solid #f0f0f0;
}
    
.changeBtn {
  ::v-deep .ant-btn{
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    font-size: 14px !important;
    color: #0067cc !important;
    text-decoration: underline !important;
    cursor: pointer !important; 
  }
  ::v-deep .anticon.anticon-upload {
    display: none;
  }
  ::v-deep .anticon-check:hover {
    border-color: #0067cc;
    transition: border-color .5s linear;
  }
}
.changeSpec1 {
  ::v-deep .ant-btn{
    span{
      font-size: .1px;
    }
    span::after {
      content: "上传点检表";
      font-size: 14px;
    }
  }
}
.changeSpec2 {
  ::v-deep .ant-btn{
    span{
      font-size: .1px;
    }
    span::after {
      content: "更新点检表";
      font-size: 14px;
    }
  }
}
</style>
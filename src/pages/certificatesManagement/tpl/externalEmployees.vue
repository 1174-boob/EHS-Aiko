<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="false"></CommonSearchItem>
        <a-form-model-item label="证书类型">
          <a-select allowClear show-search v-model="formInline.certTypeId" placeholder="请选择证书类型">
            <a-select-option v-for="item in certificateList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="厂商名称">
          <a-input v-model="formInline.manufacturerName" placeholder="请输入厂商名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="有效期限">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.validityPeriod" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="pe-data-container">
      <div>
        <div @click="changeTab(0)" class="pe-data-item total-pe-num" :class="[curIndex === 0 ? 'active' : '']">
          <span class="pe-data-body">证书总数 {{countInfo.total}} 张</span>
          <p class="en-illus">certificate total quantity</p>
          <i></i>
        </div>
        <div @click="changeTab(1)" class="pe-data-item exception-pe-num" :class="[curIndex === 1 ? 'active' : '']">
          <span class="pe-data-body">到期前 {{countInfo.preliminaryStartTimeValue}} 个{{countInfo.preliminaryStartTimeUnit}} {{countInfo.temporary_count}} 张</span>
          <p class="en-illus">before expiration</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item forbid-pe-num" :class="[curIndex === 2 ? 'active' : '']">
          <span class="pe-data-body">证书已过期 {{countInfo.overtime_count}} 张</span>
          <p class="en-illus">expired certificate</p>
          <i></i>
        </div>
      </div>
    </div>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addCertificate"><a-icon type="plus"/>新增</a-button>
        <a-button type="primary" @click="batchImport">批量导入</a-button>
        <a-button type="primary" @click="toMessageSettings">消息设置</a-button>
      </div>
      <div class="ttips">
        <div class="circle-item">
          <span class="yellow-circle"></span>
          <span>到期前{{countInfo.preliminaryStartTimeValue}}个{{countInfo.preliminaryStartTimeUnit}}</span>
        </div>
        <div class="circle-item">
          <span class="red-circle"></span>
          <span>已过期</span>
        </div>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="certNum" slot-scope="record">
          <span :style="getValidityStatusColor(record.validityStatus)">
            ●
          </span>{{ record.certNum }}</div>
        <div slot="manufacturerName" slot-scope="record">{{ record.manufacturerName }}</div>
        <div slot="holdUserName" slot-scope="record">{{ record.holdUserName }}</div>
        <div slot="securityPrincipalUserName" slot-scope="record">{{ record.securityPrincipalUserName }}/{{record.securityPrincipalUserJobNumber}}</div>
        <div slot="certTypeName" slot-scope="record">{{ record.certTypeName }}</div>
        <div slot="certFileNameList" slot-scope="record">{{ record.certFileNameList }}</div>
        <div slot="validityPeriod" slot-scope="record">{{ record.validityPeriod }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="editDetail(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="reSend(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 新增编辑证书弹框 -->
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
          <CommonSearchItem
            ref="commonSearchItem1"
            :CommonFormInline="editForm"
            :rules="editFormRules"
            :notTablePage="true"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            labelAlign="left"
            @departmentChange="departmentChange"
            :hasDepartment="false"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="证书编号" prop="certNum">
            <a-input :maxLength="50" v-model="editForm.certNum" placeholder="请输入证书编号"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="厂商名称" prop="manufacturerName">
            <a-input :maxLength="50" v-model="editForm.manufacturerName" placeholder="请输入厂商名称"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="持证人" prop="holdUserName">
            <a-input :maxLength="50" v-model="editForm.holdUserName" placeholder="请输入持证人"></a-input>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'securityPrincipalUserId'"
            :treeRoles="editFormRules"
            :labelTitle="'安全负责人'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="editForm.securityPrincipalUserId"
            :deptTreeId="editForm.deptId"
          />
          <a-form-model-item class="flex" label="证书类型" prop="certTypeId">
            <a-select v-model="editForm.certTypeId" placeholder="请选择">
              <a-select-option
                v-for="item in certificateList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{item.dictLabel}}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="有效期限" prop="validityPeriod">
            <a-date-picker v-model="editForm.validityPeriod" change="dataChange" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="证书" prop="certFileIdList">
            <UploadBtnStyle
              :accept="['.jpg','.png','.jpeg','.pdf']"
              :fileLists="editForm.echoAttachmentList"
              :maxSize="20"
              :limit="20"
              @handleSuccess="handleSuccessReferencesAttachment"
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
    <!-- 上传 -->
    <Upload :importVisible="importVisible" @closeAddVisible="closeAddVisible" :inOutType="inOutType"/>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"
import { mapState } from 'vuex'
import Upload from '@/pages/certificatesManagement/tpl/components/uploadImport.vue'
import dayJs from "dayjs"
import dictionary from "@/utils/dictionary";
import moment from 'moment'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { debounce, cloneDeep } from 'lodash'
import StaffOrDept from "@/components/staffOrDept";
import { healthManageList, getCertificateCount, getCertificateList, certificateAdd, certificateDelete, certificateEdit, certificateDetail} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  components: { StaffOrDept,UploadBtnStyle, Upload},
  data() {
    return {
      dictionary,
      formInline: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      titleText: "新增",
      editForm: {
        certFileIdList: undefined,
        echoAttachmentList: [],
      },
      // 表单验证
      editFormRules: {
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        validityPeriod: [
          { required: true, message: "有效期限不能为空", trigger: "change" },
        ],
        certTypeId: [
          { required: true, message: "证书类型不能为空", trigger: "change" },
        ],
        securityPrincipalUserId: [
          { required: true, message: "安全负责人不能为空", trigger: "change" },
        ],
        manufacturerName: [
          { required: true, message: "厂商名称不能为空", trigger: "change" },
        ],
        holdUserName: [
          { required: true, message: "持证人不能为空", trigger: "change" },
        ],
        certNum: [
          { required: true, message: "证书编号不能为空", trigger: "change" },
        ],
      },
      peDate: '',
      curIndex: -1,
      validityStatus:'',
      addVisible: false,
      importVisible: false,
      inOutType: 0,
      countInfo: {
        total: '', //总数
        temporary_count: '', //临期数量
        overtime_count: '', //超期数量
        preliminaryStartTimeValue: '', //临期时间
        preliminaryStartTimeUnit: '' //临期单位
      },
      tableSpinning: false,
      columns:  [
        {
          title: '证书编号',
          scopedSlots: { customRender: 'certNum' },
          width: 260
        },
        {
          title: '厂商名称',
          scopedSlots: { customRender: 'manufacturerName' },
          width: 260
        },
        {
          title: '持证人',
          scopedSlots: { customRender: 'holdUserName' },
          width: 260
        },
        {
          title: '安全负责人',
          scopedSlots: { customRender: 'securityPrincipalUserName' },
          width: 180
        },
        {
          title: '证书类型',
          scopedSlots: { customRender: 'certTypeName' },
        },
        {
          title: '证书',
          dataIndex:'certFileList',
          customRender: (fileList, record) => {
            return fileList ? (
              <a-popover autoAdjustOverflow title="查看证书">
                <div slot="content" style={{ display: 'flex', flexDirection: 'column' }}>
                  {fileList.map((item, index) => (
                    <a key={index} href={item.filePath}>{item.sourceFileName}</a>
                  ))}
                </div>
                <div style={{ color: "#0067cc"}}>
                  查看证书
                </div>
              </a-popover>
            ) : (
              <div>/</div>
            );
          },
          width: 250,
        },
        {
          title: '有效期限',
          scopedSlots: { customRender: 'validityPeriod' },
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      certificateList: [],
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(200, true));
    this.certificateList = this.getMappingValue(this.dictTypeData, "dictType", "certificate_type").dictItem;
    this.init()
  },
  methods: {
    getValidityStatusColor(validityStatus) {
      switch (validityStatus) {
        case '1':
          return 'color: orange';
        case '2':
          return 'color: red';
        default:
          return 'display: none';
      }
    },
    async init() {
      this.getDataList()
      this.getCertCount()
    },
    // 获取到那三个格子的详情数据
    async getCertCount(){
      let params1 = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        validityPeriodStart :this.formInline.validityPeriod[0] ? moment(this.formInline.validityPeriod[0]).format('YYYY-MM-DD') : '',
        validityPeriodEnd :this.formInline.validityPeriod[1] ? moment(this.formInline.validityPeriod[1]).format('YYYY-MM-DD') : '',
        inOutType: "2" 
      }
      const {code, data } = await getCertificateCount(params1)
      if (+code === 20000) {
        this.countInfo = data
        if(this.countInfo.preliminaryStartTimeUnit == 'day'){
          this.countInfo.preliminaryStartTimeUnit = '日'
        } else if (this.countInfo.preliminaryStartTimeUnit == 'week'){
          this.countInfo.preliminaryStartTimeUnit = '周'
        } else if (this.countInfo.preliminaryStartTimeUnit == 'month') {
          this.countInfo.preliminaryStartTimeUnit = '月'
        }
      }
    },
    async getDataList() {
      let validityPeriodStart = this.formInline.validityPeriod[0] ? moment(this.formInline.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInline.validityPeriod[1] ? moment(this.formInline.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        inOutType:2,
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        validityPeriodStart: validityPeriodStart,
        validityPeriodEnd: validityPeriodEnd,
        validityStatus: this.validityStatus
      }
      this.tableSpinning = true
      const { code, data } = await getCertificateList(params)
      this.tableSpinning = false
      if (+code === 20000 && data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
    },
    changeTab(tabIndex) {
      this.curIndex = this.curIndex === tabIndex ? -1 : tabIndex
      if (tabIndex == 0){
        this.validityStatus = ''
      } else if (tabIndex == 1) {
        this.validityStatus = 1
      } else if (tabIndex == 2) {
        this.validityStatus = 2
      }
      this.page.pageNo = 1
      this.getDataList()
    },
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
    //部门修改-清空人员组件
    departmentChange() {
      this.editForm.securityPrincipalUserId = [];
      this.editForm.securityPrincipalUserName = [];
      this.editForm.securityPrincipalUserJobNumber = [];
    },
    // 根据label取value
    getLabelByValue(addList, targetValue) {
      const item = addList.find(item => item.dictValue === targetValue);
      return item ? item.dictLabel : null;
    },
    // 排班弹框-确定
    editConfirm() {
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      if(this.editForm.securityPrincipalUserId.length > 1){
        this.$antMessage.warn('只能选择一名持证人！');
        return
      }
      this.editForm.certTypeName = this.getLabelByValue(this.certificateList,this.editForm.certTypeId)
      this.editForm.securityPrincipalUserId = this.editForm.securityPrincipalUserId.toString();
      this.editForm.securityPrincipalUserJobNumber = this.editForm.securityPrincipalUserJobNumber.toString();
      this.editForm.securityPrincipalUserName = this.editForm.securityPrincipalUserName.toString();
      console.log('想要提交的数据editForm',this.editForm);
      let params = {
        ...this.editForm
      };
      params.inOutType = '2'
      let PromiseFn = this.titleText == "编辑" ? certificateEdit : certificateAdd;
      PromiseFn(params)
        .then(() => {
          this.getDataList();
          this.getCertCount()
          this.$antMessage.success(this.titleText + "成功");
          this.addVisible = false;
          this.editForm = {};
        })
        .catch((err) => console.log(err));
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

    //安全负责人
    personThingOne(data) {
      this.editForm.securityPrincipalUserId = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.securityPrincipalUserName = this.getName(list);
      this.editForm.securityPrincipalUserJobNumber = this.getWorkNum(list);
    },

    // 查询
    iSearch() {
      // 获取列表
      this.page.pageNo = 1
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
      this.getCertCount()
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        validityPeriod: []
      }
      this.validityStatus = ''
      this.curIndex = -1
      this.getDataList()
      this.getCertCount()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    // 批量导入-打开弹框
    batchImport() {
      this.importVisible = true
      this.inOutType = 2
    },
    //关闭批量导入弹窗
    closeAddVisible(flag) {
      if (flag) {
        this.formInline = {
          validityPeriodStart: undefined,
          validityPeriodEnd: undefined,
          validityPeriod: []
        },
        this.getDataList();
        this.getCertCount()
      }
      this.importVisible = false;
      this.inOutType = 0
    },
    // 点击新增按钮
    addCertificate() {
      this.titleText = '新增'
      this.addVisible = true;
      this.getDataList();
    },
    // 点击编辑按钮-获取到详情
    editDetail(row) {
      this.titleText = '编辑'
      this.addVisible = true;
      certificateDetail({certId:row.certId})
      .then((res)=>{
        this.editForm = res.data
        this.editForm.securityPrincipalUserId = [this.editForm.securityPrincipalUserId]
        this.editForm.certFileIdList = this.handleFileIdS(this.editForm.certFileList)
        this.editForm.echoAttachmentList = this.handleFileRedisplay(this.editForm.certFileList)
      })
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
      // console.log(888,list);
      list = list ? list : []
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
    // 删除
    reSend(row){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           certId:row.certId
          }
          await certificateDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
          this.getCertCount()
        }
      })
    },
    // 点击取消按钮
    addCancle() {
      this.addVisible = false;
      this.editForm = {};
    },
    // 跳转到消息设置页面
    toMessageSettings() {
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/employeesMessagesSet'
      })
    },
    // 证书附件-文件上传
    handleSuccessReferencesAttachment(fileList) {
      console.log('打印一下证书附件',fileList);
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
  }
}
</script>

<style lang="less" scoped>

.pe-data-item{
  display: inline-block;
  width:224px;
  height: 64px;
  cursor: pointer;
  position: relative;
  background: rgba(250,250,250,0.50);
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px;
  padding-left:30px;
  & +.pe-data-item{
    margin-left: 20px;
  }
  &.active{
    background:#fff;
  }
  i {
    position: absolute;
    display: inline-block;
    background-color: #333;
    -webkit-mask-image: url(~@/assets/images/data-icon.svg);
    mask-image: url(~@/assets/images/data-icon.svg);
    width:14px;
    top:34px;
    right: 30px;
    height: 14px;
  }
}
.link-span{
  cursor: pointer;
  color:#02A7F0;
}
.ttips {
  height: 100%;
  display: flex;
  align-items: center;
  .circle-item {
    margin-right: 15px;
  }
}
.total-pe-num{
  &.active{
    border: 1px solid rgba(0,103,204,1);
    box-shadow: 0px 0px 10px 0px rgba(0,103,204,0.1);
    .pe-data-body{
      color: #0067CC;
    }
    .en-illus{
      color: #0067CC;
    }
    i {
      background-color: rgba(0,103,204,1);
    }
  }
}
.exception-pe-num{
  &.active{
    border: 1px solid rgba(255,157,1,1);
    box-shadow: 0px 0px 10px 0px rgba(255,157,1,0.1);
    .pe-data-body,.en-illus{
      color: #FF9D01;
    }
    i {
      background-color:rgba(255,157,1,1);
    }
  }
}
.forbid-pe-num{
  &.active{
    border: 1px solid rgba(255,18,18,1);
    box-shadow: 0px 0px 10px 0px rgba(255,18,18,0.1);
    .pe-data-body,.en-illus{
      color: #FF1212;
    }
    i {
      background-color:rgba(255,18,18,1);
    }
  }
}
.pe-data-container{
  margin-bottom:30px;
  .pe-data-body{
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .en-illus{
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    font-weight: 400;
    margin-top:10px;
  }
}
.pe-green{
  color: #02DFAD;
}
.pe-red{
  color:#FF1212;
}
.pe-data-body{
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>
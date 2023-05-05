<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>课件管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" @corporationChange="corporationSearchChange"></CommonSearchItem>
        <a-form-model-item label="课件/文件名">
          <a-input v-model="formInline.name" placeholder="请输入课件名称/文件名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="类型">
          <a-select v-model="formInline.type" placeholder="请选择类型">
            <a-select-option v-for="item in fileTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="科目">
          <a-select v-model="formInline.subjectId" placeholder="请选择科目">
            <a-select-option v-for="item in searchSubject" :key="item.subjectId" :value="item.subjectId">{{item.name}}</a-select-option>
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
        <a-button type="dashed" @click="addCourseware">新增课件</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="downLoad(record)">下载</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
        <div slot="subject" slot-scope="record">
          <span>{{findText(subjectListAll, "subjectId", record.subjectId).name}}</span>
        </div>
        <div slot="type" slot-scope="record">
          <span>{{findText(fileTypeList, "key", record.type).value}}</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal title="查看课件" :visible="detailVisible" :cancelFn="detailCancle">
      <template slot="form">
        <a-form-model :label-col="{ style: { width: '80px' } }" :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }" :colon="false" labelAlign="left">
          <CommonSearchItem
            :CommonFormInline="currentMsg"
            :notTablePage="true"
            :labelCol="{ style: { width: '80px' } }"
            :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }"
            labelAlign="left"
            :disabled="true"
          ></CommonSearchItem>
          <a-form-model-item class="flex modal-form-text" label="序号">
            <div>{{currentMsg.coursewareId}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="课件名称">
            <div>{{currentMsg.name}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="课件类型">
            <div>{{findText(fileTypeList, "key", currentMsg.type).value}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="所属科目">
            <div>{{findText(subjectList, "subjectId", currentMsg.subjectId).name}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="课件大小">
            <div>{{changeM(currentMsg.size)}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="上传人">
            <div>{{currentMsg.createUserName}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="上传时间">
            <div>{{currentMsg.createTime}}</div>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
    <CommonModal title="编辑课件" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            :CommonFormInline="editForm"
            :rules="addFormRules"
            :notTablePage="true"
            :labelCol="{ style: { width: '80px' } }"
            :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }"
            labelAlign="left"
            :disabled="true"
          ></CommonSearchItem>
          <a-form-model-item class="flex modal-form-text" label="序号">
            <div>{{editForm.coursewareId}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="课件类型">
            <div>{{findText(fileTypeList, "key", editForm.type).value}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="课件大小">
            <div>{{changeM(editForm.size)}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="上传人">
            <div>{{editForm.createUserName}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="上传时间">
            <div>{{editForm.createTime}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="所属科目">
            <a-select v-model="editForm.subjectId" placeholder="请选择科目">
              <a-select-option v-for="item in subjectListType" :key="item.subjectId" :value="item.subjectId">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="课件名称">
            <a-input v-model="editForm.name" placeholder="请输入课件名称" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="editLoading" @click="editConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal title="新增课件" :visible="addVisible" :cancelFn="addCancle">
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
          <CommonSearchItem
            :CommonFormInline="addForm"
            :rules="addFormRules"
            :notTablePage="true"
            :labelCol="{ style: { width: '80px' } }"
            :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }"
            labelAlign="left"
            @corporationChange="corporationChange"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="上传课件">
            <div class="box">
              <a-space>
                <a-button type="primary" @click="uup">上传文件</a-button>
              </a-space>
              <GlobalUpload
                :maxSize="1024 * 2"
                :needUnzip="false"
                :simultaneousUploads="2"
                :fileTypeArr="['video/mp4', 'audio/mpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint']"
              />
            </div>
          </a-form-model-item>
        </a-form-model>
      </template>
      <CommonTable :noPaging="true">
        <a-table :columns="fileColumns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="addFileList" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="subject" slot-scope="record">
            <a-select v-model="record.subjectId" placeholder="请选择科目">
              <a-select-option v-for="item in subjectListType" :key="item.subjectId" :value="item.subjectId">{{item.name}}</a-select-option>
            </a-select>
          </div>
          <div slot="size" slot-scope="record">{{changeM(record.size)}}</div>
          <div slot="type" slot-scope="record">{{findFileType(record.type)}}</div>
          <div slot="action" slot-scope="record">
            <span class="color-0067cc cursor-pointer" @click="FileDelete(record)">删除</span>
          </div>
        </a-table>
      </CommonTable>
      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="addLoading" @click="addConfirm">确认上传</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";
import uploadCanRemove from "@/mixin/uploadCanRemoveHaslimit";
import dictionary from '@/utils/dictionary'

import { debounce } from 'lodash';
import { GetCoursewarelist, InsertCourseware, UpdateCourseware, DeleteCourseware, GetSubjectlist, DownLoadCourseware } from "@/services/api.js";

// 大文件分片上传
import Bus from '@/utils/bus.js';
import GlobalUpload from '@/components/globalUploader/globalUpload.vue'

export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  components: { GlobalUpload },
  data() {
    return {
      tableSpinning:false,
      addLoading: false,
      editLoading: false,
      newFile: {
        id: undefined,
        url: undefined,
      },

      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      searchSubject: [],

      detailVisible: false,
      currentMsg: {},

      editForm: {},
      editVisible: false,

      addVisible: false,
      addForm: {},
      addFormRules: {},

      // 表单验证
      editFormRules: {
        name: [
          { required: true, message: "课件名称不能为空", trigger: "blur" },
        ],
        subject: [
          { required: true, message: '所属科目不能为空', trigger: 'change' },
        ]
      },

      columns: [
        {
          title: '序号',
          dataIndex: 'coursewareId',
          key: "coursewareId"
        },
        {
          title: '类型',
          scopedSlots: { customRender: 'type' },
          key: "type"
        },
        {
          title: '课件名称',
          dataIndex: 'name',
          key: "name"
        },
        {
          title: '科目',
          scopedSlots: { customRender: 'subject' },
          key: "subject"
        },
        {
          title: '上传时间',
          dataIndex: 'createTime',
          key: "createTime"
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],

      fileList: [],
      addFileList: [],
      fileColumns: [
        {
          title: '课件名称',
          dataIndex: 'name',
          key: "name"
        },
        {
          title: '课程科目',
          scopedSlots: { customRender: 'subject' },
          key: "subject",
          width: 200
        },
        {
          title: '课件类型',
          scopedSlots: { customRender: 'type' },
          key: "type"
        },
        {
          title: '大小',
          scopedSlots: { customRender: 'size' },
          key: "size"
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      fileTypeList: [],
      subjectList: [],
      subjectListAll: [],
      productId: "",
      subjectListType: [],
    }
  },
  mounted() {
    // 文件选择后的回调
    Bus.$on('globalUploadFileAdd', this.globalUploadFileAdd);
    // 文件上传成功的回调
    Bus.$on('globalUploadFileSuccess', this.globalUploadFileSuccess);
    // 文件上传失败的回调
    Bus.$on('globalUploadFileError', this.globalUploadFileError);
    // 文件删除的回调
    Bus.$on('globalUploadFileRemove', this.globalUploadFileRemove);
  },
  created() {
    this.setRouterCode("coursewaremanagement");
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.fileTypeList = dictionary('fileType');
    this.getDataList();
    this.getSubjectSearchlist("", true);
    this.productId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).productSets.productId;
  },
  methods: {
    // 搜索条件组织变动
    corporationSearchChange(corporationId, deptId) {
      this.$set(this.formInline, "subjectId", undefined);
      this.searchSubject = [];
      if (corporationId) {
        this.getSubjectSearchlist(corporationId);
      }
    },
    // 组织变动
    corporationChange(corporationId, deptId) {
      for (let i = 0; i < this.addFileList.length; i++) {
        this.addFileList[i].subjectId = undefined;
      }
      if (corporationId) {
        this.getSubjectlist(corporationId);
      }
    },
    // 文件选择后的回调
    globalUploadFileAdd(file) {
    },
    // 文件上传成功的回调
    globalUploadFileSuccess({ res, file }) {
      this.newFile = res.length ? { ...res[0] } : {}
      this.newFile = {
        ...this.newFile,
        name: file.name,
        type: file.fileType,
        size: file.size
      }
      this.addFileList.push({ ...this.newFile });
    },
    // 文件上传失败的回调
    globalUploadFileError(file) {
    },
    // 文件删除的回调
    globalUploadFileRemove(file) {
    },
    uup() {
      Bus.$emit('openGlobalUpload', {
        // id: '1111'  // 传入的参数
      })
    },
    down() {
      if (this.newFile.url) {
        window.open(this.newFile.url)
      }
    },
    getSubjectSearchlist(corporationId, flag) {
      let para = {}
      if (corporationId) {
        para.corporationId = corporationId;
      }
      GetSubjectlist(para).then((res) => {
        if (flag) {
          this.subjectListAll = res.data || [];
        } else {
          this.searchSubject = res.data || [];
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    getSubjectlist(corporationId) {
      let para = {}
      if (corporationId) {
        para.corporationId = corporationId;
      }
      GetSubjectlist(para).then((res) => {
        if (corporationId) {
          this.subjectListType = res.data || [];
          if (this.subjectListType.length == 0) {
            this.$antMessage.warn("该组织下暂无科目");
          }
        } else {
          this.subjectList = res.data || [];
          this.getDataList();
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    handlePreview(item) {
      this.previewImg(item.url)
    },
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      this.tableSpinning = true
      return GetCoursewarelist(params)
      .then((res) => {
        this.addLoading = false;
        this.editLoading = false;
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      })
      .catch((err) => {
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
      this.searchSubject = [];
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    actionLook(record) {
      this.currentMsg = record;
      this.detailVisible = true;
    },
    actionEdit(record) {
      this.editForm = record;
      this.editVisible = true;
      this.getSubjectlist(record.corporationId);
    },
    actionDelete(record) {
      if (!this.canClickBtnMixin("coursewaremanagement-del")) {
        return;
      }
      this.$antConfirm({
        title: '删除提示',
        content: '本操作不可恢复，确定继续？',
        cancelText: '取消',
        onOk: () => {
          DeleteCourseware({
            coursewareId: record.coursewareId,
            productId: this.productId
          }).then(() => {
            this.$antMessage.success('删除成功');
            this.getDataList()
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    downLoad(record) {
      DownLoadCourseware([record.fileId]).then((res) => {
        if (res.data[0]) {
          window.open(res.data[0].filePath);
        }
      }).catch(err => console.log(err))
    },
    // 编辑弹框按钮事件
    editCancle() {
      this.editVisible = false;
      this.editLoading = false;
      this.editForm = {};
    },
    editConfirm() {
      this.editLoading = true;
      UpdateCourseware({
        productId: this.productId,
        coursewareId: this.editForm.coursewareId,
        name: this.editForm.name,
        subjectId: this.editForm.subjectId,
      }).then(() => {
        this.$antMessage.success("编辑成功");
        this.getDataList();
      }).catch(err => console.log(err))
        .finally(() => {
          this.editVisible = false;
          this.editForm = {};
          this.editLoading = false;
        })
    },
    // 查看弹框按钮事件
    detailCancle() {
      this.detailVisible = false;
    },
    // 新增弹框按钮事件
    addCourseware() {
      this.addFileList = [];
      this.editForm = {};
      this.addVisible = true;
    },
    addConfirm() {
      if (this.addFileList.length <= 0) {
        this.$antMessage.error("必须上传课件");
        return;
      }
      for (let i = 0; i < this.addFileList.length; i++) {
        if (!this.addFileList[i].subjectId) {
          this.$antMessage.error("每个课件必须选择对应科目");
          return;
        }
      }
      if (!formValidator.formAll(this, 'addForm')) {
        return;
      }
      for (let i = 0; i < this.addFileList.length; i++) {
        this.addFileList[i].type = this.findText(this.fileTypeList, "value", this.findFileType(this.addFileList[i].type)).key;
        this.addFileList[i].fileId = this.addFileList[i].id
      }
      let param = {
        productId: this.productId,
        coursewareList: this.addFileList,
        ...this.addForm
      };
      this.addLoading = true;
      InsertCourseware(param).then(() => {
        this.$antMessage.success("新增成功");
        this.getDataList();
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.addVisible = false;
        this.addFileList = [];
        this.addForm = {};
        this.subjectListType = [];
        this.addLoading = false;
      })
    },
    addCancle() {
      this.addForm = {};
      this.subjectListType = [];
      this.addVisible = false;
      this.addFileList = [];
    },
    FileDelete(record) {
      this.$antConfirm({
        title: '删除提示',
        content: '本操作不可恢复，确定继续？',
        cancelText: '取消',
        onOk: () => {
          for (let i = 0; i < this.addFileList.length; i++) {
            if (this.addFileList[i].id == record.id) {
              this.addFileList.splice(i, 1);
              i--;
            }
          }
          this.$antMessage.success('删除成功');
        },
      });
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
    // 将文件大小换算成M
    changeM(size) {
      if (size > (1024 * 1024)) {
        return this.toDecimal(size / 1024 / 1024) + "M";
      } else {
        return this.toDecimal(size / 1024) + "KB";
      }

    },
    // 浮点数四舍五入保留两位小数
    toDecimal(x) {
      var f = parseFloat(x);
      if (isNaN(f)) {
        return;
      }
      f = Math.round(x * 100) / 100;
      return f;
    },
    findFileType(type) { //['video/mp4', 'audio/mpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'], // mp4,mp3,pdf,pptx,ppt
      if (type == "video/mp4") {
        return "视频"
      } else if (type == "audio/mpeg") {
        return "音频"
      } else {
        return "图文";
      }

    }
  }
}
</script>
<style lang="less" scoped>
/deep/ td {
  .ant-select {
    width: 100%;
  }
}
// /deep/ #global-uploader {
//   display: none;
// }
.box {
  padding: 0 20px 20px 20px;
}
p {
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    color: #0067cc;
  }
}
img {
  width: 300px;
  margin-top: 20px;
}
.border {
  border: 1px solid #ccc;
}
</style>
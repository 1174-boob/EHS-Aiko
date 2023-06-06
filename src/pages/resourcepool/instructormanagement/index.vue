<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>讲师管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline"></CommonDept>
        <a-form-model-item label="姓名/手机号">
          <a-input v-model="formInline.nameOrPhone" placeholder="请输入姓名/手机号"></a-input>
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
        <a-button type="dashed" @click="addInstructor">新增讲师</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
        <div slot="avatar" slot-scope="record">
          <img :src="record.avatar" alt />
        </div>
        <div slot="gender" slot-scope="record">{{findText(genderList, "key", record.gender).value}}</div>
      </a-table>
    </CommonTable>
    <CommonModal title="查看讲师" :visible="detailVisible" :cancelFn="detailCancle">
      <template slot="form">
        <a-form-model :label-col="{ style: { width: '80px' } }" :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }" :colon="false" labelAlign="left">
          <CommonDept :CommonFormInline="currentMsg" :notTablePage="true" :labelCol="{ style: { width: '80px' } }" :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }" labelAlign="left" :disabled="true"></CommonDept>
          <a-form-model-item class="flex modal-form-text" label="上传头像">
            <div>
              <img class="head-portrait" :src="currentMsg.avatar" alt />
            </div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="讲师姓名">
            <div>{{currentMsg.name}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="讲师性别">
            <div>{{findText(genderList, "key", currentMsg.gender).value}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="手机号">
            <div>{{currentMsg.phone}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="讲师介绍">
            <div>{{currentMsg.description}}</div>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="detailCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="detailCancle">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal :title="editText" :visible="editVisible" :cancelFn="editCancle">
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
          <CommonDept :CommonFormInline="editForm" :rules="editFormRules" :notTablePage="true" :labelCol="{ style: { width: '80px' } }" :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }"></CommonDept>
          <a-form-model-item class="flex" label="上传头像">
            <upload-can-remove ref="editModel" :maxSize="1" :limit="1" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess"></upload-can-remove>
          </a-form-model-item>
          <a-form-model-item class="flex" label="讲师姓名" prop="name">
            <a-input v-model="editForm.name" placeholder="请输入讲师姓名" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="讲师性别">
            <a-select v-model="editForm.gender" placeholder="请选择性别">
              <a-select-option v-for="item in genderList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="手机号" prop="phone">
            <a-input v-model="editForm.phone" placeholder="请输入手机号"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="讲师介绍">
            <a-textarea placeholder="请输入讲师介绍" v-model="editForm.description" allowClear :maxLength="300" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="addLoading" @click="editConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";

import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import CommonSearchItem from "@/components/commonSearchItem/index.vue";


import dictionary from '@/utils/dictionary'

import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'
import { GetLecturerlist, InsertLecturer, UpdateLecturer, DeleteLecturer, getOrganizeList, DetailLecturer, GetfileMsgList } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    UploadCanRemove,
    CommonSearchItem
  },
  data() {
    return {
      tableSpinning:false,
      addLoading: false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },

      detailVisible: false,
      currentMsg: {},

      editForm: {},
      editVisible: false,

      addVisible: false,
      addForm: {},

      editText: "",
      // 表单验证
      editFormRules: {
        name: [
          { required: true, message: "讲师姓名不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, validator: formValidator.texTphoneNumber, trigger: "blur" },
        ]
      },

      columns: [
        {
          title: '序号',
          dataIndex: 'lecturerId',
          key: "lecturerId"
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: "name"
        },
        {
          title: '性别',
          scopedSlots: { customRender: 'gender' },
          key: "gender"
        },
        {
          title: '头像',
          scopedSlots: { customRender: 'avatar' },
          key: "avatar"
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: "phone"
        },
        {
          title: '讲师介绍',
          dataIndex: 'description',
          key: "description"
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

      genderList: [],
      headImg: {},
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      editImgurl: "",
      fileMsgList: []
    }
  },
  created() {
    this.setRouterCode("instructormanagement");
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.genderList = dictionary('sex');
    this.getDataList();
  },
  methods: {
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.tableSpinning = true
      return GetLecturerlist(params)
      .then((res) => {
        this.addLoading = false;
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
      this.$refs.commonDept.reset();
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
    async actionEdit(record) {
      this.editText = "编辑";
      this.editForm = cloneDeep(record);
      this.editVisible = true;
      if (record.fileId) {
        let result = await GetfileMsgList([record.fileId]);
        this.editImgurl = result.data[0];
        this.editImgurl.uid = result.data[0].id;
        this.$refs.editModel.fileList = [{
          uid: result.data[0].id,
          name: result.data[0].fileName,
          status: 'done',
          url: result.data[0].filePath
        }];
      }
    },
    actionDelete(record) {
      if (!this.canClickBtnMixin("instructormanagement-del")) {
        return;
      }
      this.$antConfirm({
        title: '删除提示',
        content: '本操作不可恢复，确定继续？',
        cancelText: '取消',
        onOk: () => {
          DeleteLecturer({
            lecturerId: record.lecturerId,
          }).then(res => {
            this.$antMessage.success('删除成功');
            this.getDataList()
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    editCancle() {
      this.editVisible = false;
      this.editForm = {};
    },
    editConfirm() {
      if (!formValidator.formAll(this, 'editForm')) {
        return;
      }
      let params = {
        ...this.editForm,
        avatar: this.headImg === undefined? '' :this.headImg.url,
        fileId: this.headImg === undefined? '' :this.headImg.id,
      }
      let promiseFn = InsertLecturer;
      if (this.editText == "编辑") {
        promiseFn = UpdateLecturer;
      }
      this.addLoading = true;
      promiseFn(params).then(() => {
        this.$antMessage.success(this.editText + "成功");
        this.editVisible = false;
        this.editForm = {};
        this.headImg = {};
        this.getDataList();
      }).catch(err => console.log(err))
    },
    addCancle() {
      this.addVisible = false;
      this.addForm = {}
    },
    detailCancle() {
      this.detailVisible = false;
    },
    // 新增
    addInstructor() {
      this.editText = "新增";
      this.editForm = {};
      this.editVisible = true;
    },
    //头像上传成功
    async addFormUploadSuccess(fileList) {
      this.headImg = fileList[0];
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
    findOriganizeText(arr, id) {
      if (!(arr && id)) {
        return "--"
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].deptId == id) {
          return arr[i].deptName
        }
        if (arr[i].childDeptList) {
          return this.findOriganizeText(arr[i].childDeptList, id);
        } else {
          return "--";
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
.head-portrait {
  width: 50px;
  height: 50px;
}
</style>
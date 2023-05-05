<template>
  <!-- 公用模板（带有标题、查询条件、表格、分页、虚线边框按钮、点击按钮弹出公用弹框样式） -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">  
    <div v-show="true" class="searchtable-box">
      <h2 class="page-title font-20 font-weight-400 color-333 m-t-15 m-b-15 m-r-30">这是面包屑下的标题</h2>
      <!-- 查询 -->
      <div class="searchtable-search m-t-20 m-b-20 flex align-items-center justify-content-between border-f4 border-radius-2 bg-250 pd-t-27 pd-b-12 pd-l-10 pd-r-10">
        <!-- 左侧搜索 -->
        <div class="width-100">
          <a-form-model class="form-common" layout="inline" :model="formInline" :colon="false">
            <!-- 统一label值不带冒号： -->
            <!-- 输入框 -->
            <a-form-model-item label="企业名称">
              <a-input class="searchtable-search-input m-b-15" v-model="formInline.companyName" placeholder="请输入企业名称"></a-input>
            </a-form-model-item>
            <a-form-model-item label="企业名称">
              <a-input class="searchtable-search-input m-b-15" v-model="formInline.companyName" placeholder="请输入企业名称"></a-input>
            </a-form-model-item>
            <a-form-model-item label="企业名称">
              <a-input class="searchtable-search-input m-b-15" v-model="formInline.companyName" placeholder="请输入企业名称"></a-input>
            </a-form-model-item>
            <!-- 下拉框选项 -->
            <a-form-model-item label="邀请状态">
              <a-select class="searchtable-search-select m-b-15" v-model="formInline.status" placeholder="请选择邀请状态">
                <a-select-option value="0">待通过</a-select-option>
                <a-select-option value="1">已通过</a-select-option>
              </a-select>
            </a-form-model-item>
            <!-- 日期选择框 -->
            <a-form-model-item label="邀请时间">
              <a-range-picker separator="至" class="searchtable-search-date m-b-15" v-model="formInline.timeArr">
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="search flex-end float-right">
              <a-button class="m-r-15" type="primary" :loading="loading" @click="iSearch">查询</a-button>
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <!-- 虚线按钮 -->
      <div class="dashed-btn m-b-15">
        <a-button class="m-r-30" type="dashed" @click="goInvitationAction">普通虚线框按钮</a-button>
        <!-- 带有加号按钮 -->
        <a-button type="dashed" @click="goInvitationAction"><a-icon type="plus" />带加号按钮</a-button>
      </div>
      <!-- 表格 -->
      <div>
        <a-table bordered :columns="columns" :scroll="{ x: 1300 }" :locale="{emptyText: emptyText}" :data-source="dataList" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="phone" slot-scope="record">
            <span>{{encryptionRules("phone", record.phone)}}</span>
          </div>
          <div slot="invitePlatform" slot-scope="record">
            <span>{{record.invitePlatform ? record.invitePlatform : "-"}}</span>
          </div>
          <div class="action" slot="action" slot-scope="record">
            <span class="color-0067cc m-r-10" @click="actionFn(record)">查看</span>
            <span class="color-ff4d4f" @click="actionFn(record)">删除</span>
          </div>
        </a-table>
        <!-- 页码 -->
        <div class="table-pagination flex m-t-15 m-b-15 m-l-15 m-r-15 justify-content-end align-items-center">
          <a-pagination simple :current="page.pageNo" :pageSize="page.pageSize" :total="page.total" show-less-items showQuickJumper @change="pageNoChange" />
          <span class="table-pagination-totel m-l-15">
            共
            <span class="color-0067cc">{{ page.total }}</span>
            条
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 用于结构引入文件中抛出的接口函数
import {  } from '@/services/api'
// 按接口要求处理时间选择框返回的具体时间格式
import dayJs from 'dayjs';
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import cancelLoading from '@/mixin/cancelLoading';
// 用于前端加密手机号等敏感信息，但是一般后端做加密；当需前端要用到这些加密数据则后端不能加密，前端展示时加密即可
import encryptionRules from "@/utils/encryptionRules";
import { debounce, cloneDeep } from 'lodash'

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      userStatus: 1,
      // 搜索合作伙伴
      formInline: {
        companyName: undefined,
        status: undefined,
        timeArr: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: '企业名称',
          dataIndex: 'partnerCompanyName',
          key: "partnerCompanyName"
        },
        {
          title: '联系人手机号',
          scopedSlots: { customRender: 'phone' },
          key: "phone"
        },
        {
          title: '邀请人',
          dataIndex: 'userName',
          key: "userName"
        },
        {
          title: '邀请时间',
          dataIndex: 'inviteTime',
          key: "inviteTime"
        },
        {
          title: '邀请入口',
          scopedSlots: { customRender: 'invitePlatform' },
          key: "invitePlatform"
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 300 // 宽度根据操作自定义设置
        },
      ],
      dataList: [
        {
          partnerCompanyName: "partnerCompanyName11",
          phone: "13111111111",
          userName: "userName11",
          inviteTime: "inviteTime11",
          invitePlatform: "invitePlatform11"
        }
      ],
      columnsList: [],
    }
  },
  created() {
    this.getCooperationPartnerList();
    // this.getColumnsList();
  },
  methods: {
    encryptionRules,
    getColumnsList() {
      this.columnsList = [
        {
          title: '企业名称',
          dataIndex: 'partnerCompanyName',
          key: "partnerCompanyName",
          width: 200
        },
        {
          title: '联系人手机号',
          scopedSlots: { customRender: 'phone' },
          key: "phone",
          width: 200
        },
        {
          title: '邀请人',
          dataIndex: 'userName',
          key: "userName",
          width: 200
        },
        {
          title: '邀请时间',
          dataIndex: 'inviteTime',
          key: "inviteTime",
          width: 200
        },
        {
          title: '邀请入口',
          scopedSlots: { customRender: 'invitePlatform' },
          key: "invitePlatform",
          width: 200
        }
      ]
      this.columns = [...this.columnsList, ...this.columns]
    },
    // 跳转邀请记录
    goInvitationAction() {
      alert("这是一个按钮");
    },
    // 获取列表
    getCooperationPartnerList() {
      let inviteBeginTime = this.formInline.timeArr[0] ? dayJs(this.formInline.timeArr[0]).format('YYYY-MM-DD') : undefined
      let inviteEndTime = this.formInline.timeArr[1] ? dayJs(this.formInline.timeArr[1]).format('YYYY-MM-DD') : undefined
      let { companyName } = this.formInline
      let postData = { inviteBeginTime, inviteEndTime, companyName, ...this.page, total: undefined }
      // return GetCooperationPartnerList(postData)
      //   .then(res => {
      //     let { list: dataList, total } = res.data ? res.data : { list: [], total: 0 }
      //     this.dataList = cloneDeep(dataList);
      //     this.page.total = total;
      //     // 处理页码 问题
      //     if (this.dataList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
      //       this.page.pageNo = 1;
      //       this.getCooperationPartnerList();
      //     }
      //   })
      //   .catch(err => { console.log(err); })
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getCooperationPartnerList();
    },
    // 查询
    iSearch() {
      this.handleLoading();
      // 获取列表
      this.getCooperationPartnerList()
        // .finally(() => {
        //   this.cancelLoading();
        // })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        companyName: undefined,
        timeArr: [],
        status: undefined,
      }
      this.getCooperationPartnerList()
    }, 250, { leading: true, trailing: false }),
  }
}
</script>
<style scoped>
.resize-table-th {
  position: relative;
}
.table-draggable-handle {
  /* width: 10px !important; */
  height: 100% !important;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  border: none;
  transform:none;position:absolute;
}
</style>
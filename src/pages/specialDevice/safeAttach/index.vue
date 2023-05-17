<!-- 特种设备台帐 -->
<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="保管部门"></CommonSearchItem>
        <a-form-model-item label="保管人">
          <a-input allowClear v-model="formInline.savePerson" placeholder="请输入保管人"></a-input>
        </a-form-model-item>
        <a-form-model-item label="附件类型">
          <a-select allowClear show-search v-model="formInline.annexType" placeholder="请选择附件类型" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in annexTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="附件编号">
          <a-input allowClear v-model="formInline.annexNum" placeholder="请输附件编号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="检验日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.checkDate" :placeholder="['开始日期','结束日期']" />
        </a-form-model-item>
        <a-form-model-item label="下次检验日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.nextCheckDate" :placeholder="['开始日期','结束日期']" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select allowClear show-search v-model="formInline.annexStatus" placeholder="请选择设备筛选" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in annexStatusOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
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
        <a-button type="dashed" @click="toAddPage">
          <a-icon type="plus" />新建
        </a-button>
      </div>
      <div>
        <UploadBtnStyle
          :action="importAction"
          :showAcceptText="false"
          :accept="['.xlsx', '.xls',]"
          :showUploadList="false"
          :btnText="'批量导入'"
          :btnType="'primary'"
          :btnIcon="false"
          @handleSuccess="handleSuccess"
        ></UploadBtnStyle>
        <a-button type="primary" class="btn" @click="downloadTemplate">导入模板</a-button>
        <a-button type="primary" class="btn" @click="exportAll">批量导出</a-button>
      </div>
    </DashBtn>
    <div class="mark-illus-container">
      <span>
        <i class="cell-i" :class="getRowClass({flag: 0})"></i>超期
      </span>
      <span>
        <i class="cell-i" :class="getRowClass({flag: 1})"></i>到期前一个月
      </span>
      <span>
        <i class="cell-i" :class="getRowClass({flag: 2})"></i>到期前3个月
      </span>
    </div>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 1000 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="annexNum" slot-scope="record" class="icon-cell">
          <i class="cell-i" :class="getRowClass(record)"></i>
          <span>{{ record.annexNum }}</span>
        </div>
        <div slot="createTime" slot-scope="record">{{ format(record.createTime) }}</div>
        <div slot="annexType" slot-scope="record">{{ record.annexType | systemFilter('annexType') }}</div>
        <div slot="annexStatus" slot-scope="record">{{ record.annexStatus | systemFilter('annexStatus') }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="viewDetail(record)">查看</span>
          <span :class="[!canUpdate(record) ? 'grey-text' : '']" class="color-0067cc cursor-pointer" @click="toEditPage(record, true)">更新</span>
          <span class="color-0067cc cursor-pointer" @click="toEditPage(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"

import dictionary from '@/utils/newDictionary'
import oldDictionary from '@/utils/dictionary'
import { mapState, mapActions } from 'vuex'
import dayJs from "dayjs"
import moment from 'moment'
import uploadCanRemove from "@/mixin/uploadCanRemove"
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue"
import serviceNameList from '@/config/default/service.config.js'
import { debounce, cloneDeep } from 'lodash'
import { safeAnnexList, safeAnnexDelete, safeAnnexExcelExport } from '@/services/specialDevice'
import mixin from '../mixin'
export default {
  components: { UploadBtnStyle },
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove, mixin],
  data() {
    return {
      tableSpinning: false,
      formInline: {
      },
      modalVisible: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      userId: '',
      columns: [
        {
          title: '附件编号',
          scopedSlots: { customRender: 'annexNum' },
          width: 200
        },
        {
          title: '所属组织',
          dataIndex: 'corporationName',
          width: 200
        },
        {
          title: '保管部门',
          dataIndex: 'saveDept',
          width: 200
        },
        {
          title: '保管人',
          dataIndex: 'savePerson',
          width: 200
        },
        {
          title: '附件类型',
          scopedSlots: { customRender: 'annexType' },
          width: 150
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'annexStatus' },
          width: 150
        },
        {
          title: '检验日期',
          dataIndex: 'checkDate',
          width: 150
        },
        {
          title: '下次检验日期',
          dataIndex: 'nextCheckDate',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
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
      // 导入文件地址
      importAction: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/api/ehs/danger/safeAnnexExcel/importFile` : `/api/ehs/danger/safeAnnexExcel/importFile`,
    }
  },
  created() {
    this.setRouterCode("safeAttachAccount")
    this.getDataList()
  },
  activated() {
    setTimeout(() => {
      if (!this.keepalive) {
        this.iRest()
      }
    }, 20);
  },
  methods: {
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      if (this.formInline.checkDate && this.formInline.checkDate.length > 1) {
        params.checkDateStart = moment(this.formInline.checkDate[0]).format('YYYY-MM-DD')
        params.checkDateEnd = moment(this.formInline.checkDate[1]).format('YYYY-MM-DD')
      }
      if (this.formInline.nextCheckDate && this.formInline.nextCheckDate.length > 1) {
        params.nextCheckDateStart = moment(this.formInline.nextCheckDate[0]).format('YYYY-MM-DD')
        params.nextCheckDateEnd = moment(this.formInline.nextCheckDate[1]).format('YYYY-MM-DD')
      }
      this.tableSpinning = true
      this.formInline.saveDeptCode = this.formInline.deptId
      return safeAnnexList(params)
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
    // 查询
    iSearch() {
      this.page.pageNo = 1
      // 获取列表
      this.formInline.saveDeptCode = this.formInline.deptId
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    canUpdate(row) {
      if (+row.equipmentStatus === 1) {
        if (+row.flag === 1) {
          return true
        }
        return false
      }
      return true
    },
    deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            safeAnnexId: row.safeAnnexId
          }
          const { code } = await safeAnnexDelete(para)
          if (+code === 20000) {
            this.$antMessage.success('删除成功')
            this.getDataList()
          }
        }
      })
    },
    viewDetail(row) {
      this.$router.push({
        path: '/safeManage/deviceSafeManage/specialeDevice/safeAttachView',
        query: {
          id: row.safeAnnexId,
        }
      })
    },
    toEditPage(row, flag) {
      if (flag && !this.canUpdate(row)) {
        return
      }
      this.$router.push({
        path: '/safeManage/deviceSafeManage/specialeDevice/safeAttachEdit',
        query: { id: row.safeAnnexId }
      })
    },
    toAddPage() {
      this.$router.push({
        path: '/safeManage/deviceSafeManage/specialeDevice/safeAttachCreate'
      })
    },

    showChooseModal() {
      this.modalVisible = true
      // this.$router.push({
      //   path: '/chemicalsIdentification/msdsApproveCreate'
      // })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.iRest()
    },
    // 批量导出
    async exportAll() {
      const name = '安全附件批量导出'
      const params = {
        ...this.formInline
      }
      if (this.formInline.checkDate && this.formInline.checkDate.length > 1) {
        params.checkDateStart = moment(this.formInline.checkDate[0]).format('YYYY-MM-DD')
        params.checkDateEnd = moment(this.formInline.checkDate[1]).format('YYYY-MM-DD')
      }
      if (this.formInline.nextCheckDate && this.formInline.nextCheckDate.length > 1) {
        params.nextCheckDateStart = moment(this.formInline.nextCheckDate[0]).format('YYYY-MM-DD')
        params.nextCheckDateEnd = moment(this.formInline.nextCheckDate[1]).format('YYYY-MM-DD')
      }
      let res = await safeAnnexExcelExport(params);
      if (res) {
        const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + '.xlsx';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
    },
    // 导入模板下载
    downloadTemplate() {
      window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/安全附件导入模板.xlsx`)
    },
    getRowClass(row) {
      if (+row.flag === 0) {
        return 'overdue-i'
      }
      if (+row.flag === 1) {
        return 'danger-i'
      }
      if (+row.flag === 2) {
        return 'tips-i'
      }
      return ''
    },
  }
}
</script>

<style lang="less" scoped>
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
.icon-cell {
  display: flex;
  align-items: center;
  span {
    flex: 1;
    width: 0;
  }
}
.cell-i {
  flex-basis: 10px;
}
.overdue-i {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f00;
}
.danger-i {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff0;
}
.grey-text {
  color: #ccc;
  cursor: not-allowed;
}
.mark-illus-container {
  // float: right;
  margin: 10px 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > span {
    i {
      margin-right: 10px;
    }
    margin-left: 20px;
  }
}
.tips-i {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.8;
  background: #00f;
}
.btn {
  margin-left: 20px;
}
</style>
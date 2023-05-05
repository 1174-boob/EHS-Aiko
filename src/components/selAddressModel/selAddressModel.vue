<template>
  <a-modal class="clx-model" centered title="选择收货地址" :visible="selectModel" :footer="null" @cancel="closeSelectModel" :maskClosable="false">
    <!-- clx-model-body -->
    <div class="clx-model-body clx-modal-body-has-top-btn clx-modal-body-no-form beauty-scroll">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <div class="clx-btn-dashed-box" style="margin-bottom: 20px;">
          <a-button type="dashed" @click="openAddAddressModel">
            <!-- <a-icon type="plus" /> -->
            新增收货地址
          </a-button>
        </div>

        <!-- 表格 -->
        <div class="user-table">
          <a-table :columns="columns" :data-source="dataList" :rowKey="tableRowKey" :pagination="false" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'radio',}"></a-table>
        </div>
        <!-- 页码 -->
        <div class="table-pagination">
          <a-pagination simple :current="page.pageNo" :pageSize="page.pageSize" :total="page.total" show-less-items showQuickJumper @change="pageNoChange" />
          <span class="table-pagination-totel">
            共
            <span>{{ page.total }}</span>
            条
          </span>
        </div>
      </a-spin>
    </div>
    <!-- clx-model-btn -->
    <div class="clx-model-btn">
      <a-button type="dashed" @click="closeSelectModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="selectModelSubmit">确定</a-button>
    </div>
  </a-modal>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
import { contractGetAddressAll } from "@/services/api";
import { cloneDeep } from 'lodash'
export default {
  mixins: [teableCenterEllipsis, teableSelected],
  props: ['selectModel', 'addressList', 'addressInfo'],
  data() {
    return {
      columns: [
        {
          title: "姓名",
          dataIndex: "addressOwer",
          key: "addressOwer",
          width: 130,
        },
        {
          title: "手机号",
          dataIndex: "contactNumber",
          key: "contactNumber",
          width: 130,
        },
        {
          title: "收货地址",
          dataIndex: "addressDetail",
          key: "addressDetail",
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p >
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
      ],
      tableRowKey: 'addressId',
      dataList: [],
      loading: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      spinning: true,
    }
  },
  mounted() {

  },
  methods: {
    // 获取地址列表
    getTableList() {
      this.spinning = true
      let apiData = { ...this.page, total: undefined }
      contractGetAddressAll(apiData)
        .then(res => {
          let { list: dataList, total } = res.data ? res.data : { list: [], total: 0 }
          this.dataList = cloneDeep(dataList)
          this.page.total = total
          // 处理页码 问题
          if (this.dataList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
          this.selectedRow = this.dataList.filter(item => {
            return item.addressId == this.addressInfo.addressId
          })
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 设置列表和当前选择的项
    setDataList() {
      let addressId = this.addressInfo.addressId ? this.addressInfo.addressId : null
      this.selectedRowKeys = addressId ? [addressId] : []
    },
    // 打开新建地址model
    openAddAddressModel() {
      this.$emit('openAddAddressModel')
    },
    // 关闭选择地址model
    closeSelectModel() {
      this.$emit('closeSelectModel')
    },
    selectModelSubmit() {
      this.$emit('setAddressInfo', this.selectedRow[0])
      // 关闭选择地址model
      this.closeSelectModel()
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getTableList()
    },
  },
  watch: {
    selectModel(newVal) {
      if (newVal) {
        this.setDataList()
        // 获取地址列表
        this.getTableList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.clx-model-body {
  margin-bottom: 20px;
}
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}
.table-pagination {
  display: flex;
  margin: 15px 15px;
  justify-content: flex-end;
  align-items: center;
  .table-pagination-totel {
    margin-left: 15px;
    & > span {
      color: #0065c8;
    }
  }
}
</style>

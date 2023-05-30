<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="具体位置">
          <a-input v-model="formInline.location" placeholder="请输入具体位置"></a-input>
        </a-form-model-item>
        <a-form-model-item label="设备编号">
          <a-input v-model="formInline.equipCode" placeholder="请输入设备编号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="设备名称">
          <a-input v-model="formInline.equipName" placeholder="请输入设备名称"></a-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="设备类型">
          <a-select v-model="formInline.equipType" placeholder="请选择设备类型">
            <a-select-option v-for="item in equipTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item> -->
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :rowKey="(record, index)=>{return record.equipFireId}"
        :pagination="false"
      >
        <div slot="status" slot-scope="record">{{findText(statusList, "key", record.status).value || '--'}}</div>
        <div slot="equipType" slot-scope="record">{{findText(equipTypeList, "key", record.equipType).value || '--'}}</div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dictionary from '@/utils/dictionary'
import { debounce } from 'lodash';
import { gasEquipPageList } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis,cancelLoading],
  data() {
    return {
      companyName: "",
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      equipTypeList: [],
      columns:[
        {
          title: '具体位置',
          dataIndex: 'location',
          width: 150,
          customRender: (text) => {
           return text = text ? text : '--'
          },
        },
        {
          title: '设备编号',
          dataIndex: 'equipCode',
          width: 150
        },
        {
          title: '设备名称',
          dataIndex: 'equipName',
          width: 150
        },
        {
          title: '设备品牌',
          dataIndex: 'equipBrand',
          width: 150
        },
        {
          title: '预约测试时间',
          dataIndex: 'createTime',
          width: 200,
          customRender: (text) => {
           return text = text ? text : '--'
          },
        },
        {
          title: '恢复时间',
          dataIndex: 'recoverTime',
          width: 200,
          customRender: (text) => {
           return text = text ? text : '--'
          },
        },
      ],
      tableDataList: [],
      statusList:dictionary("alarmStatus"),
      equipTypeList:dictionary("equipType"),
    }
  },
  created() {
    this.columns.splice(0, 0, this.addCommonColumnItem(150));
    this.getDataList();
    this.companyName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyName;

  },
  methods: {
    //获取列表
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        status:4
      }
      return gasEquipPageList(params).then((res) => {
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      })
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
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
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    
    //获取字典
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
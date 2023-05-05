<template>
  <div class="labeling-detail clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="edit(record.mapId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteLabel(record.mapId)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal title="编辑地图标注" :visible="visible" :cancelFn="cancelVisible">
      <template slot="form">
        <a-form-model
          ref="chinaForm"
          :model="chinaForm"
          :rules="chinaRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item label="省份" prop="mapId">
            <a-select v-model="chinaForm.mapId" placeholder="请选择省份" allowClear labelInValue disabled>
              <a-select-option v-for="item of chinaArr" :key="item.adcode" :value="item.adcode">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择组织" prop="corporationList">
            <a-select v-model="chinaForm.corporationList" placeholder="请选择组织" mode="multiple" allowClear labelInValue>
              <a-select-option v-for="item of getCommonAddOrgnizeList" :key="item.id" :value="item.id">{{item.orgAbbrName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelVisible">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="chinaConfirm" :loading="loading">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { china } from "./china";
import { formValidator } from "@/utils/clx-form-validator.js";
import { mapLabelpageList,mapLabelDetail,mapLabelUpdate,mapLabelDelete } from "@/services/api.js"
export default {
  mixins: [teableCenterEllipsis],
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 20 }, // 设置右边表单宽度
      chinaArr: china,
      visible: false,
      loading: false,
      chinaForm:{
        mapId: undefined,
        corporationList: undefined,
      },
      columns: [
        {
          title: '所属省份（直辖市）',
          dataIndex: 'mapName',
        },
        {
          title: '组织',
          dataIndex: 'corporation',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 300
        }
      ],
      dataSource:[],
      chinaRules: {
        mapId: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        corporationList: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      }
    }
  },
  created() {
    this.setRouterCode("environmentalDataMap");
    this.getPageList();
  },
  methods: {
    async getPageList() {
      const params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      const data = await mapLabelpageList(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getPageList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getPageList();
    },
    cancelVisible() {
      this.visible = false;
      this.chinaForm = {
        mapId: undefined,
        corporationList: undefined,
      };
    },
    edit(mapId) {
      this.visible = true;
      mapLabelDetail({mapId}).then(res=>{
        const data = res.data;
        const corporationList = res.data.corporationList;
        this.chinaForm.mapId = {
          key: data.mapId,
          label: data.mapName
        };
        const list = [];
        for(let item of corporationList) {
          const arr = {
            key: item.corporationId,
            label: item.corporationName,
          };
          list.push(arr)
        }
        this.chinaForm.corporationList = list
      }).catch(err=>{
        console.log(err);
      })
    },
    deleteLabel(mapId) {
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          mapLabelDelete({mapId}).then(res => {
            this.$antMessage.success('删除成功');
            this.getPageList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    // 标注地图弹框
    chinaConfirm() {
      if (!formValidator.formAll(this, 'chinaForm')) {
        return;
      }
      this.loading = true;
      const list = this.chinaForm.corporationList;
      const corporationList = list.map(item=>{
        const newList = {
          corporationId: item.key,
          corporationName: item.label,
        }
        return newList
      })
      const params = {
        corporationList,
        mapId: this.chinaForm.mapId.key,
        mapName: this.chinaForm.mapId.label,
      }
      mapLabelUpdate(params).then(res=>{
        this.loading = false;
        this.visible = false;
        this.$antMessage.success("操作成功");
        this.getPageList();
      }).catch(err=>{
        console.log(err);
        this.loading = false;
      })
    }
  }

}
</script>

<style>

</style>
<template>
  <div class="bitmap-manage clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="false"></CommonDept>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable>
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="pictureList" slot-scope="record">
          <div class="picture-avatar cursor-pointer" v-if="record.picturePath">
            <img :src='record.picturePath' @click="previewImg(record.picturePath)"/>
          </div>
          <div v-else>--</div>
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="preview(record.pointId)">查看</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
// import dictionary from '@/utils/dictionary';
import { pointList } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: "序号",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: '点位图',
          scopedSlots: { customRender: 'pictureList' },
          key: "pictureList",
          customCell: this.customCell,
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          // fixed: 'right',
          width: 200
        },
      ]
    }
  },
  created() {
    this.setRouterCode("bitmapManage");
    this.columns.splice(1, 0, this.addCommonColumnItem(300));
    this.getPageList();
  },
  methods: {
    getPageList() {
      const params = {
        ...this.formInline,
        pageSize: 10000,
        pageNo: 1
      }
      pointList(params).then(res=>{
        this.dataSource = res.data;
      }).catch(err=>{
        console.log(err);
      })
    },
    // 查看
    preview(id) {
      this.$router.push({path:'/environmentManage/environmental/envViewMark',query:{id}})
    },
    // 图片预览
    previewImg(url) {
      this.$hevueImgPreview(url);
    },
    // 点位图单元格样式
    customCell(record) {
      if(record) {
        return {
          style: {
            'padding': '0',
          },
        };
      }
    },
    // 查询
    iSearch() {
      this.getPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.formInline = {};
      this.getPageList();
    }, 250, { leading: true, trailing: false }),
  }
}
</script>

<style scoped lang="less">
.bitmap-manage {
  .picture-avatar {
    img {
      width: 40px;
      height: 40px;
      margin: 0 2px;
    }
  }
}

</style>
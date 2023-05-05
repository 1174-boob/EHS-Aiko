<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item class="flex" label="建筑、楼层" prop="buildingAndFloor">
          <a-cascader change-on-select v-model="formInline.buildingAndFloor" :options="options" placeholder="请选择建筑、楼层" />
        </a-form-model-item>
        <!-- <a-form-model-item label="建筑">
          <a-input v-model="formInline.name" placeholder="请输入建筑"></a-input>
        </a-form-model-item>
        <a-form-model-item label="楼层">
          <a-input v-model="formInline.name" placeholder="请输入楼层"></a-input>
        </a-form-model-item> -->
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="showAddModal">
          <a-icon type="plus"/>新增平面图
        </a-button>
        <a-button type="primary" size="small" @click="toBuildingDataPage">建筑结构数据</a-button>
      </div>
    </DashBtn>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="mark-list-container" v-if="markList.length > 0">
        <MarkItem v-for="item in markList" 
        :data="item" :key="item.riskFourColorPictureId"
        @deleteCallback="deleteCallback"
        @clickChange="clickChange"/>
      </div>
      <div v-else class="no-data">
        暂无数据
      </div>
    </a-spin>
    <a-pagination :page="page" v-if="page.total > 0" @showSizeChange="onShowSizeChange" :current="page.pageNo"  @change="pageNoChange"  :total="page.total" show-size-changer show-quick-jumper :show-total="total => `共 ${total} 条`" />
    <AddMarkModal ref="markModalRef" @successCallback="successCallback" :curRow="curRow" :visible.sync="visible" />
  </div>
</template>

<script>
import { debounce, cloneDeep } from 'lodash'
import MarkItem from './comp/MarkItem'
import AddMarkModal from './comp/AddMarkModal'
import { fourColorList, fourColorAdd, fourColorUpdate, fourColorDelete, getRiskBuildingTreeData } from "@/services/dangerSource/fourColor"

export default {
  components: {
    MarkItem,
    AddMarkModal
  },
  data() {
    return {
      formInline: {

      },
      markList: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      options: [],
      spinning: true,
      curRow: null,
      loading: false,
      addModalVisible: false,
      visible: false
    }
  },
  watch: {
    'formInline.corporationId': function(newVal){
      if (newVal) {
        this.onCorporationIdChange(newVal)
      }
    }
  },
  created() {
    this.setRouterCode('fourColorList')
    this.getDataList()
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    showAddModal() {
      this.curRow = null
      this.visible = true
    },
    // 查询
    iSearch() {
      // 获取列表
      this.getDataList(this.formInline)
        .finally(() => {
          // this.cancelLoading()
        })
    },
    successCallback() {
      this.getDataList()
    },
    deleteCallback() {
      this.getDataList()
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
    async onCorporationIdChange(val) {
      let para = {
        corporationId: val
      }
      const { data } = await getRiskBuildingTreeData(para)
      if (data) {
        this.options = data || []
      }
    },
    async getDataList() {
      let para = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.formInline,
      }
      if (this.formInline.buildingAndFloor && this.formInline.buildingAndFloor.length > 0) {
        para.buildingId = this.formInline.buildingAndFloor[0] || ''
        para.floorId = this.formInline.buildingAndFloor[1] || ''
      }
      const { data } = await fourColorList(para)
      this.spinning = false
      if (data) {
        this.markList = data.list
        this.page.total = data.total
      }
    },
    //点击更换图片
    clickChange(data) {
      this.curRow = data
      this.visible = true
      this.$nextTick(() => {
        this.$refs.markModalRef.loadData(data)
      })
    },
    toBuildingDataPage() {
      this.$router.push({
        path: '/safeManage/dualControlManage/riskManage/buildingData'
      })
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
  }
}
</script>

<style scoped lang="less">
/deep/.ant-pagination{
  text-align: right;
  margin:0 10px;
}
.mark-list-container{
  display: grid;
  list-style: none;
  grid-template-columns: repeat(auto-fill,minmax(305px, 1fr));
  grid-gap: 20px;
  margin-bottom:30px;
}
.no-data{
  text-align: center;
  color: #999;
  height: 300px;
  line-height: 300px;
}
</style>
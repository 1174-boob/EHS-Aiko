<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="false"></CommonDept>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="showAddModal">
          <a-icon type="plus"/>新增点位图
        </a-button>
        <!-- <a-button type="primary" size="small" @click="toPolluteDataPage">污染物数据</a-button> -->
        <a-button type="primary" size="small" @click="toMarkDataPage">点位图数据</a-button>
      </div>
    </DashBtn>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="mark-list-container" v-if="markList.length > 0">
        <MarkItem v-for="item in markList" 
        :data="item" :key="item.pointId"
        @deleteCallback="deleteCallback"
        @clickChange="clickChange"/>
      </div>
      <div v-else class="no-data">
        暂无数据
      </div>
    </a-spin>
    <AddMarkModal ref="markModalRef" @successCallback="successCallback" :curRow="curRow" :visible.sync="visible" />
  </div>
</template>

<script>
import { debounce, cloneDeep } from 'lodash'
import MarkItem from './comp/MarkItem'
import AddMarkModal from './comp/AddMarkModal'
import { markPointList, markPointAdd, markPointEdit, markPointDelete } from "@/services/envWatch/markManage"

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
      options: [],
      spinning: false,
      curRow: null,
      loading: false,
      addModalVisible: false,
      visible: false
    }
  },
  created() {
    this.setRouterCode('pointMapManage')
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
      let para = {...this.formInline}
      if(this.$route.query.corporationId) {
        para.corporationId = this.$route.query.corporationId
      }
      console.log(para, 'para')
      this.getDataList(para)
        .finally(() => {
          // this.cancelLoading()
        })
    },
    // 查询
    // 重置
    iRest: debounce(function () {
      this.formInline = {};
      this.getDataList(this.formInline)
    }, 250, { leading: true, trailing: false }),
    successCallback() {
      this.getDataList()
    },
    deleteCallback() {
      this.getDataList()
    },
    // 重置
    // async onCorporationIdChange(val) {
    //   let para = {
    //     corporationId: val
    //   }
    //   const { data } = await getRiskBuildingTreeData(para)
    //   if (data) {
    //     this.options = data || []
    //   }
    // },
    async getDataList(para) {
      if(this.$route.query.corporationId) {
        para.corporationId = this.$route.query.corporationId
      }
      const { data } = await markPointList(para)
      this.spinning = false
      this.markList = data || []
    },
    //点击更换图片
    clickChange(data) {
      this.curRow = data
      this.visible = true
      this.$nextTick(() => {
        this.$refs.markModalRef.loadData(data)
      })
    },
    // toPolluteDataPage() {
    //   this.$router.push({
    //     path: '/environmentManage/environmental/polluteDataList'
    //   })
    // },
    toMarkDataPage() {
      this.$router.push({
        path: '/environmentManage/environmental/pointMapDataList'
      })
    }
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
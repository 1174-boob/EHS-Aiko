<template>
  <div class="item-container">
    <div class="img" ref="imgRef" 
    :style="{'backgroundImage': 'url(' + imgSrc + ')',
    'backgroundRepeat': 'no-repeat', 
    'backgroundPosition': 'center center',
    'backgroundSize': '100% 100%'
    }">
      <!-- <ui-marker ref="aiPanel-editor" class="ai-observer"
        id="uiMarker"
        :uniqueKey="uuid"
        :ratio="ratio"
        @vmarker:onImageLoad="onImageLoad"
        :readOnly="true"
        :imgUrl="imgSrc">
      </ui-marker> -->
    </div>
    <div class="btn-container">
      <span @click="showAddMarkModal">更换图片</span>
      <span @click="toAddMark">标注点位</span>
      <span @click="toViewMark">查看</span>
      <span @click="deleteItem">删除</span>
    </div>
    <!-- <AddMarkModal ref="markModalRef" :visible.sync="visible" :curRow="curRow"/> -->
  </div>
</template>
<script>
import AddMarkModal from './AddMarkModal'
import { AIMarker } from 'vue-picture-bd-marker'
import { markPointDelete } from "@/services/envWatch/markManage"
export default {
  // components: { 'ui-marker': AIMarker, AddMarkModal },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      curRow: null,
      visible: false,
      ratio: 0
    }
  },
  created() {

  },
  computed: {
    imgSrc() {
      return  (this.data || {}).picturePath
    },
    uuid() {
      return (this.data || {}).pointId
    },
  },
  methods:{
    toAddMark() {
      this.$router.push({
        path: '/environmentManage/environmental/envAddMark',
        query: {
          id: this.data.pointId
        }
      })
    },
    deleteItem() {
      this.$antConfirm({
        title: '确定删除吗',
        onOk: async () => {
          let para = {
            pointId: this.data.pointId
          }
          await markPointDelete(para)
          this.$antMessage.success('删除成功')
          this.$emit('deleteCallback')
        }
      })
    },
    toViewMark() {
      this.$router.push({
        path: '/environmentManage/environmental/envViewMark',
        query: {
          id: this.data.pointId
        }
      })
    },
    showAddMarkModal() {
      this.curRow = this.data
      this.$emit('clickChange', this.curRow)
    },
    onImageLoad() {
      // this.renderData()
    },
    renderData(data = []) {
        this.$refs['aiPanel-editor'].getMarker().renderData(data)
    },
  }

}
</script>

<style scoped lang="less">
.item-container{
  .img{
    height: 200px;
    overflow: hidden;
  }
  .ai-observer{
    width:100%;
  }
  .btn-container{
    display: flex;
    height: 40px;
    background: #FAFAFA;
    border-radius: 0 0 2px 2px;
    span{
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover{
        background: #f1f1f1;
      }
    }
  }
  .name{
    margin-top:8px;
    height: 40px;
    line-height: 40px;
    text-align:center;
    background: #FAFAFA;
    box-shadow: inset 0px -1px 0px 0px rgba(232,232,232,1);
    border-radius: 2px 2px 0 0;
  }
}
/deep/.g-image-op{
  display: none;
}
/deep/.annotation{
  opacity: 0.9;
  background: #0067CC;
}
</style>
<template>
  <div class="add-mark-container">
    <HasFixedBottomWrapper>
    <DashBtn>
      <div v-if="!disabled">
        <!-- <a-button type="dashed" @click="deleteSelectItem">删除</a-button> -->
        <a-button class="clear-btn" type="primary" size="small" @click="clearAll">清空标注</a-button>
      </div>
    </DashBtn>
    <div class="page-container">
      <div class="marker-container">
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <ui-marker ref="aiPanel-editor" class="ai-observer"
            id="uiMarker"
            :uniqueKey="uuid"
            :ratio="0"
            :readOnly="disabled"
            @click.native="onUIClick"
            @vmarker:onAnnoSelected="onAnnoSelected"
            @vmarker:onAnnoAdded="onAnnoAdded"
            @vmarker:onImageLoad="onImageLoad"
            :imgUrl="currentImage">
          </ui-marker>
        </a-spin>
        <FromSuperMarkPop v-if="fromSuper" :disabled="disabled" ref="markPopRef" @popConfirm="popConfirm" :visible.sync="popVisible" :markItem="markItem" @delete="deleteSelectItem"/>
        <MarkPop v-else :disabled="disabled" ref="markPopRef" @popConfirm="popConfirm" :visible.sync="popVisible" :markItem="markItem" @delete="deleteSelectItem"/>
      </div>
    </div>
    
    <div slot="fixedBottom">
      <FixedBottom class="fixed-button-container">
        <a-button @click="onCancel">返回</a-button>
        <a-button v-if="!disabled" type="primary" @click="onSubmit">保存</a-button>
      </FixedBottom>
    </div>
    </HasFixedBottomWrapper>
  </div>
</template>

<script>
import MarkPop from './comp/MarkPop'
import FromSuperMarkPop from './comp/FromSuperMarkPop'
import FixedBottom from "@/components/commonTpl/fixedBottom"
import { AIMarker } from 'vue-picture-bd-marker'
import { markPointDetail, markPointSave, monitorInstrumentOptions } from "@/services/envWatch/markManage"
// import { fourColorDetail, fourColorMarkInfoSave } from "@/services/dangerSource/fourColor"
import { debounce, cloneDeep } from 'lodash'
export default {
  components: { 'ui-marker': AIMarker, MarkPop, FromSuperMarkPop, FixedBottom },
    data() {
      return {
        uuid:'',
        code: 1,
        markItem: null,
        dataLength: 0,
        isRerender: false,
        popVisible: false,
        // currentImage: '',
        spinning: true,
        itemList: [],
        monitorInstrumentOptions: [],
        colorMap: {
          significantRisk: 'hign-risk',
          largerRisk: 'big-risk',
          generalRisk: 'normal-risk',
          lowRisk: 'low-risk'
        },
        currentImage: null,
      }
    },
    computed: {
      disabled() {
        return this.$route.meta && this.$route.meta.isView
      },
      pointId() {
        return (this.$route.query || {}).id
      },
      fromSuper() {
        return (this.$route.query || {}).from === 'super'
      }
    },
    created() {
      this.setRouterCode('pointMapManage')
      this.getDetail()
      // this.getMonitorInstrumentOptions()
    },
    methods: {
      onCancel() {
        this.setKeepalive(true)
        this.$router.push({
          path: '/environmentManage/environmental/pointMapManage',
        })
      },
      // async getMonitorInstrumentOptions() {
      //   const { data } = await monitorInstrumentOptions()
      //   this.monitorInstrumentOptions = data || []
      //   console.log(data, '----data -- -')
      // },
      onSubmit: debounce(async function() {
        let data = this.$refs['aiPanel-editor'].getMarker().getData() || []
        let para = {
          pointId: this.pointId,
          labelList: [...data]
        }
        await markPointSave(para)
        this.$antMessage.success('保存成功')
        this.onCancel()
      },250),
      callbackDelete() {

      },
      //获取详情数据
      async getDetail() {
        let para = {
          pointId: this.pointId
        }
        const { data } = await markPointDetail(para)
        if (data) {
          this.uuid = data.pointId
          this.currentImage = data.picturePath
          this.itemList = data.monitorPointLabelVoList
          if (this.itemList.length > 0) {
            this.renderData(data.monitorPointLabelVoList)
          }
        }
      },
      //pop浮层选择风险点确定回调
      popConfirm(data) {
        console.log(data, 'data')
        this.$refs['aiPanel-editor'].getMarker().setTag({
          ...data
        });
        let container = this.$el.querySelector('#uiMarker')
        let selectedDom = container.querySelector('.annotation.selected')
        // this.renderColor(selectedDom, data.riskLevel)
      },
      //设置标注的颜色
      renderColor(dom, targetRiskLevel) {
        if (dom) {
          let markItem = this.getMarkItemByDom(dom)
          if (!targetRiskLevel && !markItem.riskLevel) {
            return
          }
          let className = this.colorMap[targetRiskLevel || markItem.riskLevel]
          if (dom.classList.contains(className)) {
            return
          }
          this.removeClass(dom)
          dom.classList.add(className)
        } else {
          let container = this.$el.querySelector('#uiMarker')
          let selectedDom = container.querySelector('.annotation.selected')
          if (selectedDom) {
            //删除默认的渲染完选中样式和编辑小点
            let dot = selectedDom.querySelectorAll('.resize-dot')
            if (dot && dot.length) {
              dot.forEach(item => {
                item.classList.add('hidden')
              })
            }
            selectedDom.classList.remove('selected')
          }
          let markDom = container.querySelectorAll('.annotation')
          markDom.forEach(item => {
            this.renderColor(item)
          })
        }
      },
      removeClass(dom){
        Object.keys(this.colorMap).forEach(item => {
          dom.classList.remove(this.colorMap[item])
        })
      },
      onImageLoad(data) {
        this.spinning = false
        //图片加载完成后回调
      },
      onAnnoAdded(data) {
        // this.setTag()
        this.newItemAddClickListener(data)
      },
      newItemAddClickListener(data) {
        //新增标注添加点击事件（阻止冒泡）
        let container = this.$el.querySelector('#uiMarker')
        let selectedDom = container.querySelector('.annotation.selected')
        if (!selectedDom) {
          return
        }
        selectedDom.addEventListener('click',(e)=> {
          if (this.disabled) {
            //禁用情况下的点击
            this.onAnnoSelected(data)
          }
          e.stopPropagation()
        })
        setTimeout(()=> {
          if (!this.isRerender) {
            this.onAnnoSelected(data)
          }
          this.dataLength--
          if (this.dataLength === 0) {
            this.isRerender = false
          }
        })
      },
      clearAll() {
        //清空所有标注
        this.popVisible = false
        this.$antConfirm({
          title: '确定清空所有标注吗？',
          onOk: () => {
            this.$refs['aiPanel-editor'].getMarker().clearData()
          }
        })
      },
      //根据dom uuid获取对应标注的信息
      getMarkItemByDom(dom) {
        let uuid = dom.getAttribute("data-uuid")
        let data = this.$refs['aiPanel-editor'].getMarker().getData()
        return data.find(item => {
          return item.uuid === uuid
        }) || {}
      },
      deleteSelectItem() {
        //删除选中的标注
        let container = this.$el.querySelector('#uiMarker')
        let selectedDom = container.querySelector('.annotation.selected')
        if (!selectedDom) {
          return
        }
        let uuid = selectedDom.getAttribute("data-uuid")
        let data = this.$refs['aiPanel-editor'].getMarker().getData()
        let index = data.findIndex(item => {
          return item.uuid === uuid
        })
        if(index !== -1) {
          data.splice(index, 1)
          this.$refs['aiPanel-editor'].getMarker().clearData()
          //控制渲染数据后阻止选中项弹出浮层
          if (data.length > 0) {
            this.renderData(data)
          }
        }
        this.popVisible = false
      },
      onAnnoSelected(data) {
        //选中标注回调
        //判断是否是点击同一
        if (this.markItem && data && (this.markItem.uuid === data.uuid)) {
          //前后点击的同一个标注，判断是点击还是移动，点击不做操作，移动则不显示浮层
          let oldPosition = this.markItem.position
          let newPosition = data.position
          if ((oldPosition.x !== newPosition.x) || (oldPosition.y !== newPosition.y) 
          || (oldPosition.x1 !== newPosition.x1) || (oldPosition.y1 !== newPosition.y1)) {
            this.popVisible = false
          } else {
            this.popVisible = !this.popVisible
          }
        } else {
          this.popVisible = true
        }
        this.markItem = data
        if (this.popVisible) {
          this.$nextTick(() => {
            this.$refs.markPopRef.loadData(data)
          })
        }
      },
      renderData(data) {
        //初始渲染标注
        data = data || []
        this.isRerender = true
        this.dataLength = data.length
        this.$refs['aiPanel-editor'].getMarker().renderData(data)
        this.renderColor()
      },
      getMarkData() {
        //获取标注数据
      },
      setTag() {
        //设置标注标签信息
      },
      onUIClick() {
        this.popVisible = false
      }
    }
}
</script>

<style scoped lang="less">
.add-mark-container{
  width:70%;
  display: flex;
}
.page-container{
  display:flex;
  margin-bottom:200px;
}
.clear-btn{
  margin-top: 10px;
}
/deep/.g-image-op{
  display: none;
}
/deep/.annotation{
  opacity: 0.8;
  background: rgb(255,165,0);
  &.selected{
    opacity: 0.6;
  }
  &.hign-risk{
    background: rgb(255, 0, 0);
  }
  &.big-risk{
    background: rgb(255,165,0);
  }
  &.normal-risk{
    background: rgb(255, 255, 0);
  }
  &.low-risk{
    background: rgb(0, 0, 255);
  }
}

/deep/.fixed-bottom{
  bottom: 0;
  left: 0;
  width: 100%;
}
.marker-container{
  flex:1;
  position: relative;
}
</style>
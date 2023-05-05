<template>
  <div class="map-labeling clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <DashBtn class="map-btn">
      <div class="labeling">
        <a-button type="dashed" @click="dimension">地图标注</a-button>
        <a-button type="dashed" @click="jumpDetail">标注详情</a-button>
      </div>
      <a-button @click="clearLabel">清空标注</a-button>
    </DashBtn>
    <div class="map-tooltip">
      <div class="tip"><div class="tip1"></div><span>预警</span></div>
      <div class="tip"><div class="tip2"></div><span>报警</span></div>
    </div>
    <div id="map"></div>
    <CommonModal title="地图标注" :visible="visible" :cancelFn="cancelVisible">
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
            <a-select v-model="chinaForm.mapId" placeholder="请选择省份" allowClear labelInValue>
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
import * as echarts from "echarts";
import chinaJson from "./chinaJson.json";
import { china } from "./china";
import { formValidator } from "@/utils/clx-form-validator.js";
import { mapLabelAdd,mapLabelList,clearMapLabel,pointList } from "@/services/api.js";
export default {
  data() {
    return {
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 20 }, // 设置右边表单宽度
      test: ['B1','B2'],
      chinaArr: china,
      visible: false,
      loading: false,
      chinaForm: {},
      hookToolTip: {},
      // 绘制图表
      mapOption: {
        zoom: 5,
        tooltip: {
          show: true,
          trigger: "item", // 触发类型
          enterable: true, //允许鼠标进入提示悬浮层中
          showContent: true,
          triggerOn: "click",
          backgroundColor: '#0067CC',
          textStyle: {
            color: "#fff" //设置文字颜色
          },
          borderWidth: 0,
          // hideDelay: '1',
          formatter: (value)=> {
            let resData = value.data;
            // console.log('----------------',value, resData);
            if (resData && resData.value && resData.value.length>=2) {
              let str = ''
              for (let [index,ele] of resData.value.entries()) {
                let cls = 'cor' + index;
                str += `<span class=${cls} style='color:${ele.status=='1' ? '#FFC757' : ele.status=='2' ? '#FF5757' : '#fff' };cursor:pointer' onclick="${this.corClick(ele,index)}">`+ ele.corporationName + '</span>' + '&nbsp;'
              }
              return `<div><div style='text-align:center;margin-bottom: 8px'>${resData.name}</div>${str}</div>`;
            }
          },
        },
        selectedMode: "single",
        geo: {
          // 设置地图的显示信息
          map: "china", // 显示区域名称
          select: { //选中之后颜色
            itemStyle: {
              color: null
            }
          },
          label: {
            show: true,
            normal: {
              show: true,
              textStyle: {
                color: "#000",
                fontSize: 12,
              },
            },
            emphasis: {
              show: true,
            },
          },
          roam: false,
          itemStyle: {
            normal: {
              borderColor: "#0067cc",
              areaColor: "#EAF4FF",
            },
            emphasis: {
              areaColor: "#6CB6FF",
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          regions: [],
          // left: "5%",
          // right: "5%",
          top: "2%",
          bottom: "5%",
        },
        series: [
          {
            type: "map",
            geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
            selectedMode:'single',
            data: [
              // { name: "北京",code:'110000', value: [{corporationId:'1234',corporationName:'B1'}] , status:'0---正常,1--预警,2=报警'},
            ],
          },
        ],
      },
      chinaRules: {
        mapId: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        corporationList: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      }

    };
  },
  created() {
    this.setRouterCode("environmentalDataMap");
    this.getMapLabelList();
  },
  mounted() {
    this.myEecharts();
    window.addEventListener("resize", ()=> {
      this.myChart?.resize();
    });
  },
  methods: {
    async getMapLabelList() {
      const data = await mapLabelList();
      const mapList = data.data;
      const list = [];
      const customSettings = [];
      for(let item of mapList) {
        const status = item.status; //status:'0---正常,1--预警,2=报警'
        let obj = {
          name: item.mapName,
          code: item.mapId,
          value: item.corporationList
        }
        list.push(obj);
        if(status=='1') {
          customSettings.push(
            {
              name: item.mapName,
              itemStyle: {
                normal: {
                  areaColor: "#FFC757", //#FFC757预警色
                },
              }
            },
          );
        } else if(status=='2') {
          customSettings.push(
            {
              name: item.mapName,
              itemStyle: {
                normal: {
                  areaColor: "#FF5757", //#FF5757报警色
                },
              }
            },
          );
        }
      }
      this.mapOption.series[0].data = list;
      this.mapOption.geo.regions = customSettings;
      this.myChart.setOption(this.mapOption);
    },
    myEecharts() {
      echarts.registerMap("china", chinaJson, {});
      //加载中国地图
      this.myChart = echarts.init(document.getElementById("map"));
      this.myChart.on("click",(param)=> {
        //地图省份点击事件
        const value = param.data?.value;
        if(value && value.length==1) {
          let corporationId = value[0].corporationId;
          Promise.all([this.getPointList(corporationId)]).then(res=>{
            const id = res[0];
            let from = 'super'
            this.$router.push({path:'/environmentManage/environmental/envViewMark',query:{id, from}})
          })
        }
      });
      this.myChart.setOption(this.mapOption);
    },
    // 点击弹框内现地
    corClick(item,index) {
      this.$nextTick(() => {
        let cls = 'cor' + index;
        let obj1 = document.getElementsByClassName(cls)[0];
        obj1.addEventListener('click', ()=> {
          let corporationId = item.corporationId;
          this.jumpViewMark(corporationId)
        });
      });
    },
    async jumpViewMark(corporationId) {
      const id = await this.getPointList(corporationId);
      let from = 'super'
      this.$router.push({path:'/environmentManage/environmental/envViewMark',query:{id, from}})
    },
    // 根据组织获取点位图id
    getPointList(corporationId) {
      return new Promise((resove,reject)=>{
        pointList({corporationId}).then(res=>{
          if(res.data && res.data.length) {
            resove(res.data[0].pointId)
          } else {
            this.$antMessage.warn("该组织下暂无点位图数据")
          }
        }).catch(err=>{
          reject(err)
        })
      })
      
    },
    // 标注
    dimension() {
      this.visible = true;
    },
    // 跳转详情
    jumpDetail() {
      this.$router.push("/environmentManage/environmental/labelingDetail")
    },
    // 清空标注
    clearLabel() {
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          clearMapLabel().then(res => {
            this.$antMessage.success('操作成功');
            this.getMapLabelList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    cancelVisible() {
      this.visible = false;
      this.chinaForm = {};
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
      mapLabelAdd(params).then(res=>{
        this.loading = false;
        this.visible = false;
        this.chinaForm = {};
        this.getMapLabelList();
        this.$antMessage.success("操作成功");
      }).catch(err=>{
        console.log(err);
        this.loading = false;
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.map-labeling {
  position: relative;
  .map-tooltip {
    // width: 65px;
    // height: 40px;
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    .tip {
      height: 20px;
      display: flex;
      align-items: center;
      margin-right: 8px;
      color: #000;
      .tip1 {
        display: inline-block;
        width: 30px;
        height: 15px;
        border-radius: 4px;
        background: #FFC757; //#FFC757预警色
        margin-right: 5px;
      }
      .tip2 {
        display: inline-block;
        width: 30px;
        height: 15px;
        border-radius: 4px;
        background: #FF5757; //#FF5757报警色
        margin-right: 5px;
      }
    }
    
  }
  .map-btn {
    justify-content: flex-start;
    .labeling {
      margin-right: 10px;
    }
  }
  #map {
    width: 100%;
    height: 1000px;
  }
}
</style>
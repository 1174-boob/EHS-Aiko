<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff" id="pdfDom">
    <PageTitle>管理绩效汇总</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="制造中心">
          <a-select v-model="formInline.centerId" placeholder="请选择制造中心">
            <a-select-option v-for="item in setCorporationTree" :key="item.corporationCode" :value="item.corporationCode">{{item.corporationName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="年份">
          <a-date-picker v-model="formInline.year" mode="year" format="YYYY" valueFormat="YYYY" @panelChange="yearChange" />
        </a-form-model-item>
        <a-form-model-item label="季度">
          <a-select v-model="formInline.quarter" placeholder="请选择季度">
            <a-select-option v-for="item in quarterList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
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
        <a-button type="dashed" @click="downloadPage">下载页面</a-button>
        <!-- 当表里的数据不全时，提交审批按钮置灰，不可点击； -->
        <a-button type="dashed" :loading="submitLoading" @click="submitApprove">提交审批</a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="isNoIndex" slot-scope="record">{{getMappingValue(isNoIndexList, "key", record.isNoIndex).value}}</div>
      </a-table>
    </CommonTable>
    <div class="m-t-20 m-b-20">备注：A：95分(含)以上；B：85分(含)~95分；C：85分以下</div>
    <SearchTerm>
      <a-form-model layout="inline" :model="chartFormInline" :colon="false">
        <a-form-model-item label="日期方式选择">
          <a-select placeholder="请选择" :default-value="'1'" v-model="chartFormInline.dataType" @change="dataTypeChange">
            <a-select-option v-for="item in dataTypeList" :key="item.key" :value="item.key" :title="item.value">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="年份">
          <a-date-picker mode="year" valueFormat="YYYY" format="YYYY" v-model="chartFormInline.year" @panelChange="chartYearChange" />
        </a-form-model-item>
        <a-form-model-item label="季度" v-if="chartFormInline.dataType == '1'">
          <a-select placeholder="请选择" :default-value="'1'" v-model="chartFormInline.reportDate">
            <a-select-option v-for="item in quarterList" :key="item.key" :value="item.key" :title="item.value">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="半年度" v-if="chartFormInline.dataType == '2'">
          <a-select placeholder="请选择" :default-value="'1'" v-model="chartFormInline.reportDate">
            <a-select-option v-for="item in dataTypeNextSnd" :key="item.key" :value="item.key" :title="item.value">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" @click="iSearchChart">查询</a-button>
          <a-button type="primary" @click="iRestChart">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div>
      <PageTitle>各组织管理绩效得分统计</PageTitle>
      <div class="echarts-wrapper">
        <!-- <div v-if="chartsBarOption.length"> -->
        <Echarts :option="chartsBarOption" />
        <!-- </div>
        <div v-else>暂无管理绩效得分数据</div>-->
      </div>
      <PageTitle>各组织管理绩效分档统计</PageTitle>
      <div>
        <p class="font-bold color-0067cc" v-for="(item, ind) in pieLevel" :key="ind">{{item.type}}：{{item.arr.join(",") ? item.arr.join(",") : "暂无数据"}}</p>
      </div>
      <div class="echarts-wrapper">
        <!-- <div v-if="chartsPieOption.length"> -->
        <Echarts :option="chartsPieOption" />
        <!-- </div>
        <div v-else>暂无绩效分档数据</div>-->
      </div>
    </div>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// import rowspanMethod from "@/utils/rowspanMethod.js";
import dictionary from '@/utils/dictionary';
import Echarts from "@/components/echarts/index.vue";
import { barObj, pieObj } from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'
import dataAnalysis from '@/pages/accidentManagement/dataAnalysis/mixin/dataAnalysis.js'


import moment from "moment";
import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'

import { PushTask } from '@/services/api'
import { orgDataSelectSummary, orgDataSaveApproval, orgDataAnalysisHistogramSummary, orgDataAnalysisBarSummary } from "@/services/performanceManagement.js";
import { type } from "os";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, dataAnalysis],
  components: { Echarts },
  data() {
    return {
      pushPara: {},
      submitLoading: false,
      statusList: [],
      dataTypeList: [
        { value: '季度', key: 1 },
        { value: '半年度', key: 2 },
        { value: '年度', key: 3 },
      ],
      dataTypeNextSnd: [
        { value: '上半年', key: 1 },
        { value: '下半年', key: 2 },
      ],
      quarterList: [
        {
          key: 1,
          value: "第一季度"
        },
        {
          key: 2,
          value: "第二季度"
        },
        {
          key: 3,
          value: "第三季度"
        },
        {
          key: 4,
          value: "第四季度"
        },
      ],
      isNoIndexList: [
        {
          key: 1,
          value: "是"
        },
        {
          key: 2,
          value: "否"
        }
      ],
      formInline: {},
      preFormInline: {},
      chartFormInline: {
        dataType: 1,
        reportDate: 1,
        year: moment(new Date()).format('YYYY')
      },

      selectedRowKeys: [],

      columns: [
        {
          title: '是否有否决性指标',
          scopedSlots: { customRender: 'isNoIndex' },
          width: 200,
        },
        {
          title: '安全管理扣分分值',
          dataIndex: 'securityDeductScore',
          width: 200,
        },
        {
          title: '消防管理扣分分值',
          dataIndex: 'controlDeductScore',
          width: 200,
        },
        {
          title: '环境管理扣分分值',
          dataIndex: 'environmentDeductScore',
          width: 200,
        },
        {
          title: '职业健康管理扣分分值',
          dataIndex: 'healthyDeductScore',
          width: 200,
        },
        {
          title: '其他管理事项扣分分值',
          dataIndex: 'otherDeductScore',
          width: 200,
        },
        {
          title: '总扣分值',
          dataIndex: 'deductDeductScore',
          width: 200,
        },
        {
          title: '总得分',
          dataIndex: 'score',
          width: 200,
        },
        {
          title: '分档',
          dataIndex: 'level',
          minWidth: 150,
        },
      ],
      tableDataList: [],

      // 得分
      chartsBarOption: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        grid: barObj.grid,
        dataZoom: [],
        legend: {
          data: []
        },
        xAxis: {
          data: [],
        },
        yAxis: [
          {
            type: 'value',
            name: '绩效得分(分)',
          },
        ],
        series: [
          {
            name: '得分',
            type: "bar",
            data: []
          }
        ]
      },
      // 分档
      chartsPieOption: {
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          },
          feature: {},
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {d}%",
        },
        series: [
          {
            radius: pieObj.radius,
            name: '绩效分档',
            type: 'pie',
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          }
        ]
      },
      pieLevel: {}
    }
  },
  created() {
    this.setRouterCode("performanceSummary");
    this.statusList = dictionary("approvalStatus");
    this.columns.splice(0, 0, this.addCommonColumnItem(200));
    this.formInline = {
      year: moment(new Date()).format('YYYY'),
      quarter: 1
    }
    this.preFormInline = {
      year: moment(new Date()).format('YYYY'),
      quarter: 1
    }
    this.getDataList();
    this.iSearchChart();
  },
  methods: {
    yearChange(val) {
      this.$set(this.formInline, "year", val.format('YYYY'));
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 填报数据报表
    downloadPage() {
      const elLoading = this.$loading({
        lock: true,
        text: '导出中...',
      });
      this.showPrintPdfBtn = true;
      setTimeout(() => {
        this.$nextTick(() => {
          const element = document.getElementById('pdfDom');  // 这个dom元素是要导出的pdf的div容器
          const w = element.offsetWidth;  // 获得该容器的宽
          const h = element.offsetHeight;  // 获得该容器的高
          const offsetTop = element.offsetTop; // 获得该容器到文档顶部的距离
          const offsetLeft = element.offsetLeft; // 获得该容器到文档最左的距离
          const canvas = document.createElement('canvas');
          let abs = 0;
          const winI = document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
          const winO = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
          if (winO > winI) {
            abs = (winO - winI) / 2; // 获得滚动条宽度的一半
          }
          canvas.width = w * 2; // 将画布宽&&高放大两倍
          canvas.height = h * 2;
          const context = canvas.getContext('2d');
          context.scale(2, 2);
          context.translate(-offsetLeft - abs, -offsetTop);
          // 这里默认横向没有滚动条的情况，因为offset.left()，有无滚动条的时候存在差值，因此translate的时候，要把这个差值去掉
          html2canvas(element, {
            allowTaint: true,
            scale: 2 // 提升画面质量，但是会增加文件大小
          })
            .then((res) => {
              const contentWidth = res.width;
              const contentHeight = res.height;
              // 一页pdf显示html页面生成的canvas高度
              const pageHeight = contentWidth / 592.28 * 841.89;
              // 未生成pdf的html页面高度
              let leftHeight = contentHeight;
              // 页面偏移
              let position = 0;
              // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
              const imgWidth = 595.28;
              const imgHeight = 592.28 / contentWidth * contentHeight;
              const pageDate = res.toDataURL('image/jpeg', 1.0);
              // @ts-ignore
              // eslint-disable-next-line new-cap
              const pdf = new jsPDF('', 'pt', 'a4');
              // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面的高度（841.89）
              // 当内容未超过pdf一页显示的范围，无需分页
              if (leftHeight < pageHeight) {
                pdf.addImage(pageDate, 'JPEG', 0, position, imgWidth, imgHeight);
              } else { // 分页
                while (leftHeight > 0) {
                  pdf.addImage(pageDate, 'JPEG', 0, position, imgWidth, imgHeight)
                  leftHeight -= pageHeight;
                  position -= 841.89;
                  // 避免添加空白页
                  if (leftHeight > 0) {
                    pdf.addPage()
                  }
                }
              }
              pdf.save(`管理绩效汇总.pdf`)
            })
            .finally(() => {
              this.showPrintPdfBtn = false
              elLoading.close();
            })
        })
      }, 200);
    },
    // 提交审批
    submitApprove() {
      // if (!(this.selectedRowKeys && this.selectedRowKeys.length > 0)) {
      //   this.$antMessage.warning("请先选择审批数据");
      //   return;
      // }
      let params = {
        detailVoList: this.tableDataList,
        ...this.formInline
      }
      this.submitApproveLoading = true;
      orgDataSaveApproval(params).then(res => {
        this.$antMessage.success("提交成功");
        this.pushPara = res.data;
        this.pushTask();
        this.$router.push({
          path: "/ehsGerneralManage/performanceManagement/performanceApproval"
        })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.submitApproveLoading = false;
      })
    },
    getDataList() {
      let params = {
        ...this.preFormInline,
      }
      return orgDataSelectSummary(params).then((result) => {
        this.addLoading = false;
        this.tableDataList = result.data || [];
      }).catch((err) => {
        console.log(err);
      })
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
      this.formInline = {
        year: moment(new Date()).format('YYYY'),
        quarter: 1
      }
      this.preFormInline = {
        year: moment(new Date()).format('YYYY'),
        quarter: 1
      }
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    // 日期方式选择变更
    dataTypeChange(val) {
      if (val == 1) {
        this.chartFormInline = {
          dataType: 1,
          reportDate: 1,
          year: moment(new Date()).format('YYYY')
        }
      } else if (val == 2) {
        this.chartFormInline = {
          dataType: 2,
          reportDate: 1,
          year: moment(new Date()).format('YYYY')
        }
      } else {
        this.chartFormInline = {
          dataType: 3,
          year: moment(new Date()).format('YYYY')
        }
      }
      this.iSearchChart();
    },
    chartYearChange(val) {
      this.$set(this.chartFormInline, "year", val.format('YYYY'));
    },
    // 图表查询
    iSearchChart() {
      this.orgDataAnalysisBarSummary();
      this.orgDataAnalysisHistogramSummary();
    },
    // 图表查询
    iRestChart() {
      this.chartFormInline = {
        dataType: 1,
        reportDate: 1,
        year: moment(new Date()).format('YYYY')
      }
      this.iSearchChart();
    },
    // 饼图
    orgDataAnalysisBarSummary() {
      this.pieLevel = [];
      orgDataAnalysisBarSummary({ ...this.chartFormInline }).then(res => {
        let levelAnalysis = (res.data && res.data.analysis) || {};
        for (let key in levelAnalysis) {
          let arr = levelAnalysis[key] || [];
          let brr = [];
          console.log(arr);
          for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
              brr.push(this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", arr[i]).orgAbbrName);
            }
          }
          this.pieLevel.push({
            type: key || "--",
            arr: brr
          })
        }
        console.log(this.pieLevel)
        let pieObj = { ...this.chartsPieOption };
        pieObj.series[0].data = (res.data && res.data.bar) || [];
        this.chartsPieOption = { ...pieObj }
      }).catch(err => { console.log(err) })
    },
    // 柱状图
    orgDataAnalysisHistogramSummary() {
      orgDataAnalysisHistogramSummary({ ...this.chartFormInline }).then(res => {
        let obj = { ...this.chartsBarOption };
        obj.xAxis.data = [];
        obj.series[0].data = [];
        let chartData = res.data || [];
        for (let i = 0; i < chartData.length; i++) {
          obj.xAxis.data.push(this.getMappingValue(this.getCommonAddOrgnizeListAll, "id", chartData[i].xdata).orgAbbrName)
          obj.series[0].data.push(chartData[i].list && chartData[i].list[0] && chartData[i].list[0].value)
        }
        // obj.xAxis.data = res.data || [];
        // obj.series[0].data = [ ...corGrade ];
        this.chartsBarOption = { ...obj };
      }).catch(err => { console.log(err) })
    },

    // 待办推送
    async pushTask() {
      let routePath = "/ehsGerneralManage/performanceManagement/performanceApprovalResolve";
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + routePath + `&id=${this.pushPara.id}`
      if (this.pushPara.handlerId && this.pushPara.id) {
        await PushTask({
          title: "管理绩效待办",
          approval: 'performanceApprovalResolve',
          userId: this.pushPara.handlerId,
          docId: this.pushPara.handlerId ? this.pushPara.handlerId : this.pushPara.handlerId,
          taskId: this.pushPara.handlerId ? this.pushPara.handlerId : this.pushPara.handlerId,
          createUserId: JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId,
          url: url,
        })
      }
    },
  }
}
</script>
<style lang="less" scoped>
.echarts-wrapper {
  width: 100%;
  height: 350px;
}
</style>
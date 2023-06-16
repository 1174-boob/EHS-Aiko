<template>
  <div id="pdfDom1">
    <div class="flex justify-content-between align-items-center">
      <div v-if="corporationMsg.corporationId">
        <span>组织：{{getMappingValue(getCommonAddOrgnizeListAll, "orgId", corporationMsg.corporationId).orgName ? getMappingValue(getCommonAddOrgnizeListAll, "orgId", corporationMsg.corporationId).orgName : "--"}}</span>
        <span class="m-l-15">年度：{{corporationMsg.year ? corporationMsg.year : "--"}}</span>
        <span class="m-l-15">季度：{{corporationMsg.quarter ? this.getMappingValue(this.quarterList, "key", corporationMsg.quarter).value : "--"}}</span>
      </div>
      <div v-else></div>
      <div class="m-b-20 color-red text-right font-18 font-bold">
        <span class="m-r-15">分档：{{reportLevel ? reportLevel : "--"}}</span>
        <a-button v-if="!hideDownLoad" type="primary" @click="downLoadReport" :loading="showPrintPdfBtn" >下载</a-button>
      </div>
    </div>
    <vxe-table
      class="vxe-scrollbar beauty-scroll-fireBox editable-footer"
      border
      align="center"
      ref="xTable"
      show-footer
      show-overflow
      :span-method="rowspanMethod"
      :footer-method="footerMethod"
      :merge-footer-items="mergeFooterItems"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      :column-config="{resizable: true}"
      :row-config="{height: 60, isHover: true}"
      :data="reportData">
      <vxe-column field="projectId" title="项目" width="200">
        <template #default="{ row }">
          {{getMappingValue(projectList, "key", row.projectId).value}}
        </template>
      </vxe-column>
      <vxe-column field="id" title="指标" min-width="200">
        <template #default="{ row }">
          {{row.indexInfo}}
        </template>
      </vxe-column>
      <vxe-column field="riskScore" title="风险分值" width="100">
        <template #default="{ row }">
          {{row.riskScore ? row.riskScore : "--"}}
        </template>
      </vxe-column>
      <vxe-column field="deductPoints" title="扣分标准" min-width="300">
        <template #default="{ row }">
          {{row.projectId == 1 ? "发生否决性指标，本次考核记为C档" : row.deductPoints}}
        </template>
      </vxe-column>
      <vxe-column field="sitesNum" title="现场情况" width="200">
        <template #default="{ row }">
          <div class="flex align-items-center">
            <!-- 固定指标的现场情况不可编辑 -->
            <vxe-input :disabled="type == 'view'" width="80" type="number" :min="0" v-model="row.sitesNum" placeholder="请点击输入现场情况" allowClear @change="(e) => {sitesNumChange(e, row)}"></vxe-input>{{row.unit}}            
            <!-- <span class="color-0067cc m-l-15" v-if="type == 'view'" @click="toSitesDetail(row)">查看详情</span> -->
          </div>
        </template>
      </vxe-column>
      <vxe-column title="扣分分值" width="100">
        <template #default="{ row }">
          <!-- projectId为1时是否决性指标 -->
          {{row.projectId == 1 ? "--" : isNaN(BigNumber(row.sitesNum).multipliedBy(row.deductScore)) ? "--" : BigNumber(row.sitesNum).multipliedBy(row.deductScore)}}
        </template>
      </vxe-column>
      <vxe-column field="id" title="项目得分" width="100">
        <template #default="{ row }">
          <!-- 发生否决性指标，本次考核记为C档 -->
          {{row.projectScore}}
        </template>
      </vxe-column>
      <vxe-column field="remake" title="备注" width="200">
        <template #default="{ row }">
          <vxe-input :disabled="type == 'view'" v-model="row.remake" placeholder="请点击备注" allowClear></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
    <div class="m-t-20">备注：A：95分(含)以上；B：85分(含)~95分；C：85分以下</div>
  </div>
</template>
<script>
import rowspanMethod from "@/utils/rowspanMethod.js";
import { BigNumber } from "bignumber.js";
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const sumNum = (list, field) => {
  let count = 0;
  let obj = {};
  list.forEach(item => {
    obj[item.id] = item.projectScore;
  })
  for (let key in obj) {
    if (!isNaN(Number(obj[key]))) {
      count = BigNumber(count).plus(Number(obj[key]));
    }
  }
  return count;
}
export default {
  props: {
    reportData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: "add" // add填报，edit编辑，view查看
    },
    corporationMsg: {
      type: Object,
      default: () => {
        return {};
      }
    },
    hideDownLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mergeFooterItems: [
        { row: 0, col: 0, rowspan: 1, colspan: 6 },
        { row: 1, col: 0, rowspan: 1, colspan: 6 },
      ],
      projectList: [
        {
          key: 1,
          value: "否决性指标"
        },
        {
          key: 2,
          value: "安全"
        },
        {
          key: 3,
          value: "消防"
        },
        {
          key: 4,
          value: "环境"
        },
        {
          key: 5,
          value: "职业健康"
        }, 
        {
          key: 6,
          value: "其他管理事项"
        },
      ],
      quarterList: [
        {
          key: "1",
          value: "第一季度"
        },
        {
          key: "2",
          value: "第二季度"
        },
        {
          key: "3",
          value: "第三季度"
        },
        {
          key: "4",
          value: "第四季度"
        },
      ],
      reportLevel: "--",
      score: "",
      level: "",
      showPrintPdfBtn: false,
    }
  },
  
  methods: {
    rowspanMethod: rowspanMethod(["projectId", "id", "riskScore", "deductPoints"]),
    BigNumber,
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '最终得分'
          }
          if (['id'].includes(column.field)) {
            return sumNum(data, column.field)
          }
          return null
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '分档'
          }
          if (['id'].includes(column.field)) {
            let total = sumNum(data, column.field);
            return this.getReportLevel(total);
          }
          return null
        })
      ]
    },
    // 根据项目得分计算分档
    getReportLevel(total) { 
      this.score = total;  
      for (let i = 0; i < this.reportData.length; i++) {
        if (this.reportData[i].isNoIndex == 2 && (this.reportData[i].sitesNum && this.reportData[i].sitesNum > 0)) {
          this.reportLevel = "C档 存在否决性指标";
          this.level = "C档";
          return "C档";
        }
      }
      if (typeof(Number(total)) != "number") {
        this.reportLevel = "--";
        this.level = "";
        return;
      }
      if (total >= 95) {
        this.reportLevel = "A档";
        this.level = "A档";
        return "A档";
      } else if (total >=85 && total < 95) {
        this.reportLevel = "B档";
        this.level = "B档";
        return "B档";
      } else {
        this.reportLevel = "C档";
        this.level = "C档";
        return "C档";
      }
    },
    // 更新表尾数据
    updateFooterEvent() {
      this.$nextTick(() => {
        this.$refs.xTable.updateFooter();
      })
    },
    // 现场情况改变事件
    sitesNumChange(a, b) {
      let arr = this.reportData.filter(item => {
        return item.id == b.id;
      })
      if (arr.length) {
        let brr = [];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].sitesNum && arr[i].deductScore) {
            brr.push(Number(BigNumber(arr[i].sitesNum).multipliedBy(arr[i].deductScore)))
          }
        }
        let num = Number(BigNumber(arr[0].riskScore).minus(BigNumber.sum(...brr))) <0 ? 0 : Number(BigNumber(arr[0].riskScore).minus(BigNumber.sum(...brr)));
        if (num < 0) {
          this.$antMessage.warn("每项指标的扣分分值不得超过风险分值");
        }
        for (let i = 0; i < arr.length; i++) {
          this.reportData.forEach(item => {
            if (item.id == arr[i].id) {
              item.projectScore = isNaN(num) ? "--" : num;
            }
          })
        }
        this.updateFooterEvent();
      }
    },
    // 下载
    downLoadReport() {
      const elLoading = this.$loading({
        lock: true,
        text: '导出中...',
      });
      this.showPrintPdfBtn = true;
      setTimeout(() => {
        this.$nextTick(() => {
          const element = document.getElementById('pdfDom1');  // 这个dom元素是要导出的pdf的div容器
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
              pdf.save(`绩效报表.pdf`)
            })
            .finally(() => {
              this.showPrintPdfBtn = false
              elLoading.close();
            })
        })
      }, 200);
    },
    toSitesDetail(record) {
      console.log("查看详情");
    }
  }
}
</script>
<style lang='less' scoped>
/deep/ .ant-calendar-picker{
  width: 100%;
}

// 管理绩效数据
/deep/ .vxe-input--inner{
  cursor: auto !important;
}
</style>
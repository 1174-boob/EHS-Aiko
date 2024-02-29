<template>
  <div class="preview clx-show-scroll clx-flex-1 beauty-scroll">
    <a-row :gutter="rowObj.gutter">
      <a-col :span="rowObj.colLeftSpan">
        <div class="box box1">
          <div class="title">隐患数量统计</div>
          <div class="casualties">
            <Echarts v-if="optionCount.series.length" :option="optionCount" />
            <a-empty v-else class="echarts-empty" />
          </div>
        </div>
      </a-col>
      <a-col :span="rowObj.colRightSpan">
        <!-- <div class="grade-box box1">
          <div class="title-content">
            <div class="title">EHS管理绩效评价 ({{2023}}年第{{machChineseLang[quarter]}}季度)</div>
          </div>
          <div class="edu-detail">
            <template v-if="performanceAppr.length">
              <Grade v-for="item in performanceAppr" :key="item.guid" :gaugeData="item" />
            </template>
            <a-empty v-else class="echarts-empty" />
          </div>
        </div> -->
        <div class="notice1 box1">
          <div class="title-content">
            <div class="title">待办 <span v-if="toDoList.length > 0" style="color:#ff4d4f">(数量： {{toDoList.length}})</span></div>
            <div class="more">
              <span @click="getToDoList">刷新</span>
              <span @click="moreToDo">查看更多</span>
            </div>
          </div>
          <div class="list-detail-toDo">
            <div class="list-title">
              <div>标题名称</div>
              <div style="position: absolute; right:197px;">起草人</div>
              <div>接收时间</div>
            </div>
            <ul v-if="toDoList.length > 0">
              <li v-for="item of toDoList" :key="item.id" @click="toDoPreview(item.url)">
                <div class="title" :title="item.todoTitle">{{ item.todoTitle }}</div>
                <div class="userName">{{ item.docUserName + '/' +item.docUserId }}</div>
                <div class="time">{{ item.startTime ? item.startTime.split(" ")[0] : "--" }}</div>
              </li>
            </ul>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="rowObj.gutter">
      <a-col :span="rowObj.colLeftSpan">
        <div class="box box1">
          <div class="title">危险作业情况</div>
          <div class="casualties">
            <Echarts v-if="optionDanger.series.length" :option="optionDanger" />
            <a-empty v-else class="echarts-empty" />
          </div>
        </div>
      </a-col>
      <a-col :span="rowObj.colRightSpan">
        <div class="education box1">
          <div class="title-content">
            <div class="title">教育培训</div>
          </div>
          <div class="edu-detail">
            <router-link class="count-box" to="/ehsGerneralManage/educationmanagement/coursemanagement">
              <div class="count-ico-box">
                <img class="count-ico" :src="courseNumIco" />
              </div>
              <div class="count-main">
                <div class="num">{{staticalaAllNum.courseNum || 0}}</div>
                <div class="name">课程数量</div>
              </div>
            </router-link>
            <router-link class="count-box" to="/ehsGerneralManage/educationmanagement/testManagement">
              <div class="count-ico-box">
                <img class="count-ico" :src="testNumIco" />
              </div>
              <div class="count-main">
                <div class="num">{{staticalaAllNum.testNum || 0}}</div>
                <div class="name">考试数量</div>
              </div>
            </router-link>
            <router-link class="count-box" to="/ehsGerneralManage/educationmanagement/resource/coursewaremanagement">
              <div class="count-ico-box">
                <img class="count-ico" :src="coursewareNumIco" />
              </div>
              <div class="count-main">
                <div class="num">{{staticalaAllNum.coursewareNum || 0}}</div>
                <div class="name">课件数量</div>
              </div>
            </router-link>
            <router-link class="count-box" to="/ehsGerneralManage/educationmanagement/resource/questionbankmanagement">
              <div class="count-ico-box">
                <img class="count-ico" :src="questionBankNumIco" />
              </div>
              <div class="count-main">
                <div class="num">{{staticalaAllNum.questionBankNum || 0}}</div>
                <div class="name">题库数量</div>
              </div>
            </router-link>
            <router-link class="count-box" to="/ehsGerneralManage/educationmanagement/resource/examinationPaper">
              <div class="count-ico-box">
                <img class="count-ico" :src="paperNumIco" />
              </div>
              <div class="count-main">
                <div class="num">{{staticalaAllNum.paperNum || 0}}</div>
                <div class="name">试卷数量</div>
              </div>
            </router-link>
            <router-link class="count-box" to="/ehsGerneralManage/educationmanagement/resource/instructormanagement">
              <div class="count-ico-box">
                <img class="count-ico" :src="teacherNumIco" />
              </div>
              <div class="count-main">
                <div class="num">{{staticalaAllNum.teacherNum || 0}}</div>
                <div class="name">讲师数量</div>
              </div>
            </router-link>
          </div>
        </div>
      </a-col> 
    </a-row>

    <a-row :gutter="rowObj.gutter">
      <a-col :span="rowObj.colLeftSpan">
        <!-- <div class="box box1">
          <div class="title">{{`各现地电耗统计(${dateStr})`}}</div>
          <div class="casualties">
            <ElectricQuantity :dateStr="dateStr" />
          </div>
        </div>
        <div class="box box1">
          <div class="title">{{`各现地废弃物统计(${dateStr})`}}</div>
          <div class="casualties">
            <Rubbish :dateStr="dateStr" />
          </div>
        </div> -->
        <div class="policy box1">
          <div class="title-content">
            <div class="title">政策法规</div>
            <div class="more">
              <span @click="getPolicyList()">刷新</span>
              <span @click="morePolicy">查看更多</span>
            </div>
          </div>
          <div class="list-detail">
            <div>
              <a-tabs default-active-key="1">
                <a-tab-pane v-for="item of policyTabs" :key="item.id" :tab="item.name">
                  <div class="list-title">
                    <div>标题</div>
                    <div>施行日期</div>
                  </div>
                  <ul>
                    <li v-for="value of item.policyList" :key="value.id" @click="policyPreview(value.id)">
                      <div class="title" :title="value.title">{{ value.title ? value.title : "--" }}</div>
                      <div class="time">{{ value.releaseTime ? value.releaseTime.split(" ")[0] : "--" }}</div>
                    </li>
                  </ul>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div> 
      </a-col>
      <a-col :span="rowObj.colRightSpan">
        <div class="notice1 box1">
          <div class="title-content">
            <div class="title">通知公告</div>
            <div class="more">
              <span @click="getNoticeList">刷新</span>
              <span @click="moreNotice">查看更多</span>
            </div>
          </div>
          <div class="list-detail">
            <div class="list-title">
              <div>公告名称</div>
              <div>创建时间</div>
            </div>
            <ul v-if="noticeList.length > 0">
              <li v-for="item of noticeList" :key="item.id" @click="noticePreview(item.id)">
                <div class="title" :title="item.policyLawSubject">{{ item.policyLawSubject }}</div>
                <div class="time">{{ item.releaseTime ? item.releaseTime.split(" ")[0] : "--" }}</div>
              </li>
            </ul>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { SelectPolicylaw, selectPolicy, getPreviewPerformanceAppraisalApi ,messageListPage} from "@/services/api.js";
import {
  GetCategoryChartsList,
  GetChartsList,
  GetStatisticsChartsTypeList,
  GetStatisticsChartsList,
} from "@/services/hiddenCharts.js";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import Echarts from "@/components/echarts/index.vue";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { cloneDeep ,isEmpty} from "lodash";
import { GetStaticalaAllNum } from "@/services/networkControl.js";
import ElectricQuantity from './tpl/electricQuantity.vue'
import Rubbish from './tpl/rubbish.vue'
import Grade from './tpl/grade.vue'
import dayJs from "dayjs";
import teacherNumIco from "@/assets/preview/jiangshishuliang.png";
import coursewareNumIco from "@/assets/preview/kejianshuliang.png";
import paperNumIco from "@/assets/preview/shijuanshuliang.png";
import questionBankNumIco from "@/assets/preview/tikushuliang.png";
import courseNumIco from "@/assets/preview/kechengshuliang.png";
import testNumIco from "@/assets/preview/kaoshishuliang.png";
// 间隔
const grid = {
  top: "18%",
  left: "3%",
  right: "40px",
  bottom: "5%",
  containLabel: true,
}
export default {
  components: { Echarts, ElectricQuantity, Rubbish, Grade },
  mixins: [dataAnalysis],
  data() {
    return {
      courseNumIco, teacherNumIco, coursewareNumIco, paperNumIco, questionBankNumIco, testNumIco,
      rowObj: {
        gutter: [12, 12],
        colLeftSpan: 15,
        colRightSpan: 9,
      },
      machChineseLang: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
      },
      //教育培训
      staticalaAllNum: {},
      //隐患数量统计
      optionCount: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          }
        },
        grid: {
          top: "18%",
          left: "4px",
          right: "40px",
          bottom: "5%",
          containLabel: true,
        },
        dataZoom: [],
        legend: {
          data: ["红线隐患", "一类隐患", "二类隐患", "三类隐患"]
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量"
          }
        ],
        series: []
      },
      //危险作业情况
      optionDanger: {
        tooltip: {
          ...barObj.tooltip,
          formatter: params => {
            var tip = "";
            if (params != null && params.length > 0) {
              tip += params[0].name + "<br/>";
              for (var i = 0; i < params.length; i++) {
                tip +=
                  params[i].marker +
                  params[i].seriesName +
                  "：" +
                  params[i].value +
                  `${params[i].seriesName == "未确认率" ? "%" : ""}<br/>`;
              }
            }
            return tip;
          }
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis
          }
        },
        grid: {
          top: "18%",
          left: "4px",
          right: "20px",
          bottom: "5%",
          containLabel: true,
        },
        dataZoom: [],
        legend: {
          data: []
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "作业数量",
            alignTicks: true
          },
          {
            type: "value",
            name: "未确认率（%）",
            alignTicks: true
          }
        ],
        series: []
      },
      // 管理绩效评价
      performanceAppr: [],
      // 年
      year: dayJs().format('YYYY'),

      noticeList: [],
      toDoList: [],
      policyTabs: [],
      formInline: {
        centerId: undefined,
        corporationId: undefined,
        isSummary: undefined
      },
      // dateStr: '2022-11',
      dateStr: dayJs().format('YYYY-MM'),
    };
  },
  created() {
    // let list1 = this.setLoginCorporation; //当前登录人的所属中心列表
    let list2 = this.getCommonAddOrgnizeList; //当前登录人的组织列表
    // if (list1.length == 1 && list2.length == 1) {
    if (list2.length == 1) {
      // this.formInline.centerId = list1[0].corporationCode;
      this.formInline.corporationId = list2[0].orgId;
    }

    this.setRouterCode("preview");
    this.getNoticeList(); //通知公告列表
    this.getToDoList(); //待办列表
    this.getPolicyList(); //政策法规
    this.getChartsList(); //隐患数量统计
    this.getDangerList(); //危险作业情况
    this.getStaticalaAllNum(); //教育培训数量接口
    this.getPreviewPerformanceAppraisalFn(); //教育培训数量接口
  },
  computed: {
    // 季度  2023-6-12 修改内容：获取上一个季度的数据
    quarter() {
      let currMonth = dayJs().month() + 1
      let currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
      let prevQuarter = currQuarter - 1;
      if (prevQuarter < 1) {
        prevQuarter = 4;
      }
      return prevQuarter;
    }
  },
  methods: {
    //教育培训
    getStaticalaAllNum() {
      return GetStaticalaAllNum().then(res => {
        this.staticalaAllNum = res.data || {};
      });
    },

    //隐患数量统计-柱状
    getChartsList() {
      return GetChartsList({ ...this.formInline }).then(res => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true,
            "none"
          );
          this.optionCount.xAxis[0].data = cloneDeep(xAxisData);
          this.optionCount.legend.data = cloneDeep(legendData);
          this.optionCount.series = cloneDeep(series);
        } else {
          this.optionCount.series = [];
        }
      });
    },

    //危险作业情况-柱状
    getDangerList() {
      return GetStatisticsChartsList({ ...this.formInline }).then(res => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true,
            "none"
          );
          this.optionDanger.xAxis[0].data = cloneDeep(xAxisData);
          this.optionDanger.legend.data = cloneDeep(legendData);
          this.optionDanger.series = cloneDeep(series);
        } else {
          this.optionDanger.series = [];
        }
      });
    },

    // EHS管理绩效评价
    getPreviewPerformanceAppraisalFn() {
      let apiData = {
        // year: this.year,
        year: '2023',
        quarter: this.quarter,
        // quarter: 3,
      }
      getPreviewPerformanceAppraisalApi(apiData)
        .then(res => {
          let performanceAppr = res.data || []
          performanceAppr.forEach((item, index) => {
            item.guid = this.guid()
            item.value = 100
            item.name = `${item.totalNum}分`
            item.ranking = index + 1
            item.corporationId = item.xdata
          })
          performanceAppr.filter((item, index) => index < 3)
          this.performanceAppr = cloneDeep(performanceAppr)
        })
        .catch(err => {

        })
    },

    // 通知公告查看更多
    moreNotice() {
      this.$router.push("/notice/systemNotice");
    },

    // 待办查看更多
    moreToDo() {
      this.$router.push("/notice/toDo");
    },
    // 预览-通知公告
    noticePreview(id) {
      this.$router.push({
        path: "/notice/noticePreview",
        query: { id }
      });
    },

    toDoPreview(url) {
      window.open(url, "_blank");
    },
    // 政策法规查看更多
    morePolicy() {
      this.$router.push("/safeManage/securityThinkTank/policy");
    },

    // 政策法规预览
    policyPreview(id) {
      this.$router.push({
        path: "/safeManage/securityThinkTank/policyPreview",
        query: { id }
      });
    },

    // 通知公告列表
    getNoticeList() {
      const params = {
        organizationId: "",
        policyLawSubject: "",
        releaseTimeStart: "",
        releaseTimeEnd: "",
        pageNo: 1,
        pageSize: 6,
        type: "2"
      };
      SelectPolicylaw(params)
        .then(res => {
          this.noticeList = res.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 待办列表
    getToDoList() {
      const params = {
        todoTitle: "",
        startDate: "",
        endDate: "",
        pageNo: 1,
        pageSize: 6,
      };
      messageListPage(params)
        .then(res => {
          this.toDoList = res.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //政策法规
    async getPolicyList() {
      const data = await selectPolicy();
      this.policyTabs = data.data;
    }
  }
};
</script>

<style lang="less" scoped>
.preview {
  min-width: 1260px;
  overflow-x: scroll;
  .box1 {
    background-color: #fff;
    height: 320px;
    // border: 1px solid #ccc;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
  }
  // 盒子
  .box {
    display: flex;
    flex-direction: column;
    .title {
      flex: none;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }
    .casualties {
      flex: 1;
    }
  }

  .notice1 {
    .title-content {
      display: flex;
      justify-content: space-between;
      padding: 0px 10px 15px 10px;
      border-bottom: 1px solid #eee;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .more {
        span {
          margin: 0 5px;
          color: #0067cc;
          cursor: pointer;
          &:hover {
            color: #2384d9;
          }
        }
      }
    }
    .list-detail {
      ::v-deep .ant-tabs {
        .ant-tabs-bar {
          padding: 0 10px;
        }
        .ant-tabs-tab {
          margin: 0;
        }
        .list-title {
          margin: 0;
        }
        ul {
          li {
            padding: 1.5px 10px;
          }
        }
      }
      .list-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin: 10px 0 15px;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 5px 10px;
          font-size: 16px;
          cursor: pointer;
          .title {
            flex: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .time {
            width: 100px;
            text-align: box;
          }
          &:hover {
            color: #0067cc;
            background: #ddd;
          }
        }
      }
    }
    .list-detail-toDo {
      ::v-deep .ant-tabs {
        .ant-tabs-bar {
          padding: 0 10px;
        }
        .ant-tabs-tab {
          margin: 0;
        }
        .list-title {
          margin: 0;
        }
        ul {
          li {
            padding: 1.5px 10px;
          }
        }
      }
      .list-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin: 10px 0 15px;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        position: relative;
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 5px 10px;
          font-size: 16px;
          cursor: pointer;
          .title {
            flex: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .userName {
            width: 150px;
            text-align: box;
          }
          .time {
            width: 100px;
            text-align: box;
          }
          &:hover {
            color: #0067cc;
            background: #ddd;
          }
        }
      }
    }
  }

  .policy {
    .title-content {
      display: flex;
      justify-content: space-between;
      padding: 0px 10px 0px 10px;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .more {
        span {
          margin: 0 5px;
          color: #0067cc;
          cursor: pointer;
          &:hover {
            color: #2384d9;
          }
        }
      }
    }
    .list-detail {
      ::v-deep .ant-tabs {
        .ant-tabs-bar {
          padding: 0 10px;
          margin: 0 0 10px 0;
        }
        .ant-tabs-tab {
          margin: 0;
        }
        .list-title {
          margin: 0;
        }
        ul {
          li {
            padding: 1.5px 10px;
          }
        }
      }
      .list-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin: 0px 0 15px;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 5px 10px;
          font-size: 16px;
          cursor: pointer;
          .title {
            flex: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .time {
            width: 100px;
            text-align: box;
          }
          &:hover {
            color: #0067cc;
            background: #ddd;
          }
        }
      }
    }
  }

  .education {
    .title-content {
      display: flex;
      justify-content: space-between;
      padding: 0px 10px 15px 10px;
      border-bottom: 1px solid #eee;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .more {
        span {
          margin: 0 5px;
          color: #0067cc;
          cursor: pointer;
          &:hover {
            color: #2384d9;
          }
        }
      }
    }
    .edu-detail {
      margin-top: 6px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      flex-wrap: wrap;
      .count-box {
        display: block;
        width: 48%;
        padding: 12px 20px 10px;
        margin-top: 12px;
        box-sizing: border-box;
        cursor: pointer;
        background: #eff6ff;
        border-radius: 2px;
        transition: all 0.3s;
        display: flex;
        &:hover {
          box-shadow: 0 0px 10px rgba(#000, 0.11);
        }
        .count-ico-box {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          .count-ico {
            width: 44px;
            height: 44px;
          }
        }
        .count-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          .num {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: #0067cc;
            padding-left: 1.5px;
          }
          .name {
            text-align: center;
            font-size: 15px;
            color: rgba(51, 51, 51, 0.65);
          }
        }
      }
    }
  }

  .grade-box {
    display: flex;
    flex-direction: column;
    .title-content {
      flex: none;
      display: flex;
      justify-content: space-between;
      padding: 0px 10px 15px 10px;
      border-bottom: 1px solid #eee;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .more {
        span {
          margin: 0 5px;
          color: #0067cc;
          cursor: pointer;
          &:hover {
            color: #2384d9;
          }
        }
      }
    }
    .edu-detail {
      flex: 1;
      margin-top: 6px;
      display: flex;
      justify-content: space-around;
      padding: 0 10px;
    }
  }
}
.echarts-empty {
  margin-top: 60px;
}
</style>
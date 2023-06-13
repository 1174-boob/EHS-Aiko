<template>
      <!-- 邀请列表 -->
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <div ref="print">
                  <h2 class="h2-title">隐患排查任务单</h2>
                  <SearchTerm>
                        <div class="head-module">
                              <div v-if="isCheck">
                                    <div class="head-l-module">
                                          <span class="is-check-person"
                                                >检查人：<img
                                                      v-if="imageUrl"
                                                      :src="imageUrl"
                                                      class="signImg"
                                                /> </span
                                          ><span
                                                >检查时间:{{
                                                      baseInfoData.checkTime
                                                }}</span
                                          >
                                    </div>
                                    <div class="head-r-module">
                                          <span
                                                >待排查:
                                                {{
                                                      baseInfoData.unUseCheckCount
                                                }}</span
                                          ><span
                                                >应排查:
                                                {{
                                                      baseInfoData.totalCheckCount ||
                                                      "--"
                                                }}</span
                                          ><span
                                                >排查进度:
                                                {{
                                                      (baseInfoData.checkProgress ||
                                                            "--") + "%"
                                                }}</span
                                          >
                                    </div>
                              </div>
                              <div v-else>
                                    <div class="head-l-module">
                                          <span class="no-check-person"
                                                >检查人：
                                                <UploadBtnStyle
                                                      :accept="[
                                                            '.png',
                                                            '.jpg',
                                                            '.JPGE',
                                                      ]"
                                                      :maxSize="10"
                                                      :limit="1"
                                                      @handleSuccess="
                                                            handleSuccessRefFile
                                                      "
                                                      :showUploadList="false"
                                                      :useSlot="true"
                                                      :fileLists="fileList"
                                                >
                                                      <img
                                                            v-if="imageUrl"
                                                            :src="imageUrl"
                                                            alt="avatar"
                                                            class="signImg"
                                                      />
                                                      <div v-else>
                                                            <a-button>
                                                                  <a-icon
                                                                        type="upload"
                                                                  />
                                                                  上传签名
                                                            </a-button>
                                                      </div>
                                                </UploadBtnStyle>
                                                <a-button
                                                      v-if="imageUrl"
                                                      type="link"
                                                      size="small"
                                                      class="left-margin"
                                                      @click="hadleDeleteFile"
                                                      ghost
                                                >
                                                      删除
                                                </a-button>
                                          </span>
                                          <span style="width: 280px"
                                                >检查时间：
                                                <a-date-picker
                                                      v-model="
                                                            baseInfoData.checkTime
                                                      "
                                                />
                                          </span>
                                    </div>
                                    <!-- <div class="head-r-module">
                                          <span>待排查: xxxxx</span
                                          ><span>应排查: 2022年9月22日</span
                                          ><span>排查进度: 2022年9月22日</span>
                                    </div> -->
                              </div>
                        </div>
                  </SearchTerm>
                  <!--startprintBG-->
                  <div
                        class="stakList"
                        v-for="(itemTask, index) in dataList"
                        :key="index"
                  >
                        <div class="stak-head">
                              <div>
                                    <a-row :gutter="16">
                                          <a-col :span="6">
                                                <div
                                                      class="gutter-item gutter-item-top"
                                                >
                                                      序号:
                                                      <span>{{
                                                            index + 1
                                                      }}</span>
                                                </div>
                                          </a-col>
                                          <a-col :span="6">
                                                <div
                                                      class="gutter-item gutter-item-top"
                                                >
                                                      　　部门:
                                                      <span>{{
                                                            itemTask.deptId
                                                                  ? deptCache[
                                                                          itemTask
                                                                                .deptId
                                                                    ]
                                                                  : "--"
                                                      }}</span>
                                                </div> </a-col
                                          ><a-col :span="6">
                                                <div
                                                      class="gutter-item gutter-item-top"
                                                >
                                                      　风险点:
                                                      <span>{{
                                                            itemTask.riskPointName
                                                      }}</span>
                                                </div> </a-col
                                          ><a-col :span="6">
                                                <div
                                                      class="gutter-item gutter-item-top"
                                                >
                                                      管控层级:
                                                      <span>{{
                                                            itemTask.controlLevel
                                                                  | systemFilter(
                                                                        "controlLevel"
                                                                  )
                                                      }}</span>
                                                </div> </a-col
                                          ><a-col :span="6">
                                                <div class="gutter-item">
                                                      编号:
                                                      <span>{{
                                                            itemTask.riskPointNo
                                                      }}</span>
                                                </div>
                                          </a-col>
                                          <a-col :span="6">
                                                <div class="gutter-item">
                                                      风险分级:
                                                      <span
                                                            class="specific-span"
                                                            >{{
                                                                  itemTask.riskLevel
                                                                        | systemFilter(
                                                                              "riskLevel"
                                                                        )
                                                            }}</span
                                                      >
                                                </div> </a-col
                                          ><a-col :span="6">
                                                <div class="gutter-item">
                                                      检查频次:
                                                      <span>{{
                                                            itemTask.checkFrequencyLevel
                                                                  | systemFilter(
                                                                        "checkFrequencyLevel"
                                                                  )
                                                      }}</span>
                                                </div>
                                          </a-col>
                                    </a-row>
                              </div>
                        </div>
                        <div class="stak-content">
                              <div class="stak-content-title">
                                    <a-row>
                                          <a-col class="stak-col" :span="4">
                                                <div class="gutter-title">
                                                      措施分类
                                                </div>
                                          </a-col>
                                          <a-col class="stak-col" :span="4">
                                                <div class="gutter-title">
                                                      管控措施
                                                </div>
                                          </a-col>
                                          <a-col class="stak-col" :span="4">
                                                <div class="gutter-title">
                                                      排查标准
                                                </div>
                                          </a-col>
                                          <a-col class="stak-col" :span="4">
                                                <div class="gutter-title">
                                                      检查结果
                                                </div>
                                          </a-col>
                                          <a-col class="stak-col" :span="4">
                                                <div class="gutter-title">
                                                      异常简述
                                                </div>
                                          </a-col>
                                          <a-col class="stak-col" :span="4">
                                                <div class="gutter-title">
                                                      异常关闭状态
                                                </div>
                                          </a-col>
                                    </a-row>
                              </div>
                              <div
                                    class="stak-content-text"
                                    v-for="(itemMeasure, index) in measureList"
                                    :key="index"
                              >
                                    <div
                                          v-if="isCheck"
                                          :class="{
                                                backgroundColor:
                                                      (index + 1) % 2 == 0,
                                          }"
                                    >
                                          <a-row
                                                type="flex"
                                                justify="space-around"
                                                align="middle"
                                          >
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      {{ itemMeasure.name }}
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.detailContent
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.checkStandard ||
                                                                        "--"
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.checkStatus ==
                                                                        1
                                                                              ? "正常"
                                                                              : item.checkStatus ==
                                                                                2
                                                                              ? "异常"
                                                                              : "--"
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.abnormalText ||
                                                                        "--"
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.abnormalCloseStatus ==
                                                                        0
                                                                              ? "未开始"
                                                                              : item.abnormalCloseStatus ==
                                                                                1
                                                                              ? "进行中"
                                                                              : "已关闭"
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                          </a-row>
                                    </div>
                                    <div
                                          v-else
                                          :class="{
                                                backgroundColor:
                                                      (index + 1) % 2 == 0,
                                          }"
                                    >
                                          <a-row
                                                type="flex"
                                                justify="space-around"
                                                align="middle"
                                          >
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      {{ itemMeasure.name }}
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.detailContent
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  <a-input
                                                                        size="small"
                                                                        placeholder="请输入"
                                                                        v-model="
                                                                              item.checkStandard
                                                                        "
                                                                  />
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  <a-radio-group
                                                                        :options="[
                                                                              {
                                                                                    label: '正常',
                                                                                    value: '1',
                                                                              },
                                                                              {
                                                                                    label: '异常',
                                                                                    value: '2',
                                                                              },
                                                                        ]"
                                                                        v-model="
                                                                              item.checkStatus
                                                                        "
                                                                        @change="
                                                                              handleSeleckChange(
                                                                                    item
                                                                              )
                                                                        "
                                                                  />
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  <a-input
                                                                        size="small"
                                                                        placeholder="请输入"
                                                                        v-model="
                                                                              item.abnormalText
                                                                        "
                                                                  />
                                                            </p>
                                                      </div>
                                                </a-col>
                                                <a-col
                                                      class="stak-col"
                                                      :span="4"
                                                >
                                                      <div
                                                            v-for="(
                                                                  item, index
                                                            ) in itemTask.list"
                                                            :key="index"
                                                      >
                                                            <p
                                                                  v-if="
                                                                        item.type ==
                                                                        itemMeasure.type
                                                                  "
                                                            >
                                                                  {{
                                                                        item.abnormalCloseStatus ==
                                                                        0
                                                                              ? "未开始"
                                                                              : item.abnormalCloseStatus ==
                                                                                1
                                                                              ? "进行中"
                                                                              : "已关闭"
                                                                  }}
                                                            </p>
                                                      </div>
                                                </a-col>
                                          </a-row>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
            <!--endprintBG-->
            <div class="floor">
                  <div>
                        <a-button class="m-l-15" @click="handleBack"
                              >返 回</a-button
                        >
                        <span></span>
                        <a-button
                              v-if="isCheck"
                              type="primary"
                              @click="handleDownloadPdf"
                              >下 载</a-button
                        >
                        <a-button v-else type="primary" @click="handleConfirm"
                              >确 定</a-button
                        >
                  </div>
            </div>
      </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import {
      getTaskDetail,
      getTaskUpdata,
} from "@/services/dangerSource/hiddenTrouble/index.js";
import { doPrint } from "@/utils/common.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { getPortraitUrlt } from "@/services/api.js";
import dayJs from "dayjs";
export default {
      components: { UploadBtnStyle },
      mixins: [cancelLoading],
      data() {
            return {
                  page: {
                        pageNo: 1,
                        pageSize: 10,
                        total: 0,
                  },
                  userId:'',
                  corporationId:'',
                  searchFormData: {},
                  columns: [
                        {
                              title: "姓名",
                              dataIndex: "name",
                              key: "name",
                              align: "center",
                        },
                        {
                              title: "所属组织",
                              dataIndex: "organizationName",
                              key: "organizationName",
                              align: "center",
                        },
                        {
                              title: "部门",
                              dataIndex: "deptName",
                              key: "deptName",
                              align: "center",
                        },
                        {
                              title: "检查时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              align: "center",
                        },
                        {
                              title: "操作",
                              scopedSlots: { customRender: "action" },
                              key: "action",
                              align: "center",
                              fixed: "right", // 固定操作列
                              width: 200, // 宽度根据操作自定义设置
                        },
                  ],
                  baseInfoData: [
                        {
                              name: "王宝宝",
                              organizationName: "B11",
                              deptName: "销售部",
                              checkTime: "2022-12-12",
                        },
                  ],
                  dataList: null,
                  measureList: [
                        { name: "工程技术措施", type: 1 },
                        { name: "管理措施", type: 2 },
                        { name: "教育培训措施", type: 3 },
                        { name: "个体防护措施", type: 4 },
                        { name: "应急措施", type: 5 },
                  ],
                  list: ["qwe", "qwe", "qwe"],
                  isCheck: true,
                  id: null,
                  imageUrl: null,
                  fileList: [],
            };
      },
      computed: {},
      created() {
            this.isCheck = this.$route.params.check;
            this.id = this.$route.params.id;
            this.initData();
      },
      mounted() {},
      methods: {
            initData() {
                  this.cancelLoading();
                  getTaskDetail({
                        perilsCheckTaskId: this.id,
                  }).then((res) => {
                        this.baseInfoData = {
                              checkProgress: res.data.checkProgress,
                              checkTime: res.data.checkTime,
                              generateTime: res.data.generateTime,
                              perilsCheckTaskId: res.data.perilsCheckTaskId,
                              totalCheckCount: res.data.totalCheckCount,
                              unUseCheckCount: res.data.unUseCheckCount,
                              useCheckCount: res.data.useCheckCount,
                              handSignature: res.data.handSignature || null,
                        };
                        this.userId = res.data.userId
                        this.corporationId = res.data.corporationId
                        if (res.data.handSignature) {
                              getPortraitUrlt([res.data.handSignature]).then(
                                    (res) => {
                                          if (res.data[0]) {
                                                this.imageUrl =
                                                      res.data[0].filePath ||
                                                      null;
                                          }
                                    }
                              );
                        }
                        this.dataList = res.data.list;
                  });
            },
            handleBack() {
                  this.setKeepalive(true)
                  this.$router.go(-1);
            },
            handleConfirm() {
                  //console.log(this.dataList.map((item) => item.list).flat(2));
                  let list = this.dataList.map((item) => item.list).flat(2);
                  for (let i = 0; i < list.length; i++) {
                        console.log(list[i]);
                        if (list[i].checkStatus == 2 && !list[i].abnormalText) {
                              this.$antMessage.error(
                                    `选择为异常的，请填写异常简述！`
                              );
                              return;
                        }
                  }
                  getTaskUpdata({
                        perilsCheckTaskId: this.baseInfoData.perilsCheckTaskId,
                        handSignature: this.baseInfoData.handSignature,
                        checkTime: this.baseInfoData.checkTime
                              ? dayJs(this.baseInfoData.checkTime).format(
                                      "YYYY-MM-DD"
                                )
                              : null,
                        list: list,
                  }).then((res) => {
                        this.$antMessage.success(`修改成功！`);
                        this.$router.push({
                              path: '/safeManage/dualControlManage/riskManage/historyTask',
                              query: {
                                    userId: this.userId,
                                    corporationId: this.corporationId
                              }
                        })
                  });
            },
            //下载Pdf
            handleDownloadPdf() {
                  let style = `
                  <link rel="stylesheet" href="https://unpkg.com/ant-design-vue@1.0.3/dist/antd.min.css">
                  <style>
                        .h2-title {width: 100%;line-height: 60px;text-align: center;}
                        .head-module {padding-bottom: 15px;width: 960px;margin: 0 auto;}
                        .head-module > div {display: flex;justify-content: space-between;align-items: center;}
                        .head-l-module {font-size: 14px;color: rgba(24, 24, 24, 0.85);font-weight: 500;}
                        .head-l-module > span {display: inline-block;padding-right: 20px;}
                        .head-r-module {font-size: 14px;color: #999999;font-weight: 400;}
                        .head-r-module > span {display: inline-block;padding-left: 20px;}
                        .stakList {width: 960px;border: 1px solid #ebebeb;border-radius: 4px;padding: 30px;margin: 0 auto 25px;}
                        .backgroundColor {background-color: #fafafa;}
                        .stak-head { width: 100%; background: rgba(250, 250, 250, 0.5);border: 1px solid #f4f4f4;border-radius: 4px;padding: 25px;margin-bottom: 25px;}
                        .gutter-item {color: #999999;}
                        .gutter-item> span { color: #333333;}
                        .specific-span {color: #ff6200;}
                        .gutter-item-top {padding-bottom: 25px;}
                        .stak-content-title {background: #fafafa;border-bottom: #e8e8e8 1px solid;text-align: center;font-size: 14px;color: rgba(24, 24, 24, 0.85);font-weight: 500;}
                        .gutter-title {padding: 20px 0;}
                        .stak-col {padding: 20px;display: flex;justify-content: center;align-items: center;flex-direction: column;}
                        .stak-col  p {line-height: 35px;margin: 0;}
                        .stak-content-text { font-size: 14px;color: #666666;}
                        .signImg {width: auto;height: 38px;max-width: 180px;}
                        .is-check-person{width:260px}
                        .no-check-person{width:310px}
                        @page {size: A4 portrait;}
                  </style>`; //注意这里！！
                  let clonedNode = this.$refs.print.cloneNode(true); // 克隆节点
                  this.doPrint(style, clonedNode);
            },
            doPrint,
            //文件上传成功
            handleSuccessRefFile(e) {
                  console.log(e);
                  this.fileList = e;
                  this.baseInfoData.handSignature = e[0].id;
                  this.imageUrl = e[0].url;
            },
            //删除签名
            hadleDeleteFile() {
                  this.fileList = [];
                  this.imageUrl = null;
                  this.baseInfoData.handSignature = null;
            },
            handleSeleckChange(e) {
                  if (e.checkStatus == 2) {
                        e.abnormalCloseStatus = 1;
                  } else {
                        e.abnormalCloseStatus = 2;
                  }
            },
      },
};
</script>

<style lang="less" scoped>
.shenglvhao {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
}
// 任务头部盒子
.head-module {
      padding-bottom: 15px;
}
.head-module > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
}
.head-l-module {
      font-size: 14px;
      color: rgba(24, 24, 24, 0.85);
      font-weight: 500;
}
.head-l-module > span {
      display: inline-block;
      padding-right: 10px;
      width: 180px;
}
.head-r-module {
      font-size: 14px;
      color: #999999;
      font-weight: 400;
}
.head-r-module > span {
      display: inline-block;
      padding-left: 20px;
}
//任务单标题
.h2-title {
      width: 100%;
      line-height: 60px;
      text-align: center;
}
.stakList {
      width: 100%;
      border: 1px solid #ebebeb;
      border-radius: 4px;
      padding: 30px;
      margin-bottom: 25px;
      .stak-head {
            width: 100%;
            background: rgba(250, 250, 250, 0.5);
            border: 1px solid #f4f4f4;
            border-radius: 4px;
            padding: 25px;
            margin-bottom: 25px;
            .gutter-item {
                  color: #999999;
                  > span {
                        color: #333333;
                  }
                  .specific-span {
                        color: #ff6200;
                  }
            }
            .gutter-item-top {
                  padding-bottom: 25px;
            }
      }
      .stak-content {
            .stak-content-title {
                  background: #fafafa;
                  border-bottom: #e8e8e8 1px solid;
                  text-align: center;
                  font-size: 14px;
                  color: rgba(24, 24, 24, 0.85);
                  font-weight: 500;
                  .gutter-title {
                        padding: 20px 0;
                  }
            }
            .stak-content-text {
                  // text-align: center;
                  font-size: 14px;
                  color: #666666;

                  .stak-col {
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        p {
                              // height: 35px;
                              line-height: 35px;
                              margin: 0;
                        }
                  }
            }
      }
      .backgroundColor {
            background-color: #fafafa;
      }
}
.left-margin {
      margin-left: 10px;
      color: red;
}
.is-check-person {
      width: 260px;
}

.no-check-person {
      width: 310px;
}
.signImg {
      width: auto;
      height: 38px;
      max-width: 180px;
}
.floor {
      width: 100%;
      height: 62px;
      background: #f9f9f9;
      border: 1px solid #f6fbff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      > div {
            padding-right: 20px;
            > span {
                  width: 20px;
                  display: inline-block;
            }
      }
}
</style>

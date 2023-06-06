<template>
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <SearchTerm>
                  <div class="personal-information">
                        <div class="top-content">
                              <div class="avatar">
                                    <img :src="params.profile || dImg" alt="" />
                              </div>
                              <div class="information">
                                    <div class="name">
                                          {{ params.name }}
                                    </div>
                                    <div class="job-info">
                                          <ul>
                                                <li>
                                                      所属组织：{{
                                                            corporationName
                                                                  ? corporationName
                                                                  : "--"
                                                      }}
                                                </li>
                                                <li>
                                                      部门：{{
                                                            params.deptId
                                                                  ? deptCache[
                                                                          params
                                                                                .deptId
                                                                    ]
                                                                  : "--"
                                                      }}
                                                </li>
                                                <li>
                                                      工号：{{
                                                            params.jobNumber
                                                                  ? params.jobNumber
                                                                  : "--"
                                                      }}
                                                </li>
                                                <li>
                                                      电话：{{
                                                            params.phone
                                                                  ? params.phone
                                                                  : "--"
                                                      }}
                                                </li>
                                                <li>
                                                      邮箱：{{
                                                            params.email
                                                                  ? params.email
                                                                  : "--"
                                                      }}
                                                </li>
                                          </ul>
                                    </div>
                              </div>
                        </div>
                  </div>
            </SearchTerm>

            <!-- 列表 -->
            <CommonTable
                  :spinning="tableSpinning"
                  :page="page"
                  :pageNoChange="pageNoChange"
                  :showSizeChange="showSizeChange"
            >
                  <a-table
                        :columns="columns"
                        :scroll="{ x: 800 }"
                        :data-source="tableDataList"
                        :pagination="false"
                        bordered
                  >
                        <div slot="action" slot-scope="record">
                              <span
                                    class="color-0067cc cursor-pointer"
                                    @click="handleCheckTask(record)"
                                    >查看</span
                              >
                              <span
                                    class="color-0067cc cursor-pointer"
                                    @click="handleEditTask(record)"
                                    >编辑</span
                              >
                        </div>
                  </a-table>
            </CommonTable>
      </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import { getPortraitUrlt } from "@/services/api.js";
import {
      getHistoryTaskList,
      getUserInfo,
} from "@/services/dangerSource/hiddenTrouble/index.js";
import OrganizeLazyTree from "@/components/organizeLazyTree/organizeLazyTree.vue";
import dImg from "@/assets/images/overview/mtx.svg";
import dayJs from "dayjs";
export default {
      mixins: [cancelLoading],
      data() {
            return {
                  tableSpinning:false,
                  avatarUrl: "",
                  page: {
                        pageNo: 1,
                        pageSize: 10,
                        total: 0,
                  },
                  searchFormData: {},
                  columns: [
                        {
                              title: "单号",
                              dataIndex: "code",
                              key: "code",
                              align: "center",
                        },
                        {
                              title: "生成时间",
                              dataIndex: "generateTime",
                              key: "generateTime",
                              align: "center",
                        },
                        {
                              title: "检查时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              align: "center",
                        },
                        {
                              title: "已排查",
                              dataIndex: "useCheckCount",
                              key: "useCheckCount",
                              align: "center",
                        },
                        {
                              title: "应排查",
                              dataIndex: "totalCheckCount",
                              key: "totalCheckCount",
                              align: "center",
                        },
                        {
                              title: "排查进度",
                              dataIndex: "checkProgress",
                              key: "checkProgress",
                              align: "center",
                              customRender: (text, record, index) => {
                                    return text ? text + "%" : "--";
                              },
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
                  tableDataList: [],
                  userId: null,
                  params: {},
                  dImg,
                  corporationName: "--",
            };
      },
      created() {
            this.initConfigPage()
            this.initData();
      },
      activated() {
            setTimeout(() => {
                  if(!this.keepalive){
                        this.initConfigPage()
                        this.iRest()
                  }
            }, 20);
      },
      methods: {
            initConfigPage(){
                  this.userId = this.$route.query.userId;
                  let corporationId = this.$route.query.corporationId;
                  this.corporationName = this.getMappingValue(this.getCommonAddOrgnizeListAll,"orgId",corporationId).orgName || null;
                  this.userData();
            },
            // 页码改变
            pageNoChange(page) {
                  this.page.pageNo = page;
                  // 获取列表
                  this.initData();
            },
            // 重置
            iRest: debounce(
                  function () {
                        this.page = {
                              pageNo: 1,
                              pageSize: 10,
                              total: 0,
                        };
                        this.searchFormData = {};
                        this.initData();
                  },
                  250,
                  { leading: true, trailing: false }
            ),
            // 查询
            iSearch() {
                  this.page = {
                        pageNo: 1,
                        pageSize: 10,
                        total: 0,
                  };
                  this.handleLoading();
                  this.initData();
            },
            // 字典组每页展示条数改变
            showSizeChange(page, pageSize) {
                  this.page.pageNo = 1;
                  this.page.pageSize = pageSize;
                  this.initData();
            },
            initData() {
                  this.cancelLoading();
                  if (this.searchFormData.timeArr) {
                        this.searchFormData.checkTimeStart = this.searchFormData
                              .timeArr[0]
                              ? dayJs(this.searchFormData.timeArr[0]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                        this.searchFormData.checkTimeEnd = this.searchFormData
                              .timeArr[1]
                              ? dayJs(this.searchFormData.timeArr[1]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                  }
                  this.tableSpinning = true
                  getHistoryTaskList({
                        ...this.page,
                        userId: this.userId,
                        // ...this.searchFormData,
                  })
                  .then((res) => {
                        this.tableDataList = res.data.list;
                        this.page.total = res.data.total;
                  })
                  .finally(()=>{
                        this.tableSpinning = false
                  })
            },
            userData() {
                  getUserInfo({ userId: this.userId }).then((res) => {
                        console.log(res);
                        this.params = res.data;
                        if (res.data.profile) {
                              getPortraitUrlt([res.data.profile]).then(
                                    (res) => {
                                          if (res.data[0]) {
                                                this.params.profile =
                                                      res.data[0].filePath ||
                                                      null;
                                          }
                                    }
                              );
                        }
                  });
            },
            //查看
            handleCheckTask(e) {
                  this.$router.push({
                        name: "隐患排查任务单查看",
                        params: { check: true, id: e.perilsCheckTaskId },
                  });
            },
            //编辑
            handleEditTask(e) {
                  this.$router.push({
                        name: "隐患排查任务单编辑",
                        params: { check: false, id: e.perilsCheckTaskId },
                  });
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
.personal-information {
      box-sizing: border-box;
      border-radius: 4px;
      .top-content {
            display: flex;
            padding-bottom: 13px;
            .avatar {
                  width: 90px;
                  height: 90px;
                  border-radius: 4px;
                  overflow: hidden;
                  img {
                        width: 100%;
                        height: 100%;
                  }
            }
            .information {
                  flex: 1;
                  padding-left: 20px;
                  box-sizing: border-box;
                  .name {
                        margin-top: 20px;
                        font-size: 16px;
                        color: #000;
                        font-weight: 600;
                  }
                  .job-info {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #000;
                        font-weight: 400;
                        ul {
                              li {
                                    float: left;
                                    min-width: 110px;
                                    margin-right: 30px;
                              }
                        }
                  }
            }
      }
      .bottom-content {
            padding: 5px 0;
            ul {
                  overflow: hidden;
                  li {
                        float: left;
                        margin-right: 100px;
                        .info {
                              font-size: 14px;
                              padding-top: 20px;
                              display: flex;
                              align-items: center;
                              .title {
                                    width: 80px;
                                    display: inline-block;
                                    text-align: right;
                                    color: #999;
                              }
                              .detail {
                                    display: inline-block;
                                    text-align: left;
                                    color: #333;
                                    max-width: 260px;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                              }
                        }
                  }
                  li:first-child {
                        .info {
                              .title {
                                    width: 50px;
                              }
                        }
                  }
                  li:last-child {
                        margin-right: unset;
                  }
            }
      }
}
</style>

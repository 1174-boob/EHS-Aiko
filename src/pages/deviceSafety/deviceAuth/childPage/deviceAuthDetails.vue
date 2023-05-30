<template>
  <HasSpinAndBtnBox :spinning="spinning">
    <div class="clx-flex-1">
      <div class="content-box">
        <div class="content-box-l" :class="{'content-box-l2': !(this.approvalStatus == '0'),}">
          <div style="padding: 20px 0">
            <a-form-model ref="addForm" :model="addForm" :rules="addFormRules" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :colon="false" labelAlign="right">
              <a-row type="flex" justify="space-around">
                <a-col :span="11">
                  <CommonSearchItem
                    ref="commonSearchItem"
                    :CommonFormInline="
                                                              addForm
                                                        "
                    :notTablePage="true"
                    :disabled="type == 2"
                    :hasDepartment="true"
                    :deptLabel="'部门'"
                  ></CommonSearchItem>
                </a-col>
                <a-col :span="11">
                  <StaffOrDept
                    :treeType="'user'"
                    :propKey="'equipmentDeptCertifier'"
                    :treeRoles="addFormRules"
                    :labelTitle="'设备担当部门认证人'"
                    :label-col="{ span: 7 }"
                    :onPreview="type == 2"
                    :checkedTreeNode="
                                                              checkedTreeNode1
                                                        "
                    @getTreeData="
                                                              getDutyUserList1
                                                        "
                    :wrapper-col="{
                                                              span: 17,
                                                        }"
                  />
                  <StaffOrDept
                    :treeType="'user'"
                    :propKey="'powerDeptCertifier'"
                    :treeRoles="addFormRules"
                    :labelTitle="'厂务部门认证人'"
                    :label-col="{ span: 7 }"
                    :onPreview="type == 2"
                    :checkedTreeNode="
                                                              checkedTreeNode2
                                                        "
                    @getTreeData="
                                                              getDutyUserList2
                                                        "
                    :wrapper-col="{
                                                              span: 17,
                                                        }"
                  />
                </a-col>
                <a-col :span="11">
                  <StaffOrDept
                    :treeType="'user'"
                    :propKey="'techniqueDeptCertifier'"
                    :treeRoles="addFormRules"
                    :labelTitle="'环安部门认证人'"
                    :label-col="{ span: 7 }"
                    :onPreview="type == 2"
                    :checkedTreeNode="
                                                              checkedTreeNode3
                                                        "
                    @getTreeData="
                                                              getDutyUserList3
                                                        "
                    :wrapper-col="{
                                                              span: 17,
                                                        }"
                  />
                </a-col>
                <a-col :span="11"></a-col>
                <a-col :span="11">
                  <a-form-model-item label="认证设备" prop="itemCommandList">
                    <a-button
                      type="primary"
                      :disabled="
                                                                    type == 2
                                                              "
                      @click="
                                                                    handleOpenDrawer
                                                              "
                    >
                      <a-icon type="plus" />选择设备
                    </a-button>
                  </a-form-model-item>
                </a-col>
                <a-col :span="11"></a-col>
              </a-row>
            </a-form-model>
          </div>
          <div>
            <div class="plate" v-for="(
                                            i, index
                                      ) in addForm.itemCommandList" :key="index">
              <div class="baseInfo">
                <a-row type="flex" justify="space-around">
                  <a-col :span="4">序号：{{ index + 1 }}</a-col>
                  <a-col :span="4">
                    设备名称：{{
                    i.equipmentName
                    }}
                  </a-col>
                  <a-col :span="4">
                    设备量产时间：{{
                    i.equipmentProductionDate
                    }}
                  </a-col>
                  <a-col :span="4">
                    责任担当：{{
                    i.responsibilityName
                    }}
                  </a-col>
                </a-row>
                <a-row type="flex" class="bottom" justify="space-around">
                  <a-col :span="4">
                    设备ID：{{
                    i.equipmentCode
                    }}
                  </a-col>
                  <a-col :span="4">
                    设备类型：{{
                    i.equipmentType
                    }}
                  </a-col>
                  <a-col :span="4">
                    初次认证时间：{{
                    i.initialCertificationDate
                    }}
                  </a-col>
                  <a-col :span="4"></a-col>
                </a-row>
              </div>
              <a-table :columns="columns" :scroll="{ x: 800 }" :data-source="[i]" :pagination="false" bordered>
                <div slot="report" slot-scope="record">
                  <span
                    class="color-0067cc cursor-pointer"
                    v-if="
                                                              record.certificationReport
                                                        "
                    @click="
                                                              hazardFileDownload(
                                                                    record.certificationReport
                                                              )
                                                        "
                  >认证报告.pdf</span>
                </div>
                <div slot="action" slot-scope="record">
                  <span v-if="type == 2" class="color-0067cc cursor-pointer" style="color: #999">编辑</span>
                  <span
                    v-else
                    class="color-0067cc cursor-pointer"
                    @click="
                                                              handleEdit(
                                                                    record,
                                                                    index
                                                              )
                                                        "
                  >编辑</span>
                </div>
              </a-table>
            </div>
          </div>
        </div>
        <div class="content-box-R" v-if="!(this.approvalStatus == '0')">
          <SetLog :flowLogList="flowLogList" />
        </div>
      </div>
    </div>

    <FixedBottom slot="fixedBottom">
      <div class="floor" v-if="!manage">
        <div>
          <a-button type="primary" v-if=" this.approvalStatus == '1' && userId == addForm.createUserId" @click="handleWithdraw">撤回</a-button>
          <a-button class="m-l-15" @click="handleBack">取消</a-button>
          <a-button type="primary" v-if="type != 2" @click="validEvent('0')">保存</a-button>
          <a-button type="primary" v-if="type != 2" @click="validEvent('1')">提交</a-button>
        </div>
      </div>
      <div class="floor" v-else>
        <div>
          <a-button class="m-l-15" @click="handleBack">取消</a-button>
          <a-button type="primary" @click="handelManage(1)">驳回</a-button>
          <a-button type="primary" @click="handelManage(2)">通过</a-button>
        </div>
      </div>
    </FixedBottom>

    <CommonModal :title="typeOfApproval == 1 ? '驳回原因' : '通过原因'" :visible="submitView" :cancelFn="handleCancel">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{
                                    style: { width: 'calc(100% - 130px)' },
                              }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item
            class="flex"
            :label="
                                          typeOfApproval == 1
                                                ? '驳回原因'
                                                : '通过原因'
                                    "
          >
            <a-textarea
              v-model="cause"
              placeholder="请输入"
              :auto-size="{
                                                minRows: 3,
                                                maxRows: 5,
                                          }"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label=" ">
            <a-button @click="handleCancel">取消</a-button>
            <span class="span-l"></span>
            <a-button type="primary" @click="handleConfirm">提交</a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
    <!-- 添加设备认证信息 -->
    <CommonModal title="编辑" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addItemForm"
          :model="addItemForm"
          :rules="addItemFormRules"
          :label-col="{ style: { width: '125px' } }"
          :wrapper-col="{
                                    style: { width: 'calc(100% - 125px)' },
                              }"
          :colon="false"
          labelAlign="right"
        >
          <!-- @corporationDeptChange="corporationDeptChange" -->
          <a-form-model-item class="flex" label="本次认证时间" prop="certificationDate">
            <el-date-picker
              v-model="
                                                addItemForm.certificationDate
                                          "
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="本次认证有效期" prop="certificationValid">
            <!-- <a-input v-model="addItemForm.certificationValid"
                                addon-after="年"
            placeholder="请输入有效期" />-->
            <a-input-number
              v-model="
                                                addItemForm.certificationValid
                                          "
              :formatter="(v) => `${v}年`"
              :precision="0"
              :min="0"
              placeholder="请输入有效期"
              addon-after="年"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="本次认证结论" prop="certificationConclusion">
            <a-select
              v-model="
                                                addItemForm.certificationConclusion
                                          "
              @change="handleChange"
              placeholder="请选择"
              allowClear
            >
              <a-select-option
                v-for="item in [
                                                      {
                                                            value: '合格',
                                                            key: '1',
                                                      },
                                                      {
                                                            value: '不合格',
                                                            key: '2',
                                                      },
                                                ]"
                :key="item.value"
                :value="item.key"
              >
                {{
                item.value
                }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            class="flex"
            v-if="
                                          addItemForm.certificationConclusion !=
                                          1
                                    "
            label="不合格原因"
            prop="unqualifiedReason"
          >
            <a-input v-model="
                                                addItemForm.unqualifiedReason
                                          " placeholder="请输入不合格原因" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="厂商名称" prop="manufacturerName">
            <a-input v-model="addItemForm.manufacturerName" placeholder="请输入厂商名称" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="厂商认证人" prop="manufacturerAuthenticator">
            <a-input v-model="
                                                addItemForm.manufacturerAuthenticator
                                          " placeholder="请输入厂商认证人" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="认证报告" prop="certificationReport">
            <UploadBtnStyle :accept="['.pdf']" :maxSize="30" :limit="1" :fileLists="fileList" @handleSuccess="handleSuccessRefFile"></UploadBtnStyle>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button class="m-r-15" @click="addCancle">取消</a-button>
        <a-button type="primary" :loading="addLoading" @click="addConfirm">确定</a-button>
      </template>
    </CommonModal>
    <!-- 选择设备抽屉 -->
    <CommonDrawer title="选择设备" :visible="selsctVisible" :cancelFn="closeDrawer" :width="'90vw'">
      <template>
        <selectDevice ref="selectDevice" :selectedRowOld="addForm.itemCommandList || []"></selectDevice>
      </template>
      <template slot="btn">
        <a-button type="dashed" @click="closeDrawer">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="handleOkDrawer">确定</a-button>
      </template>
    </CommonDrawer>
  </HasSpinAndBtnBox>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce, cloneDeep } from "lodash";
import StaffOrDept from "@/components/staffOrDept";
import getDictionaryItemObj from "@/utils/dictionary.js";
import {
  authAdd,
  authDetails,
  authEdit,
  authApproved,
  authRejection,
  authGetLog,
} from "@/services/deviceSafety.js";
import dayJs from "dayjs";
import SetLog from "./setLog.vue";
import selectDevice from "./selectDevice.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { findCorporationId } from "@/pages/envMonthReport/collect/childPage/methods.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { getPortraitUrlt } from "@/services/api.js";
import { PushTask } from '@/services/api'
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: { SetLog, StaffOrDept, selectDevice, UploadBtnStyle },
  mixins: [cancelLoading],
  data() {
    return {
      spinning: true,
      searchFormData: {},
      tableData: [],
      addForm: { itemCommandList: null },
      addFormRules: {
        corporationId: [
          {
            required: true,
            message: "所属组织不能为空",
            trigger: "change",
          },
        ],
        deptId: [
          {
            required: true,
            message: "部门不能为空",
            trigger: "change",
          },
        ],
        equipmentDeptCertifier: [
          {
            required: true,
            message: "设备担当部门认证人不能为空",
            trigger: "change",
          },
        ],
        powerDeptCertifier: [
          {
            required: true,
            message: "厂务部门认证人不能为空",
            trigger: "change",
          },
        ],
        techniqueDeptCertifier: [
          {
            required: true,
            message: "环安部门认证人不能为空",
            trigger: "change",
          },
        ],
        itemCommandList: [
          {
            required: true,
            message: "设备不能为空",
            trigger: "change",
          },
        ],
      },
      columns: [
        {
          title: "本次认证时间",
          dataIndex: "certificationDate",
          key: "certificationDate",
          align: "center",
        },
        {
          title: "本次认证有效期",
          dataIndex: "certificationValid",
          key: "certificationValid",
          align: "center",
        },
        {
          title: "本次认证结论",
          dataIndex: "certificationConclusion",
          key: "certificationConclusion",
          align: "center",
          customRender: (t) => {
            if (t) {
              return t == 1 ? "合格" : "不合格";
            } else {
              return "";
            }
          },
        },
        {
          title: "不合格原因",
          dataIndex: "unqualifiedReason",
          key: "unqualifiedReason",
          align: "center",
          customRender: (t) => {
            return t ? t : "--";
          },
        },
        {
          title: "厂商名称",
          dataIndex: "manufacturerName",
          key: "manufacturerName",
          align: "center",
        },
        {
          title: "厂商认证人",
          dataIndex: "manufacturerAuthenticator",
          key: "manufacturerAuthenticator",
          align: "center",
        },
        {
          title: "认证报告",
          scopedSlots: { customRender: "report" },
          key: "report",
          align: "center",
          width: 200, // 宽度根据操作自定义设置
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 150, // 宽度根据操作自定义设置
        },
      ],
      validRules: {
        dataItem: [
          {
            required: true,
            message: "请输入数值",
          },
        ],
      },
      tableDataList: [{}],
      //弹框
      addVisible: false,
      addLoading: false,
      addItemForm: { certificationReport: null },
      addItemFormRules: {
        certificationDate: [
          {
            required: true,
            message: "本次认证时间不能为空",
            trigger: "change",
          },
        ],
        certificationValid: [
          {
            required: true,
            message: "本次认证有效期不能为空",
            trigger: "change",
          },
        ],
        certificationConclusion: [
          {
            required: true,
            message: "本次认证结论不能为空",
            trigger: "change",
          },
        ],
        unqualifiedReason: [
          {
            required: true,
            message: "不合格原因不能为空",
            trigger: "change",
          },
        ],
        // manufacturerName: [{ required: true, message: "厂商名称不能为空", trigger: "change" }],
        // manufacturerAuthenticator: [{ required: true, message: "厂商认证人不能为空", trigger: "change" }],
        certificationReport: [
          {
            required: true,
            message: "认证报告不能为空",
            trigger: ["change", "blur"],
          },
        ],
      },
      //抽屉
      selsctVisible: false,
      checkItemList: null,
      type: 1,
      approvalId: null,

      manage: false,
      submitView: false,
      cause: null,
      typeOfApproval: null,
      approvalStatus: "0",
      flowLogList: null,
      userId: null,
      createUserId: null,
      //人员回显
      checkedTreeNode1: [],
      checkedTreeNode2: [],
      checkedTreeNode3: [],
      fileList: null,
      currentData: null,
      // 主键
      approvalId: undefined
    };
  },
  created() {
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      this.checkedTreeNode3 = adminDeptId ? [adminDeptId] : [];
    }
    this.setRouterCode("deviceAuth");
    this.type = this.$route.query.type || getQueryVariable('type')
    this.manage = this.$route.query.manage ? this.$route.query.manage : false;
    let user = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user || {};
    this.userId = user.userId;
    if (this.type > 1) {
      this.approvalId = this.$route.query.approvalId || getQueryVariable('approvalId')
      this.initData();
    } else {
      this.spinning = false
    }
  },
  mounted() { },
  methods: {
    initData() {
      authDetails({ approvalId: this.approvalId })
        .then((res) => {
          res.data.itemCommandList = res.data.itemVoList.map(
            (i) => {
              let item = {
                ...i,
                ...i.equipmentAccountVo,
              };
              return item;
            }
          );
          this.checkedTreeNode1 = res.data.equipmentDeptCertifier
            ? [res.data.equipmentDeptCertifier]
            : [];
          this.checkedTreeNode2 = res.data.powerDeptCertifier
            ? [res.data.powerDeptCertifier]
            : [];
          this.checkedTreeNode3 = res.data.techniqueDeptCertifier
            ? [res.data.techniqueDeptCertifier]
            : [];
          this.addForm = res.data;
          this.$refs.commonSearchItem.corporationChange(
            res.data.corporationId,
            res.data.deptId
          );
          this.approvalStatus = res.data.approvalStatus;
          if (!(res.data.approvalStatus == "0")) {
            authGetLog({
              approvalId: res.data.approvalId,
            }).then((logData) => {
              this.flowLogList = logData.data;
            });
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    validEvent: debounce(
      function (n) {
        if (!formValidator.formAll(this, "addForm")) {
          console.log("验证不通过");
          return;
        }
        if (Array.isArray(this.addForm.itemCommandList) && this.addForm.itemCommandList.length > 0) {
          let b = this.addForm.itemCommandList.every(item => item.certificationDate);
          if (!b) {
            this.$antMessage.error(
              "请填写审核设备信息！"
            );
            return false;
          }
          if (this.type == 1) {
            authAdd({
              ...this.addForm,
              approvalStatus: n,
            })
              .then((res) => {
                this.$antMessage.success("成功！");
                let { handlerList, id: approvalId } = res.data || { handlerList: '', approvalId: '' }
                if (n == 1) {
                  this.pushTask(handlerList, approvalId)
                }
                this.$router.push({
                  path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDrafts",
                });
              });
          } else {
            console.log("NNNNNN2", n);
            this.editData(n);
          }
        } else {
          this.$antMessage.error("请选择审核设备！");
        }
      },
      2000,
      { leading: true, trailing: false }
    ),
    //编辑
    editData(n) {
      console.log("NNNNNN2", n);
      authEdit({
        ...this.addForm,
        approvalId: this.approvalId,
        approvalStatus: n, //审批状态
      })
        .then((res) => {
          this.$antMessage.success("成功！");
          if (n == 1) {  //提交
            let handlerList = res.data || { handlerList: '' }
            let approvalId = this.approvalId
            this.pushTask(handlerList, approvalId)
            this.$router.push({
              path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuth",
            });
          } else {    //保存
            this.$router.push({
              path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDrafts",
            });
          }

        });
    },
    //返回
    handleBack() {
      this.setKeepalive(true)
      if (this.type == 3) {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuth", });
      }
    },
    //打开审批框
    handelManage(n) {
      this.typeOfApproval = n;
      this.submitView = true;
    },
    //审批框取消
    handleCancel() {
      this.submitView = false;
    },
    //审批通过or驳回
    handleConfirm() {
      if (this.typeOfApproval == 2) {
        authApproved({
          approvalId: this.approvalId,
          reason: this.cause || "",
        }).then((res) => {
          this.$antMessage.success("审批成功！");
          let handlerList = res.data?.handlerList
          this.pushTask(handlerList, this.approvalId)
          this.$router.push({ path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuth", });
        });
      } else {
        authRejection({
          approvalId: this.approvalId,
          reason: this.cause || "",
        }).then((res) => {
          this.$antMessage.success("驳回成功！");
          this.$router.push({ path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuth", });
        });
      }
    },
    // 代办推送
    async pushTask(handlerList, approvalId) {
      handlerList = Array.isArray(handlerList) ? handlerList.toString() : handlerList
      if (approvalId) {
        const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/deviceSafeManage/deviceSafety/deviceAuthDetails&approvalId=${approvalId}&type=2`
        const pushTask = await PushTask({
          title: "设备认证审批",
          approval: 'deviceSafety',
          userId: handlerList,
          url: url,
          docNumber: this.addForm?.approvalOn,   //业务id
          docId: approvalId,  //主键id
        })
      }
    },
    // 撤回
    handleWithdraw() {
      let _this = this;
      this.$antConfirm({
        title: "确定撤回填报信息吗?",
        onOk() {
          authRejection({
            approvalId: _this.approvalId,
          }).then((res) => {
            _this.$antMessage.success("撤回成功！");
            _this.$router.push({ path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuth", });
          });
        },
        onCancel() { },
      });
    },
    //弹框设备编辑
    handleEdit(e, i) {
      this.addVisible = true;
      console.log(e);
      if (e.certificationReport) {
        getPortraitUrlt([e.certificationReport]).then((res) => {
          if (res.data[0]) {
            console.log(res.data[0].filePath);
            this.fileList = [
              {
                uid: "-1",
                name: res.data[0]
                  .sourceFileName,
                url: res.data[0].filePath,
                id: e.certificationReport,
              },
            ];
          }
        });
      }
      this.currentData = i;
      this.addItemForm = cloneDeep(e);
      // this.addItemForm.certificationReport = null
      this.$set(
        this.addItemForm,
        "certificationReport",
        e.certificationReport
      );
    },
    //弹框设备取消
    addCancle() {
      this.addVisible = false;
      if (!this.addItemForm.certificationReport && this.fileList) {
        this.addItemForm.certificationReport =
          this.fileList[0].id;
      }
      this.addItemForm = {};
      this.currentData = null;
    },
    //弹框设备确定
    addConfirm() {
      if (!formValidator.formAll(this, "addItemForm")) {
        console.log("验证不通过");
        return;
      }
      if (this.addItemForm.certificationReport) {
        console.log(this.currentData);
        // this.currentData = cloneDeep()
        this.addForm.itemCommandList[this.currentData] =
          this.addItemForm;
        this.addCancle();
      } else {
        this.$antMessage.error(`请上传文件`);
      }
    },
    //关闭抽屉
    closeDrawer() {
      this.selsctVisible = false;
    },
    //打开抽屉
    handleOpenDrawer() {
      this.selsctVisible = true;
    },
    //抽屉确定
    handleOkDrawer() {
      // console.log(this.$refs.selectDevice.selectedRow)
      this.addForm.itemCommandList = this.$refs.selectDevice
        .selectedRow.length
        ? this.$refs.selectDevice.selectedRow
        : null;
      // console.log(this.addForm.itemCommandList)
      this.closeDrawer();
    },
    //设备担当部门认证人
    getDutyUserList1(data) {
      this.addForm.equipmentDeptCertifier =
        data && data.treeIdList.length
          ? data.treeIdList.join()
          : "";
      this.addForm.equipmentDeptCertifierName =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList
            .map((i) => i.treeName)
            .join()
          : "";
    },
    //厂务部门认证人
    getDutyUserList2(data) {
      this.addForm.powerDeptCertifier =
        data && data.treeIdList.length
          ? data.treeIdList.join()
          : "";
      this.addForm.powerDeptCertifierName =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList
            .map((i) => i.treeName)
            .join()
          : "";
    },
    //环安部门认证人
    getDutyUserList3(data) {
      this.addForm.techniqueDeptCertifier =
        data && data.treeIdList.length
          ? data.treeIdList.join()
          : "";
      this.addForm.techniqueDeptCertifierName =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList
            .map((i) => i.treeName)
            .join()
          : "";
    },
    //选择合格不合格
    handleChange(e) {
      console.log(e);
      if (e == 1) {
        this.$set(this.addItemForm, "unqualifiedReason", null);
        // this.addItemForm.unqualifiedReason = null;
      }
    },
    //文件成功
    handleSuccessRefFile(e) {
      console.log(e);
      this.addItemForm.certificationReport = e[0] ? e[0].id : null;
      console.log(this.addItemForm.certificationReport);
    },
    //文件下载
    hazardFileDownload(e) {
      getPortraitUrlt([e]).then((res) => {
        if (res.data[0]) {
          console.log(res.data[0].filePath);
          window.open(res.data[0].filePath);
        }
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
.floor {
  width: 100%;
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
.span-l {
  display: inline-block;
  width: 10px;
}
.content-box {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.content-box-l {
  height: 100%;
  width: 100%;
}
.content-box-l2 {
  // flex-grow: 0;
  // height: 100%;
  width: calc(100% - 426px);
}
.content-box-R {
  width: 426px;
}
@media screen and (max-width: 1366px) {
  .content-box-l2 {
    width: calc(100% - 270px);
  }
  .content-box-R {
    width: 270px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .content-box-l2 {
    width: calc(100% - 326px);
  }
  .content-box-R {
    width: 326px;
  }
}
.plate {
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.baseInfo {
  padding: 30px 0;
  .bottom {
    margin-top: 30px;
  }
}
</style>

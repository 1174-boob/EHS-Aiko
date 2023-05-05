<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <template title="基本信息">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>基本信息</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-row>
                <a-col :span="13">
                  <CommonSearchItem
                    ref="commonSearchItem"
                    :CommonFormInline="iFrom"
                    :rules="iRules"
                    :notTablePage="true"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :hasDepartment="true"
                    deptLabel="部门"
                    @departmentChange="departmentChange"
                    @corporationChange="corporationChange"
                  ></CommonSearchItem>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="13">
                  <StaffOrDept
                    :labelTitle="'负责人'"
                    :checkAbel="false"
                    :treeRoles="iRules"
                    :propKey="'principalUserId'"
                    :checkedTreeNode="checkedTreeNode"
                    :onPreview="!deptTreeId"
                    :treePlaceholder="deptTreeId?'请选择' : '请先选择所属组织'"
                    :deptTreeId="deptTreeId"
                    @getTreeData="getTreeData"
                  ></StaffOrDept>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="13">
                  <a-form-model-item ref="principalUserPhone" label="手机号" prop="principalUserPhone">
                    <a-input v-model.trim="iFrom.principalUserPhone" :maxLength="30" placeholder="请输入手机号"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>

            <template title="报废清单">
              <div>
                <div class="ttile border-b-e7">
                  <PageTitle class="ttile-text">报废清单</PageTitle>
                  <DashBtn class="ttile-bbtn">
                    <div>
                      <a-button type="dashed" @click="openAddCasNoModel()">
                        <a-icon type="plus" />添加一行
                      </a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable :noPaging="true">
                  <a-table
                    style="width:100%;"
                    :columns="columns"
                    :scroll="{ x: 1100 }"
                    :locale="{emptyText: emptyText}"
                    :data-source="iFrom.itemList"
                    :rowKey="(record, index)=>{return index}"
                    :pagination="false"
                  >
                    <div slot="action" slot-scope="record">
                      <span class="color-0067cc cursor-pointer m-r-15" @click="tableRowEdit(record)">编辑</span>
                      <span class="color-0067cc cursor-pointer" @click="tableRowRm(record)">删除</span>
                    </div>
                  </a-table>
                </CommonTable>
              </a-form-model-item>
            </template>
          </a-form-model>

          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
                <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="saveChemicalIdentSafetyTips">保存</a-button>
                <a-button type="primary" class="m-r-15" :loading="loading" @click="submitBeforeFlow">提交申请</a-button>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <div class="right-box" v-if="flowLogList.length">
      <OperationLog :flowLogList="flowLogList" />
    </div>

    <!-- 添加列表弹窗 -->
    <AddCasNoModel v-model="addCasNoModelShow" :addCasNoModelData="addCasNoModelData" :moduleList="iFrom.itemList" :ppeDepositoryList="ppeDepositoryList" @changeModuleList="changeModuleList" />
    <!-- 流程选择人员弹窗 -->
    <SelNodeUser v-model="selNodeUserModelShow" :plainOptions="plainOptions" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import AddCasNoModel from "./components/addCasNoModel.vue";
import SelNodeUser from "./components/selNodeUser.vue";
import { addPpeStockApi, getPpeStockDetailApi, changePpeStockApi, getPpeClaimLisNoPagetApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { getFlowLogApi, PushTask } from '@/services/api'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import OperationLog from '@/components/flowLog/flowLog.vue'
import firstFlow from '@/pages/ppeManage/mixin/firstFlow.js'
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { FixedBottom, AddCasNoModel, UploadBtnStyle, SelNodeUser, OperationLog, StaffOrDept },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading, firstFlow],
  data() {
    return {
      DEPLOYID: '',
      checkedTreeNode: [],
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      deptTreeId: undefined,
      iFrom: {
        corporationId: undefined,
        deptId: undefined,
        principalUserId: undefined,
        principalUserName: undefined,
        principalUserPhone: undefined,
        itemList: undefined,
      },
      iRules: {
        corporationId: [{ required: true, message: "所属组织不能为空", trigger: "change" },],
        deptId: [{ required: true, message: "部门不能为空", trigger: "change" },],
        principalUserId: [{ required: true, message: "负责人不能为空", trigger: "change" },],
        // principalUserPhone: [{ required: true, validator: formValidator.texTphoneNumber, trigger: "blur" },],
        principalUserPhone: [{ required: true, message: "手机号不能为空", trigger: "blur" },],
        itemList: [{ required: true, message: "报废清单不能为空", trigger: "blur" },],
      },
      // 化学品名称list
      chemicalsList: [],
      // 主要成分table
      columns: [
        {
          title: "序号",
          dataIndex: "code",
          key: "code",
          customRender: (text, row, index) => {
            return index + 1
          },
          width: 80,
        },
        {
          title: "PPE类型",
          dataIndex: "ppeType",
          key: "ppeType",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('PPE_type', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "物料名称/型号",
          dataIndex: "materialNameAndBrand",
          key: "materialNameAndBrand",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "数量",
          dataIndex: "scrapAmount",
          key: "scrapAmount",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('PPE_unit', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "使用方式",
          dataIndex: "useType",
          key: "useType",
          customRender: (text) => {
            text = dictionary('ppeUseType', text)
            return text;
          },
        },
        {
          title: "有效期",
          dataIndex: "validityTime",
          key: "validityTime",
          width: 120,
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 120 // 宽度根据操作自定义设置
        }
      ],
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
      // 流程选择人员弹窗
      selNodeUserModelShow: false,
      // ppe库存列表--物料名称/型号
      ppeDepositoryList: [],
      // userTreeData: [],
      oldOrganizationId: undefined,
      oldDeptId: undefined,
      // 流程审批日志信息
      flowLogList: [],
    }
  },
  created() {
    // 流程key
    this.DEPLOYID = this.getChemicalDictValue("approvalType", 'PPESMAPPROVAL');
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !Boolean(this.$route.query.scrapId)
    },
  },
  methods: {
    // 负责人改变
    principalUserIdChange(userIdStr, userNameArr) {
      this.iFrom.principalUserName = userNameArr.length ? userNameArr[0] : ''
    },
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情和组织机构
        Promise.all([this.getPageDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 选择负责人
    getTreeData(value) {
      this.iFrom.principalUserId = value.treeIdList.join();
      const treeNameAndCodeList = value.treeNameAndCodeList;
      let name = [];
      for (let ele of treeNameAndCodeList) {
        name.push(ele.treeName)
      }
      this.iFrom.principalUserName = name.join();
      if (!formValidator.formItemValidate(this, "principalUserId", "ruleForm")) {
        return;
      }
    },
    // 物料名称/型号
    getPpeClaimLisNoPaget() {
      const params = {
        corporationId: this.iFrom.corporationId,
        deptId: this.iFrom.deptId,
        useType: 2,  //共用
        draftStatus: 2, //2不是草稿
      };
      return getPpeClaimLisNoPagetApi(params)
        .then((res) => {
          this.ppeDepositoryList = res.data || []
        })
        .catch(err => { })
    },
    // 获取页面详情
    getPageDetail() {
      let scrapId = this.$route.query.scrapId
      let apiData = { scrapId }
      return new Promise((resolve, rej) => {
        getPpeStockDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.itemList.forEach(item => {
              item.guid = this.guid()
            })
            this.iFrom = iFrom
            // 获取已选择的组织机构回显
            this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptId)
            // 人员回显
            this.checkedTreeNode = this.iFrom.principalUserId.split(",");
            // 获取-物料名称/型号
            this.getPpeClaimLisNoPaget()
            if (iFrom.processId) {
              this.getflowLog(iFrom.processId, iFrom.handler)
                .then(() => {
                  resolve(this.iFrom)
                })
            } else {
              resolve(this.iFrom)
            }
          })
          .catch(err => {
            rej()
          })
      })
    },
    // 获取操作记录
    getflowLog(processId, handlerStr) {
      return Promise.resolve()
      let handler = handlerStr ? handlerStr.split(',') : []
      let apiData = { processInstanceId: processId, handler }
      return getFlowLogApi(apiData)
        .then(res => {
          this.flowLogList = res.data || []
        })
        .catch(err => { })
    },
    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    // 部门表单校验
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'deptId', 'ruleForm')
    },
    departmentChange(a, b, c) {
      console.log(111, a, b, c);
      console.log(3333, this.iFrom.corporationId)
      this.iFrom.corporationId && this.refreshItemListFn('deptId')
    },
    corporationChange(a, b, c) {
      // console.log(222, a, b, c);
      // console.log(4444, this.iFrom.deptId)
      this.deptTreeId = b;
      this.$set(this.iFrom, 'principalUserId', undefined)
      this.checkedTreeNode = []
      this.iFrom.deptId && this.refreshItemListFn('corporationId')
    },
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i];
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== "[object Object]") {
          dom = dom[0];
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: "center",
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: "smooth",
        });
        break; // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 表单校验
    formValidate() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = true
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      return formAll
    },
    // 提交之前的流程api
    submitBeforeFlow() {
      console.log(this.iFrom);
      if (!this.formValidate() || this.loadingTwo) {
        return
      }
      if (!this.iFrom.principalUserId) {
        return
      }
      this.handleLoading();
      // 1.创建节点 2.自动审批首节点 3.获取第二节点审批人
      this.creatFlow()
        .then(res => {
          this.selNodeUserModelShow = true
        })
        .catch(err => {  // 任何一步失败 保存到草稿箱
          this.saveChemicalIdentSafetyTips()
        })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 提交api
    submitChemicalIdentSafetyTips(handler) {
      let apiData = {
        ...this.iFrom,
        handler: handler.join(),
        ...this.flowData,
      }
      apiData = cloneDeep(apiData)
      // 草稿 1-是，2-否
      apiData.draftStatus = 2
      apiData.itemList.forEach(item => {
        item.validityTime = item.validityTime + ' 00:00:00'
      })
      const apiName = this.isAddPage ? addPpeStockApi : changePpeStockApi
      return apiName(apiData)
        .then(res => {
          let id = this.isAddPage ? res.data.id : this.$route.query.scrapId
          let userId = handler.join();
          if (id) {
            this.pushTask(id, userId);
          }
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push(
            {
              path: '/occupationHealth/ppeManage',
              query: { activeKey: 3 }
            }
          )
        })
        .catch(err => {
          // 失败-保存到草稿箱
          this.saveChemicalIdentSafetyTips()
        })
        .finally(() => {
          // this.cancelLoading();
        })
    },
    // 代办推送
    async pushTask(id, userId) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/ppeStockHandle&scrapId=${id}`
      const pushTask = await PushTask({
        title: "PPE报废审批",
        approval: 'ppeScrap',
        userId,
        docId: this.flowData.processId,
        taskId: this.flowData.taskId,
        url: url,
      })
    },
    // 保存api
    saveChemicalIdentSafetyTips() {
      console.log(this.iFrom);
      if (!this.formValidate() || this.loading) {
        return
      }
      if (!this.iFrom.principalUserId) {
        return
      }
      let apiData = { ...this.iFrom }
      apiData = cloneDeep(apiData)
      // 草稿 1-是，2-否
      apiData.draftStatus = 1
      apiData.itemList.forEach(item => {
        item.validityTime = item.validityTime + ' 00:00:00'
      })
      const apiName = this.isAddPage ? addPpeStockApi : changePpeStockApi
      this.handleLoadingTwo();
      console.log(apiData)
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/occupationHealth/ppeStockDraft' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 添加一行
    openAddCasNoModel(row) {
      this.addCasNoModelData = row ? row : {}
      this.addCasNoModelShow = true;
    },
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 修改表格某一行
    tableRowEdit(row) {
      this.addCasNoModelData = row
      this.addCasNoModelShow = true;
    },
    // 删除表格某一行
    tableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.itemList = this.iFrom.itemList.filter(item => {
            return item.guid != row.guid
          })
          formValidator.formItemValidate(this, 'itemList', 'ruleForm')
        },
      });
    },
    // 修改主要成分table数据-添加一行
    changeModuleList(moduleDataList) {
      this.iFrom.itemList = moduleDataList
      formValidator.formItemValidate(this, 'itemList', 'ruleForm')
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 所属组织改变
    organizationIdChange(val) {
      val && this.iFrom.deptId && this.refreshItemListFn('corporationId')
    },
    // 部门改变
    deptIdChange(val) {
      val && this.iFrom.corporationId && this.refreshItemListFn('deptId')
    },
    // 报废清单刷新
    refreshItemListFn(type) {
      if (this.iFrom.itemList && this.iFrom.itemList.length) {
        this.$antConfirm({
          title: `确定要修改${type == 'corporationId' ? '所属组织' : '部门'}么？`,
          content: "修改后报废清单将会被清空",
          onOk: () => {
            this.$set(this.iFrom, 'principalUserId', undefined)
            this.checkedTreeNode = []
            // 清除报废清单
            this.iFrom.itemList = []
            // 获取-物料名称/型号
            this.getPpeClaimLisNoPaget()
          },
          onCancel: () => {
            if (type == 'corporationId') {
              this.iFrom.corporationId = this.oldOrganizationId
            } else {
              this.iFrom.deptId = this.oldDeptId
            }
          },
        });
      } else {
        this.$set(this.iFrom, 'principalUserId', undefined)
        this.checkedTreeNode = []
        // 获取-物料名称/型号
        this.getPpeClaimLisNoPaget()
      }
    },
  },
  watch: {
    'iFrom.corporationId': {
      handler(newVal, oldVal) {
        this.oldOrganizationId = oldVal
      },
    },
    'iFrom.deptId': {
      handler(newVal, oldVal) {
        this.oldDeptId = oldVal
      },
    },
  }
}
</script>

<style lang="less" scoped>
.searchtable-wrapper {
  display: flex;
  .left-box {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
    .ttile {
      display: flex;
      align-items: center;
      margin-bottom: -3px;
      border-bottom: 1px solid transparent;
      .ttile-text {
        margin-bottom: 10px;
        margin-right: 12px;
      }
      .ttile-bbtn {
        margin-bottom: 0px;
      }
    }
    ::v-deep .fixed-bottom {
      bottom: 0px;
    }
  }
  .right-box {
    flex: none;
    display: flex;
  }
}
::v-deep .fixed-bottom {
  width: 100%;
  bottom: 30px;
  left: 0px;
  z-index: 999;
}
::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>
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
                    deptLabel="领用部门"
                    @corporationChange="corporationChange"
                  ></CommonSearchItem>
                </a-col>
              </a-row>
            </template>

            <template title="领用清单">
              <div>
                <div class="ttile border-b-e7">
                  <PageTitle class="ttile-text">领用清单</PageTitle>
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
                    :scroll="{ x: 920 }"
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
                <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
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
    <AddCasNoModel
      v-model="addCasNoModelShow"
      :addCasNoModelData="addCasNoModelData"
      :deptTreeId="deptTreeId"
      :moduleList="iFrom.itemList"
      :ppeUseType="ppeUseType"
      @changeModuleList="changeModuleList"
    />
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
import { addPpeClaimApi, getPpeClaimDetailApi, changePpeClaimApi, getPpeDepositoryListNoPageApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail, DeptUserTree, getFlowLogApi, PushTask } from '@/services/api'
import { msdsApproveSave, msdsApproveUpdate, msdsApproveDetail, msdsApproveResolve, msdsApproveSavaDraft, msdsGetUserInfo, msdsApproveSaveFiling } from '@/services/chemicalMsds'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import OperationLog from '@/components/flowLog/flowLog.vue'
import firstFlow from '@/pages/ppeManage/mixin/firstFlow.js'
export default {
  components: { FixedBottom, AddCasNoModel, UploadBtnStyle, SelNodeUser, OrganizeLazyTree, OperationLog },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading, firstFlow],
  data() {
    return {
      deptTreeId: undefined,
      DEPLOYID: '',
      // 岗位list
      gangweiList: [],
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {
        itemList: undefined,
      },
      iRules: {
        corporationId: [{ required: true, message: "所属组织不能为空", trigger: "change" },],
        deptId: [{ required: true, message: "部门不能为空", trigger: "change" },],
        itemList: [{ required: true, message: "领用清单不能为空", trigger: "blur" },],
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
          width: 160,
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
          title: "领取数量",
          dataIndex: "receiveAmount",
          key: "receiveAmount",
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
          title: "领用人",
          dataIndex: "receiveUserNameList",
          key: "receiveUserNameList",
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
          title: "使用方式",
          dataIndex: "useType",
          key: "useType",
          customRender: (text) => {
            text = dictionary('ppeUseType', text)
            return text;
          },
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark",
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
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 140 // 宽度根据操作自定义设置
        }
      ],
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
      // 使用方式
      ppeUseType: [],
      // 流程选择人员弹窗
      selNodeUserModelShow: false,
      // 流程审批日志信息
      flowLogList: [],
    }
  },
  created() {
    // 使用方式字典
    this.ppeUseType = dictionary("ppeUseType");
    // 流程key
    this.DEPLOYID = this.getChemicalDictValue("approvalType", 'PPECMAPPROVAL');
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !Boolean(this.$route.query.receiveId)
    },
  },
  methods: {
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情
        Promise.all([this.getPageDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    corporationChange(a, b) {
      this.deptTreeId = b;
    },
    // 获取页面详情
    getPageDetail() {
      let receiveId = this.$route.query.receiveId
      let apiData = { receiveId }
      return new Promise((resolve, rej) => {
        getPpeClaimDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.itemList.forEach(item => {
              item.guid = this.guid()
            })
            this.iFrom = iFrom
            // 获取已选择的组织机构回显
            this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptId)
            if (iFrom.processId) {
              this.getflowLog(iFrom.processId, iFrom.handler)
                .then(res => {
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
      console.log("--this.flowData---", this.iFrom, this.flowData);
      // 草稿 1-是，2-否
      apiData.draftStatus = 2
      const apiName = this.isAddPage ? addPpeClaimApi : changePpeClaimApi
      return apiName(apiData)
        .then(res => {
          // 消息推送
          let id = this.isAddPage ? res.data.id : this.$route.query.receiveId
          console.log("id------", id);
          let userId = handler.join();
          if (id) {
            this.pushTask(id, userId);
          }
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({
            path: '/occupationHealth/ppeManage',
            query: { activeKey: 2 }
          })
        })
        .catch(err => {
          // 失败-保存到草稿箱
          this.saveChemicalIdentSafetyTips()
        })
        .finally(() => {
          // this.cancelLoading();
        })
    },
    async pushTask(id, userId) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/ppeClaimHandle&receiveId=${id}`
      const pushTask = await PushTask({
        title: "PPE领用审批",
        approval: 'ppeReceive',
        userId,
        // userCode: "10054982",
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
      let apiData = { ...this.iFrom }
      // 草稿 1-是，2-否
      apiData.draftStatus = 1
      const apiName = this.isAddPage ? addPpeClaimApi : changePpeClaimApi
      this.handleLoadingTwo();
      console.log(apiData)
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/occupationHealth/ppeClaimDraft' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 添加一行
    openAddCasNoModel(row) {
      if (this.iFrom.corporationId) {
        this.addCasNoModelData = row ? row : {}
        this.addCasNoModelShow = true;
      } else {
        this.$antMessage.warn('请先选择所属组织')
      }
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
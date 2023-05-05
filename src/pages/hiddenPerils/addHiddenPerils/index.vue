<template>
  <a-spin :spinning="spinning" wrapperClassName="a-spin">
    <HasFixedBottomWrapper>
      <a-form-model ref="hideDangerForm" :model="hideDangerForm" :rules="addRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template title="基本信息">
          <div class="m-t-20"></div>
          <a-row>
            <a-col :span="12">
              <CommonDept
                ref="commonSearchItem"
                :CommonFormInline="hideDangerForm"
                :rules="addRules"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :notTablePage="true"
                :hasDepartment="true"
                @corporationChange="corporationChange"
                @corporationDeptChange="corporationDeptChange"
                @echoCommonDept="echoCommonDept"
              ></CommonDept>
            </a-col>

            <a-col :span="12">
              <a-form-model-item class="scal" label="起草人">
                <div>{{ drafterMsg }}</div>
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <StaffOrDept
                :treeType="'dept'"
                :propKey="'draftDeptId'"
                :treeRoles="addRules"
                :labelTitle="'起草人部门'"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @getTreeData="deptIdChange"
                :checkAbel="false"
                :checkedTreeNode="deptIdList"
                treePlaceholder="请选择"
              />
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="发现时间" prop="findTime">
                <a-date-picker v-model="hideDangerForm.findTime" @change="changeFindTime" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="检查类型" prop="checkType">
                <a-select v-model="hideDangerForm.checkType" placeholder="请选择">
                  <a-select-option v-for="item in checkList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="隐患位置" prop="dangerLocation">
                <a-input v-model.trim="hideDangerForm.dangerLocation" :maxLength="50" placeholder="请输入" allowClear />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="隐患简述" prop="dangerSketch">
                <a-textarea placeholder="请输入" v-model="hideDangerForm.dangerSketch" allowClear :maxLength="50" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="隐患详述" prop="dangerDetail">
                <a-textarea placeholder="请输入" v-model="hideDangerForm.dangerDetail" allowClear :maxLength="500" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="隐患类别" prop="dangerCategory">
                <a-select v-model="hideDangerForm.dangerCategory" placeholder="请选择隐患类别">
                  <a-select-option v-for="item in troubleList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="隐患级别" prop="dangerLevel">
                <a-select v-model="hideDangerForm.dangerLevel" placeholder="请选择隐患类别">
                  <a-select-option v-for="item in troubleClassList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="责任部门" prop="responsibilityDeptId">
                <a-tree-select
                  v-model="hideDangerForm.responsibilityDeptId"
                  :allowClear="true"
                  :tree-data="outOrganizeTreeList"
                  :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
                  :placeholder="'请选择'"
                  @change="zRchange"
                  :show-search="true"
                  :filterTreeNode="filterTreeNode"
                ></a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <StaffOrDept
                :treeType="'user'"
                :propKey="'responsibilityPersonId'"
                :treeRoles="addRules"
                :labelTitle="'责任人'"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @getTreeData="responsibilityPersonIdThing"
                :checkAbel="false"
                :checkedTreeNode="responsibilityPersonIdList"
                :onPreview="!deptTreeId"
                :treePlaceholder="deptTreeId?'请选择' : '请先选择所属组织'"
                :deptTreeId="deptTreeId"
              />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <StaffOrDept
                :treeType="'user'"
                :propKey="'rectificationResponsibilityPersonId'"
                :treeRoles="addRules"
                :labelTitle="'隐患责任整改人'"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @getTreeData="rectificationResponsibilityPersonIdThing"
                :checkedTreeNode="rectificationResponsibilityPersonIdList"
                :checkAbel="false"
                :onPreview="!deptTreeId"
                :treePlaceholder="deptTreeId?'请选择' : '请先选择所属组织'"
                :deptTreeId="deptTreeId"
              />
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="隐患整改期限" prop="rectificationTime">
                <a-date-picker v-model="hideDangerForm.rectificationTime" :disabledDate="disabledDate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="隐患照片" prop="dangerPhotoList" ref="dangerPhotoList">
                <div>
                  <upload-can-remove :limit="20" :maxSize="5" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess" :headImgs="hideDangerForm.dangerPhotoList"></upload-can-remove>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>

      <div slot="fixedBottom">
        <FixedBottom>
          <a-button type="primary" @click="submit('submit')" :loading="loading">提交</a-button>
          <a-button class="m-r-10" @click="submit('save')" :loading="loading">保存</a-button>
          <a-button class="m-r-10" @click="back">取消</a-button>
        </FixedBottom>
      </div>
    </HasFixedBottomWrapper>
  </a-spin>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import FormPage from "@/components/commonTpl/formPage.vue";
import dictionary from "@/utils/dictionary.js";
import moment from "moment";
import StaffOrDept from "@/components/staffOrDept";
import {
  AddhiddenPerilsList,
  DetailhiddenPerilsList,
  UpdatehiddenPerilsList,
  GetParentResponsibilityDept,
  GetHiddenNextPeople,
} from "@/services/hiddenPerils.js";
import OrganizeLazyTree from "@/components/organizeLazyTree/organizeLazyTree.vue";
import { PushTask } from "@/services/api";
import dayJs from "dayjs";
import { getQueryVariable } from "@/utils/util.js";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  components: {
    UploadCanRemove,
    FixedBottom,
    FormPage,
    OrganizeLazyTree,
    StaffOrDept,
  },
  mixins: [chemicalDict],
  data() {
    return {
      spinning: true,
      // 部门数据
      outOrganizeTreeList: [],
      logItem: {
        status: "ttile",
        person: "caozuoren",
        time: "caozuoshijian",
        note: "beizhu",
      },
      checkList: [], //检查类型*
      troubleList: [], //隐患类别*
      troubleClassList: dictionary("htlevel"), //隐患级别*
      userTreeFields: { value: "key" },
      userTreeData: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      drafterMsg: "",
      hideDangerForm: {
        findTime: null, //发现时间
        rectificationTime: null, //隐患整改期限
        dangerPhotoList: [],
        rectificationResponsibilityDeptName: null, //隐患整改责任人主部门的name
        rectificationResponsibilityDeptId: null, //隐患整改责任人主部门的id
      },
      addRules: {
        corporationId: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
        draftDeptId: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        findTime: [
          {
            required: true,
            message: "发现时间不能为空",
            trigger: "change",
          },
        ],
        checkType: [
          { required: true, message: "检查类型不能为空", trigger: "change" },
        ],
        dangerLocation: [
          { required: true, message: "隐患位置不能为空", trigger: "blur" },
        ],
        dangerSketch: [
          { required: true, message: "隐患详述不能为空", trigger: "blur" },
        ],
        dangerCategory: [
          { required: true, message: "隐患类别不能为空", trigger: "change" },
        ],
        dangerLevel: [
          { required: true, message: "隐患级别不能为空", trigger: "change" },
        ],
        responsibilityDeptId: [
          { required: true, message: "责任部门不能为空", trigger: "change" },
        ],
        responsibilityPersonId: [
          { required: true, message: "责任人不能为空", trigger: "change" },
        ],
        rectificationResponsibilityPersonId: [
          { required: true, message: "责任整改人不能为空", trigger: "change" },
        ],
        rectificationTime: [
          {
            required: true,
            message: "隐患整改期限不能为空",
            trigger: "change",
          },
        ],
      },
      loading: false,
      routerObj: {}, //接受跳转参数
      userObjSession: {},
      responsibilityDeptIdList: [],
      responsibilityPersonIdList: [],
      rectificationResponsibilityPersonIdList: [],
      urlObj: undefined,
      deptTreeId: undefined,
      deptIdList: [],
    };
  },
  created() {
    this.checkList = this.getChemicalDictList('checkType')
    this.troubleList = this.getChemicalDictList('httype')
    this.userObjSession = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).user;
    //起草人
    this.drafterMsg = `${this.userObjSession.name}${this.userObjSession.jobNumber ? "/" + this.userObjSession.jobNumber : ""
      }`;
    this.checkType = dictionary("checkType");

    this.routerObj = this.$route.query;
    this.routerObj.hideDangerId =
      this.routerObj.hideDangerId || getQueryVariable("hideDangerId");
    if (this.routerObj.hideDangerId) {
      this.getDetail(); //获取详情
    } else {
      this.spinning = false
    }
  },
  methods: {
    // 组织机构-改变
    corporationChange(val, corporationDeptId) {
      console.log('组织机构-改变');
      this.$set(this.hideDangerForm, 'responsibilityDeptId', undefined)
      this.deptTreeId = corporationDeptId
      this.responsibilityPersonIdList = []
      this.rectificationResponsibilityPersonIdList = []
    },

    // 组织机构数据回显
    echoCommonDept({ corporationDeptId }) {
      this.deptTreeId = corporationDeptId
    },

    //责任部门树搜索
    filterTreeNode(inputValue, treeNode) {
      return (
        treeNode.data.props.title &&
        treeNode.data.props.title.indexOf(inputValue) > -1
      );
    },

    // 所属组织-获取部门
    corporationDeptChange(treeData) {
      this.outOrganizeTreeList = treeData;
    },

    //责任部门改变
    zRchange(id, nameList) {
      this.$set(this.hideDangerForm, "responsibilityDeptId", id);
      this.$set(this.hideDangerForm, "responsibilityDeptName", nameList.length ? nameList[0] : "");
    },

    // 消息推送
    async infoPush(obj, type) {
      // 获取下级审批人
      let nextPeopleData = await GetHiddenNextPeople({ hideDangerId: obj.hideDangerId })
      let nextUserId = nextPeopleData?.data?.handleId

      if (type == "submit") {
        if (this.routerObj.hideDangerId) {
          //编辑
          if (this.hideDangerForm) {
            // console.log('执行这里', this.hideDangerForm);
            if (
              this.hideDangerForm.processStatus == "verification" ||
              this.hideDangerForm.processStatus == "confirmation" ||
              this.hideDangerForm.processStatus == "newhd"
            ) {
              this.urlObj = {
                url: "/safeManage/dualControlManage/hiddenPerils/dealHiddenPage",
                hideDangerId: this.routerObj.hideDangerId,
              };
            } else {
              if (this.hideDangerForm.fourPass) {
                this.urlObj = {
                  url: "/safeManage/dualControlManage/hiddenPerils/dealIsFour",
                  hideDangerId: this.routerObj.hideDangerId,
                };
              } else {
                this.urlObj = {
                  url: "/safeManage/dualControlManage/hiddenPerils/dealNoFour",
                  hideDangerId: this.routerObj.hideDangerId,
                };
              }
            }
          }
        } else {
          //新增
          if (obj) {
            if (
              obj.processStatus == "verification" ||
              obj.processStatus == "confirmation"
            ) {
              this.urlObj = {
                url: "/safeManage/dualControlManage/hiddenPerils/dealHiddenPage",
                hideDangerId: obj.hideDangerId,
              };
            } else {
              if (obj.fourPass) {
                this.urlObj = {
                  url: "/safeManage/dualControlManage/hiddenPerils/dealIsFour",
                  hideDangerId: obj.hideDangerId,
                };
              } else {
                this.urlObj = {
                  url: "/safeManage/dualControlManage/hiddenPerils/dealNoFour",
                  hideDangerId: obj.hideDangerId,
                };
              }
            }
          }
        }
      }

      const url =
        process.env.VUE_APP_LOGIN_URL +
        "client_id=" +
        process.env.VUE_APP_CLIENTID +
        "&response_type=" +
        process.env.VUE_APP_RESPONSE_TYPE +
        "&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&routeUrl=" +
        `${this.urlObj.url}&hideDangerId=${this.urlObj.hideDangerId}`;
      PushTask({
        title: "隐患排查处理",
        approval: "hiddenPerils_verify",
        userId: nextUserId,
        url: url,
        docNumber: this.hideDangerForm?.dangerCode,   //业务id
        docId: this.urlObj.hideDangerId,  //主键id
      })
        .then((res) => {
          console.log(res, "推送成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //提交 保存事件
    submit(type) {
      // console.log(this.hideDangerForm);
      // return
      //type:save为保存 submit为提交
      if (!formValidator.formAll(this, "hideDangerForm")) {
        return;
      }
      if (!this.hideDangerForm.rectificationResponsibilityDeptName || !this.hideDangerForm.rectificationResponsibilityDeptId) {
        this.$antMessage.warn("隐患整改责任主部门为空");
        return;
      }
      //处理时间
      let findTime = this.hideDangerForm.findTime ? dayJs(this.hideDangerForm.findTime).format("YYYY-MM-DD") : undefined;
      let rectificationTime = this.hideDangerForm.rectificationTime ? dayJs(this.hideDangerForm.rectificationTime).format("YYYY-MM-DD") : undefined;

      let obj = {
        ...this.hideDangerForm,
        submitType: type,
        hideDangerId: this.routerObj.hideDangerId || undefined,
        draftPersonId: this.userObjSession.userId,
        draftPersonName: this.userObjSession.name,
        draftPersonJobNumber: this.userObjSession.jobNumber,
        findTime,
        rectificationTime,
        draftDeptId: this.hideDangerForm.draftDeptId,
        dangerPhotoList: this.dealIdList(this.hideDangerForm.dangerPhotoList || []),
      };
      //判断是新增还是编辑
      let PromiseThing = this.routerObj.hideDangerId ? UpdatehiddenPerilsList : AddhiddenPerilsList;
      this.loading = true;
      PromiseThing(obj)
        .then((res) => {
          console.log(type, this.routerObj.hideDangerId, "...type");
          if (type == "submit") {
            let resData = res.data ? { ...res.data, hideDangerId: res.data.id } : {}
            this.infoPush(this.routerObj.hideDangerId ? this.routerObj : resData, type);
          }

          this.loading = false;
          this.$antMessage.success(`${type == "save" ? "保存成功" : "提交成功"}`);
          this.$router.push("/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList");
        })
        .catch((err) => {
          this.loading = false;
          console.log(err, "addStandingBookList出错");
        });
    },

    // 起草人部门
    deptIdChange(data) {
      let draftDeptId = data && data.treeNameAndCodeList.length ? data.treeNameAndCodeList[0].id : "";
      this.$set(this.hideDangerForm, 'draftDeptId', draftDeptId)
      let draftDeptName = data && data.treeNameAndCodeList.length ? data.treeNameAndCodeList[0].treeName : "";
      this.$set(this.hideDangerForm, 'draftDeptName', draftDeptName)
    },

    //责任人
    responsibilityPersonIdThing(data) {
      this.hideDangerForm.responsibilityPersonName =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList[0].treeName
          : "";
      this.hideDangerForm.responsibilityPersonId =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList[0].id
          : "";
    },

    //隐患责任整改人
    rectificationResponsibilityPersonIdThing(data) {
      this.hideDangerForm.rectificationResponsibilityPersonName =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList[0].treeName
          : "";
      this.hideDangerForm.rectificationResponsibilityPersonId =
        data && data.treeNameAndCodeList.length
          ? data.treeNameAndCodeList[0].id
          : "";

      // //获取父级部门id和名称
      if (data && data.treeNameAndCodeList.length) {
        GetParentResponsibilityDept({
          userId: data.treeNameAndCodeList[0].id,
        }).then((res) => {
          if (res.data) {
            this.hideDangerForm.rectificationResponsibilityDeptName =
              res.data.deptName;
            this.hideDangerForm.rectificationResponsibilityDeptId =
              res.data.deptId;
          }
        });
      }
    },

    //获取详情
    getDetail() {
      DetailhiddenPerilsList({ hideDangerId: this.routerObj.hideDangerId })
        .then((res) => {
          this.hideDangerForm = res.data;

          // 获取部门列表
          this.$refs.commonSearchItem.echoCommonDept(this.hideDangerForm.corporationId)

          //回显起草人部门
          this.deptIdList = res.data.draftDeptId ? [res.data.draftDeptId] : [];

          //回显隐患照片
          if (res.data.dangerPhotoList && res.data.dangerPhotoList.length) {
            this.hideDangerForm.dangerPhotoList = this.dealImgEcho(res.data.dangerPhotoList, "fileName", "filePath");
          } else {
            this.hideDangerForm.dangerPhotoList = [];
          }

          //回显责任人和整改责任人
          this.responsibilityDeptIdList = res.data.responsibilityDeptId ? [res.data.responsibilityDeptId] : [];
          this.responsibilityPersonIdList = res.data.responsibilityPersonId ? [res.data.responsibilityPersonId] : [];
          this.rectificationResponsibilityPersonIdList = res.data.rectificationResponsibilityPersonId ? [res.data.rectificationResponsibilityPersonId] : [];
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.spinning = false
          }, 200);
        })
    },

    //发现时间改变事件
    changeFindTime(val, v) {
      const start = _.cloneDeep(val).add(3, "days");
      this.hideDangerForm.rectificationTime = start; //改变整改日期值 为发现日期的后三天
      this.disabledDate(val);
    },

    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue);
    },

    //禁用隐患整改期限
    disabledDate(current) {
      if (!current) {
        return false;
      }

      if (this.hideDangerForm.findTime) {
        const start = _.cloneDeep(this.hideDangerForm.findTime).subtract(
          0,
          "days"
        );
        const end = _.cloneDeep(this.hideDangerForm.findTime).add(7, "days");
        return current < start || current > end;
      }

      const now = moment();
      const start = _.cloneDeep(now).subtract(0, "days");
      const end = _.cloneDeep(now).add(7, "days");
      return current > start || current > end;
    },

    // 新增隐患--文件上传成功
    addFormUploadSuccess(fileList) {
      this.hideDangerForm.dangerPhotoList = fileList;
      formValidator.formItemValidate(this, "dangerPhotoList", "hideDangerForm");
    },

    //处理隐患图片
    dealIdList(list) {
      let list2 = [];
      list.forEach((item) => list2.push(item.id));
      return list2;
    },

    //返回事件
    back() {
      this.setKeepalive(true)
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.scal {
  input {
    border: none !important;
  }
}
</style>

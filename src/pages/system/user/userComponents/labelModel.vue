<template>
  <div>
    <CommonModal :title="'标签'" :visible="depAndPosModelShow" :cancelFn="closeModel" class="principal-dialog">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <div class="filter-form-box">
          <div class="filter-form-tips">分配标签</div>
          <a-form-model v-for="(item,index) in userDeptRelsList" :key="item.guid" ref="filterForm" class="filter-form" :model="item" :rules="rulesAuth" layout="inline">
            <a-form-model-item ref="deptId" prop="deptId" class="filter-form-item filter-form-left">
              <a-tree-select
                v-model="item.deptId"
                :dropdown-style="{
                  maxHeight: '400px',
                  overflow: 'auto',
                  zIndex: 9999,
                }"
                allow-clear
                placeholder="请选择标签组"
                :tree-data="treeDataG"
                :replace-fields="{ title: 'name', key: 'id', value: 'id' }"
              ></a-tree-select>
            </a-form-model-item>
            <a-form-model-item ref="positionId" prop="positionId" class="filter-form-item filter-form-right">
              <a-select v-model="item.positionId" allow-clear placeholder="请选择标签">
                <a-select-option v-for="item in positionList" :key="item.positionId" :value="item.positionId">{{ item.positionName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <div class="filter-form-btn-box">
              <img class="btn-icon add-btn" @click="addUserDeptRels" v-if="index == userDeptRelsList.length-1" src="@/assets/depAndPosModel/add-icon.svg" />
              <img class="btn-icon btn-rm" v-if="userDeptRelsList.length > 1" @click="rmUserDeptRels(item)" src="@/assets/depAndPosModel/rm-icon.svg" />
            </div>
          </a-form-model>
        </div>
      </a-spin>
      <template slot="btn">
        <a-button @click="closeModel">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitBtn">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep } from "lodash";
import { getPositionListApi, saveDeptAndPositionApi } from "@/services/api";
import { UserDetailInterFace, } from "@/services/permissions";
import cancelLoading from "@/mixin/cancelLoading";
export default {
  mixins: [cancelLoading],
  model: {
    prop: "depAndPosModelShow",
  },
  props: {
    // 弹窗显示隐藏
    depAndPosModelShow: {
      type: Boolean,
      default: false,
    },
    // 部门数据
    treeDataG: {
      type: Array,
      default: () => [],
    },
    // 选择的列数据
    labelModelData: {
      type: Object,
      default: () => {
        return {
          userId: '',
          companyId: '',
          companyUserInfoId: '',
        }
      },
    }
  },
  data() {
    return {
      spinning: false,
      loading: false,
      rulesAuth: {
        deptId: [
          { required: false, message: `标签组不能为空`, trigger: "change" },
        ],
        positionId: [
          { required: false, message: `标签不能为空`, trigger: "change" },
        ],
      },
      // 条件列表
      positionList: [],
      userDeptRelsListInit: [
        {
          guid: 1,
          deptId: undefined,
          positionId: undefined,
          // 是否主部门 1.是，2.否
          // adminDept: 2,
        },
      ],
      // 部门及职位列表
      userDeptRelsList: [],
    };
  },
  computed: {
    // 取值列表
    filterValueList() {
      let filterValueListArr = [];
      this.positionList.some((item) => {
        if (item.key == this.filterForm.deptId) {
          filterValueListArr = item.options.options;
          return true;
        }
      });
      // 过滤假值
      return filterValueListArr;
    },
  },
  methods: {
    // 初始化弹窗数据
    initDepAndPosModel() {
      this.spinning = true
      Promise.all([this.openDepAndPosModel(), this.getPositionList()])
        .then(res => { })
        .catch(() => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 部门及职位-弹窗
    openDepAndPosModel() {
      let apiData = { companyUserInfoId: this.labelModelData.companyUserInfoId }
      return UserDetailInterFace(apiData)
        .then((res) => {
          let dataObj = res.data
          dataObj.deptAndPositionDtos = dataObj.deptAndPositionDtos ? dataObj.deptAndPositionDtos : []
          // 添加id唯一标识
          dataObj.deptAndPositionDtos.forEach(item => {
            item.guid = this.guid()
          })
          this.userDeptRelsList = dataObj.deptAndPositionDtos.length ? dataObj.deptAndPositionDtos : cloneDeep(this.userDeptRelsListInit)
          return Promise.resolve()
        })
        .catch((err) => {
          return Promise.reject()
        });
    },
    // 获取职位api
    getPositionList() {
      return getPositionListApi()
        .then(res => {
          console.log(res.data,'ccccc');
          this.positionList = res.data
          return Promise.resolve()
        })
        .catch(err => {
          return Promise.reject()
        })
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 选择字段弹框-确定
    submitBtn() {
      // if (!formValidator.formAllArr(this, "filterForm")) {
      //   return
      // }
      // let hasAdminDept = this.userDeptRelsList.some(item => item.adminDept == 1)
      // if (!hasAdminDept) {
      //   this.$message.warn('请设置主部门')
      //   return
      // }
      this.handleLoading()
      this.userDeptRelsList.forEach(item => {
        item.userId = this.labelModelData.userId
        item.companyId = this.labelModelData.companyId
      })
      let apiData = {
        userId: this.labelModelData.userId,
        userDeptRels: this.userDeptRelsList
      }
      saveDeptAndPositionApi(apiData)
        .then(res => {
          this.$message.success("提交成功");
          this.$emit("getTableList");
          this.closeModel();
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
    // 新增部门及职位
    addUserDeptRels() {
      let userDeptRelsItem = {
        guid: this.guid(),
        deptId: undefined,
        positionId: undefined,
        adminDept: 2,
      }
      this.userDeptRelsList.push(userDeptRelsItem)
    },
    // 删除标签
    rmUserDeptRels(item) {
      this.$antConfirm({
        title: "删除",
        icon: () => <a-icon type="delete" class="confirm-icon-rm" theme="filled" />,
        content: "确定删除该部门及职位么？",
        cancelText: "取消",
        onOk: () => {
          this.userDeptRelsList = this.userDeptRelsList.filter(item1 => {
            return item1.guid != item.guid
          })
          // 如果删除的是主部门，默认第一个变成主部门
          if (item.adminDept == 1) {
            this.userDeptRelsList[0].adminDept = 1
          }
        },
      }).catch(()=>{});
    },
  },
  watch: {
    depAndPosModelShow(newVal) {
      if (newVal) {
        // 初始化弹窗数据
        this.initDepAndPosModel()
      } else {
        // setTimeout(() => {
        //   this.userDeptRelsList = cloneDeep(this.userDeptRelsListInit)
        // }, 300);
      }
    },
  },
};
</script>

<style lang='less' scoped>
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.filter-form-box {
  padding-bottom: 20px;
  .filter-form-tips {
    font-size: 14px;
    margin-bottom: 20px;
    color: #999;
  }
  .filter-form {
    display: flex;
    // align-items: center;
    .filter-form-item {
      flex: 1;
      width: 0;
      margin-right: 60px;
      ::v-deep .ant-form-item-control-wrapper {
        width: 100%;
      }
    }
    .filter-form-btn-box {
      flex: none;
      width: 166px;
      height: 38px;
      color: #0067cc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn-icon {
        width: 16px;
        margin-right: 20px;
        cursor: pointer;
      }
      .check-btn-box {
        cursor: pointer;
        display: flex;
        align-items: center;
        .check-btn {
          margin-right: 8px;
        }
        .check-btn-test {
          font-size: 14px;
          line-height: 1;
        }
      }
    }
    @media screen and (max-width: 1366px) {
      .filter-form-btn-box {
        height: 38px;
        .btn-icon {
          width: 14px;
        }
        .check-btn-box {
          .check-btn {
            margin-right: 6px;
          }
          .check-btn-test {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>

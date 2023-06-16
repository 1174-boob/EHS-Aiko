<template>
  <div>
    <CommonModal :title="'标签'" :visible="depAndPosModelShow" :cancelFn="closeModel" class="principal-dialog">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <div class="filter-form-box">
          <div class="filter-form-tips">分配标签</div>
          <a-form-model ref="filterForm" class="filter-form" :model="formData" :rules="rulesAuth" layout="inline">
            <a-form-model-item ref="userLabelList" prop="userLabelList" class="filter-form-item filter-form-left">
              <a-tree-select
                v-model="userLabelList"
                :dropdown-style="{
                  maxHeight: '400px',
                  overflow: 'auto',
                  zIndex: 9999,
                }"
                tree-checkable
                placeholder="请选择标签组"
                :tree-data="treeData"
                :replace-fields="{ title: 'labelItemName', key: 'labelItemId', value: 'labelItemId' , children: 'labelItemList' }"
              ></a-tree-select>
            </a-form-model-item>
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
import { GetUserLabelList, saveDeptAndLabelApi } from "@/services/api";
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
    // 标签组数据
    treeDataL: {
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
      // 在子组件中定义一个 data 属性
      treeData: [],
      rulesAuth: {
        labelId: [
          { required: false, message: `标签组不能为空`, trigger: "change" },
        ],
      },
      // 条件列表
      labelItemList: [],
      userLabelList:[],
      // 传的List
      userLabelResultList:[],
      userDeptRelsListInit: [
        {
          // // guid: 1,
          // labelId: undefined,
          // labelItemId: undefined,
          // labelItemName: undefined,
          // labelName: undefined,
        },
      ],
      // 标签组及标签列表
      userDeptRelsList: [],
      formData: {},
    };
  },
  created() {
    // 在 created 钩子函数中将父组件传递的 prop 值赋值给子组件的 data 属性
    this.treeData = this.treeDataL
  },
  computed: {
    // 取值列表
    // filterValueList() {
    //   let filterValueListArr = [];
    //   this.labelItemList.some((item) => {
    //     if (item.key == this.filterForm.labelItemId) {
    //       filterValueListArr = item.options.options;
    //       return true;
    //     }
    //   });
    //   console.log(this.labelItemList,'...');
    //   // 过滤假值
    //   return filterValueListArr;
    // },
  },
  methods: {
    findDataById(id, treeData) {
      for (let i = 0; i < treeData.length; i++) {
        const curNode = treeData[i];
        if (curNode.labelItemId === id) {
          return curNode;
        } else if (curNode.labelItemList) {
          const found = this.findDataById(id, curNode.labelItemList);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    fun(){
      this.userLabelResultList = []
      const selectedIds = this.userLabelList;
      const result = [];
      for (let i = 0; i < selectedIds.length; i++) {
        const curData = this.findDataById(selectedIds[i], this.treeData);
        if (curData) {
          result.push(curData);
        }
        this.userLabelResultList = result
        console.log(result,'resultresultresult');
      }
    },
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
    // 标签组及标签-弹窗
    openDepAndPosModel() {
      // console.log(this.labelModelData,'this.labelModelData');
      let apiData = { userId: this.labelModelData.userId }
      return UserDetailInterFace(apiData)
        .then((res) => {
          let dataObj = res.data
          dataObj.deptAndLabelDtos = dataObj.deptAndLabelDtos ? dataObj.deptAndLabelDtos : []
          // 添加id唯一标识
          // dataObj.deptAndLabelDtos.forEach(item => {
          //   item.guid = this.guid()
          // })
          this.userLabelList = dataObj.deptAndLabelDtos.length ? dataObj.deptAndLabelDtos.map(item => item.labelItemId) : []
          return Promise.resolve()
        })
        .catch((err) => {
          return Promise.reject()
        });
    },
    // 获取标签api
    getPositionList() {
      return GetUserLabelList({labelType:'1'})
        .then(res => {
          console.log(res.data,'ccccc');
          this.treeData = res.data
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
      console.log(this.userLabelList, 'ccc')
      this.fun()
      this.userDeptRelsList.forEach(item => {
        item.userId = this.labelModelData.userId
      })
      let apiData = {
        userId: this.labelModelData.userId,
        userLabelRels: this.userLabelResultList
      }
      console.log('apiData.userLabelRels',apiData.userLabelRels);
      saveDeptAndLabelApi(apiData)
        .then(res => {
          this.$message.success("提交成功");
          this.userLabelList = []
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
    // 新增标签组及标签
    addUserDeptRels() {
      let userDeptRelsItem = {
        // guid: this.guid(),
        labelId: 1,
        labelItemId: undefined,
        labelItemName: undefined,
        labelName: undefined,
      }
      this.userDeptRelsList.push(userDeptRelsItem)
    },
    // 删除标签
    rmUserDeptRels(item) {
      this.$antConfirm({
        title: "删除",
        icon: () => <a-icon type="delete" class="confirm-icon-rm" theme="filled" />,
        content: "确定删除该标签组及标签么？",
        cancelText: "取消",
        onOk: () => {
          this.userDeptRelsList = this.userDeptRelsList.filter(item1 => {
            return item1.guid != item.guid
          })
        },
      }).catch(()=>{});
    },
  },
  watch: {
    depAndPosModelShow(newVal) {
      if (newVal) {
        // 初始化弹窗数据
        this.initDepAndPosModel()
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

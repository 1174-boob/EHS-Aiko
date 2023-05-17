<template>
  <div style="margin-bottom: 0" :class="{'m-r-15': !notTablePage, 'width-100': notTablePage}">
    <template v-if="!notTablePage">
      <!-- <a-form-model-item class="flex" label="所属中心" :colon="false">
        <a-select :disabled="disabled" v-model="CommonFormInline.centerId" placeholder="请选择所属中心" @change="centerIdChange">
          <a-select-option v-for="item in commonCenterAreaList" :key="item.corporationCode" :value="item.corporationCode">{{item.corporationName}}</a-select-option>
        </a-select>
      </a-form-model-item> -->
      <a-form-model-item class="flex" label="所属组织" :colon="false">
        <a-select :disabled="disabled" v-model="CommonFormInline.corporationId" placeholder="请选择所属组织" @change="corporationChange">
          <a-select-option v-for="item in commonOrgnizeList" :key="item.orgId" :value="item.orgId">{{item.orgName}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="flex" v-if="hasDepartment && !departmentMultiple" :label="deptLabel" :colon="false">
        <dept-tree :disabled="disabled" :placeholder="deptPlaceholder" v-model="CommonFormInline.deptId" :multiple="departmentMultiple" :deptData="deptData" @change="departmentChange" allowClear></dept-tree>
        <!-- <OrganizeLazyTree  v-model="CommonFormInline.deptId " ref="organizeLazyTree" :multiple="departmentMultiple" @change="departmentChange" /> -->
      </a-form-model-item>
      <a-form-model-item class="flex" v-if="hasDepartment && departmentMultiple" :label="deptLabel" :colon="false">
        <dept-tree :disabled="disabled" :placeholder="deptPlaceholder" v-model="CommonFormInline.deptIds" :multiple="departmentMultiple" :deptData="deptData" @change="departmentChange" allowClear></dept-tree>
        <!-- <OrganizeLazyTree  v-model="CommonFormInline.deptIds " ref="organizeLazyTree" :multiple="departmentMultiple" @change="departmentChange" /> -->
      </a-form-model-item>
    </template>
    <template class="width-100" v-else>
      <a-form-model-item v-show="!justNeedDepartment" class="flex" :class="{'ngform-commonItem': isNgForm}" label="所属组织" :colon="isColon" :label-col="labelCol"  :wrapper-col="wrapperCol" prop="corporationId" :label-align="labelAlign">
        <a-select v-model="CommonFormInline.corporationId" placeholder="请选择所属组织" @change="corporationChange" :disabled="disabled">
          <a-select-option v-for="item in getCommonAddOrgnizeList" :key="item.orgId" :value="item.orgId">{{item.orgName}}</a-select-option>
        </a-select>
        <p class="error-item" v-show="isNgForm && !CommonFormInline.corporationId">所属组织不能为空</p>
      </a-form-model-item>
      <a-form-model-item
        class="flex"
        v-if="hasDepartment && !departmentMultiple"
        :class="{'ngform-commonItem': isNgForm}"
        :label="deptLabel"
        :colon="isColon"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        prop="deptId"
        :label-align="labelAlign"
      > <dept-tree :disabled="disabled" :placeholder="deptPlaceholder" v-model="CommonFormInline.deptId" :multiple="departmentMultiple" :deptData="deptData" @change="departmentChange" allowClear></dept-tree>
        <!-- <OrganizeLazyTree v-model="CommonFormInline.deptId" ref="organizeLazyTree" :disabled="disabled" :multiple="departmentMultiple" @change="departmentChange" /> -->
      </a-form-model-item>
      <a-form-model-item
        class="flex"
        v-if="hasDepartment && departmentMultiple"
        :class="{'ngform-commonItem': isNgForm}"
        :label="deptLabel"
        :colon="isColon"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        prop="deptIds"
        :label-align="labelAlign"
      >
        <dept-tree :disabled="disabled" :placeholder="deptPlaceholder" v-model="CommonFormInline.deptIds" :multiple="departmentMultiple" :deptData="deptData" @change="departmentChange" allowClear></dept-tree>
        <!-- <OrganizeLazyTree v-model="CommonFormInline.deptIds" ref="organizeLazyTree" :disabled="disabled" :multiple="departmentMultiple" @change="departmentChange" /> -->
      </a-form-model-item>
    </template>
  </div>
</template>

<script>
// import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { queryDeptTree } from '@/services/api'
export default {
  // components: { OrganizeLazyTree },
  props: {
    // 绑定表单对象
    CommonFormInline: {
      type: Object,
      default: () => { }
    },
    rules: {
      type: Object,
      default: () => { }
    },
    // 不是列表页 true：新增编辑查看页面
    notTablePage: {
      type: Boolean,
      default: false
    },
    labelCol: {
      type: Array | Object,
      default: () => { }
    },
    wrapperCol: {
      type: Array | Object,
      default: () => { }
    },
    labelAlign: {
      type: String,
      default: 'right'
    },
    // 是否是自定义表单
    isNgForm: {
      type: Boolean,
      default: false
    },
    // 自定义表单模板配置
    config: {
      type: Object,
      default: () => { }
    },
    // 是否有部门
    hasDepartment: {
      type: Boolean,
      default: false
    },
    departmentMultiple: {
      type: Boolean,
      default: false
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否需要deptName参数
    needDeptName: {
      type: Boolean,
      default: true
    },
    // 是否需要norporationName参数
    needCorporationName: {
      type: Boolean,
      default: true
    },
    // 是否需要centerName参数
    needCenterName: {
      type: Boolean,
      default: true
    },
    justNeedDepartment: {
      type: Boolean,
      default: false
    },
    needDefaultValue: {
      type: Boolean,
      default: true
    },
    deptLabel: {
      type: String,
      default: "部门"
    },
    //是否展示label的冒号
    isColon: {
      type: Boolean,
      default: false,
    },
    useDeptData: {//是否选完组织后需要查询部门数据
      type: Boolean,
      default: false
    }
    
  },
  data() {
    return {
      commonOrgnizeList: [],
      deptData: [],
      // commonCenterAreaList: []
    }
  },
  computed: {
    deptPlaceholder() {
      return `请选择${this.deptLabel}`
    }
  },
  created() {
    if (this.rules) {
      this.$set(this.rules, "corporationId", [{ required: true, message: '所属组织不能为空', trigger: 'change' }]);
      if (this.hasDepartment) { // 有部门
        if (this.departmentMultiple) {
          this.$set(this.rules, "deptIds", [{ required: true, message: '部门不能为空', trigger: 'change' }]);
        } else {
          this.$set(this.rules, "deptId", [{ required: true, message: '部门不能为空', trigger: 'change' }]);
        }
      }
    }
    let arr = [];
    let currentRouterCodeMsg = this.currentCorporationObj[sessionStorage.getItem("routerCode")];
    if (currentRouterCodeMsg && (currentRouterCodeMsg.checkedValues != undefined)) {
      if (currentRouterCodeMsg.checkedValues == 1) {// 1法人机构 0： 全部
        arr = this.setLoginCorporation || [];
      } else {
        arr = this.setCorporationTree || [];
      }
    } else {
      arr = this.setLoginCorporation || []; // 没有这个值就是取默认的-法人机构
    }
    if(sessionStorage.getItem('zconsole_userInfo')) {
      if(JSON.parse(sessionStorage.getItem('zconsole_userInfo')).other && JSON.parse(sessionStorage.getItem('zconsole_userInfo')).other.orgList) {
        let orgList = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).other.bindOrgList;
        for(let i = 0;i < orgList.length;i++) {
          this.commonOrgnizeList.push(orgList[i])
        }
      }
    }
    this.commonCenterAreaList = arr;
    this.isNeedDefaultValue(arr);
  },
  methods: {
    isNeedDefaultValue(arr) {
      if (!this.needDefaultValue) {
        return;
      }
      if (arr && arr.length == 1 && Array.isArray(arr) && arr.length == 1) { // 列表页只有一个组织的时候查询条件默认填充上所属中心所属组织
        // this.commonOrgnizeList = arr[0].corporationList;
        this.commonOrgnizeList = arr;
        // this.$set(this.CommonFormInline, "centerId", arr[0].corporationList[0].centerId);
        // this.$set(this.CommonFormInline, "centerName", arr[0].corporationList[0].centerName);
        // this.$set(this.CommonFormInline, "corporationId", arr[0].corporationList[0].id);
        // this.$set(this.CommonFormInline, "corporationName", arr[0].corporationList[0].orgAbbrName);
        let deptId = this.getMappingValue(arr[0].corporationList, "id", arr[0].corporationList[0].id).deptId;
        this.$emit('corporationChange', this.CommonFormInline.corporationId, deptId);
        if (this.hasDepartment) { // 有部门
          this.getDeptTree(deptId);
        }
      }
    },
    // 所属中心改变-获取所属组织
    // centerIdChange(val) {
    //   this.commonOrgnizeList = this.getMappingValue(this.commonCenterAreaList, "corporationCode", val).corporationList;
      // this.$set(this.CommonFormInline, "corporationId", undefined);
      // if (this.departmentMultiple) {
      //   this.$set(this.CommonFormInline, "deptIds", undefined);
      // } else {
      //   this.$set(this.CommonFormInline, "deptId", undefined);
      // }
      // this.$emit('centerChange',val)
    // },
    // 所属组织改变-获取所属部门
    corporationChange(val, rebackDept) { // rebackDept有这个参数的时候，说明是编辑页面需要回显部门
      if (this.notTablePage) { // 新增编辑的时候加组织对应的centerId
        // this.$set(this.CommonFormInline, "centerId", this.getMappingValue(this.getCommonAddOrgnizeList, "id", val).centerId);
        if (this.needCenterName) {
          this.$set(this.CommonFormInline, "centerName", this.getMappingValue(this.getCommonAddOrgnizeList, "orgId", val).centerName);
        }
        if (this.needCorporationName) {
          this.$set(this.CommonFormInline, "corporationName", this.getMappingValue(this.getCommonAddOrgnizeList, "orgId", val).orgAbbrName);
        }
      }
      let list = this.notTablePage ? this.getCommonAddOrgnizeList : this.commonOrgnizeList;
      let deptId = this.getMappingValue(list, "id", val).deptId;
      if (!((rebackDept && typeof(rebackDept) == "string") || (this.departmentMultiple && (rebackDept instanceof Array)))) { // 回显的时候不需要触发
        this.$emit('corporationChange', val, deptId);
        if (this.departmentMultiple) {
          this.$set(this.CommonFormInline, "deptIds", []);
        } else {
          this.$set(this.CommonFormInline, "deptId", undefined);
        }
        this.$set(this.CommonFormInline, "deptName", undefined);
      }
      // if (this.hasDepartment || this.useDeptData) {
      //   let treeData = [];
      //   queryDeptTree({
      //     deptId: deptId
      //   }).then(res => {
      //     treeData = res.data ? [res.data] : [];
      //     this.deptData = treeData
      //     this.$emit('corporationDeptChange', treeData);
      //   }).catch(err => {console.log(err)
      //     console.log('kkk');
      //   })
      // }
      // return this.$refs.organizeLazyTree.getOrganizeLazyTree(deptId, true)
      // .then(res => {
      //   if (rebackDept && (typeof(rebackDept) == "string" || (this.departmentMultiple && (rebackDept instanceof Array)))) {
      //     return this.$refs.organizeLazyTree.getOrganizeEmersionTree(rebackDept, deptId)
      //     .then(() => Promise.resolve(deptId))
      //     .catch(err => Promise.reject())
      //   } else {
      //     return Promise.resolve(deptId);
      //   }
      // }).catch(err => Promise.reject())
    },
    getDeptTree(deptId) {
      let treeData = [];
      queryDeptTree({
        deptId: deptId
      }).then(res => {
        treeData = res.data ? [res.data] : [];
        this.deptData = treeData;
        this.$emit('corporationDeptChange', treeData);
      }).catch(err => { console.log(err) })
    },
    // 所属部门改变
    departmentChange(value, label, extra) {
      this.$emit('departmentChange', value, label, extra)
      if (this.needDeptName && this.notTablePage) {
        this.$set(this.CommonFormInline, "deptName", label && label.join(","));
      }
    },
    // 重置按钮点击时清空所属组织和部门下拉数据
    reset() {
      this.commonOrgnizeList = [];
      this.deptData = []
      // if (this.$refs.organizeLazyTree) {
      //   this.$refs.organizeLazyTree.consoleOrganizeTreeList = [];
      // }
    }
  }
}
</script>
<style lang="less" scoped>
div.m-r-15 {
  display: inline-block;
}
.ngform-commonItem {
  display: flex;
  /deep/ label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  /deep/ .ant-form-item-label {
    text-align: left;
  }
}
.error-item {
  color: red;
  line-height: 20px;
}
</style>

<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="ruleForm" :model="depotForm" :rules="depotRules" :colon="false">
        <a-row class="m-t-20">
          <a-col :span="12">
            <CommonSearchItem ref="commonSearchItem" :CommonFormInline="depotForm" :rules="depotRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" labelAlign="right" :disabled="true" :hasDepartment="true" deptLabel="管理部门" :departmentMultiple="true"></CommonSearchItem>
            <a-form-model-item v-if="addEdit=='edit'" label="库房编号" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="depotForm.code" placeholder="请输入库房编号" disabled/>
            </a-form-model-item>
            <a-form-model-item label="库房名称" prop="name" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="depotForm.name" placeholder="请输入库房名称" disabled/>
            </a-form-model-item>
            <a-form-model-item label="库房位置" prop="location" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="depotForm.location" placeholder="请输入库房位置" disabled/>
            </a-form-model-item>
            <staffOrDept :labelTitle="'管理人员'" :checkedTreeNode="checkedTreeNode" :treeRoles="depotRules" :onPreview="true" :propKey="'personList'" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
            <!-- <a-form-model-item label="储存化学品" prop="chemicalList" :label-col="labelCol" :wrapper-col="wrapperCol"> -->
              <!-- <div>
                <DashBtn>
                  <div>
                    <a-button type="dashed" @click="storageAdd">添加一行</a-button>
                  </div>
                </DashBtn>
              </div> -->
              <!-- <CommonTable :noPaging="true">
                <a-table bordered :columns="columns" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        
                </a-table>
              </CommonTable> -->
            <!-- </a-form-model-item> -->
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="储存化学品" prop="chemicalList" :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table bordered :columns="columns" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
                </a-table>
              </CommonTable>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <CommonModal :title="storageAddEdit=='add' ? '新增储存化学品' : '编辑储存化学品'" :visible="storageVisible" :cancelFn="storageCancle">
      <template slot="form">
        <a-form-model
          ref="storageForm"
          :model="storageForm"
          :rules="storageFormRules"
          :label-col="{ style: { width: '90px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 90px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="化学品名称" prop="chemicalName">
            <a-select v-model="storageForm.chemicalName" placeholder="请选择化学品名称" show-search :filter-option="filterOption" allowClear>
            <a-select-option v-for="item of chemical" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="设计存量" prop="designStock">
            <a-input v-model.trim="storageForm.designStock" placeholder="请输入设计存量" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="单位" prop="unit">
            <a-input v-model.trim="storageForm.unit" placeholder="请输入单位" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="去向" prop="whereabouts">
            <a-input v-model.trim="storageForm.whereabouts" placeholder="请输入去向" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注">
            <a-input v-model.trim="storageForm.remark" placeholder="请输入备注" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="storageCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="storageConfirm">确定</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
          <!-- <a-button type="primary" class="m-r-15" @click="submitConfirm">确定</a-button> -->
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { getOrganizeList, DeptUserTree } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { nanoid } from "nanoid";
import { warehouseSave,warehouseDetail,warehouseUpdate } from "@/services/api";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import staffOrDept from "@/components/staffOrDept";
export default {
  mixins: [teableCenterEllipsis],
  components: {
    FixedBottom,
    OrganizeLazyTree,
    staffOrDept
  },
  data() {
    return {
      addEdit: "add", //add 新建，edit编辑
      checkedTreeNode:[],
      warehouseId: undefined,
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      labelTable: { span: 3 },
      wrapperTable: { span: 18 },
      storageVisible: false,
      storageAddEdit: 'add',
      storageIndex: null,
      chemicalDict: {},
      depotForm: {
        deptList: undefined,
        // toBear:[],
      },
      storageForm: {

      },
      // userTreeData: [],
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      userTreeFields: { value: 'key' },
      dataSource: [],
      columns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalName",
          key: "chemicalName",
          customRender: (text, record, index) => {
            return this.chemicalDict[text] ? this.chemicalDict[text] : text ? text : "--";
          },
        },
        {
          title: "设计存量",
          dataIndex: "designStock",
          key: "designStock",
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit",
        },
        {
          title: "去向",
          dataIndex: "whereabouts",
          key: "whereabouts",
        },
        {
          title: "备注",
          dataIndex: "remark",
          key: "remark",
        },
        // {
        //   title: "操作",
        //   scopedSlots: { customRender: "action" },
        //   key: "action",
        // }
      ],
      depotRules: {
        name: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        location: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        organization: [
          { required: true, message: "不能为空", trigger: 'change' },
        ],
        deptList: [
          { required: true, message: "不能为空", trigger: 'change' },
        ],
        personList: [
          { required: true, message: "不能为空", trigger: 'change' },
        ],
        chemicalList: [
          { required: true, validator: this.chemicalListValidator, trigger: ['blur', 'change']},
        ],
      }
    }
  },
  computed: {
    storageFormRules() {
      let storageFormRules = {
        chemicalName: [
          { required: true, validator: this.chemicalNameValidator, trigger: ['blur', 'change'] },
        ],
        designStock: [
          { required: true, validator: this.stockValidator, trigger: ['blur', 'change'] },
        ],
        unit: [
          { required: true, message: "不能为空", trigger: 'blur' },
        ],
        whereabouts: [
          { required: true, message: "不能为空", trigger: 'blur' },
        ],
      }
      return storageFormRules
    },
    corporationList() {
      return this.$store.state.setting.corporationList;
    },
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      chemical.dictItem.forEach(ele => {
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel)
      });
      return chemical.dictItem;
    },
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.warehouseId;
    if (id) {
      next(vm => {
        vm.setRouterCode("storageDepot");
        vm.addEdit = 'edit',
        vm.warehouseId = id;
        vm.getdepotDetail(id);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("storageDepot");
      })
    }
  },
  created() {
    // this.getOrganizeTree();
    // this.getDeptUserTree();
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'deptList', 'ruleForm')
    },
    // 储存化学品新增一行
    storageAdd() {
      this.storageAddEdit = 'add';
      this.storageVisible = true;
    },
    // 储存化学品编辑
    actionEdit(record, index) {
      this.storageIndex = index;
      this.storageAddEdit = 'edit';
      this.storageForm = JSON.parse(JSON.stringify(record));
      this.storageVisible = true;
    },
    // 储存化学品删除
    actionDelete(record, index) {
      const _this = this;
      this.$antConfirm({
        title: `确定删除“${record.chemicalName}”吗？`,
        onOk() {
          if (record.id) {
            console.log("在这里走接口删除。。。。");
          } else {
            _this.dataSource.splice(index, 1);
            _this.$antMessage.success('删除成功');
            if (!formValidator.formItemValidate(_this, "chemicalList", "ruleForm")) {
              return;
            }
          }
        },
        onCancel() {
          _this.$antMessage.info('取消删除');
        },
      });

    },
    // 弹框确定
    storageConfirm() {
      if (!formValidator.formAll(this, 'storageForm')) {
        return;
      }
      console.log(this.storageForm);
      if (this.storageAddEdit == 'add') {
        const data = {
          ...this.storageForm,
          dataId: nanoid(),
        }
        this.dataSource.push(data);
      } else {
        this.dataSource[this.storageIndex] = JSON.parse(JSON.stringify(this.storageForm));
      }

      this.storageVisible = false;
      this.storageForm = {};
      if (!formValidator.formItemValidate(this, "chemicalList", "ruleForm")) {
        return;
      }
    },
    // 新建提交
    // submitConfirm() {
    //   if (!formValidator.formAll(this, 'ruleForm')) {
    //     return;
    //   }
    //   const params = {
    //     ...this.depotForm,
    //     warehouseId: this.warehouseId,
    //     chemicalList: this.dataSource,
    //   }
    //   if(this.addEdit == 'add') {
    //     warehouseSave(params).then(res=>{
    //       if(res.code == 20000) {
    //         this.$antMessage.success("操作成功");
    //         this.$router.push("/chemicalsDeposit/storageDepot");
    //       }
    //     }).catch(err=>{
    //       console.log(err);
    //     })
    //   } else {
    //     warehouseUpdate(params).then(res=>{
    //       if(res.code == 20000) {
    //         this.$antMessage.success("修改成功");
    //         this.$router.push("/chemicalsDeposit/storageDepot");
    //       }
    //     }).catch(err=>{
    //       console.log(err);
    //     })
    //   }
    // },
    // 关闭化学品弹框
    storageCancle() {
      this.storageVisible = false;
      this.storageForm = {};
    },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    getdepotDetail(warehouseId) {
      warehouseDetail({warehouseId}).then(res=>{
        this.depotForm = res.data;
        this.dataSource = res.data.chemicalList;
        this.$refs.commonSearchItem.corporationChange(this.depotForm.corporationId, this.depotForm.deptIds)
        this.checkedTreeNode = this.depotForm.personList || [];
      }).catch(err=>{
        console.log(err);
      })
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    chemicalListValidator(rule, value, callback) {
      if (!this.dataSource || this.dataSource.length <= 0) {
        return Promise.reject("至少添加一行化学品");
      } else {
        callback()
      }
    },
    // 化学品名称校验
    chemicalNameValidator(rule, value, callback) {
      const duplicateName = this.dataSource.filter((item, index) => {
        return item.chemicalName == value && index != this.storageIndex;
      })
      if (!value) {
        return Promise.reject("不能为空");
      } else if (value && value.length > 30) {
        return Promise.reject("不能超过30字");
      } else if (duplicateName.length >= 1) {
        return Promise.reject(`${duplicateName[0].chemicalName}已存在`);
      } else {
        callback();
      }
    },
    // 设计存量校验
    stockValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空");
      } else if (value && value.length > 30) {
        return Promise.reject("不能超过30字");
      } else if (/\D+/g.test(value)) {
        return Promise.reject("存量只能输入正整数");
      } else if (value * 1 <= 0) {
        return Promise.reject("存量只能输入正整数");
      } else {
        callback();
      }
    },
    inputValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空");
      } else if (value && value.length > 30) {
        return Promise.reject("不能超过30字");
      } else {
        callback();
      }
    },
  }
}
</script>

<style>
</style>
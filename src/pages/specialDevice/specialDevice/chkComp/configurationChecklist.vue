<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="emForm" :model="emForm" :rules="iRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <div :class="startStatus == false ?'icon':'iconChoose'" style="display: flex"> 
              <a-icon :style="{ fontSize: '18px' }" type="check" v-model="startStatus" @click="handleChange"/>
              <span style="margin-top: 8px; margin-left: 10px">启动项目层级</span>
            </div>
            <DashBtn v-show="startStatus">
              <div>
                <a-button type="dashed" @click="projectAdd">
                  <a-icon type="plus" />添加项目
                </a-button>
              </div>
            </DashBtn>
            <vxe-table 
              border 
              align="center"
              ref="xTable" 
              :span-method="rowspanMethod"
              :seq-config="{startIndex: 0}" 
              show-overflow :column-config="{resizable: true}"
              :row-config="{height: 60, isHover: true}" 
              :data="tableData"
              >
              <vxe-column field="seq" type="seq" title="序号" width="60"></vxe-column>
              <vxe-column v-if="startStatus" field="checkName" title="检查项目" width="300">
                <template #default="{ row }">
                  <a-input :disabled="disabled" v-model="row.checkName" placeholder="请输入检查项目"></a-input>
                </template>
              </vxe-column>
              <vxe-column field="checkContent" title="检查内容">
                <template #default="{ row }">
                  <a-input :disabled="disabled" v-model="row.checkContent" placeholder="请输入检查内容" allowClear></a-input>
                </template>
              </vxe-column>
              <vxe-column title="操作" width="140" align="center" v-if="!disabled">
                <template #default="{ row , rowIndex}">
                  <a-button class="m-r-15" @click="insertEvent(row.checkName, rowIndex)">+</a-button>
                  <a-button @click="deleteEvent(row.checkName, rowIndex)" v-if="checkTypeNum(row.checkName) > 1">-</a-button>
                </template>
              </vxe-column>
            </vxe-table>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div slot="fixedBottom">
      <!-- 按钮-查看/编辑/新建 -->
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
          <a-button :loading="btnLoading" type="primary" class="m-r-15" @click="confirm">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
// import { VxeTablePropTypes } from 'vxe-table'
// 通用行合并函数（将相同多列数据合并为一行）
const rowspanMethod = ({ row, _rowIndex, column, visibleData }) => {
  const fields = ['checkName']
  const cellValue = row[column.field]
  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}

import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { checkItemList, checkItemSave, } from "@/services/deviceSafety.js"
export default {
  mixins: [],
  components: {
    FixedBottom,
  },
  props: {
    planId: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [
        { checkName: ""},
      ],
      rowspanMethod: rowspanMethod,
      iRules: {},
      emForm: {},
      startStatus: false,
      btnLoading: false,
      labelCol: { style: { width: '136px' } },
      wrapperCol: { style: { width: 'calc(100% - 136px)' } },
    }
  },
  created() {
    console.log('0 机动车 1 起重机械 2 电梯 3 压力管道 4 压力容器',this.$route.query);
    this.initData();
  },
  methods: {
    projectAdd(){
      this.tableData.push({ checkName: '' });
      console.log(this.tableData,'this.tableData[-1]');
    },
    //选择启用项目层级
    handleChange() {
      this.$antConfirm({
        title: '切换启用项目层级状态会清空原有配置点检表单，确认切换？',
        onOk: async () => {
          this.$antMessage.success('切换成功！')
          this.startStatus = !this.startStatus;
          this.tableData = [{ checkName: ""}],
          console.log('this.startStatus',this.startStatus);
        }
      })
    },
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    insertEvent(checkName, index) {
      let record = { checkName: checkName,};
      this.tableData.splice(index + 1, 0, record);
      console.log('index',index);
    },
    deleteEvent(checkName, index) {
      this.tableData.splice(index, 1);
    },
    checkTypeNum(checkName) {
      return this.tableData.filter((item) => item.checkName == checkName).length;
    },
    // 初始化数据
    initData() {
      if (this.$route.query.checkType && this.$route.query.equipType) {
        this.echoReportEdit();
      } else {
        this.$antMessage.warn("缺少参数~");
        return
      }
    },
    // 报告-编辑/查看
    echoReportEdit() {
      let checkType = 0
      if (this.$route.query.checkType == 'day'){
        checkType = 1
      } else if (this.$route.query.checkType == 'month') {
        checkType = 2
      } else if (this.$route.query.checkType == 'year') {
        checkType = 3
      } else {
        checkType = 4
      }
      checkItemList({ checkType: checkType, equipType: this.$route.query.equipType}).then(res => {
        console.log(res.data,'万千傻逼随它去');
        if (res.data.length != 0 ){
          let resultObj = res.data || {};
          // 表格回显
          this.tableData = resultObj
          this.startStatus = resultObj[0].enableProjectLevel == '1'? true : false// 是否启用
        } else {
          this.tableData = [{ checkName: ""}]
        }
      }).catch(err => {
        console.log(err,'error')
      }).finally(() => {

      })
    },
    // 提交
    confirm() { 
      console.log(this.tableData,'this.tableData');
      if (this.startStatus){
        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].checkName) {
            this.$antMessage.warn("检查项目必须填写");
            return;
          }
        }
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].checkContent) {
          this.$antMessage.warn("检查内容必须填写");
          return;
        }
      }
      const filteredTableData = this.tableData.map(item => {
        const { _X_ROW_KEY, ...rest } = item;
        return rest;
      });
      let checkType = 0
      if (this.$route.query.checkType == 'day'){
        checkType = 1
      } else if (this.$route.query.checkType == 'month') {
        checkType = 2
      } else if (this.$route.query.checkType == 'year') {
        checkType = 3
      } else {
        checkType = 4
      }
      let params = {
        checkType: checkType, 
        equipType: this.$route.query.equipType,
        itemList: filteredTableData,
        enableProjectLevel: this.startStatus == false ? '0' : '1' 
      }
      this.btnLoading = true;
      checkItemSave(params).then ((res)=>{
        console.log(res,'resss');
        this.$antMessage.success("操作成功");
        this.$router.go(-1)
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.btnLoading = false;
        this.tableData = [{ checkName: ""}]
      })
    },
  }
}
</script>

<style lang="less" scoped>
.icon {
  ::v-deep .anticon-check{
    border: 1px solid #D9D9D9;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    color: transparent;
  }
  ::v-deep .anticon-check:hover {
    border-color: #0067cc;
    transition: border-color .5s linear;
  }
}
.iconChoose {
  ::v-deep .anticon-check{
    border: 1px solid;
    color: aliceblue;
    background-color: #0067cc;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
}
</style>
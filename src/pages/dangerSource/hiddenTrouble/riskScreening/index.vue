<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>风险排查频次库</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="searchFormData" :needDefaultValue="true"></CommonSearchItem>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span v-if="flag" class="color-0067cc cursor-pointer" @click="actionEdit(record)">编辑</span>
          <span v-else class="color-999">编辑</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal title="编辑" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <PageTitle>管控层级</PageTitle>
          <CommonSearchItem
            :label-col="{ style: { width: '130px' } }"
            :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
            ref="commonSearchItem"
            :CommonFormInline="addForm"
            :notTablePage="true"
            :labelAlign="'left'"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="公司级" prop="companyLevel">
            <a-select v-model="addForm.companyLevel" placeholder="请选择" prop="operationLine" allowClear>
              <a-select-option v-for="item in centerAreaList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="部门级" prop="deptParentLevel">
            <a-select v-model="addForm.deptParentLevel" placeholder="请选择" prop="operationLine" allowClear>
              <a-select-option v-for="item in centerAreaList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="科室级" prop="deptSublevel">
            <a-select v-model="addForm.deptSublevel" placeholder="请选择" prop="operationLine" allowClear>
              <a-select-option v-for="item in centerAreaList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="班组（岗位）级" prop="jobLevel">
            <a-select v-model="addForm.jobLevel" placeholder="请选择" prop="operationLine" allowClear>
              <a-select-option v-for="item in centerAreaList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="安全管理部门" prop="securityLevel">
            <a-select v-model="addForm.securityLevel" placeholder="请选择" prop="operationLine" allowClear>
              <a-select-option v-for="item in centerAreaList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button class="m-r-15" @click="addCancle">取消</a-button>
        <a-button type="primary" :loading="addLoading" @click="addConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import {
  getFrequencyList,
  updateFrequency,
} from "@/services/dangerSource/dangerList/index.js";
import dictionary from "@/utils/dictionary.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import { tr } from 'date-fns/locale';

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      addVisible: false,
      addLoading: false,
      loading: false,
      addForm: {},
      searchFormData: {},
      addFormRules: {
        corporationId: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
        // companyLevel: [
        //   { required: true, message: "公司不能为空", trigger: "change" },
        // ],
        // deptParentLevel: [
        //   { required: true, message: "部门不能为空", trigger: "change" },
        // ],
        // deptSublevel: [
        //   { required: true, message: "科室不能为空", trigger: "blur" },
        // ],
        // jobLevel: [
        //   { required: true, message: "班组（岗位）不能为空", trigger: "blur" },
        // ],
        // securityLevel: [
        //   { required: true, message: "安全管理部门不能为空", trigger: "blur" },
        // ],
      },
      centerAreaList: [],
      replaceFields: {
        children: "children",
        title: "title",
        key: "id",
        value: "id",
      },
      treeData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "风险分级",
          dataIndex: "riskLevel",
          fixed: "left",
          width: 150,
          customCell: (record) => {
            let background =
              dictionary("riskLevel", record.riskLevel, false).color || "";
            return {
              style: { background: background, color: '#000' },
            };
          },
          customRender: (text, record) => {
            return record ? dictionary("riskLevel", record.riskLevel) : "--";
          },
        },
        {
          title: "管控层级",
          children: [
            {
              title: "公司级",
              dataIndex: "companyLevel",
              fixed: "left",
              align: "center",
              customRender: (text, record) => {
                return record.list.length
                  ? this.thing(record.list, "companyLevel")
                  : "--";
              },
            },
            {
              title: "部门级",
              dataIndex: "deptParentLevel",
              fixed: "left",
              align: "center",
              customRender: (text, record) => {
                return record.list.length
                  ? this.thing(record.list, "deptParentLevel")
                  : "--";
              },
            },
            {
              title: "科室级",
              dataIndex: "deptSublevel",
              fixed: "left",
              align: "center",
              customRender: (text, record) => {
                return record.list.length
                  ? this.thing(record.list, "deptSublevel")
                  : "--";
              },
            },
            {
              title: "班组（岗位）级",
              dataIndex: "jobLevel",
              fixed: "left",
              align: "center",
              customRender: (text, record) => {
                return record.list.length
                  ? this.thing(record.list, "jobLevel")
                  : "--";
              },
            },
            {
              title: "安全管理部门",
              dataIndex: " securityLevel",
              fixed: "left",
              align: "center",
              customRender: (text, record) => {
                return record.list.length
                  ? this.thing(record.list, "securityLevel")
                  : "--";
              },
            },
          ],
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],
      recordDeit: {},
      flag: false,
    };
  },
  created() {
    // this.setRouterCode("/dangerSource/riskScreening")
    this.centerAreaList = dictionary("checkFrequencyLevel");
    this.getDataList();
  },
  methods: {
    //列表数据处理-找出相对应的列行
    thing(list, companyLevel) {
      let list2 = list.filter((item) => {
        return item.controlLevel == companyLevel;
      });
      return list2.length ? dictionary('checkFrequencyLevel', list2[0].checkFrequencyLevel) : "--";
    },

    // 获取列表
    getDataList() {
      let obj = this.searchFormData
      this.tableSpinning = true
      return getFrequencyList(obj)
        .then((res) => {
          this.cancelLoading(100);
          let list = res.data ? res.data : [];
          this.dealList(list); //处理list
          this.setFlag()//编辑按钮是否禁用
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },

    //处理编辑按钮是否禁用
    setFlag() {
      let list = this.getCommonAddOrgnizeList
      let corporationId = this.searchFormData.corporationId
      if (!corporationId) {
        return
      }
      list.filter(item => {
        if (item.id == corporationId) {
          this.flag = true
          return
        } else {
          this.flag = false
        }
      })
    },

    //处理列表list方法
    dealList(resData) {
      let listRes = resData;

      let list1 = []; //重大风险
      let list2 = []; //较大风险
      let list3 = []; //一般风险
      let list4 = []; //低风险
      let list5 = [];

      listRes.forEach((item) => {
        if (item.riskLevel == "significantRisk") {
          //重大风险
          list1.push(item);
        }
        if (item.riskLevel == "largerRisk") {
          //较大风险
          list2.push(item);
        }
        if (item.riskLevel == "generalRisk") {
          //一般风险
          list3.push(item);
        }
        if (item.riskLevel == "lowRisk") {
          //低风险
          list4.push(item);
        }
      });
      list5 = [
        //格式数组
        { list: list1, riskLevel: "significantRisk" },
        { list: list2, riskLevel: "largerRisk" },
        { list: list3, riskLevel: "generalRisk" },
        { list: list4, riskLevel: "lowRisk" },
      ];

      this.tableDataList = list5;
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      // 获取列表
      this.loading = true
      this.getDataList().finally(() => {
        this.loading = false
        this.cancelLoading();
      });
    },

    // 重置
    iRest: debounce(
      function () {
        this.searchFormData = {};
        // this.$refs.commonSearchItem.reset();
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 编辑确认数据处理
    dealEditInfomation() {
      //1.深拷贝表单数据，存储centerId和corporationId 
      //2.删除表单数据中centerId和corporationId（因为循环中不需要循环这两条对象）
      //3.遍历数据把后端需要的参数进行处理赋值

      let riskLevel = this.recordDeit.riskLevel;
      let obj = JSON.parse(JSON.stringify(this.addForm));

      let centerId = obj.centerId
      let corporationId = obj.corporationId

      delete obj.centerId
      delete obj.corporationId
      delete obj.centerName
      delete obj.corporationName

      let list = [];
      for (var i in obj) {
        list.push({
          controlLevel: i,
          checkFrequencyLevel: obj[i],
          riskLevel: riskLevel,
          centerId,
          corporationId
          // controlLevelName: dictionary("controlLevel", i),
          // checkFrequencyLevelName: dictionary("checkFrequencyLevel", obj[i]),
          // riskLevelName: dictionary("riskLevel", riskLevel),
        });
      }
      console.log(list, '...list');
      return {
        centerId,
        corporationId,
        riskLevel: riskLevel,
        list
      };
    },

    // 编辑弹窗确认
    addConfirm() {
      if (!formValidator.formAll(this, 'addForm')) {
        return;
      }
      let obj = this.dealEditInfomation();//获取编辑表单参数
      this.addLoading = true
      updateFrequency(obj)
        .then(() => {
          this.addLoading = false
          this.$antMessage.success("修改成功");
          this.getDataList(); //获取列表
          this.addCancle(); //关闭弹窗
        })
        .catch((err) => {
          this.addLoading = false
          console.log(err);
        });
    },

    // 编辑弹窗取消
    addCancle() {
      this.addVisible = false;
      this.addForm = {};
    },

    // 编辑弹窗打开
    actionEdit(record) {
      this.recordDeit = record;//存储风险分级
      let list = record.list;
      let obj = {};
      list.length &&
        list.forEach((item) => {
          if (item.controlLevel) {
            obj = { ...obj, [item.controlLevel]: item.checkFrequencyLevel };
          }
        });
      if (list.length) {
        obj.corporationId = list[0].corporationId
        obj.centerId = list[0].centerId
      }
      this.addForm = obj;
      this.addVisible = true;
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
  },
};
</script>
<style lang="less" scoped>
.rule {
  width: 80px;
  margin: 0 10px;
}
::v-deep.ant-form {
  h2 {
    margin-top: 0 !important;
  }
}
::v-deep .ant-table-tbody {
  .ant-table-fixed-columns-in-body {
    color: #505659 !important;
  }
}
</style>
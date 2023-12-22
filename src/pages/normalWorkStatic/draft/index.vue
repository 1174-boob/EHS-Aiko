<template>
  <div class="searchtable-wrapper mod-config clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>一般作业草稿箱</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="施工日类型">
          <a-select allowClear v-model="formInline.typeOfConstructionDayId" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOptionMixin" @change="operateTypeChange">
            <a-select-option v-for="item in getChemicalDictList('type_of_construction_day')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="设备/工程名称">
          <a-input v-model="formInline.nameOfEquipmentOrWorks" :maxLength="30" placeholder="请输入设备/工程名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="施工位置">
          <a-input v-model="formInline.constructionLocation" :maxLength="30" placeholder="请输入施工位置" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!--表格列表 -->
    <CommonTable :page="page" :spinning="tableSpinning" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <template v-for="(item,index) in columnsAll">
          <vxe-column :key="item.id" :field="item.props" :min-width="item.minWidth?item.minWidth:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="index == 6">{{row.supervisionPersonName+'/'+row.supervisionPersonJobNumber}}</span>
              <span v-if="index == 7">{{row.estimatedConstructionDateStart+'-'+row.estimatedConstructionDateEnd}}</span>
              <span>{{ row[item.props] }}</span>
            </template>
          </vxe-column>
        </template>
        <vxe-column field="action" fixed="right" title="操作" width="110">
          <template #default="{ row }">
            <div class="table-btn-box">
              <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change',row)">编辑</span>
              <span class="color-ff4d4f cursor-pointer" @click="delDataList(row)">删除</span>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import { operateInfoListPag, operateInfoDelete } from "@/services/dangerWorkStatic.js";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
export default {
  mixins: [cancelLoading, chemicalDict],
  data() {
    return {
      dictionary,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableSpinning:false,
      formInline: {},
      // 作业编号 所属组织 所属厂区 申请部门 施工位置 设备/工程名称 监督人 施工日期 施工日类型 申请日期
      columnsAll: [
        {
          id: 1,
          title: "作业编号",
          disabled: true,
          isDefault: true,
          props: 'generalOperateNumber',
          minWidth: 170,
        },
        {
          id: 3,
          title: "所属组织",
          disabled: true,
          isDefault: true,
          props: 'corporationName',
        },
        {
          id: 4,
          title: "所属厂区",
          isDefault: true,
          props: 'plantAreaName',
        },
        {
          id: 5,
          title: "申请部门",
          disabled: true,
          isDefault: true,
          props: 'applicationDepartmentName',
        },
        {
          id: 6,
          title: "施工位置",
          disabled: true,
          isDefault: true,
          props: 'constructionLocation',
        },
        {
          id: 7,
          title: "设备/工程名称",
          isDefault: true,
          props: 'nameOfEquipmentOrWorks',
        },
        {
          id: 8,
          title: "监督人",
          isDefault: true,
        },
        {
          id: 9,
          title: "施工日期",
          isDefault: true,
          minWidth: 160,
        },
        {
          id: 10,
          title: "施工日类型",
          isDefault: true,
          props: 'typeOfConstructionDayName',
        },
        {
          id: 11,
          title: "申请日期",
          isDefault: true,
          props: 'createTime',
          minWidth: 120,
        },
      ],
      tableList: [],
      // 作业级别下拉
      hazardLevelList: [],
    };
  },
  created() {
    this.setRouterCode('normalWorkStaticDraft')
    this.getTableList()
  },
  methods: {
    // 获取列表
    getTableList() {
      const params = {
        // 草稿列表1是2否
        isDraft: 1,
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      operateInfoListPag(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          tableList = tableList || [];
          console.log('tableList草稿箱',tableList);
          // 处理数据
          tableList.forEach(item => {
            // 作业类别
            item.operateTypeText = this.getChemicalDictText('hazard_category', item.operateType)
            // 作业级别
            if (item.operateType == 'fire_work') {
              item.operateLevelText = dictionary('dangerhazardHLevel', item.operateLevel)
            } else if (item.operateType == 'high_work') {
              item.operateLevelText = dictionary('dangerhazardGLevel', item.operateLevel)
            } else {
              item.operateLevelText = ''
            }
          })
          this.tableList = tableList
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    // 作业类别改变
    operateTypeChange(val) {
      if (val == 'fire_work') {
        this.hazardLevelList = dictionary('dangerhazardHLevel')
      } else if (val == 'high_work') {
        this.hazardLevelList = dictionary('dangerhazardGLevel')
      } else {
        this.hazardLevelList = []
      }
      console.log(this.hazardLevelList);
      this.$set(this.formInline, 'operateLevel', undefined)
    },
    //跳转新增、编辑页面
    jumpAddOrDetail(type, row) {
      let query = row ? { generalOperateId: row.generalOperateId } : {};
      let path = type == 'add' ? "/safeManage/workManage/normalWorkStatic/normalWorkStaticAddAndChange" : "/safeManage/workManage/normalWorkStatic/normalWorkStaticAddAndChange"
      this.$router.push({
        path,
        query,
      });
    },
    // 删除
    delDataList(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return operateInfoDelete({ generalOperateId: row.generalOperateId })
            .then((res) => {
              this.$antMessage.success('删除成功');
              this.getTableList();
            })
            .catch(err => { });
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
    // 查询
    iSearch() {
      this.handleLoading();
      this.getTableList();
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {};
        this.hazardLevelList = []
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style scoped lang='less'>
.table-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 20px !important;
  }
  ::v-deep .ant-modal-body {
    .clx-model-body {
      padding: 0 30px !important;
      .model-content {
        padding: 0;
      }
    }
  }
}
::v-deep .dashed-btn {
  align-items: center;
}
.ttips {
  height: 100%;
  display: flex;
  align-items: center;
  .circle-item {
    margin-right: 15px;
  }
}
.top_div_marginDiv {
  margin-bottom: 15px;
}
.down_p {
  &:hover {
    color: #0067cc;
    cursor: pointer;
  }
}
.picture-avatar {
  img {
    width: 40px;
    height: 40px;
    margin: 0 2px;
  }
}
.picture-list {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 240px;
}
.ant-popover {
  .ant-popover-inner-content {
    img {
      cursor: pointer;
      width: 40px;
      height: 40px;
      margin: 2px;
    }
  }
}

::v-deep .dashed-btn .upload-btn-style .ant-btn {
  background: #f1f4ff !important;
  color: #0067cc !important;
  border: 1px dashed #9fcaf5 !important;
  margin-right: 10px !important;
  &:hover {
    border: 1px dashed #0067cc !important;
  }
}
.table-btn-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.mod-config {
  /deep/ .el-table {
    th.el-table__cell {
      background: rgba(250, 250, 250, 0.5);
      padding: 16px 0;
    }
  }
}
</style>

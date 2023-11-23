<template>
  <HasFixedBottomWrapper>
    <div class="clx-flex-1">
      <PageTitle style="margin-left: 35%;" v-if="queryData.checkType== '1' && allData.equipType =='0'">叉车日常检查、维护保养及异常问题处理记录表</PageTitle>
      <PageTitle style="margin-left: 45%;" v-if="queryData.checkType== '1' && allData.equipType =='1'">起重机械点检记录表</PageTitle>
      <PageTitle style="margin-left: 45%;" v-if="queryData.checkType== '1' && allData.equipType =='4'">压力容器点检记录表</PageTitle>
      <PageTitle style="margin-left: 45%;" v-if="queryData.checkType== '2' && allData.equipType =='3'">压力管道点检记录表</PageTitle>
      <PageTitle style="margin-left: 45%;" v-if="queryData.checkType== '2' && allData.equipType =='0'">叉车月度检查记录表</PageTitle>
      <PageTitle style="margin-left: 45%;" v-if="queryData.checkType== '3' && allData.equipType =='0'">叉车年度检查记录表</PageTitle>
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="4">设备名称：{{allData.equipmentName}}</a-col>
          <a-col :span="4" v-if="allData.forkliftPlateNum!= null" >牌照编号：{{allData.forkliftPlateNum}}</a-col>
          <a-col v-if="allData.equipType !='3'" :span="4">设备代码：{{allData.equipmentCode}}</a-col>
          <a-col v-if="allData.equipType !='3'" :span="4">所在位置：{{allData.equipmentLocation}}</a-col>
          <a-col v-if="allData.equipType =='3'" :span="4">检查者：{{allData.checkUserName}}/{{allData.checkUserJobNumber}}</a-col>
          <a-col v-if="queryData.checkType =='3'" :span="4">安全管理人员：{{allData.checkUserName}}/{{allData.checkUserJobNumber}}</a-col>
          <a-col :span="4">检查时间：{{checkTime}}</a-col>
        </a-row>
      </div>
    </div>
    
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
      <vxe-column fixed="left" field="seq" type="seq" title="序号" width="60"></vxe-column>
      <vxe-column fixed="left" v-if="startStatus" field="checkName" title="检查项目" width="300">
        <template #default="{ row }">
          <span>{{row.checkName}}</span>
        </template>
      </vxe-column>
      <vxe-column fixed="left" field="checkContent" title="检查内容"  width="600">
        <template #default="{ row }">
          <span>{{row.checkContent}}</span>
        </template>
      </vxe-column>
      <vxe-column fixed="left" v-if="allData.equipType=='4'" field="classes" title="班次" width="60">
        <template #default="{ row }">
          <span>{{row.classes == '1' ? '白': row.classes == '2'? "中":row.classes == '3'? '晚':row.classes}}</span>
        </template>
      </vxe-column>
      <vxe-column v-for="(day, index) in titleListData" :key="index" width="75" :field="day" :title="isNaN(Number(day.split('-')[2])+'')? Number(day)+'':Number(day.split('-')[2])+''" align="center">
        <template #default="{ row }">
          <span >{{row[day] == '1' ? '√':row[day] == '0'?'x':row[day]}}</span>
        </template>
      </vxe-column>
      <vxe-column v-if="queryData.checkType=='3'" field="checkContent" title="检查结果" width="600">
        <template #default="{ row }">
          <span>{{row.checkResult == '1' ? '√': row.checkResult == '0'? "x":row.checkResult}}</span>
        </template>
      </vxe-column>
      
    </vxe-table>
    <div v-if="queryData.checkType== '1'" class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="24">注：每天操作前进行检查并将检查情况填入单元格内（√表示正常；×表示异常）。发现异常马上报告负责人并经负责人确认后及时处理，处理后在下表中做好记录。</a-col>
        </a-row>
      </div>
    </div>

    <template title="异常问题处理记录">
      <div>
        <div class="m-t-20 border-b-e7 ttile ttile-add-btn">
          <PageTitle class="ttile-text">异常问题处理记录</PageTitle>
        </div>
        <div class="m-t-20"></div>
      </div>
      <a-form-model-item ref="itemList" label=" " prop="itemList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <CommonTable>
          <vxe-table
            class="vxe-scrollbar beauty-scroll-fireBox"
            border
            :show-header-overflow="!isShowPage"
            :show-overflow="!isShowPage"
            align="center"
            :seq-config="{startIndex: 0}" 
            :row-config="{isHover: true}"
            :data="iFrom.fireAlarmList"
          >
            <vxe-column field="seq" type="seq" title="序号" width="60"></vxe-column>
            <vxe-column field="description" title="异常问题描述">
              <template #default="{ row }">
                <span>{{ row.description }}</span>
              </template>
            </vxe-column>
            <vxe-column field="dealWith" title="异常问题处理情况">
              <template #default="{ row }">
                <span>{{ row.dealWith }}</span>
              </template>
            </vxe-column>
            <vxe-column field="handleUserId" title="处理人">
              <template #default="{ row }">
                <span>{{ row.handleUserName}}/{{ row.handleUserJobNumber}}</span>
              </template>
            </vxe-column>
            <vxe-column field="handleDate" title="处理日期">
              <template #default="{ row }">
                <span>{{ row.handleDate}}</span>
              </template>
            </vxe-column>
            <vxe-column field="secureManageUserId" title="安全管理员">
              <template #default="{ row }">
                <span>{{ row.secureManageUserName}}/{{ row.secureManageUserJobNumber}}</span>
              </template>
            </vxe-column>
            <vxe-column field="secureManageHandleDate" title="处理日期">
              <template #default="{ row }">
                <span>{{ row.secureManageHandleDate}}</span>
              </template>
            </vxe-column>
            <vxe-column field="remark" title="备注">
              <template #default="{ row }">
                <span>{{ row.remark == null ? '--' : row.remark }}</span>
              </template>
            </vxe-column>
            <template #empty>
              <div style="padding:16px 0;">
                <a-empty />
              </div>
            </template>
          </vxe-table>
        </CommonTable>
      </a-form-model-item>
    </template>

    <div slot="fixedBottom">
      <!-- 按钮-查看/编辑/新建 -->
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
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
import { debounce } from "lodash";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import moment from 'moment'
import { checkDetail } from "@/services/deviceSafety.js"
export default {
  name: "ClkchkSearch",
  components: {
    FixedBottom,
  },
  created(){
    console.log(this.$route.query.row,'跳转的参数');
    this.queryData = this.$route.query.row
    this.initData()
  },
  data() {
    return {
      rowspanMethod: rowspanMethod,
      tableData: [
        { checkName: ""},
      ],
      dayTableDataList: [],
      startStatus: false,
      queryData:{},
      editForm: {},
      allData: {},
      titleListData: [],
      checkTime:'',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      iFrom: {
        fireAlarmList: [],
      },
      formModelFireData: {},
      fireType: '',
    };
  },
  computed: {
    // 当前页面是否为查看
    isShowPage() {
      return Boolean(this.$route.meta.isShowPage)
    },
  },
  methods: {
    // 初始化数据
    initData() {
      if (this.$route.query.row.checkId ) {
        this.echoReportEdit();
      } else {
        this.$antMessage.warn("缺少参数~");
        return
      }
    },
    // 报告-编辑/查看
    echoReportEdit() {
      checkDetail({ checkId: this.$route.query.row.checkId,}).then(res => {
        console.log(res.data,'详情');
        if (res.data.length != 0 ){
          let resultObj = res.data || {};
          // 表格回显
          this.startStatus = resultObj.enableProjectLevel == '1'? true : false// 是否启用
          this.tableData = resultObj.checkResultList;  
          this.allData = resultObj
          let splitArr = resultObj.checkDate.split("-");
          let checkYear = splitArr[0]; // 年
          let checkMonth = splitArr[1];// 月

          if(resultObj.checkType == '1'){
            this.checkTime = checkYear+'年'+checkMonth+'月'
            this.$nextTick(()=>{
              this.titleListData = resultObj.checkResultTitle
            })
          } else if(resultObj.checkType == '2') {
            this.checkTime = checkYear+'年'
            this.$nextTick(()=>{
              this.titleListData = ['1','2','3','4','5','6','7','8','9','10','11','12']
            })
          } else if(resultObj.checkType == '3') {
            this.checkTime = resultObj.checkDate
            this.$nextTick(()=>{
              this.titleListData = []
            })
            console.log('aaaa ');
          }
          this.iFrom.fireAlarmList = resultObj.checkExceptionList == null ? [] : resultObj.checkExceptionList
        } else {
          this.tableData = [{ checkName: ""}]
        }
      }).catch(err => {
        console.log(err,'error')
      }).finally(() => {

      })
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.download {
  padding: 20px 0;
}
.baseInfo {
  padding: 30px 0;
  .bottom {
    margin-top: 30px;
  }
}
</style>
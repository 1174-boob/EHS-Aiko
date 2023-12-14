<template>
  <div>
    <CommonDrawer title="选择模板" :visible="selTempDrawerShow" :cancelFn="cancelFn" :width="'80vw'" :zIndex="1000">
      <template>

        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <CommonSearchItem ref="commonSearchItem" :hasDepartment="false" :CommonFormInline="formInline"
              :needDeptName="true"></CommonSearchItem>
            <a-form-model-item label="模板类型">
              <a-select allowClear show-search v-model="formInline.templateTypeId" placeholder="请选择模板类型" @change="templateTypeIdChange">
                <a-select-option v-for="item in getDictTarget('u', 'template_type')" :key="item.key" :value="item.key">{{
                  item.value }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="模板分类">
              <a-select allowClear show-search v-model="formInline.templateClassificationId" placeholder="请选择模板分类">
                <a-select-option v-for="item in templateClassificationList" :key="item.key" :value="item.key">{{
                  item.value }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="模板名称">
              <a-input v-model="formInline.templateName" :maxLength="100" placeholder="请输入模板名称" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>

        <div class="selTempListContainer" v-loading="boxLoading">
          <ul class="selTempList" v-if="tempShowList.length">
            <li class="selTempItem" v-for="item in tempShowList" :key="item.templateId">
              <div class="selRadioBox">
                <a-radio :checked="selTempIds.includes(item.templateId)" @click="selTempFn(item)"></a-radio>
              </div>
              <img class="pic" :src="item.coverFile?.filePath || ''" :alt="item.templateName">
              <div class="mask">
                <div class="maskBtn" @click="openTempPreviewModel(item)">
                  <a-icon class="eyeBtn" type="eye" />预览
                </div>
              </div>
            </li>
          </ul>

          <a-empty class="empty" v-else />
        </div>

        <div class="pagination">
          <a-pagination v-show="page.total" show-size-changer :current="page.pageNo" :pageSize="page.pageSize"
            :page-size-options="page.pageSizeOptions ? page.pageSizeOptions : ['8', '16', '24', '32', '40']"
            :total="page.total" :show-total="total => `共 ${total} 条`" showQuickJumper @change="pageNoChange"
            @showSizeChange="onShowSizeChange" />
        </div>

      </template>

      <template slot="btn">
        <a-button type="dashed" @click="cancelFn">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="onSubmitDrawer">确定</a-button>
      </template>
    </CommonDrawer>


    <TempPreviewModel v-model="tempPreviewModelShow" :previewData="previewData" @selTempFn="selTempFn" />
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { getDictTarget } from '@/utils/dictionary'
import { cloneDeep, debounce } from 'lodash'
import { managementListPage } from "@/services/api"
import TempPreviewModel from './tempPreviewModel.vue'
export default {
  components: { TempPreviewModel },
  mixins: [cancelLoading],
  model: {
    prop: 'selTempDrawerShow',
  },
  props: {
    selTempDrawerShow: {
      type: Boolean,
      default: false
    },
    selTempList:{
      type: undefined | Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      getDictTarget,
      boxLoading:true,
      tempPreviewModelShow: false,
      formInline: {},
      // 当前选择的模板信息
      selTempListIng:[],
      // 当前展示的模板信息
      tempShowList: [],
      // 当前预览模板的信息
      previewData: {},
      page: {
        pageNo: 1,
        pageSize: 8,
        total: 0
      },
    }
  },
  computed:{
    selTempIds(){
      return this.selTempListIng.map(item=>item.templateId)
    },
    templateClassificationList(){
      const dictGroupCode = this.formInline.templateTypeId
      return dictGroupCode ? (getDictTarget('u', dictGroupCode) || []) : []
    },
  }, 
  methods: {
    templateTypeIdChange(){
      this.$set( this.formInline,'templateClassificationId',undefined)
    },  
    // 获取模板列表
    getDataList() {
      let params = {
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        ...this.formInline,
      }
      this.boxLoading = true
      return managementListPage(params)
        .then((res) => {
          let { list: tempShowList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tempShowList = tempShowList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tempShowList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err => { })
        .finally(()=>{
          this.boxLoading = false
        })
    },
    // 选择模板
    selTempFn(tempItem) {
      this.selTempListIng = [tempItem]
    },
    // 关闭抽屉
    cancelFn() {
      this.$emit('input', false)
    },
    // 预览模板
    openTempPreviewModel(item) {
      this.previewData = item
      this.tempPreviewModelShow = true
    },
    // 确定选择模板
    onSubmitDrawer() {
      if(this.selTempIds.length == 0){
        this.$antMessage.warn("请先选择模板");
        return 
      }
      this.$emit('changeSelTempDrawerList',this.selTempListIng)
      this.cancelFn()
    },
    // 查询
    iSearch() {
      // 获取列表
      this.page.pageNo = 1
      this.getDataList()
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 8,
        total: 0,
      }
      this.formInline = {}
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    pageNoChange(page) {
      this.page.pageNo = page
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
  },
  watch: {
    selTempDrawerShow(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.boxLoading = true
          this.selTempListIng = cloneDeep(this.selTempList)
          this.iRest()
          this.getDataList()
        });
      } else {
        setTimeout(() => {
          
        }, 100);
      }
    }
  }
};
</script>

<style scoped lang='less'>
.selTempListContainer {
  display: flex;
  align-items: center;
  justify-content: center;

  .selTempList {
    padding-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 18px;
    grid-row-gap: 18px;

    .selTempItem {
      position: relative;
      overflow: hidden;

      &:hover {
        .mask {
          display: flex;
        }
      }

      .selRadioBox {
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 4px 8px 4px;
        z-index: 2;

        ::v-deep .ant-radio-inner {
          border-color: #0067cc;
        }
      }

      .pic {
        width: 100%;
      }

      .mask {
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.5);
        align-items: center;
        justify-content: center;

        .maskBtn {
          font-size: 16px;
          line-height: 1;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;

          .eyeBtn {
            font-size: 24px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .empty{
    padding-top: 20px;
  }
}

.pagination {
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

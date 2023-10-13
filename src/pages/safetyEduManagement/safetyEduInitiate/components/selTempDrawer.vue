<template>
    <CommonDrawer title="选择模板" :visible="selTempDrawerShow" :cancelFn="cancelFn" :width="'80vw'" :zIndex="2000">
      <template>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <CommonSearchItem ref="commonSearchItem" :hasDepartment="false" :CommonFormInline="formInline" :needDeptName="true"></CommonSearchItem>
            <a-form-model-item label="模板类型">
              <a-select allowClear show-search v-model="formInline.mobanleixing" placeholder="请选择模板类型">
                <a-select-option v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="模板分类">
              <a-select allowClear show-search v-model="formInline.mobanfenlei" placeholder="请选择模板分类">
                <a-select-option v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="模板名称">
              <a-input v-model="formInline.mobanmingcheng" :maxLength="100" placeholder="请输入模板名称" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <ul class="selTempList">
          <li class="selTempItem" v-for="item in 6" :key="item">
            <a-radio class="selRadio"></a-radio>
            <img class="pic" src="https://img0.baidu.com/it/u=557569791,1139414725&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=688" alt="">
          </li>
        </ul>
      </template>
      <template slot="btn">
        <a-button type="dashed" @click="cancelFn">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="onSubmitDrawer">确定</a-button>
      </template>
    </CommonDrawer>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import {getDictTarget} from '@/utils/dictionary'
import { debounce } from 'lodash'
import {getSafetyEduTableList} from "@/services/safetyEduManagement"
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'selTempDrawerShow',
  },
  props: {
    selTempDrawerShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getDictTarget,
      formInline:{},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
    }
  },
  created() {
  },
  methods: {
    cancelFn() {
      this.$emit('input', false)
    },
    onSubmitDrawer() {
     
    },
    getDataList() {
      let params = {}
      return getSafetyEduTableList(params)
        .then((res) => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableDataList = tableDataList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err=>{})
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
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
  },
};
</script>

<style scoped lang='less'>
.selTempList{
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 18px;
  grid-row-gap: 18px;
  .selTempItem{
    position: relative;
    overflow: hidden;
    .selRadio{
      position: absolute;
      top: 10px;
      left: 12px;
    }
    .pic{
      width: 100%;
    }
  }
}
</style>

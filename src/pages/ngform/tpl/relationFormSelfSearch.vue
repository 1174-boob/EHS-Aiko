<template>
  <!-- 自定义组件无法正常回显到搜索项中，所以要单独处理 -->
  <SearchTerm>
    <el-form :inline="true" ref="dataForm" :model="dataForm">
      <template v-for="item in copyQueryList">
        <template v-if="isCustom(item.type)">
          <div v-if="item.type == 'organizeTree'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <OrganizeTree :record="item" :models="dataForm"></OrganizeTree>
            </div>
          </div>
          <div v-if="item.type == 'staffTree'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <StaffTree :record="item" :models="dataForm"></StaffTree>
            </div>
          </div>
          <div v-if="item.type == 'dictData'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <DictData :record="item" :models="dataForm"></DictData>
            </div>
          </div>
          <div v-if="item.type == 'dictDataMutiple'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <DictDataMutiple :record="item" :models="dataForm"></DictDataMutiple>
            </div>
          </div>
          <div v-if="item.type == 'selfTimeRange'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <SelfTimeRange :record="item" :models="dataForm"></SelfTimeRange>
            </div>
          </div>
          <div v-if="item.type == 'anyTime'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <AnyTime :record="item" :models="dataForm"></AnyTime>
            </div>
          </div>
          <div v-if="item.type == 'organizeTreeCheckbox'" :key="item.model">
            <label>{{item.label}}</label>
            <div>
              <OrganizeTreeCheckbox :record="item" :models="dataForm"></OrganizeTreeCheckbox>
            </div>
          </div>
        </template>
        <ng-form-item v-else :record="item" :models="dataForm" :key="item.model" />
      </template>
      <el-form-item label="业务状态">
        <a-select placeholder="请选择业务状态" v-model="dataForm.node_status">
          <a-select-option v-for="item in relationBusinessStatus" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
        </a-select>
      </el-form-item>
      <el-form-item class="flex-1 flex justify-content-end" style="flex: auto">
        <a-button type="primary" :loading="loading" @click="selfSearch">查询</a-button>
        <a-button @click="selfReset">重置</a-button>
      </el-form-item>
    </el-form>
  </SearchTerm>
</template>

<script>
import Uploadimg from "@/pages/ngform/components/uploadImg/uploadImg.vue";
import ImportFile from "@/pages/ngform/components/importFile/importFile.vue";
import FixedValue from "@/pages/ngform/components/fixedValue/fixedValue.vue";
import OrganizeTree from "@/pages/ngform/components/organizeTree/organizeTree.vue";
import StaffTree from "@/pages/ngform/components/staffTree/staffTree.vue";
import DictData from "@/pages/ngform/components/dictData/dictData.vue";
import SelfTimeRange from "@/pages/ngform/components/selfTimeRange/selfTimeRange.vue";
import AnyTime from "@/pages/ngform/components/anyTime/anyTime.vue";
import OrganizeTreeCheckbox from "@/pages/ngform/components/organizeTreeCheckbox/organizeTreeCheckbox.vue";
import RelationForm from "@/pages/ngform/components/relationForm/relationForm.vue";
import RadioList from "@/pages/ngform/components/radioList/radioList.vue";


import cancelLoading from '@/mixin/cancelLoading';
import { mapMutations } from 'vuex';

export default {
  props: ["queryList", "search", "reset", "relationBusinessStatus"],
  data() {
    return {
      dataForm: {},
      customComponents: [
        {
          type: 'uploadimg',
          component: Uploadimg,
        },
        {
          type: 'importFile',
          component: ImportFile,
        },
        {
          type: 'fixedValue',
          component: FixedValue,
        },
        {
          type: 'organizeTree',
          component: OrganizeTree,
        },
        {
          type: 'staffTree',
          component: StaffTree,
        },
        {
          type: 'dictData',
          component: DictData,
        },
        {
          type: 'selfTimeRange',
          component: SelfTimeRange,
        },
        {
          type: 'anyTime',
          component: AnyTime,
        },
        {
          type: 'organizeTreeCheckbox',
          component: OrganizeTreeCheckbox,
        },
        {
          type: 'relationForm',
          component: RelationForm,
        },
        {
          type: 'radioList',
          component: RadioList,
        },
      ],
    }
  },
  mixins: [cancelLoading],
  components: {
    OrganizeTree,
    StaffTree,
    DictData,
    SelfTimeRange,
    AnyTime,
    OrganizeTreeCheckbox,
    RadioList
  },
  created() {
    this.saveCustomComponents(this.customComponents);
  },
  watch: {
    relationBusinessStatus(a, b) {
    }
  },
  computed: {
    copyQueryList() {
      for (let i = 0; i < this.queryList.length; i++) {
        this.queryList[i].options.disabled = false;
        this.queryList[i].options.hidden = false;
        if (this.queryList[i].type == "date") {
          this.queryList[i].options.range = true;
        }
      }
      return this.queryList;
    }
  },
  methods: {
    ...mapMutations("setting", ["saveCustomComponents"]),
    isCustom(key) {
      let num = 0;
      for (let i = 0; i < this.customComponents.length; i++) {
        if (this.customComponents[i].type == key) {
          num += 1;
        }
      }
      if (num > 0) {
        return true;
      } else {
        return false;
      }
    },
    selfSearch() {
      this.search(this.dataForm);
    },
    selfReset() {
      this.dataForm = {};
      this.reset();
    },
  }
}
</script>
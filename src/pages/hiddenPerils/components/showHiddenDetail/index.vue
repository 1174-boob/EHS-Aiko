<template>
  <a-spin :spinning="false" wrapperClassName="a-spin">
    <a-form-model ref="addForm" :model="hideDangerForm" :label-col="labelCol" :wrapper-col="wrapperCol">
      <template title="基本信息">
        <div class="m-t-20"></div>
        <a-row>
          <a-col :span="12">
            <div class="scal_tDiv">
              <CommonSearchItem
                ref="commonSearchItem"
                :CommonFormInline="hideDangerForm"
                :hasDepartment="false"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :notTablePage="true"
                :disabled="true"
                :isColon="true"
              ></CommonSearchItem>
            </div>
          </a-col>
          
          <a-col :span="12">
            <a-form-model-item label="起草人">
              <div>
                {{
                `${hideDangerForm.draftPersonName}${
                hideDangerForm.draftPersonJobNumber
                ? "/" + hideDangerForm.draftPersonJobNumber
                : ""
                }`
                }}
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="起草人部门">
                <div>{{ deptCache[hideDangerForm.draftDeptId] || "--" }}</div>
              </a-form-model-item>
            </a-col>
          <a-col :span="12">
            
          <a-form-model-item label="发现时间" prop="findTime">
            <div>{{ hideDangerForm.findTime || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="隐患区域所在建筑">
              <div>{{ hideDangerForm.constructionOfHiddenDangersTypeName || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="隐患位置">
              <div>{{ hideDangerForm.dangerLocation || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="检查类型">
              <div>
                {{
                hideDangerForm.checkType
                ? getChemicalDictText('checkType',hideDangerForm.checkType)
                : "--"
                }}
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="隐患简述" :label-col="labelColO" :wrapper-col="wrapperColO">
              <div>{{ hideDangerForm.dangerSketch || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="隐患详述" :label-col="labelColO" :wrapper-col="wrapperColO">
              <div>{{ hideDangerForm.dangerDetail || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="隐患照片" prop="photo" :label-col="labelColO" :wrapper-col="wrapperColO">
              <div v-if="
                  hideDangerForm.dangerPhotoList &&
                  hideDangerForm.dangerPhotoList.length
                ">
                <img :src="item.filePath" alt v-for="item in hideDangerForm.dangerPhotoList" :key="item.id" @click="previewImg(item.filePath)" class="hide_img" />
              </div>
              <div v-else>--</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="隐患类别" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div>
                {{
                hideDangerForm.dangerCategory
                ? getChemicalDictText('httype',hideDangerForm.dangerCategory)
                : "--"
                }}
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="隐患级别" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div>
                {{
                hideDangerForm.dangerLevel
                ? getChemicalDictText("htlevel", hideDangerForm.dangerLevel)
                : "--"
                }}
              </div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="责任部门">
              <div>{{ hideDangerForm.responsibilityDeptName || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="责任人">
              <div>{{ hideDangerForm.responsibilityPersonName || "--" }}</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="隐患责任整改人">
              <div>
                {{
                hideDangerForm.rectificationResponsibilityPersonName || "--"
                }}
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="隐患整改期限" prop="rectifyDate">
              <div>{{ hideDangerForm.rectificationTime || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="整改建议" :label-col="labelColO" :wrapper-col="wrapperColO">
              <div>{{ hideDangerForm.rectificationSuggestions || "--" }}</div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-show="hideDangerForm.delayStatus">
          <a-col :span="12">
            <a-form-model-item label="延期时间">
              <div>{{ hideDangerForm.delayTime || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="延期原因">
              <div>{{ hideDangerForm.delayReason || "--" }}</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="临时措施">
              <div>{{ hideDangerForm.provisionalMeasures || "--" }}</div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </template>
    </a-form-model>
  </a-spin>
</template>

<script>
import dictionary from "@/utils/dictionary";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  mixins: [chemicalDict],
  props: {
    hideDangerForm: {
      type: Object,
      default: () => {
        return {
          checkType: undefined,
        };
      },
    },
  },
  data() {
    return {
      dictionary,
      labelCol: { span: 8 },
      labelColO: { span: 4 },
      wrapperCol: { span: 16 },
      wrapperColO: { span: 20 },
    };
  },
  methods: {
    //查看图片
    previewImg(imgUrl) {
      this.$hevueImgPreview(imgUrl);
    },
  },
  watch: {
    hideDangerForm(newV, oldV) {
      newV.deptId = newV.draftDeptId;
      console.log(newV, newV.corporationId, newV.draftDeptId)
      this.$refs.commonSearchItem.corporationChange(
        newV.corporationId,
        newV.draftDeptId
      );
    },
  },
};
</script>

<style lang='less' scoped>
.scal_tDiv {
  ::v-deep.ant-select-selection {
    background: none !important;
    color: #595959 !important;
    border: #fff 1px solid !important;
    .ant-select-arrow {
      display: none !important;
    }
  }
}
.hide_img {
  width: 150px;
  padding-right: 15px;
  &:hover {
    cursor: pointer;
  }
}

.changeCommon {
  height: 20px !important; 
}
</style>
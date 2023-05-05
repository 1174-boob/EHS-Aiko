<template>
  <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="conclusionFormRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="form" :colon="false">
          <CommonSearchItem :disabled="disabled" :CommonFormInline="form" :rules="rules" :notTablePage="true"></CommonSearchItem>
          <a-form-model-item class="flex" label="建筑、楼层" prop="buildingAndFloor">
            <a-cascader :disabled="disabled" v-model="form.buildingAndFloor" :options="options" placeholder="请选择建筑、楼层" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="标题" prop="title">
            <a-input v-model="form.title" placeholder="请输入标题" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" ref="pictureList" label="选择图片" prop="fileIdList">
            <UploadCanRemove ref="pictureListUploadCanRemove" :maxSize="5" :limit="1" :headImgs="form.fileIdList" @handleSuccess="handleSuccess"></UploadCanRemove>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelFn">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="confirm">确定</a-button>
      </template>
    </CommonModal>
</template>

<script>
import { fourColorAdd, fourColorUpdate } from "@/services/dangerSource/fourColor"
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue'
import { getRiskBuildingTreeData } from "@/services/dangerSource/fourColor"
export default {
  components: {
    UploadCanRemove
  },
  props: {
    curRow: {
      type: Object,
      default: () => null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        fileIdList: [],
        buildingAndFloor: []
      },
      options:  [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        fileIdList: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.curRow ? '更换平面图' : '新增平面图'
    },
    disabled() {
      return this.curRow ? true : false
    }
  },
  watch: {
    'form.corporationId': function(newVal){
      if (newVal) {
        this.onCorporationIdChange(newVal)
      }
    }
  },
  methods: {
    cancelFn: function() {
      this.$refs.conclusionFormRef.resetFields()
      this.$emit('update:visible', false)
    },
    handleSuccess(file) {
      this.form.fileIdList = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
    },
    loadData(data) {
      console.log(data, 'data')
      this.form = {
        fileIdList: data.fileIdList,
        buildingAndFloor: [data.buildingId, data.floorId],
        title: data.title,
        riskFourColorPictureId: data.riskFourColorPictureId,
        centerId: data.centerId,
        corporationId: data.corporationId
      }
    },
    async onCorporationIdChange(val) {
      let para = {
        corporationId: val
      }
      const { data } = await getRiskBuildingTreeData(para)
      if (data) {
        this.options = data || []
      }
    },
    handleChange(val) {
    },
    confirm() {
      this.$refs.conclusionFormRef.validate(async valid => {
        if (valid) {
          if (this.form.buildingAndFloor && this.form.buildingAndFloor.length > 0) {
            this.form.buildingId = this.form.buildingAndFloor[0]
            this.form.floorId = this.form.buildingAndFloor[1]
          }
          let para = {
            ...this.form
          }
          let api = this.curRow ? fourColorUpdate : fourColorAdd
          await api(para)
          let msg = this.curRow ? '更换成功' : '新增成功'
          this.$antMessage.success(msg)
          this.cancelFn()
          this.$emit('successCallback')
        }
      })
    }
  }
}
</script>

<style>

</style>
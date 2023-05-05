<template>
  <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="conclusionFormRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="form" :colon="false">
          <CommonSearchItem :disabled="disabled" :CommonFormInline="form" :rules="rules" :notTablePage="true"></CommonSearchItem>
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
import { markPointAdd, markPointEdit } from "@/services/envWatch/markManage"
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
      },
      options:  [],
      rules: {
        fileIdList: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.curRow ? '编辑' : '新增'
    },
    disabled() {
      return this.curRow ? true : false
    }
  },
  // watch: {
  //   'form.corporationId': function(newVal){
  //     if (newVal) {
  //       this.onCorporationIdChange(newVal)
  //     }
  //   }
  // },
  methods: {
    cancelFn: function() {
      this.$refs.conclusionFormRef.resetFields()
      this.$emit('update:visible', false)
    },
    handleSuccess(file) {
      this.form.fileIdList = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.id,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
    },
    loadData(data) {
      this.form = {
        fileIdList: [{
          uid: data.pictureId,
          url: data.picturePath,
          name: data.pointNum
        }],
        // buildingAndFloor: [data.buildingId, data.floorId],
        pointId: data.pointId,
        centerId: data.centerId,
        corporationId: data.corporationId
      }
      console.log(this.form, 'this.form')
    },
    // async onCorporationIdChange(val) {
    //   let para = {
    //     corporationId: val
    //   }
    //   const { data } = await getRiskBuildingTreeData(para)
    //   if (data) {
    //     this.options = data || []
    //   }
    // },
    handleChange(val) {
    },
    confirm() {
      this.$refs.conclusionFormRef.validate(async valid => {
        if (valid) {
          let para = {
            ...this.form
          }
          para.pictureId = this.form.fileIdList[0].uid
          para.picturePath = this.form.fileIdList[0].url
          para.pointNum = this.form.fileIdList[0].name
          let api = this.curRow ? markPointEdit : markPointAdd
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
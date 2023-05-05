<!-- -->
<template>
  <CommonModal title="选择特种设备类型" :visible="visible" :cancelFn="cancelFn">
    <template slot="form">
      <a-form-model ref="formRef" :rules="rules" :label-col="{ style: { width: '158px' } }" :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="form" :colon="false">
        <a-form-model-item class="flex" label="特种设备类型" prop="specialDeviceType">
          <a-select allowClear show-search v-model="form.specialDeviceType" placeholder="请选择特种设备类型" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in equipmentTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="cancelFn">取消</a-button>
      <a-button v-if="!disabled" type="primary" class="m-l-15" @click="confirm">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import oldDictionary from '@/utils/dictionary'
export default {
  name: 'ChooseSpecialTypeModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    //设备类型
    equipmentTypeOptions() {
      return oldDictionary('equipmentType')
    },
  },
  data() {
    return {
      form: {
      },
      specialDeviceTypeOptions: [
        { dictValue: '1', dictLabel: '叉车' },
        { dictValue: '2', dictLabel: '天车' },
        { dictValue: '3', dictLabel: '电梯' },
        { dictValue: '4', dictLabel: '压力管道' },
        { dictValue: '5', dictLabel: '压力容器' },
      ],
      rules: {
        specialDeviceType: [
          { required: true, message: '请选择特种设备类型', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    cancelFn: function () {
      this.$refs.formRef.resetFields()
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$emit('confirmCallback', this.form.specialDeviceType)
        }
      })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.form = {}
        }, 200);
      }
    }
  }
}
</script>

<style>
</style>
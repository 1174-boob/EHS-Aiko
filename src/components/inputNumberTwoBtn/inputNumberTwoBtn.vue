<template>
  <!-- 数字加减框 -->
  <div class="input-number-two-btn">
    <div class="btn" :class="(attrNum<=min || disabled)?'disBtn':''" @click="reduceNum">
      <a-icon type="minus" />
    </div>
    <div>
      <a-input class="attr-num attr-input" v-model="attrNum" :read-only="true" v-if="disabled" />
      <a-input-number class="attr-num" v-model="attrNum" :min="min" :max="max" v-else @blur="attrNumBlur" />
    </div>
    <div class="btn" :class="(attrNum>=max || disabled)?'disBtn':''" @click="addNum">
      <a-icon type="plus" />
    </div>
    <span class="attr-num-unit" v-if="unit">{{unit}}</span>
  </div>
</template>

<script>
import { debounce } from 'lodash'
export default {
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 99999999,
    },
    defaultValue: {
      type: Number | Boolean,
      default: false,
    },
    unit: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      attrNum: 1,
      attrNumOld: undefined,
    }
  },
  mounted() {
    if (this.defaultValue || this.defaultValue === 0) {
      this.attrNum = this.defaultValue
      this.attrNumOld = this.attrNum
    } else {
      this.attrNum = this.min
      this.attrNumOld = this.attrNum
    }
  },
  methods: {
    reduceNum() {
      if (this.disabled) return
      if (this.attrNum <= this.min) return
      this.attrNum--
      this.attrNumOld = this.attrNum
      this.getApi()
    },
    addNum() {
      if (this.disabled) return
      if (this.attrNum >= this.max) return
      this.attrNum++
      this.attrNumOld = this.attrNum
      this.getApi()
    },
    attrNumBlur() {
      if (this.disabled) return
      if (this.attrNum === this.attrNumOld) return
      if (this.attrNum === null) {
        this.attrNum = this.min
        return
      }
      this.attrNumOld = this.attrNum
      this.getApi()
    },
    getApi: debounce(function () {
      console.log('调用接口');
    }, 250),
  },
  watch: {
    defaultValue(newVal) {
      if (newVal || newVal === 0) {
        this.attrNum = newVal
        this.attrNumOld = newVal
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input-number-two-btn {
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .btn {
    width: 38px;
    height: 38px;
    border: 1px solid #dcdcdc;
    border-radius: 3px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #333;
    cursor: pointer;
  }
  .disBtn {
    border: 1px solid #dcdcdc !important;
    color: #999 !important;
    background-color: #f4f4f4 !important;
    cursor: not-allowed;
  }
  .attr-num {
    margin-right: 10px;
    height: 38px;
    border-radius: 3px;
    border-color: #d9d9d9 !important;
    box-shadow: 0 0 0 2px rgba(0, 103, 204, 0) !important;
    ::v-deep .ant-input-number-handler-wrap {
      display: none !important;
    }
    ::v-deep .ant-input-number-input-wrap {
      height: 100% !important;
    }
    ::v-deep .ant-input-number-input {
      height: 100% !important;
    }
    &:hover {
      border: 1px solid #d9d9d9 !important;
      border-right-width: 1px !important;
    }
    &:focus {
      border-color: #d9d9d9 !important;
      box-shadow: 0 0 0 2px rgba(0, 103, 204, 0) !important;
    }
  }
  .attr-input {
    width: 90px;
  }
  .attr-num-unit {
    font-size: 14px;
    line-height: 38px;
    color: #333333;
  }
}
</style>

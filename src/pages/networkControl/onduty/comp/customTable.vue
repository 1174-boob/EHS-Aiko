<template>
  <a-row class="row-box" v-if="colList.length">
    <a-col class="col-box" :xl="{span:6}" :xxl="{span:4}" v-for="(item,index) in colList" :key="index">
      <div class="col-box-top">{{item.dictValue}}</div>
      <div class="col-box-bottom" :class="readOnly? 'read-only-content-box':'' ">
        <a-textarea v-if="!disabled" v-model.trim="item.value" autoSize class="rm-border" :maxLength="maxLength" @blur="blur" />
        <div v-if="readOnly" class="read-only-content">{{item.value}}</div>
      </div>
    </a-col>
  </a-row>
  <div style="padding:16px 0;" v-else>
    <a-empty />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  props: {
    colList: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: Number,
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      colListDemo: [
        {
          dictValue: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          value: undefined,
        },
      ]
    };
  },
  methods: {
    blur() {
      this.$emit('valueChange')
    }
  },
};
</script>

<style lang='less' scoped>
@borderColor: #eaecee;
.row-box {
  border-left: 1px solid @borderColor;
  display: flex;
  flex-wrap: wrap;
}
.col-box {
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
  flex: none;
  display: grid;
  grid-template-rows: auto 1fr;
  &:nth-of-type(1),
  &:nth-of-type(2),
  &:nth-of-type(3),
  &:nth-of-type(4) {
    .col-box-top {
      border-top: 1px solid @borderColor !important;
    }
  }
  .col-box-top {
    height: 48px;
    color: #606266;
    background: #f8f8f9;
    border: 1px solid @borderColor;
    border-left: 0px;
    border-top: 0px;
    padding: 8px 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .col-box-bottom {
    min-height: 48px;
    padding: 8px 10px;
    border: 1px solid @borderColor;
    border-left: 0px;
    border-top: 0px;
  }
  .read-only-content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .read-only-content {
      text-align: center;
      line-height: 1.3;
    }
  }
}
@media screen and (min-width: 1600px) {
  .col-box {
    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3),
    &:nth-of-type(4),
    &:nth-of-type(5),
    &:nth-of-type(6) {
      .col-box-top {
        border-top: 1px solid @borderColor !important;
      }
    }
  }
}

.has-error .ant-input,
.has-error .ant-input:hover {
  background-color: #fff;
  border-color: #b0b0b0;
}
.has-error .ant-input:focus {
  border-color: #b0b0b0;
  border-right-width: 1px !important;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(0, 103, 204, 0.2);
  box-shadow: 0 0 0 2px rgba(0, 103, 204, 0.2);
}
.rm-border {
  // border: 0px solid #b0b0b0 !important;
  resize: none;
  &:focus {
    // border-right-width: 0px !important;
    box-shadow: none !important;
  }
}
</style>

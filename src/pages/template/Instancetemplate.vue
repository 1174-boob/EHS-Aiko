<template>
  <div class="data">
    <h1>实例模板</h1>
    <div class="top-one">
      <div class="left">
        <div class="l">
          <span class="span">产品编码</span>
          <a-input-search
            :loading="logging"
            placeholder="请输入（模糊查询）"
            style="
              border-radius: 0.04rem;
              padding: 0;
              padding-left: 0.1rem;
              width: 3rem;
            "
            @search="onSearch"
          />
        </div>
      </div>
      <div class="right">
        <a-button @click="showModal('add')" type="primary">新增</a-button>

        <a-upload style name='multipartFile' :disabled="loading" :headers="headers" :action="action" :before-upload="beforeUpload" :multiple="false" :showUploadList="false">
          <a-button type="primary">导入</a-button>
        </a-upload>
        <Downs :templateId="dataobj.templateId" type="dashed" :texts="labels" text="模版下载" url="http://dev.boeplat.com.cn/boeplat-ziid/api/annex/download/example" />
        <Downs :templateId="dataobj.templateId" type="dashed" :texts="labels" text="数据下载" url="http://dev.boeplat.com.cn/boeplat-ziid/api/annex/download/attribute/data" />
      </div>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="false" style="margin-top: 0.3rem" rowKey="_example_id_">
      <a slot="operation" slot-scope="text, record" class="as">
        <span @click.stop="showModal('change', record)">编辑</span>
        <span @click.stop="confirm(record)" :loading="logging">删除</span>
      </a>
    </a-table>
    <div class="paginations">
      <span class="total-span">共有{{ total }}条</span>
      <a-pagination
        style="margin-right: 0.1rem; display: inline-block"
        show-quick-jumper
        :current="pageNo"
        :pageSize="pageSize"
        :total="total"
        :hideOnSinglePage="total == 0 ? true : false"
        @change="onChangeTab"
      />
    </div>
    <a-modal title="新增" :visible="visible" :footer="null" @cancel="handleCancel" :maskClosable="false">
      <a-form :form="form" style="width: 3.8rem; margin: 0 auto" class="form-ts">
        <a-form-item label="实例编码">
          <a-input
            :disabled="flag"
            placeholder="请输入"
            style="color: black"
            v-decorator="[
              'exampleCode',
              {
                rules: [{ required: true, message: '请输入实例编码' }],
              },
            ]"
          />
        </a-form-item>

        <a-form-item v-for="item in formdatas" :label="item.nameCn" :key="item.propertyId">
          <a-input
            placeholder="请输入"
            v-decorator="[
              item.nameEn,
              {
                rules: [
                  {
                    required: item.required !== 0,
                    message: `请输入${item.nameCn}`,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label>
          <a-button @click="handleCancel" style="margin-left: 1rem">取消</a-button>
          <a-button type="primary" style="margin-left: 0.1rem" @click="okbtns" :loading="loadings">确定</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {
  GetInstanceList,
  GetTabHead,
  GetTabBody,
  AddInstanceList,
  DelCoedList,
  UploadCoedList,
  InterfaceUpload,
} from "../../services/datatemplate";
import Downs from "@/components/download/download.vue";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;
let token = sessionStorage.getItem("access_token");
export default {
  data() {
    return {
      fileSize: 1024000,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {},
      file: {},
      fileList: [],
      // 接口获取的sts对象
      stsObj: {},
      imageUrl: "",
      fileTypeArr: [
        // "image/jpeg",
        // "image/png",
        // "text/plain",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      data: [],
      dataobj: {},
      columns: [],
      labels: "",
      visible: false,
      formdatas: [],
      pageNo: 1,
      pageSize: 10,
      logging: false,
      total: 0,
      step: 1,
      flag: false,
      exampleobj: {},
      loading: false,
      loadings: false,
      form: this.$form.createForm(this, { name: "coordinated" }),
      file: {},
      errTypeMsg: "请上传正确格式的文件",
      maxSize: 2,
    };
  },
  components: { Downs },
  mounted() {
    this.getdataObj();
    this.getTablist();
    this.getInstanceList();
    this.tokens();
  },
  methods: {
    tokens() {
      this.headers = { Authorization: `bearer ${token}` };
    },
    // 上传之前
    beforeUpload(file) {
      if (this.fileTypeAndSizeTest(file)) {
        // 存储文件列表和当前文件对象
        const formData = new FormData();
        formData.append("file", file);
        formData.append("templateId", this.dataobj.templateId);
        InterfaceUpload(formData)
          .then((res) => {
            if (res.code == "20000") {
              this.$antMessage.success("导入成功");
              this.getTablist();
            } else {
              this.$antMessage.info(res.message);
            }
          })
          .catch((err) => { });
      } else {
        return false;
      }
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isJpgOrPng = this.fileTypeArr.includes(file.type);
      if (!isJpgOrPng) this.$antMessage.error(this.errTypeMsg);
      // 检测文件大小
      const isLt2M = file.size - this.fileSize * this.maxSize < 0;
      if (!isLt2M) this.$antMessage.error(`文件大小不能超过${this.maxSize}M`);
      return isJpgOrPng && isLt2M;
    },

    async getInstanceList() {
      //实例模板获取新增里面的表单值
      let result = await GetInstanceList({
        templateId: this.dataobj.templateId,
      });
      if (result.code == "20000") {
        this.formdatas = result.data;
      }
    },
    async getTablist(exampleCode) {
      let result = await GetTabHead({
        templateId: this.dataobj.templateId,
      });
      let results = await GetTabBody({
        templateId: this.dataobj.templateId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        exampleCode: exampleCode === undefined ? "" : exampleCode,
      });
      if (result.code == "20000" && result.data) {
        //表头
        let newList = result.data.map((item) => {
          return {
            ...item,
            key: item.dataIndex,
            ellipsis: true,
            align: "center",
          };
        });
        newList.push({
          title: "操作",
          dataIndex: "set",
          key: "set",
          width: 120,
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "operation" },
        });
        this.columns = newList;
      }
      if (results.code == "20000" && results.data && result.data) {
        //表身
        this.data = results.data.list;
        this.total = results.data.total;
      }
      if (
        //判断loading是否停止转动
        exampleCode === undefined ||
        results.code !== 20000 ||
        result.code !== 20000
      ) {
      } else {
        this.logging = false;
      }
    },
    getdataObj() {
      let obj = this.$route.query;
      this.dataobj = obj;
      this.labels = obj.templateName;
    },
    confirm(record) {
      this.$antConfirm({
        title: "删除",
        content: "是否删除此条数据？",
        okText: "确认",
        cancelText: "取消",
        maskClosable: false,
        onOk: async () => {
          let result = await DelCoedList({ _example_id_: record._example_id_ });
          if (result.code == "20000") {
            this.pageNo = 1;
            this.pageSize = 10;
            let results = await GetTabBody({
              templateId: this.dataobj.templateId,
              pageNo: "1",
              pageSize: "10",
              exampleCode: "",
            });
            if (results.code == "20000" && results.data) {
              //表身
              this.data = results.data.list;
              this.total = results.data.total;
              this.$antMessage.success("删除成功");
            }
          }
        },
      });
    },
    async showModal(type, val) {
      if (type == "add") {
        this.step = "1";
        this.flag = false;
      } else if (type == "change") {
        this.step = "2";
        this.exampleobj = val;
        this.flag = true;
        let obj = val;
        this.$nextTick(() => {
          this.form.setFieldsValue({ exampleCode: val._example_code_ });
        });
        this.formdatas.map((item) => {
          for (let i in obj) {
            if (item.nameEn == i) {
              this.$nextTick(() => {
                this.form.setFieldsValue({ [i]: obj[i] });
              });
            }
          }
        });
      }
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    okbtns() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loadings = true;
          if (this.step == "1") {
            //添加

            let obj = this.form.getFieldsValue();
            let arr = [];
            this.formdatas.map((item) => {
              for (let i in obj) {
                if (item.nameEn == i) {
                  arr.push({
                    propertyValue: obj[i],
                    propertyId: item.propertyId,
                    nameCn: item.nameCn,
                  });
                }
              }
            });
            let objNew = {
              properties: arr,
              companyId: companyId,
              exampleCode: obj.exampleCode,
              templateId: this.dataobj.templateId,
            };
            let result = await AddInstanceList(objNew);
            if (result.code == "20000") {
              this.getTablist();
              this.$antMessage.success("添加成功");
              this.loadings = false;
              this.visible = false;
            } else {
              //this.$antMessage.info(result.message) llll;
              this.visible = false;
              this.loadings = false;
            }
          } else if (this.step == "2") {
            //修改

            let obj = this.form.getFieldsValue();
            let arr = [];
            this.formdatas.map((item) => {
              for (let i in obj) {
                if (item.nameEn == i) {
                  arr.push({
                    propertyValue: obj[i],
                    propertyId: item.propertyId,
                    nameCn: item.nameCn,
                  });
                }
              }
            });
            let objNew = {
              exampleId: this.exampleobj._example_id_,
              properties: arr,
              companyId: companyId,
              exampleCode: obj.exampleCode,
              templateId: this.dataobj.templateId,
            };
            let result = await UploadCoedList(objNew);
            if (result.code == "20000") {
              this.getTablist();
              this.$antMessage.success("修改成功");
              this.loadings = false;
              this.visible = false;
            } else {
              //this.$antMessage.info(result.message) llll;
              this.visible = false;
              this.loadings = false;
            }
          }
        }
      });
    },
    back() {
      this.$router.push("baseRegistery");
    },
    look() {
      this.$router.push("basicdetail");
    },
    onChangeTab(pageNumber, pageSize) {
      this.pageSize = pageSize;
      this.pageNo = pageNumber;
      this.getTablist();
    },
    addNew() {
      console.log("我是查询");
    },
    onSearch(value) {
      this.logging = true;
      this.pageNo = 1;
      this.pageSize = 10;
      this.getTablist(value);
    },
  },
};
</script>

<style lang='less' scoped>
.data {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0;
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 0rem 0 0.2rem 0;

    // border-bottom: 2px solid #f5f5f5;
  }
  .top-one {
    width: 100%;
    margin: 0 auto;
    height: 0.98rem;
    background: rgba(250, 250, 250, 0.5);
    border: 1px solid #f4f4f4;
    border-radius: 0.02rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0.24rem;

    .left {
      display: flex;
      .ant-input-search {
        display: flex !important;
      }
      .l {
        display: flex;
        align-items: center;
        margin-right: 0.3rem;
        .timeinput {
          width: 2.35rem;
          height: 0.38rem;

          & :first-child {
            height: 100% !important;
            border-radius: 0.04rem !important;
          }
        }
        .span {
          font-size: 0.14rem;
          font-family: FZanTingHeiS-R-GB;
          font-weight: 400;
          margin-right: 0.1rem;
          // width: 1rem;
          color: #999999;
        }
        .input {
          width: 2.4rem;
          height: 0.38rem;
          background: #ffffff;
          border-radius: 0.04rem;
        }
      }
    }
    .right {
      display: flex;
      button {
        margin-left: 0.1rem;
        width: 0.9rem;
        height: 0.4rem;
      }
    }
  }
  .as {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.forms-i {
  // width: 100%;
  // margin: 0 auto;
}
.form-ts {
  .ant-form-item {
    display: flex !important;
    align-items: center;
    // justify-content: center;
    margin-left: 0 !important;
  }
  ::v-deep .ant-form-item-label {
    width: 1rem;
    font-size: 0.12rem;
    label {
      font-size: 0.12rem;
    }
  }
}
</style>
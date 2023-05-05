<template>
  <div class="box-t">
    <h1>注册</h1>
    <a-form class="forms" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item label="前缀">
        <a-input style="border: none; background: none; color: black" :disabled="true" v-decorator="['attributionPrefix']" />
      </a-form-item>
      <a-form-item label="标识">
        <a-input placeholder="请输入（自定义）" :disabled="inpflag" style="color: black" v-decorator="[
            'handle',
            { rules: [{ required: true, message: '请输入标识' }] },
          ]" />
      </a-form-item>
      <a-form-item label="数据模版">
        <a-select
          v-decorator="[
            'gender',
            {
              rules: [{ required: true, message: '请选择数据模板' }],
            },
          ]"
          placeholder="下拉选择"
          @change="handleSelectChange"
        >
          <a-select-option v-for="item in dataArr" :key="item.templateId" :value="item.templateId">{{ item.templateName }}</a-select-option>
        </a-select>
      </a-form-item>
      <div v-if="flag">
        <a-form-item label="实例模版">
          <a-select @change="handleSelectChanges" v-decorator="['instance']" placeholder="请选择">
            <a-select-option v-for="item in instanceArr" :key="item.exampleId" :value="item.exampleId">{{ item.exampleCode }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-for="item in formdatas" :label="item.nameCn" :key="item.propertyId">
          <a-input
            placeholder="请输入"
            style="color: black"
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
      </div>

      <a-form-item class="btns">
        <a-button @click="back" style="margin-right: 0.1rem; margin-left: 1rem">取消</a-button>
        <a-button type="primary" html-type="submit" style="margin: 0">确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {
  GetDataTemplateList,
  GetDataTemplate,
  GetInstanceTemplate,
  GetInstanceTemplateFormSet,
  AddBasicDetailList,
  ChangeBasicDetailList,
  DetailBasicList,
} from "@/services/basic";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;
let EnterprisePrefix = sessionStorage.getItem("EnterprisePrefix");

export default {
  data() {
    return {
      formLayout: "horizontal",
      step: "", //1添加2修改
      flag: false,
      inpflag: false,
      form: this.$form.createForm(this, { name: "coordinated" }),
      formdatas: [],
      dataArr: [],
      instanceArr: [],
      detailobj: {},
      templateIds: "",
    };
  },
  created() {
    this.form.resetFields();
  },
  mounted() {
    this.getdataTemplate();

    this.getDetailObj();
  },
  methods: {
    async getdataTemplate() {
      //获取数据模板列表下拉框
      let result = await GetDataTemplateList({
        companyId: companyId,
      });
      if (result.code == "20000") {
        this.dataArr = result.data;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ attributionPrefix: EnterprisePrefix });
      });
    },
    getDetailObj() {
      let obj = this.$route.query;
      this.detailobj = obj;
      this.form.setFieldsValue({ attributionPrefix: "88.155.101" }); //设置前缀
      if (obj.type == "change") {
        //修改
        this.inpflag = true;
        this.step = "2";
        this.getBasicDetailList();
      } else if (obj.type == "add") {
        //添加
        this.step = "1";
        this.inpflag = false;
      }
    },
    back() {
      this.$router.go(-1); //返回上一层
      this.form.resetFields();
    },
    async getBasicDetailList() {
      //实例模板获取新增里面的表单值
      this.flag = true;
      let result = await DetailBasicList({
        handleId: this.detailobj.handleId,
      });

      if (result.code == "20000") {
        //设置回显
        this.handleSelectChange(result.data.templateId);
        let targ = {};
        let arr = result.data.properties.map((item) => {
          return `{"${item.nameEn}":"${item.propertyValue}"}`;
        });
        arr.forEach((element) => {
          let arrT = JSON.parse(element);
          targ = Object.assign(targ, arrT);
        });
        this.$nextTick(() => {
          this.form.setFieldsValue({
            handle: result.data.handle,
            gender: result.data.templateId,
          });
          setTimeout(() => {
            this.form.setFieldsValue(targ); //回显
          }, 1000);
        });
        this.formdatas = result.data.properties;
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
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
                  });
                }
              }
            });
            let objT = {
              templateId: this.templateIds,
              companyId: companyId,
              handle: values.handle,
              attributionPrefix: values.attributionPrefix,
              properties: arr,
            };

            let result = await AddBasicDetailList(objT);
            if (result.code == "20000") {
              this.$antMessage.success("添加成功");
              this.$router.push("/overview/preview");
              // this.logging = false;
            }
          } else if (this.step == "2") {
            let obj = this.form.getFieldsValue();
            let arr = [];
            this.formdatas.map((item) => {
              for (let i in obj) {
                if (item.nameEn == i) {
                  arr.push({
                    propertyValue: obj[i],
                    propertyId: item.propertyId,
                  });
                }
              }
            });
            let objT = {
              templateId: this.templateIds,
              companyId: companyId,
              handle: values.handle,
              attributionPrefix: values.attributionPrefix,
              handleId: this.detailobj.handleId,
              properties: arr,
            };

            let result = await ChangeBasicDetailList(objT);
            if (result.code == "20000") {
              this.$antMessage.success("修改成功");
              this.$router.push("/overview/preview");
              // this.logging = false;
            }
          }
        }
      });
    },
    async handleSelectChanges(value, e) {
      //实例模板
      if (value) {
        let result = await GetInstanceTemplateFormSet({
          exampleId: value,
        });
        if (result.code == "20000") {
          let arr = result.data.properties;
          let targ = {};
          let arrT = arr.map((item) => {
            return `{"${item.nameEn}":"${item.propertyValue}"}`;
          });
          arrT.forEach((element) => {
            let arrT = JSON.parse(element);
            targ = Object.assign(targ, arrT);
          });
          this.$nextTick(() => {
            this.form.setFieldsValue(targ); //回显
          });
        }
      }
    },
    async handleSelectChange(value, e) {
      //数据模板
      this.templateIds = value;

      if (value) {
        let result = await GetDataTemplate({
          templateId: value,
        });
        if (result.code == "20000") {
          let results = await GetInstanceTemplate({
            templateId: value,
          });

          if (results.code == "20000") {
            this.instanceArr = results.data;
            this.formdatas = result.data;
            this.flag = true;
            this.$nextTick(() => {
              this.form.setFieldsValue({ instance: "" });
            });
          }
        }
      } else {
        this.flag = false;
      }
      // this.form.setFieldsValue({
      //   note: `Hi, ${value === "male" ? "man" : "lady"}!`,
      // });
    },
  },
};
</script>

<style lang='less' scoped>
.box-t {
  width: 100%;
  height: 100%;
  input {
    font-size: 0.12rem;
  }
  .forms {
    width: 3.7rem;
    margin: 0 auto;
  }
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    color: #333333;
    padding: 0.2rem 0 0.2rem 0;

    height: auto;
    border-bottom: 0.02rem solid #f5f5f5;
  }
  .ant-select-selection {
    width: 3rem;
  }
  .ant-select {
    width: 3rem;
  }
  .ant-form-item {
    width: 5rem;
  }
  ::v-deep.ant-form-item-label {
    label {
      font-size: 0.12rem !important ;
    }
  }
  .ant-form-item-control-wrapper {
    font-size: 0.12rem;
    div {
      input {
        width: 3rem;
      }
      span {
        div {
          font-size: 0.12rem;
        }
      }
    }
  }
  .btns {
    width: 10rem;
    div {
      width: 100% !important;
    }
  }
}
</style>
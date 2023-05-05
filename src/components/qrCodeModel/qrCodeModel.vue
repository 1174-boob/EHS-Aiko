<template>
  <div>
    <CommonModal :title="'二维码'" :visible="QRcodeModelShow" :cancelFn="closeModel" id="principal-dialog" class="principal-dialog">
      <div class="model-main" >
        <div class="qrcode" ref="imageWrapper">
          <div id="qrcode"></div>
        </div>
      </div>
      <template slot="btn">
        <a-button class="m-l-15" type="primary" :loading="loading" @click="downloadBtn">下载</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas'
export default {
  model: {
    prop: "QRcodeModelShow",
  },
  props: {
    // 弹窗显示隐藏
    QRcodeModelShow: {
      type: Boolean,
      default: false,
    },
    // 二维码数据
    QRCodeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      spinning: false,
      loading: false,
    };
  },
  watch: {
    QRcodeModelShow(newV,oldV) {
      if(newV) {
        this.qrcode();
      }
    }
  },
  created() { },
  methods: {
    qrcode() {
      this.$nextTick(()=>{
        new QRCode('qrcode', {
          width: 200,
          height: 200,
          text: JSON.stringify(this.QRCodeData) // 二维码中的信息
        });
      })
    },
    // 选择字段弹框-确定
    downloadBtn() {
			html2canvas(this.$refs.imageWrapper).then((canvas) => {
				let dataURL = canvas.toDataURL('image/png')
				this.imgUrl = dataURL
				var a = document.createElement('a') // 生成一个a元素
				var event = new MouseEvent('click') // 创建一个单击事件
				a.download = name || 'qrcode' // 设置图片名称
				a.href = dataURL // 将生成的URL设置为a.href属性
				a.dispatchEvent(event) // 触发a的单击事件
			})
    },

    // 下载img
    // downloadImgURL(url, name) {
    //   let image = new Image();
    //   image.setAttribute("crossOrigin", "anonymous");
    //   image.src = url;
    //   image.onload = () => {
    //     let canvas = document.createElement("canvas");
    //     canvas.width = image.width;
    //     canvas.height = image.height;
    //     let ctx = canvas.getContext("2d");
    //     ctx.drawImage(image, 0, 0, image.width, image.height);
    //     canvas.toBlob((blob) => {
    //       let url = URL.createObjectURL(blob);
    //       let a = document.createElement("a");
    //       a.download = name;
    //       a.href = url;
    //       a.click();
    //       a.remove();
    //       // 用完释放URL对象
    //       URL.revokeObjectURL(url);
    //     });
    //   };
    // },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
  },
};
</script>

<style lang='less' scoped>
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}
#principal-dialog {
  ::v-deep .ant-modal {
    width: 600px !important;
    padding-bottom: 0px !important;
  }
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-main {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  .qrcode {
    width: 240px;
    padding: 20px;
    background: #fff;
    #qrcode {
      margin:0 auto;
      width:200px;
      height: 200px;
    }
  }
  
}
@media screen and (max-width: 1367px) {
  .model-main {
    min-height: 320px;
    .model-main-qr-img {
      width: 70%;
    }
  }
}
</style>

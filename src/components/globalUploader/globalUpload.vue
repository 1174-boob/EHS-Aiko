<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="false"
      :fileStatusText="fileStatusText"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @file-removed="onFileRemoved"
      class="uploader-app"
    >
      <uploader-unsupport></uploader-unsupport>

      <uploader-btn id="global-uploader-btn" ref="uploadBtn">选择文件</uploader-btn>

      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
          <div class="file-title">
            <h2>文件列表</h2>
            <div class="operate">
              <a-button @click="fileListShow" type="link" :title="collapse ? '展开':'折叠' ">
                <a-icon type="minus" v-show="!collapse" />
                <a-icon type="fullscreen" v-show="collapse" />
              </a-button>
              <a-button @click="close" type="link" title="关闭">
                <a-icon type="close" />
              </a-button>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length">暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openGlobalUpload', {}) 打开文件选择框，参数为需要传递的额外参数
 *   更新配置：Bus.$emit('updateGlobalUploadOptions', {}) 主动更新options配置项
 *   监听函数：Bus.$on('globalUploadFileAdd', fn); 文件选择后的回调
 *            Bus.$on('globalUploadFileSuccess', fn); 文件上传成功的回调
 *            Bus.$on('globalUploadFileError', fn); 文件上传失败的回调
 *            Bus.$on('globalUploadFileRemove', fn); 文件删除的回调
 */
import Bus from '@/utils/bus.js';
import SparkMD5 from 'spark-md5';
import $ from './js/jquery.min.js'
import { mergeFileApi } from "@/services/api";
import serviceNameList from '@/config/default/service.config.js'
import { cloneDeep } from "lodash";
export default {
  props: {
    //请求地址
    action: {
      type: String,
      default: () => {
        let serviceName = serviceNameList.btpFile || undefined
        return `${process.env.VUE_APP_API_BASE_URL}${serviceName}/api/file/uploader/chunk`
      }
    },
    //请求地址
    headers: {
      type: Object,
      default: () => {
        const token_type = sessionStorage.getItem("token_type") || sessionStorage.getItem("token_type") || undefined
        const token = sessionStorage.getItem("access_token") || sessionStorage.getItem("access_token") || undefined
        return { Authorization: token_type + " " + token }
      }
    },
    // 文件类型
    fileTypeArr: {
      type: Array,
      default: () => [],
    },
    // 类型错误提示文字
    errTypeMsg: {
      type: String,
      default: "上传文件类型错误",
    },
    // 文件大小限制
    maxSize: {
      type: Number,
      default: 0,
    },
    // 分块时按照该值来分
    chunkSize: {
      type: String,
      default: "2048000",
    },
    // 最大自动失败重试上传次数
    maxChunkRetries: {
      type: Number,
      default: 3,
    },
    // 并发上传数
    simultaneousUploads: {
      type: Number,
      default: 3,
    },
    // 使用外部传递的配置项
    useOutOptions: {
      type: Boolean,
      default: false,
    },
    // 外部传递的配置项
    outOptions: {
      type: Object,
      default: () => { }
    },
    // 是否需要解压
    needUnzip: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // 配置项
      options: {
        // url这里替换成完整路径url
        target: '',
        // 分块时按照该值来分
        chunkSize: '2048000',
        // 最大自动失败重试上传次数
        maxChunkRetries: 3,
        // 是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等，默认 true
        testChunks: true,
        // 并发上传数
        simultaneousUploads: 3,
        // 进度回调间隔
        progressCallbacksInterval: 2000,
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: (chunk, message) => {
          let objMessage = JSON.parse(message);
          // 秒传 kipUpload为真，这个文件已经存在
          if (objMessage.data && objMessage.data.skipUpload) {
            return true;
          }
          // 断点续传 uploaded为已经存在的分片
          return ((objMessage.data && objMessage.data.uploaded) || []).indexOf(chunk.offset + 1) >= 0
        },
        // 额外的一些请求头
        headers: {
          Authorization: ''
        },
        // 其他额外的参数
        query: (file, chunk) => {
          return {
            ...file.params,
          }
        },
      },
      // 上传文件状态文字
      fileStatusText: {
        success: '成功',
        error: '失败',
        uploading: '上传中',
        paused: '等待上传中',
        waiting: '等待'
      },
      //选择文件后，展示上传面板
      panelShow: false,
      // 展开、折叠
      collapse: false,
      // 参数
      params: {},
      // 每兆大小
      fileSize: 1048576,
    }
  },
  created() {
    // 处理传递的参数
    this.updateGlobalUploadOptions()
  },
  mounted() {
    // 监听开启上传文件
    Bus.$on('openGlobalUpload', this.openGlobalUpload);
    // 监听更新options配置项
    Bus.$on('updateGlobalUploadOptions', this.updateGlobalUploadOptions);
  },
  computed: {
    //uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  methods: {
    // 手动更新options配置项
    updateGlobalUploadOptions() {
      if (this.useOutOptions) {
        this.options = this.outOptions
      } else {
        this.options.target = this.action
        this.options.headers = this.headers
        this.options.chunkSize = this.chunkSize
        this.options.maxChunkRetries = this.maxChunkRetries
        this.options.simultaneousUploads = this.simultaneousUploads
      }
    },
    // 监听开启上传文件Bus.$on
    openGlobalUpload(query) {
      this.params = query || {};
      if (this.$refs.uploadBtn) {
        $('#global-uploader-btn').click();
      }
    },
    // 选择文件后
    onFileAdded(file) {
      // 检测文件类型和大小
      if (!this.fileTypeAndSizeTest(file)) {
        file.ignored = true
        return false;
      }
      // 展示上传面板
      this.panelShow = true;
      // 计算md5
      this.computeMD5(file);
      // 2022/1/10 将额外的参数赋值到每个文件上，解决了不同文件使用不同params的需求
      file.params = { ...this.params, }
      // 文件选择后的回调
      Bus.$emit('globalUploadFileAdd', file);
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isLegalType = true
      if (this.fileTypeArr.length) {
        // 文件后缀名
        let fileTypeSuffix = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        let newFileTypeArr = cloneDeep(this.fileTypeArr)
        if (newFileTypeArr.includes('.ppt') || newFileTypeArr.includes('ppt')) {
          newFileTypeArr = [...newFileTypeArr, '.ppt', '.pptx']
        }
        isLegalType = newFileTypeArr.includes(fileTypeSuffix) || newFileTypeArr.includes(file.fileType)
        !isLegalType && this.$antMessage.warn(this.errTypeMsg);
      }
      // 检测文件大小
      let isMoreThen = true
      if (this.maxSize > 0) {
        // isMoreThen = file.size < this.fileSize * this.maxSize;
        // 检测文件大小
        let isMoreThen = file.size / 1048576 - this.maxSize < 0.05;
        if (!isMoreThen) {
          this.$antMessage.warn(`文件大小不能超过${this.maxSize}M`);
        }
      }
      return isLegalType && isMoreThen
    },
    // 上传过程中
    onFileProgress(rootFile, file, chunk) {
      // console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 上传成功
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (res.code == 500) {
        // 文件上传失败后的回调
        Bus.$emit('globalUploadFileError', file);
        // 文件状态设为“失败”
        this.statusSet(file.id, 'failed');
      } else {
        // 文件状态设为“合并中”
        this.statusSet(file.id, 'merging');
        // 合并文件接口
        this.mergeFileFn(file)
      }
    },
    // 合并文件接口
    mergeFileFn(file) {
      let apiData = {
        filename: file.name,
        identifier: file.uniqueIdentifier,
        totalSize: file.size,
        type: file.name.slice(file.name.lastIndexOf(".")),
        needUnzip: this.needUnzip ? '1' : '0'
      }
      mergeFileApi(apiData)
        .then(res => {
          let resData = res.data
          // 文件上传、合并成功后的回调
          Bus.$emit('globalUploadFileSuccess', { res: resData, file });
          this.statusRemove(file.id);
        })
        .catch(err => {
          // 文件上传失败后的回调
          Bus.$emit('globalUploadFileError', file);
          // 文件状态设为“失败”
          this.statusSet(file.id, 'failed');
        })
    },
    // 上传失败
    onFileError(rootFile, file, response, chunk) {
      Bus.$emit('globalUploadFileError', { file: file, err: response });
    },
    // 计算md5，实现断点续传及秒传  每次选择文件都会执行一次
    computeMD5(file) {
      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5');
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1000;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      // 暂停
      file.pause();
      loadNext();
      fileReader.onload = (e => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          let md5 = spark.end();
          this.computeMD5Success(md5, file);
          // console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
        }
      });
      fileReader.onerror = function () {
        this.$antMessage.warn(`文件${file.name}读取出错，请检查该文件`);
        file.cancel();
      };
      function loadNext() {
        let start = currentChunk * chunkSize;
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    // md5计算成功
    computeMD5Success(md5, file) {
      // 给file的uniqueIdentifier 属性赋值后，请求中的identifier即是我们计算出来的MD5
      file.uniqueIdentifier = md5;
      // 开始、继续文件上传
      file.resume();
      // 移除md5进度条展示
      this.statusRemove(file.id);
    },
    // 显示和折叠
    fileListShow() {
      let $list = $('#global-uploader .file-list');
      if ($list.is(':visible')) {
        $list.slideUp();
        this.collapse = true;
      } else {
        $list.slideDown();
        this.collapse = false;
      }
    },
    // 关闭上传
    close() {
      this.uploader.cancel();
      this.panelShow = false;
    },
    // 新增的自定义的状态: 'md5校验MD5'、'transcoding合并中'、'failed上传失败'
    statusSet(id, status) {
      let statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }
      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'zIndex': '1',
          'backgroundColor': statusMap[status].bgc
        }).text(statusMap[status].text);
      })
    },
    // 移除自定义状态展示
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove();
      })
    },
    // 删除其中某项
    onFileRemoved(file) {
      Bus.$emit('globalUploadFileRemove', file);
    },
  },
  destroyed() {
    Bus.$off('openGlobalUpload');
  },
}
</script>

<style scoped lang="less">
#global-uploader {
  position: fixed;
  z-index: 20;
  right: 15px;
  bottom: 15px;

  .uploader-app {
    width: 520px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;

      > li {
        background-color: #fff;
      }
    }

    &.collapse {
      .file-title {
        background-color: #e7ecf2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  /deep/.uploader-file-icon {
    &:before {
      content: "" !important;
    }

    &[icon="image"] {
      background: url(./images/image-icon.png);
    }
    &[icon="video"] {
      background: url(./images/video-icon.png);
    }
    &[icon="document"] {
      background: url(./images/text-icon.png);
    }
  }

  /deep/.uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

/deep/ .uploader-file-status {
  & > span {
    i {
      display: none;
    }
  }
}
</style>
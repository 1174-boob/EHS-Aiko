
/**
 * @author: 成礼雄
 * @description 上传图片 适用于：滑过时可预览可删除的组件
 */
import serviceNameList from '@/config/default/service.config.js'
const uploadMinxin = {
    props: {
        // 列表最多保留几项
        limit: {
            type: Number,
            default: 2,
        },
        //请求地址
        action: {
            type: String,
            default: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/ehs-customer/api/file/uploadFile` : `ehs-customer/api/file/uploadFile`,
        },
        data: {
            type: Object,
            default: () => { },
        },
        // 文件类型
        fileTypeArr: {
            type: Array,
            default: () => [
                "image/jpeg",
                "image/jpg",
                "image/png",
            ],
        },
        // 类型错误提示文字
        errTypeMsg: {
            type: String,
            default: "上传文件类型错误",
        },
        // 文件大小限制
        maxSize: {
            type: Number,
            default: 5,
        },
        // 成功的回调方法名
        handleSuccessName: {
            type: String,
            default: "handleSuccess",
        },
        // 失败的回调方法名
        handleErrorName: {
            type: String,
            default: "handleError",
        },
        // 删除列表某项的回调方法名
        handleRemoveName: {
            type: String,
            default: "handleRemove",
        },
        // 是否使用插槽
        useSlot: {
            type: Boolean,
            default: false,
        },
        // initFileList: {
        //     type: Array,
        //     default: []
        // }
    },
    data() {
        return {
            loading: false,
            fileSize: 1048576, // 1M
            headers: { Authorization: "", },
            file: null,
        };
    },
    mounted() {
        // 设置header
        this.setAuthorization();
        // this.fileList = this.initFileList;
    },
    methods: {
        // 上传之前
        beforeUpload(file) {
            if (!this.fileTypeAndSizeTest(file)) return false;
            // 存储当前文件对象
            this.file = file;
            this.loading = true
        },
        // 检测文件类型和大小
        fileTypeAndSizeTest(file) {
            // 检测文件类型
            let isLegalType = this.fileTypeArr.includes(file.type);
            if (!isLegalType) this.$antMessage.warn(this.errTypeMsg);
            // 检测文件大小
            let isMoreThen = file.size - this.fileSize * this.maxSize < 0;
            if (!isMoreThen) this.$antMessage.warn(`文件大小不能超过${this.maxSize}M`);
            return isLegalType && isMoreThen;
        },
        // 上传状态改变
        handleChange(info) {
            // console.log('上传info', info);
            // console.log('上传状态改变1', info.file.status);
            // 状态有：uploading done error removed
            let uploadState = info.file.status
            let { fileList } = info
            this.fileList = [...fileList]
            if (info.file.response && info.file.response.code != 20000) {
                uploadState = 'serve-error'
            }
            switch (uploadState) {
                case "uploading":
                    break;
                case "done":
                    this.uploadDone(info.file.response, info.file);
                    break;
                case "error":
                    this.fileList.pop()
                    this.uploadError(info.file.response);
                    break;
                case "removed":
                    this.removeFile(info.file)
                    break;
                default:
                    let msg = info.file.response?.message || '上传失败！'
                    this.$antMessage.warn(msg);
                    this.fileList.pop()
                    setTimeout(() => {
                        this.loading = false
                    }, 600);
                // console.log('文件上传状态异常。。。');
            }
        },
        // 上传成功
        uploadDone(res, file) {
            if(this.multiple) {
                var ifLast = false;
                for(let i = 0;i < this.fileList.length;i++) {
                    (this.fileList[this.fileList.length - 1].response && this.fileList[this.fileList.length - 1].response.data.id == res.data.id) ? (ifLast = true) : (ifLast = false);
                }
                if (res.data) {
                    let { id, url, fileName } = res.data;
                    this.fileList.some((item) => {
                        if (item.uid == file.uid) {
                            this.$set(item, "id", id);
                            this.$set(item, "url", url);
                            this.$set(item, "fileName", fileName);
                            return true;
                        }
                    });
                }
                if(ifLast) {
                    setTimeout(()=>{
                        this.$emit(this.handleSuccessName, this.fileList);
                        this.loading = false
                        this.$antMessage.success(`上传成功`);
                    },2000);
                    // setTimeout(() => {
                    // }, 600);
                }
            } else {
                let { id, url } = res.data
                let { uid, name, type, size } = this.file
                if (this.addFileList) {
                    this.addFileList.push({ name, type, size, id, url, fileSize: size });
                }
                let fileData = { id, uid, name, status: 'done', url, }
                this.fileList.pop()
                this.fileList = [...this.fileList, fileData];
                this.$antMessage.success(`上传成功`);
                this.$emit(this.handleSuccessName, this.fileList);
                setTimeout(() => {
                    this.loading = false
                }, 600);
            }
        },
        // 上传失败
        uploadError(res) {
            this.$antMessage.warn(`上传失败`);
            this.$emit(this.handleErrorName, res);
            setTimeout(() => {
                this.loading = false
            }, 600);
        },
        // 删除上传列表某项
        removeFile(file) {
            this.fileList = this.fileList.filter((res) => {
                return res.uid !== file.uid;
            });
            this.$emit(this.handleSuccessName, this.fileList);
        },
        // 图片预览
        previewImg(imgUrl) {
            this.$hevueImgPreview({url: imgUrl, clickMaskCLose: true});
        },
        // 设置header
        setAuthorization() {
            const token_type = sessionStorage.getItem("token_type");
            const token = sessionStorage.getItem("access_token");
            this.headers.Authorization = token_type + " " + token;
        },
    },
};

export default uploadMinxin;
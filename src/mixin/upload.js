
/**
 * @author: 成礼雄
 * @description 上传文件
 */
const uploadMinxin = {
    props: {
        // 组件大小
        width: {
            type: String,
            default: "430px",
        },
        height: {
            type: String,
            default: "199px",
        },
        // 上传框内类型文字
        typeText: {
            type: String,
            default: "图片",
        },
        // 是否显示列表
        showUploadList: {
            type: Boolean,
            default: false,
        },
        // 列表最多保留几项
        limit: {
            type: Number,
            default: 1,
        },
        //请求地址
        action: {
            type: String,
            default: "/upload1/api/bps/file/file/upload",
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
                "image/png",
                "text/plain",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
            default: 1,
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
        // 是图片 供预览使用
        imgUrl: {
            type: String | Number,
            default: "",
        },
    },
    computed: {
        minHeight() {
            let isPx = this.height.indexOf("px") !== -1;
            let minHeight = null;
            if (isPx) {
                minHeight = parseFloat(this.height);
                minHeight = minHeight - 2 + "px";
            }
            return minHeight;
        },
    },
    data() {
        return {
            loading: false,
            fileSize: 1048576,
            headers: { Authorization: "", },
            file: null,
            fileList: [],
        };
    },
    mounted() {
        // 设置header
        this.setAuthorization();
    },
    methods: {
        // 上传之前
        beforeUpload(file) {
            console.log("上传之前文件file--", file);
            if (!this.fileTypeAndSizeTest(file)) return false;
            // 存储文件列表和当前文件对象
            this.fileList = [...this.fileList, file];
            this.file = file;
            this.loading = true
        },
        // 上传状态改变
        handleChange(info) {
            console.log('上传info', info);
            console.log('上传状态改变', info.file.status);
            // 状态有：uploading done error removed
            let uploadState = info.file.status
            switch (uploadState) {
                case "uploading":
                    console.log('文件上传中。。。');
                    break;
                case "done":
                    this.uploadDone(info.file.response);
                    break;
                case "error":
                    this.uploadError(info.file.response);
                    break;
                case "removed":
                    console.log('文件移除');
                    break;
                default:
                    console.log('文件上传状态异常。。。');
            }
            setTimeout(() => {
                this.loading = false
            }, 600);
        },
        // 上传成功
        uploadDone(res) {
            this.$antMessage.success(`上传成功`);
            this.$emit(this.handleSuccessName, res);
        },
        // 上传失败
        uploadError(res) {
            this.$antMessage.warn(`上传失败`);
            this.$emit(this.handleErrorName, res);
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
        // 删除上传列表某项
        removeFile(file) {
            // console.log('项目移除了', file);
            this.fileList = this.fileList.filter((res) => {
                return res.uid !== file.uid;
            });
            this.$emit(this.handleRemoveName);
            this.fileList = this.fileList.slice(this.limit);
        },
        // 图片预览
        previewImg(imgUrl) {
            this.$hevueImgPreview(imgUrl);
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
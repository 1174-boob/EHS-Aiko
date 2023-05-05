
import { cloneDeep } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js";
const handleDisplayPictureMinxin = {
    data() {
        return {

        }
    },
    methods: {
        // 图片上传
        handleSuccessPictograms(fileList, attrName) {
            // console.log('图片上传', fileList, attrName);
            let fileIdsStr = fileList ? fileList.map(item => item.id) : []
            this.$set(this.iFrom, attrName, fileIdsStr)
            formValidator.formItemValidate(this, attrName, 'iFrom')
        },
        // 处理图片回显
        handleDisplayPicture(pictureIdObj) {
            let allIds = []
            Object.keys(pictureIdObj).forEach(item => {
                if (pictureIdObj[item]) {
                    allIds = [...allIds, ...pictureIdObj[item]]
                }
            })
            if (allIds.length) {
                return this.getPortraitUrltFn(allIds)
                    .then(res => {
                        let resData = this.dealImgEcho(res, "fileName", "filePath")
                        Object.keys(pictureIdObj).forEach(item => {
                            // console.log(pictureIdObj[item]);
                            if (pictureIdObj[item]) {
                                let idsArr = cloneDeep(pictureIdObj[item])
                                pictureIdObj[item] = resData.filter(item => {
                                    return idsArr.includes(item.id)
                                })
                            } else {
                                pictureIdObj[item] = []
                            }
                        })
                        console.log('pictureIdObj',pictureIdObj);
                        return Promise.resolve(pictureIdObj)
                    })
                    .catch(err => {
                        Object.keys(pictureIdObj).forEach(item => {
                            if (pictureIdObj[item]) {
                                pictureIdObj[item] = []
                            }
                        })
                        return Promise.resolve(pictureIdObj)
                    })
            } else {
                Object.keys(pictureIdObj).forEach(item => {
                    pictureIdObj[item] = []
                })
                return Promise.resolve(pictureIdObj)
            }
        },
    },
};

export default handleDisplayPictureMinxin;
/**
 * @author: 成礼雄
 * @description table表格居中-变省略号-表格空值
 */
const teableCenterEllipsis = {
    data() {
        return {
            emptyText: <a-empty />,
        }
    },
    created() {
        if(this.columns) {
            this.columns.forEach(item => {
                item.align = item.align ? item.align : 'center'
                item.ellipsis = item.ellipsis ? item.ellipsis : true
            })
        }
    },
};

export default teableCenterEllipsis;
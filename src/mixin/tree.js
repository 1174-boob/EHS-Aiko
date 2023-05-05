/**
 * @author: 成礼雄
 * @description  树选中
 */
const treeMixin = {
    data() {
        return {
            // 默认选中的key
            defaultCheckedKeys: [],
            //选择的key
            selectedKeys: [],
            //半选节点key
            halfCheckedKeys: [],
        }
    },
    methods: {
        onCheck(selectedKeys, info) {
            console.log('selectedKeys--', selectedKeys);
            console.log('info--', info);
            this.selectedKeys = selectedKeys;
            this.halfCheckedKeys = info.halfCheckedKeys
        },
    },
};

export default treeMixin;
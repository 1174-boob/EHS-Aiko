
const deptAndUser = {
    data() {
        return {
            deptData: [],
        }
    },
    methods: {
        corporationChange() {
            this.$set(this.formInline, "deptId", undefined);
            this.deptData = [];
        },
        corporationDeptChange(deptData) {
            this.deptData = deptData;
        },
        // 各部门改变
        departOrPerpleChange(lab, attrName) {
            this.$set(this.iFrom, attrName, lab[0])
        },
    }
};

export default deptAndUser;

import { feathJobPosition } from "@/services/api.js"

export default {
  data() {
    return {
      allPostOptions: [],
      postOptions: []
    }
  },
  created() {
    this.getAllJobOptions()
  },
  computed: {
  },
  methods: {
    postLabel(val) {
      return ((this.allPostOptions || []).find(item => {
        return item.value === val
      }) || {}).label
    },
    async getAllJobOptions() {
      const { code, data } = await this.getJobOptions()
      if (+code === 20000) {
        this.allPostOptions = data || []
        this.postOptions = data || []
      }
    },
    async handleDeptChange(val) {
      const { code, data } = await this.getJobOptions(val)
      if (+code === 20000) {
        this.postOptions = data || []
      }
    },
    getJobOptions(deptId = '') {
      let para = {
        deptId: deptId
      }
      return feathJobPosition(para)
    },
  }
}
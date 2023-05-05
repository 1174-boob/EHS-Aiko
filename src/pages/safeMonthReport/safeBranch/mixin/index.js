
const mixin = {
  data() {
    return {
      isChanged: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    //查找部门名称
    recFindProjectById(data, id){
      let res = null
      let findItem = data.find(item=>{
        if(item.id === id){
          return true
        }else if(item.children){
          res = this.recFindProjectById(item.children,id)
          if(res){
            return true
          }
        }
        return false
      })
      if(findItem){
        res = res || findItem
      }
      return res
    },
    reRender() {
    },
    //数据发生变化
    handleChange(){
      this.isChanged = true
    },
    checkIsChanged(){
      return this.isChanged
    },
    isEmpty(value) {
      return value === '' || value === undefined || value === null
    },
  }
};
export default mixin
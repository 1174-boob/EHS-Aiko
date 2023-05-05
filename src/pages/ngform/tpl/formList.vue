<template>
	<div class="form-config">
		可查询要素:
		<el-checkbox-group v-model="config.queryList">
			<el-checkbox :label="l.model" v-for="l in  list" :key="l.model">{{l.label}}</el-checkbox> 
		</el-checkbox-group>  
		列表显示要素:
		<el-checkbox-group v-model="config.showList">
			<el-checkbox :label="l.model" v-for="l in  list" :key="l.model">{{l.label}}</el-checkbox> 
		</el-checkbox-group>  
	</div>
</template>
<script>
export default {
	data() {
		return {
			 

		}
	},
	props: {
		list: {
			type: Array,
			default: ()=> []
		},
		config: {
			type: Object ,
			required: true
		}
	},
	created() {
		if(!this.config.showList) {
			this.$set(this.config , 'showList' , [])
		}
		if(!this.config.queryList) {
			this.$set(this.config , 'queryList' , [])
		}
	}
}
</script>
<style lang="less" scoped>
.form-config{
	
}
</style>
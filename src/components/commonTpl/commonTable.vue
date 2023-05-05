<template>
  <div class="common-table m-b-20">
    <a-spin :spinning="spinning" wrapperClassName="a-spin-table">
      <slot></slot>
      <!-- 分页 -->
      <div v-if="page" class="table-pagination">
        <div>
          <slot name="circletip"></slot>
        </div>
        <div class="pagination flex align-items-center" v-if="!noPaging">
          <!-- 原来的 -->
          <!-- <a-pagination simple :current="page.pageNo" :pageSize="page.pageSize" :total="page.total" show-less-items showQuickJumper @change="pageNoChange" />
          <span>
            共
            <span>{{ page.total }}</span>
            条
          </span>-->
          <!-- 现在的 去掉:pageSize="page.pageSize"就可以使用跳转xx页功能 -->
          <a-pagination
            v-show="page.total"
            show-size-changer
            :current="page.pageNo"
            :pageSize="page.pageSize"
            :page-size-options="page.pageSizeOptions ? page.pageSizeOptions : ['10', '20', '30', '40', '50']"
            :total="page.total"
            :show-total="total => `共 ${total} 条`"
            showQuickJumper
            @change="pageNoChange"
            @showSizeChange="showSizeChange"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
// 全局组件-表格
export default {
  props:{
    // 父组件传了page就显示分页  没传就不显示分页
    page:{},
    pageNoChange:{},
    showSizeChange:{},
    noPaging:{},
    spinning:{
      default:false
    }
  }
}
</script>
<style lang="less" scoped>
.table-pagination {
  justify-content: space-between;
}
</style>

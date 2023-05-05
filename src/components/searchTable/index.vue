<template>
  <!-- 公用模板（带有标题、查询条件、表格、分页、虚线边框按钮、点击按钮弹出公用弹框样式） -->
  <div class="searchTable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">  
    <div v-show="true" class="searchTable-box">
      <h2 class="page-title font-20 font-weight-400 color-333 m-t-15 m-b-15 m-r-30">
        <slot name="title"></slot>
      </h2>
      <!-- 查询 -->
      <div class="searchTable-search m-t-20 m-b-20 flex align-items-center justify-content-between border-f4 border-radius-2 bg-250 pd-t-27 pd-b-12 pd-l-10 pd-r-10">
        <slot name="search"></slot>
      </div>
      <!-- 虚线按钮 -->
      <div class="dashed-btn clx-btn-dashed-box m-b-15">
        <slot name="extra"></slot>
      </div>
      <!-- 表格 -->
      <div class="contract-table">
        <slot name="table"></slot>
      </div>
    </div>
  </div>
</template>
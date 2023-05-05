 <template>
  <!-- 自定义组件的值无法正常回显到表格列里，所以要单独处理 -->
  <div>
    <template v-for="item in showList">
      <el-table-column header-align="center" :key="item.model" align="center" :label="item.label" min-width="130" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span
            v-if="item.type == 'dictData' || item.type == 'staffTree' || item.type == 'organizeTree' || item.type == 'selfTimeRange' || item.type == 'organizeTreeCheckbox' || item.type == 'relationForm' || item.type == 'dictDataMutiple'"
          >{{scope.row[item.model + "_label"]}}</span>
          <span v-else>
            <ng-form-item-base :record="item" :models="scope.row" :renderPreview="true" />
          </span>
        </template>
      </el-table-column>
    </template>
  </div>
</template>

<script>
export default {
  props: ["showList"]
}
</script>

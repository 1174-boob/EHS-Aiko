<template>
  <div>
    <a-spin :spinning="spinning">
    <div class="printCurrpage">
      <div class="preview-style">
        <a-pagination simple :default-page-size="1" @change="nextPage" :total="12" />
        <h1>安全管理月报</h1>
        <div>
          <a-icon v-if="!full" type="fullscreen" @click="fullScreen" :style="{ fontSize: '20px' }" />
          <a-icon v-else type="fullscreen-exit" @click="fullScreen" :style="{ fontSize: '20px' }" />
          <a-icon type="printer" @click="printPage" :style="{ fontSize: '20px', marginLeft: '20px' }" />
        </div>
      </div>
      <div id="pdfDom" v-if="importType !== 'main'">
          <component v-for="item in curShowComps" :key="item.id" :is="item.component" v-show="printTime  || curComp === item.id" :ref="item.id" 
          :disabled="true" :isPreviewType="true" :treeData="treeData" :para="params"  :searchData="searchData"></component>
      </div>
      <div id="pdfDom" v-else-if="printTime">
        <div v-for="item, index in mainList" :key="index">
          <component ref="compRef" :disabled="true" :isPreviewType="true" :treeData="treeData" :para="params" :is="item" :searchData="searchData"></component>
        </div>
      </div>
      <div v-else>
          <component ref="compRef" :disabled="true" :isPreviewType="true" :treeData="treeData" :para="params" :is="currentComponent" :searchData="searchData"></component>
      </div>
    </div>
  </a-spin>
  </div>
</template>

<script>
import fstPage from '../safeMain/childPage/1fstPage'
import sndPage from '../safeMain/childPage/2sndPage'
import trdPage from '../safeMain/childPage/3trdPage'
import forPage from '../safeMain/childPage/4forPage'
import fivPage from '../safeMain/childPage/5fivPage'
import sixPage from '../safeMain/childPage/6sixPage'
import svnPage from '../safeMain/childPage/7svnPage'
import ehtPage from '../safeMain/childPage/8ehtPage'
import ninPage from '../safeMain/childPage/9ninPage'
import tenPage from '../safeMain/childPage/10tenPage'
import elePage from '../safeMain/childPage/11elePage'
import twvPage from '../safeMain/childPage/12twvPage'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { htmlToPdf } from '@/utils/htmlToPdf.js'
import pdf from "vue-pdf";
import { cloneDeep } from 'lodash' 
import { queryDeptTree } from '@/services/api'
import {tabComps} from '@/pages/safeMonthReport/safeBranch/comp/compConfig.js'
export default {
  components: {
    fstPage, sndPage, trdPage, forPage, fivPage, sixPage, svnPage, ehtPage, ninPage, tenPage, elePage, twvPage
  },
  props: {
    importType: {
      type: String,
      default: 'main'
    },
    params: {
      type: Object,
      default: () => {}
    },
    searchData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      treeData: [],
      currentComponent: null,
      mainList: [fstPage, sndPage, trdPage, forPage, fivPage, sixPage, svnPage, ehtPage, ninPage, tenPage, elePage, twvPage],
      branchList: cloneDeep(tabComps),
      full: false,
      spinning: false,
      printTime: false,
      isShowAll: false,
      curComp: 'accident'
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    curShowComps() {
      return this.branchList.filter(item => {
        return item.isActive
      })
    }
  },
  methods: {
    init() {
      if (this.importType !== 'main') {
        this.mainList = this.branchList.map((item) => {
          return item.component
        })
        this.getTreeData()
        this.currentComponent = (tabComps.find(item => {
          return item.id === 'accident'
        }) || {}).component
        // this.$nextTick(() => {
        //   this.$refs.compRef.fetchData()
        // })
      } else {
        this.currentComponent = fstPage
      }
    },
    nextPage(value, option) {
      if(this.importType == 'main') {
        this.currentComponent = this.mainList[value - 1];
      } else {
        this.branchList[value - 1].isActive = true
        this.curComp = this.branchList[value - 1].id
        this.$nextTick(() => {
          this.$refs[this.curComp] && this.$refs[this.curComp][0] && this.$refs[this.curComp][0].reRender()
        })
        // this.$nextTick(() => {
        //   this.$refs.compRef.fetchData()
        // })
      }
    },
    getTreeData() {
      let list = this.getCommonAddOrgnizeList
      let deptId = this.getMappingValue(list, "id", this.params.corporationId).deptId
      queryDeptTree({
          deptId: deptId
        }).then(res => {
          this.treeData = res.data ? [res.data] : [];
        }).catch(err => {console.log(err)})
    },
    printPage() {
      this.spinning = true;
      this.printTime = true;
      this.branchList.forEach(item => {
        item.isActive = true
        this.$nextTick(() => {
          this.$refs[item.id] && this.$refs[item.id][0] && this.$refs[item.id][0].reRender()
        })
      })
      setTimeout(() => {
        this.reactPrint();
      }, 3000);
    },
    reactPrint() {
      const element = document.getElementById('pdfDom');  // 这个dom元素是要导出的pdf的div容器
      const w = element.offsetWidth;  // 获得该容器的宽
      const h = element.offsetHeight;  // 获得该容器的高
      const offsetTop = element.offsetTop; // 获得该容器到文档顶部的距离
      const offsetLeft = element.offsetLeft; // 获得该容器到文档最左的距离
      const canvas = document.createElement('canvas');
      let abs = 0;
      const winI = document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
      const winO = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
      if (winO > winI) {
        abs = (winO - winI) / 2; // 获得滚动条宽度的一半
      }
      canvas.width = w * 2; // 将画布宽&&高放大两倍
      canvas.height = h * 2;
      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.translate(-offsetLeft - abs, -offsetTop);
      // 这里默认横向没有滚动条的情况，因为offset.left()，有无滚动条的时候存在差值，因此translate的时候，要把这个差值去掉
      html2canvas(element, {
        allowTaint: true,
        scale: 1 // 提升画面质量，但是会增加文件大小
      }).then((res) => {
        const contentWidth = res.width;
        const contentHeight = res.height;
        // 一页pdf显示html页面生成的canvas高度
        const pageHeight = contentWidth / 592.28 * 841.89;
        // 未生成pdf的html页面高度
        let leftHeight = contentHeight;
        // 页面偏移
        let position = 0;
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        const imgWidth = 595.28;
        const imgHeight = 592.28 / contentWidth * contentHeight;
        const pageDate = res.toDataURL('image/jpeg', 1.0);
        // @ts-ignore
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF('', 'pt', 'a4');
        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面的高度（841.89）
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageDate, 'JPEG', 0, position, imgWidth, imgHeight);
        } else { // 分页
          while (leftHeight > 0) {
            pdf.addImage(pageDate, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            // 避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage()
            }
          }
        }
        // if (superReportDate) {
          pdf.save(`安全管理月报汇总.pdf`)
        // }
        // if (reportDate) {
        //   pdf.save(`${reportDate}安全管理月报汇总.pdf`)
        // }
        this.spinning = false;
        this.printTime = false;
      })
    },
    fullScreen() {
      if(!this.full) {
        this.full = true;
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
      } else {
        this.full = false;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },
   },
  watch: {
    
  },
}
</script>

<style lang="less" scoped>
  .preview-style {
    display: flex;
    justify-content: space-between;
  }
  #pdfDom {
    padding: 0 30px 0 30px !important;
  }
</style>
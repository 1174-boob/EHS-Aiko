<template>
  <div class="big-screen" ref="table" id="big-screen">
    <a-tooltip :title="title">
      <a-icon @click="toggleScreen" class="action" :type="fullScreen ? 'fullscreen-exit' : 'fullscreen'" />
    </a-tooltip>
    <iframe :src="src" id="qt" scrolling="auto" frameborder="0" width="0" height="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src:"",
      fullScreen: false,
      title:"全屏",
    }
  },

  beforeRouteEnter(to,from,next){
    console.log(to,'to======');
    console.log(from,'from=====');
    const path = to.path;
    if(path == '/systemManagement/holiday2') {
      next(vm=>{
        vm.src = "http://10.251.181.11:9095#/aj/oZU9gW7H"
      })
    } else {
      next(vm=>{
        vm.src = "http://10.251.181.11:9095#/aj/tiTYsk44"
      })
    }
    next()
  },
  beforeDestroy() {
    this.removeListener()
  },
  mounted() {
    this.changeqtIframe();
    window.addEventListener('resize',()=>{
      this.$nextTick(()=>{
        this.changeqtIframe();
      })
    })
    this.addListener()
  },
  methods: {
    changeqtIframe() {
      const qt = document.getElementById('qt');
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      console.log('iiii==',this.fullScreen);
      // if(!this.fullScreen) {
      //   console.log("aaaa");
      //   qt.style.width = Number(deviceWidth) - 320 + 'px'; // 数字是页面布局宽度差值
      //   qt.style.height = Number(deviceHeight) - 190 + 'px'; // 数字是页面布局高度差
      // } else {
      //   console.log("bbbb");
        // qt.style.width = '100%'; // 数字是页面布局宽度差值
        // qt.style.height = '100%'; // 数字是页面布局高度差
        qt.style.width = Number(deviceWidth) + 'px'; // 数字是页面布局宽度差值
        qt.style.height = Number(deviceHeight) + 'px'; // 数字是页面布局高度差
        
      // }
      console.log(qt.style.width,qt.style.height);
    },
    toggleScreen() {
      console.log("点击。。。。",this.fullScreen);
      if (this.fullScreen) {
        this.outFullScreen();
      } else {
        this.inFullScreen();
      }
    },
    inFullScreen() {
      const el = this.$refs.table
      el.classList.add('beauty-scroll')
      if (el.requestFullscreen) {
        el.requestFullscreen()
        return true
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
        return true
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
        return true
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
        return true
      }
      this.$antMessage.warn('对不起，您的浏览器不支持全屏模式')
      el.classList.remove('beauty-scroll')
      return false
    },
    outFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      this.$refs.table.classList.remove('beauty-scroll')
    },
    addListener() {
      document.addEventListener('fullscreenchange', this.fullScreenListener)
      document.addEventListener('webkitfullscreenchange', this.fullScreenListener)
      document.addEventListener('mozfullscreenchange', this.fullScreenListener)
      document.addEventListener('msfullscreenchange', this.fullScreenListener)
    },
    removeListener() {
      document.removeEventListener('fullscreenchange', this.fullScreenListener)
      document.removeEventListener('webkitfullscreenchange', this.fullScreenListener)
      document.removeEventListener('mozfullscreenchange', this.fullScreenListener)
      document.removeEventListener('msfullscreenchange', this.fullScreenListener)
    },
    fullScreenListener(e) {
      this.fullScreen = !this.fullScreen;
    }
  }
}
</script>
<style lang='less' scoped>
.big-screen {
  width: 100%;
  overflow: auto;
  // padding-bottom: 60px;
  .action {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #fff;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: @primary-color;
    }
  }
}

</style>
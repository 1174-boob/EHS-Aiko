<template>
  <div class="player-box">
    <div class="video-box" ref="video" id="video"></div>
  </div>
</template>

<script>
import Player from "xgplayer";
export default {
  props: {
    videoObj: {
      type: Object,
      default: () => { }
    },
    // 是否自动播放
    videoIsAutoPlay: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      player: undefined,
      // 配置项
      options: {
        id: "video",
        url: '',
        lang: 'zh-cn',
        // poster: 'https://test.boeplat.com/test/file/resource/1675931248258.jpg',
        autoplay: false,
        fluid: true, //填充整个父级元素
        videoInit: true, //初始化显示首帧   移动端无效  不能和autoplay一起
        // closeVideoClick: true,
        closeVideoDblclick: false, //双击全屏
        closeVideoPreventDefault: true, //阻止默认行为
        enableVideoDbltouch: true, // 禁用右键菜单
        playsinline: true,
        // playbackRate: [0.5, 0.75, 1, 1.5, 2], //传入倍速可选数组
        allowSeekPlayed: true, //进度条只能拖动到已播过部分
        keyShortcut: 'on', //键盘快捷键
        keyShortcutStep: { //设置调整步长
          currentTime: 3, //播放进度调整步长，默认10秒
          volume: 0.1 //音量调整步长，默认0.1
        },
      },
    };
  },
  mounted() {
    // 初始化
    this.initPlayer()
  },
  methods: {
    // 初始化
    initPlayer() {
      console.log('播放器正在初始化', this.videoObj);
      // 是否能拖动滚动条  allowSeekPlayedkenen可能为undefined
      this.options.allowSeekPlayed = this.videoObj.allowSeekPlayed === false ? false : true
      this.options.url = this.videoObj.url
      this.player = new Player(this.options);

      this.player.on('playing', () => {
        this.$emit('setTimeoutSaveStudyCount')
        console.log('继续播放');
      })
      this.player.on('pause', () => {
        console.log('当前为暂停方法触发,是否为学完自动暂停', this.player.ended);
        if (this.player.ended) {

        } else {
          this.$emit('viodePlayPaused')
          console.log('暂停');
        }
      })
      // 监听实例化完成
      this.player.on('ready', () => {
        // 设置-当前进度
        this.setVideoCurrentTime()
        // 设置-主动播放
        if (this.videoIsAutoPlay) {
          this.setVideoPlay()
        }
      })
      // 监听视频播放结束
      this.player.on('ended', () => {
        // 退出全屏
        this.exitFullscreen()
        this.$emit('viodePlayEnd')
      })
      // 监听视频播放器销毁
      this.player.once('destroy', () => {
        console.log('监听视频播放器销毁');
        setTimeout(() => {
          this.initPlayer && this.$refs.video && this.initPlayer()
        });
      })
    },
    // 销毁播放器
    destroyPlayer() {
      this.player.destroy(true)
    },
    // 设置-当前进度
    setVideoCurrentTime() {
      this.player.currentTime = this.videoObj.studyCount
    },
    // 设置-主动播放
    setVideoPlay() {
      this.player.play()
    },
    // 退出全屏
    exitFullscreen() {
      if (this.player.fullscreen) {
        this.player.exitFullscreen()
      }
    }
  },
  beforeDestroy() {
    this.player && this.player.destroy()
  },
};
</script>

<style lang="less" scoped>
.player-box {
  flex: 1;
  width: 100%;
  height: 100% !important;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
  display: flex;
  .video-box {
    flex: 1;
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100% !important;
    // 禁止高度变化
    padding-top: 0 !important;
  }
  ::v-deep .xgplayer-replay {
    // display: none !important;
  }
  ::v-deep video {
    width: 100%;
    height: 100% !important;
    outline: none;
  }
}
// 隐藏播放按钮
.maskShow {
  ::v-deep .xgplayer-start {
    display: none !important;
  }
}
// 皮肤样式
::v-deep .xgplayer-start {
  overflow: visible;
  background: #0067cc;
  transition: all 0.3s;
  width: 50px;
  height: 50px;
  &:hover {
    opacity: 1 !important;
  }
}
::v-deep .xgplayer-skin-default .xgplayer-start div svg {
  fill: #fff;
  width: 100%;
  height: 100%;
}
::v-deep
  .xgplayer-skin-default.xgplayer-pause
  .xgplayer-start
  .xgplayer-icon-play {
  height: 100%;
}
::v-deep .xgplayer-skin-default .xgplayer-progress-played {
  background: #0067cc;
}
</style>


<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>气象站监测数据</PageTitle>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="refresh()">
          刷新
        </a-button>
        <div style="margin-top:10px;">
          <p>数据时间：{{weatherList.time}}</p>
        </div>
      </div>
    </DashBtn>
    <div class="ad-container">
      <ul class="ad-row1">
        <li class="ad-block first">
          <div class="title">温度</div>
          <div class="content">{{weatherList.e5}}°C</div>
          <div class="warn"><b>注意事项：</b>高温作业35℃↑；停止室外露天作业40°C↑；</div>
          <img src="../../../assets/weather/wendu.png">
        </li>
        <li class="ad-block second">
          <div class="title">湿度</div>
          <div class="content">{{weatherList.e6}}%RH</div>
          <div class="warn"><b>注意事项：</b>体感事宜湿度，40%～70%</div>
          <img src="../../../assets/weather/shidu.png">
        </li>
        <li class="ad-block third">
          <div class="title">风速</div>
          <div class="content">{{weatherList.e1}}m/s</div>
          <div class="warn"><b>注意事项：</b>停止室外高处、吊装作业等，10m/s↑</div>
          <img src="../../../assets/weather/fengsu.png">
        </li>
        <li class="ad-block forth">
          <div class="title">风向</div>
          <div class="content">{{weatherList.e12}}°(N)</div>
          <div class="warn"><b>注意事项：</b>污染物扩散关联</div>
          <img src="../../../assets/weather/fengxiang.png">
        </li>
      </ul>
      <ul class="ad-row2">
        <li class="ad-block fifth">
          <div class="title">气压</div>
          <div class="content">{{weatherList.e3}}hPa</div>
          <div class="warn"><b>注意事项：</b>污染物扩散关联</div>
          <img src="../../../assets/weather/daqiyali.png">
        </li>
        <li class="ad-block sixth">
          <div class="title">雨量</div>
          <div class="content">{{weatherList.e2}}mm/Min.</div>
          <div class="warn"><b>注意事项：</b>停止室外用电；暂停高处、吊装作业等，0↑</div>
          <img src="../../../assets/weather/yuliang.png">
        </li>
        <li class="ad-block seventh">
          <div class="title">雨量累计</div>
          <div class="content">{{weatherList.e4}}mm/24Hr.</div>
          <div class="warn"><b>注意事项：</b>停止室外用电；暂停高处、吊装作业等，10mm/24h↑(中雨)</div>
          <img src="../../../assets/weather/yuliangleiji.png">
        </li>
        <li class="ad-block eighth">
          <img src="../../../assets/weather/nothing.png">
          <p style="font-size:16px">更新中...</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { getWeatherStation } from "@/services/api.js";

export default {
  components: {},
  data() {
    return {
      weatherList: {}

    }
  },
  created() {
    this.refresh();
    
  },
  methods: {
    refresh() {
      getWeatherStation()
        .then((res) => {
          this.weatherList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  }
}
</script>

<style lang='less' scoped>
ul li.ad-block .title {
  font-size: 18px;
  margin-top: 10px;
  color: #000;
  transition: color .3s
}

ul li.ad-block .content {
  font-size: 24px;
  margin-top: 10px;
  font-weight: bold;
  color: #000;
  transition: color .3s
}

ul li.ad-block .warn {
  font-size: 14px;
  margin-top: 10px;
  line-height: 20px;
  color: #000;
  transition: color .3s
}

ul li {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

ul li:hover .title {
  color: #0067cc;
}

ul li:hover .content {
  color: #0067cc;
}

ul li:hover .warn {
  color: #0067cc;
}

ul li.first {
  background-image: url(~@/assets/weather/bg1.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -110px;
  }
}

ul li.second {
  background-image: url(~@/assets/weather/bg2.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -90px;
  }
}
ul li.third {
  background-image: url(~@/assets/weather/bg3.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -115px;
  }
}
ul li.forth {
  background-image: url(~@/assets/weather/bg4.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -95px;
  }
}
ul li.fifth {
  background-image: url(~@/assets/weather/bg5.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -85px;
  }
}
ul li.sixth {
  background-image: url(~@/assets/weather/bg6.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -110px;
  }
}
ul li.seventh {
  background-image: url(~@/assets/weather/bg7.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  img {
    width: 50px;
    height: 50px;
    margin-left: 200px;
    margin-top: -110px;
  }
}
ul li.eighth {
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
    
  }
}

.ad-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.ad-row1 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.ad-row2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.ad-block {
  width: 300px;
  height: 200px;
  margin: 10px;
  background-color: #ccc;
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-direction: column;
  align-items: flex-start;
  font-size: 24px;
}



</style>
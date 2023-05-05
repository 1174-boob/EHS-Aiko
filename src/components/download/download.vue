<template>
  <!-- 下载组件 -->
  <div class="download-box">
    <a-button type="primary" @click="download('1448891173679534082',false)">下载</a-button>
  </div>
</template>

<script>
import downloadMixin from '@/mixin/download'
export default {
  mixins: [downloadMixin],
  data() {
    return {
    }
  },
  methods: {
    download() {
      let exportName = '调用记录';
      let ajax = new XMLHttpRequest();
      ajax.open('get', `http://192.168.52.57:5060/boeplat-ziidbhg/api/annex/download/example?templateId=1447488017272033281`);
      ajax.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      ajax.setRequestHeader("Authorization", `bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOm51bGwsImNvZGUiOiIyMDAwMCIsInVzZXJfbmFtZSI6ImJhaTEyMzQ1NiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE2MzQzMDE3NzUsInVzZXJOYW1lIjoiYmFpMTIzNDU2IiwidXNlcklkIjoiMTQxMjk2NjQ1OTc1OTUyOTk4NCIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iXSwianRpIjoiMzllZmJmNWUtOGJhNS00MmM4LTg0ZDMtODQ3YzRlMzA4ZTk4IiwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.K8hP-I6hvnt6DCKkqIrkPu8NvJdrGY1ZmPJhp8cqvGuJXjXR9ZT4A5KRB9Ssi9lHQ5uIYI5FOePOqJX7hJ3uiFgH4YU6dlrGq3Os5JB52X8j4QltAkes17RCpSZJrneX7VA81ZV8mLVkvJE4yemOyTaSk2nsRxJMNFNg7yq3Tzt3RR32Z7QCAlaUUWr8eNXFbfY6imHrB1y6py1HU5zbOTgXQVbz2VecOD7nC0liCNm8UtAnM3QqWZSz8ZzVQA_m5TSANk9nwf4G6aZOC--vHfkqjSFop03IRgEHB9mKlz0vzpG49aQUy8CYlujpwuYAqXea9dkT6v62nn7RUKg85g`);
      ajax.responseType = 'arraybuffer';

      ajax.onreadystatechange = function () {
        console.log(ajax, '..............ajax')
        if (ajax.readyState == 4 && ajax.status == 200) {
          var blob = new Blob([ajax.response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, `${exportName}.xlsx`);
          } else {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${exportName}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }
      }
      ajax.send();//JSON.stringify(payload)

    },
  },
}
</script>

<style lang="less" scoped>
.download-box {
}
</style>

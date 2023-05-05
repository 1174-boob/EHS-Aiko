<template>
  <a-icon :component="accidentIconSvg" />
</template>

<script>
const accidentIconSvg = {
  template: `
   <svg width="16px" height="17px" viewBox="0 0 16 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>事故事件-click备份</title>
    <g id="PC端" stroke="none" stroke-width="1" fill-rule="evenodd">
        <g id="安全" transform="translate(0.000000, 0.887497)">
            <rect id="圆角矩形_1" fill-rule="nonzero" x="0" y="0" width="16" height="15.996956" rx="2"></rect>
            <g id="编组-43" transform="translate(2.819016, 3.998478)">
                <rect id="矩形" stroke="#FFFFFF" fill="#FFFFFF" x="6.86196899" y="1.16846813" width="3" height="1" rx="0.5"></rect>
                <rect id="矩形备份-95" stroke="#FFFFFF" fill="#FFFFFF" x="7.86056519" y="3.16694615" width="2.00140381" height="1" rx="0.5"></rect>
                <rect id="矩形备份-96" stroke="#FFFFFF" fill="#FFFFFF" x="8.86196899" y="5.16542417" width="1" height="1" rx="0.5"></rect>
                <g id="编组-42">
                    <rect id="矩形" stroke="#FFFFFF" fill="#FFFFFF" x="4" y="3.55581681" width="1" height="1.2002503" rx="0.5"></rect>
                    <circle id="椭圆形" fill="#FFFFFF" cx="4" cy="6.20228696" r="1"></circle>
                    <polygon id="路径-20" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" points="0 8 8 8 4 0"></polygon>
                </g>
            </g>
        </g>
    </g>
</svg>
  `,
};
export default {
  data() {
    return {
      accidentIconSvg,
    }
  },
}
</script>

<style lang="less" scoped>
</style>
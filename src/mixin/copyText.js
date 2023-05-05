
/**
 * @author: 成礼雄
 * @description 形参ref 为被复制dom的ref属性值
 */
const copyTextMixin = {
    methods: {
        copyText(ref) {
            if (ref && this.$refs[ref]) {
                const activateSpan = this.$refs[ref];
                const range = document.createRange();
                window.getSelection().removeAllRanges();
                range.selectNodeContents(activateSpan);
                window.getSelection().addRange(range);
                const tag = document.execCommand('Copy');
                tag ? this.$antMessage.success('复制成功') : this.$antMessage.warning('复制失败，请手动复制')
                window.getSelection().removeAllRanges();
            } else {
                this.$antMessage.warning('复制失败，请手动复制');
            }
        }
    },
};

export default copyTextMixin;
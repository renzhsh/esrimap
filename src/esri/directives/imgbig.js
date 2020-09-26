export default {
    bind: function (el, binding) {
        let oDiv = el; //当前元素
        let self = this; //上下文
        let type = binding.value.type;

        oDiv.onmousedown = function (e) {
            if (type === 'bg') {
                var url = $(e.currentTarget).css('backgroundImage').split("\"")[1];
            } else if (type === 'img') {
                var url = e.currentTarget.src;
            }

            if (url) {
                $('.imgbig-wrap').show();
                $('.imgbig-wrap').find('img').attr('src', url);
            }
        };
    }
}

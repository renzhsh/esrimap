export default {
    bind: function (el, binding) {
        let oDiv = el; //当前元素
        let self = this; //上下文
        let target = binding.value.target; //需要展示的元素

        oDiv.onclick = function (e) {
            var el = document,
                cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                wscript;

            if (typeof cfs != "undefined" && cfs) {
                cfs.call(el);
                $('.' + target).show();
                return;
            }

            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                    $('.' + target).show();
                }
            }
        };
    }
}

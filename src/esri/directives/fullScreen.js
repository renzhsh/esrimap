export default {
    bind: function (el, binding) {
        let oDiv = el; //点击当前元素
        let self = this; //上下文
        let target = binding.value.target; //需要放大的元素

        oDiv.onclick = function (e) {
            var el = $("." + target)[0]; // 放大的容器     
            var rfs = el.requestFullScreen ||  
            el.webkitRequestFullScreen || el.mozRequestFullScreen ||el.msRequestFullscreen;      
            
            if(typeof rfs != "undefined" && rfs) {
                rfs.call(el);
                oDiv.style.display = "none";
            };
            
            return;
        };
    }
}

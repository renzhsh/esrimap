import qs from 'qs';
import { http } from 'rzs-spring';

export default {
    name: 'axios.request',
    fn: (Vue, context) => {
        // 添加请求拦截器
        http.interceptors.request.use(
            function(config) {
                const token = Vue.prototype.$auth2.Token;
                // 对于简单请求的跨域访问，浏览器默认先发送options请求判断是否允许跨域
                // 设置该头部，标识该访问不是简单请求
                config.headers['Content-Type'] =
                    'application/x-www-form-urlencoded;charset=utf-8';

                if (token) {
                    // 添加token请求头
                    config.headers['Authorization'] = 'bearer ' + token;
                }

                config.transformRequest = [
                    function(data) {
                        return qs.stringify(data);
                    },
                ];

                // 在发送请求之前做些什么
                return config;
            },
            function(error) {
                // 对请求错误做些什么
                return Promise.reject(error);
            }
        );
    },
};

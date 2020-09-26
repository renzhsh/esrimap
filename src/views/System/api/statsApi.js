import { http } from 'rzs-spring';

export default {
    getSum(params) {
        return http.get('/api/stats/land/sum', { params: params });
    },
    getCarrySum(params) {
        return http.get('/api/stats/carry/sum', { params: params });
    },
};

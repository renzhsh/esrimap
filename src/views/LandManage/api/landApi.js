import { http } from 'rzs-spring';

export default {
    getLandInfoByCode(code) {
        return http.get(`/api/land/${code}`);
    },
    addLandInfo(data) {
        return http.post('/api/Land', data);
    },
    updateLandInfo(data) {
        return http.put('/api/Land', data);
    },
};

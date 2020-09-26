import { http } from 'rzs-spring';

export default {
    savePhoto(params, data) {
        return http.put('/api/carry/photo', data, { params: params });
    },
    saveFile(params, data) {
        return http.put('/api/carry/docs', data, { params: params });
    },
    startStage(params) {
        return http.put('/api/carry/start', null, { params: params });
    },
    finishStage(params) {
        return http.put('/api/carry/finish', null, { params: params });
    },
    changeStage(params) {
        return http.put('/api/carry/change', null, { params: params });
    },
};

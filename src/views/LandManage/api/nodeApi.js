import { http } from 'rzs-spring';

export default {
    addNode(data) {
        return http.post('/api/Node', data);
    },
    updateNode(data) {
        return http.put('/api/Node', data);
    },
    getNodeInfo(code) {
        return http.get('/api/Node?code=' + code);
    },
    deleteNode(id) {
        return http.delete('/api/node/' + id);
    },
};

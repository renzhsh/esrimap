export default {
    route: {
        layout: '/',
        routeConfig: [{
            path: '/comparison',
            name: '图斑比对',
            component: resolve => {
                require(['./Main'], resolve);
            }
        }]
    }
}
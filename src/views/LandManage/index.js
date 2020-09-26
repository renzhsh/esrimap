export default {
    route: {
        layout: '/',
        routeConfig: [{
            path: '/land/main',
            name: '土地管理',
            component: resolve => {
                require(['./LandMain'], resolve);
            }
        }]
    }
}
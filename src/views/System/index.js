import appx from './appx';
export default {
    route: {
        routeConfig: [
            {
                name: 'login',
                path: '/login',
                meta: {
                    ignoreAuth: true,
                },
                component: resolve => {
                    require(['./Login'], resolve);
                },
            },
            {
                path: '/',
                redirect: '/land/main', //在这里啊
                component: resolve => {
                    require(['./Layout'], resolve);
                },
                children: [
                    {
                        name: '403',
                        path: '/error/403',
                        component: resolve => {
                            require(['./pages/403'], resolve);
                        },
                    },
                    {
                        name: '404',
                        path: '/error/404',
                        component: resolve => {
                            require(['./pages/404'], resolve);
                        },
                    },
                    {
                        name: '500',
                        path: '/error/500',
                        component: resolve => {
                            require(['./pages/500'], resolve);
                        },
                    },
                ],
            },
        ],
    },
    vuex: {
        path: 'appx',
        config: appx,
    },
};

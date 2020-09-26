import model from './model';
import axios from 'axios';

const NODE_ENV = process.env.NODE_ENV;

function getValue(url, fn) {
    axios.get(url).then(resp => {
        let data = resp.data;
        if (data.Success) {
            let value = null;
            if (data.Data && data.Data.Value) {
                value = JSON.parse(data.Data.Value);
            }
            fn(value);
        } else {
            throw data.Message;
        }
    });
}

export default [
    {
        key: 'General',
        expired: 60 * 60 * 1000,
        remoteFn: () => {
            return new Promise((resolve, reject) => {
                resolve(model['General']);
            });
        },
        meta: {
            desc: '常规设置',
        },
    },
    {
        key: 'Land',
        expired: 60 * 60 * 1000,
        remoteFn: () => {
            return new Promise((resolve, reject) => {
                resolve(model['Land']);
            });
        },
        meta: {
            desc: '图层管理',
        },
    },
    {
        key: 'Menu',
        expired: 60 * 60 * 1000,
        remoteFn: () => {
            return new Promise((resolve, reject) => {
                resolve(model['Menu']);
            });
        },
        meta: {
            desc: '菜单',
        },
    },
];

export default class {
    constructor() {
        this.fns = [];
    }

    inject(callback) {
        if (typeof callback == 'function') {
            this.fns.push(callback);
        }
    }

    async ready() {
        return new Promise(async (resolve, reject) => {
            this.fns.forEach(async fn => {
                await new Promise((sol, rej) => {
                    fn(sol, rej);
                });
            });
            resolve(true);
        });
    }
}
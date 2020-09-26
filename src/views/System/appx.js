const Appx = {
    state: {
        innerWidth: 0,
        innerHeight: 0,
        menuOffsetLeft: -200
    },
    mutations: {
        updateSreen(state, obj) {
            state.innerWidth = obj.innerWidth;
            state.innerHeight = obj.innerHeight;
        },
        updateMenu(state, obj) {
            state.menuOffsetLeft = obj.menuOffsetLeft;
        }
    }
};

export default Appx;

<template>
    <ul class="toolmenu-container">
        <li class="toolmenu-user">
            欢迎您，[管理员]!
        </li>
        <!-- <li class="tool-set toolmenu-e">
            <i></i>
            <span>设置</span>
        </li> -->
        <!-- <li class="tool-help toolmenu-e">
            <i></i>
            <span>帮助</span>
        </li> -->
        <li class="tool-exit toolmenu-e">
            <i></i>
            <span>退出登录</span>
        </li>
    </ul>
</template>
<script>
export default {
    data() {
        return {
            current: ""
        };
    },
    methods: {

    }
};
</script>
<style lang="less">
.toolmenu-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 4px;

    li {
        width: 74px;
        height: 32px;
        font-size: 12px;
        text-align: center;
        color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 36px;

        i {
            width: 18px;
            height: 18px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            padding-left: 8px;
        }

        span {
            height: 30px;
            line-height: 30px;
        }
    }

    .tool-set i {
        background-image: url("../images/set.png");
    }

    .tool-help i {
        background-image: url("../images/help.png");
    }

    .tool-exit i {
        background-image: url("../images/exit.png");
    }

    .toolmenu-user {
        width: 100px;
        margin-right: 5px;
        color: #e6a23c;
    }

    .toolmenu-e {
        cursor: pointer;
    }
}
</style>



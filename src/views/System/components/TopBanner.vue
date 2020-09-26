<template>
    <el-row type="flex" justify="center" class="sadie-layout-top-banner">
        <el-col :lg="6" :xl="6" :xs="8" :sm="8" :md="8">
            <div class="top-logo"></div>
        </el-col>
        <el-col :span="14" class="sadie-menu-container">
            <NavMenu :list="list" class="horizontal-menu"></NavMenu>
        </el-col>
        <el-col
            :lg="4"
            :xl="4"
            :xs="2"
            :sm="2"
            :md="2"
            style="margin-right:10px"
        >
            <ToolMenu class="hidden-md-and-down"></ToolMenu>
        </el-col>
    </el-row>
</template>
<script>
import NavMenu from "./HorizontalMenu";
import ToolMenu from "./ToolMenu";
export default {
    components: { NavMenu, ToolMenu },
    props: {
        list: {
            type: Array,
            default: function() {
                return [];
            }
        }
    }
};
</script>
<style lang="less">
.sadie-layout-top-banner {
    height: 100%;

    .top-logo {
        width: 280px;
        height: 50px;
        margin-top: 14px;
        margin-left: 11px;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url(/images/sys/top-logo.png);
    }

    .sadie-menu-container {
        .horizontal-menu {
            // display: inline-block;
            display: flex;
            justify-content: center;
            border: none;
            height: 100%;

            .el-menu-item,
            .el-submenu__title {
                width: 86px;
                height: 100%;
                font-size: 16px;
                color: #fff;
                cursor: pointer;
                line-height: 40px;
                text-decoration: none;
                transition: 0.3s border-color, 0.3s color;
            }
        }
    }
}
</style>



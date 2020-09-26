 <template>
    <div>
        <div class="asidemenu-container">
            <!-- 选中路由跳转 以路由url 为index值 -->
            <el-menu :default-active="current" background-color="transparent" text-color="#337ab7">
                <template v-for="(item,index) in list">
                    <el-submenu :key="index" v-if="item.nodes" :index='index+"0"'>
                        <template slot="title">
                            <div class="el-submenu-wrap">
                                <i :class="item.icon"></i>
                                <span>{{item.title}}</span>
                            </div>
                        </template>

                        <template v-for="(children,cindex) in item.nodes">
                            <el-menu-item :key="cindex" @click="sendSubmenuToParent(children)" :index='children.url'>
                                <i :class="children.icon"></i>
                                <span>{{children.title}}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>

                    <el-menu-item :key="index" v-if="!item.nodes" @click="sendMenuToParent(item)" :index='item.url'>
                        <i :class="item.icon"></i>
                        <span>{{item.title}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
    </div>
</template>
<script>
export default {
    props: ['list'],
        data() {
            return {
            current: '0'
        }
    },
    mounted() {
        this.current = this.$route.path;
    },
    watch: {
        $route(to, from) {
            this.current = to.path;
        }
    },
    methods: {
        sendMenuToParent(data) {
            this.$emit("listenToMenuEvenet", data);
        },
        sendSubmenuToParent(data) {
            this.$emit("listenToSubmenuEvenet", data);
        }
    }
};
</script>
<style lang="less">
.asidemenu-container {
    width: 100%;
    height: 100%;

    .el-submenu .el-menu-item {
        padding-left: 30px !important;
    }

    .el-submenu {
        border-bottom: 1px solid #eaecf1;
        transition: all 0.3s ease;

        .el-submenu-wrap {
            height: 48px;
            line-height: 48px;
            padding-left: 10px !important;
        }
    }

    .el-menu .el-submenu .el-submenu__title {
        height: 48px;
        line-height: 48px;
        width: 100%;
        padding: 0 !important;

        i {
            margin-right: 0;
            font-size: 12px;
            color: #337ab7;
        }
    }

    .el-menu-item i {
        margin-right: 0;
        font-size: 12px;
        color: #337ab7;
    }

    .el-menu-item {
        padding-left: 10px !important;
        height: 48px;
        line-height: 48px;
        transition: all 0.3s ease;
    }

    .el-menu-item.is-active {
        color: #fff;
        background-color: #55a7fb;
        background-image: linear-gradient(to top, #55a7fb, #0682de);

        i {
            color: #fff !important;
        }
    }

    .el-menu-item:hover {
        color: #fff !important;
        background-color: #55a7fb;
        background-image: linear-gradient(to top, #55a7fb, #0682de);

        i {
            color: #fff !important;
        }
    }

    .el-submenu__title:hover {
        color: #fff !important;
        background-color: #55a7fb;
        background-image: linear-gradient(to top, #55a7fb, #0682de);

        i {
            color: #fff !important;
        }
    }
}
</style>


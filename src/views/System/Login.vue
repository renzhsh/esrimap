<style  lang="less" scoped>
.bg {
    background-color: #fff;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;

    .header {
        height: 53px;
        width: 400px;
        margin: 0 auto;
        background-repeat: no-repeat;
        margin-top: 20px;
        background-image: url(./images/top.png);
    }

    .login-bg {
        background-repeat: no-repeat;
        background-image: url(./images/bg.jpg);
    }

    .el-main {
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
    }

    .el-footer {
        text-align: center;
        font-size: 16px;
        line-height: 80px;
    }

    .el-form {
        position: absolute;
        width: 320px;
        height: 360px;
        top: 50%;
        margin-top: -190px;
        right: 80px;
        text-align: center;
        background-color: #fff;
    }

    .el-form-item {
        width: 260px;
        margin-left: 30px;
        margin-bottom: 18px;
    }

    .el-button {
        width: 100%;
    }

    .login-text {
        color: #409eff;
        font-size: 24px;
        text-align: left;
        margin-bottom: -5px;
        margin-top: 13px;
    }

    .memory {
        margin-top: -14px;
        margin-left: -68px;
    }

    .buttom-commit {
        color: #fff;
        background-color: #17b7db;
        border-color: #17b7db;
    }
}
</style>

<template>
    <div class='bg'>
      <el-container style="height:100%">
        <el-header style="height:80px">
          <div class="header"></div>
        </el-header>
        <el-main class="login-bg">
          <el-form ref="formCustom" :model="formCustom" :rules="ruleCustom" autocomplete="off">
            <el-form-item>
              <p class="login-text">登录</p>
            </el-form-item>

            <el-form-item prop="username">
                <el-input v-model="formCustom.username" placeholder="帐号" autocomplete="off" ></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="password" v-model="formCustom.password" placeholder="密码" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class="buttom-commit" @click="handleSubmit('formCustom')">提交</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="warning" @click="handleReset('formCustom')">重置</el-button>
            </el-form-item>

            <el-form-item prop="rememberMe" class='memory'>
              <el-checkbox v-model="formCustom.rememberMe">记住我</el-checkbox>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer style="height:80px">Copyright  ©  2018 安徽中瀚测绘科技有限公司</el-footer>
      </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formCustom: {
                username: "",
                password: "",
                rememberMe: false
            },
            ruleCustom: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }]
            }
        };
    },
    mounted() {
    },
    methods: {
        handleSubmit(name) {
            // this.$refs[name].validate(valid => {
            //     if (valid) {
            //         this.$User
            //             .passwordLogin(this.formCustom.username, this.formCustom.password)
            //             .then(resp => {
            //                 this.$notify({
            //                     type: 'success',
            //                     title: "系统登录",
            //                     message: "登录成功"
            //                 });

            //                 if (this.$route.query.redirect && this.$route.query.redirect != '/') {
            //                     this.$router.push(this.$route.query.redirect);
            //                 }
            //                 else {
            //                     this.$router.push("/");
            //                 }
            //             })
            //             .catch(ex => {
            //                 this.$notify.error({
            //                     title: "系统登录",
            //                     message: ex
            //                 });
            //             });
            //     }     
            // });

            this.$router.push("/");
            this.$notify({
                type: 'success',
                title: "系统登录",
                message: "登录成功"
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>

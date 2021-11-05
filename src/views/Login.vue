<template>
    <div id="login">
        <div class="blog_demo loginbox">
            <div class="header">
                用户登录
                <el-divider></el-divider>
            </div>
            
            <el-form label-position="left" label-width="60px" :model="fromdata">
                <el-form-item label="用户名">
                    <el-input v-model="fromdata.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="fromdata.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="login" round>登录</el-button>
                    <el-button type="info" @click="toregister" round>注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            fromdata:{
                username:'',
                password:''
            }
        }
    },
    methods: {
        login(){
            if(this.fromdata.username.length == 0||this.fromdata.password.length == 0){
                alert('请输入完整')
                return;
            }
            this.$store.dispatch('Login',this.fromdata)
            },
            toregister(){
                this.$router.push({path:"/register"})
            }
        }
}
</script>

<style scoped>
    #login{
        height:80vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loginbox{
        padding:10px;
    }
</style>
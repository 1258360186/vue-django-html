<template>
    <div id="register">
        <div class="blog_demo registerbox" >
            <div class="header">
                用户注册
                <el-divider></el-divider>
            </div>
            
            <el-form label-position="left" label-width="80px" :model="fromdata">
                <el-form-item label="用户名">
                    <el-input v-model="fromdata.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="fromdata.password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input v-model="fromdata.password2"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="register" round>提交</el-button>
                    <el-button type="info" @click="tologin" round>已有账号</el-button>
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
                password:'',
                password2:''
            }
        }
    },
    methods: {
        register(){
            if(this.fromdata.username.length == 0||this.fromdata.password.length == 0||this.fromdata.password2.length == 0){
                alert('请输入完整')
                return;
            }
            if(this.fromdata.password < 8){
                alert('密码太短')
                return;
            }
            if(this.fromdata.password!=this.fromdata.password2){
                alert('密码不一致')
                return;
            }
            this.$store.dispatch('Register',this.fromdata)
            },
            tologin(){
                this.$router.push({path:"/login"})
            }
        }
}
</script>

<style scoped>
    #register{
        height:80vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .registerbox{
        padding:10px;
    }
</style>
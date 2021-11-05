<template>
  <div id="app" v-title data-title="白羽近墨">
    <!-- 头部导航 -->
    <div id="top-menu" class="blog_demo">

    </div>
    <!-- 侧边栏 左 导航 -->
    <div id="left-menu" :class="'blog_demo '+mobile_left">
      <!-- 图标 -->
      <i @click="showHideLeftMenu" id="left-icon" class="el-icon-menu"></i>
      <!-- 导航 -->
      <el-col :span="24" style="margin-top:60px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#00000000"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <el-menu-item index="/">
            <i class="el-icon-house"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="/">
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index='/add-article'>
                <i class="el-icon-edit-outline"></i>
                <span slot="title">发布文章</span>
                </el-menu-item>
                <el-menu-item index="/article-list">
                <i class="el-icon-tickets"></i>
                <span slot="title">文章列表</span>
                </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/user-permisson">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/pay-log">
            <i class="el-icon-money"></i>
            <span slot="title">打赏记录</span>
          </el-menu-item>
          <el-menu-item index="/lanmu-admin">
            <i class="el-icon-receiving"></i>
            <span slot="title">栏目管理</span>
          </el-menu-item>
          <el-menu-item @click="logout" v-if="authUserlogin">
            <i class="el-icon-back"></i>
            <span slot="title">退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <!-- 页面内容 -->
    <div id="content" :class="mobile_content">
      <router-view :screenwidth="screenwidth"></router-view>
      <div id="footer" class="blog_demo">
        <span>白羽近墨</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenwidth:document.body.clientWidth,
      mobile_left:"",
      mobile_content:""
    };
  },
  created() {
    this.$store.dispatch('Trylogin')
  },
  mounted() {
    window.onresize = () =>{
      this.screenwidth = document.body.clientWidth;
    }
    this.changeDevice();
  },
  methods: {
    logout(){
      this.$store.dispatch('Logout',this.$store.getters.isnoUserlogin);
    },
    changeDevice(){
      if(this.screenwidth<=500){
        this.mobile_left = "xs";
        this.mobile_content = "xs";
      }else{
        this.mobile_content = "";
        // this.mobile_content = "";
      }
    },
    showHideLeftMenu(){
      if(this.mobile_left==""){
        this.mobile_left="xs";
      }else{
        this.mobile_left="";
        }
      if(this.screenwidth>500){
      if(this.mobile_content==""){
        this.mobile_content="xs";
      }else{
        this.mobile_content="";
        }
      }
    },
    // toAddArticle(){
    //   this.$router.push({name:'AddArticle'})
    // }

  },
  computed:{
    authUserlogin(){
      return this.$store.getters.isnoUserlogin
    }
  },
  watch:{
    authUserlogin(newVal){
      if(newVal == null){
        this.$router.push({path:'/'})
      }
    }
  }
}
</script>

<style scoped>
.el-col{
    margin-top: 10px;
}
</style>

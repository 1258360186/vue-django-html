<template>
    <div class="blog_demo" >
            <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="lanmu">{{lanmu}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
            </el-breadcrumb>
      </div>
</template>

<script>
export default {
  props : ["name",'lanmu']
}
</script>


<style scoped>
  .blog_demo{
        /* height:200px; */
        margin:10px 5px 0;
        padding:20px 20px;
        /* display:flex; */
        align-items:center;
        /* justify-content:center; */
    }
</style>
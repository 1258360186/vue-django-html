<template>
  <div id="article-list">
      <div class="blog_demo" >
            <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章列表</el-breadcrumb-item>
            </el-breadcrumb>
      </div>
        <div class="blog_demo" >
            <el-row>
                <el-col :span="24">
                    <div class="card blog_demo" v-for="item in active_list" :key="item.id">
                        <el-row >
                            <el-col :xs="24" :lg="6">
                                <el-image
                                v-if="screenwidth>500"
                                style="height: 100px"
                                :src="item.cover"
                                fit="cover">
                                </el-image>
                                <el-image
                                v-else
                                style="width: 100px"
                                :src="item.cover"
                                fit="cover">
                                </el-image>
                            </el-col>
                            <el-col class="texe-item" v-if="screenwidth>500"
                                style="height: 100px" :xs="24" :lg="4">
                                <span style="line-height:100px">{{item.title}}</span>
                            </el-col>
                            <el-col class="texe-item" v-else :xs="24" :lg="4" >
                                <span>{{item.title}}</span>
                            </el-col>
                            <el-col class="texe-item" v-if="screenwidth>500"
                                style="height: 100px" :xs="12" :lg="7">
                                <span style="line-height:100px">发布者：{{item.nickname}}</span>
                            </el-col>
                            <el-col class="texe-item" v-else :xs="12" :lg="7">
                                <span>发布者：{{item.nickname}}</span>
                            </el-col>
                            <el-col class="texe-item" v-if="screenwidth>500"
                                style="height: 100px" :xs="12" :lg="7">
                                <el-button type="primary" icon="el-icon-edit" circle style="margin-top:30px"  @click="toarticle(item.id)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" circle style="margin-top:30px" @click="deletearticle(item.id)"></el-button>
                            </el-col>
                            <el-col class="texe-item" v-else :xs="12" :lg="7">
                                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                                <el-button type="danger" icon="el-icon-delete" circle @click="deletearticle(item.id)"></el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="blog_demo">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="pagetotal"
                :current-change="currentChange"
                :page-size='pagesize'>
            </el-pagination>
        </div>
  </div>
</template>

<script>
import axios from 'axios';
import Qs from 'qs';

export default {
    props: ['screenwidth'],
    data(){
      return{
          pagetotal: 25,
          currentPage:1,
          pagesize:5,
          active_list:[]
        }
  },
  mounted(){
      this.getlistdate(this.currentPage)
  },
  methods:{
      toarticle(id){
          this.$router.push({path:'/article',query:{id:id}})
      },
      deletearticle(id){
          if(confirm('是否确定删除')){
              let checkInfo={
                  contentType:'blog_article',
                  permissions:['delete']
              };
              this.$store.dispatch('checkUserPerm',checkInfo).then((res)=>{
                //   console.log(res);
                  if(res){
                            axios({
                    url:'http://118.178.124.82:80/api/delete-article/',
                    method:'delete',
                    data:Qs.stringify({
                        id,token:this.$store.getters.isnoUserlogin
                    }),
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }              
                }).then((res)=>{
                    //   console.log(res);
                    if(res.data=='nologin'){
                        alert('请登录')
                        return 
                    }else if(res.data=='noperm'){
                        alert('没有权限')
                        return
                        }
                    this.getlistdate(this.currentPage)
                }) }
                //   }else{
                //       console.log('1');
                //   }
              })
             
          }
      },
      getlistdate(page){
          axios({
              url:'http://118.178.124.82:80/api/article-list/',
              method: 'get',
              params: {page:page,pagesize:this.pagesize,lanmu:'all'}
          }).then((res)=>{
            //   console.log(res);
              this.active_list=res.data.data;
              this.pagetotal = res.data.total;
          })
      },
      currentChange(val){
          this.currentPage=val;
          this.currentPage = val;
          this.getlistdate(val)
      }
  }
}
</script>


<style scoped>
  .article-list{
      padding:20px 20px;
  }
  .el-breadcrumb{
      height:15px;
  }
  .card.blog_demo .texe-item{
    color:#fff;
    /* display:flex; */
    /* height:80px; */
    text-align:center;
    justify-content:center;
  }
  .blog_demo{
    padding:15px;
    margin-top:20px
}
.card{
    margin-top:20px;
    text-align:center;
    justify-content:center;
}


.el-pagination.is-background .el-pager li{
    background-color:#00000060;
    color:#fff;
}
.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    background-color:#00000060;
    color:#fff;
}
</style>
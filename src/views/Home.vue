<template>
  <div class="home">
    <div class="blog_demo">
    <el-row :gutter="20">
        <el-col :xs="24" :lg="8" v-for="item in active_list" :key="item.id" >
          <div class="blog_demo" style="height:220px" @click="toarticle(item.id)">
            <div class="title">{{item.title}}</div>
            <el-row>
              <el-col style="height:160px; text-align: center;" :lg="10" >
                <el-image
                v-if="screenwidth>500"
                style="height: 160px"
                :src="item.cover"
                fit="cover">
                </el-image>
                <el-image
                v-else
                style="width: 160px"
                :src="item.cover"
                fit="cover">
                </el-image>
              </el-col>
              <el-col style="height:160px;color:#fff;display: flex;justify-content: center;
        align-items: center;" :lg="14">
                  <div>{{item.describe}}</div>
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
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'Home',
  props: ['screenwidth'],
  components: {
 
  },
  data(){
    return{
      active_list:[],
      pagetotal: 0,
      pagesize:9,
      currentPage:1,
    }
  },
  mounted(){
      this.getlistdate(this.currentPage)
  },
  methods:{
    toarticle(id){
        // console.log(id);
          this.$router.push({path:'/article',query:{id:id}})
      },
    getlistdate(page){
          axios({
              url:'http://118.178.124.82:80/api/article-list/',
              method: 'get',
              params: {page:page,pagesize:this.pagesize,lanmu:'all'}
          }).then((res)=>{
              // console.log(res);
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
  .title{
    color: #fff;
    text-align: center;
    font-size:30px;
    /* border-bottom:1px solid #fff */
  }
  .blog_demo{
    /* padding:15px; */
    margin:5px 
}
</style>
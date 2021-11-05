<template>
  <div id="article">
    <BreakMenu :name="articledata.title" :lanmu='articledata.lanmu'></BreakMenu>
    <div class="blog_demo" >
        <el-row>
            <el-col :xs="24" :lg="16">
                <div class="blog_demo" >
                    <div class="articledemo">
                        {{articledata.title}}
                    </div>
                </div>
                <div class="blog_demo" >
                     <div class="articledemo" style="font-size:12px;font-style:italic">
                        {{articledata.describe}}
                    </div>
                </div>
                <div class="blog_demo" >
                     <div class="articledemo content" v-html="articledata.content">
                        
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="blog_demo" >
                    <el-button v-if="articledata.pre==0" disabled type="primary" icon="el-icon-arrow-left" @click="toother(articledata.pre)">上一页</el-button>
                    <el-button v-else type="primary" icon="el-icon-arrow-left" @click="toother(articledata.pre)">上一页</el-button>
                    <el-button v-if="articledata.next==0" disabled type="primary" icon="el-icon-arrow-right" @click="toother(articledata.next)">下一页</el-button>
                    <el-button v-else type="primary" icon="el-icon-arrow-right" @click="toother(articledata.next)">下一页</el-button>
                                  
                </div>
            </el-col>
            <el-col :xs="24" :lg="8">
                <div class="blog_demo" >
                    <div class="block" style="text-align: center">
                    <span class="demonstration">默认</span>
                    <el-image :src="articledata.cover" ></el-image>
                    </div>
                </div>
                <div class="blog_demo" >
                    <el-row  class="like-btn">
                        <el-col :span='8'>
                            
                            <i v-if="userarticle.like" class="iconfont icon-dianzan" @click="tolike" style="color:yellow"></i>
                            <i  v-else class="iconfont icon-dianzan" @click="tolike"></i>
                        </el-col>
                        <el-col :span='8'>
                            
                            <i v-if="userarticle.favor" class="iconfont icon-shoucang" style="color:yellow" @click="tofavor"></i>
                            <i v-else class="iconfont icon-shoucang" @click="tofavor"></i>
                        </el-col>
                        <el-col :span='8'>
                            
                            <i v-if="userarticle.mon" class="iconfont icon-dashang" style="color:yellow" @click="topay"></i>
                            <i v-else class="iconfont icon-dashang" @click="topay"></i>
                        </el-col>
                    </el-row>
                    
                </div>
                <div class="blog_demo" >
                    <div v-for="item in pinglundata" :key="item.id" class="blog_demo chart">
                        {{item.nickname}}
                        <el-divider></el-divider>
                        {{item.text}}
                    </div>
                    
                    <div class="blog_demo">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="pagetotal"
                            @current-change="currentChange"
                            :page-size='pagesize'>
                        </el-pagination>
                    </div>

                    <div class="blog_demo chart">
                        
                            
                                <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="newpinglun">
                                </el-input>
                            
                                <el-button type="success" @click="savenew" round>发布</el-button>
                            
                        
                    </div>
                    
                </div>
                
            </el-col>
        </el-row>
    </div>
    <div>
        <a id="paylink" href="" target="_blank"></a>
    </div>
  </div>
</template>

<script>
import BreakMenu from '../components/BreakMenu'
import axios from 'axios';
import Qs from 'qs';

export default {
  components:{
      BreakMenu
  },
  data(){
    return{
        articledata:{},
        newpinglun:'',
        pinglundata:[],
        userarticle:{
            like:false,
            favor:false,
            mon:false
        },
        // name:articledata.title,
        // lanmu:articledata.lanmu,
        articleid:this.$route.query.id,
        pagetotal:25,
        pagesize:5
    }
        
    },
    watch:{
        $route(to){
            this.articleid=to.query.id
            this.getarticle(to.query.id)
            this.getpinglun(1,this.pagesize)
            this.getuserarticle()
        }
    },
    mounted(){
        
      this.getarticle(this.articleid)
      this.getpinglun(1,this.pagesize)
      this.getuserarticle()
      },
    methods:{
        tolike(){
            axios({
                    url:'http://118.178.124.82:80/api/baiyu-articlelike/',
                    method:'post',
                    data:Qs.stringify({
                        token:this.$store.getters.isnoUserlogin,
                        id:this.articleid
                    })         
                }).then(res=>{
                    console.log(res.data);
                    if(res.data=='nologin'){
                        alert('请登录')
                        return 
                    }else if(res.data=='noperm'){
                        alert('没有权限')
                        return
                        }
                    if(res.data=='ok'){
                        this.getuserarticle()
                    }
                })
        },
        tofavor(){
            axios({
                    url:'http://118.178.124.82:80/api/baiyu-articlefavor/',
                    method:'post',
                    data:Qs.stringify({
                        token:this.$store.getters.isnoUserlogin,
                        id:this.articleid
                    })         
                }).then(res=>{
                    if(res.data=='nologin'){
                        alert('请登录')
                        return 
                    }else if(res.data=='noperm'){
                        alert('没有权限')
                        return
                        }
                    if(res.data=='ok'){
                        this.getuserarticle()
                    }
                })
        },
        topay(){

            axios({
                    url:'http://118.178.124.82:80/api/get-alipay-url/',
                    method:'post',
                    data:Qs.stringify({
                        token:this.$store.getters.isnoUserlogin,
                        id:this.articleid
                    })         
                }).then(res=>{
                    let link = document.getElementById('paylink')
                    link.href=res.data.paylink;
                    link.click()
                })

            
            if(confirm('支付是否完成')){
                return
            }
        },
        getuserarticle(){
            let token=this.$store.getters.isnoUserlogin
        if(token){
            axios({
                    url:'http://118.178.124.82:80/api/baiyu-userarticle/',
                    method:'post',
                    data:Qs.stringify({
                        token:this.$store.getters.isnoUserlogin,
                        id:this.articleid
                    })         
                }).then(res=>{
                    this.userarticle = res.data
                })
        }
            
        },
        getpinglun(page,size){
            axios({
                    url:'http://118.178.124.82:80/api/baiyu-pinglun/',
                    method:'get',
                    params:{
                        page,
                        size,
                        id:this.articleid
                    }            
                }).then(res=>{
                    // console.log(res.data);
                    this.pinglundata=res.data.data
                    this.pagetotal = res.data.total
                })
        },
        savenew(){
            if(this.newpinglun.length==0){
                alert("内容为空")
                return;
            }
            axios({
                    url:'http://118.178.124.82:80/api/baiyu-pinglun/',
                    method:'post',
                    data:Qs.stringify({
                        token:this.$store.getters.isnoUserlogin,
                        id:this.articleid,
                        text:this.newpinglun
                    })
                                
                }).then(res=>{
                    console.log(res.data);
                    if(res.data=='nologin'){
                        alert('请登录')
                        return 
                    }else if(res.data=='noperm'){
                        alert('没有权限')
                        return
                        }
                    if(res.data=='ok'){
                    this.getpinglun(1,this.pagesize)
                    this.newpinglun=""
                    }
            })
        },
        currentChange(page){
            
            this.getpinglun(page,this.pagesize)
        },
        toother(id){
            console.log(id);
            if(id==0){
                alert('没有了')
                return;
            }
            this.$router.push({path:'/article',query:{id:id}})
        },
      getarticle(id){
          axios({
                    url:'http://118.178.124.82:80/api/baiyu-article/',
                    method:'get',
                    params:{
                        id
                    }
                                
                }).then(res=>{
                    // console.log(res);
                    this.articledata=res.data
                })
      }
      }
}
</script>


<style scoped>
   .blog_demo{
        /* height:200px; */
        margin:10px 5px 0;
        padding:20px 20px;
        /* display:flex; */
        /* align-items:center; */
        /* justify-content:center; */
    }
    .blog_demo .articledemo{
    color:#fff;
    /* display:flex; */
    /* height:80px; */
    text-align:center;
    justify-content:center;
  }
  .content{
      color:#fff;
  }
  .content img {
      margin: 5px 5px;
  }
  .like-btn{
      text-align: center;
      color:#fff
  }
  .like-btn i{
      font-size:30px;
      cursor: pointer;
  }
  .chart{
      color:#fff;
      font-size:16px;
      padding:5px;
  }
</style>
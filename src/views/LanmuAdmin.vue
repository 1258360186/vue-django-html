<template>
  <div id="lanmu">
    <BreakMenu :name="name"></BreakMenu>
    <div class="blog_demo">
        <el-row>
            <el-col :span="6">
                <div class="blog_demo">
                    <h5 style=" width:100vw;color:#fff">栏目结构</h5>
                </div>
                <div>
                    <div class="blog_demo" style="display:flex">
                        <el-input v-model="newlanmu" placeholder="请输入新栏目名称"></el-input>
                        <el-button plain type="info" @click="pushlanmu">创建</el-button>
                    </div>
                    <div class="blog_demo">
                        <el-tree
                        :data="lanmutree"
                        node-key="id"
                        default-expand-all
                        :render-content="renderContent"
                        draggable
                        @node-click="chooselanmuarticle"
                        >
                        </el-tree>
                    </div>
                    <div class="blog_demo" style="display:flex">
                        <el-button type="success" plain @click="getlanmu">恢复结构</el-button>
                        <el-button type="success" plain @click="savelanmu">保存结构</el-button>
                        <el-button type="success" plain @click="getlistdate(1,'nobelong')">获取未分配文章</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="blog_demo">
                    <!-- <h5 style=" width:100vw;color:#fff">{{lanmuname!='nobelong'?lanmuname:'未分配'}}</h5> -->
                    <h5 style=" width:100vw;color:#fff">{{lanmuname!='nobelong' ? this.lanmuname : '未分配'}}</h5>
                </div>
                <div >
                    <div class="blog_demo" style="min-height:480px">
                    <el-row>
                        <el-col :span="24">
                            <div class="card blog_demo" v-for="item in active_list" :key="item.id">
                                <el-row >
                                    <el-col :xs="24" :lg="6">
                                        <el-image
                                        
                                        style="height: 100px"
                                        :src="item.cover"
                                        fit="cover">
                                        </el-image>
                                    </el-col>
                                    <el-col class="texe-item" 
                                        style="height: 100px" :xs="24" :lg="4">
                                        <span style="line-height:100px">{{item.title}}</span>
                                    </el-col>
                                    <el-col class="texe-item" 
                                        style="height: 100px" :xs="12" :lg="7">
                                        <span style="line-height:100px">发布者：{{item.nickname}}</span>
                                    </el-col>
                                    <el-col class="texe-item" 
                                        style="height: 100px" :xs="12" :lg="7">
                                        <el-popover
                                            placement="right"
                                            width="80"
                                            trigger="click"
                                            >
                                            <el-tree
                                            :data="lanmutree"
                                            node-key="id"
                                            default-expand-all
                                            @node-click="chooselanmu"
                                            >
                                            </el-tree>
                                            
                                            <el-button type="primary" slot="reference" icon="el-icon-edit" circle style="margin-top:30px" ></el-button>
                                            <el-button type="success" @click="choosearticle(item.id)" icon="el-icon-check" circle></el-button>
                                        </el-popover>
                                        
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                    </div>
                </div>
                <div class="blog_demo">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="total"
                        :current-change="currentChange"
                        :page-size='pagesize'>
                    </el-pagination>
                </div>
            </el-col>
            
        </el-row>
        
    </div>
  </div>
</template>

<script>
import BreakMenu from '../components/BreakMenu'
import axios from 'axios';
import Qs from 'qs';

export default {
  data(){
      return {
          name: '栏目管理',
          lanmuname:'nobeleng',
          total: 25,
          currentPage:1,
          pagesize:5,
          active_list:[],
          newlanmu:'',
          maxid:0,
          lanmutree:[],
          chooselanmuid:0,
          choosearticleid:0

      }
  },
  components:{
      BreakMenu
  },
  mounted(){
      this.getlistdate(this.currentPage,this.lanmuname)
      this.getlanmu()
  },
  computed:{
      
  },
  methods:{
      chooselanmuarticle(node){
          this.lanmuname = node.label
          this.getlistdate(1,this.lanmuname)
      },
      choosearticle(id){
          axios({
              url:"http://118.178.124.82:80/api/add-article/",
              method:"put",
              data:Qs.stringify({
                  token:this.$store.getters.isnoUserlogin,
                  lanmuid:this.chooselanmuid,
                  articleid:id
              })
              
          }).then((res)=>{
              if(res.data=='nologin'){
                        alert('请登录')
                        return 
                    }else if(res.data=='noperm'){
                        alert('没有权限')
                        return
                        }
                    if(res.data=='ok'){
                        this.getlistdate(1,this.lanmuname)
                        this.getlanmu()
                    }
          })
      },
      chooselanmu(node){
          this.chooselanmuid=node.id
          console.log(node.id);
      },
      getlanmu(){
          axios({
              url:"http://118.178.124.82:80/api/baiyu-lanmu/",
              method:"GET"
              
          }).then((res)=>{
              console.log(res.data);
              this.lanmutree=res.data;
                        
          })
      },
      savelanmu(){
          axios({
              url:"http://118.178.124.82:80/api/baiyu-lanmu/",
              method:"POST",
              data:Qs.stringify({
                  token:this.$store.getters.isnoUserlogin,
                  lanmutree:JSON.stringify(this.lanmutree),

              })
          }).then((res)=>{
              if(res.data=='nologin'){
                        alert('请登录')
                        return 
                    }else if(res.data=='noperm'){
                        alert('没有权限')
                        return
                        }
          })
      },
      pushlanmu(){
          let checktree = this.loopchecldata(this.lanmutree)
          if(checktree==false){
              this.newlanmu=''
              return
          }
          let newlanmu={
              id:this.maxid+1,
              label:this.newlanmu,
              children:[]
          }
            



          this.lanmutree.push(newlanmu)
          this.newlanmu=''
      },
      loopchecldata(tree){
          let checktree =true;
          tree.forEach((obj)=>{
              if(obj.id>this.maxid){
                  this.maxid=obj.id
              }
              if(obj.label==this.newlanmu){
                  alert("数据重复")
                  checktree = false
                  return
              }
              if(obj.children){
                  if(obj.children.length>0){
                  this.loopchecldata(obj.children)
              }
              }
              
            })
            return checktree
      },
      getlistdate(page,lanmu){
          this.lanmuname=lanmu
          axios({
              url:'http://118.178.124.82:80/api/article-list/',
              method: 'get',
              params: {page:page,pagesize:this.pagesize,lanmu:lanmu}
          }).then((res)=>{
            //   console.log(res);
              this.active_list=res.data.data;
              this.total = res.data.total;
          })
      },
      currentChange(val){
          this.currentPage=val;
          this.currentPage = val;
          this.getlistdate(val)
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);

        // 后端操作
        // axios({
        //       url:"http://118.178.124.82:80/api/baiyu-lanmu/",
        //       method:"DELETE",
        //       data:Qs.stringify({
        //           token:this.$store.getters.isnoUserlogin,
        //           id:data.id

        //       }),
        //       headers:{
        //                 "Content-Type":"application/x-www-form-urlencoded"
        //             } ,
        //   }).then((res)=>{
        //       if(res.data=='nologin'){
        //                 alert('用户信息错误')
        //                 return 
        //             }else if(res.data=='noperm'){
        //                 alert('没有权限')
        //                 return
        //                 }else if(res.data=='ok'){
        //                     this.getlanmu()
        //                 }
        //   })


      },
      renderContent(h, { node, data }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span style='margin-left:20px'>  ({node.data.articlenum})</span>
            <span>
              <el-button style='margin-left:20px' size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
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

    .card.blog_demo .texe-item{
    color:#fff;
    /* display:flex; */
    /* height:80px; */
    text-align:center;
    justify-content:center;
  }
  .texe-item span{
      height:40px;
      line-height:20px;
      text-overflow:ellipsis;
      overflow: hidden;
  }
  .el-tree {
    background: #00000060;
    color: #FFF;
}
.el-tree-node__content:hover {
    background-color: #00000060;
}
</style>
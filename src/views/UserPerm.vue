<template>
  <div id="userperm">
    <div class="blog_demo" >
            <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
      </div>
      <div class="blog_demo">
          <div class="blog_demo">
            <h5 style=" width:100vw;color:#fff">新建用户组</h5>
          </div>
              <el-row>
                <el-col :xs="24" :lg="12">
                  <div class="blog_demo new_group">
                    <el-form :inline="true" :model="newgroup" class="demo-form-inline">
                      <el-form-item >
                        <el-input v-model="newgroup.name" placeholder="名称"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="savenewgoup">保存</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-col>
                <el-col :xs="24" :lg="12">
                  <div class="blog_demo new_group">
                    <el-row >
                      <el-col v-for="(item,index) in newgroup.checkList" :key="item.id" class="demo" style="border-bottom:1pxcsoid #fff;padding:5px 0;">
                        <el-tag style="margin-right:20px;" type="info">{{item.name}}</el-tag>
                        <el-checkbox-group v-model="item.checkList" style="float:left;margin-top:10px;">
                          <el-checkbox v-for="method in item.perms" :key="method.id" :label="method.op">{{method.name}}</el-checkbox>
                        </el-checkbox-group>
                        <el-button type="success" @click="chooseall(index)" round style="float:left;margin-left:10px">全选</el-button>
                      </el-col> 
                    </el-row>
                    
                  </div>
                </el-col>
              </el-row>
      </div>
      <div class="blog_demo">
        <div class="blog_demo">
            <h5 style=" width:100vw;color:#fff">所有用户组</h5>
          </div>
          <div class="blog_demo">
            <el-row>
                <el-col v-for="(item,index) in allgroup" :key="item.id" :xs="24" :lg="6">
                  <el-button-group>
                    <el-button v-if="index==chooseg" type="info" @click="choosegroup(index)" icon="el-icon-search">{{item.name}}</el-button>
                    <el-button v-else type="primary" @click="choosegroup(index)" icon="el-icon-search">{{item.name}}</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="deletegroup(item.name)"></el-button>
                  </el-button-group>
                </el-col>
        </el-row>
          </div>
        
      </div>
      <div class="blog_demo">
        <div class="blog_demo">
            <h5 style=" width:100vw;color:#fff">所有用户</h5>
          </div>
          <div class="blog_demo" >
            <el-row style="display: flex;align-items: center;">
              <el-col :span="16" >
                <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入用户名"
              v-model="chooseuser"
              :data="userlist">
            </el-transfer>
              </el-col>
              <el-col :span="8">
                <el-button @click="setgroup" type="success">成功按钮</el-button>
              </el-col>
            </el-row>
            
          </div>
        
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import Qs from 'qs'
export default {
  data(){
    return{
        chooseuser: [],
        chooseg:0,
        userlist:[],
        filterMethod(query, item) {
          return item.name.indexOf(query) > -1;
        },

      newgroup:{
        name: '',
        checkList:[
          {
            checkList:[],
            name: '文章管理',
            contentType:'blog_article',
            perms:[
              {
                name:'增',
                op:'add'
              },
              {
                name:'删',
                op:'delete'
              },
              {
                name:'改',
                op:'change'
              },
              {
                name:'查',
                op:'view'
              }
            ]
          },
          {
            checkList:[],
            name: '栏目管理',
            contentType:'blog_lanmu',
            perms:[
              {
                name:'增',
                op:'add'
              },
              {
                name:'删',
                op:'delete'
              },
              {
                name:'改',
                op:'change'
              },
              {
                name:'查',
                op:'view'
              }
            ]
          },
          {
            checkList:[],
            name: '用户管理',
            contentType:'auth_user',
            perms:[
              {
                name:'增',
                op:'add'
              },
              {
                name:'删',
                op:'delete'
              },
              {
                name:'改',
                op:'change'
              },
              {
                name:'查',
                op:'view'
              }
            ]
          }
        ]
      },
      allgroup:[]
    }
  },
  mounted() {
    this.getallgroup()
    this.geyuserlist()
  },
  methods:{
    setgroup(){
      let group = this.allgroup[this.chooseg]
      let choose = this.chooseuser
      console.log(this.chooseuser);
      if(choose.length==0){
        alert('未选择用户')
        return
      }
      axios({
              url:'http://118.178.124.82:80/api/baiyu-newgroup/',
              method:'post',
              data:Qs.stringify({
                token:this.$store.getters.isnoUserlogin,
                group:group.name,
                choose:JSON.stringify(choose)
                
              })}).then((res)=>{
                if(res.data=='nologin'){
                alert('请登录')
                    return
              }else if(res.data=='error'){
                alert('权限不足')
                    return
              }if(res.data=='ok'){
                alert('成功')
                    return
              }
              })
    },
    choosegroup(idx){
      this.chooseg=idx
    },
    geyuserlist(){
        axios({
              url:'http://118.178.124.82:80/api/baiyu-userlist/',
              method:'get'
            }).then((res)=>{
              let userlist = res.data;
              userlist.forEach((user,index) => {
                this.userlist.push({
                name: user.name,
                key: user.name,
                label: user.name
              });
        });
            })
    },
    deletegroup(name){
      axios({
              url:'http://118.178.124.82:80/api/baiyu-newgroup/',
              method:'delete',
              headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    } ,
              data:Qs.stringify({
                token:this.$store.getters.isnoUserlogin,
                name:name,
                
              })
              
            }).then((res)=>{
              if(res.data=='nologin'){
                alert('请登录')
                    return
              }else if(res.data=='error'){
                alert('权限不足')
                    return
              }
              if(res.data=='ok'){
                this.getallgroup()
              }
            })
    },
    getallgroup(){
      axios({
              url:'http://118.178.124.82:80/api/baiyu-newgroup/',
              method:'get'
            }).then((res)=>{
              this.allgroup=res.data;
            })
    },
    savenewgoup(){
      // console.log(this.newgroup.name);
      if(this.newgroup.name.length==0){
        alert('请输入名称')
        return ;
      }
      let check=false;
      let permlist=[]
      this.newgroup.checkList.forEach((obj)=>{
        if(obj.checkList.length>0){
          check=true;
          let peritem={
            contentType:obj.contentType,
            permsop:obj.checkList
          }
          permlist.push(peritem)
        }
      })
      if(check){
        let checkInfo={
          contentType:'auth_user',
          permissions:['add','change','delete','view']
        }
        this.$store.dispatch('checkUserPerm',checkInfo).then(res=>{
          if(res){
            axios({
              url:'http://118.178.124.82:80/api/baiyu-newgroup/',
              method:'put',
              data:Qs.stringify({
                token:this.$store.getters.isnoUserlogin,
                newgroupname:this.newgroup.name,
                permlist:JSON.stringify(permlist)
              })
            }).then((res)=>{
              if(res.data=='nologin'){
                alert('请登录')
                    return
              }else if(res.data=='error'){
                alert('权限不足')
                    return
              }
              if(res.data=='same'){
                alert('名称重复')
                    return
              }
              if(res.data=='ok'){
                this.getallgroup()
              }
            })
          }
        })
        
      }else{
        alert('未选择权限')
        return
      }
    },
    chooseall(index){
      if(this.newgroup.checkList[index].checkList.length==0){
        this.newgroup.checkList[index].checkList=['add','delete','change','view']
      }else{
        this.newgroup.checkList[index].checkList=[]
      }
      
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
        align-items:center;
        /* justify-content:center; */
    }
    .demo{
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .new_group{
      color: #fff;
      height: 150px; 
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .el-transfer-panel {
    border: 1px solid #00000060;
    border-radius: 4px;
    overflow: hidden;
    background: #00000060;
    display: inline-block;
    vertical-align: middle;
    width: 200px;
    max-height: 100%;
    box-sizing: border-box;
    position: relative;
}
</style>
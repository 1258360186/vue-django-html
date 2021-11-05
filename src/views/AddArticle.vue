<template>
    <div id="add-article">
        <el-row :gutter="10">
            <el-col :xs="24" :lg="8">
                <div class="blog_demo">
                    <el-form :label-position="'left'" label-width="80px" :model="article_info">
                        <el-form-item label="文章标题">
                            <el-input v-model="article_info.title"></el-input>
                        </el-form-item>
                        <el-form-item label="文章介绍">
                            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="article_info.describe"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :xs="24" :lg="16">
                <div class="blog_demo" style="height:200px">
                    <!-- <div v-for="(img,index) in cover_list" :key="index">
                        <el-image
                            v-if="img==cover_img"
                            class="cover"
                            style="width: 150px; height: 150px"
                            :src="img"
                            fit="cove"
                            @click="choosecover(img)">
                        </el-image>
                        <el-image
                            v-else
                            style="width: 150px; height: 150px"
                            :src="img"
                            fit="cove"
                            @click="choosecover(img)">
                        </el-image>
                    </div> -->
                    <!-- <el-upload
                        class="avatar-uploader"
                        action="#" 
                        ref="uploadpic"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-change="onchange"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload> -->
                        
                   <img v-if="imageUrl" :src="imageUrl" class="avatar"> 
                  <el-button v-else type="primary" @click="onPickFile">上传封面图片<i class="el-icon-upload el-icon--right"></i></el-button>
                    <input 
                        type="file" 
                        ref="fileInput" 
                        accept="image/*" 
                        @change="getFile"
                        style="display: none"
                    >
                    

                    <!-- <i v-else class="el-icon-plus avatar-uploader-icon" @click="picupload"></i> -->
                    <el-button class="upload" type="success" round @click="submitArticle">保存</el-button>
                </div>

            </el-col>
            <el-col :xs="24" :lg="24">
                <div class="blog_demo">
                    <!-- <div id="summernote"></div> -->
                    <mavon-editor  v-model="value" ref="md"  @change="change" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import Qs from 'qs';

export default {
    name: 'AddArticle',
    data() {
        return {
            article_info:{
                title:'',
                describe:'',
                content:''
            },
            cover_list:[],
            cover_img:"",
            value:'',
            html:'',
            imageUrl: ''
        }
    },
    mounted() {
        // this.summernote()
    },
    methods: {
        // $imgAdd(pos, $file){
        //         let formdata = new FormData();

        //         this.$upload.post('http://118.178.124.82:80/upload/', formdata).then(res => {
        //             console.log(res.data);
        //             this.$refs.md.$img2Url(pos, res.data);
        //         }).catch(err => {
        //             console.log(err)
        //         })
        //     },
        // 所有操作都会被解析重新渲染
        change(value, render) {
            // render 为 markdown 解析后的结果[html]
            this.html = render;
            console.log(this.html);
        },
       

        //第二步:再来写个方法, button代替input选择图片
    onPickFile () {
      this.$refs.fileInput.click()
    },
    //第三步: 文件选择后, 后在页面上显示出来    转base64位的操作
    getFile (event) {
      const files = event.target.files
      let filename = files[0].name          //只有一个文件
      if ( filename.lastIndexOf('.') <= 0 ) {
        return alert("Please add a valid image!")        //判断图片是否有效
      }
      const fileReader = new FileReader()                //内置方法new FileReader()   读取文件
        fileReader.addEventListener('load',() => {
        this.imageUrl = fileReader.result
       })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
        //到这里后, 选择图片就可以显示出来了
    } ,


        // uploadpic(params){
        //     let that = this;
        //     let uploadData = new FormData();
        //     uploadData.append(that.picupload, params.file);
        //     console.log(params.file);
        //     this.imageUrl = params.file
        //     let file_url = that.$refs.upload_img.uploadFiles[0].url;
        //     console.log(file_url);
        // },

    //     handleAvatarSuccess(res, file) {
            
    //         this.imageUrl = URL.createObjectURL(file.raw);
    //         console.log(this.imageUrl);
    //     },
    //   beforeAvatarUpload(file) {
    //     const isLt2M = file.size / 1024 / 1024 < 2;

        
    //     if (!isLt2M) {
    //       this.$message.error('上传头像图片大小不能超过 2MB!');
    //     }
    //     return  isLt2M;
    //   },

    //     onchange(file){
          
    //   },




        submitArticle(){
            let article_data = {
                title:this.article_info.title,
                describe:this.article_info.describe,
                // content:this.article_info.content,
                content:this.html,
                cover:this.imageUrl,
                token:this.$store.getters.isnoUserlogin
            }
            axios.post('http://118.178.124.82:80/api/add-article/',Qs.stringify(article_data))
            .then(res =>{
                // console.log(res);
                if(res.data=='notitle'){
                    alert('标题为空')
                    return
                }else if(res.data=='notoken'){
                    alert('用户错误')
                    return
                }else if(res.data=='ok'){
                    window.location.reload()
                }

            }).catch(err =>{
                console.log(err);
            })
        },
        // summernote(){
        //     let self =this;
        //     $('#summernote').summernote({
        //         height:500,
        //         lang:"zh-CN",
        //         width:"100%",
        //         callbacks: {
        //             onChange(content){
        //                 self.article_info.content=content;
        //             },
        //             onImageUpload(files){
        //                 let img = files[0];
        //                 let imgData = new FileReader();
        //                 imgData.readAsDataURL(img)
        //                 imgData.onload = function(){
        //                     self.cover_list.push(imgData.result)

        //                     let imgnode = document.createElement("img");
        //                     imgnode.src=imgData.result;
        //                     $("#summernote").summernote('insertNode',imgnode);
        //                 }
        //             },
        //             onImageLinkInsert(url){
        //                 let imgnode = document.createElement("img");
        //                 imgnode.src=url;
        //                 $("#summernote").summernote('insertNode',imgnode);
        //                 self.cover_list.push(url);
        //             },
        //             onMediaDelete(target){
        //                 let imgData = target[0].src;
        //                 for(let i=0;i<self.cover_list.length;i++){
        //                     if(self.cover_list[i]==imgData){
        //                         self.cover_list.splice(i, 1);
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // },
        // choosecover(img){
        //     this.cover_img=img;
        // }
    }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
    .blog_demo{
        /* height:200px; */
        padding:20px 20px;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .el-form-item{
        margin-top: 22px;
    }
    .el-form-item__label{
        color:#fff!important;
    }
    .el-input__input{
        background:#00000060;
    }
    .el-textarea__inner{
        background:#00000060;
    }
    .blog_demo .el-image:hover{
    border: 5px solid #b8e907e8;
    }
    .blog_demo .el-image.cover{
    border: 5px solid #b8e907e8;
    }
    .blog_demo .upload{
        position: fixed;
        right: 20px;
        width: 100px;
        z-index: 100;
        margin-top: 240px;
    }
</style>
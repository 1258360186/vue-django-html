import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import Qs from 'qs';
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo:{}
  },
  getters:{
    isnoUserlogin(state){
      return state.userinfo.token;
    }
  },
  mutations: {
    saveUserinfo(state,userinfo){
      state.userinfo = userinfo
    },
    clearUserinfo(state){
      state.userinfo={}
    }
  },
  actions: {
    Login({commit},fromdata){
      axios({
        url:'http://118.178.124.82:80/api/baiyu-login/',
        method:'post',
        data: Qs.stringify(fromdata)
        }).then((res) =>{
        if(res.data=='none'){
            alert('用户不存在')
            return
        }else if(res.data=='pwderror'){
            alert("密码错误")
            return
        }
        // console.log(res.data);
        commit('saveUserinfo',res.data)
        localStorage.setItem('token',res.data.token)
        router.push({path:'/'})
    })
    },
    Trylogin({commit}){
      let token = localStorage.getItem("token")
      if(token){
        axios({
          url:'http://118.178.124.82:80/api/auto-login/',
          method:'post',
          data: Qs.stringify({token})
        }).then((res) =>{
          console.log(res.data);
          if(res.data=='tokenerror'){
            alert("登录过期")
            return
          }
          commit('saveUserinfo',res.data)
          localStorage.setItem('token',res.data.token)
          router.push({path:'/'})
        })
      }
    },
    Register({commit},fromdata){
      axios({
        url:'http://118.178.124.82:80/api/baiyu-register/',
        method:'post',
        data: Qs.stringify(fromdata)
        }).then((res) =>{
        if(res.data=='usererror'){
            alert('用户已存在')
            return
        }
        // console.log(res.data);
        commit('saveUserinfo',res.data)
        localStorage.setItem('token',res.data.token)
        router.push({path:'/'})
    })
    },
    Logout({commit},token){
        commit("clearUserinfo")
        localStorage.removeItem('token');
        axios({
          url:'http://118.178.124.82:80/api/baiyu-logout/',
          method:'post',
          data: Qs.stringify({token})
          }).then((res) =>{
          console.log(res.data);
          
      })
      },
      async checkUserPerm({getters},checkinfo){
        let token = getters.isnoUserlogin
        let contentType = checkinfo.contentType;
        let permissions = checkinfo.permissions;
        let permdata;
        await axios({
          url:'http://118.178.124.82:80/api/baiyu-checkperm/',
          method:'post',
          data: Qs.stringify({
            token,
            contentType,
            permissions:JSON.stringify(permissions)
          })
          }).then((res) =>{
          if(res.data=='nologin'){
            permdata = false;
            alert("用户信息错误")
            return
          }else if(res.data=='noperm'){
            permdata = false;
            alert("权限不足")
            // router.push({path:'/'})
            
            return
          }else if(res.data=='ok'){
            permdata = true;
          }
      })
      return permdata;
      }
  },
  modules: {
  }
})

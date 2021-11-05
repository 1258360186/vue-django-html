import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    
  },
  {
    path: '/add-article',
    name: 'AddArticle',
    component: () => import('../views/AddArticle.vue'),
    beforeEnter: (to, from, next) => {
      if(store.state.userinfo.token){
        next()
      }else{
        next('/login')
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/article-list',
    name: 'Article-list',
    component: () => import('../views/ArticleList.vue'),
    beforeEnter: (to, from, next) => {
      if(store.state.userinfo.token){
        next()
      }else{
        next('/login')
      }
    }
  },
  {
    path: '/pay-log',
    name: 'Pay-log',
    component: () => import('../views/PayLog.vue'),
    beforeEnter: (to, from, next) => {
      if(store.state.userinfo.token){
        next()
      }else{
        next('/login')
      }
    }
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('../views/Article.vue'),
    
  },
  {
    path: '/user-permisson',
    name: 'UserPerm',
    component: () => import('../views/UserPerm.vue'),
    beforeEnter: (to, from, next) => {
      if(store.state.userinfo.token){
        let checkInfo={
          contentType:'auth_user',
          permissions:['add','change','delete','view']
        }
        store.dispatch('checkUserPerm',checkInfo).then(res=>{
          if(res){
            next()
          }
        })
        
      }else{
        next('/login')
      }
    }
  },
  {
    path: '/lanmu-admin',
    name: 'Lanmu',
    component: () => import('../views/LanmuAdmin.vue'),
    beforeEnter: (to, from, next) => {
      if(store.state.userinfo.token){
        let checkInfo={
          contentType:'blog_lanmu',
          permissions:['add','change','delete','view']
        }
        store.dispatch('checkUserPerm',checkInfo).then(res=>{
          if(res){
            next()
          }
        })
        
      }else{
        next('/login')
      }
    }
  }
]

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
return routerPush.call(this, location).catch(err => err)
}


const router = new VueRouter({
  routes
})

export default router

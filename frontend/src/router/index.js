import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import ForgetPassword from '@/components/ForgetPassword'
import ResetPassword from '@/components/ResetPassword'
import ViewCrime from '@/components/ViewCrime'
import LogCrime from '@/components/LogCrime'
import ViewCrimes from '@/components/ViewCrimes'
import DeleteCrime from '@/components/DeleteCrime'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },

    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path : "/forget-password",
      name : ForgetPassword,
      component:ForgetPassword
    },
    {
      path : "/crimes",
      name : ViewCrimes,
      component:ViewCrimes
    },

    {
      path : "/forget-password/:userId/:codeId",
      name : ResetPassword,
      component:ResetPassword
    },
    {
      path: "/logout",
      name: "Logout",
      component: Logout
    },
    {
      path: "/get-crime/:crimeId",
      name: "ViewCrime",
      component: ViewCrime,
      beforeEnter : (to, from, next)=>{
        var nowTime = Date.now();
       if(!localStorage.token){
          next("/login/?from=" + from.path);
        }else if(localStorage.tokenExpires < nowTime){
          localStorage.removeItem("token");
          localStorage.removeItem("authUser")
          localStorage.removeItem("tokenExpires")
          next("/login/?from=" + from.path);
        }else{
          next();
        }
      }
    },

    {
      path: "/create-crime/",
      name: "LogCrime",
      component: LogCrime,
      beforeEnter : (to, from, next)=>{
        var nowTime = Date.now();
       if(!localStorage.token){
          next("/login/?from=/create-crime");
        }else if(localStorage.tokenExpires < nowTime){
          localStorage.removeItem("token");
          localStorage.removeItem("authUser")
          localStorage.removeItem("tokenExpires")
          next("/login/?from=/create-crime");
        }else{
          next();
        }
      }
    },

    {
      path: "/edit/:crimeId",
      name: "Edit",
      component: LogCrime,
      beforeEnter : (to, from, next)=>{
        var nowTime = Date.now();
       if(!localStorage.token){
          next("/login/?from=/create-crime");
        }else if(localStorage.tokenExpires < nowTime){
          localStorage.removeItem("token");
          localStorage.removeItem("authUser")
          localStorage.removeItem("tokenExpires")
          next("/login/?from=/create-crime");
        }else{
          next();
        }
      }
    },

    {
      path: "/delete/:crimeId",
      name: "Edit",
      component: DeleteCrime,
      beforeEnter : (to, from, next)=>{
        var nowTime = Date.now();
       if(!localStorage.token){
          next("/login/?from=/create-crime");
        }else if(localStorage.tokenExpires < nowTime){
          localStorage.removeItem("token");
          localStorage.removeItem("authUser")
          localStorage.removeItem("tokenExpires")
          next("/login/?from=/create-crime");
        }else{
          next();
        }
      }
    },
  ]
})

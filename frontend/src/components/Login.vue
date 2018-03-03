<template>
  <div class="container">
    <navbar></navbar>
  <div class="register-form col-md-6 items-center">
    <img src="../assets/img/logo.png" class="logoimg mb-4">
    <form enctype="application/json; charset=utf-8" @submit.prevent>
    <div >
      <div class="alert alert-success" role="alert" v-show="isAuthenticated">
      {{message}}
      </div>

      <div class="alert alert-danger" role="alert" v-show="isError">
      {{message}}
      </div>
    </div>

  <div class="form-group">
    <label for="email">Email address</label>
    <input type="email" class="form-control" id="email" v-model="user.email" placeholder="Enter email" required="true" autofocus="true">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" v-model="user.password" id="password" placeholder="Password" required="true">
  </div>



  <button type="submit" class="btn btn-lg btn-primary btn-block" @click.prevent="loginUser">Sign in</button>
</form>
<router-link to="/register" class="float-left">Sign up</router-link>
<router-link to="/forget-password" class="float-right">Forgot Password</router-link>
  </div>

  </div>
</template>

<script>
import Navbar from "./Nav";
const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';

export default {
  name: 'Login',
  components : {
    Navbar
  },
  data () {
    return {
      user : {
        email : '',
        password : ''
      },
      isAuthenticated : false,
      message : '',
      isError : false,
      logoSrc : '',
      from : null
    }
  },

  methods : {
    setFrom : (from)=>{
      this.from = from
     
    },
    loginUser : function(){
      localStorage.removeItem("Authorization");
     
      this.isAuthenticated = this.isError = false;
      var loginUrl = SETTINGS.BASE_URL + "user/login/"
      axios.post(loginUrl, this.user)
      .then(result=>{
       
        if(result.data.success){
         var tokenExpires = Date.now() + 10800000;
        var token = "Bearer " + result.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem('authUser', JSON.stringify(result.data.user));
        localStorage.setItem('tokenExpires', tokenExpires);
        
       
          this.isAuthenticated = true;
          this.message = result.data.message
    
          setTimeout(()=>{
           if(this.from === null){
          this.$router.push({path : "/"})
           }else{
             this.$router.push({path : this.from})
           }
          }
         , 3000)
        }else{
          this.isError = true;
          this.message = result.data.message;
        }
      })
    },
   
  },

  watch: {
      '$route.query.from' (to, from){
      alert("from", from)
    }
  },
    beforeRouteEnter(to, from, next){
      next(vm=>{
        vm.setFrom(from);
      });
    }
  

 
  
}
</script>


<style scoped>
.register-form{
  width: 100%;
  max-width: 420px;
  margin: 2rem auto;
}

.logoimg{
 
  max-width: 72px;
  max-height: 72px;
  margin: 0 auto;
}

</style>

<template>
  <div class="container">
    <navbar></navbar>
  <div class="register-form col-md-6 align-items-center">
    <form enctype="application/json; charset=utf-8" @submit.prevent>
    <div >
      <div class="alert alert-success" role="alert" v-show="compareSuccess == success == true">
      {{message}}
      </div>

      <div class="alert alert-success" role="alert" v-show="compareSuccess == success==false">
      {{message}}
      </div>
    </div>
<div v-show="compareSuccess">
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password" v-model="user.password">
  </div>

  <div class="form-group">
    <label for="confirm-password">Confirm Password</label>
    <input type="password" class="form-control" id="confirm-password" v-model="confirmPassword">
  </div>


  <button type="submit" class="btn btn-primary" @click.prevent="resetPassword">Reset Password</button>
</div>
 
 <div v-show="compareSuccess == false">
  <router-link to="/forget-password">Try again</router-link>
</div>

</form>

  </div>

  </div>
</template>

<script>
import Navbar from "./Nav";
const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';

export default {
  name: 'ResetPassword',
  components : {
    Navbar
  },
  data () {
    return {
      user : {
        password : ''
      },
      success : false,
      compareSuccess : false,
      message : '',
      userId : '',
      code : '',
      confirmPassword : ''
      

    }
  },

 

  methods : {
    resetPassword : function(){
      this.success = false;
     if(this.user.password != '' && this.user.password === this.confirmPassword){
       var resetPasswordUrl = SETTINGS.BASE_URL + "user/forget/" + this.userId;
      axios.post(resetPasswordUrl, this.user)
      .then(result=>{
       
        if(result.data.success){
          this.success =  true;
         this.message = result.data.message;
         setTimeout(()=>{
           
           this.$router.push({path : "/login"}
           
           )}
         , 3000)
        }
      })
     }else{
       this.success =  false;
       this.message = "Your password and the confirmation are not the same. Try again!"
     }
      
      
    },

    compareCode : function(){
      this.code = this.$router.currentRoute.params.codeId;
      this.userId = this.$router.currentRoute.params.userId;
      
      var resetPasswordUrl = SETTINGS.BASE_URL + "user/forget/" + this.userId + "/" + this.code;
      axios.get(resetPasswordUrl)
      .then(result=>{
        if(result.data.success){
          if(this.userId === result.data.userId){
            this.compareSuccess= true;
          this.message = result.data.message
          }else{
            this.compareSuccess = false;
            this.message = "The reset token has expired or it is invalid. Try to reset your password again";
          }
          
        }else{
          this.compareSuccess = false;
          this.message = result.data.message
        }
        
        this
      })
      
    }
  },

  mounted : function(){
    this.compareCode();
  }
}
</script>


<style scoped>

</style>

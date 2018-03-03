<template>
  <div class="container">
    <navbar></navbar>
  <div class="register-form col-md-6 align-items-center">
    <form enctype="application/json; charset=utf-8" @submit.prevent>
    <div >
      <div class="alert alert-success" role="alert" v-show="success">
      {{message}}
      </div>
    </div>

  <div class="form-group">
    <label for="email">Email address</label>
    <input type="email" class="form-control" id="email" v-model="user.email" aria-describedby="emailHelp" placeholder="Enter email">
    
  </div>
 


  <button type="submit" class="btn btn-primary" @click.prevent="resetPassword">Reset Password</button>
</form>

  </div>

  </div>
</template>

<script>
import Navbar from "./Nav";
const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';

export default {
  name: 'ForgetPassword',
  components : {
    Navbar
  },
  data () {
    return {
      user : {
        email : '',
      },
      success : false,
      message : '',
     
      

    }
  },

  methods : {
    resetPassword : function(){
     
      this.success = false;
      var resetPasswordUrl = SETTINGS.BASE_URL + "user/forget/"
      axios.post(resetPasswordUrl, this.user)
      .then(result=>{
       
        if(result.data.success){
         this.message = result.data.message;
        }
      })
    }
  }
}
</script>


<style scoped>

</style>

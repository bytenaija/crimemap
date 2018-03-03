<template>

  <div class="container">
    <navbar></navbar>
  <div class="register-form col-md-8">
    <img src="../assets/img/logo.png" class="logoimg mb-4">
    <form enctype="application/json; charset=utf-8" @submit.prevent>
     <div >
      <div class="alert alert-success" role="alert" v-show="isSuccess">
      {{message}}
      </div>

      <div class="alert alert-danger" role="alert" v-show="isError">
      {{message}}
      </div>
    </div>
  <div class="form-group">
    <label for="firstname">Firstname</label>
    <input type="text" class="form-control" id="firstname" v-model="user.firstname" placeholder="Enter your firstname">
  </div>

   <div class="form-group">
    <label for="lastname">Lastname</label>
    <input type="text" class="form-control" id="lastname" v-model="user.lastname" placeholder="Enter your lastname">
  </div>

   <div class="form-group">
    <label for="username">Username</label>
    <input type="text" class="form-control" id="username" v-model="user.username" placeholder="Enter your username">
  </div>
  <div class="form-group">
    <label for="email">Email address</label>
    <input type="email" class="form-control" id="email" v-model="user.email" aria-describedby="emailHelp" placeholder="Enter email">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" v-model="user.password" id="password" placeholder="Password">
  </div>

  <div class="form-group">
    <label for="avatar">Picture</label>
    <div class="row">
    <input type="file" class="form-control-file col-md-5"  name ="avatar" id="avatar" @change="avatarChanged($event.target.files)" accept="image/*" >
    <div class="col-md-4">
       <button type="submit" class="btn btn-info " @click.prevent="uploadAvatar">Upload File</button>
    </div>
  </div>
  </div>
  <div class="progressbar" v-if="uploadLoaded > 0">
  <div class="fileUploadProgressBarGray">
    
    <div class="text-center fileUploadProgressBarGreen" :style="{width : uploadedCompletion  + '%'}">
       {{uploadedCompletion}}%
     </div>
  </div>
  </div>
  <button type="submit" class="btn btn-lg btn-primary btn-block" @click.prevent="registerUser">Submit</button>
</form>
  </div>
  
  </div>
</template>

<script>
import Navbar from "./Nav";
  const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';


export default {
  name: 'Register',
   components : {
    Navbar
  },
  data () {
    return {
      user : {
        email : '',
        password : '',
        firstname : '',
        lastname : '',
        username : '',
        avatar : '',
      },
      formData :  null,
      imgSrc : SETTINGS.BASE_URL + "user/avatar/",
      uploadLoaded : 0,
      uploadTotal : 0,
      message : '',
      isError : false,
      isSuccess : false

    }
  },

  methods:  {
    avatarChanged: function(file){
      this.formData = new FormData();
      this.formData.append("avatar", file[0], file[0].name)
    },

    uploadAvatar: function(){
    const urlAvatar = SETTINGS.BASE_URL + 'user/avatar/upload/';
    let data = this.formData;
    axios.post(urlAvatar, data, {
      headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (uploadEvent =>{
            this.uploadLoaded = uploadEvent.loaded;
            this.uploadTotal = uploadEvent.total;
        })
        })
        .then(result=>{
         this.user.avatar = result.data.file;
         
        })
    },

    registerUser: function(){
      const urlRegister = SETTINGS.BASE_URL +  'user/register/';
     
      axios.post(urlRegister, this.user)
        .then(result=>{
          if(result.data.success){
            this.isSuccess = true;
            this.isError = false;
              this.message = result.data.message

               setTimeout(()=>{
           
          this.$router.push({path : "/"})
          
          }
         , 2000)
          }else{
            
            this.isError = true;
            this.message = result.data.message;            
          }
          
        });
    },

    },

    computed : {
      uploadedCompletion : function(){
        if(this.uploadTotal < 1){
          return 0;
        }else{
        return Math.round(this.uploadLoaded / this.uploadTotal * 100);
        }
      }
    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  min-width: 100% !important;
  margin: 0;
  padding: 0;
}
.register-form{
  width: 100%;
  max-width: 840px;
  margin: 2rem auto;
}

.logoimg{
 
  max-width: 72px;
  max-height: 72px;
  margin: 0 auto;
}

.fileUploadProgressBarGreen{
  height: 2rem;
  background-color: green;
  
}

.fileUploadProgressBarGray{
  height: 2rem;
  background-color: grey;
  width: 100%;
}
.progressbar{
  margin-bottom: 1rem;
}
</style>

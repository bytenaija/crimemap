<template>
  <div class="container">
    <navbar></navbar>
  <sidebar></sidebar>

  <div class="jumbotron row">
    <div class="col-md-9">
  <h1 class="display-1">{{crime.title}}</h1>
  <hr class="col-md-12">
  <p class="lead"><span v-show="crime.address"><strong>address: {{crime.address}}, </strong></span><strong> town: {{crime.town}}, state: {{crime.state}}, country: {{crime.country}}</strong></p>
  <p class="lead italics" v-show="crime.latitude">Latitude: {{crime.latitude}}, Longitude: {{crime.longitude}}</p>
  <p class="lead">
  <hr class="my-4">
  <p v-html="crime.details"></p>
  
  <p class="lead edit">
    <hr>
    <span v-show="crime.posted_by === JSON.parse(localStorage.authUser).userId">
         <router-link :to="'/edit/' + crime._id"  class="btn btn-primary">Edit Crime</router-link>
         <router-link :to="'/delete/' + crime._id"  class="btn btn-danger">Delete Crime</router-link>
    </span>
  </p>
  </div>

  <div class="col-md-2 user float-right">
    <p class="lead">Reported by</p>
    <hr>
    <div v-if="crime.posted_by !== JSON.parse(localStorage.authUser).userId">
    <img :src="avatarSrc" class="avatar">
    <div class="userDetails">
      <p><strong>Username : </strong> {{user.username}}</p>
    </div>
    </div>
    <div v-else>
      <h4>You</h4>
    </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import Navbar from "./Nav";
import Sidebar from "./Sidebar";
const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';

export default {
  name: 'ViewCrime',
  components : {
    Navbar,
    Sidebar
  },
  data () {
    return {
      crime : null,
      avatarSrc : '',
      user : null,
       localStorage : localStorage
    }
  },

  methods : {
    getCrime : function(){
      try{
      var crimeId = this.$router.currentRoute.params.crimeId;
      var crimeUrl = SETTINGS.BASE_URL + "crime/" + crimeId;
      axios.get(crimeUrl, {
        headers : {
          "Authorization" : localStorage.token
        }
      })
      .then(result=>{
       if(result.status === 403){
        
       }
        if(result.data.success){
         this.crime = result.data.crime
         this.user = result.data.user
         this.avatarSrc = SETTINGS.BASE_URL + "user/avatar/" + this.user.userId;
    }else{
      
    }
  });
    }catch(err){
      
    }
    }
  },

  mounted : function(){
    this.getCrime();
  }
}
</script>


<style scoped>
.jumbotron{
  padding: 2rem 1rem 4rem 5rem;
  font-size: 1.2rem;
}

.avatar{
  width: 10rem;
  height: 10rem;
  box-shadow: 0em 0em 1rem black;
}

.user{
  margin-top: 7rem;
  border-left: .1rem dotted gray;
}

.edit{
  margin-top : 5rem;
}

@media only screen and (max-width: 600px) {
  .jumbotron{
  padding: 0 1rem;
  
}
}
</style>

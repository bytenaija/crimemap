<template>
  <div class="container">
    <navbar></navbar>

<div >
      <div class="alert alert-success" role="alert" v-show="isSuccess">
      {{message}}
      </div>

      <div class="alert alert-danger" role="alert" v-show="isError">
      {{message}}
      </div>
    </div>

  
  </div>
</template>

<script>
import Navbar from "./Nav";
const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';

export default {
  name: 'DeleteCrime',
  components : {
    Navbar,
  
  },
  data () {
    return {
     isSuccess : false,
     isError : false,
     message :'',
    }
  },

  mounted : function(){
    var crimeId = this.$router.currentRoute.params.crimeId;
    if(crimeId){
        var crimeUrl = SETTINGS.BASE_URL + "crime/" + crimeId;
      axios.delete(crimeUrl, {
        headers : {
          "Authorization" : localStorage.token
        }
      })
      .then(result=>{
       
        if(result.data.success){
           this.isSuccess = true;
           this.message = result.data.message;
           setTimeout(()=>{
           
          this.$router.push({path : "/"})
          
          }
         , 2000)
       }else{
         this.isError = true;
         this.message = result.data.message;
       }
 
       })
  }
     
}
}
</script>


<style scoped>
.alert{
  margin: 10rem auto;
  width: 30%;
}
</style>

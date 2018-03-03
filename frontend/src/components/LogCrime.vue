<template>

  <div class="container">
    <navbar></navbar>
  <div class="register-form col-md-8">
    <img src="../assets/img/logo.png" class="logoimg mb-4">
    <div >
      <div class="alert alert-success" role="alert" v-show="isSuccess">
      {{message}}
      </div>

      <div class="alert alert-danger" role="alert" v-show="isError" v-html="message">
      
      </div>
    </div>
    <form enctype="application/json; charset=utf-8" @submit.prevent>
  <div class="form-group">
    <label for="title">Title</label>
    <input type="text" class="form-control" ref="title" id="title" v-model="crime.title" placeholder="Enter a title for the crime">
  </div>
  <div class="form-group">
    <label for="country">Crime Type</label>
    <select class="form-control" id="type" ref="type" @change="typeChanged" v-model="crime.type">
      <option>Select the type</option>
      <option v-for="(type, index) in types" :key="index">{{type}}</option>
    </select>
  </div>
     <div class="form-group">
    <label for="date">Date</label>
    <input type="text" class="form-control" id="date" ref="date" v-model="crime.date" placeholder="dd/mm/yyyy.">
  </div>
   <div class="form-group">
    <label for="country">Country</label>
    <select class="form-control" id="country" ref="country" @change="countryChanged" v-model="crime.country">
      <option>Select the country</option>
      <option v-for="(country, index) in countries" :key="index">{{country.name.common}}</option>
    </select>
  </div>

  <div class="form-group">
    <label for="address">Address (Type the address and select the closest area displayed)</label>
    <input type="text" class="form-control" ref="autocomplete" id="address"  v-model ="crime.address" placeholder="Enter the street where the crime took place.">
  </div>
  <div class="form-group">
    <label for="address">Town/City/Province (Check if this is correct)</label>
    <input type="text" class="form-control" id="town" ref="town" v-model="crime.town" placeholder="Enter the town or county or city where the crime took place.">
  </div>
  <div class="form-group">
    <label for="state">State (Check if this is correct)</label>
    <input type="text" class="form-control" id="state" v-model="crime.state" ref="state" placeholder="Enter the full name of the state where the crime took place.">
  </div>

   <div class="form-group">
    <label for="latitude">Latitude</label>
    <input type="text" class="form-control" id="latitude" ref="latitude" v-model="crime.latitude" placeholder="Latitude" disabled>
  </div>
   <div class="form-group">
    <label for="longitude">Longitude</label>
    <input type="text" class="form-control" id="longitude" ref="longitude" v-model="crime.longitude" placeholder="Longitude" disabled>
  </div>



  <div class="form-group">
    <label for="details">Details of Crime</label>
    <textarea type="text" class="form-control" id="details" ref="details" v-model="crime.details" rows="8" placeholder="Enter the details of the crime took place."></textarea>
  </div>

  <button type="submit" class="btn btn-lg btn-primary btn-block" @click.prevent="editCrime" v-if="this.isEdit">Edit Crime</button>
     
  <button type="submit" class="btn btn-lg btn-primary btn-block" @click.prevent="logCrime" v-else>Log Crime</button>
</form>
  </div>
  
  </div>
</template>

<script>
import Navbar from "./Nav";
  const countryList = require ("../service/countries.json");
  const typeList = require ("../service/types.json");
  const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';



export default {
  name: 'LogCrime',
   components : {
    Navbar
  },
  data () {
    return {
      isEdit : false,
      crime : {
        title : '',
        details : '',
        type : '',
        date : '',
        address : '',
        longitude : '',
        latitude : '',
        state : '',
        country : '',
        posted_by : '',
        town: '',
        autocomplete : null,
        country_short_name : ''

      },
     countries : countryList,
     isSuccess : false,
     isError : false,
     message :'',
    types : typeList

    }
  },

  methods:  {
    getAutoComplete : function(constraint){
    var input = this.$refs.autocomplete;
 
   
     
  
      
    

  
  var options = {
    types: ["geocode"],
      componentRestrictions: {country: [constraint]}
    };

    this.autocomplete = new google.maps.places.Autocomplete(input, options);
    var self = this;
    this.autocomplete.addListener('place_changed', function () {
     var place = self.autocomplete.getPlace();
     
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
       
          // If the place has a geometry, then present it on a map.
          if (place.geometry) {
            self.crime.latitude = place.geometry.location.lat();
            self.crime.longitude = place.geometry.location.lng();
          }
          
          self.crime.address = place.address_components[0].long_name;
          self.crime.town =  place.address_components[1].long_name;
          self.crime.state = place.address_components[3].long_name;
         
    })
    },
    nl2br : function(str) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag =  '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
},
    ucwords: function (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
    },
    countryChanged: function(){
     this.crime.country = event.target.value
      
      var filteredCountry =  countryList.filter(country =>{
       return (country.name.common.toUpperCase() === this.crime.country.toUpperCase());
       
      })

      this.country_short_name = filteredCountry[0].cca2;

     this.getAutoComplete(this.country_short_name);
      
    },

    typeChanged: function(){
     this.crime.type = event.target.value    
      event.target.classList.remove("error")
    },
    
    validate : function(){
      const title =  this.$refs.title;
      const details =  this.$refs.details;
      const  type =  this.$refs.type;
       const  date =  this.$refs.date;
       const  address =  this.$refs.autocomplete;
       const  longitude =  this.$refs.longitude;
       const  latitude =  this.$refs.latitude;
      const   state =  this.$refs.state;
      const   country =  this.$refs.country;
       const  town=  this.$refs.town;
       var validationErrors = false;

         var errorMessageTitle = "";
          var errorMessageDetails = "";
           var errorMessageType = "";
            var errorMessageDate = "";
             var errorMessageAddress = "";
              var errorMessageLongitude = "";
               var errorMessageLatitude = "";
                var errorMessageState = "";
                 var errorMessageCountry = "";
                  var errorMessageTown = "";

        if(title.value.length < 5){
         errorMessageTitle = "<li>Title should not be less than five characters!</li>"
          validationErrors = true;
          this.message += errorMessageTitle;
          title.classList += " error";
          }else{
            this.message = this.message.slice(this.message.indexOf(errorMessageTitle), errorMessageTitle.length);
          title.classList.remove("error");
        }

        if(type.value === "Select the type"){
          errorMessageType = "<li> Select crime type from the list!  </li>";
          validationErrors = true;
          this.message += errorMessageType
          type.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageType), errorMessageType.length);
          type.classList.remove("error");
        }

        if(date.value === ''){
          errorMessageDate ="<li> The date the crime occured must be entered!  </li>";
          validationErrors = true;
          this.message += errorMessageDate
          date.classList += " error";
       
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageDate), errorMessageDate.length);
          date.classList.remove("error");
        }
        

        if(country.value === "Select the country"){
          errorMessageCountry = "<li> Select the country from the list!  </li>";
          validationErrors = true;
          this.message += errorMessageCountry
          country.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageCountry), errorMessageCountry.length);
          country.classList.remove("error");
        }

         if(address.value === ""){
           errorMessageAddress ="<li> Enter the address and select from the list!  </li>";
          validationErrors = true;
          this.message += errorMessageAddress
          address.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageAddress), errorMessageAddress.length);
          address.classList.remove("error");
        }

        if(town.value === ""){
          errorMessageTown ="<li> Enter the correct locality/province/city/town!  </li>";
          validationErrors = true;
          this.message += errorMessageTown
          town.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageTown), errorMessageTown.length);
          town.classList.remove("error");
        }
     

      if(state.value === ""){
        errorMessageState = "<li> Enter the correct state/region!  </li>";
          validationErrors = true;
          this.message +=errorMessageState
          state.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageState), errorMessageState.length);
          state.classList.remove("error");
        }

        if(latitude.value === ""){
          errorMessageLatitude = "<li> Ensure you select the right address for the latitude to be captured!  </li>";
          validationErrors = true;
          this.message += errorMessageLatitude
          latitude.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageLatitude), errorMessageLatitude.length);
          latitude.classList.remove("error");
        }

        if(longitude.value === ""){
          errorMessageLongitude = "<li> Ensure you select the right address for the longitude to be captured!  </li>";
          validationErrors = true;
          this.message += errorMessageLongitude
          longitude.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageLongitude), errorMessageLongitude.length);
          longitude.classList.remove("error");
        }

        if(details.value === ""){
          errorMessageDetails = "<li> Kindly enter details of the crime for your fellow users!  </li>";
          validationErrors = true;
          this.message += errorMessageDetails
          details.classList += " error";
        }else{
          this.message = this.message.slice(this.message.indexOf(errorMessageDetails), errorMessageDetails.length);
          details.classList.remove("error");
        }
     
        if(validationErrors){
          this.isError = true
          return 0
        }else{
          this.isError = false;
          return 1
        }
    },

    logCrime: function(){
      if(this.validate()){
      const crimeUrl = SETTINGS.BASE_URL +  'crimes/';
          this.crime.address = this.ucwords(this.crime.address);
          this.crime.title = this.ucwords(this.crime.title);
          this.crime.type = this.ucwords(this.crime.type);
          this.crime.details = this.nl2br(this.crime.details);
         
      axios.post(crimeUrl, this.crime, {
        headers : {
          "Authorization" : localStorage.token
        }
      })
        .then(result=>{
            if(result.data.success){
            this.isSuccess = true;
            this.isError = false;
              this.message = result.data.message
              var self = this;
              setTimeout(function(){
                  self.$router.push({path : '/'});
              }, 2000)
          }else{
            
            this.isError = true;
            this.message = result.data.message;            
          }
          
        });
      }
    },



editCrime: function(){
      if(this.validate()){
      const crimeUrl = SETTINGS.BASE_URL +  'crime/' + this.$router.currentRoute.params.crimeId;
          this.crime.address = this.ucwords(this.crime.address);
          this.crime.title = this.ucwords(this.crime.title);
          this.crime.type = this.ucwords(this.crime.type);
          this.crime.details = this.nl2br(this.crime.details);
          
      axios.put(crimeUrl, this.crime, {
        headers : {
          "Authorization" : localStorage.token
        }
      })
        .then(result=>{
            if(result.data.success){
            this.isSuccess = true;
            this.isError = false;
              this.message = result.data.message
              var self = this;
              setTimeout(function(){
                  self.$router.push({path : '/'});
              }, 2000)
          }else{
            
            this.isError = true;
            this.message = result.data.message;            
          }
          
        });
      }
    },
  getCrime : function(crimeId){
  
      var crimeUrl = SETTINGS.BASE_URL + "crime/" + crimeId;
      axios.get(crimeUrl, {
        headers : {
          "Authorization" : localStorage.token
        }
      })
      .then(result=>{
       
        if(result.data.success){
            this.crime = result.data.crime
            var filteredCountry =  this.countries.filter(country =>{
       return (country.name.common.toUpperCase() === this.crime.country.toUpperCase());
       
      })

    this.country_short_name = filteredCountry[0].cca2;

     this.getAutoComplete(this.country_short_name);
        }
      });
      
     }
    },
    mounted : function(){
      this.crime.posted_by = JSON.parse(localStorage.authUser).userId;
      this.countries = this.countries.sort(function(countryA, countryB){
        return countryA.name.common.toUpperCase().localeCompare(countryB.name.common.toUpperCase());
      });

      this.types = this.types.sort(function(typeA, typeB){
        return typeA.toUpperCase().localeCompare(typeB.toUpperCase());
      });
    
    
    $(function() {              
           // Bootstrap DateTimePicker v4
           $('#date').datepicker({
                 dateFormat: 'dd/mm/yy',
                 maxDate: new Date
           });
        }); 
    
   
       if(this.$router.currentRoute.params.crimeId){
         this.isEdit = true;
         this.getCrime(this.$router.currentRoute.params.crimeId);
        
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

.error{
  border: .1rem solid red;
  color : red;
  box-shadow: 0 0 3px red;
}


</style>

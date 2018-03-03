<template>
  <div class="container">
    <navbar></navbar>
 
  <div >
  <div class="filter row">
    <div class="form-group  col-md-3">
      <label for="country">Country</label>
    <b-form-select @change="countryChanged" class="mb-3" v-model="country" v-show="countryNames"> 
      <template slot="first">
        <!-- this slot appears above the options from 'options' prop -->
        <option :value="null" disabled>-- Please select an option --</option>
      </template>
      <option>All</option>
      <option v-for="(country, index) in countryNames" :key="index">{{country}}</option>
    </b-form-select>
    </div>
    <div class="form-group  col-md-3" v-if="this.country !== 'All'">
      <label for="state">State</label>
    <b-form-select @change="stateChanged" class="mb-3"  v-model="state">
      <template slot="first">
        <!-- this slot appears above the options from 'options' prop -->
        <option :value="null" disabled>-- Please select an option --</option>
      </template> 
      <option>All</option>
       <option v-for="(state, index) in stateNames" :key="index">{{state}}</option>
    </b-form-select>
    </div>
    <div class="form-group  col-md-3"   v-if="this.state !== 'All'">
      <label for="town">Town</label>
    <b-form-select @change="selectTown" class="mb-3" v-model="this.town">
      <template slot="first">
        <!-- this slot appears above the options from 'options' prop -->
        <option :value="null" disabled>-- Please select an option --</option>
      </template> 
      <option>All</option>
       <option v-for="(town, index) in townNames" :key="index">{{town}}</option>
    </b-form-select>
    </div>

     <div class="form-group  col-md-3">
      <label for="type">Type</label>
    <b-form-select @change="selectType" class="mb-3" v-model="type"> 
      <option>All</option>
       <option v-for="(type, index) in typeNames.sort()" :key="index">{{type}}</option>
    </b-form-select>
    </div>
     
  </div>
<div class="row" style="margin: 0 auto" v-show="filteredCrimes.length">

  <div class="card" style="margin-left: 1rem; margin-top:1rem; width: 25rem;" v-for="(crime, index) in filteredCrimes" :key="index">
    <div class="card-header">
   <h2> {{crime.title}}</h2>
  </div>
  <div class="card-body">
    <h5 class="card-title">{{crime.type}}</h5>
    <hr>
    <p class="card-text">{{crime.details.substring(0, 80)}}</p>
      <hr>
    <p>
      {{crime.address}}, {{crime.town}}, {{crime.state}}
    </p>
    <p>{{crime.country}}</p>
      <hr>
      
    <router-link :to="'/get-crime/' + crime._id"  class="btn btn-primary">View Crime</router-link>
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
  name: 'ViewCrimes',
  components : {
    Navbar,
    Sidebar
  },
  data () {
    return {
      crimes : [],
      crimeState : [],
      crimeTown : [],
      crimeFilter : [],
      filteredCrimes : [],
      country: 'All',
      state : 'All',
      town : 'All',
      type : 'All',
      crimeType : [],
      countryFilter : [],
      stateBool : false,
      townBool : false     
    }
  },

  methods : {
   getCrimes : function(){
      var crimesUrl = SETTINGS.BASE_URL + "crimes/";
      axios.get(crimesUrl, { headers:
      {
       
       'Access-Control-Allow-Origin': '*'

      }
      })
      .then(result=>{
        if(result.data.success){
          if(result.data.crimes.length > 0){
          this.crimes = result.data.crimes;
         this.filterCrimes(this.country, this.state, this.town, this.type);
        }
        }
      });
    }, 
  

    countryChanged : function(country){
      this.country = this.state = this.town = this.type = "All";
      this.filteredCrimes = this.crimes;
      if(country !== 'All'){

        this.country =  country;
       this.countryFilter = this.crimeState =  this.crimes.filter(crime=>{
            return crime.country === country;
          });

        this.filterCrimes(this.country, this.state, this.town, this.type);
          
      }else{
        this.filterCrimes(this.country, this.state, this.town, this.type);
      }
    },

    stateChanged : function(state){
      this.state = this.town  = this.type =  "All";
      this.filteredCrimes = this.crimes;
      if(state !== "All"){
        this.stateBool = true;
        this.state = state;
        this.crimeTown =  this.crimeState.filter(crime=>{
          return crime.state === state;
        });
      
        this.filterCrimes(this.country, this.state, this.town, this.type);

      }else{
        this.state = state;
        this.filterCrimes(this.country, this.state, this.town, this.type);
      }

    },

    selectTown: function(town){
      this.town  = this.type =  "All";
      
      if(town !== "All"){
        this.town = town
        this.crimeFilter =  this.crimeTown.filter(crime=>{
          return crime.town === town;
        });

        this.filterCrimes(this.country, this.state, this.town, this.type);
      }else{
        this.town = town;
        this.filterCrimes(this.country, this.state, this.town, this.type);
      }
    },


    selectType: function(type){
      this.type = type;
      if(type !== "All"){
        this.type = type
      this.filterCrimes(this.country, this.state, this.town, this.type);
      }else{
        this.type = type;
        this.filterCrimes(this.country, this.state, this.town, this.type);
      }
    },

     filterCrimes : function(country, state, town, type){
       this.country = country;
       this.state = state;
       this.town = town;
       this.type = type;
      this.crimes =  this.crimes.sort(function(crimeA, crimeB){
        return crimeA.country.toUpperCase().localeCompare(crimeB.country.toUpperCase());
      });

      if(this.country === "All" && this.state === "All" && this.town === "All" && this.type === "All"){
        this.filteredCrimes = this.crimes;
      }else if(this.country !== "All" && this.state === "All" && this.town === "All" && this.type === "All"){
        this.filteredCrimes = this.crimes.filter(crime =>{
            return crime.country === this.country
        });

      }else if(this.country !== "All" && this.state !== "All" && this.town === "All" && this.type === "All"){
        this.filteredCrimes = this.crimes.filter(crime =>{
            return crime.state === this.state
        });

      }else if(this.country !== "All" && this.state !== "All" && this.town !== "All" && this.type === "All"){
        var selectedCountryCrimes = this.crimes.filter(crime =>{
            return crime.country === this.country
        });
        var selectedStateCrimes = selectedCountryCrimes.filter(crime =>{
            return crime.state === this.state
        });

  

        this.filteredCrimes = selectedStateCrimes.filter(crime =>{
            return crime.town === this.town
        });
      /* this.filteredCrimes = stateSelectedCrimes.filter(crime => {
        return crime.type === this.type
      }) */
      
      }else if(this.country === "All" && this.state === "All" && this.town === "All" && this.type !== "All"){
        
          this.filteredCrimes = this.crimes.filter((crime) => crime.type === this.type);

        }else if(this.country !== "All" && this.state === "All" && this.town === "All" && this.type !== "All"){
        this.filteredCrimes = this.crimes.filter((crime) => crime.country === this.country);

        this.filteredCrimes = this.filteredCrimes.filter((crime) => crime.type === this.type);
      }else if(this.country !== "All" && this.state !== "All" && this.town === "All" && this.type !== "All"){
        this.filteredCrimes = this.crimes.filter((crime) =>crime.state === this.state);

        this.filteredCrimes = this.filteredCrimes.filter((crime) => crime.type === this.type);
      }else if(this.country !== "All" && this.state !== "All" && this.town !== "All" && this.type !== "All"){
        var crimeState = this.crimeState.filter((crime) =>crime.town === this.town);

        this.filteredCrimes = crimeState.filter((crime) => crime.type === this.type);
      }
    }
    
  },

  mounted : function(){
    this.getCrimes();
  },

   computed: {
  countryNames () {
      
   this.crimes =  this.crimes.sort(function(crimeA, crimeB){
        return crimeA.country.toUpperCase().localeCompare(crimeB.country.toUpperCase());

   });
   
    return  [...new Set(this.crimes.map(p => p.country))]
  },

   stateNames () {
      
   this.crimeState =  this.crimeState.sort(function(crimeA, crimeB){
        return crimeA.state.toUpperCase().localeCompare(crimeB.state.toUpperCase());

   });
  
    return  [...new Set(this.crimeState.map(p => p.state))]
  },

  townNames () {
      
   this.crimeTown =  this.crimeTown.sort(function(crimeA, crimeB){
        return crimeA.town.toUpperCase().localeCompare(crimeB.town.toUpperCase());

   });
   
    return  [...new Set(this.crimeTown.map(p => p.town))]
  },
  typeNames (){
     var crimes = this.crimes;
    /*  crimes.sort((crimeA, crimeB)=> {
       crimeA = crimeA.type.toUpperCase(); 
       crimeB = crimeB.type.toUpperCase()
       if(crimeA < crimeB) {return -1;}
       if(crimeA > crimeB) {return 1;}
       return 0;
    }) */
    if(this.country === "All"){
   
    return  [...new Set(crimes.map(p => p.type))]
    } else  {
      if(this.state === "All"){
          var crimes = this.filteredCrimes
          // crimes.sort((crimeA, crimeB)=> crimeA.type.toUpperCase() > crimeB.type.toUpperCase());
        return  [...new Set(crimes.map(p => p.type))]
      }else{
        if(this.town ==="All"){
          var crimes = this.crimeTown;
          return  [...new Set(crimes.map(p => p.type))]
        }else{
          var crimes = this.crimeFilter;
          return  [...new Set(crimes.map(p => p.type))]
        }
      }
    }
  }

    
   }


}
</script>


<style scoped>
.filter{
  width: 100vw;
  height: 10vh;
  background-color: rgb(7, 181, 212);
  padding: .3rem;
}

</style>

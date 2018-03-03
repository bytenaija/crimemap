<template>
<div>
  <div class="filterGroup">
  <button class="filter float-right btn btn-info" @click.prevent="openFilter">Filter Crimes</button>
  </div>
<div class="filterMap col-md-4 float-right"  v-if="filterOpen" @mouseleave="closeFilter">
<div class="row">
  <div class="col-md-12">
    Country <input type="radio" name="filter" value="country" @change="filterBy" checked>
    State <input type="radio" name="filter" value="state" @change="filterBy">
    Town <input type="radio" name="filter" value="town" @change="filterBy">

    Crime Type <input type="radio" name="filter" value="crime type" @change="filterBy">

  
  </div>
</div>
<select name="filterCountry" id="" @change="filterByCountry" v-if="filter=='country'" class="form-control">
  <option>Select a country</option>
  <option v-for="country in countryNames" :key="country">{{country}}</option>
</select>

<select name="filterCountry" id="" @change="filterByCountry" v-else-if="filter =='crime type'" class="form-control">
  <option>Select crime type</option>
  <option v-for="crimeType in crimeTypes" :key="crimeType">{{crimeType}}</option>
</select> 
<input type="input" id="searchCountry" class="form-control" @keyup="filterByCountry" :placeholder="placeholder" v-model="filterString" v-else>
  
  <button @click.prevent="clearFilter" class="btn btn-primary float-right">Clear Filter</button>
</div>


<div class="google-map" :id="mapName"></div>

</div>
</template>


<script>

const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';
export default {
  name: 'GoogleMap',
  props : ["name"],
  
  data () {
    return {
      mapName :this.name + "-map",
      bounds : null,
      markers : [],
      map : null,
      crimes : null,
      infoWindow : null,
      content : '',
      placeholder : "Filter by : ",
      filter : 'country',
      filterString : '',
      filterOpen : false,
      time : null
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
          
       
          this.initializeMap()
        }
      
        }
      });
    },

       filterBy: function(event){
         clearTimeout(this.time);
         this.placeholder = "Filter by : "
         this.placeholder += event.target.value;
         this.filter = event.target.value;
        if(this.filterString !== 'Select a country'){
          this.filterByCountry()
        }


       },
openFilter : function(){
  clearTimeout(this.time);
  this.filter = "country";
  this.filterOpen = !this.filterOpen;
},
closeFilter : function(){
  clearTimeout(this.time);
  var self = this;
  this.time = setTimeout(function(){
   
    self.filterOpen = false;
  }, 1000);
},
     filterByCountry: function(event){
       
  
        this.bounds = new google.maps.LatLngBounds();
        var zoom = 12;
       clearTimeout(this.time);
  var target = '<input type="input" id="searchCountry" placeholder="Filter by : country" class="form-control">';
  var target2 ='filterCountry';
    var crimes = null;
    var filter = '';
    if(event === undefined || event.target !== target && event.target.name !== target2){
        filter = this.filterString
    }else if(event.target.name === target2){
      if( event.target.selectedOptions[0].text ==='Select a country')
      {
        filter = ''
      }else{

        filter = event.target.selectedOptions[0].text;
      }
    }
    else{
      
      filter = event.target.value;
       
    }
   
    filter = filter.toLowerCase();
    
    if(this.filter === 'country'){
      zoom = 10;
      crimes = this.crimes.filter(crime=>{
        return crime.country.toLowerCase().indexOf(filter)>-1;
      }) 
      
    }else if(this.filter === 'state'){
      zoom = 12;
      crimes = this.crimes.filter(crime=>{
        return crime.state.toLowerCase().indexOf(filter)>-1;
      }) 

    }else if(this.filter === 'town'){
      zoom = 14;
      crimes = this.crimes.filter(crime=>{
        return crime.town.toLowerCase().indexOf(filter)>-1;
      }) 
      
    }else if(this.filter === 'crime type'){
      crimes = this.crimes.filter(crime=>{
        return crime.type.toLowerCase().indexOf(filter)>-1;
      }) 

    }else{
    crimes = this.crimes
    }
    
    this.markers.forEach(marker =>{
      marker.setMap(null);
      marker = null;
    }); 

    crimes.forEach(eachCrime=>{
      const position = new google.maps.LatLng(eachCrime.latitude, eachCrime.longitude);

      this.setMarker(eachCrime, position)
    //  this.map.setZoom(zoom);
    })




    //closing tag of filterByCountry
  },
    initializeMap : function(){
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName);
    
      var coordinates = {
        latitude : this.crimes[0].latitude,
        longitude : this.crimes[0].longitude
      }
      
      const mapCentre = coordinates;
      const options = {
        zoom : 12,
        centre : new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
      }
      this.map = new google.maps.Map(element, options);
      
      this.crimes.forEach(eachCrime => {
        
          
          const position = new google.maps.LatLng(eachCrime.latitude, eachCrime.longitude);
          this.setMarker(eachCrime, position);          
          
       
      });
      //closing tag of initialize map
    },

clearFilter : function(){
    this.filter = '';
     this.filterString = '';
    this.markers.forEach(marker =>{
      marker.setMap(this.map);
    }); 

}
,
    setMarker : function(eachCrime, position){
       const marker = new google.maps.Marker({
            position,
            map: this.map
          });
            this.markers.push(marker);
           var markers = this.markers;
         marker.addListener('click', function(){
           closeMarkers(markers);
           var aDiv = document.createElement('div');
           aDiv.innerHTML = "<h5>" + eachCrime.title + "</h5> <br>"; 
           aDiv.innerHTML += "<a href='get-crime/" + eachCrime._id + "'>View Details </a>";
             marker.infoWindow = new google.maps.InfoWindow({
            content:  aDiv
        });
        marker.infoWindow.open(marker.get('map'), marker)

        setTimeout(function(){
          closeMarkers(markers)
          }, 10000);
         });

          function closeMarkers(markers) {
                markers.forEach(marker =>{
             
                if(marker.infoWindow !== undefined){
                marker.infoWindow.close();
                }             
           })
               
       };
       this.map.fitBounds(this.bounds.extend(position))
    }
    //close of methods
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

  crimeTypes () {
    var countries =  [...(new Set(this.crimes.map(p => p.type)))];
    return countries.sort()
  }
}
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.google-map{
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  background-color: #17a2b8 !important;
}

html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
       
    }
    .filterMap{
      position: absolute;
      right: 0;
      z-index: 9999;
      border: .2rem grey solid;
      background-color: #17a2b8 !important;
      padding: .5rem;
    }

    .filterGroup{
      background-color: #17a2b8 !important;
      min-width:100%;
      height:3rem;
    }

</style>

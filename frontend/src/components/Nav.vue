<template>

<b-navbar toggleable="md" type="dark" variant="info">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand to="/"><img src="../assets/img/logo.png" class="nav-image"> Crime Map</b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">

    <b-navbar-nav>
      <b-nav-item to="/">Home</b-nav-item>
      <b-nav-item to="/create-crime">Report Crime</b-nav-item>
      <b-nav-item to="/crimes">View all Crimes</b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">


      <b-nav-item-dropdown right v-if="isAuthenticated">
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em><img :src="avatar" style="{width : 4rem !important; height:3rem;}"></em>
        </template>
         <b-dropdown-item to="/logout">Logout</b-dropdown-item>
      </b-nav-item-dropdown>

      <b-navbar-nav v-else>
      <b-nav-item to="/login">Login</b-nav-item>
      <b-nav-item to="/register">Sign up</b-nav-item>
    </b-navbar-nav>
    </b-navbar-nav>

  </b-collapse>
</b-navbar>
<!--
  <nav class="navbar sticky-top navbar-light bg-light">
  <router-link to="/"  class="navbar-brand" href="#"> <img src="../assets/img/logo.png" class="nav-image"> Crime Map</router-link>
  <button v-b-toggle.navbarNav class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <router-link to="/" class="nav-link" >Home</router-link>
      </li>
      <li class="nav-item">
       <router-link to="/create-crime" class="nav-link" >Log Crime</router-link>
      </li>
      
    </ul>

    <ul class="navbar-nav ml-auto" v-if="isAuthenticated">
      <li class="nav-item">
        <router-link to="/logout" class="nav-link" href="#">Logout</router-link>
      </li>
     
    </ul>
    <ul class="navbar-nav ml-auto" v-else>
      <li class="nav-item">
        <router-link to="/login" class="nav-link" >Login</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/register" class="nav-link" >Register</router-link>
      </li>
    </ul>
  </div>
</nav> -->
</template>

<script>
const SETTINGS = require ("../service/settings.json");
export default {
  name: 'Navbar',
  data () {
    return {

      isAuthenticated : localStorage.token ? true : false,
      avatar : ''

    }
  },

  mounted : function(){
    if(localStorage.token){
   this.avatar =  SETTINGS.BASE_URL + "user/avatar/" + JSON.parse(localStorage.authUser).userId;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-image{
  max-width: 3rem;
  max-height: 3rem;
}
</style>

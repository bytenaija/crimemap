<template>
<div>
<navbar></navbar>
<google-map name="crime"></google-map>

</div>
</template>

<script>
import Navbar from "./Nav";
import GoogleMap from "./GoogleMap";
const SETTINGS = require ("../service/settings.json");
import * as axios from 'axios';
export default {
  name: 'Home',
  components : {
    Navbar,
    GoogleMap
  },
  data () {
    return {
     
    }
  },
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

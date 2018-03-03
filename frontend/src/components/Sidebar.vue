<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar float-left">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
               
                  <h2>View Crime </h2><span class="sr-only">(current)</span>
      
              </li>
              <li class="nav-item">
                <b-nav-item to="/create-crime">Report Crime</b-nav-item>
      <b-nav-item to="/crimes">View all Crimes</b-nav-item>
              </li>
            </ul>
          </div>
        </nav>
</template>

<script>
import * as axios from 'axios';
const SETTINGS = require ("../service/settings.json");
export default {
  
  name: 'Sidebar',
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

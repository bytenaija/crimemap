<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
window.onClose = this.logout;
export default {
  name: 'App',

  methods : {
    logout : ()=>{
      localStorage.removeItem(token);
      localStorage.removeItem(authUser);
      localStorage.removeItem(expiresIn);
    }
  }

}
</script>

<style>

.container{
  min-width: 100% !important;
  min-height: 100% !important;
  margin: 0;
  padding: 0;
}

#app{
  width: 100%;
  height: 100%;
}

body{
  background-color: #f5f5f5;
}

nav{
  background-color: #f5f5f5 !important;
}


</style>

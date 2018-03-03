<template>
</template>

<script>
export default {
  name: 'Logout',
   methods : {
    logout : function(){
     localStorage.removeItem("token");
     this.$router.push({path : "/"});
    }

    
  },

  mounted : function(){
    this.logout();
  }
}
</script>


<style scoped>

</style>

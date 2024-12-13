<template>
  <v-app> 
    <NavigationBar/>
    <v-main>
      <router-view />
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script setup>
  import NavigationBar from './components/NavigationBar.vue';
  import Snackbar from './components/Snackbar.vue';
</script>

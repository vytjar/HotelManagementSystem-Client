<template>
  <v-app>
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
</script>

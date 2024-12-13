<template>
    <v-app-bar app>
        <v-btn class="ml-2" text to="/">Home</v-btn>
        <v-btn class="ml-2" text to="/hotels">Hotels</v-btn>
        <v-spacer></v-spacer>
        <v-btn text to="/login">Login</v-btn>
        <v-btn class="mr-2" text to="/register">Register</v-btn>
    </v-app-bar>
</template>

<script setup>
</script>

<style scoped>
    .v-btn {
        height: 100%;
        min-width: 100px;
    }
</style>
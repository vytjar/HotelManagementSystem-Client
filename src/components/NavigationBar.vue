<template>
    <v-app-bar app>
        <v-btn class="ml-2" text to="/">Home</v-btn>
        <v-btn class="ml-2" text to="/hotels">Hotels</v-btn>
        <v-spacer></v-spacer>
        <div v-if="isAuthenticated" style="height: 100%;">
            <v-btn @click="logOut">Log out</v-btn>
        </div>
        
        <div v-else style="height: 100%;">
            <v-btn text to="/login">Login</v-btn>
            <v-btn class="mr-2" text to="/register">Register</v-btn>
        </div>
    </v-app-bar>
</template>

<script setup>
    import { useAuth } from '@/utils/auth';

    const auth = useAuth();

    const isAuthenticated = ref(false);

    function logOut() {
        auth.logOut();
        location.reload();
    }

    onMounted(async () => {
        isAuthenticated.value = await auth.isAuthenticated();
    });
</script>

<style scoped>
    .v-btn {
        height: 100%;
        min-width: 100px;
    }
</style>
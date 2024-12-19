<template>
    <v-app-bar app>
        <NavigationButton icon="mdi-city" to="/hotels">Hotels</NavigationButton>
        
        <v-spacer></v-spacer>
        
        <div v-if="isAuthenticated" style="height: 100%;">
            <NavigationButton icon="mdi-account-multiple-outline" to="/users">Users</NavigationButton>
            <NavigationButton icon="mdi-account-outline" to="/user">Profile</NavigationButton>
            <NavigationButton icon="mdi-logout-variant" @click="logOut">Log out</NavigationButton>
        </div>

        <div v-else style="height: 100%;">
            <NavigationButton icon="mdi-login-variant" to="/login">Login</NavigationButton>
            <NavigationButton icon="mdi-account-plus-outline" to="/register">Register</NavigationButton>
        </div>
    </v-app-bar>
</template>

<script setup>
    import NavigationButton from './NavigationButton.vue';
    import { useAuth } from '@/utils/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuth();
    const router = useRouter();
    const isAuthenticated = ref(false);

    async function logOut() {
        await auth.logOut();
        
        await router.push('/');

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
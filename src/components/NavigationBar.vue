<template>
    <v-app-bar color="primary" app prominent>
        <v-app-bar-nav-icon @click="toggleDrawer" class="d-md-none"></v-app-bar-nav-icon>

        <NavigationButton
            icon="mdi-city"
            to="/hotels"
            class="d-none d-md-flex"
        >
            Hotels
        </NavigationButton>

        <v-spacer class="d-none d-md-flex"></v-spacer>

        <div v-if="isAuthenticated" class="d-none d-md-flex" style="height: 100%;">
            <NavigationButton v-if="isAdmin" icon="mdi-account-multiple-outline" to="/users">Users</NavigationButton>
            <NavigationButton icon="mdi-account-outline" to="/user">Profile</NavigationButton>
            <NavigationButton icon="mdi-logout-variant" @click="logOut">Log out</NavigationButton>
        </div>

        <div v-else class="d-none d-md-flex" style="height: 100%;">
            <NavigationButton icon="mdi-login-variant" to="/login">Login</NavigationButton>
            <NavigationButton icon="mdi-account-plus-outline" to="/register">Register</NavigationButton>
        </div>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
        <v-list>
            <v-list-item prepend-icon="mdi-email" to="/hotels" title="Hotels" />

            <template v-if="isAuthenticated">
                <v-list-item vif="isAdmin" prepend-icon="mdi-account-multiple-outline" to="/users" title="Users" />
                <v-list-item prepend-icon="mdi-account-outline" to="/user" title="Profile" />
                <v-list-item prepend-icon="mdi-logout-variant" title="Log out" @click="logOut"/>
            </template>

            <template v-else>
                <v-list-item prepend-icon="mdi-login-variant" to="/login" title="Login" />
                <v-list-item prepend-icon="mdi-account-plus-outline" to="/register" title="Register" />
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
    import NavigationButton from './NavigationButton.vue';
    import { ref } from 'vue';
    import { roles } from '@/constants/roles';
    import { useAuth } from '@/utils/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuth();
    const drawer = ref(false);
    const router = useRouter();
    const isAdmin = ref(false);
    const isAuthenticated = ref(false);

    async function logOut() {
        await auth.logOut();
        
        await router.push('/');

        location.reload();
    }

    function toggleDrawer() {
        drawer.value = !drawer.value;
    }

    onMounted(async () => {
        isAdmin.value = await auth.isInRole(roles.ADMIN);
        isAuthenticated.value = await auth.isAuthenticated();
    });
</script>

<style scoped>
    .v-navigation-drawer {
        display: inline-table;
    }
    .v-btn {
        height: 100%;
        min-width: 100px;
    }
</style>
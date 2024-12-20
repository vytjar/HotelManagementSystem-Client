<template>
    <v-container fluid>
        <v-sheet elevation="1" border rounded>
            <v-row class="ml-1 mr-1">
                <v-col cols="12" sm="6" md="3">
                    <v-text-field
                        v-model="filters.username"
                        label="Username"
                        variant="underlined"
                        @change="load"
                        @click:clear="load"
                        clearable
                    />
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                    <v-text-field
                        v-model="filters.email"
                        label="Email"
                        variant="underlined"
                        @change="load"
                        @click:clear="load"
                        clearable
                    />
                </v-col>

                <v-col cols="12" sm="6" md="3">
                    <v-text-field
                        v-model="filters.name"
                        label="Name"
                        variant="underlined"
                        @input="load"
                        @click:clear="load"
                        clearable
                    />
                </v-col>

                <v-col cols="12" sm="6" md="3">
                    <v-text-field
                        v-model="filters.surname"
                        label="Surname"
                        variant="underlined"
                        @input="load"
                        @click:clear="load"
                        clearable
                    />
                </v-col>
            </v-row>

            <v-data-table
                :headers="headers"
                :items="users"
                :loading="loading"
                class="pa-4"
                elevation="10"
            >
                <template v-slot:item="{ item }">
                    <tr @click="openUserInfo(item)" class="cursor-pointer">
                        <td>{{ item.username }}</td>
                        <td>{{ item.email }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.surname }}</td>
                        <td>
                            <v-chip v-for="role in item.roles" :key="role">{{ role }}</v-chip>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-sheet>
    </v-container>
</template>

<script setup>
    import { apiRequest } from '@/utils/api';
    import { ref } from 'vue';
    import { showError } from '@/utils/snackbar';
    import { useAuth } from '@/utils/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuth();
    const router = useRouter();

    const requestsPending = ref(0);
    const users = ref([]);

    const filters = ref({
        email: '',
        name: '',
        surname: '',
        username: ''
    });

    const headers = ref([
      { title: 'Username', value: 'username' },
      { title: 'Email', value: 'email' },
      { title: 'Name', value: 'name' },
      { title: 'Surname', value: 'surname' },
      { title: 'Roles', value: 'roles' },
    ]);

    const loading = computed(() => requestsPending > 0);

    load();

    function openUserInfo(user) {
        if (user && user.id) {
            router.push(`/users/${user.id}`);
        }
    }

    async function load() {
        try {
            users.value = await apiRequest({
                path: `/users/filter`,
                method: 'POST',
                data: {
                    email: filters.value.email,
                    name: filters.value.name,
                    surname: filters.value.surname,
                    username: filters.value.username
                },
                token: await auth.getToken()
            });
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not load users: ${e.respone.data}`);
            } else {
                showError('Could not load users.');
            }
        }
    }
</script>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
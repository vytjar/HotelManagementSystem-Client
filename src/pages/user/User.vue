<template>
    <v-container v-if="!loading" fluid>
        <v-sheet class="pa-4 ma-4" rounded>
            <v-row class="ma-4 d-flex justify-space-between align-center">
                <v-col cols="auto">
                    <h2 class="text-h5 mb-0">User information</h2>
                </v-col>

                <v-col cols="auto" class="d-flex">
                    <template v-if="userId">
                        <v-btn
                            v-if="editing"
                            color="primary"
                            outlined
                            class="mr-2"
                            @click="updateRoles"
                        >
                            Update
                        </v-btn>

                        <v-btn
                            v-if="editing"
                            color="secondary"
                            outlined
                            @click="cancelEdit"
                        >
                            Cancel
                        </v-btn>

                        <v-btn
                            v-else
                            color="primary"
                            outlined
                            @click="editing = !editing"
                        >
                            Edit
                        </v-btn>
                    </template>
                </v-col>
            </v-row>

            <v-row class="ma-4">
                <v-col cols="12" md="6">
                    <div class="info-section">
                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold mr-2">Username:</span>
                            <span class="value">{{ user.username }}</span>
                        </div>

                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold mr-2">Name:</span>
                            <span class="value">{{ user.name }}</span>
                        </div>

                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold mr-2">Surname:</span>
                            <span class="value">{{ user.surname }}</span>
                        </div>

                        <div class="info-item d-flex">
                            <span class="label font-weight-bold mr-2">Email:</span>
                            <span class="value">{{ user.email }}</span>
                        </div>
                    </div>
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    class="d-flex align-center justify-center"
                >
                    <v-select
                        v-if="userId"
                        v-model="selectedRoles"
                        :items="Object.values(roles)"
                        class="roles-dropdown"
                        label="Roles"
                        variant="underlined"
                        chips
                        clearable
                        dense
                        multiple
                        outlined
                        :disabled="!editing"
                    />
                </v-col>
            </v-row>
        </v-sheet>

        <v-sheet class="pa-4 ma-4" rounded="">
            <v-row>
                <v-col cols="12" class="ml-6 mt-4">
                    <h2 class="text-h5 mb-4">User Reservations</h2>
                </v-col>

                <v-col cols="12"
                    v-for="reservation in user.reservations"
                    :key="reservation.id"
                >
                    <v-card outlined class="mb-4">
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="8">
                                    <h3 class="text-h6">{{ reservation.room?.hotel?.name || 'Unknown Hotel' }}</h3>

                                    <p>
                                        {{ formatDate(reservation.checkInDate) }} – {{ formatDate(reservation.checkOutDate) }}
                                    </p>

                                    <p>Room: {{ reservation.room?.roomNumber || 'N/A' }}</p>
                                    <p>Guests: {{ reservation.guestCount }}</p>
                                </v-col>
                                
                                <v-col
                                    class="d-flex align-center justify-end" cols="12" md="4"
                                >
                                    <!-- add actions or something like that?-->
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>
    </v-container>

    <v-overlay
        :model-value="loading"
        class="loading-overlay d-flex align-center justify-center"
        persistent
    >
        <v-progress-circular
            indeterminate
            size="70"
            color="primary"
        />
    </v-overlay>
</template>

<script setup>
    import { apiRequest } from '@/utils/api';
    import { computed } from 'vue';
    import { roles } from '@/constants/roles';
    import { showError } from '@/utils/snackbar';
    import { useAuth } from '@/utils/auth';
    import { useRoute } from 'vue-router';

    const auth = useAuth();
    const route = useRoute();
    const userId = route.params.userId;

    const editing = ref(false);
    const user = ref({});
    const requestsPending = ref(0);
    const selectedRoles = ref([]);

    const loading = computed(() => requestsPending.value > 0);

    loadUser();

    function cancelEdit() {
        editing.value = false;

        selectedRoles.value = user.value.roles;
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    async function loadUser() {
        try {
            requestsPending.value++;
            
            user.value = await apiRequest({
                path: userId ? `/users/${userId}` : '/users',
                method: 'GET',
                token: await auth.getToken()
            });

            if (user.value.reservations) {
                user.value.reservations.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
            }

            selectedRoles.value = user.value.roles;

        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not load user information: ${e.respone.data}`);
            } else {
                showError('Could not load user information.');
            }
        } finally {
            requestsPending.value--;
        }
    }

    async function updateRoles() {
        try {
            requestsPending.value++;
            
            await apiRequest({
                path: '/users/assignRoles',
                method: 'POST',
                data: {
                    roles: selectedRoles.value,
                    userName: user.value.username
                },
                token: await auth.getToken()
            });

            user.value.roles = selectedRoles.value;
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not update user roles: ${e.respone.data}`);
            } else {
                showError('Could not update user roles.');
            }
        } finally {
            editing.value = false;
            requestsPending.value--;
        }
    }
</script>

<style scoped>
    .info-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .info-item {
        font-size: 18px;
        display: flex;
        justify-content: space-between;
    }

    .label {
        font-weight: bold;
        min-width: 100px;
    }

    .roles-dropdown {
        width: 100%;
        max-width: 300px;
    }

    .v-card {
        padding: 16px;
    }

    .v-card-title {
        font-size: 18px;
        font-weight: bold;
    }
</style>


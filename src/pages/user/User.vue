<template>
    <v-dialog
        v-model="dialogCancelation.visible"
        max-width="400px"
    >
        <v-card v-if="dialogCancelation.reservation" rounded>
            <v-card-title class="headline">
                Reservation cancelation.
            </v-card-title>

            <v-card-text v-if="dialogCancelation.reservation">
                <p>Are you sure you want to cancel the reservation at '{{ dialogCancelation.reservation.room?.hotel?.name || 'Unknown Hotel' }}'?</p>
                
                <p class="mt-4">Reservation date:</p>
                <p>{{ formatDate(dialogCancelation.reservation.checkInDate) }} – {{ formatDate(dialogCancelation.reservation.checkOutDate) }}</p>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="error" @click="cancelReservation(dialogCancelation.reservation)">
                    Yes, Cancel
                </v-btn>

                <v-btn color="info" text @click="handleCloseDialogCancelation">
                    No, Keep It
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialogUpdate.visible"
        max-width="500px"
        @after-leave="handeCloseDialogUpdate"
    >
        <v-card v-if="dialogUpdate.reservation" rounded>
            <v-card-title>
                Updating reservation Reservation
            </v-card-title>

            <v-card-text>
                <p>{{ dialogUpdate.reservation.room?.hotel?.name }}</p>
                <p>{{ formatDate(dialogUpdate.reservation.checkInDate) }} – {{ formatDate(dialogUpdate.reservation.checkOutDate) }}</p>
                <p>Room: {{ dialogUpdate.reservation.room?.roomNumber }}</p>
                <p class="mt-8">Enter the guest count:</p>

                <v-form
                    ref="form"
                >
                    <v-text-field
                        v-model="dialogUpdate.guestCount"
                        :rules="[isRequired('Guest count'), max('Guest count', dialogUpdate.reservation.room?.capacity ?? 0), minIncluding('Guest count', 0)]"
                        class="mt-4"
                        label="Guest count"
                        type="number"
                        variant="underlined"
                    >
                    </v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-btn color="info" @click="update()">
                    Update
                </v-btn>

                <v-btn color="error" @click="handeCloseDialogUpdate()">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-container v-if="!loading" fluid>
        <v-sheet class="pa-4 ma-4" elevation="2" rounded border>
            <v-row class="ma-4 d-flex justify-space-between align-center">
                <v-col cols="auto">
                    <h2 class="text-h5 mb-0">User Information</h2>
                </v-col>

                <v-col cols="auto" class="d-flex">
                    <template v-if="userId">
                        <v-btn
                            v-if="editing"
                            color="primary"
                            icon
                            outlined
                            class="mr-2"
                            @click="handleUpdateRoles"
                        >
                            <v-icon icon="mdi-check"/>
                        </v-btn>

                        <v-btn
                            v-if="editing"
                            color="error"
                            icon
                            outlined
                            @click="handleCancelEdit"
                        >
                            <v-icon icon="mdi-cancel"/>
                        </v-btn>

                        <v-btn
                            v-else
                            icon
                            color="primary"
                            outlined
                            @click="editing = !editing"
                        >
                            <v-icon>
                                <img
                                    src="@/assets/pencil.svg"
                                    alt="Edit"
                                    style="filter: invert(100%); max-width: 100%; height: auto;"
                                />
                            </v-icon>
                        </v-btn>
                    </template>
                </v-col>
            </v-row>

            <v-row class="ma-4">
                <v-col cols="12" class="d-flex flex-column align-center">
                    <v-avatar size="250" class="mb-4">
                        <img width="70%" src="@/assets/avatar.png" alt="User Avatar" />
                    </v-avatar>
                    <div class="info-section text-left">
                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold">Username:</span>
                            <span class="value">{{ user.username }}</span>
                        </div>

                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold">Name:</span>
                            <span class="value">{{ user.name }}</span>
                        </div>

                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold">Surname:</span>
                            <span class="value">{{ user.surname }}</span>
                        </div>

                        <div class="info-item mb-2 d-flex">
                            <span class="label font-weight-bold">Email:</span>
                            <span class="value">{{ user.email }}</span>
                        </div>

                        <div
                            v-if="userId"
                            class="info-item mb-2 d-flex align-center"
                        >
                            <span class="label font-weight-bold">Roles:</span>
                            
                            <v-select
                                v-model="selectedRoles"
                                :disabled="!editing"
                                :menu-icon="editing ? 'mdi-chevron-down' : ''"
                                :items="Object.values(roles)"
                                class="roles-dropdown"
                                variant="flat"
                                chips
                                hide-details
                                multiple
                            />
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-sheet>

        <v-sheet class="pa-4 ma-4" elevation="2" border rounded>
            <v-row>
                <v-col cols="12" class="ml-6 mt-4">
                    <h2 class="text-h5 mb-4">User Reservations</h2>
                </v-col>

                <v-col cols="12"
                    v-for="reservation in user.reservations"
                    :key="reservation.id"
                >
                    <v-card class="mb-4" elevation="" border>
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
                                    <template v-if="userId">
                                        <v-btn 
                                            v-if="new Date(reservation.checkOutDate) >= now"
                                            color="info"
                                            outlined
                                            @click="handleEditReservation(reservation)"
                                        >
                                            Edit
                                        </v-btn>

                                        <v-btn
                                            v-if="new Date(reservation.checkOutDate) >= now"
                                            color="error"
                                            class="ma-4"
                                            outlined
                                            @click="handleCancelReservation(reservation)"
                                        >
                                            Cancel
                                        </v-btn>
                                    </template>

                                    <template v-else>
                                        <v-btn 
                                            v-if="(new Date(reservation.checkInDate) - now) / (1000 * 60 * 60) >= 24"
                                            color="error"
                                            outlined
                                            @click="handleCancelReservation(reservation)"
                                        >
                                            Cancel reservation
                                        </v-btn>
                                    </template>
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
    import { isRequired, max, minIncluding } from '@/utils/rules';
    import { ref, computed, reactive } from 'vue';
    import { roles } from '@/constants/roles';
    import { showError } from '@/utils/snackbar';
    import { useAuth } from '@/utils/auth';
    import { useRoute } from 'vue-router';

    const auth = useAuth();
    const route = useRoute();
    const userId = route.params.userId;
    const now = new Date();;

    const editing = ref(false);
    const form = ref(null);
    const user = ref({});
    const requestsPending = ref(0);
    const selectedRoles = ref([]);

    const loading = computed(() => requestsPending.value > 0);

    const { dialogCancelation, dialogUpdate } = initializeDialogs();

    loadUser();

    function handleCancelEdit() {
        editing.value = false;

        selectedRoles.value = user.value.roles;
    }

    async function handleUpdateRoles() {
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

    function handleCancelReservation(reservation) {
        dialogCancelation.reservation = reservation;
        dialogCancelation.visible = true;
    }

    function handleCloseDialogCancelation() {
        dialogCancelation.reservation = null;
        dialogCancelation.visible = false;
    }

    function handeCloseDialogUpdate() {
        dialogUpdate.guestCount = 0;
        dialogUpdate.reservation = null;
        dialogUpdate.visible = false;
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    function handleEditReservation(reservation) {
        dialogUpdate.guestCount = reservation.guestCount;
        dialogUpdate.reservation = reservation;
        dialogUpdate.visible = true;
    }

    function initializeDialogs() {
        const dialogCancelation = reactive({
            reservation: null,
            visible: false
        });

        const dialogUpdate = reactive({
            guestCount: 0,
            reservation: null,
            visible: false
        });

        return { dialogCancelation, dialogUpdate };
    }

    async function cancelReservation(reservation) {
        try {
            requestsPending.value++;
            
            await apiRequest({
                path: `/reservations/${reservation.id}`,
                method: 'DELETE',
                token: await auth.getToken()
            });

            location.reload();
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not cancel reservation: ${e.respone.data}`);
            } else {
                showError('Could not cancel reservation.');
            }
        } finally {
            editing.value = false;
            requestsPending.value--;
        }
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

    async function update() {
		const isValid = (await form.value.validate()).valid;

        if (isValid) {
            requestsPending.value++;

            const token = await auth.getToken();

            try {
                await apiRequest({
                    path: '/reservations/update',
                    method: 'PUT',
                    data: {
                        checkInDate: dialogUpdate.reservation.checkInDate,
                        checkOutDate: dialogUpdate.reservation.checkOutDate,
                        guestCount: dialogUpdate.guestCount,
                        id: dialogUpdate.reservation.id,
                        roomId: dialogUpdate.reservation.roomId
                    },
                    token: token
                });

                handeCloseDialogUpdate();
                
                location.reload();
            } catch (e) {
                showError('Failed to create reservation.');
            } finally {
                requestsPending.value--;
            }
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
        width: 170px;
    }

    .v-card {
        padding: 16px;
    }

    .v-card-title {
        font-size: 18px;
        font-weight: bold;
    }
</style>

<style>
    .roles-dropdown {
        .v-field--disabled {
            opacity: 1;
        }
    }
</style>
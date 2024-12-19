<template>
    <v-dialog
            v-if="isAdmin"
            v-model="dialogDelete.visible"
            max-width="400px"
            @after-leave="handleCloseDialogDelete"
    >
        <v-card prepend-icon="mdi-bed-outline" title="Room deletion">
            <v-card-text>
                {{ dialogDelete.text }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="error" @click="handleDelete">
                    Yes, Delete The Room
                </v-btn>

                <v-btn color="info" text @click="handleCloseDialogDelete">
                    No, Keep It
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
        v-if="isAdmin"
        v-model="dialogModel.visible"
        max-width="525px"
        @after-leave="handleCloseDialogModel"
    >
        <v-card :title="dialogModel.title" prepend-icon="mdi-bed-outline">
            <v-card-text>
                <v-form ref="form">
                    <v-text-field
                        v-model="model.roomNumber.modelValue"
                        :label="model.roomNumber.label"
                        :rules="model.roomNumber.rules"
                        variant="underlined"
                    >                        
                    </v-text-field>

                    <v-text-field
                        v-model="model.capacity.modelValue"
                        :label="model.capacity.label"
                        :rules="model.capacity.rules"
                        type="number"
                        variant="underlined"
                    >
                    </v-text-field>
                </v-form>

                <v-row class="justify-end ma-2">
                    <v-btn
                        class="mr-2"
                        color="primary"
                        size="x-small"
                        icon
                        outlined
                        @click="dialogModel.onClick"
                    >
                        <v-icon icon="mdi-check"/>
                    </v-btn>

                    <v-btn
                        color="error"
                        size="x-small"
                        icon
                        outlined
                        small
                        @click="handleCloseDialogModel"
                    >
                        <v-icon icon="mdi-cancel"/>
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-container>
        <v-row class="d-flex align-center justify-space-between ma-4 mb-10">
            <h1 class="text-center flex-grow-1">Rooms of the {{ hotel.name }} hotel</h1>

            <v-btn
                v-if="isAdmin"
                color="primary"
                icon
                @click="handleOpenDialogCreation"
            >
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </v-row>

        <v-row dense>
            <v-col
                v-for="room in rooms"
                :key="room.id"
                cols="12"
                md="4"
                sm="6"
            >
                <v-card class="mb-4" border rounded>
                    <v-card-title>Room {{ room.roomNumber }}</v-card-title>

                    <v-card-text>
                        <p><strong>Capacity:</strong> {{ room.capacity }}</p>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            text
                            color="primary"
                            @click="showReservations(room.id)"
                        >
                            View Reservations
                        </v-btn>

                        <v-spacer></v-spacer>

                        <template v-if="isAdmin">
                            <v-btn
                                icon
                                color="primary"
                                @click="handleOpenDialogUpdate(room)"
                            >
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn
                                icon
                                color="error"
                                @click="handleOpenDialogDelete(room)"
                            >
                                <v-icon>mdi-delete-outline</v-icon>
                            </v-btn>
                        </template>
                        
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
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
    import { isRequired, minIncluding } from '@/utils/rules';
    import { reactive, ref } from 'vue';
    import { roles } from '@/constants/roles';
    import { showError } from '@/utils/snackbar';
    import { useAuth } from '@/utils/auth';
    import { useRoute, useRouter } from 'vue-router';

    const auth = useAuth();
    const route = useRoute();
    const router = useRouter();

    const hotelId = route.params.hotelId;

    const dialogDelete = reactive({
        roomId: 0,
        text: '',
        visible: false
    });

    const dialogModel = reactive({
        onClick: () => {},
        title: '',
        visible: false
    });

    const form = ref(null);
    const hotel = ref({});
    const isAdmin = ref(false);
    const rooms = ref([]);
    const requestsPending = ref(0);
    const loading = computed(() => requestsPending.value > 0);

    const model = ref({
        capacity: {
            label: 'Capacity',
            modelValue: 0,
            rules: [isRequired('Capacity'), minIncluding('Capacity', 0)]
        },
        hotelId: {
            modelValue: 0
        },
        id: {
            modelValue: 0
        },
        roomNumber: {
            label: 'Room number',
            modelValue: '',
            rules: [isRequired('Room number')]
        }
    });

    loadHotel();
    loadRooms();

    function handleCloseDialogDelete() {
        dialogDelete.roomId = 0;
        dialogDelete.text = '';
        dialogDelete.visible = false;
    }

    function handleCloseDialogModel() {
        model.value.capacity.modelValue = 0;
        model.value.id.modelValue = 0;
        model.value.roomNumber.modelValue = '';

        dialogModel.onClick = () => {};
        dialogModel.title = '';
        dialogModel.visible = false;
    }

    async function handleCreate() {
        const isValid = (await form.value.validate()).valid;

        if (isValid) {
            requestsPending.value++;
            try {
                await apiRequest({
                    path: '/rooms',
                    method: 'POST',
                    token: await auth.getToken(),
                    data: {
                        capacity: model.value.capacity.modelValue,
                        hotelId: hotelId,                    
                        roomNumber: model.value.roomNumber.modelValue
                    }
                });

                location.reload();
            } catch (e) {
                if (e?.response?.data) {
                    showError(`Could not create hotel: ${e.respone.data}`);
                } else {
                    showError('Could not create hotel.');
                }
            } finally {
                requestsPending.value--;
            }
        }
    }

    async function handleDelete() {
        requestsPending.value++;

        try {
            await apiRequest({
                path: `/rooms/${dialogDelete.roomId}`,
                method: 'DELETE',
                token: await auth.getToken()
            });

            location.reload();
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not delete room: ${e.respone.data}`);
            } else {
                showError('Could not delete room.');
            }
        } finally {
            requestsPending.value--;
        }
    }

    async function handleUpdate() {
        const isValid = (await form.value.validate()).valid;

        if (isValid) {
            requestsPending.value++;

            try {
                await apiRequest({
                    path: '/rooms/update',
                    method: 'PUT',
                    token: await auth.getToken(),
                    data: {
                        capacity: model.value.capacity.modelValue,
                        hotelId: hotelId,
                        id: model.value.id.modelValue,
                        roomNumber: model.value.roomNumber.modelValue
                    }
                });

                location.reload();
            } catch (e) {
                if (e?.response?.data) {
                    showError(`Could not update room: ${e.respone.data}`);
                } else {
                    showError('Could not update room.');
                }
            } finally {
                requestsPending.value--;
            }
        }
    }

    function handleOpenDialogCreation() {
        dialogModel.onClick = handleCreate;
        dialogModel.title = `Room creation for the ${hotel.value.name} hotel`
        dialogModel.visible = true;
    }

    function handleOpenDialogDelete(room) {
        dialogDelete.roomId = room.id;
        dialogDelete.text = `Are you sure you want to delete the room number '${room.roomNumber}'?`
        dialogDelete.visible = true;
    }

    function handleOpenDialogUpdate(room) {
        model.value.capacity.modelValue = room.capacity;
        model.value.id.modelValue = room.id;
        model.value.roomNumber.modelValue = room.roomNumber;

        dialogModel.onClick = handleUpdate;
        dialogModel.title = 'Updating room'
        dialogModel.visible = true;
    }

    async function loadHotel() {
        requestsPending.value++;

        try {
            hotel.value = await apiRequest({
                path: `/hotels/${hotelId}`,
                method: 'GET'
            });
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not load hotel information: ${e.respone.data}`);
            } else {
                showError('Could not load hotel information.');
            }
        } finally {
            requestsPending.value--;
        }
    }

    async function loadRooms() {
        requestsPending.value++;

        try {
            rooms.value = await apiRequest({
                path: `/hotels/${hotelId}/rooms`,
                method: 'GET'
            });
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not load rooms: ${e.respone.data}`);
            } else {
                showError('Could not load rooms.');
            }
        } finally {
            requestsPending.value--;
        }
    }

    function showReservations(roomId) {
        router.push({ path: `/hotels/${hotelId}/rooms/${roomId}/reservations` });
    }

    onMounted(async () => {
        isAdmin.value = await auth.isInRole(roles.ADMIN);
    });
</script>
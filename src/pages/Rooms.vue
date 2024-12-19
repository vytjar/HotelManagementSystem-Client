<template>
    <v-dialog
        v-if="isAdmin"
        v-model="dialog.visible"
        max-width="525px"
        @after-leave="handleCloseDialog"
    >
        <v-card :title="dialog.title" prepend-icon="mdi-bed-outline">
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
                        @click="dialog.onClick"
                    >
                        <v-icon icon="mdi-check"/>
                    </v-btn>

                    <v-btn
                        color="error"
                        size="x-small"
                        icon
                        outlined
                        small
                        @click="handleCloseDialog"
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
                <v-card class="mb-4" rounded>
                    <v-card-title>Room {{ room.roomNumber }}</v-card-title>

                    <v-card-text>
                        <p><strong>Capacity:</strong> {{ room.capacity }}</p>
                        <!-- <p><strong>Reservations:</strong> {{ room.reservations.length }}</p> -->
                    </v-card-text>

                    <v-card-actions class="justify-space-between">
                        <v-btn
                            text
                            color="primary"
                            @click="showReservations(room.id)"
                        >
                            View Reservations
                        </v-btn>

                        <v-btn
                            v-if="isAdmin"
                            icon
                            color="primary"
                            @click="handleOpenDialogUpdate(room)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script setup>
    import { apiRequest } from '@/utils/api';
    import { isRequired, min } from '@/utils/rules';
    import { ref } from 'vue';
    import { roles } from '@/constants/roles';
    import { useAuth } from '@/utils/auth';
    import { useRoute, useRouter } from 'vue-router';

    const auth = useAuth();
    const route = useRoute();
    const router = useRouter();

    const hotelId = route.params.hotelId;

    const dialog = reactive({
        onClick: () => {},
        title: '',
        visible: false
    });

    const form = ref(null);
    const hotel = ref({});
    const isAdmin = ref(false);
    const rooms = ref([]);

    const model = ref({
        capacity: {
            label: 'Capacity',
            modelValue: 0,
            rules: [isRequired('Capacity'), min('Capacity', 0)]
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

    function handleCloseDialog() {
        model.value.capacity.modelValue = 0;
        model.value.id.modelValue = 0;
        model.value.roomNumber.modelValue = '';

        dialog.onClick = () => {};
        dialog.title = '';
        dialog.visible = false;
    }

    async function handleCreate() {
        const isValid = (await form.value.validate()).valid;

        if (isValid) {
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
            }
        }
    }

    async function handleUpdate() {
        const isValid = (await form.value.validate()).valid;

        if (isValid) {
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
            }
        }
    }

    function handleOpenDialogCreation() {
        dialog.onClick = handleCreate;
        dialog.title = `Room creation for the ${hotel.value.name} hotel`
        dialog.visible = true;
    }

    function handleOpenDialogUpdate(room) {
        model.value.capacity.modelValue = room.capacity;
        model.value.id.modelValue = room.id;
        model.value.roomNumber.modelValue = room.roomNumber;

        dialog.onClick = handleUpdate;
        dialog.title = 'Updating room'
        dialog.visible = true;
    }

    async function loadHotel() {
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
        }
    }

    async function loadRooms() {
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
        }
    }

    function showReservations(roomId) {
        router.push({ path: `/hotels/${hotelId}/rooms/${roomId}/reservations` });
    }

    onMounted(async () => {
        isAdmin.value = await auth.isInRole(roles.ADMIN);
    });
</script>
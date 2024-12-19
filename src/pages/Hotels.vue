<template>
    <v-dialog
        v-if="isAdmin"
        v-model="dialogDelete.visible"
        max-width="400px"
        @after-leave="handleCloseDialogDelete"
    >
        <v-card prepend-icon="mdi-city" title="Hotel deletion">
            <v-card-text>
                {{ dialogDelete.text }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="error" @click="handleDelete">
                    Yes, Delete The Hotel
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
        max-width="400px"
        @after-leave="handleCloseDialogModel"
    >
        <v-card :title="dialogModel.title" prepend-icon="mdi-city">
            <v-card-text>
                <v-form ref="form">
                    <v-text-field
                        v-model="model.name.modelValue"
                        :label="model.name.label"
                        :rules="model.name.rules"
                        variant="underlined"
                    >
                    </v-text-field>

                    <v-text-field
                        v-model="model.address.modelValue"
                        :label="model.address.label"
                        :rules="model.address.rules"
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

    <v-container class="mt-2" color="background">
        <v-row class="d-flex align-center justify-space-between ma-4 mb-10">
            <h1 class="text-center flex-grow-1">Hotels</h1>

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
                v-for="hotel in hotels"
                :key="hotel.id"
                cols="12"
                sm="6"
                md="4"
            >
                <v-card class="mb-4" border>
                    <v-card-title>{{ hotel.name }}</v-card-title>
                    <v-card-subtitle>{{ hotel.address }}</v-card-subtitle>

                    <v-card-actions>
                        <v-btn
                            text
                            color="primary"
                            @click="viewRooms(hotel.id)"
                        >
                            View Rooms
                        </v-btn>

                        <v-spacer></v-spacer>

                        <template v-if="isAdmin">
                            <v-btn
                                icon
                                color="primary"
                                @click="handleOpenDialogUpdate(hotel)"
                            >
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            
                            <v-btn
                                icon
                                color="error"
                                @click="handleOpenDialogDelete(hotel)"
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
    import { isRequired } from '@/utils/rules';
    import { reactive, ref } from 'vue';
    import { roles } from '@/constants/roles';
    import { showError } from '@/utils/snackbar';
    import { useAuth } from '@/utils/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuth();
    const router = useRouter();

    const form = ref(null);

    const dialogDelete = reactive({
        hotelId: 0,
        text: '',
        visible: false
    });

    const dialogModel = reactive({
        onClick: () => {},
        title: '',
        visible: false
    });

    const hotels = ref([]);
    const isAdmin = ref(false);

    const model = ref({
        address: {
            label: 'Address',
            modelValue: '',
            rules: [isRequired('Address')]
        },
        id: {
            modelValue: 0
        },
        name: {
            label: 'Name',
            modelValue: '',
            rules: [isRequired('Name')]
        }
    });

    const requestsPending = ref(0);
    const loading = computed(() => requestsPending.value > 0);

    loadHotels();

    function handleCloseDialogDelete() {
        dialogDelete.hotelId = 0;
        dialogDelete.text = '';
        dialogDelete.visible = false;
    }

    function handleCloseDialogModel() {
        model.value.address.modelValue = '';
        model.value.id.modelValue = 0;
        model.value.name.modelValue = '';

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
                    path: '/hotels',
                    method: 'POST',
                    token: await auth.getToken(),
                    data: {
                        address: model.value.address.modelValue,
                        name: model.value.name.modelValue
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
                path: `/hotels/${dialogDelete.hotelId}`,
                method: 'DELETE',
                token: await auth.getToken()
            });

            location.reload();
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not delete hotel: ${e.respone.data}`);
            } else {
                showError('Could not delete hotel.');
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
                    path: '/hotels/update',
                    method: 'PUT',
                    token: await auth.getToken(),
                    data: {
                        address: model.value.address.modelValue,
                        id: model.value.id.modelValue,
                        name: model.value.name.modelValue
                    }
                });

                location.reload();
            } catch (e) {
                if (e?.response?.data) {
                    showError(`Could not update hotel: ${e.respone.data}`);
                } else {
                    showError('Could not update hotel.');
                }
            } finally {
                requestsPending.value--;
            }
        }
    }

    function handleOpenDialogCreation() {
        dialogModel.onClick = handleCreate;
        dialogModel.title = 'Hotel creation'
        dialogModel.visible = true;
    }

    function handleOpenDialogDelete(hotel) {
        dialogDelete.hotelId = hotel.id;
        dialogDelete.text = `Are you sure you want to delete the '${hotel.name}' hotel?`
        dialogDelete.visible = true;
    }

    function handleOpenDialogUpdate(hotel) {
        model.value.address.modelValue = hotel.address;
        model.value.id.modelValue = hotel.id;
        model.value.name.modelValue = hotel.name;

        dialogModel.onClick = handleUpdate;
        dialogModel.title = 'Hotel update'
        dialogModel.visible = true;
    }

    async function loadHotels() {
        requestsPending.value++;

        try {
            hotels.value = await apiRequest({
                path: '/hotels',
                method: 'GET'
            });
        } catch (e) {
            console.log(e);
            if (e?.response?.data) {
                showError(`Could not load hotels: ${e.respone.data}`);
            } else {
                showError('Could not load hotels');
            }
        } finally {
            requestsPending.value--;
        }
    }

    const viewRooms = (hotelId) => {
        router.push({ path: `hotels/${hotelId}/rooms` });
    };

    onMounted(async () => {
        isAdmin.value = await auth.isInRole(roles.ADMIN);
    });
</script>
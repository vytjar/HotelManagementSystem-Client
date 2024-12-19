<template>
    <v-dialog
        v-if="isAdmin"
        v-model="dialog.visible"
        max-width="400px"
        @after-leave="handleCloseDialog"
    >
        <v-card :title="dialog.title" prepend-icon="mdi-city">
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
                <v-card class="mb-4">
                    <v-card-title>{{ hotel.name }}</v-card-title>
                    <v-card-subtitle>{{ hotel.address }}</v-card-subtitle>

                    <v-card-actions class="justify-space-between">
                        <v-btn
                            text
                            color="primary"
                            @click="viewRooms(hotel.id)"
                        >
                            View Rooms
                        </v-btn>

                        <v-btn
                            v-if="isAdmin"
                            icon
                            color="primary"
                            @click="handleOpenDialogUpdate(hotel)"
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
    import { isRequired } from '@/utils/rules';
    import { reactive, ref } from 'vue';
    import { roles } from '@/constants/roles';
    import { showError } from '@/utils/snackbar';
    import { useAuth } from '@/utils/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuth();
    const router = useRouter();

    const form = ref(null);

    const dialog = reactive({
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

    loadHotels();

    function handleCloseDialog() {
        model.value.address.modelValue = '';
        model.value.id.modelValue = 0;
        model.value.name.modelValue = '';

        dialog.onClick = () => {};
        dialog.title = '';
        dialog.visible = false;
    }

    async function handleCreate() {
		const isValid = (await form.value.validate()).valid;

        if (isValid) {
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
            }
        }
    }

    async function handleUpdate() {
		const isValid = (await form.value.validate()).valid;

        if (isValid) {
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
            }
        }
    }

    function handleOpenDialogCreation() {
        dialog.onClick = handleCreate;
        dialog.title = 'Hotel creation'
        dialog.visible = true;
    }

    function handleOpenDialogUpdate(hotel) {
        model.value.address.modelValue = hotel.address;
        model.value.id.modelValue = hotel.id;
        model.value.name.modelValue = hotel.name;

        dialog.onClick = handleUpdate;
        dialog.title = 'Hotel creation'
        dialog.visible = true;
    }

    async function loadHotels() {
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
        }
    }

    const viewRooms = (hotelId) => {
        router.push({ path: `hotels/${hotelId}/rooms` });
    };

    onMounted(async () => {
        isAdmin.value = await auth.isInRole(roles.ADMIN);
    });
</script>
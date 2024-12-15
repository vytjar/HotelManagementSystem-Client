<template>
    <v-container>
        <v-row dense class="mt-10">
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

                    <v-card-actions>
                        <v-btn
                            text
                            color="primary"
                            @click="viewRooms(hotel.id)"
                        >
                            View Rooms
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { apiRequest } from '@/utils/api';
    import { ref } from 'vue';
    import { showError } from '@/utils/snackbar';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const hotels = ref([]);

    loadHotels();

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
</script>
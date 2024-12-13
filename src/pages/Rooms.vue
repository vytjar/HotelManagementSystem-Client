<template>
    <v-container>
        <v-row class="d-flex justify-center mb-10 mt-10">
            <h1>Rooms of the {{ hotel.name }} hotel</h1>
        </v-row>

        <v-row dense>
            <v-col
                v-for="room in rooms"
                :key="room.id"
                cols="12"
                md="4"
                sm="6"
            >
                <v-card class="mb-4">
                    <v-card-title>Room {{ room.roomNumber }}</v-card-title>

                    <v-card-text>
                        <p><strong>Capacity:</strong> {{ room.capacity }}</p>
                        <p><strong>Reservations:</strong> {{ room.reservations.length }}</p>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            text
                            color="primary"
                            @click="showReservations(room.id)"
                        >
                            View Reservations
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script setup>
    import { apiRequest } from '@/utils/Api';
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    const hotelId = route.params.hotelId;

    const hotel = ref({});
    const rooms = ref([]);


    loadHotel();
    loadRooms();

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
                showError('Could not load hotel information');
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
                showError('Could not load rooms');
            }
        }
    }

    function showReservations(roomId) {
        router.push({ path: `/hotels/${hotelId}/rooms/${roomId}/reservations` });
    }
</script>
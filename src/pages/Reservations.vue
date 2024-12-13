<template>
  <v-container>
    <v-calendar
        :events="calendarEvents"
        @update:model-value="onChange"
    />
  </v-container>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { apiRequest } from '@/utils/Api';
    import { showError } from '@/utils/Snackbar';

    const calendarEvents = ref([]);
    const route = useRoute();
    const roomId = route.params.roomId;

    const year = new Date().getFullYear();
    const month = new Date().getMonth()  - 1;

    loadReservationsForMonth(year, month);

    async function loadReservationsForMonth(year, month) {
        const fromDate = new Date(year, month, 1)
            .toISOString()
            .split('T')[0];

        const toDate = new Date(year, month + 1, 0)
            .toISOString()
            .split('T')[0];

        try {
            const reservations = await apiRequest({
                path: '/reservations/filter',
                method: 'POST',
                data: {
                    From: fromDate,
                    To: toDate,
                    RoomId: roomId,
                },
            });

            calendarEvents.value = reservations.map((reservation) => {
                const event = {
                    text: `Reservation #${reservation.id}`,
                    name: `Reservation #${reservation.id}`,
                    start: new Date(reservation.checkInDate),
                    end: new Date(reservation.checkOutDate),
                    color: 'red'
                };

                return event;
            });

            console.log(calendarEvents.value);
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not load reservations: ${e.respone.data}`);
            } else {
                showError('Could not load reserved');
            }
        }
    }

    function onChange(value) {
        const date = new Date(value);

        loadReservationsForMonth(date.getFullYear(), date.getMonth());
    }
</script>

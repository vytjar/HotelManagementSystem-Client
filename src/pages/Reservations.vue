<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-sheet elevation="2" class="pa-4">
                    <div class="calendar-header d-flex justify-space-between align-center">
                        <v-btn
                            :disabled="currentMonth === today.getMonth() && currentYear === today.getFullYear()"
                            icon
                            @click="goToPreviousMonth"
                        >
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>

                        <div class="month-year">{{ currentMonthYear }}</div>

                        <v-btn icon @click="goToNextMonth">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>

                    <div class="calendar-grid">
                        <div v-for="day in daysOfWeek" :key="day" class="calendar-cell day-header">
                            {{ day }}
                        </div>
                        
                        <div
                            v-for="(day, index) in paddedCalendarDays"
                            :key="index"
                            class="calendar-cell"
                            :class="getDateClass(day)"
                            @click="day && isValidSelection(day) && selectDate(day)"
                        >
                            {{ day ? day.getDate() : '' }}
                        </div>
                    </div>

                    <v-btn
                        :disabled="!canReserve"
                        class="mt-4"
                        color="primary"
                        @click="handleReservation"
                    >
                        Reserve
                    </v-btn>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script setup>
    import { apiRequest } from '@/utils/Api';
    import { ref, computed, onMounted } from 'vue';
    import { showError, showSuccess } from '@/utils/Snackbar';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const roomId = route.params.roomId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentYear = ref(today.getFullYear());
    const currentMonth = ref(today.getMonth());

    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);
    const calendarDays = ref(getCalendarDays(currentYear.value, currentMonth.value));
    const reservedDates = ref([]);

    async function loadReservationsForMonth(year, month) {
        const fromDate = new Date(year, month, 1).toISOString().split('T')[0];
        const toDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

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

            reservedDates.value = reservations.flatMap(reservation => {
                const start = new Date(reservation.checkInDate);
                const end = new Date(reservation.checkOutDate);
                const dates = [];

                for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    dates.push(new Date(date).toDateString());
                }

                return dates;
            });

            console.log('Reserved Dates:', reservedDates.value);
        } catch (e) {
            if (e?.response?.data) {
                showError(`Could not load reservations: ${e.response.data}`);
            } else {
                showError('Could not load reservations');
            }
        }
    }

    onMounted(() => {
        loadReservationsForMonth(currentYear.value, currentMonth.value);
    });

    function getCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
            days.push(new Date(date));
        }

        return days;
    }

    function padCalendarDays(days) {
        const firstDayOfWeek = days[0]?.getDay() || 0;
        const paddedDays = new Array(firstDayOfWeek).fill(null).concat(days);

        while (paddedDays.length % 7 !== 0) {
            paddedDays.push(null);
        }

        return paddedDays;
    }

    function goToPreviousMonth() {
        currentMonth.value -= 1;
        if (currentMonth.value < 0) {
            currentMonth.value = 11;
            currentYear.value -= 1;
        }
        updateCalendarDays();
    }

    function goToNextMonth() {
        currentMonth.value += 1;
        if (currentMonth.value > 11) {
            currentMonth.value = 0;
            currentYear.value += 1;
        }
        updateCalendarDays();
    }

    function updateCalendarDays() {
        calendarDays.value = getCalendarDays(currentYear.value, currentMonth.value);
        loadReservationsForMonth(currentYear.value, currentMonth.value);
    }

    function isValidSelection(date) {
        if (!selectedStartDate.value) {
            return true;
        }

        if (selectedStartDate.value && !selectedEndDate.value) {
            const range = getDatesInRange(selectedStartDate.value, date);
            return range.every(d => !isReserved(d));
        }

        return false;
    }

    function getDatesInRange(start, end) {
        const range = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            range.push(new Date(d).toDateString());
        }
        return range;
    }

    function selectDate(date) {
        if (!selectedStartDate.value || (selectedStartDate.value && selectedEndDate.value)) {
            selectedStartDate.value = date;
            selectedEndDate.value = null;
        } else if (selectedStartDate.value && !selectedEndDate.value) {
            if (date > selectedStartDate.value) {
                const range = getDatesInRange(selectedStartDate.value, date);
                if (range.every(d => !isReserved(new Date(d)))) {
                    selectedEndDate.value = date;
                } else {
                    showError('Selected range includes reserved dates.');
                }
            } else {
                showError('End date must be after the start date.');
            }
        }
    }

    function isPast(date) {
        if (date == null) return true;

        return new Date(date) < today;
    }

    function isReserved(date) {
        if (date == null) return false;

        return reservedDates.value.includes((new Date(date)).toDateString());
    }

    function getDateClass(date) {
        if (!date) return '';

        const isReservedDay = isReserved(date);
        const isPastDay = isPast(date);
        const isSelected = selectedStartDate.value &&
            selectedEndDate.value &&
            date >= selectedStartDate.value &&
            date <= selectedEndDate.value;

        const isStartOrEnd = date.toDateString() === selectedStartDate.value?.toDateString() ||
            date.toDateString() === selectedEndDate.value?.toDateString();

        return {
            'disabled-date': isReservedDay || isPastDay,
            'selected-range': isSelected,
            'selected-date': isStartOrEnd,
            today: date.toDateString() === new Date().toDateString(),
        };
    }

    async function handleReservation() {
        if (!selectedStartDate.value || !selectedEndDate.value) {
            showError('Please select a start and end date.');
            return;
        }

        try {
            const response = await apiRequest({
                path: '/reservations',
                method: 'POST',
                data: {
                checkInDate: selectedStartDate.value.toISOString(),
                checkOutDate: selectedEndDate.value.toISOString(),
                },
            });

            showSuccess(`Reservation created: #${response.id}`);
            resetSelection();
        } catch (e) {
            showError('Failed to create reservation.');
        }
    }

    function resetSelection() {
        selectedStartDate.value = null;
        selectedEndDate.value = null;
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];

    const currentMonthYear = computed(() => {
        return `${monthNames[currentMonth.value]} ${currentYear.value}`;
    });

    const paddedCalendarDays = computed(() => padCalendarDays(calendarDays.value));

    const canReserve = computed(() => selectedStartDate.value && selectedEndDate.value);
</script>
    
<style scoped>
    .calendar-header {
        margin-bottom: 16px;
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
    }

    .calendar-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color 0.2s ease;
    }

    .day-header {
        font-weight: bold;
        text-align: center;
        color: #666;
    }

    .calendar-cell.today {
        border: 1px solid blue;
    }

    .calendar-cell.selected-date {
        background-color: #1976d2;
        color: white;
    }

    .calendar-cell.selected-range {
        background-color: #90caf9;
    }

    .calendar-cell.disabled-date {
        /* background-color: #e0e0e0; */
        color: #9e9e9e;
        pointer-events: none;
        cursor: not-allowed;
    }
</style>

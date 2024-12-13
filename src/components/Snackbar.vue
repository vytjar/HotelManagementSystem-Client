<template>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="3000"
      outlined
    >
        {{ snackbar.message }}

        <template #actions>
            <v-btn text @click="snackbar.show = false">Close</v-btn>
        </template>
    </v-snackbar>
</template>
  
<script setup>
    import { snackbar } from '@/utils/Snackbar';
</script>
  
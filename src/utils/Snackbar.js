import { reactive } from 'vue';

export const snackbar = reactive({
    show: false,
    message: '',
    color: '',
});

export const showSuccess = (message) => {
    snackbar.show = true;
    snackbar.message = message;
    snackbar.color = 'success';
};

export const showError = (message) => {
    snackbar.show = true;
    snackbar.message = message;
    snackbar.color = 'error';
};

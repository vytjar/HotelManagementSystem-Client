const patternPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

export function validateEmail() {
    return (value) => /.+@.+\..+/.test(value) || 'Invalid email.'
}

export function validateMaxLength(length) {
    return (value) => (value?.length <= length) || `Max ${length} characters allowed.`
}

export function validatePassword() {
    return (value) => patternPassword.test(value) || 'Password must have at least 8 characters, including uppercase, lowercase, number, and symbol.';
}

export function isRequired(field) {
    return (value) => !!value || `${field} is required.`
}
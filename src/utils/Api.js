import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 50000,
    headers: {
    'Content-Type': 'application/json',
    },
    withCredentials: true
});

/**
 * Make an API request.
 * @param {string} path - The API endpoint path.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data] - Request body for POST, PUT, etc.
 * @param {Object} [params] - Query parameters for GET, DELETE, etc.
 * @returns {Promise} - Axios response promise.
 */
export const apiRequest = async ({ path, method = 'GET', data = {}, token = null, params = {} }) => {
    try {
        const headers = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await apiClient({
            url: path,
            method,
            data,
            params,
            headers
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
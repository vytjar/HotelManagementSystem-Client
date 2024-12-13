// api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Change base URL as needed
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Make an API request.
 * @param {string} path - The API endpoint path.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data] - Request body for POST, PUT, etc.
 * @param {Object} [params] - Query parameters for GET, DELETE, etc.
 * @param {Object} [headers] - Additional request headers.
 * @returns {Promise} - Axios response promise.
 */
export const apiRequest = async ({ path, method = 'GET', data = {}, params = {}, headers = {} }) => {
    try {
        const response = await apiClient({
            url: path,
            method,
            data,
            params,
            headers,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
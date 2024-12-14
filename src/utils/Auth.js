import jwtDecode from 'jwt-decode';
import { apiRequest } from './Api';

const TOKEN_KEY = 'auth-token';

function storeToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

async function getToken(token) {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp <= currentTime) {
            const refreshed = await refreshToken();
            return refreshed ? localStorage.getItem(TOKEN_KEY) : null;
        }

        return token;
    } catch (error) {
        console.error('Error decoding token:', error);
    }
}

async function isAuthenticated() {
    const token = await getToken();

    if (!token) return false;

    const decodedToken = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp > currentTime;
}

function isInRole(role) {
    const token = getToken();

    if (!token) return false;

    const decodedToken = jwtDecode(token);

    const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return Array.isArray(roles) ? roles.includes(role) : roles === role;
}

async function refreshToken() {
    try {
        const response = await apiRequest({
            path: '/users/refresh',
            method: 'POST'
        });

        const newToken = response.token;

        if (newToken) {
            storeToken(newToken);
            
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}

export function useAuth() {
    return {
        storeToken,
        getToken,
        isAuthenticated,
        isInRole,
        refreshToken
    };
}

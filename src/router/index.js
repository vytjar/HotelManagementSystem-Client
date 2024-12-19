import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import { roles } from '@/constants/roles';
import { useAuth } from '@/utils/auth';

const routes = [
	{
		path: '/',
		redirect: '/hotels',
	},
	{
		component: () => import('@/pages/Hotels.vue'),
		name: 'Hotels',
		path: '/hotels'
	},
	{
		component: Login,
		name: 'Login',
		path: '/login'
	},
	{
		component: Register,
		name: 'Register',
		path: '/register'
	},
	{
		component: () => import('@/pages/Reservations.vue'),
		name: 'Reservations',
		path: '/hotels/:hotelId/rooms/:roomId/reservations'
	},
	{
		component: () => import('@/pages/Rooms.vue'),
		name: 'Rooms',
		path: '/hotels/:hotelId/rooms'
	},
	{
		component: () => import('@/pages/Unauthorized.vue'),
		name: 'Unauthorized',
		path: '/unauthorized'
	},
	{
		component: () => import('@/pages/user/User.vue'),
		name: 'User',
		path: '/user'
	},
	{
		component: () => import('@/pages/user/User.vue'),
		name: 'UserDetails',
		path: '/users/:userId',
		meta: {
			roles: [roles.ADMIN]
		}
	},
	{
		component: () => import('@/pages/user/Users.vue'),
		name: 'Users',
		path: '/users',
		meta: {
			roles: [roles.ADMIN]
		}
	}
];

const auth = useAuth();

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

router.beforeEach(async (to, from, next) => {
    const roles = to.meta.roles;

    if (roles) {
		const hasRole = await Promise.all(roles.map(role => auth.isInRole(role)));
		if (!hasRole.includes(true)) {
			return next({ name: 'Unauthorized' });
		}
    }

    next();
});

export default router;

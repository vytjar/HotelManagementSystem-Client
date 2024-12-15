import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';

const routes = [
	{
		component: HomePage,
		name: 'Home',
		path: '/',
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
		component: () => import('@/pages/user/User.vue'),
		name: 'User',
		path: '/user'
	},
	{
		component: () => import('@/pages/user/User.vue'),
		name: 'UserDetails',
		path: '/users/:userId'
	},
	{
		component: () => import('@/pages/user/Users.vue'),
		name: 'Users',
		path: '/users'
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

// // Navigation Guards for Authentication and Role-based Access
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('auth-token'); // Example: Use your actual auth check
//   const userRole = localStorage.getItem('user-role'); // Example: Fetch user role from storage

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login');
//   } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
//     next('/'); // Redirect to home if unauthorized
//   } else {
//     next();
//   }
// });

export default router;

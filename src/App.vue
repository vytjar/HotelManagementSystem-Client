<template>
	<v-app> 
		<NavigationBar color="primary" />

		<v-main>
			<router-view :key="$route.fullPath"></router-view>
		</v-main>
		
		<AppFooter color="primary" />

		<Snackbar />
	</v-app>
</template>

<script setup>
	import AppFooter from './components/AppFooter.vue';
	import NavigationBar from './components/NavigationBar.vue';
	import Snackbar from './components/Snackbar.vue';
</script>

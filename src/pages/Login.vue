<template>
    <v-container>
		<v-card
			class="pa-5"
			width="400px"
		>
			<v-card-title class="justify-center">Login</v-card-title>
	
			<v-card-text>
				<v-form ref="form">
					<v-text-field
						v-model="username"
						:rules="[isRequired('Username')]"
						label="Username"
						variant="underlined"
						dense
					></v-text-field>
		
					<v-text-field
						v-model="password"
						:rules="[isRequired('Password')]"
						class="mt-4"
						label="Password"
						type="password"
						variant="underlined"
						dense
					></v-text-field>
		
					<v-btn
						class="mt-4"
						color="primary"
						block
						@click="handleLogin"
					>
					Login
					</v-btn>
				</v-form>
			</v-card-text>
		</v-card>
    </v-container>
</template>
  
<script setup>
    import { apiRequest } from '@/utils/Api';
	import { isRequired } from '@/utils/Rules';
    import { ref } from 'vue';
	import { showSuccess, showError } from '@/utils/Snackbar';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	const form = ref(null);
    const username = ref('');
    const password = ref('');
    
    async function handleLogin() {
		const isValid = (await form.value.validate()).valid;

		if (isValid) {
			console.log('hi');
			try {
				var response = await apiRequest({
					path: '/users/login',
					method: 'POST',
					data : {
						username: username.value,
						password: password.value
					}
				});

				showSuccess('User logged in successfully.');

				router.push('/');
			} catch(e) {
				if (e?.response?.data) {
					showError(`User could not be logged in: ${e.response.data}`);
				} else {
					showError('User could not be logged in.');
				}
			}
		}
    }
</script>
  
<style scoped>
    .v-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>
  
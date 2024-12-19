<template>
    <v-container>
		<v-card
			class="pa-5"
			width="400px"
			border
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
    import { apiRequest } from '@/utils/api';
	import { isRequired } from '@/utils/rules';
    import { ref } from 'vue';
	import { showError } from '@/utils/snackbar';
	import { useAuth } from '@/utils/auth';
	import { useRouter } from 'vue-router';

	const auth = useAuth();
	const router = useRouter();

	const form = ref(null);
    const username = ref('');
    const password = ref('');
    
    async function handleLogin() {
		const isValid = (await form.value.validate()).valid;

		if (isValid) {
			try {
				var response = await apiRequest({
					path: '/users/login',
					method: 'POST',
					data : {
						username: username.value,
						password: password.value
					}
				});

				auth.storeToken(response.token);

				await router.push('/');
				location.reload();
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
  
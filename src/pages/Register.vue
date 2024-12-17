<template>
<v-container>
	<v-card class="pa-5" width="500">
		<v-card-title class="justify-center">Register</v-card-title>

		<v-card-text>
			<v-form ref="form">
				<v-text-field
					v-model="name"
					:rules="[isRequired('Name'), validateMaxLength(50)]"
					label="Name"
					variant="underlined"
					dense
				></v-text-field>

				<v-text-field
					v-model="surname"
					:rules="[isRequired('Surname'), validateMaxLength(50)]"
					class="mt-4"
					label="Surname"
					variant="underlined"
					dense
				></v-text-field>

				<v-text-field
					v-model="userName"
					:rules="[isRequired('User Name'), validateMaxLength(256)]"
					label="Username"
					variant="underlined"
					dense
					class="mt-4"
				></v-text-field>

				<v-text-field
					v-model="email"
					:rules="[isRequired('Email'), validateEmail(), validateMaxLength(256)]"
					class="mt-4"
					label="Email"
					variant="underlined"
					dense
				></v-text-field>

				<v-text-field
					v-model="password"
					:rules="[isRequired('Password'), validatePassword()]"
					class="mt-4"
					label="Password"
					type="password"
					variant="underlined"
					dense
				></v-text-field>

				<v-text-field
					v-model="passwordConfirmation"
					:rules="[isRequired('Confirmation password'), value => value === password || 'Passwords do not match']"
					class="mt-4"
					label="Confirm Password"
					type="password"
					variant="underlined"
					dense
				></v-text-field>

				<v-btn
					class="mt-4"
					color="primary"
					block
					@click="handleRegister"
				>
					Register
				</v-btn>
			</v-form>
		</v-card-text>
	</v-card>
</v-container>
</template>

<script setup>
	import { apiRequest } from '@/utils/api';
	import { ref } from 'vue';
	import { showError } from '@/utils/snackbar';
	import { useRouter } from 'vue-router';
	import { validateEmail, validateMaxLength, validatePassword, isRequired } from '@/utils/rules';

	const router = useRouter();

	const form = ref(null);
	const name = ref('');
	const surname = ref('');
	const userName = ref('');
	const email = ref('');
	const password = ref('');
	const passwordConfirmation = ref('');

	async function handleRegister() {
		const isValid = (await form.value.validate()).valid;

		if (isValid) {
			try {
				await apiRequest({
					path: '/users/register',
					method: 'POST',
					data : {
						name: name.value,
						surname: surname.value,
						userName: userName.value, 
						email: email.value,
						password: password.value,
						passwordConfirmation: passwordConfirmation.value
					}
				});

				router.push('/Login');
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
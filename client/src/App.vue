<template>
	<v-app id="app">
		<!-- Application Bar -->
		<v-app-bar
			app
		>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-spacer></v-spacer>
			<v-toolbar-title>Spending Dashboard</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-help-circle</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-forum</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-account-circle</v-icon>
			</v-btn>
		</v-app-bar>

		<!-- Navigation Drawer -->
		<v-navigation-drawer
			v-model="drawer"
			app
			color="blue"
		>
			<v-list>
				<!-- Title/Home Page -->
				<v-list-item two-line :to="{path: '/'}">
					<v-list-item-avatar>
						<v-icon>mdi-information</v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="title">
							Home
						</v-list-item-title>
						<v-list-item-subtitle>
							Spending Overview
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				
				<v-divider></v-divider>

				<!-- Table and Chart View options -->
				<v-list-item color="white" :to="{path: '/table'}">
					<v-list-item-icon>
						<v-icon>mdi-clipboard</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Table</v-list-item-title>
				</v-list-item>

				<v-list-item color="white" :to="{path: '/charts'}">
					<v-list-item-icon>
						<v-icon>mdi-clipboard</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Charts</v-list-item-title>
				</v-list-item>
			</v-list>
			<template v-slot:append>
				<div class="pa-2">
					<v-btn block>Logout</v-btn>
				</div>
			</template>
		</v-navigation-drawer>

		<!-- Dashboard Content -->
		<v-content>
			<v-container fluid>
				<v-fade-transition mode="out-in">
					<router-view :transaction_data="transaction_data"></router-view>
				</v-fade-transition>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import TransactionService from './services/TransactionService.js';

export default {
	name: 'app',
	components: {
	},
	data () {
		return {
			filename: 'App.vue',
			transaction_data: [
			],
			drawer: null,
			left: false,
		}
	},
	created() {
		this.getTransactions();
	},

	methods: {
		async getTransactions() {
			TransactionService.getTransactions().then((transactions) => {
				this.$set(this, "transaction_data", transactions);
			});
		},
	},

	computed: {

	},
}
</script>
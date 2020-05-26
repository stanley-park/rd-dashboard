<!-- Set up the charts with a filtering toolbar -->
<template>
	<v-container>
		<v-row>
			<!-- Filter options toolbar -->
			<v-col cols="12" md="12">
				<v-expansion-panels>
					<v-expansion-panel>
						<v-expansion-panel-header class="title">
							Filters
						</v-expansion-panel-header>

						<!-- Filter options -->
						<v-expansion-panel-content>
							<v-toolbar height="80px">

								<!-- Date range picker -->
								<v-col cols="3">
									<v-spacer></v-spacer>
										<v-menu
										ref="dateRangeMenu"
										v-model="dateRangeMenu"
										:close-on-content-click="false"
										:return-value.sync="dateRangeFilter"
										transition="scale-transition"
										offset-y
										min-width="290px"
										>
											<template v-slot:activator="{ on }">
												<v-text-field
												v-model="dateRangeFilter"
												label="Date Range"
												prepend-icon="mdi-calendar-today"
												hide-details="auto"
												readonly
												v-on="on"
												></v-text-field>
											</template>
											<v-date-picker v-model="dateRangeFilter" no-title range>
												<v-spacer></v-spacer>
												<v-btn text color="primary" @click="dateRangeMenu = false">Cancel</v-btn>
												<v-btn text color="primary" @click="$refs.dateRangeMenu.save(dateRangeFilter)">OK</v-btn>
											</v-date-picker>
										</v-menu>
								</v-col>
								<v-spacer></v-spacer>

								<!-- Payment amount filter -->
								<v-col cols="3">
									<v-menu
									ref="paymentRange"
									:close-on-content-click="false"
									:return-value.sync="paymentRange"
									transition="scale-transition"
									offset-y
									min-wdth="290px"
									>
										<template v-slot:activator="{ on }">
											<v-text-field
											v-model="paymentRange"
											label="Range of Total Payment"
											prefix="$"
											hide-details="auto"
											readonly
											v-on="on">
											</v-text-field>
										</template>
										<v-card>
											<v-container>
												<v-card-title>Enter payments range</v-card-title>
												<v-card-text>
													<v-text-field
													v-model="minAmount"
													label="Min Amount"
													prefix="$"
													:rules="[paymentsRules.num, paymentsRules.positive, paymentsRules.minLessThanMax]"
													hide-details="auto">
													</v-text-field>
													<br>
													<v-text-field
													v-model="maxAmount"
													label="Max Amount"
													prefix="$"
													:rules="[paymentsRules.num, paymentsRules.positive, paymentsRules.minLessThanMax]"
													hide-details="auto">
													</v-text-field>
												</v-card-text>
												<v-btn text color="primary" @click="paymentRange = null">Cancel</v-btn>
												<v-btn text color="primary" @click="$refs.paymentRange.save([minAmount, maxAmount])">OK</v-btn>
											</v-container>
										</v-card>
									</v-menu>
								</v-col>
								<v-spacer></v-spacer>

								<!-- Project Type filter -->
								<v-col cols="3">
									<v-select
										:items="['In-Person', 'Remote']"
										v-model="typeFilter"
										label="Research Conduct Types"
										hide-details>
									</v-select>
								</v-col>

								<!-- Apply or Reset filters -->
								<v-col align="right" cols="3">
									<v-btn color="success" @click="filterData">
										Apply
									</v-btn>
									&emsp;
									<v-btn color="warning" @click="resetFilters">
										Reset
									</v-btn>
								</v-col>
							</v-toolbar>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>

			<!-- Spend by month chart -->
			<v-col cols="12" md="12">
				<v-card
				>
					<v-app-bar
					color="blue"
					>
					<v-toolbar-title>
						Monthly Spending
					</v-toolbar-title>
					<v-spacer></v-spacer>
					</v-app-bar>
					<v-card-text>
						<spend-by-month :filters="filters" :chart-data="transaction_data"></spend-by-month>
					</v-card-text>
				</v-card>
			</v-col>

			<!-- Spend by type of project chart -->
			<v-col cols="6" md="6" sm="12">
				<v-card>
					<v-app-bar
					color="blue"
					>
						<v-toolbar-title>
							Spending by Research Type
						</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-app-bar>
					<v-card-text>
						<spend-by-type :filters="filters" :chartData="transaction_data"></spend-by-type>
					</v-card-text>
				</v-card>
			</v-col>

			<!-- Spend by user Id chart -->
			<v-col cols="6" md="6" sm="12">
				<v-card>
					<v-app-bar
					color="blue"
					>
						<v-toolbar-title>
							Monthly Spending By User
						</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-app-bar>
					<v-card-text>
						<spend-by-user :filters="filters" :chartData="transaction_data"></spend-by-user>
					</v-card-text>
				</v-card>
			</v-col>

			<!-- Spend by month with separated by types chart -->
			<v-col cols="12" md="12" sm="12">
				<v-card>
					<v-app-bar
					color="blue"
					>
						<v-toolbar-title>
							Monthly Spending by Research Type
						</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-app-bar>
					<v-card-text>
						<spend-by-type-over-time :filters="filters" :chartData="transaction_data"></spend-by-type-over-time>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
// Imports for the Chart components
import SpendByMonth from './SpendByMonth'
import SpendByType from './SpendByType'
import SpendByTypeOverTime from './SpendByTypeOverTime'
import SpendByUser from './SpendByUser'

export default {
	props: ["transaction_data"],
	components: {
		SpendByMonth,
		SpendByType,
		SpendByTypeOverTime,
		SpendByUser
	},

	// Setup/variables for filter options
	data() {
		return {
			dateRangeMenu: false,
			dateRangeFilter: ['1970-01-01','2020-05-03'],
			paymentRangeMenu: false,
			minAmount: 0,
			maxAmount: 10000,
			paymentRange: [0, 10000],
			typeFilter: '',
			filters: {'dateRange': this.dateRangeFilter, 'paymentRange': this.paymentRange, 'types': this.typeFilter},
			paymentsRules: {
				num: val => !isNaN(val) || 'Please enter a number.',
				positive: v => parseFloat(v) >= 0 || 'Price must be at least 0.',
				minLessThanMax: value => parseFloat(this.minAmount) <= parseFloat(this.maxAmount) || 'Min Amount must be <= Max Amount',
			} 
		}
	},

	// On page refresh we want to make sure the data in chart persists,
	// so we update this.filters, which is binded to each chart and watched,
	// so an update will trigger and allow the charts to still display.
	// Without it, a refresh will not reload the data, and the charts won't show.
	created() {
		this.filterData();
	},
	methods: {
		resetFilters() {
			this.dateRangeMenu = false;
			this.dateRangeFilter = ['1970-01-01','2020-05-03'];
			this.paymentRangeMenu = false;
			this.minAmount = 0;
			this.maxAmount = 10000;
			this.paymentRange = [0, 10000];
			this.typeFilter = '';
			this.filterData();
		},
		filterData() {
			this.filters = {'dateRange': this.dateRangeFilter, 'paymentRange': this.paymentRange, 'types': this.typeFilter};
		}
	}
}

</script>

<style>
</style>
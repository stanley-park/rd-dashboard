<!-- Setup table with a filtering toolbar -->
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
											label="Range of Total Payment "
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
									<v-btn color="success" @click="applyFilters">
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

			<!-- Transaction Table -->
			<v-col cols="12">
				<v-card>
					<v-card-title>Transaction Table
						<v-spacer></v-spacer>
						<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						label="Search Projects"
						single-line
						hide-details
						>
						</v-text-field>
					</v-card-title>
					<v-data-table
					ref="transactionTable"
					:headers="headers"
					:items="filteredData"
					:search="search"
					>
						<!-- Add extra info for each element so we don't need a lot of columns -->
						<template v-slot:item.total="{ item }">
							Total: <u>{{ item.total }}</u>, 
							<!-- Comment below two lines for not as dense element -->
							Fee: {{ item.fee }},
							<br>Inct: {{ item.incentive }}, Tip: {{ item.tip }},
						</template>
						<template v-slot:item.respondent.firstName="{ item }">
							<i>{{ item.respondent.lastName }}</i>, {{ item.respondent.firstName }}
						</template>
						<template v-slot:item.project.researchConductType="{ item }">
							{{ item.project.researchConductType }}<br>{{ item.project.location }}
						</template>
						<template v-slot:item.organization.name="{ item }">
							{{ item.organization.name }}<br><i>{{ item.organization.billingEmail }}</i>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import TransactionService from '../services/TransactionService.js';

export default {
	props: ["transaction_data"],
	components: {
	},

	// On page refresh we want to make sure the data in table persists,
	// so we send GET request to database. If we relied on props' data,
	// we wouldn't be able to filter the data, since props modification is not allowed.
	// In order to filter data and persist data on refresh, we call db
	// every time page is created.
	created() {
		this.getTransactions();
	},
	methods: {
		async getTransactions() {
			TransactionService.getTransactions().then((transactions) => {
				this.$set(this, "filteredData", transactions);
			});
		},
		resetFilters() {
			this.dateRangeMenu = false;
			this.dateRangeFilter = ['1970-01-01','2020-05-03'];
			this.paymentRangeMenu = false;
			this.minAmount = 0;
			this.maxAmount = 10000;
			this.paymentRange = [0, 10000];
			this.typeFilter = '';
			this.filteredData = this.transaction_data;
		},
		applyFilters() {
			this.filters = {'dateRange': this.dateRangeFilter, 'paymentRange': this.paymentRange, 'types': this.typeFilter};
			
			// Call the utils/mixin filterData function to get our data that's filtered
			this.filteredData = this.UTIL_filterData(this.transaction_data, this.filters, 'Table');
		},
	},
	data () {
		return {
			search: '',
			headers: [
				{ text: 'Date', value: 'project.createdAt'},
				{ text: 'Payment Amounts', value: 'total'},
				{ text: 'Project', value: 'project.name'},
				{ text: 'Research Type and Location', value: 'project.researchConductType'},
				{ text: 'Audience', value: 'project.talkToAudience'},
				{ text: 'Respondent (last, first)', value: 'respondent.firstName'},
				{ text: 'Respondent Email', value: 'respondent.email'},
				{ text: 'Organization', value: 'organization.name'},
			],
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
				minLessThanMax: value => this.minAmount <= this.maxAmount || 'Min Amount must be <= Max Amount',
			},

			// filteredData is what the table is pointed to, but originally
			// we will use the props data as it is unmodified.
			filteredData: this.transaction_data
		}
	},
}
</script>

<style>

</style>
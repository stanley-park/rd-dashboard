<!-- Monthly Spending Chart -->
<script>
import { Line } from 'vue-chartjs'

// Below is the recommended method to use vue-chartjs with 
// chart data from props and a computed this.data to update
// on any data/filter change.
export default {
	extends: Line,
	name: 'spend-by-month',
	props: ['chartData', 'filters'],
	created() {
	},
	mounted() {
		this.renderLineChart();
	},
	computed: {
		// Call our global/mixin util function to apply 
		// filters (if any) with specified data return type
		data: function() {
			return this.UTIL_filterData(this.chartData, this.filters, 'SpendByMonth');
		}
	},
	methods: {
		renderLineChart: function() {
			this.renderChart(
				{
					labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'],
					datasets: [
								{
									label: 'Spending by Month',
									backgroundColor: 'rgba(63, 150, 191, 0.8)',
									data: this.data,
								}
					],
				}, 
				{
					responsive: true, 
					maintainAspectRatio: false, 
					scales: {
						xAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: 'Month'
							}
						}],
						yAxes: [{
							display: true,
							scaleLabel: {
								display: true,
							labelString: 'Spent (USD)'
							}
						}]
					} 
				}
			);
		},
	},

	// Watch and update charts if chartData changes
	// OR filters changes (which happens when the filter
	// toolbar clicks apply changes).
	watch: {
		chartData: function() {
			this.renderLineChart();
		},
		filters: function() {
			this.renderLineChart();
		}
	}
}

</script>

<style>
</style>
<!-- Spending by User chart -->
<script>
import { Bar } from 'vue-chartjs'

export default {
	extends: Bar,
	name: 'spend-by-user',
	props: ['chartData', 'filters'],
	created() {
	},
	mounted() {
		this.renderBarChart();
	},
	computed: {
		// Call our global/mixin util function to apply 
		// filters (if any) with specified data return type
		data: function() {
			return this.UTIL_filterData(this.chartData, this.filters, 'SpendByUser');
		}
	},
	methods: {
		renderBarChart: function() {
			this.renderChart(
				{
					labels: ['Current User'],
					datasets: [
								{
									label: 'Spending for current user',
									backgroundColor: 'rgba(63, 150, 191, 0.8)',
									data: this.data,
								}
					],
				}, 
				{
					responsive: true, 
					maintainAspectRatio: false, 
					scales: {
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
			this.renderBarChart();
		},
		filters: function() {
			this.renderBarChart();
		}
	}
}

</script>

<style>
</style>
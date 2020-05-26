<!-- Monthly Spending by Research Type Chart -->
<script>
import { Bar } from 'vue-chartjs'

export default {
	extends: Bar,
	name: 'spend-by-type-over-time',
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
			return this.UTIL_filterData(this.chartData, this.filters, 'SpendByTypeOverTime');
		}
	},
	methods: {
		renderBarChart: function() {
			this.renderChart(
				{
					labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'],
					datasets: [
								{
									label: 'In-Person',
									backgroundColor: 'rgba(63, 150, 191, 0.8)',
									data: this.data.inPerson,
								},
								{
									label: 'Remote',
									backgroundColor: 'rgba(223, 71, 71, 0.69)',
									data: this.data.remote,
								},
					]
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
		}
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
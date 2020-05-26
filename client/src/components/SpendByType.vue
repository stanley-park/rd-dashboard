<!-- Spending by Research Type Chart -->
<script>
import { Pie } from 'vue-chartjs'

export default {
	extends: Pie,
	name: 'spend-by-type',
	props: ['chartData', 'filters'],
	created() {
	},
	mounted() {
		this.renderPieChart();
	},
	computed: {
		// Call our global/mixin util function to apply 
		// filters (if any) with specified data return type
		data: function() {
			return this.UTIL_filterData(this.chartData, this.filters, 'SpendByType');
		}
	},
	methods: {
		renderPieChart: function() {
			this.renderChart(
				{
					labels: ['In-Person', 'Remote'],
					datasets: [
								{
									backgroundColor: ['rgba(63, 150, 191, 0.8)', 'rgba(223, 71, 71, 0.69)'] ,
									data: this.data,
								},
					],
				}, 
				{
					responsive: true, 
					maintainAspectRatio: false,
				}
			);
		}
	},
	
	// Watch and update charts if chartData changes
	// OR filters changes (which happens when the filter
	// toolbar clicks apply changes).
	watch: {
		chartData: function() {
			this.renderPieChart();
		},
		filters: function() {
			this.renderPieChart();
		}
	}
}

</script>

<style>
</style>
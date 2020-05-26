import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import App from './App.vue'
import HomeView from './components/HomeView'
import TableView from './components/TableView'
import ChartView from './components/ChartView'

Vue.use(VueRouter);
Vue.use(Vuetify);

// Util/filtering methods.
Vue.mixin({
	methods: {

		// Each chart/table shares a lot of similar code, but still needs a few more
		// formatting to be able to be returned and used.
		updateResult(rdt, res, month, transactionTotal, projectType, transaction) {
			switch (rdt) {
				case 'SpendByMonth':
					res[month] = parseFloat(res[month]) + parseFloat(transactionTotal);
					break;
				case 'SpendByType':
					if (projectType === 'In-Person') {
						res[0] += parseFloat(transactionTotal);
					} else if (projectType === 'Remote') {
						res[1] += parseFloat(transactionTotal);
					}
					break;
				case 'SpendByTypeOverTime':
					if (projectType === 'In-Person') {
						res.inPerson[month] = parseFloat(res.inPerson[month]) + parseFloat(transactionTotal);
					} else if (projectType === 'Remote') {
						res.remote[month] = parseFloat(res.remote[month]) + parseFloat(transactionTotal);
					}
					break;
				case 'SpendByUser':
					res[0] = parseFloat(res[0]) + parseFloat(transactionTotal);
					break;
				case 'Table':
					res.push(transaction);
					break;
				default:
					console.log('TODO: Implement this type of datatype: ' + rdt);
			}
		},

		// Whenever data needs to be filtered, it's called here. 
		// Each display format (chart/table) needs a slightly different return type.
		UTIL_filterData(chartData, filters, chartDataType) {
			let retDataTypes = {
				'SpendByMonth': [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],
				'SpendByType': [0, 0],
				'SpendByTypeOverTime': {'inPerson':[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]], 'remote': [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]},
				'SpendByUser': [0],
				'Table': [],
			}

			// Checks if each transaction for this dataset is within our filters
			chartData.forEach((transaction) => {
				let projectType = transaction.project.researchConductType;
				let projectDate = transaction.createdAt;
				let projectTotal = parseFloat(transaction.total);
				let month = parseInt(projectDate.substring(5,7))-1;
				let dateStart = filters.dateRange[0];
				let dateEnd = filters.dateRange[1];
				let minPayment = parseFloat(filters.paymentRange[0]);
				let maxPayment = parseFloat(filters.paymentRange[1]);

				// Since by default we have date range and total price range, 
				// we check if there are filters on project type. If not, 
				// make sure transaction is within date/price range, otherwise
				// also make sure the type is correct.
				if ((!filters.types || filters.types === projectType) && 
					dateStart <= projectDate && projectDate <= dateEnd &&
					minPayment <= projectTotal && projectTotal <= maxPayment) {
					
					this.updateResult(chartDataType, retDataTypes[chartDataType], month, projectTotal, projectType, transaction);
				}
			});
			return retDataTypes[chartDataType];
		}
	}
})

let router = new VueRouter({
	routes: [
		{ path: '', name: 'Home', component: HomeView },
		{ path: '/table', name: 'Table View', component: TableView },
		{ path: '/charts', name: 'Chart View', component: ChartView }
	]
});

new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(),
  render: h => h(App)
});

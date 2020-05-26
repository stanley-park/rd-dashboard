import axios from 'axios'

// Client-side endpoints to be called with axios
export default {
	
	// Like ./server/services/transaction.service.js, originally had the
	// other routes used, but real-time filtering needs all data so only getAll is used.
	async getTransactions() {
		let res = await axios.get('http://localhost:3000/api/transactions');
		return res.data;
	},

	// async getMonthlyTotals() {
	// 	let res = await axios.get('http://localhost:3000/api/transactions/totals/monthly');
	// 	return res.data;
	// },

	// async getProjectTypeTotals() {
	// 	let res = await axios.get('http://localhost:3000/api/transactions/totals/types');
	// 	return res.data;
	// },

	// async getMonthlyTypesTotals() {
	// 	let res = await axios.get('http://localhost:3000/api/transactions/totals/monthly/types');
	// 	return res.data;
	// }
}
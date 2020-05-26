const Transaction = require('../models/transaction.model')

// Database endpoints. Originally had all the logic/formatting done here,
// but real-time filtering required all the data, so only getAll is used
module.exports = {
	getAll(req, res) {
		Transaction.find({},{}, (err, transactions) => {
			this._handleResponse(err, transactions, res);
		});
	},

	getMonthlyTotals(req, res) {
		Transaction.aggregate([{$group: {_id: {$substr: ['$createdAt', 5, 2]}, monthlyTotals: {$sum: '$total'}}}], (err, totals) => {
			let monthlyTotals = [['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0']];
			totals.forEach((month) => {
				monthlyTotals[parseInt(month._id)-1] = month.monthlyTotals;
			});
			this._handleResponse(err, monthlyTotals, res);
		});
	},

	getTypesTotals(req, res) {
		Transaction.aggregate([{$group: {_id: '$project.researchConductType', typeTotals: {$sum: '$total'}}}], (err, totals) => {

			totals.sort(function(a, b) {
				if (a._id < b._id) {
					return -1
				}
				if (a._id > b._id) {
					return 1
				}
				return 0;
			})
			let data = []
			totals.forEach((type) => {
				data.push(type.typeTotals);
			})
			this._handleResponse(err, data, res);
		});
	},

	getMonthlyTypesTotals(req, res) {
		let data = {}
		Transaction.aggregate([{$match: {'project.researchConductType': "In-Person"}}, {$group: {_id: {$substr: ['$createdAt', 5, 2]}, monthlyTotals: {$sum: '$total'}}}], (err, totals) => {
			let inPersonMonthlyTotals = [['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0']];
			if (err) {
				res.status(400).end();
			} else {
				totals.forEach((month) => {
					inPersonMonthlyTotals[parseInt(month._id)-1] = month.monthlyTotals;
				});
				Transaction.aggregate([{$match: {'project.researchConductType': "Remote"}}, {$group: {_id: {$substr: ['$createdAt', 5, 2]}, monthlyTotals: {$sum: '$total'}}}], (err, totals) => {
					let remoteMonthlyTotals = [['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0'],['0']];
					if (err) {
						res.status(400).end();
					} else {
						totals.forEach((month) => {
							remoteMonthlyTotals[parseInt(month._id)-1] = month.monthlyTotals;
						});
						data['remote'] = remoteMonthlyTotals;
						res.send({'inPerson': inPersonMonthlyTotals, 'remote': remoteMonthlyTotals});
					}
				});
			}
		});
	},

	_handleResponse(err, data, res) {
		if (err) {
			res.status(400).end()
		} else {
			res.send(data)
		}
	}
}
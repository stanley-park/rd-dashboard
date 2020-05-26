const config = require('../config/index');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Types = Schema.Types

const TransactionSchema = new Schema({
	project: {
		kindOfResearch: Types.String,
		createdAt: Types.String,
		location: {type: String, required: false},
		name: Types.String,
		researchConductType: Types.String,
		talkToAudience: Types.String
	},
	fee: Types.Number,
	respondent: {
		lastName: Types.String,
		email: Types.String,
		firstName: Types.String
	},
	createdAt: Types.String,
	organization: {
		name: Types.String,
		billingEmail: Types.String
	},
	total: Types.Number,
	tip: Types.Number,
	id: Types.String,
	incentive: Types.Number
})

module.exports = mongoose.model('Transaction', TransactionSchema, config.collectionName)
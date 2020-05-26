const express = require('express')
const router = express.Router()
const transactionService = require('../services/transaction.service')

// Originally all the other routes were used, but real-time filtering needs
// all data so only getAll is used.
router.get('/transactions', transactionService.getAll.bind(transactionService));

// router.get('/transactions/totals/monthly', transactionService.getMonthlyTotals.bind(transactionService));
// router.get('/transactions/totals/monthly/types', transactionService.getMonthlyTypesTotals.bind(transactionService));
// router.get('/transactions/totals/types', transactionService.getTypesTotals.bind(transactionService));

module.exports = router
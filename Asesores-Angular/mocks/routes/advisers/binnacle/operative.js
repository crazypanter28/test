const router = require('express').Router();
const path = require('path')


router.get('/bank', (req, res) => {
    res.json(require('../../../models/advisers/binnacle/operative-bank.json'));
})


router.get('/stock-exchange', (req, res) => {
    res.json(require('../../../models/advisers/binnacle/operative-stock-exchange.json'));
})


module.exports = router;

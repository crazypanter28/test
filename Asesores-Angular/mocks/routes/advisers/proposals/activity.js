const router = require('express').Router();
const path = require('path')


router.get('/offices', (req, res) => {
    res.json(require('../../../models/advisers/proposals/activity-offices.json'));
})


module.exports = router;

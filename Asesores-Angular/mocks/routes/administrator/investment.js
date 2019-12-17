const router = require('express').Router();



router.get('/Asesores/Fund/getFundTypes', (req, res) => {
    res.json(require('../../models/administrator/investment/fundsType.json'));
})



module.exports = router;

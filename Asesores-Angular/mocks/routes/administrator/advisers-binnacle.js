const router = require('express').Router();
const path = require('path')


router.get('/messages', (req, res) => {
    res.json(require('../../models/administrator/binnacle/query-messages.json'));
})


router.get('/message', (req, res) => {
    res.json(require('../../models/administrator/binnacle/query-message.json'));
})


router.post('/binnacle', (req, res) => {
    res.download( path.resolve( __dirname, '../../models/administrator/binnacle/Bitacora-20170606-20170614.xlsx' ) );
})


module.exports = router;

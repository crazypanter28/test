const router = require('express').Router();



router.get('/getMessages', (req, res) => {
    res.json(require('../../models/administrator/messages/messages.json'));
})



module.exports = router;

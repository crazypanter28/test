const router = require('express').Router();


router.get('/Asesores/Presentation/getTypes/', (req, res) => {
    res.json(require('../../models/administrator/presentations/getTypes.json'));
})

router.get('/Asesores/Presentation/getPresentationsByType/:id', (req, res) => {
    var params = req.params;
    var product = parseInt( params.id );

    setTimeout(function() {
        if( product === 1 || product === 2 ){
            res.json(require('../../models/administrator/presentations/getPresentationsByType-' + params.id + '.json'));
        }
        else{
            res.json(require('../../models/administrator/presentations/getPresentationsByType-1.json'));
        }
    }, 500);
})



module.exports = router;

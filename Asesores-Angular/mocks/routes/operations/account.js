const routes = require('express').Router();

routes.get('/bema-restful/api/eactinver/cu', (req, res) => {
    setTimeout(function() {
        if(req.query.descripcion === 'null'){
            res.json(require('../../models/operaciones/account/client-error.json'));
        } else {
            res.json(require('../../models/operaciones/account/client.json'));
        }
    }, 150);
});

routes.get('/BalanceRest/usm04/:client', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/account/contracts.json'));
    }, 150);
});

routes.get('/BalanceRest/usm13/:contract', (req, res) => {

    setTimeout(function(){
        if(req.params.contract === '[{"idContrato":"nosaldo"}]'){
            res.json(require('../../models/operaciones/account/nobalance/contract-historical.json'));
        } else if(req.params.contract === '[{"idContrato":"nosaldo3000228"}]') {
            res.json(require('../../models/operaciones/account/nobalance/contract-historical.json'));
        } else if(req.params.contract === '[{"idContrato":"nosaldo4000228"}]') {
            res.json(require('../../models/operaciones/account/nobalance/contract-historical2.json'));
        } else {
            if(req.params.contract === '[{"idContrato":"3000228"}]'){
                res.json(require('../../models/operaciones/account/contract-historical.json'));
            } else {
                res.json(require('../../models/operaciones/account/contract-historical2.json'));
            }
        }
    }, 150);

});

module.exports = routes;
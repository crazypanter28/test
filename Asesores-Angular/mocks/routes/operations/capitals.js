const routes = require('express').Router();
// '/MarketInfoRest/bpc01/3000228/2/2/0/0/1?language=SPA'   IPC
// '/MarketInfoRest/bpc01/3000228/2/5/0/0/1?language=SPA'   BMV
// '/MarketInfoRest/bpc01/3000228/5/5/0/0/1?language=SPA'   SIC
// '/MarketInfoRest/bpc01/3000228/3/5/0/0/1?language=SPA'   TRACK-INT
// '/MarketInfoRest/bpc01/3000228/8/5/0/0/1?language=SPA'   TRACK-deuda
// '/MarketInfoRest/bpc01/3000228/2/3/0/0/1?language=SPA'   + BURSATILES
// '/MarketInfoRest/bpc01/3000228/2/4/0/0/1?language=SPA'   - BURSATILES
// '/MarketInfoRest/bpc01/3000228/1/5/0/0/1?language=SPA'   all

routes.get('/MarketInfoRest/bpc01/:contract/:id1/:id2/:id/:id/:id', (req, res) => {
    var params = req.params;
    var req1 = params.id1;
    var req2= params.id2;

    setTimeout(function(){
        if( req2 === "2"  && req2 === "2" ){     //IPC
            res.json(require('../../models/operaciones/investment/capitals/stations/ipc.json'));
        }
        else if ( req1 === '2' && req2 == '5' ) {   //BMV
            res.json(require('../../models/operaciones/investment/capitals/stations/bmv.json'));
        }
        else if ( req1 === '5' && req2 == '5' ) {   //SIC
            res.json(require('../../models/operaciones/investment/capitals/stations/sic.json'));
        }
        else if ( req1 === '3' && req2 == '5' ) {   //TRACK-INT
            res.json(require('../../models/operaciones/investment/capitals/stations/track-int.json'));
        }
        else if ( req1 === '8' && req2 == '5' ) {   //TRACK-deuda
            res.json(require('../../models/operaciones/investment/capitals/stations/track-deuda.json'));
        }
        else if ( req1 === '2' && req2 == '3' ) {   // + BURSATILES
            res.json(require('../../models/operaciones/investment/capitals/stations/plus-bursatiles.json'));
        }
        else if ( req1 === '2' && req2 == '4' ) {   // + BURSATILES
            res.json(require('../../models/operaciones/investment/capitals/stations/minus-bursatiles.json'));
        }
        else if ( req1 === '1' && req2 == '5' ) {   // all
            res.json(require('../../models/operaciones/investment/capitals/stations/all.json'));
        }
        else{
            res.json(require('../../models/operaciones/investment/capitals/stations/all.json'));
        }
    }, 500 );
});

routes.get('/commission/bpc35/:contract', (req, res) => {
    var params = req.params;

    res.json( require('../../models/operaciones/investment/capitals/ipc/commission.json') );
});

routes.get('/commission/bpc34/:contract', (req, res) => {
    var params = req.params;

    res.json( require('../../models/operaciones/investment/capitals/ipc/commission2.json') );
});

routes.get('/OrdersRest/bpc11/:contract/:id/', (req, res) => {

    setTimeout(function() {
        res.json(require('../../models/operaciones/investment/capitals/portfolioAcciones.json'));
    }, 500);
});


routes.get('/CapitalMarketRest/bpc21/:contract/:type/', (req, res) =>{
    var params = req.params;
    if( params.type === 'TS' ){
        res.json( require('../../models/operaciones/investment/capitals/trailing-stop.json') );
    }
    else{   //SL
        res.json( require('../../models/operaciones/investment/capitals/stop-loss.json') );
    }
});

/**  DOLL **/
routes.get('/CatalogsRest/bpc07/:id/:id/', (req, res) =>{
    res.json( require('../../models/operaciones/investment/capitals/doll/typeOrder.json') );
});

/** quotation doll **/
routes.post('/CapitalMarketRest/bpc14', (req, res) =>{
    var body = req.body;
    if( body.titlesQty > 20 ){
        res.json( require('../../models/operaciones/investment/capitals/doll/confirmation-error.json') );
    }
    else{
        res.json( require('../../models/operaciones/investment/capitals/doll/confirmation.json') );
    }
});

/** capture doll */
routes.post('/CapitalMarketRest/bpc13', (req, res) =>{
    res.json( require('../../models/operaciones/investment/capitals/doll/capture.json') );
});



/** DOLL **/


module.exports = routes;

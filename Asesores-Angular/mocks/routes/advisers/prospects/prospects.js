const routes = require('express').Router();


/**generic**/
routes.get('/getProsGraphics/:advisers/:admin/:userID', (req, res) => {
    res.json(require('../../../models/advisers/prospects/graphics/graphics.json'));
});

routes.get('/getProsReports/:date/:type/:userID', (req, res) => {
    setTimeout(function(){
        res.json(require('../../../models/advisers/prospects/graphics/reports.json'));
    }, 500)
});

routes.post( '/Prospect/save' , (req,res) =>{
    res.json(require('../../../models/advisers/prospects/graphics/reports.json'));
})
/**generic**/

/** combos */
routes.get('/prospect/profile/', (req, res) => {
    res.json(require('../../../models/advisers/prospects/combos/profile.json'));
});

routes.get('/prospect/TPC/', (req, res) => {
    res.json(require('../../../models/advisers/prospects/combos/TPC.json'));
});

routes.get('/prospect/PT/', (req, res) => {
    res.json(require('../../../models/advisers/prospects/combos/phoneType.json'));
});

/** combos */


/* detail */
routes.get('/Asesores/Prospect/getDetail/:idProspect/:idStage?/', (req, res) => {
    var params = req.params;
    if( !params.idStage ){
        res.json(require('../../../models/advisers/prospects/getDetail2.json'));
    }
    else{
        res.json(require('../../../models/advisers/prospects/getDetail.json'));
    }
});

routes.post('/Asesores/Prospect/nextStage/', (req, res) => {
    var params = req.body;
    res.json(require('../../../models/advisers/prospects/nextStage.json'));
});
/* detail */


routes.get('/getStages/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/prospects/getStages.json'));
    }, 500);
});

routes.get('/getListByEmployee/:id', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/prospects/getListByEmployee.json'));
    }, 500);
});

routes.get('/tableAdmin/:cat', (req, res) => {
    var params = req.params;
    setTimeout(function() {
        res.json(require('../../../models/advisers/prospects/tableAdmin.json'));
    }, 500);
});



module.exports = routes;

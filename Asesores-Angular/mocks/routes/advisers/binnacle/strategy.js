const routes = require('express').Router();

routes.get('/Asesores/Contract/getSponsorList/:employeeID/:month/:year/TODOS', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/todos.json'));
    }, 150);
});

routes.get('/Asesores/ActivityLog/getBirthDays/:employeeID', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/get-birthdays.json'));
    }, 150);
});

routes.get('/Asesores/Contract/getDetailsOfContract/:employeeID/:sponsor/:contract/:month/:year', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/client-details.json'));
    }, 150);
});

routes.get('/Asesores/Contract/validateUser/:employeeID/:contract', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/client-type.json'));
    }, 150);
});

routes.get('/Asesores/Contract/getProfile/:contract/2/2', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/client-profile.json'));
    }, 150);
});

routes.get('/Asesores/ActivityLog/getActivityCatalogRoot/TPC/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/catalog.json'));
    }, 150);
});

routes.get('/Asesores/ActivityLog/getActivityCatalogChild/:child', (req, res) => {
    var params = req.params
    setTimeout(function() {
        if( params.child === "4" || params.child === "5" ){
            res.json(require('../../../models/advisers/binnacle/strategy/catalog-child-5.json'));
        }
        else{
            res.json(require('../../../models/advisers/binnacle/strategy/catalog-child.json'));
        }
    }, 150);
});

routes.post('/Asesores/ActivityLog/saveComment/', (req, res) => {
    var body = req.body;

    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/comment.json'));
    }, 150);
});

routes.get('/getCommentsDetailsByContract/:contract/', (req, res) => {
    var params = req.params;

    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/strategy/get-comments-details-by-contract.json'));
    }, 150);
});

module.exports = routes;

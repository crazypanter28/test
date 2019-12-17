
const routes = require('express').Router();

routes.get('/ipc/', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/ipc/ipc.json'));
});

routes.get('/issuers/', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/ipc/issuers.json'));
});

routes.get('/issuers2/', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/ipc/issuers2.json'));
});




routes.get('/getNews/', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/news.json'));
});

routes.get('/getIncomes/', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/incomes.json'));
});


routes.get('/getSocial/:id?', (req, res) => {
    var params = req.params;
    if( params.id ){
        res.json(require('../../../models/advisers/dashboard/social2.json'));
    }
    else{
        res.json(require('../../../models/advisers/dashboard/social.json'));
    }
});


routes.get('/getMonthlyGoal/', (req, res) => {
    var params = req.params;
    res.json(require('../../../models/advisers/dashboard/monthlyGoal.json'));
});






module.exports = routes;

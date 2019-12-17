const routes = require('express').Router();

routes.get('/Asesores/ActivityRecord/getReport/:month/:year/:id', (req, res) => {
    var params = req.params;
        res.json(require('../../../models/advisers/proposals/ActivityRecord/act'+ params.id +'.json'));
});




module.exports = routes;

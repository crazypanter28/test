const routes = require('express').Router();



routes.get('/Asesores/Presentation/getPresentationsByType/:id', (req, res) => {
    res.json(require('../../models/advisers/presentations/presentations.json'));
});





module.exports = routes;

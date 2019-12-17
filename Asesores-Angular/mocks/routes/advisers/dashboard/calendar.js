
const routes = require('express').Router();

routes.post('/Asesores/Mail/getAppointments', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/calendar/getAppointments.json'));
});

routes.get('/Asesores/Message/getCurrentMessages/:id', (req, res) => {
    res.json(require('../../../models/advisers/dashboard/calendar/getCurrentMessages.json'));
});



module.exports = routes;

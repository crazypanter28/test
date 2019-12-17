const routes = require('express').Router();

routes.get('/Asesores/ActivityLog/getReport/:employeeID/:month/:year', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/reports/adviser-goal.json'));
    }, 150);
});

routes.get('/Asesores/ActivityLog/getUncontactedCustomers/:employeeID', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/reports/uncontacted-customers.json'));
    }, 150);
});

module.exports = routes;
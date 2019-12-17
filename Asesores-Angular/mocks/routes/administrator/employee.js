const router = require('express').Router();


router.get('/Asesores/employeeMap/getEmployeeMap/:id', (req, res) => {
    res.json(require('../../models/administrator/employee/getEmployeeMap.json'));
})



module.exports = router;

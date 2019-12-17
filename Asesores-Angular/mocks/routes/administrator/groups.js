const router = require('express').Router();


router.get('/Asesores/Meta/getGroups/', (req, res) => {
    res.json(require('../../models/administrator/groups/groups.json'));
})



router.get('/Asesores/Meta/getAllUser/', (req, res) => {
    res.json(require('../../models/administrator/groups/getAllUser.json'));
})


router.get('/Asesores/Meta/getFinancialCenters/', (req, res) => {
    res.json(require('../../models/administrator/groups/getFinancialCenters.json'));
})

router.post('/Asesores/Meta/saveFinancialCenter/', (req, res) => {
    var response = {"status":1,"messages":[{"type":null,"criticality":null,"code":null,"description":"OPERACIÓN EXITOSA"}],"result":null};
    res.json( response );
})


router.post('/Asesores/Meta/saveUser/', (req, res) => {
    var response = {"status":1,"messages":[{"type":null,"criticality":null,"code":null,"description":"OPERACIÓN EXITOSA"}],"result":null};
    res.json( response );
})


router.post('/Asesores/Meta/deleteUser/', (req, res) => {
    var response = {"status":1,"messages":[{"type":null,"criticality":null,"code":null,"description":"OPERACIÓN EXITOSA"}],"result":null};
    res.json( response );
})

router.post('/Asesores/Meta/deleteFinancialCenter/', (req, res) => {
    var response = {"status":1,"messages":[{"type":null,"criticality":null,"code":null,"description":"OPERACIÓN EXITOSA"}],"result":null};
    res.json( response );
})



module.exports = router;

const router = require('express').Router();


router.get('/Asesores/UserRole/getRoles/', (req, res) => {
    res.json(require('../../models/administrator/profiles/roles.json'));
})


router.get('/Asesores/UserRole/getUserRoles/:id', (req, res) => {
    res.json(require('../../models/administrator/profiles/userRoles.json'));
})



module.exports = router;

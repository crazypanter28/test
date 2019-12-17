const routes = require('express').Router();


routes.post('/login', (req, res) => {
    var user = req.body.username,
        pass = req.body.password;

    if (user === 'ngarcia' && pass === ',marzo17') {
        res.json(require('../models/login/loginSuccess.json'));
    }
    else if (user === 'mjuarez' && pass === ',marzo17') {
        res.json(require('../models/login/login2.json'));
    }
    else {
        res.json(require('../models/login/loginError.json'));
    }
});


routes.get('/getPermiso/:id', (req, res) => {

    var id = req.params.id;

    if( id === '599'){
        res.json(require('../models/login/permisos2.json'));
    }
    else{
        res.json(require('../models/login/permisosSuccess.json'));
    }

});



routes.post('/login', (req, res) => {
    var user = req.body.username,
        pass = req.body.password;

    if (user === 'ngarcia' && pass === ',marzo17') {
        res.json(require('../models/login/loginSuccess.json'));
    }
    else if (user === 'mjuarez' && pass === ',marzo17') {
        res.json(require('../models/login/login2.json'));
    }
    else {
        res.json(require('../models/login/loginError.json'));
    }
});

module.exports = routes;

const router = require('express').Router();
const path = require('path')
const fs = require('fs');





router.get('/Asesores/Parameters/getGlobalForecasts', (req, res) => {
    res.json(require('../../models/administrator/parameters/EEUU.json'));
})

router.get('/Asesores/Parameters/getLocalForecasts', (req, res) => {
    res.json(require('../../models/administrator/parameters/MEX.json'));
})


router.get('/Asesores/Parameters/getEconomicEnvironment', (req, res) => {
    var pathFile = path.resolve( __dirname, '../../models/administrator/parameters/getEconomicEnvironment.txt' );
    fs.readFile( pathFile, 'utf8', (e, data ) => {
        if (e) throw e;
        res.send( data )
    } )
})

router.get('/Asesores/Parameters/getAnnoucement', (req, res) => {
    var pathFile = path.resolve( __dirname, '../../models/administrator/parameters/getAnnoucement.txt' );
    fs.readFile( pathFile, 'utf8', (e, data ) => {
        if (e) throw e;
        res.send( data )
    } )
})




module.exports = router;

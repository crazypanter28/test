const routes = require('express').Router();

routes.get('/media', (req, res) => {
    res.json(require('../models/commons/media.json'));
})


routes.get('/catalogSearch/', (req, res) => {
    res.json(require('../models/commons/catalogSearch.json'));
})


routes.get('/getTimeSession/', (req, res) => {
    res.json({"time":1200});
})



routes.post('/genericPost/', (req, res) => {
    var newModel = {
        status: 1,   // 2
        message: [
            {
                "responseSystemCode":"KMPRE0000001",
                "responseMessage":"Exito",
                "responseType":"N",
                "responseCategory":"INFO"
            },
            {
                "responseSystemCode":"CAACBCDL0091",
                "responseMessage":"Contrato no corresponde a Cliente Único",
                "responseType":"N",
                "responseCategory":"FATAL"
            }
        ],
        result:{

        }
    };



    res.json( newModel );
})





module.exports = routes;

const routes = require('express').Router();

routes.get('/Asesores/PracticasVenta/:type/:employeeID', (req, res) => {
    setTimeout(function() {
        var file = 'respuestaPerfilesPorVencer';
        if(req.params.type === 'consultarContratosPerfilVencido'){
            file = 'respuestaPerfilesVencidos'
        }
        res.json(require('../../../models/advisers/binnacle/outline/' + file + '.json'));
    }, 150);
});

routes.get('/Asesores/PracticasVenta/getIpPventas', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/binnacle/outline/sells-practice-url.json'));
    }, 150);
});

module.exports = routes;
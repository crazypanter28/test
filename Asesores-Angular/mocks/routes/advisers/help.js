const routes = require('express').Router();



routes.get('/getQuestions/', (req, res) => {
    res.json(require('../../models/advisers/help/questions.json'));
});


routes.get('/getVideos/', (req, res) => {
    res.json(require('../../models/advisers/help/help.json'));
});






module.exports = routes;

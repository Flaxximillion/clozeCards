const express = require('express');
const router = express.Router();
const app = require('../app');
let bodyParser = require('body-parser');

let cards=["The game system NES stands for ______ .",
            "_______ are the most popular pets in the United States."];
let answers=["Nintendo Entertainment System","Cats"];

router.get('/answers/:id', function(req, res, next){
        res.json([answers[req.params.id], (cards.length - req.params.id - 1)]);
});

router.get('/questions/:id', function (req, res, next) {
        console.log(cards, answers);
        res.json(cards[req.params.id]);
});

router.post('/submit', function(req, res){
    cards.push(req.body.question.split('!').join(' _______ '));
    answers.push(req.body.answer);
    console.log(req.body);
});

module.exports = router;
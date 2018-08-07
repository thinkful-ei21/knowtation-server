'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const { Question } = require('../models/question');

/** import auth stuff **/
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { sessions: false, failWithError: true});

/** GET endpoint - should return only 1 question at random **/
router.get('/', jwtAuth, jsonParser, (req, res, next) => {
    return Question.findOne({})
        .then(questions => {
            return res.status(201).json(questions);
        })
        .catch(err => console.error(err));
});

/** POST endpoint - to submit a question **/
router.post('/submit', jwtAuth, jsonParser, (req, res, next) => {
    let { question, answer, hint, title, explanation } = req.body;
    return Question.create({question: encodeURI(question), answer, hint, title, explanation})
        .then(question => {
            return res.status(201).json(question.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: err});
        });
});

/** POST answer/result to an endpoint **/
router.post('/answer', jwtAuth, jsonParser, (req, res, next) => {
    let {answer} = req.body;

})

module.exports = { router };
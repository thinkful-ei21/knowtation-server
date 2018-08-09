'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const { Question } = require('../models/question');
const { User } = require('../models/user');
const { Result } = require('../models/result');

/** import auth stuff **/
const passport = require('passport');
router.use(passport.authenticate('jwt', { sessions: false, failWithError: true}));

/** GET endpoint - should return only 1 question **/
router.get('/', jsonParser, (req, res, next) => {
    let id = req.user.id;
    let user = User.findById(id).populate('questions.question')
        .then(user => user.questions[user.head])
        .then(data => res.json(data))
        .catch(err => console.err(err));
});

/** POST endpoint - to submit a question **/
router.post('/submit', jsonParser, (req, res, next) => {
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
router.post('/answer', jsonParser, (req, res, next) => {
    let {answer, question} = req.body;
    let {id} = req.user;
    let result;

    return User.findById(id)
            .then(user => )

    return Question.findById(question)
                    .then(question => {
                        result = question.answer === answer ? true : false;
                        Result.create({question, user: id, result});
                        return question;
                    }).then(question => {
                        if (result) {
                            return User.findById(id)
                                .then(user => {
                                    user.head = question.next;
                                    if (user.questions[user.questions.length - 1].next === null) {
                                        user.questions[user.questions.length - 1].next = question;
                                        question.next = null;
                                    }
                                    user.save();
                                })
                        }

        })
        .then(() => res.json(result))
                    .catch(err => console.error(err))
})

/*** HELPER METHODS **/
const removeFirstQuestion = id => {
    return User.findById({id})
        .then(user => {
            return user.
        })
}

module.exports = { router };
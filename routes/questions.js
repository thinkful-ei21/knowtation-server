'use strict';

const express = require('express');
const router = express.Router();
const { Question } = require('../models/question');
const { User } = require('../models/user');

/** import auth stuff **/
const passport = require('passport');
router.use(passport.authenticate('jwt', { sessions: false, failWithError: true}));

/** GET endpoint - should return only 1 question **/
router.get('/', (req, res, next) => {
    let id = req.user.id;
    return User.findById(id).populate('questions.question')
        .then(user => user.questions[user.head])
        .then(data => {
            console.log(data);
            const { question, numCorrect, numAttempts } = data;
            return res.json({ question, numCorrect, numAttempts });
        })
        .catch(err => console.log(err));
});

/** POST endpoint - to submit a question **/
router.post('/submit', (req, res, next) => {
    let { question, answer, hint, title } = req.body;
    return Question.create({question, answer, hint, title})
        .then(question => {
            return res.status(201).json(question);
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: err.message});
        });
});

/** POST answer/result to an endpoint **/
router.post('/answer', (req, res, next) => {
    let {answer} = req.body;
    let {id} = req.user;
    let response;
    console.log('branched answer stuff');
    User.findById(id)
        .then(user => {
            console.log(`we got the user ${user.username}`);
            let head = user.head;
            let current = user.questions[head];
            let next = current.next;

            if (answer === current.answer) {
                response = true;
                correctAnswerIncrements(current);
                let lastItem = findLast(user.questions, head);
                lastItem.next = head;
                user.head = next;
                current.next = null;
                console.log('response is supposed to be ' + response)

            } else {
                response = false;
                wrongAnswerIncrements(current);
                let previousHead = user.head;
                let previousHeadsNextValue = user.questions[previousHead].next;
                user.head = user.questions[previousHead].next;
                let newNextValueForNewHead = user.questions[previousHeadsNextValue].next;
                user.questions[previousHead].next = newNextValueForNewHead;
                user.questions[previousHeadsNextValue].next = previousHead;
            }
            console.log('should be about to save');
            user.save();

            return user.questions[user.head];
        })
        .then(question => {
            console.log('WE ARE EXPECTING A RESPONSE ' + response);
            const { answer, numCorrect, numAttempts } = question;
            return res.json({ response, answer, numCorrect, numAttempts });
        })
        .catch(err => console.error(err));

});

function findLast(list, head) {
    let item = list[head];
    while (item.next !== null) {
        item = list[item.next]
    }
    return item;
}

function correctAnswerIncrements(question) {
    question.numCorrect++;
    question.numAttempts++;
    question.mValue += 5;
}

function wrongAnswerIncrements(question) {
    question.numAttempts++;
    question.mValue = 1;
}

module.exports = { router };
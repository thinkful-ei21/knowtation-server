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
  User.findById(id)
    .then(user => user.questions[user.head])
    .then(data => {
      const { question, numCorrect, numAttempts } = data;
      return res.json({ question, numCorrect, numAttempts });
    })
    .catch(err => console.err(err));
});

/** POST endpoint - to submit a question **/
router.post('/submit', (req, res, next) => {
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
router.post('/answer', (req, res, next) => {
  let {answer} = req.body;
  let {id} = req.user;
  let response;

  User.findById(id)
    .then(user => {
      const currentQuestion = user.questions[user.head];
      const currentIndex = user.head;

      if (currentQuestion.answer === answer) {
        response = true;
        currentQuestion.numCorrect++;
        currentQuestion.numAttempts++;
        currentQuestion.mValue *= 2;
      } else {
        response = false;
        currentQuestion.numAttempts++;
        currentQuestion.mValue = 1;
      }

      user.head = currentQuestion.next;

      let insertAfter = currentQuestion;
      let temp = currentQuestion;

      for (let i = 0; i < currentQuestion.mValue; i++) {
        let index = temp.next;
        if (currentQuestion.mValue > user.questions.length) {
          currentQuestion.mValue = user.questions.length - 1;
          index = user.questions.length - 1;
        }
        insertAfter = user.questions[index];
        temp = user.questions[temp.next];
      }

      if (insertAfter === null) {
        currentQuestion.next = null;
      } else {
        currentQuestion.next = insertAfter.next;
      }

      insertAfter.next = currentIndex;

      user.save();

      return currentQuestion;
    })
    .then(question => {
      const { answer, numCorrect, numAttempts } = question;
      return res.json({ response, answer, numCorrect, numAttempts });
    })
    .catch(err => console.err(err));

});

module.exports = { router };
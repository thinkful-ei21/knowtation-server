'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Question = require('../models/question');

/** import auth stuff **/
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: true});

/*** simple get endpoint for querying info about all users. this will probably never be used ***/
router.get('/', jwtAuth, (req, res, next) => {
  return User.find()
    .populate('questions')
    .then(data =>{
      return res.status(201).json(data);
    })
    .catch(err => console.error(err));
});

/*** our post endpoint that will create a user ***/
router.post('/', (req, res, next) => {
  const requiredFields = ['username', 'password', 'firstName', 'lastName'];
  const missingField = requiredFields.find(field => !(field in req.body));

	console.log(req.body);

  if (missingField) {
    return res.status(422).json({
      code: 422, 
      reason: 'ValidationError', 
      message: 'Missing field',
      location: missingField
    });
  }

  let { username, password, firstName, lastName } = req.body;
  let userQuestions = [];

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
    })
    .then(() => {
      Question.find()
        .then(questions => {
          questions.forEach((question, index) => {
            let q = {
              question: question.question,
              answer: question.answer,
              next: index === questions.length - 1 ? null : index + 1,
              mValue: 1,
              numCorrect: 0,
              numAttempts: 0
            };
            userQuestions.push(q);
          });
        })
        .catch(err => console.error(err));
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        questions: userQuestions,
        firstName,
        lastName,
        username,
        password: hash
      });
    })
    .then(user => res.status(201).json(user))
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({ code: 500, message: err });
    });
});

/*** get user by ID ***/
router.get('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params;
  return User.findById({_id: id}).populate('questions.question')
    .then(user => res.status(201).json(user));
});


module.exports = { router };
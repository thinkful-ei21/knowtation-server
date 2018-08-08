'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const { Question } = require('../models/question');

/** import auth stuff **/
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: true});

/*** simple get endpoint for querying info about all users. this will probably never be used ***/
router.get('/', jwtAuth, jsonParser, (req, res, next) => {
	return User.find()
				.populate('questions')
				.then(data =>{
					return res.status(201).json(data);
				})
				.catch(err => console.error(err));
});

/*** our post endpoint that will server creating a user ***/
router.post('/', jsonParser, (req, res, next) => {
	const requiredFields = ['username', 'password', 'firstName', 'lastName'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422, 
			reason: 'ValidationError', 
			message: 'Missing field',
			location: missingField
		});
	}

	let { username, password, firstName, lastName } = req.body;

	return User.find({username})
				.count()
				.then(count => {
					if (count > 0) {
						return Promise.reject({
							code: 422, 
							reason: 'ValidationError', 
							'message': 'This username is already in use',
							'location': 'username'
						});
					}
					return User.hashPassword(password);
				})
				.then(hash => {
                    return Question.find()
									.then(questions =>

										User.create(
										{
											username,
											password: hash,
											firstName,
											lastName,
											questions: questions.map((question, index) => {
												return {
													question,
													memoryStrength: 0,
													next: index + 1 === questions.length ? null : index + 1
												}
										})
					}
					))
				})
				.then(user => {
					return res.status(201).json(user.serialize());
				})
				.catch(err => {
					if (err.name === 'ValidationError') {
						return res.status(500).json(err);
					}
					// console.log(err);
					res.status(500).json({code: 500, message: 'Internal server error'});
				});
});

/*** get user by ID ***/
router.get('/:id', jwtAuth, jsonParser, (req, res, next) => {
	const { id } = req.params;
	return User.findById({_id: id}).populate('questions.question')
				.then(user => res.status(201).json(user));
});

/*** update a user by grabbing their id ***/
router.put('/:id', jsonParser, (req, res, next) => {

});

module.exports = { router };
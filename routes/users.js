'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const { User } = require('../models/user');

/*** simple get endpoint for querying info about all users. this will probably never be used ***/
router.get('/', jsonParser, (req, res, next) => {
	return User.find({})
				.then(data =>{
					return res.status(201).json(data);
				})
				.catch(err => console.error(err));
});

/*** our post endpoint that will server creating a user ***/
router.post('/', jsonParser, (req, res, next) => {

});

/*** get user by ID ***/
router.get('/:id', jsonParser, (req, res, next) => {
	const { id } = req.body.id;
	//get the user by id via mongoose
});

/*** update a user by grabbing their id ***/
router.put('/:id', jsonParser, (req, res, next) => {

});

module.exports = { router };
'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

router.use(bodyParser.json());

const { User } = require('../models/user');

const createAuthToken = function(user) {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

const localAuth = passport.authenticate('local', {
	session: false,
	failWithError: true
});

const jwtAuth = passport.authenticate('jwt', {
	session: false,
	failWithError: true
});

router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	res.json({authToken});
})

router.post('/refresh', jwtAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	res.json({authToken});
})

module.exports = { router };
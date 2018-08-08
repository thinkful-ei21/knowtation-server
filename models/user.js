'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	questions: [ {
		memoryStrength: Number,
		next: Number,
		question: {type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'}
	} ],
	head: {
		type: Number,
		default: 0
	}
});

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

UserSchema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods.serialize = function() {
	return {
		id: this._id,
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName
	};
};

UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', UserSchema);

module.exports = { User };
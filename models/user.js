'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	email: { type: String, require: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true }

});

UserSchema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`;
})

UserSchema.methods.serialize = function() {
	return {
		id: this._id,
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName
	};
};

UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', UserSchema);

module.exports = { User };
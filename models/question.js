'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
	title: { type: String, required: true },
	question: { type: String, required: true },
	answer: { type: String, required: true },
	hint: { type: String },
	explanation: { type: String }
});

QuestionSchema.methods.serialize = function() {
	return {
		id: this._id,
		question: this.question,
		title: this.title,
		hint: this.hint,
		answer: this.answer,
		explanation: this.explanation
	}
};

QuestionSchema.set('toObject', { virtuals: true});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question };
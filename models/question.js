'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  hint: { type: String }
});

QuestionSchema.set('toObject', {
  virtuals: true,
  versionKey: false
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question };
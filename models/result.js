'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ResultSchema = mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    result: { type: Boolean, default: false }
});

ResultSchema.set('toObject', {virtuals: true});

const Result = mongoose.model('Result', ResultSchema);

module.exports = { Result };

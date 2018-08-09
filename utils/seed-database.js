'use strict';

const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');
const Question = require('../models/question');
const questions = require('../db/questions');

console.log(`Connecting to MLab at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Dropping database!');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.log('Seeding database!');
    return Question.insertMany(questions);
  })
  .then(() => {
    console.log('Disconnecting from database!');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.log(err);
    return mongoose.disconnect();
  });
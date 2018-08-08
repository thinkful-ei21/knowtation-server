'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const bodyParser = require('body-parser');

const { router: usersRouter } = require('./routes/users');
const { router: questionsRouter } = require('./routes/questions');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

/*** tell it to use the passport strategies ***/
passport.use(localStrategy);
passport.use(jwtStrategy);

/*** initialize our routes here ***/
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };

'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://user:password1@ds113942.mlab.com:13942/notation2',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://username:password1@ds117422.mlab.com:17422/knowtation-server',
  JWT_SECRET: process.env.JWT_SECRET || 'Olog5000',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '99m'
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};

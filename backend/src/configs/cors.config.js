require('dotenv').config();
const express = require('express');
const app = express();

const corsConfig = {
  origin:
    app.get('env') !== 'production'
      ? true
      : process.env.CORS_ORIGIN,

  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',

  allowedHeaders:
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization',

  credentials: true,

  exposedHeaders: 'Content-Range,X-Content-Range,Authorization',

  optionsSuccessStatus: 200,
};

module.exports = corsConfig;
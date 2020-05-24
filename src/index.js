const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config');

const app = express();
const routes = require('./routes/index');

// # Setup Middleware
app.use(
  cors({
    origin: config.server.origin,
    methods: ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  }),
);

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());


// Routes
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );
  next();
});

app.use('/api', routes);

// Not route found middleware
app.use((req, res, next) => {
  const message = 'Route not found';
  const statusCode = '404';

  next({
    message,
    statusCode,
  });
});

// Error middleware
app.use((err, req, res, next) => {
  const { message } = err;
  const { statusCode = '500' } = err;

  res.status(statusCode);
  res.json({
    error: true,
    message,
    statusCode,
  });
});

module.exports = app;

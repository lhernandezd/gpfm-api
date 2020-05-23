const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config');

const app = express();

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

app.get('/', (req, res) => res.send('Hello World!'));

module.exports = app;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Middlewares
app.use([
  process.env.NODE_ENV !== 'test' && morgan('combined'),
  cors({
    origin: (process.env.ALLOW_ORIGIN && JSON.parse(process.env.ALLOW_ORIGIN)) || '*'
  }),
  bodyParser.json(),
].filter(x => x));

// Routes
app.post('/register', require('./endpoints/register'));
app.post('/login', require('./endpoints/login'));
app.get('/data', require('./endpoints/data').get);
app.patch('/data', require('./endpoints/data').patch);

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { apiRouter } = require('./routers/api');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

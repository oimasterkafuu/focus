const express = require('express');
const bodyParser = require('body-parser');
const { apiRouter } = require('./routers/api');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('It works!');
});

app.use('/api/', apiRouter);

module.exports = app;

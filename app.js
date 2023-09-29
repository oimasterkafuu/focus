const express = require('express');
const bodyParser = require('body-parser');
const { apiRouter } = require('./routers/api');

const app = express();
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/api/', apiRouter);

module.exports = app;

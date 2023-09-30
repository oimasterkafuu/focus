const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { apiRouter } = require('./routers/api');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/alpha-version', (req, res) => {
    res.render('alpha');
});

app.use('/api/', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

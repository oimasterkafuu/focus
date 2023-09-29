const config = require('./config');
const port = config.port;

const app = require('./app');

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

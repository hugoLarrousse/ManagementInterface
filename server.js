const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').load({ path: '.env' });
require('./src/dataTest/cron').cron();
require('./src/dataTest/cron').cronRequestMetrics();
require('./src/dataTest/cron').cronRequestUptime();

const { createGraphQLRouter } = require('./src/graphql');

const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


app.use(createGraphQLRouter());

app.get('/test', async (req, res) => {
  res.status(200).json('OK');
});

app.all('/', async (req, res) => {
  res.status(200).json('Error router');
});

app.listen(port, () => {
  console.log(`Server Management is running on port ${port}`);
});

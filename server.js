const express = require('express');
const bodyParser = require('body-parser');
const cron = require('./src/dataTest/cron');
const initializeData = require('./src/graphql/utils/initialize');

const mongo = require('./src/db/mongo');

require('dotenv').load({ path: '.env' });

const { createGraphQLRouter } = require('./src/graphql');

const app = express();
const server = require('http').createServer(app);

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
  res.status(200).json({ error: true, message: 'Error router' });
});

mongo.createConnection().then((code) => {
  if (code) {
    server.listen(port, () => {
      const date = new Date();
      console.log(`Server Management is running at ${date} on ${port}`);
    });
    initializeData();
    cron.cron();
    cron.cronRequestUptime();
    cron.cronPisStatus();
    // cron.cronRequestMetrics();
    cron.cronRequestLocationPath();
  } else {
    console.log('Error with MongoDb connection');
  }
});

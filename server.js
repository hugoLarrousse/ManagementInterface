const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('/', async (req, res) => {
  res.status(200).json('OK');
});

app.listen(port, function (res) {
  console.log(`Server Management is running on port ${port}`);
});

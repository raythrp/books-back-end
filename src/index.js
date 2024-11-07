const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/books.js');
const app = express();

app.use(bodyParser.json())

app.use('/books', routes);

app.listen(9000, () => {
  console.log('App listening on port 9000!');
});
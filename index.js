const express = require('express');
const exphbs = require('express-handlebars');

const PUERTO = 8080;
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PUERTO);

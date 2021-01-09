require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const configureDependencyInjection = require('./config/di');
const { init: initializeClubModule } = require('./module/club/module');
const { init: initializeAreaModule } = require('./module/area/module');

const PUERTO = process.env.PORT || 8080;
const app = express();

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '/module/view/layout'),
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'module'));

const hbs = exphbs.create({});
hbs.handlebars.registerHelper('ifCond', (v1, v2, options) => {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

const container = configureDependencyInjection();
app.use(container.get('Session'));
initializeClubModule(app, container);
initializeAreaModule(app, container);

const clubController = container.get('ClubController');
app.get('/', clubController.index.bind(clubController));

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(500);
  res.render('view/layout/error', { error });
});

// eslint-disable-next-line no-console
app.listen(PUERTO, () => console.log(`Listening to http://localhost:${PUERTO}`));

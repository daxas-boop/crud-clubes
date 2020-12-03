require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const configureDependencyInjection = require('./config/di');
const { init: initializeClubModule } = require('./module/club/module');

const PUERTO = process.env.PORT || 8080;
const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '/module/view'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/module/club/views'));
app.use(express.static(`${__dirname}/public/img/`));
app.use(express.urlencoded({ extended: true }));

const container = configureDependencyInjection();
initializeClubModule(app, container);

const clubController = container.get('ClubController');
app.get('/', clubController.index.bind(clubController));

// eslint-disable-next-line no-console
app.listen(PUERTO, () => console.log(`Listening to http://localhost:${PUERTO}`));

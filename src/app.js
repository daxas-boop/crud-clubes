const express = require('express');
const { create } = require('express-handlebars');
const rutasEquipo = require('./rutas/equipo');
const rutasInicio = require('./rutas/inicio');

const app = express();
const hbs = create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', rutasInicio);
app.use('/equipo', rutasEquipo);

const PUERTO = 8080;
app.listen(PUERTO, () => {
  // eslint-disable-next-line no-console
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});

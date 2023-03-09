const express = require('express');
const { create } = require('express-handlebars');
const rutasEquipo = require('./rutas/equipo');
const { traerEquipos } = require('./servicios/equipos');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.get('/', (req, res) => {
  const equipos = traerEquipos();
  res.render('inicio', {
    equipos: equipos,
    cantidadEquipos: equipos.length,
  });
});

app.use('/equipo', rutasEquipo);

const PUERTO = 8080;
app.listen(PUERTO, () => {
  // eslint-disable-next-line no-console
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});

const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');

const PUERTO = 8080;
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

function getEquipos() {
  const rawData = fs.readFileSync('./data/equipos.json');
  return JSON.parse(rawData);
}

app.use(express.json());
app.use(express.text({ type: '*/*' }));

app.get('/', (req, res) => {
  const equipos = getEquipos();
  res.render('home', { equipos });
});

app.get('/equipo/:id/ver', (req, res) => {
  const equipos = getEquipos();
  const equipo = equipos.find((e) => e.id === Number(req.params.id));
  res.render('ver-equipo', { equipo });
});

app.get('/equipo/:id/editar', (req, res) => {
  const equipos = getEquipos();
  const equipo = equipos.find((e) => e.id === Number(req.params.id));
  res.render('editar-equipo', { equipo });
});

app.put('/equipo/:id/editar', (req, res) => {
  // TODO
});

app.listen(PUERTO);

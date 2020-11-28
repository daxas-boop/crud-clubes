const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const multer = require('multer');

const PUERTO = process.env.PORT || 8080;
const app = express();
const upload = multer({ dest: './uploads/logos' });

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/uploads`));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json());

function getEquipos() {
  const rawData = fs.readFileSync('./data/equipos.json');
  return JSON.parse(rawData);
}

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

app.post('/equipo/:id/editar', upload.single('logo'), (req, res) => {
  const equipos = getEquipos();
  const equipo = equipos.find((e) => e.id === Number(req.params.id));
  equipo.name = req.body.nombre;
  equipo.area.name = req.body.pais;
  equipo.lta = req.body.siglas;
  equipo.founded = req.body.fundado;
  equipo.clubColors = req.body.colores;
  equipo.address = req.body.direccion;
  if (req.file) {
    equipo.crestUrl = `/logos/${req.file.filename}`;
  }
  fs.writeFileSync('./data/equipos.json', JSON.stringify(equipos));
  res.render('editar-equipo', {
    data: {
      exito: true,
    },
  });
});

app.get('/crear-equipo', (req, res) => {
  res.render('crear-equipo');
});

app.post('/crear-equipo', upload.single('logo'), (req, res) => {
  // TODO
});

app.listen(PUERTO);

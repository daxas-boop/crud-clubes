const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { traerEquipo, traerEquipos } = require('../servicios/equipos');
const { mapearDatosFormularioAEquipo } = require('../mapeadores/equipos');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imagenes');
  },
});
const upload = multer({ storage: storage });

router.get('/:id/ver', (req, res) => {
  const equipo = traerEquipo(Number(req.params.id));
  const API_KEY = process.env.API_KEY;
  res.render('ver-equipo', { equipo, API_KEY });
});

router.get('/crear', (req, res) => {
  res.render('crear-equipo');
});

router.get('/:id/editar', (req, res) => {
  const equipo = traerEquipo(Number(req.params.id));
  res.render('editar-equipo', { equipo });
});

router.get('/:id/borrar', (req, res) => {
  const equipo = traerEquipo(Number(req.params.id));
  res.render('borrar-equipo', { name: equipo.name, id: equipo.id });
});

router.post('/crear', upload.single('crestUrl'), (req, res) => {
  const equipos = traerEquipos();
  const nuevoEquipo = mapearDatosFormularioAEquipo(req.body);
  nuevoEquipo.crestUrl = req.file.path.replace('public', '');
  nuevoEquipo.id = Date.now().valueOf();

  fs.writeFileSync(
    './data/equipos.json',
    JSON.stringify([...equipos, nuevoEquipo])
  );

  res.redirect(`/equipo/${nuevoEquipo.id}/ver`);
});

router.post('/:id/editar', upload.single('crestUrl'), (req, res) => {
  const equipos = traerEquipos();
  const nuevoEquipo = mapearDatosFormularioAEquipo(req.body);
  const indiceClub = equipos.findIndex(
    (equipo) => equipo.id === Number(req.params.id)
  );

  if (!indiceClub) {
    throw Error('Equipo no encontrado');
  }

  if (req.file) {
    const rutaImagen = req.file.path.replace('public', '');
    nuevoEquipo.crestUrl = rutaImagen;
  } else {
    nuevoEquipo.crestUrl = equipos[indiceClub].crestUrl;
  }

  equipos[indiceClub] = nuevoEquipo;

  fs.writeFileSync('./data/equipos.json', JSON.stringify(equipos));
  res.redirect(`/equipo/${nuevoEquipo.id}/ver`);
});

router.post('/:id/borrar', (req, res) => {
  const equipos = traerEquipos();
  const nuevosEquipos = equipos.filter(
    (equipo) => equipo.id !== Number(req.params.id)
  );
  fs.writeFileSync('./data/equipos.json', JSON.stringify(nuevosEquipos));
  res.redirect('/');
});

module.exports = router;

const express = require('express');
const { traerEquipo } = require('../servicios/equipos');

const router = express.Router();

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

module.exports = router;

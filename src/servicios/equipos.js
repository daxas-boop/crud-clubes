const fs = require('fs');
const Equipo = require('../entidades/Equipo');

function traerEquipos() {
  const equipos = JSON.parse(fs.readFileSync('./data/equipos.json'));
  if (!equipos) {
    throw Error('No hay equipos');
  }
  return equipos.map((equipo) => new Equipo(equipo));
}

function traerEquipo(id) {
  const equipos = JSON.parse(fs.readFileSync('./data/equipos.json'));
  const equipo = equipos.filter((equipo) => equipo.id === id)[0];
  if (!equipo) {
    throw Error('Equipo no encontrado');
  }
  return new Equipo(equipo);
}

module.exports = { traerEquipos, traerEquipo };

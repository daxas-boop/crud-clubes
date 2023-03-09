const Equipo = require('../entidades/Equipo');

function mapearDatosFormularioAEquipo({
  id,
  name,
  area,
  'short-name': shortName,
  tla,
  'crest-url': crestUrl,
  address,
  phone,
  website,
  email,
  founded,
  'club-colors': clubColors,
  venue,
}) {
  id = Number(id);
  return new Equipo({
    id,
    name,
    area: { name: area },
    shortName,
    tla,
    crestUrl,
    address,
    phone,
    website,
    email,
    founded,
    clubColors,
    venue,
  });
}

module.exports = { mapearDatosFormularioAEquipo };

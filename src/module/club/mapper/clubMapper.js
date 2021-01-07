const Club = require('../entity/club');
const AreaEntity = require('../../area/entity/area');

function fromModelToEntity({
  id,
  name,
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
  Area,
}, fromAreaModelToEntity) {
  return new Club({
    id,
    name,
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
    Area: fromAreaModelToEntity(Area),
  });
}

/**
 * @param {Object} formData
 * @returns Club
 */
function fromDataToEntity({
  id,
  name,
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
  'area-id': areaId,
}) {
  return new Club({
    id,
    name,
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
    Area: new AreaEntity({ id: areaId }),
  });
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};

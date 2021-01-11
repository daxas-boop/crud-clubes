const Area = require('../entity/area');

function fromModelToEntity({ id, location }) {
  return new Area({ id, location });
}

function fromDataToEntity({ id, location }) {
  return new Area({ id, location });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};

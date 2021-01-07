const AreaController = require('./controller/areaController');
const AreaService = require('./service/areaService');
const AreaRepository = require('./repository/areaRepository');
const AreaModel = require('./model/areaModel');

function init(app, container) {
  const controller = container.get('AreaController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  AreaController,
  AreaService,
  AreaRepository,
  AreaModel,
};

const ClubController = require('./controller/clubController');
const ClubRepository = require('./repository/sqlite/clubRepository');
const ClubService = require('./service/clubService');
const ClubModel = require('./model/clubModel');

/**
 * @param {import('express').Application} app
 * @param {DIContainer} container
 */

function init(app, container) {
  const controller = container.get('ClubController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  ClubController,
  ClubRepository,
  ClubService,
  ClubModel,
};

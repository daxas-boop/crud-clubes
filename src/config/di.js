const {
  default: DIContainer, object, get, factory,
} = require('rsdi');
const fs = require('fs');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const { ClubController, ClubService, ClubRepository } = require('../module/club/module');

function configureSession() {
  const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 604800000 },
  };

  return session(sessionConfig);
}

function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, process.env.CREST_UPLOAD_PATH);
    },
    filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage });
}

function configureUuid() {
  return uuid.v4;
}

function configureJSONDatabase() {
  return process.env.JSON_DB_PATH;
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinition(container) {
  container.addDefinitions({
    fs,
    session: factory(configureSession),
    uuid: factory(configureUuid),
    multer: factory(configureMulter),
    JSONDatabase: factory(configureJSONDatabase),
  });
}

/**
 * @param {DIContainer} container
 */
function addClubModuleDefinitions(container) {
  container.addDefinitions({
    ClubController: object(ClubController).construct(get('ClubService'), get('multer')),
    ClubService: object(ClubService).construct(get('ClubRepository')),
    ClubRepository: object(ClubRepository).construct(get('fs'), get('JSONDatabase'), get('uuid')),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinition(container);
  addClubModuleDefinitions(container);
  return container;
};

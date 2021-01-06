const { Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const {
  default: DIContainer, object, get, factory,
} = require('rsdi');
const {
  ClubController, ClubService, ClubRepository, ClubModel,
} = require('../module/club/module');

function configureClubModel(container) {
  return ClubModel.setup(container.get('Sequelize'));
}

function configureSequelize() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
  });
}

function configureSequelizeSession() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_SESSION_PATH,
  });
}

function configureSession(container) {
  const sequelize = container.get('SequelizeSession');
  const sessionConfig = {
    store: new SequelizeStore({ db: sequelize }),
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

/**
 * @param {DIContainer} container
 */
function addCommonDefinition(container) {
  container.addDefinitions({
    Session: factory(configureSession),
    Multer: factory(configureMulter),
    Sequelize: factory(configureSequelize),
    SequelizeSession: factory(configureSequelizeSession),
  });
}

/**
 * @param {DIContainer} container
 */
function addClubModuleDefinitions(container) {
  container.addDefinitions({
    ClubController: object(ClubController).construct(get('ClubService'), get('Multer')),
    ClubService: object(ClubService).construct(get('ClubRepository')),
    ClubRepository: object(ClubRepository).construct(get('ClubModel')),
    ClubModel: factory(configureClubModel),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinition(container);
  addClubModuleDefinitions(container);
  return container;
};

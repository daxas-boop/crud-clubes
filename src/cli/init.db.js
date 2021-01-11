require('dotenv').config();
const express = require('express');
const configureDependencyInjection = require('../config/di');

const app = express();
const container = configureDependencyInjection(app);
app.use(container.get('Session'));

const mainDb = container.get('Sequelize');
container.get('ClubModel');
container.get('AreaModel');
mainDb.sync();

const sessionDb = container.get('SequelizeSession');
container.get('Session');
sessionDb.sync();

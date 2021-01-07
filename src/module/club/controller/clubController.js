/* eslint-disable class-methods-use-this */
const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/clubMapper');

module.exports = class ClubController extends AbstractController {
  /**
   * @param {import('../service/clubService')} clubService
   */
  constructor(clubService, upploadMiddleware, areaService) {
    super();
    this.ROUTE_BASE = '/clubs';
    this.clubService = clubService;
    this.upploadMiddleware = upploadMiddleware;
    this.areaService = areaService;
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:id`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.get(`${ROUTE}/create`, this.create.bind(this));
    app.post(`${ROUTE}/save`, this.upploadMiddleware.single('crest-url'), this.save.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const clubs = await this.clubService.getAll();
    const { messages, errors } = req.session;
    res.render('club/views/index', { clubs, messages, errors });
    req.session.messages = [];
    req.session.errors = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async view(req, res) {
    try {
      const { id } = req.params;
      const club = await this.clubService.getById(id);
      res.render('club/views/view', { club });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/clubs');
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    try {
      const { id } = req.params;
      const areas = await this.areaService.getAll();
      const club = await this.clubService.getById(id);
      res.render('club/views/form', { club, areas });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/clubs');
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const club = await this.clubService.getById(id);
      await this.clubService.delete(club);
      req.session.messages = [`El club con id ${club.id} (${club.name}) se eliminó correctamente.`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect('/clubs');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const club = fromDataToEntity(req.body);
      if (req.file) {
        const { path } = req.file;
        club.crestUrl = path;
      }
      const savedClub = await this.clubService.save(club);

      if (club.id) {
        req.session.messages = [`El club con id ${club.id} y nombre ${club.name} se actualizo con exito.`];
      } else {
        req.session.messages = [`El club con id ${savedClub.id} y nombre ${savedClub.name} se creo con exito.`];
      }

      res.redirect('/clubs');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/clubs');
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const areas = await this.areaService.getAll();

    if (areas.length > 0) {
      res.render('club/views/form', { areas });
    } else {
      req.session.errors = ['Necesitas por lo menos 1 area para crear un equipo'];
      res.redirect('/clubs');
    }
  }
};

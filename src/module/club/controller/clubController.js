const AbstractController = require('../../abstractController');
const AreasNotFoundError = require('./error/areasNotFoundError');
const { fromDataToEntity } = require('../mapper/clubMapper');

module.exports = class ClubController extends AbstractController {
  /**
   * @param {import('../service/clubService')} clubService
   * @param {import('multer').Multer} uploadMiddleware
   * @param {import('../../area/service/areaService')} areaService
   */
  constructor(clubService, uploadMiddleware, areaService) {
    super();
    this.ROUTE_BASE = '/clubs';
    this.clubService = clubService;
    this.uploadMiddleware = uploadMiddleware;
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
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('crest-url'), this.save.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const clubs = await this.clubService.getAll();
    const { messages } = req.session;
    res.render('club/views/index', { clubs, messages });
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async view(req, res, next) {
    try {
      const { id } = req.params;
      const club = await this.clubService.getById(id);
      res.render('club/views/view', { club });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const areas = await this.areaService.getAll();
      const club = await this.clubService.getById(id);
      res.render('club/views/form', { club, areas });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const club = await this.clubService.getById(id);
      await this.clubService.delete(club);
      req.session.messages = [`El club con id ${club.id} (${club.name}) se eliminó correctamente.`];
      res.redirect('/clubs');
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async save(req, res, next) {
    try {
      const club = fromDataToEntity(req.body);
      if (req.file) {
        const { path } = req.file;
        club.crestUrl = path;
      }
      const savedClub = await this.clubService.save(club);
      if (club.id) {
        req.session.messages = [`El club con id ${club.id} (${club.name}) se actualizo con exito.`];
      } else {
        req.session.messages = [`El club con id ${savedClub.id} (${savedClub.name}) se creo con exito.`];
      }
      res.redirect('/clubs');
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async create(req, res, next) {
    try {
      const areas = await this.areaService.getAll();
      if (areas.length === 0) {
        throw new AreasNotFoundError('Necesitas al menos 1 area para crear un club');
      }
      res.render('club/views/form', { areas });
    } catch (e) {
      next(e);
    }
  }
};

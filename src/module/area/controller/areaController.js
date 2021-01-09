const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/areaMapper');

module.exports = class AreaController extends AbstractController {
  constructor(areaService) {
    super();
    this.ROUTE_BASE = '/areas';
    this.areaService = areaService;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/create`, this.create.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const areas = await this.areaService.getAll();
    const { messages } = req.session;
    res.render('area/views/index', { areas, messages });
    req.session.messages = [];
  }

  // eslint-disable-next-line class-methods-use-this
  create(req, res) {
    res.render('area/views/form');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const area = await this.areaService.getById(id);
      res.render('area/views/form', { area });
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
      const area = await this.areaService.getById(id);
      await this.areaService.delete(area);
      req.session.messages = [`Se elimino el area con ID:${area.id}`];
      res.redirect('/areas');
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
      const area = fromDataToEntity(req.body);
      const savedArea = await this.areaService.save(area);
      if (area.id) {
        req.session.messages = [`Se actualizó el area con ID:${area.id} (${area.location})`];
      } else {
        req.session.messages = [`Se creó un area con ID:${savedArea.id} (${savedArea.location})`];
      }
      res.redirect('/areas');
    } catch (e) {
      next(e);
    }
  }
};

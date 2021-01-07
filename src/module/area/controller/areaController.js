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
    const { errors, messages } = req.session;
    res.render('area/views/index', { areas, messages, errors });
    req.session.messages = [];
    req.session.errors = [];
  }

  // eslint-disable-next-line class-methods-use-this
  create(req, res) {
    res.render('area/views/form');
  }

  async edit(req, res) {
    try {
      const { id } = req.params;
      const area = await this.areaService.getById(id);
      res.render('area/views/form', { area });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const area = await this.areaService.getById(id);
      await this.areaService.delete(area);
      req.session.messages = [`Se elimino el area con ID:${area.id}`];
      res.redirect('/areas');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/areas');
    }
  }

  async save(req, res) {
    try {
      const area = fromDataToEntity(req.body);
      const savedArea = await this.areaService.save(area);
      if (area.id) {
        req.session.messages = [`Se actualizó el area con ID:${savedArea.id} y Locación: ${savedArea.location}`];
      } else {
        req.session.messages = [`Se creó un area con ID:${area.id} y Locación: ${savedArea.location}`];
      }
      res.redirect('/areas');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/areas');
    }
  }
};

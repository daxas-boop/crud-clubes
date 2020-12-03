const AbstractController = require('../../abstractController');

module.exports = class ClubController extends AbstractController {
  /**
   * @param {import('../service/clubService')} clubService
   */
  constructor(clubService, upploadMiddleware) {
    super();
    this.ROUTE_BASE = '/club';
    this.clubService = clubService;
    this.upploadMiddleware = upploadMiddleware;
  }

  /**
   * @param {import('express') Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
  }

  /**
   * @param {import('express'.Response)} res
   */
  async index(req, res) {
    const clubs = await this.clubService.getAll();
    res.render('index', { clubs });
  }
};

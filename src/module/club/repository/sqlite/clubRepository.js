const AbstractClubRepository = require('../abstractClubRepository');
const ClubNotFoundError = require('../error/clubNotFoundError');
const ClubIdNotDefinedError = require('../error/clubIdNotDefinedError');
const { fromModelToEntity } = require('../../mapper/clubMapper');

module.exports = class ClubRepository extends AbstractClubRepository {
  constructor(ClubModel) {
    super();
    this.ClubModel = ClubModel;
  }

  /**
   * @param {String} id
   * @returns {import('../../entity/club')}
   */
  async getById(id) {
    const club = await this.ClubModel.findByPk(id);

    if (!club) {
      throw new ClubNotFoundError(`No se encontró el club con ID: ${id}`);
    }

    return fromModelToEntity(club);
  }

  /**
   *
   * @param {import('../../entity/club')} club
   * @returns {import('../../entity/club')}
   */
  async save(club) {
    const savedClub = await this.ClubModel.build(club, { isNewRecord: !club.id }).save();
    return fromModelToEntity(savedClub);
  }

  /**
   * @returns {Array<import('../../entity/club')>}
   */
  async getAll() {
    const clubs = await this.ClubModel.findAll();
    return clubs.map((clubData) => fromModelToEntity(clubData));
  }

  /**
   * @param {import('../../entity/club')} club
   * @returns {Boolean}
   */
  async delete(club) {
    if (!club || !club.id) {
      throw new ClubIdNotDefinedError('El ID del club no se encontró');
    }

    return Boolean(await this.ClubModel.destroy({ where: { id: club.id } }));
  }
};

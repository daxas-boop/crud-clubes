const AbstractClubRepository = require('../abstractClubRepository');
const ClubNotFoundError = require('../error/clubNotFoundError');
const ClubIdNotDefinedError = require('../error/clubIdNotDefinedError');
const { fromModelToEntity } = require('../../mapper/clubMapper');
const { fromModelToEntity: fromAreaModelToEntity } = require('../../../area/mapper/areaMapper');

module.exports = class ClubRepository extends AbstractClubRepository {
  constructor(clubModel, areaModel) {
    super();
    this.clubModel = clubModel;
    this.areaModel = areaModel;
  }

  /**
   * @param {String} id
   * @returns {import('../../entity/club')}
   */
  async getById(id) {
    const club = await this.clubModel.findByPk(id, {
      include: [
        { model: this.areaModel, paranoid: false },
      ],
    });

    if (!club) {
      throw new ClubNotFoundError(`No se encontró el club con ID: ${id}`);
    }

    return fromModelToEntity(club, fromAreaModelToEntity);
  }

  /**
   *
   * @param {import('../../entity/club')} club
   * @returns {import('../../entity/club')}
   */
  async save(club) {
    let savedClub;
    savedClub = this.clubModel.build(club, { isNewRecord: !club.id, include: this.areaModel });
    savedClub.setDataValue('area_id', club.Area.id);
    savedClub = await savedClub.save();

    return fromModelToEntity(savedClub, fromAreaModelToEntity);
  }

  /**
   * @returns {Array<import('../../entity/club')>}
   */
  async getAll() {
    const clubs = await this.clubModel.findAll({
      include: [
        { model: this.areaModel, paranoid: false },
      ],
    });
    return clubs.map((clubData) => fromModelToEntity(clubData, fromAreaModelToEntity));
  }

  /**
   * @param {import('../../entity/club')} club
   * @returns {Boolean}
   */
  async delete(club) {
    if (!club || !club.id) {
      throw new ClubIdNotDefinedError('El ID del club no se encontró');
    }

    return Boolean(await this.clubModel.destroy({ where: { id: club.id } }));
  }
};

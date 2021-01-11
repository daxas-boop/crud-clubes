const ClubIdNotDefinedError = require('./error/clubIdNotDefinedError');
const ClubNotDefinedError = require('./error/clubNotDefinedError');
const Club = require('../entity/club');

module.exports = class ClubService {
  /**
   * @param {import('../repository/abstractClubRepository')} clubRepository
   */
  constructor(clubRepository) {
    this.clubRepository = clubRepository;
  }

  async getAll() {
    return this.clubRepository.getAll();
  }

  /**
   * @param {String} id
   */
  async getById(id) {
    if (id === undefined) {
      throw new ClubIdNotDefinedError();
    }
    return this.clubRepository.getById(id);
  }

  /**
   * @param {Club} club
   */
  async save(club) {
    if (club === undefined) {
      throw new ClubNotDefinedError();
    }
    return this.clubRepository.save(club);
  }

  /**
   * @param {Club} club
   */
  async delete(club) {
    if (!(club instanceof Club)) {
      throw new ClubNotDefinedError();
    }
    return this.clubRepository.delete(club);
  }
};

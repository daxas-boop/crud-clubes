const AbstractClubRepository = require('./abstractClubRepository');
const Club = require('../entity/club');

module.exports = class ClubRepository extends AbstractClubRepository {
  /**
   * @param {import('fs')} fileSystem
   * @param {String} dbPath
   * @param {import('uuid/v4')} uuid
   */
  constructor(fileSystem, dbPath, uuid) {
    super();
    this.fileSystem = fileSystem;
    this.dbPath = dbPath;
    this.uuid = uuid;
  }

  async getAll() {
    return this.getData().map((club) => new Club(club));
  }

  getData() {
    const clubs = this.fileSystem.readFileSync(this.dbPath, { encoding: 'utf-8' });
    let JSONClubs;
    try {
      JSONClubs = JSON.parse(clubs);
    } catch (e) {
      JSONClubs = [];
    }

    return JSONClubs;
  }
};

const AbstractClubRepository = require('./abstractClubRepository');
const ClubNotFoundError = require('./error/clubNotFoundError');
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

  /**
   * @param {String} id
   */
  async getById(id) {
    const clubs = this.getData();
    const club = clubs.find((tmpClub) => tmpClub.id === id);
    if (!club) {
      throw new ClubNotFoundError('Club not found');
    }
    return new Club(club);
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

  async save(club) {
    const clubs = this.getData();
    let clubToSave;
    if (club.id) {
      const clubIndex = clubs.findIndex((tmpClub) => tmpClub.id === club.id);
      if (clubIndex === -1) {
        throw new ClubNotFoundError(`El club con el id ${club.id} no se encontró`);
      }
      const oldClub = clubs[clubIndex];
      clubs[clubIndex] = club;
      clubToSave = club;

      if (!club.crestUrl) {
        clubs[clubIndex].crestUrl = oldClub.crestUrl;
      }
    } else {
      clubToSave = { ...club, ...{ id: this.uuid() } };
      clubs.push(clubToSave);
    }
    this.saveData(clubs);
    return clubToSave;
  }

  /**
   * @param {Club} club
   */
  delete(club) {
    const clubs = this.getData();
    const clubIndex = clubs.findIndex((tmpClub) => tmpClub.id === club.id);
    if (clubIndex === -1) {
      throw new ClubNotFoundError(`El club con id ${club.id} no se encontró.`);
    }
    clubs.splice(clubIndex, 1);
    this.saveData(clubs);
  }

  saveData(content) {
    this.fileSystem.writeFileSync(this.dbPath, JSON.stringify(content));
  }
};

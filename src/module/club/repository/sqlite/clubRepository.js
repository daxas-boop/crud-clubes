const AbstractClubRepository = require('../abstractClubRepository');
const ClubNotFoundError = require('../error/clubNotFoundError');
const ClubIdNotDefinedError = require('../error/clubIdNotDefinedError');
const { fromDbToEntity } = require('../../mapper/clubMapper');

module.exports = class ClubRepository extends AbstractClubRepository {
  /**
   * @param {import('better-sqlite').Database} databaseAdapter
   */
  constructor(databaseAdapter) {
    super();
    this.databaseAdapter = databaseAdapter;
  }

  /**
   * @param {String} id
   * @returns {import('../../entity/club')}
   */
  async getById(id) {
    const club = this.databaseAdapter.prepare(`
      SELECT
      id,
      name,
      short_name,
      tla,
      crest_url,
      address,
      phone,
      website,
      email,
      founded,
      club_colors,
      venue
      FROM clubs
      WHERE id = ?
    `).get(id);

    if (!club) {
      throw new ClubNotFoundError(`No se encontró el club con ID: ${id}`);
    }

    return fromDbToEntity(club);
  }

  /**
   *
   * @param {import('../../entity/club')} club
   * @returns {import('../../entity/club')}
   */
  async save(club) {
    let id;
    if (club.id) {
      id = club.id;
      const statement = this.databaseAdapter.prepare(`
      UPDATE clubs SET
        ${club.crestUrl ? 'crest_url = ?,' : ''}
        name = ?,
        short_name = ?,
        tla = ?,
        address = ?,
        phone = ?,
        website = ?,
        email = ?,
        founded = ?,
        club_colors = ?,
        venue = ?
        WHERE id = ?
      `);

      const params = [
        club.name,
        club.shortName,
        club.tla,
        club.address,
        club.phone,
        club.website,
        club.email,
        club.founded,
        club.clubColors,
        club.venue,
        club.id,
      ];

      if (club.crestUrl) {
        params.unshift(club.crestUrl);
      }

      statement.run(params);
    } else {
      const statement = this.databaseAdapter.prepare(`
        INSERT INTO clubs(
          name,
          short_name,
          tla,
          crest_url,
          address,
          phone,
          website,
          email,
          founded,
          club_colors,
          venue
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = statement.run(
        club.name,
        club.shortName,
        club.tla,
        club.crestUrl,
        club.address,
        club.phone,
        club.website,
        club.email,
        club.founded,
        club.clubColors,
        club.venue,
      );

      id = result.lastInsertRowid;
    }
    return this.getById(id);
  }

  /**
   * @returns {Array<import('../../entity/club')>}
   */
  async getAll() {
    const clubs = this.databaseAdapter.prepare(`
    SELECT 
      id,
      name,
      short_name,
      tla,
      crest_url,
      address,
      phone,
      website,
      email,
      founded,
      club_colors,
      venue
      FROM clubs
    `).all();

    return clubs.map((clubData) => fromDbToEntity(clubData));
  }

  /**
   * @param {import('../../entity/club')} club
   * @returns {Boolean}
   */
  delete(club) {
    if (!club || !club.id) {
      throw new ClubIdNotDefinedError('El ID del club no se encontró');
    }

    this.databaseAdapter.prepare('DELETE FROM clubs WHERE id = ?').run(club.id);

    return true;
  }
};

/* eslint-disable class-methods-use-this */
const AbstractClubRepositoryError = require('./error/abstractClubRepositoryError');

module.exports = class AbstractClubRepository {
  constructor() {
    if (new.target === AbstractClubRepository) {
      throw new AbstractClubRepositoryError();
    }
  }

  getAll() {}

  getById() {}

  getData() {}

  save() {}

  delete() {}
};

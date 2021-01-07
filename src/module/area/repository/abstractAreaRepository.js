const AbstractAreaRepositoryError = require('./error/abstractAreaRepositoryError');

module.exports = class AbstractAreaRepository {
  constructor() {
    if (new.target === AbstractAreaRepository) {
      throw new AbstractAreaRepositoryError();
    }
  }
};

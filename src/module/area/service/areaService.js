const Area = require('../entity/area');
const AreaNotDefinedError = require('./error/areaNotDefinedError');
const AreaIdNotDefinedError = require('./error/areaIdNotDefinedError');

module.exports = class AreaService {
  constructor(areaRepository) {
    this.areaRepository = areaRepository;
  }

  getAll() {
    return this.areaRepository.getAll();
  }

  getById(id) {
    if (!id) {
      throw new AreaIdNotDefinedError();
    }
    return this.areaRepository.getById(id);
  }

  save(area) {
    if (!(area instanceof Area)) {
      throw AreaNotDefinedError();
    }
    return this.areaRepository.save(area);
  }

  delete(area) {
    if (!(area instanceof Area)) {
      throw AreaNotDefinedError();
    }
    return this.areaRepository.delete(area);
  }
};
